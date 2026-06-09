"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, Plus, Search, BookMarked, LucideTrash2, SquareArrowOutUpRight } from "lucide-react";
import Header from "@/components/NavBar";
import { useBookmarks } from "@/context/BookmarkContext";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import { CATEGORIES } from "@/data";
import { toast } from "sonner";

interface Bookmark {
    id: string;
    title: string;
    description: string;
    url?: string;
    author?: string;
    category: string;
    visibility?: string;
}


function BookmarkCard({
    bookmark,
    accentColor,
}: {
    bookmark: Bookmark;
    accentColor: string;
}) {
    const { deleteBookmark } = useBookmarks();
    const handleDelete = async () => {
        await deleteBookmark(bookmark.id);
    }


    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center justify-between">
                <span
                    className="text-[10px] px-2 py-1 rounded-full font-bold"
                    style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                    }}
                >
                    {bookmark.category}
                </span>

                {bookmark?.visibility === 'private' && (
                    <span className="text-xs rounded-2xl font-bold bg-amber-500 text-black px-1">Private</span>
                )}
                <span>
                    <button
                        onClick={() => handleDelete()}>
                        <LucideTrash2 className="p-1 rounded-2xl bg-neutral-800 text-neutral-500 hover:text-white transition-all duration-100" />
                    </button>
                </span>
            </div>

            <h3 className="font-bold text-white">{bookmark.title}</h3>

            <p className="text-sm text-white/60">{bookmark.description}</p>

            {bookmark.url && (
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 text-sm  text-blue-400 no-underline"
                >
                    <span> <SquareArrowOutUpRight size="18px" className="flex" /></span> Visit
                </a>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Dashboard Component                           */
/* -------------------------------------------------------------------------- */

export default function DashboardView() {
    const { bookmarks } = useBookmarks();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAddModel, setIsAddModel] = useState(false);

    const accentColor = "#007AFF";


    const filteredUserBookmarks = useMemo(() => {
        return bookmarks.filter((bm) => {
            const matchesSearch =
                bm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (bm.url &&
                    bm.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (bm.author &&
                    bm.author.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory =
                selectedCategory === "All" ||
                bm.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [bookmarks, searchTerm, selectedCategory]);

    const totalCurations = bookmarks.length;
    const privateCurations = bookmarks.filter(
        (bm) => bm.visibility === 'private'
    ).length;
    const publicCurations = bookmarks.filter(
        (bm) => bm.visibility === 'public'
    ).length;

    const handleCreate = () => {
        setIsAddModel(!isAddModel)
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <Header />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-black text-white">
                        <BookMarked
                            className="w-7 h-7 animate-pulse"
                            style={{ color: accentColor }}
                        />
                        Personal Workspace
                    </h1>

                    <p className="text-xs text-white/60 mt-2">
                        Exclusive dashboard for your custom curations and
                        private safe-keepings.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-black"
                    style={{ backgroundColor: accentColor }}
                >
                    <Plus size={16} />
                    Create Curation
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase text-white/50">
                        Total Curations
                    </p>
                    <h2 className="text-3xl font-black text-white mt-2">
                        {totalCurations}
                    </h2>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase text-amber-400">
                        Private Safe-Keepings
                    </p>
                    <h2 className="text-3xl font-black text-amber-400 mt-2">
                        {privateCurations}
                    </h2>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase text-white/50">
                        Public Streams
                    </p>
                    <h2 className="text-3xl font-black text-white mt-2">
                        {publicCurations}
                    </h2>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />

                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter your custom workspace..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white outline-none"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
                {CATEGORIES.map((cat) => {
                    const selected = selectedCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                            style={{
                                backgroundColor: selected
                                    ? accentColor
                                    : "rgba(255,255,255,0.05)",
                                color: selected ? "#000" : "#fff",
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            {filteredUserBookmarks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUserBookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 px-6">
                    <Sparkles
                        className="w-10 h-10 mx-auto mb-4"
                        style={{ color: accentColor }}
                    />

                    <h3 className="text-lg font-bold text-white">
                        Your Personal Workspace is empty
                    </h3>

                    <p className="text-sm text-white/50 mt-2 max-w-md mx-auto">
                        You haven't initiated any custom bookmarks in this
                        workspace yet.
                    </p>

                    <button
                        onClick={handleCreate}
                        className="mt-6 px-5 py-3 rounded-xl font-bold text-black"
                        style={{ backgroundColor: accentColor }}
                    >
                        Curate First Reference
                    </button>
                </div>
            )}

            {
                isAddModel &&
                <AddBookmarkModal
                    isOpen={isAddModel}
                    onClose={() => setIsAddModel(false)}
                    // onAdd={())}
                    accentColor={accentColor}
                />
            }
        </div>
    );
}