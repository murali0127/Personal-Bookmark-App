import { Database } from "./database.types";

export type Bookmark =
      Database["public"]["Tables"]["bookmarks"]["Row"];

export type Profile =
      Database["public"]["Tables"]["profiles"]["Row"];

export type BookmarkInsert =
      Database["public"]["Tables"]["bookmarks"]["Insert"];

export type BookmarkUpdate =
      Database["public"]["Tables"]["bookmarks"]["Update"];