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
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between">
                <span
                    className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                    style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        border: `1px solid ${accentColor}20`
                    }}
                >
                    {bookmark.category}
                </span>

                <div className="flex items-center gap-2">
                    {bookmark?.visibility === 'private' && (
                        <span className="text-[9px] rounded-full font-black bg-amber-500 text-black px-2 py-0.5 uppercase tracking-tighter">Private</span>
                    )}
                    <button
                        onClick={() => handleDelete()}
                        className="p-1.5 rounded-xl bg-white/5 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        title="Delete Curation"
                    >
                        <LucideTrash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <h3 className="font-bold text-white text-base leading-tight">{bookmark.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{bookmark.description}</p>
            </div>

            {bookmark.url && (
                <div className="pt-2">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c1c6d7]/40 hover:text-white transition-colors group"
                    >
                        <span>Visit Resource</span>
                        <SquareArrowOutUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            )}
        </div>
    );
}

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
        <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-10">
            {/* Header */}
            <Header />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-black text-white">
                        <BookMarked
                            className="w-8 h-8 animate-pulse"
                            style={{ color: accentColor }}
                        />
                        Personal Workspace
                    </h1>

                    <p className="text-sm text-white/40 max-w-md leading-relaxed">
                        Exclusive dashboard for your custom curations and
                        private safe-keepings.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black transition-transform active:scale-95"
                    style={{ backgroundColor: accentColor }}
                >
                    <Plus size={18} />
                    Create Curation
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                        Total Curations
                    </p>
                    <h2 className="text-3xl font-black text-white mt-1">
                        {totalCurations}
                    </h2>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 border-l-amber-500/20">
                    <p className="text-[10px] uppercase tracking-widest text-amber-500/50 font-bold">
                        Private Safe-Keepings
                    </p>
                    <h2 className="text-3xl font-black text-amber-500 mt-1">
                        {privateCurations}
                    </h2>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                        Public Streams
                    </p>
                    <h2 className="text-3xl font-black text-white mt-1">
                        {publicCurations}
                    </h2>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20" />

                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter your custom workspace..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0E0E10] border border-white/5 text-white outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {CATEGORIES.map((cat) => {
                    const selected = selectedCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="px-5 py-2.5 rounded-full text-[11px] md:text-xs font-bold whitespace-nowrap transition-all active:scale-95"
                            style={{
                                backgroundColor: selected
                                    ? accentColor
                                    : "rgba(255,255,255,0.03)",
                                color: selected ? "#000" : "#c1c6d7",
                                border: selected ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            {filteredUserBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {filteredUserBookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center rounded-2xl border border-white/5 bg-white/[0.02] py-20 px-6">
                    <Sparkles
                        className="w-10 h-10 mx-auto mb-4 opacity-20"
                        style={{ color: accentColor }}
                    />

                    <h3 className="text-lg font-bold text-white">
                        Your Personal Workspace is empty
                    </h3>

                    <p className="text-sm text-white/40 mt-2 max-w-md mx-auto leading-relaxed">
                        You haven't initiated any custom bookmarks in this
                        workspace yet. Start curating your digital library today.
                    </p>

                    <button
                        onClick={handleCreate}
                        className="mt-8 px-8 py-3 rounded-xl font-bold text-black active:scale-95 transition-transform shadow-lg"
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
                    accentColor={accentColor}
                />
            }
        </div>
    );
}
