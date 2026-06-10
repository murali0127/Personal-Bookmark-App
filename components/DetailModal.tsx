"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark } from '../types';
import { X, Bookmark as BookmarkIcon, BookmarkCheck, ExternalLink, Calendar, User, Share2, Clipboard, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DetailModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
  onSaveToggle: (id: string, e: React.MouseEvent) => void;
  accentColor: string;
}

export default function DetailModal({
  bookmark,
  onClose,
  onSaveToggle,
  accentColor
}: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!bookmark) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${bookmark.url}/${bookmark.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop filter overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-lg"
          id="detail-modal-bg"
        />

        {/* Reader Slate Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-[#0E0E10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          id="detail-modal"
        >
          {/* Cover image banner */}
          <div className="relative h-60 md:h-72 w-full shrink-0">
            <img
              src={bookmark.bookmark_image_url}
              alt={bookmark.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-transparent"></div>

            {/* Context Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider backdrop-blur-md border border-white/10 text-white bg-black/40">
                {bookmark.category}
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                id="close-reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-secondary/80 mb-1">
                <span>{bookmark.url}</span>
                <span className="text-white/20">/</span>
                <span>{bookmark.publishedAge}</span>
              </div>
              <h2 className="text-white font-sans text-xl md:text-2xl font-bold tracking-tight leading-snug">
                {bookmark.title}
              </h2>
            </div>
          </div>

          {/* Reader Content Slate */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
            {/* Quick Action Tray */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <button
                onClick={(e) => onSaveToggle(bookmark.id, e)}
                style={{
                  backgroundColor: bookmark.isSaved ? `${accentColor}1A` : 'transparent',
                  borderColor: bookmark.isSaved ? accentColor : 'rgba(255, 255, 255, 0.08)',
                  color: bookmark.isSaved ? accentColor : '#c1c6d7'
                }}
                className="flex-1 border py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {bookmark.isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Saved inside Vault</span>
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="w-4 h-4" />
                    <span>Save to Library</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="border border-white/10 p-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/5"
              >
                {copied ? <Clipboard className="w-4 h-4" style={{ color: accentColor }} /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => window.open(`https://${bookmark.url}`, '_blank')}
                className="border border-white/10 p-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit</span>
              </button>
            </div>

            {/* Author Credit Segment */}
            <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-white text-xs border border-white/5">
                  {bookmark.author_name ? bookmark.author_name?.charAt(0) : 'C'}
                </div>
                <div>
                  <div className="text-secondary font-semibold">{bookmark.author_name || 'Curator'}</div>
                  <div className="text-[10px] opacity-60">Verified Domain Curator</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] opacity-75">
                <Calendar className="w-3.5 h-3.5" />
                <span>SYNCED 2026</span>
              </div>
            </div>

            {/* Simulated Prose Reader */}
            <div className="font-sans text-on-surface text-sm md:text-base leading-relaxed space-y-4">
              <p className="text-on-surface-variant font-medium first-letter:text-3xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                {bookmark.description}
              </p>
              <p>
                In high-end digital environments, interface complexity should fall away. Traditional Operating Systems often overwhelm the user with heavy boundaries, drop shadows, and complex rails. Here inside the sanctuary of MEMEX, our team targets the "OLED canvas philosophy" — allowing the physical bezel of the panel to function as the frame, and presenting curated bookmarks as high-fidelity tiles of digital expression.
              </p>
              <p>
                This bookmark serves as a high-density reference point for our active study. Curated elements represent the perfect meeting point of structural design and technological advancement. We suggest reading thoroughly, keeping it stored inside your library, and sharing key highlights utilizing your dynamic workspace key credentials if required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
