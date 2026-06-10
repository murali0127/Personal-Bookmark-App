

"use client";

import {
      createContext,
      useContext,
      useState,
      useEffect,
      useCallback,
      type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UIBookmark {
      id: string;
      title: string;
      url: string;
      description: string;
      category: string;
      visibility: string | 'private';
      bookmark_image_url: string | '';
      publishedAge: string;
      isSaved: boolean;
      createdAt: string;
      author_name: string;
}

interface BookmarksContextType {
      bookmarks: UIBookmark[];
      publicBookmarks: UIBookmark[];
      isLoading: boolean;
      addBookmark: (bm: Omit<UIBookmark, "id" | "createdAt">) => Promise<void>;
      updateBookmark: (id: string, patch: Partial<UIBookmark>) => Promise<void>;
      deleteBookmark: (id: string) => Promise<void>;
      refresh: () => Promise<void>;
      fetchPublic: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const COVER_FALLBACK = `https://placehold.co/600x400/EEE/31343C?font=raleway&text=`;

/**
 * Ensures a URL has https:// prefix to satisfy the DB check constraint
 * `url ~ '^https?://'`
 */
function normalizeUrl(raw: string): string {
      const trimmed = raw.trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
}

function toUI(row: any): UIBookmark {
      return {
            id: row.id,
            title: row.title ?? "Untitled",
            url: row.url,
            description: row.description ?? "",
            category: row.category ?? "General",
            visibility: row.visibility ?? "private",
            bookmark_image_url:
                  row.cover_image ?? `${COVER_FALLBACK}${encodeURIComponent(row.title ?? "Bookmark")}`,
            author_name: row.author_name ?? "Curated Mind",
            publishedAge: "Recently",
            isSaved: true,
            createdAt: row.created_at,
      };
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function BookmarksProvider({ children }: { children: ReactNode }) {
      const supabase = createClient();

      // ✅ FIX 1: Pull profile from AuthContext.
      //    profile.id  = profiles table PK  (what bookmarks.user_id references)
      //    user.id     = auth UUID           (NOT what bookmarks.user_id references)
      const { user, profile } = useAuth();

      const [bookmarks, setBookmarks] = useState<UIBookmark[]>([]);
      const [publicBookmarks, setPublicBookmarks] = useState<UIBookmark[]>([]);
      const [isLoading, setIsLoading] = useState(false);

      // ─── fetchPublic ─────────────────────────────

      const fetchPublic = useCallback(async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*")
                  .eq("visibility", "public")
                  .order("created_at", { ascending: false })
                  .limit(12);

            if (error) {
                  console.error("[BookmarksContext] fetchPublic error:", error);
            } else {
                  setPublicBookmarks((data ?? []).map(toUI));
            }
            setIsLoading(false);
      }, [supabase]);

      // ─── refresh (owner's bookmarks) ─────────────

      const refresh = useCallback(async () => {
            // ✅ FIX 1: Guard on profile.id — the actual FK used in bookmarks.user_id
            if (!profile?.id) return;

            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*")
                  // ✅ FIX 1: profile.id ("f51ee34d-...") not user.id ("dc04e3fd-...")
                  .eq("user_id", profile.id)
                  .order("created_at", { ascending: false });

            if (error) {
                  console.error("[BookmarksContext] refresh error:", error);
                  toast.error("Failed to load bookmarks.");
            } else {
                  // ✅ FIX 4: Use the updated value from `data`, not the stale `bookmarks` state
                  const updated = (data ?? []).map(toUI);
                  setBookmarks(updated);
            }
            setIsLoading(false);
      }, [profile?.id, supabase]); // ✅ FIX 3: depend on profile.id, not user.id

      // ─── useEffect ───────────────────────────────

      useEffect(() => {
            // ✅ FIX 3: Trigger when profile.id is available (profile loads async after user).
            //    If we depended on user?.id alone, profile would still be null on first run
            //    and refresh() would silently no-op.
            if (profile?.id) {
                  refresh();
            } else {
                  setBookmarks([]);
            }
            fetchPublic();
      }, [profile?.id, fetchPublic, refresh]);

      // ─── addBookmark ─────────────────────────────

      const addBookmark = async (bm: Omit<UIBookmark, "id" | "createdAt">) => {
            // ✅ FIX 1 + FIX 2: Guard on profile, use profile.id for insert
            if (!user || !profile?.id) {
                  toast.error("You must be signed in to add bookmarks.");
                  return;
            }

            // ✅ FIX 5: Normalize URL to satisfy the DB check constraint `url ~ '^https?://'`
            const normalizedUrl = normalizeUrl(bm.url);

            const { data, error } = await supabase
                  .from("bookmarks")
                  .insert([
                        {
                              // ✅ FIX 1: Use auth_user_id from Supabase auth (not profile.id)
                              auth_user_id: user.id,
                              title: bm.title,
                              url: normalizedUrl,
                              category: bm.category || "General",
                              description: bm.description || "",
                              author_name: bm.author_name || "",
                              visibility: bm.visibility ?? "private",
                        },
                  ])
                  .select()
                  .single();

            // ✅ FIX 2: Surface errors instead of swallowing them
            if (error) {
                  console.error("[BookmarksContext] addBookmark error:", error);
                  toast.error(`Failed to add bookmark: ${error.message}`);
                  return;
            }

            if (data) {
                  const newBm = toUI(data);
                  setBookmarks((prev) => [newBm, ...prev]);
                  if (newBm.visibility === "public") {
                        setPublicBookmarks((prev) => [newBm, ...prev.slice(0, 11)]);
                  }
                  toast.success("Bookmark added!");
            }
      };

      // ─── updateBookmark ───────────────────────────

      const updateBookmark = async (id: string, patch: Partial<UIBookmark>) => {
            const { error } = await supabase
                  .from("bookmarks")
                  .update({
                        title: patch.title,
                        visibility: patch.visibility,
                        description: patch.description ?? "",
                  })
                  .eq("id", id);

            if (error) {
                  console.error("[BookmarksContext] updateBookmark error:", error);
                  toast.error("Failed to update bookmark.");
                  return;
            }

            setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
            setPublicBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
            toast.success("Bookmark updated.");
      };

      // ─── deleteBookmark ───────────────────────────

      const deleteBookmark = async (id: string) => {
            const { error } = await supabase.from("bookmarks").delete().eq("id", id);

            if (error) {
                  console.error("[BookmarksContext] deleteBookmark error:", error);
                  toast.error("Failed to delete bookmark.");
                  return;
            }

            setBookmarks((prev) => prev.filter((b) => b.id !== id));
            setPublicBookmarks((prev) => prev.filter((b) => b.id !== id));
            toast.success("Bookmark deleted.");
      };

      // ─── Context value ────────────────────────────

      return (
            <BookmarksContext.Provider
                  value={{
                        bookmarks,
                        publicBookmarks,
                        isLoading,
                        addBookmark,
                        updateBookmark,
                        deleteBookmark,
                        refresh,
                        fetchPublic,
                  }}
            >
                  {children}
            </BookmarksContext.Provider>
      );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useBookmarks() {
      const ctx = useContext(BookmarksContext);
      if (!ctx) throw new Error("useBookmarks must be used inside <BookmarksProvider>");
      return ctx;
}