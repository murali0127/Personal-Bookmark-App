"use client";

import React, { useState, useEffect } from 'react';
import { LogOut, Edit3, Check, X, Bookmark, Users, BookmarkCheckIcon, BookMarkedIcon, BookPlus, BookLock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, signOut, updateProfile } = useAuth();
    const { bookmarks } = useBookmarks();

    useEffect(() => {
        console.log('User specific Bookmarks : ', bookmarks)
    })

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (profile?.user_name) {
            setNewName(profile.user_name);
        } else if (user?.user_metadata?.name) {
            setNewName(user.user_metadata.name);
        }
    }, [profile, user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/')
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        try {
            await updateProfile({ user_name: newName });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-white/20 font-medium">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto pt-10 pb-12 px-6 flex flex-col items-center text-center">
            {/* Avatar Section */}
            <div className="relative mb-8 group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                    <img
                        alt="Profile"
                        src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                        title="Edit name"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Identity Section */}
            <div className="space-y-2 mb-10 w-full">
                {isEditing ? (
                    <div className="flex flex-col items-center gap-3">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl font-bold text-center focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Your name"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateName();
                                if (e.key === 'Escape') setIsEditing(false);
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdateName}
                                className="flex items-center gap-1 px-4 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-1 px-4 py-1.5 bg-white/10 text-white text-sm font-bold rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {profile?.user_name || user.user_metadata?.name || 'Explorer'}
                        </h1>
                        <p className="text-white/40 text-sm font-medium tracking-wide">
                            {user.email}
                        </p>
                    </>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 w-full mb-12 border-y border-white/5 py-8">

                {/* Total Bookmarks */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-2 bg-white/5 rounded-lg mb-1">
                        <BookmarkCheckIcon className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-2xl font-bold text-white leading-none">
                        {bookmarks.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-extrabold">
                        Bookmarks
                    </span>
                </div>

                {/* Private Bookmarks */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-2 bg-white/5 rounded-lg mb-1">
                        <BookLock className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-2xl font-bold text-white leading-none">
                        {bookmarks.filter((bm) => bm.visibility === 'private').length}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-extrabold">
                        Private
                    </span>
                </div>

                {/* Public Bookmarks */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-2 bg-white/5 rounded-lg mb-1">
                        <BookPlus className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-2xl font-bold text-white leading-none">
                        {bookmarks.filter((bm) => bm.visibility === 'public').length}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-extrabold">
                        Public
                    </span>
                </div>

            </div>

            {/* Action Section */}
            <div className="flex flex-col gap-4 w-full">
                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 font-semibold transition-all border border-transparent hover:border-rose-500/20 group"
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Sign Out</span>
                </button>

                <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
                    bookmark vault                </p>
            </div>
        </div >
    );
}
