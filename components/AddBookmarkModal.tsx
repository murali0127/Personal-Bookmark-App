"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useState} from 'react';
import { X, Sparkles, Send, Globe, Image as ImageIcon, BookmarkPlusIcon } from 'lucide-react';
import { Bookmark } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {Switch} from "@headlessui/react";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'isSaved'>) => void;
  accentColor: string;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', // Obsidian abstract
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80', // Cobalt flow
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', // Sleek workspace
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', // Earth satellite
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=600&q=80'  // Geometric dark
];

const PRESET_CATEGORIES = ['Tech', 'Design', 'Learning', 'Travel & Lifestyle', 'Business', 'Finance', 'Health & Fitness', 'Cooking'];

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onAdd,
  accentColor
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Tech');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [authorName, setAuthorName] = useState('');
  const [errorWord, setError] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    console.log(isPublic);
  }, [isPublic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is mandatory');
      return;
    }
    if (!url.trim()) {
      setError('Resource URL domain is required');
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim() || 'No description supplied.',
      category,
      url: url.trim().toLowerCase(),
      coverImage: selectedImage,
      author: authorName.trim() || 'Curated Mind',
      publishedAge: 'Just now',
      isFeatured: false,
      visibilty : isPublic ? 'public' : 'private'
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setUrl('');
    setCategory('Tech');
    setAuthorName('');
    setSelectedImage(PRESET_IMAGES[0]);
    setError('');
    setIsPublic(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center ">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            id="add-modal-overlay"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg md:max-w-xl bg-[#1C1C1E] border border-white/10 rounded-t-3xl md:rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] md:max-h-[85vh] z-10"
            id="add-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookmarkPlusIcon className="w-5 h-5" style={{ color: accentColor }} />
                <h3 className="font-sans font-bold text-lg text-white">
                  Add Bookmark
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorWord && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-4 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {errorWord}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5">
                  Bookmark Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Domain Space *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., design.apple.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div> */}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5">
                    AUTHOR NAME *
                  </label>
                  <input
                    type="text"
                    placeholder="enter your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="py-9 flex gap-2 justify-center items-center">
                    <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5">
                      PUBLIC :
                    </label>

                  <Switch
                      onChange={() => setIsPublic(!isPublic)}
                      className="group inline-flex h-5 w-10 items-center rounded-full bg-neutral-500 transition data-checked:bg-blue-600"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                  </Switch>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95"
                      style={{
                        backgroundColor: category === c ? `${accentColor}15` : 'transparent',
                        borderColor: category === c ? accentColor : 'rgba(255, 255, 255, 0.08)',
                        color: category === c ? accentColor : '#c1c6d7'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5">
                  Description
                </label>
                <textarea
                  placeholder="write something about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-black/40 border border-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 tracking-wide uppercase px-0.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Choose Cover Image <span className='lowercase'>(optional)</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${selectedImage === img ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                        }`}
                      style={{
                        borderColor: selectedImage === img ? accentColor : 'transparent'
                      }}
                    >
                      <img src={img} alt="Aesthetic thumbnail option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#007AFF] text-white flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 20px ${accentColor}30`
                  }}
                >
                  <Send className="w-4 h-4 text-black font-semibold" />
                  <span className="text-black font-semibold">Store inside Sanctuary</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
