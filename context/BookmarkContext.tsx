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
      visibility: string;
      coverImage: string;
      author: string;
      publishedAge: string;
      isSaved: boolean;
      createdAt: string;
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
            coverImage:
                  row.cover_image ?? `${COVER_FALLBACK}${encodeURIComponent(row.title ?? "Bookmark")}`,
            author: row.profiles?.user_name ?? "Curated Mind",
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
      const { user, profile } = useAuth();

      const [bookmarks, setBookmarks] = useState<UIBookmark[]>([]);
      const [publicBookmarks, setPublicBookmarks] = useState<UIBookmark[]>([]);
      const [isLoading, setIsLoading] = useState(false);

      // ─── fetchPublic ─────────────────────────────

      const fetchPublic = useCallback(async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*, profiles(user_name)")
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
            if (!profile?.id) return;

            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*, profiles(user_name)")
                  .eq("user_id", profile.id)
                  .order("created_at", { ascending: false });

            if (error) {
                  console.error("[BookmarksContext] refresh error:", error);
                  toast.error("Failed to load bookmarks.");
            } else {
                  const updated = (data ?? []).map(toUI);
                  setBookmarks(updated);
            }
            setIsLoading(false);
      }, [profile?.id, supabase]);

      // ─── useEffect ───────────────────────────────

      useEffect(() => {
            if (profile?.id) {
                  refresh();
            } else {
                  setBookmarks([]);
            }
            fetchPublic();
      }, [profile?.id, fetchPublic, refresh]);

      // ─── addBookmark ─────────────────────────────

      const addBookmark = async (bm: Omit<UIBookmark, "id" | "createdAt">) => {
            if (!user || !profile?.id) {
                  toast.error("You must be signed in to add bookmarks.");
                  return;
            }

            const normalizedUrl = normalizeUrl(bm.url);

            const { data, error } = await supabase
                  .from("bookmarks")
                  .insert([
                        {
                              user_id: profile.id,
                              title: bm.title,
                              url: normalizedUrl,
                              category: bm.category,
                              description: bm.description || null,
                              visibility: bm.visibility ?? "private",
                        },
                  ])
                  .select("*, profiles(user_name)")
                  .single();

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
                        description: patch.description ?? null,
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

export function useBookmarks() {
      const ctx = useContext(BookmarksContext);
      if (!ctx) throw new Error("useBookmarks must be used inside <BookmarksProvider>");
      return ctx;
}