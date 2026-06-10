"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Send, Globe, Image as ImageIcon, Loader2, BookmarkPlusIcon, BookLock, BookPlus } from 'lucide-react';
import { Bookmark } from '../types';
import { CATEGORIES } from '@/data';
import { motion, AnimatePresence } from 'motion/react';
import { useBookmarks } from '@/context/BookmarkContext';
import { Switch } from '@headlessui/react';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1681487902448-c493bb5fc77c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QnVzaW5lc3N8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmluYW5jZXxlbnwwfHwwfHx8MA%3D%3D"

];

const PRESET_CATEGORIES = CATEGORIES;

export default function AddBookmarkModal({
  isOpen,
  onClose,
  accentColor
}: AddBookmarkModalProps) {
  const { addBookmark } = useBookmarks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Tech');
  const [selectedImage, setSelectedImage] = useState("");
  const [authorName, setAuthorName] = useState('');
  const [errorWord, setError] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is mandatory');
      return;
    }
    if (!url.trim()) {
      setError('Resource URL domain is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await addBookmark({
        title: title.trim(),
        description: description.trim() || 'No description supplied.',
        category,
        url: url.trim().toLowerCase(),
        bookmark_image_url: selectedImage,
        author_name: authorName.trim() || '',
        publishedAge: 'Just now',
        isSaved: true,
        visibility: !isPublic ? 'private' : 'public'
      });

      // Reset Form
      setTitle('');
      setDescription('');
      setUrl('');
      setCategory('Tech');
      setAuthorName('');
      setSelectedImage(PRESET_IMAGES[0]);
      setError('');
      onClose();
    } catch (err) {
      console.error('Error adding bookmark:', err);
      setError('Failed to add bookmark');
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-[#1C1C1E] border border-white/10 rounded-3xl shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto hide-scrollbar"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/5">
                  <BookmarkPlusIcon className="w-5 h-5 text-[#007AFF]" style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="text-white text-lg font-bold tracking-tight">Add New Bookmark</h2>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">bookmark vault</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errorWord && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                  {errorWord}
                </div>
              )}

              {/* Main Fields */}
              <div className="space-y-4">
                <div className='flex gap-3 items-center'>
                  <label className="flex text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Public <span className='text-red-700'>*</span></label>
                  <Switch
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    className="group inline-flex h-5 w-10.5 items-center rounded-full bg-neutral-500 transition data-checked:bg-blue-600"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                  </Switch>
                </div>
                {/* Title & URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Title <span className='text-red-700'>*</span></label>
                    <input
                      type="text"
                      placeholder="Obsidian Note Strategy"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-neutral-800 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Resource URL <span className='text-red-700'>*</span></label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        required
                        type="text"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-neutral-800 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Description / Memo</label>
                  <textarea
                    rows={3}
                    placeholder="Short personal summary about why this is being cataloged..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 resize-none"
                  />
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Category Tag <span className='text-red-700'>*</span></label>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${category === cat
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-800 text-white/40 border-white/5 hover:border-white/10'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">Author Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Curated Mind"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-neutral-800 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                {/* Visual Picker */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" /> Artifact Cover
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`min-w-[80px] h-14 rounded-lg overflow-hidden border-2 transition-all relative ${selectedImage === img ? 'border-white scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                        {selectedImage === img && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white shadow-xl animate-pulse" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 8px 30px ${accentColor}25`
                  }}
                >
                  {isSubmitting && (
                    <Loader2 className="w-5 h-5 text-black animate-spin" />
                  )}
                  <span className="flex gap-2 text-black font-semibold">Add Bookmark {isPublic ? <BookPlus size="15px" /> : <BookLock size="15px" />} </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )
      }
    </AnimatePresence >
  );
}
