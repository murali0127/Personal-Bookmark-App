"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Plus, Search, BookMarked } from "lucide-react";
import Header from "@/components/NavBar";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface Bookmark {
    id: string;
    title: string;
    description: string;
    url?: string;
    author?: string;
    category: string;
    isPrivate?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 Mock Data                                  */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
    "All",
    "Technology",
    "Design",
    "AI",
    "Business",
    "Development",
];

const MOCK_BOOKMARKS: Bookmark[] = [
    {
        id: "1",
        title: "OpenAI Docs",
        description: "Official OpenAI developer documentation.",
        url: "https://platform.openai.com",
        author: "OpenAI",
        category: "AI",
        isPrivate: false,
    },
    {
        id: "2",
        title: "Next.js Guide",
        description: "Production-ready React framework.",
        url: "https://nextjs.org",
        author: "Vercel",
        category: "Development",
        isPrivate: true,
    },
    {
        id: "3",
        title: "Figma Design System",
        description: "Modern UI design resources.",
        url: "https://figma.com",
        author: "Figma",
        category: "Design",
        isPrivate: false,
    },
    {
        id: "4",
        title: "TechCrunch",
        description: "Latest startup and technology news.",
        url: "https://techcrunch.com",
        category: "Technology",
        isPrivate: true,
    },
    {
        id: "5",
        title: "Y Combinator",
        description: "Startup resources and founder guides.",
        url: "https://ycombinator.com",
        category: "Business",
        isPrivate: false,
    },
];

/* -------------------------------------------------------------------------- */
/*                             Mock Bookmark Card                             */
/* -------------------------------------------------------------------------- */

function BookmarkCard({
    bookmark,
    accentColor,
}: {
    bookmark: Bookmark;
    accentColor: string;
}) {
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

                {bookmark.isPrivate && (
                    <span className="text-xs text-amber-400">Private</span>
                )}
            </div>

            <h3 className="font-bold text-white">{bookmark.title}</h3>

            <p className="text-sm text-white/60">{bookmark.description}</p>

            {bookmark.url && (
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-400"
                >
                    Visit Resource
                </a>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Dashboard Component                           */
/* -------------------------------------------------------------------------- */

export default function DashboardView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const accentColor = "#007AFF";

    const bookmarks = MOCK_BOOKMARKS;

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
        (bm) => bm.isPrivate
    ).length;
    const publicCurations = bookmarks.filter(
        (bm) => !bm.isPrivate
    ).length;

    const handleCreate = () => {
        alert("Create Curation");
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
        </div>
    );
}