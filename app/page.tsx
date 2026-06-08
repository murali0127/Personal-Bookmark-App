"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookMarked, Search, Filter, Plus, Calendar, Compass,
  Grid2X2, User, HelpCircle, LogIn, ArrowRight, Sparkles
} from 'lucide-react';
import { Bookmark, ActiveScreen } from '../types';
import { CATEGORIES } from '../data';
import Header from '@/components/NavBar';
import BookmarkCard from '@/components/BookmarkCard';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import ProfileView from '@/components/ProfileView';
import FeaturesBento from '@/components/FeaturesBento';
import { motion, AnimatePresence } from 'motion/react';
import HeroSection from '@/components/HeroSection';
import DetailModal from '@/components/DetailModal';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
// import FloatingBackground from '@/components/FloatingBackground';
// import {getUserProfile} from "@/lib/db/profile";
import Toast from "@/components/Toast";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentScreen, setScreen] = useState<ActiveScreen>('landing');
  const [accentColor, setAccentColor] = useState<string>('#007AFF');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const supabase = createClient();

  // Next.js Safe Hydration Loader & Supabase Auth Listener
  useEffect(() => {
    setIsMounted(true);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleAuthSession(session);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleAuthSession(session);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setScreen('landing');
        setBookmarks([]);
      }
    });

    const cachedAccent = localStorage.getItem('memex_accent_color');
    if (cachedAccent) {
      setAccentColor(cachedAccent);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSession = async (session: any) => {
    setUser(session.user);
    setIsLoggedIn(true);
    if (currentScreen === 'landing') setScreen('feed');
    
    // Ensure profile exists
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (error && error.code === 'PGRST116') { // Record not found
        await supabase.from('profiles').insert([
          { 
            id: session.user.id, 
            user_name: session.user.email?.split('@')[0] || 'New Curator',
            handle: `@${session.user.email?.split('@')[0] || 'user'}` 
          }
        ]);
      }
    } catch (err) {
      console.error('Error ensuring profile:', err);
    }

    fetchBookmarks(session.user.id);
  };

  const fetchBookmarks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map DB bookmarks to UI bookmarks
      const mappedBookmarks: Bookmark[] = (data || []).map((bm: any) => ({
        id: bm.id,
        title: bm.title || 'Untitled',
        description: bm.description || 'No description.',
        url: bm.url,
        category: bm.category || 'Tech',
        author: bm.author || 'Curated Mind',
        publishedAge: 'Recently',
        isSaved: true,
        coverImage: bm.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      }));

      setBookmarks(mappedBookmarks);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('memex_accent_color', accentColor);
    }
  }, [accentColor, isMounted]);

  // Handle saving triggers
  const handleSaveToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev =>
      prev.map(bm => {
        if (bm.id === id) {
          return { ...bm, isSaved: !bm.isSaved };
        }
        return bm;
      })
    );
  };

  // Handle adding new bookmark
  const handleAddBookmark = async (newBm: Omit<Bookmark, 'id' | 'isSaved'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: user.id,
            title: newBm.title,
            url: newBm.url,
            visibility: newBm.visibility,
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const created: Bookmark = {
          ...newBm,
          id: data[0].id,
          isSaved: true
        };
        setBookmarks(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Error adding bookmark:', err);
      alert('Failed to add bookmark. Please check your connection.');
    }
  };

  const handleLogin = async () => {
    // Auth is handled by onAuthStateChange


  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  // Search and Category filtering logic
  const filteredBookmarks = bookmarks.filter(bm => {
    const matchesSearch =
      bm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bm.url && bm.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bm.author && bm.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      bm.category === selectedCategory;

    const matchesScreen = currentScreen !== 'library' || bm.isSaved;

    return matchesSearch && matchesCategory && matchesScreen;
  });

  // Keep rendering completely hidden during hydration to prevent style flashing
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-[#007AFF] animate-spin" />
          <span className="font-sans text-sm font-semibold tracking-wide text-white/55">Bookmark Vault</span>
        </div>
      </div>
    );
  }

  return (

    <div className="bg-[#000000] text-[#e4e2e4] flex flex-col relative selection:bg-white/10 selection:text-white">

      {/* Decorative ambient glowing orbits mimicking dynamic lighting */}
      <div className="ambient-glow top-[-250px] left-[-250px]" style={{ backgroundImage: `radial-gradient(circle, ${accentColor}1C 0%, rgba(0,0,0,0) 70%)` }} />
      <div className="ambient-glow bottom-[-200px] right-[-200px]" style={{ backgroundImage: `radial-gradient(circle, ${accentColor}12 0%, rgba(0,0,0,0) 70%)` }} />

      <Header />
      {/* Primary screens body slider container */}

      <main className="flex-1 w-full pt-24 pb-28 md:pb-20 px-4 md:px-10 max-w-6xl mx-auto flex flex-col justify-start relative z-10">
        <AnimatePresence mode="wait">

          {/* SCREEN 1: LANDING & PROMO PORTAL */}
          {currentScreen === 'landing' && (


            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-20 py-6"
            >

              <HeroSection onAuthSuccess={handleLogin} accentColor={accentColor} />

              {/* Product tiles Peek */}
              <div className="space-y-4">
                <div className="text-center space-y-1.5 mb-8">
                  <h2 className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                    COMING SOON
                  </h2>
                  <p className="text-white font-sans text-xl font-bold tracking-tight">
                    Future Enhancements
                  </p>
                </div>
                {/* <FeaturesBento accentColor={accentColor} /> */}
              </div>
            </motion.div>

          )}

          {/* SCREEN 2: MAIN PUBLIC FEED */}
          {currentScreen === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Search segment mimicking prompt */}
              <section className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant/60" />
                <input
                  type="text"
                  placeholder="Search in premium bookmarks collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0E0E10] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-on-surface font-sans text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-[#c1c6d7]/35"
                />
              </section>

              {/* iOS Category Chips slider */}
              <section className="flex items-center gap-2 overflow-x-scroll hide-scrollbar  pb-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? accentColor : 'rgba(28, 28, 30, 0.65)',
                        color: isSelected ? '#000000' : '#c1c6d7',
                        border: isSelected ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </section>

              {/* Bento Grid layout */}
              {filteredBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      accentColor={accentColor}
                      onSaveToggle={handleSaveToggle}
                      onSelect={(bm) => setSelectedBookmark(bm)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-panel text-center py-16 px-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-on-surface-variant">
                    <Filter className="w-5 h-5" />
                  </div>
                  <h3 className="text-white text-base font-bold">No results found</h3>
                  <p className="text-[#c1c6d7]/60 text-xs max-w-sm mx-auto leading-relaxed">
                    We could not locate any bookmarks matching "{searchTerm}" under the selected category. Add a new reference instantly or alter your search query.
                  </p>
                </div>
              )}

              {/* Extra button mock */}
              <div className="text-center pt-8">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1C1E] border border-white/5 text-on-surface font-sans text-xs font-bold hover:bg-[#252528] active:scale-95 transition-all cursor-pointer"
                >
                  Load more interesting bookmarks
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: DIGITAL SANCTUARY (LIBRARY) */}
          {currentScreen === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Header Segment exactly as matched in screenshots */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="font-sans text-3xl font-black text-white tracking-tight">
                    Digital Sanctuary
                  </h1>
                  <p className="text-secondary/70 text-xs font-semibold tracking-wide">
                    Curated knowledge and inspiration for the high-modernist.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                    Showing saved bookmarks:
                  </span>
                  <div className="glass-panel px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <span className="text-white text-xs font-semibold">
                      {filteredBookmarks.length} Curations
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & Grid */}
              <section className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? accentColor : 'rgba(28, 28, 30, 0.65)',
                        color: isSelected ? '#000000' : '#c1c6d7',
                        border: isSelected ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </section>

              {filteredBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      accentColor={accentColor}
                      onSaveToggle={handleSaveToggle}
                      onSelect={(bm) => setSelectedBookmark(bm)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-panel text-center py-20 px-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-on-surface-variant">
                    <BookMarked className="w-6 h-6" style={{ color: accentColor }} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white text-base font-bold">Your Digital Sanctuary is empty</h3>
                    <p className="text-[#c1c6d7]/60 text-xs max-w-sm mx-auto leading-relaxed">
                      You have not saved any bookmarks yet. Return to the main public Feed and click the bookmark flag on any article to populate your safe haven.
                    </p>
                  </div>
                  <button
                    onClick={() => setScreen('feed')}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-black cursor-pointer active:scale-95 transition-all"
                    style={{ backgroundColor: accentColor }}
                  >
                    Browse Public Feed Instead
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN 4: USER PROFILE SETTINGS */}
          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ProfileView
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Action Button (FAB) triggered contextually when authenticated */}
      {
        isLoggedIn && currentScreen !== 'profile' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="fixed bottom-24 right-5 md:bottom-10 md:right-10 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 z-40 cursor-pointer"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 8px 30px ${accentColor}40`
            }}
            id="global-add-fab"
          >
            <Plus className="w-6 h-6 text-black font-extrabold stroke-[2.5]" />
          </button>
        )
      }

      {/* iOS styled Bottom Tab Bar strictly rendered on mobile displays */}
      {
        isLoggedIn && (
          <nav
            className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center py-3 px-4 pb-safe border-t border-white/5"
            style={{
              background: 'rgba(9, 9, 11, 0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)'
            }}
            id="mobile-bottom-bar"
          >
            {[
              { key: 'feed' as ActiveScreen, label: 'Feed', icon: <Compass className="w-5 h-5" /> },
              { key: 'library' as ActiveScreen, label: 'Library', icon: <Grid2X2 className="w-5 h-5" /> },
              { key: 'profile' as ActiveScreen, label: 'Profile', icon: <User className="w-5 h-5" /> }
            ].map((tab) => {
              const isActive = currentScreen === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setScreen(tab.key)}
                  className="flex flex-col items-center justify-center transition-all py-1"
                  style={{
                    color: isActive ? accentColor : '#c1c6d7',
                    opacity: isActive ? 1 : 0.45
                  }}
                >
                  {tab.icon}
                  <span className="text-[10px] mt-1 font-bold font-sans tracking-wide">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )
      }

      {/* Modals & Portal Overlays */}
      <AddBookmarkModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddBookmark}
        accentColor={accentColor}
      />

      <DetailModal
        bookmark={selectedBookmark}
        onClose={() => setSelectedBookmark(null)}
        onSaveToggle={handleSaveToggle}
        accentColor={accentColor}
      />

    </div >
  );
}
