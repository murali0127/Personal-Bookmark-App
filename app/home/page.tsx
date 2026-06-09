
'use client';
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "motion/react"
import { Search, Filter } from "lucide-react";
import { CATEGORIES } from "@/data";
import { useBookmarks } from "@/context/BookmarkContext";
import BookmarkCard from "@/components/BookmarkCard";

export default function HomePage() {
      const { user, profile } = useAuth();
      const { publicBookmarks, fetchPublic, isLoading, refresh } = useBookmarks();

      const [accentColor, setAccentColor] = useState('#007AFF')
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState<string>('General');

      // Search and Category filtering logic
      const filteredUserBookmarks = useMemo(() => {
            return publicBookmarks.filter((bm) => {
                  const matchesSearch =
                        bm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        bm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (bm.url &&
                              bm.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (bm.author_name &&
                              bm.author_name.toLowerCase().includes(searchTerm.toLowerCase()));

                  const matchesCategory =
                        selectedCategory === "All" ||
                        bm.category === selectedCategory;

                  return matchesSearch && matchesCategory;
            });
      }, [publicBookmarks, searchTerm, selectedCategory]);

      const handleSelect = (bookmark: any) => {
            if (bookmark.url) {
                  window.open(bookmark.url, '_blank', 'noopener,noreferrer');
            }
      };

      const handleSaveToggle = () => {
            alert('Confirm to Save?.')
      }

      return (
            <div className="w-full max-w-7xl mx-auto px-4 md:px-10">
                  <motion.div
                        key="feed"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="space-y-8"
                  >
                        {/* Search segment */}
                        <section className="relative w-full max-w-2xl">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#c1c6d7]/40" />
                              <input
                                    type="text"
                                    placeholder="Search in premium bookmarks collection..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#0E0E10] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white font-sans text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-[#c1c6d7]/35"
                              />
                        </section>

                        {/* Category Chips slider */}
                        <section className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                              {CATEGORIES.map((cat) => {
                                    const isSelected = selectedCategory === cat;
                                    return (
                                          <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className="px-4.5 py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-wide transition-all whitespace-nowrap active:scale-95 cursor-pointer"
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
                        {filteredUserBookmarks.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                                    {filteredUserBookmarks.map((bookmark) => (
                                          <BookmarkCard
                                                key={bookmark.id}
                                                bookmark={bookmark}
                                                user_name={profile?.user_name || ''}
                                                accentColor={accentColor}
                                                onSaveToggle={handleSaveToggle}
                                                onSelect={handleSelect}
                                          />
                                    ))}
                              </div>
                        ) : (
                              <div className="glass-panel text-center py-16 px-6 rounded-2xl border border-white/5 space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/20">
                                          <Filter className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-white text-base font-bold">No results found</h3>
                                    <p className="text-[#c1c6d7]/60 text-xs max-w-sm mx-auto leading-relaxed">
                                          We could not locate any bookmarks matching "{searchTerm}" under the selected category.
                                    </p>
                              </div>
                        )}

                        {/* Load more button */}
                        {publicBookmarks.length > 12 &&
                              <div className="text-center pt-8">
                                    <button
                                          className="px-6 py-2.5 rounded-xl bg-[#1C1C1E] border border-white/5 text-white font-sans text-xs font-bold hover:bg-[#252528] active:scale-95 transition-all cursor-pointer"
                                    >
                                          Load more bookmarks
                                    </button>
                              </div>
                        }
                  </motion.div >
            </div>
      )
}
