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
import { useAuth } from './AuthContext';

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

const BookmarksContext = createContext<BookmarksContextType | undefined>(
      undefined
);

const COVER_FALLBACK = [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
]

const randomImage = (
      images: string[]
): string => {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
}

function toUI(row: any): UIBookmark {
      return {
            id: row.id,
            title: row.title ?? "Untitled",
            url: row.url,
            description: row.description ?? "",
            category: row.category ?? "Tech",
            visibility: row.visibility ?? "private",
            coverImage: row.cover_image ?? randomImage(COVER_FALLBACK),
            author: row.author ?? "Curated Mind",
            publishedAge: "Recently",
            isSaved: true,
            createdAt: row.created_at,
      };
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
      const supabase = createClient();
      const { user, profile } = useAuth();


      const [bookmarks, setBookmarks] = useState<UIBookmark[]>([]);
      const [publicBookmarks, setPublicBookmarks] = useState<UIBookmark[]>([]);
      const [isLoading, setIsLoading] = useState(false);

      const fetchPublic = useCallback(async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*")
                  .eq("visibility", "public")
                  .order("created_at", { ascending: false })
                  .limit(12);

            if (!error) setPublicBookmarks((data ?? []).map(toUI));
            setIsLoading(false);
      }, [supabase]);

      const refresh = useCallback(async () => {
            if (!user) return;
            setIsLoading(true);
            const { data, error } = await supabase
                  .from("bookmarks")
                  .select("*")
                  .eq("user_id", user.id)
                  .order("created_at", { ascending: false });

            if (!error) setBookmarks((data ?? []).map(toUI));
            setIsLoading(false);
      }, [user, supabase]);

      useEffect(() => {

            if (user) {
                  refresh();
            } else {
                  setBookmarks([]);
            }
            fetchPublic();
      }, [user?.id, fetchPublic, refresh]);

      const addBookmark = async (bm: Omit<UIBookmark, "id" | "createdAt">) => {
            if (!user) return;
            const { data, error } = await supabase
                  .from("bookmarks")
                  .insert([{ user_id: user.id, title: bm.title, url: bm.url, visibility: bm.visibility }])
                  .select()
                  .single();

            if (!error && data) {
                  const newBm = toUI(data);
                  setBookmarks((prev) => [newBm, ...prev]);
                  if (newBm.visibility === 'public') {
                        setPublicBookmarks((prev) => [newBm, ...prev.slice(0, 11)]);
                  }
            }
      };

      const updateBookmark = async (id: string, patch: Partial<UIBookmark>) => {
            const { error } = await supabase
                  .from("bookmarks")
                  .update({ title: patch.title, visibility: patch.visibility })
                  .eq("id", id);

            if (!error) {
                  setBookmarks((prev) =>
                        prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
                  );
                  // Also update public bookmarks if it exists there
                  setPublicBookmarks((prev) =>
                        prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
                  );
            }
      };

      const deleteBookmark = async (id: string) => {
            const { error } = await supabase
                  .from("bookmarks")
                  .delete()
                  .eq("id", id);

            if (!error) {
                  setBookmarks((prev) => prev.filter((b) => b.id !== id));
                  setPublicBookmarks((prev) => prev.filter((b) => b.id !== id));
            }
      };

      return (
            <BookmarksContext.Provider
                  value={{ bookmarks, publicBookmarks, isLoading, addBookmark, updateBookmark, deleteBookmark, refresh, fetchPublic }}
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