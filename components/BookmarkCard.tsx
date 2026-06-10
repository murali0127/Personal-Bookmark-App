"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UIBookmark } from '@/context/BookmarkContext';
import { Bookmark as BookmarkIcon, BookmarkCheck, Globe, ArrowUpRight } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: UIBookmark;
  user_name: string,
  accentColor: string;
  onSaveToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (bookmark: UIBookmark) => void;
}

export default function BookmarkCard({
  bookmark,
  user_name,
  accentColor,
  onSaveToggle,
  onSelect
}: BookmarkCardProps) {
  // Synchronized with UIBookmark structure from home/page.tsx

  //@ts-ignore
  const {
    id,
    title,
    url,
    description,
    category,
    bookmark_image_url,
    author_name,
    publishedAge,
    isSaved
  } = bookmark;

  // Extract clean domain for display
  const domain = React.useMemo(() => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    } catch {
      return url;
    }
  }, [url]);

  return (
    <article
      onClick={() => onSelect(bookmark)}
      className="glass-panel group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 flex flex-col h-full overflow-hidden"
      style={{ borderRadius: '16px' }}
    >
      {/* Visual Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          alt={title}
          src={bookmark_image_url ?? `https://placehold.co/600x400/EEE/31343C?font=raleway&text=${title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Interaction Button */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(id, e);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg active:scale-90 transition-all border border-white/10"
            style={{
              backgroundColor: isSaved ? accentColor : 'rgba(0, 0, 0, 0.5)',
              color: isSaved ? '#000' : '#fff'
            }}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col bg-zinc-900/20">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-3.5 h-3.5 text-white/20" />
          <span className="text-white/40 text-[10px] font-medium font-mono truncate">
            {domain}
          </span>
          {publishedAge && (
            <>
              <span className="text-white/10 text-[10px]">•</span>
              <span className="text-white/20 text-[10px] font-mono">{publishedAge}</span>
            </>
          )}
        </div>

        <h3 className="font-sans font-bold text-base text-white tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-white/90 transition-colors">
          {title}
        </h3>

        <p className="text-white/50 text-xs font-sans leading-relaxed line-clamp-3 mb-4">
          {description || "No description available for this curated reference."}
        </p>

        {/* Footer Meta */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          {author_name !== '' &&
            < div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-white/30 text-[9px] font-bold uppercase tracking-[0.15em]">
                Curated by {author_name}
              </span>
            </div>
          }
          <ArrowUpRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

      </div>
    </article >
  );
}
