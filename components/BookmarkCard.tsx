"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark } from '../types';
import { Bookmark as BookmarkIcon, BookmarkCheck, Globe, Star, ArrowUpRight } from 'lucide-react';

interface BookmarkCardProps {
  key?: React.Key;
  bookmark: Bookmark;
  accentColor: string;
  onSaveToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({
  bookmark,
  accentColor,
  onSaveToggle,
  onSelect
}: BookmarkCardProps) {
  const { id, title, description, category, url, author, publishedAge, isFeatured, coverImage, isSaved } = bookmark;

  if (isFeatured) {
    return (
      <article 
        onClick={() => onSelect(bookmark)}
        className="glass-panel r-xl overflow-hidden md:col-span-2 group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/10"
        style={{ borderRadius: '16px' }}
        id={`featured-card-${id}`}
      >
        <div className="relative h-64 md:h-72 overflow-hidden">
          <img 
            alt={title}
            src={coverImage}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <span 
              className="px-2.5 py-1 text-[10px] text-white font-bold rounded uppercase tracking-wider backdrop-blur-md border"
              style={{ 
                backgroundColor: `${accentColor}30`, 
                borderColor: `${accentColor}40`
              }}
            >
              Featured
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="max-w-[80%]">
              <h2 className="font-sans text-xl md:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-2">
                {title}
              </h2>
            </div>
            
            <button
              onClick={(e) => onSaveToggle(id, e)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90"
              style={{ 
                backgroundColor: isSaved ? accentColor : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-black font-extrabold" /> : <BookmarkIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-secondary">
            {bookmark.avatarText ? (
              <div 
                className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
                style={{ backgroundColor: accentColor }}
              >
                {bookmark.avatarText}
              </div>
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span className="text-secondary">{url}</span>
            <span className="text-white/20">•</span>
            <span className="text-on-surface-variant/70">{publishedAge}</span>
          </div>
          <p className="text-on-surface-variant text-sm font-sans leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article 
      onClick={() => onSelect(bookmark)}
      className="glass-panel group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col justify-between"
      style={{ borderRadius: '16px' }}
      id={`bookmark-card-${id}`}
    >
      <div className="relative h-44 overflow-hidden" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
        <img 
          alt={title}
          src={coverImage}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-bold text-on-surface uppercase tracking-wider">
            {category}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3">
          <button 
            onClick={(e) => onSaveToggle(id, e)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-md active:scale-90 transition-all border border-white/10"
            style={{ 
              backgroundColor: isSaved ? accentColor : 'rgba(15, 15, 17, 0.7)'
            }}
          >
            {isSaved ? <BookmarkCheck className="w-4.5 h-4.5 text-black font-semibold" /> : <BookmarkIcon className="w-4.5 h-4.5 text-white" />}
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-on-surface-variant font-medium text-xs font-mono">{url}</span>
            {publishedAge && (
              <>
                <span className="text-white/10 text-xs">/</span>
                <span className="text-on-surface-variant/60 text-xs font-mono">{publishedAge}</span>
              </>
            )}
          </div>
          <h3 className="font-sans font-bold text-base text-white tracking-tight leading-snug group-hover:text-white/90 line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-on-surface-variant text-xs font-sans leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {author && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-on-surface-variant/80 text-xs font-medium truncate max-w-[90%]">
              {author}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        )}
      </div>
    </article>
  );
}
