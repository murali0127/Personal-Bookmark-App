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
      isLoading: boolean;
      addBookmark: (bm: Omit<UIBookmark, "id" | "createdAt">) => Promise<void>;
      updateBookmark: (id: string, patch: Partial<UIBookmark>) => Promise<void>;
      deleteBookmark: (id: string) => Promise<void>;
      refresh: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
      undefined
);

const COVER_FALLBACK = [
      "https://unsplash.com/photos/a-stack-of-books-sitting-on-top-of-each-other-16HDTsj-t7w",
      "https://unsplash.com/photos/a-pile-of-colorful-books-sitting-on-top-of-a-table-lHc7M-ujTcE",
      "https://unsplash.com/photos/a-group-of-books-flying-through-the-air-ssznFiZluOU",
      "https://unsplash.com/photos/education-dream-and-learning-concept-imagination-of-flying-books-in-sky-surreal-artwork-conceptual-painting-illustration-jBunBHVnuiA",
      "https://unsplash.com/photos/a-book-with-two-light-bulbs-attached-to-it-iVoCugvjKV8",
      "https://unsplash.com/photos/a-pile-of-colorful-books-sitting-on-top-of-a-table-lHc7M-ujTcE",
      "https://unsplash.com/photos/closeup-of-antique-books-educational-academic-and-literary-concept-br6n5z7Pxz0",
]

const randomImage = (
      COVER_FALLBACK: string[]
): string => {
      const randomIndex = Math.floor(Math.random() * COVER_FALLBACK.length);
      return COVER_FALLBACK[randomIndex];
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
      const { user } = useAuth();

      const [bookmarks, setBookmarks] = useState<UIBookmark[]>([]);
      const [isLoading, setIsLoading] = useState(false);

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
      }, [user?.id]); // only re-run when user id changes

      const addBookmark = async (bm: Omit<UIBookmark, "id" | "createdAt">) => {
            if (!user) return;
            const { data, error } = await supabase
                  .from("bookmarks")
                  .insert([{ user_id: user.id, title: bm.title, url: bm.url, visibility: bm.visibility }])
                  .select()
                  .single();

            if (!error && data) {
                  setBookmarks((prev) => [toUI(data), ...prev]);
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
            }
      };

      const deleteBookmark = async (id: string) => {
            const { error } = await supabase
                  .from("bookmarks")
                  .delete()
                  .eq("id", id);

            if (!error) {
                  setBookmarks((prev) => prev.filter((b) => b.id !== id));
            }
      };

      return (
            <BookmarksContext.Provider
                  value={{ bookmarks, isLoading, addBookmark, updateBookmark, deleteBookmark, refresh }}
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