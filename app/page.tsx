
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesBento from '@/components/FeaturesBento';
import { useBookmarks } from '@/context/BookmarkContext';
import BookmarkCard from '@/components/BookmarkCard';
import FloatingBackground from '@/components/FloatingBackground';
import { Bookmark } from '@/types';
import { toast } from 'sonner';
import { BookMarked } from 'lucide-react';

const DEFAULT_ACCENT = '#007AFF';
const ACCENT_STORAGE_KEY = 'memex_accent_color';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bookmarkvault.app';

export default function LandingPage() {
  const router = useRouter();
  const { publicBookmarks, isLoading } = useBookmarks();
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (stored) setAccentColor(stored);
  }, []);


  const handleAuthSuccess = () => {
    router.push('/home');
  };

  const handleSaveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.error('Please sign in to save bookmarks');
  };

  const handleSelect = (bookmark: Bookmark) => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bookmark Vault',
    url: SITE_URL,
    description:
      'A modern bookmark manager for saving, organizing, and revisiting useful links, articles, and inspiration.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Save links and bookmarks',
      'Organize articles and research',
      'Create a personal knowledge library',
    ],
  };

  return (
    <div className="text-[#e4e2e4] flex flex-col relative min-h-screen selection:bg-white/10 selection:text-white bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <FloatingBackground accentColor={accentColor} />

      <main className="flex-1 w-full pt-24 pb-20 px-4 md:px-10 max-w-6xl mx-auto flex flex-col gap-24 relative z-10">

        <HeroSection
          onAuthSuccess={handleAuthSuccess}
          accentColor={accentColor}
        />

        <section
          aria-labelledby="seo-benefits"
          className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 md:px-8 md:py-10"
        >
          <div className="max-w-3xl space-y-3">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.28em]" style={{ color: accentColor }}>
              Why Bookmark Vault
            </p>
            <h2 id="seo-benefits" className="text-white font-sans text-2xl md:text-3xl font-bold tracking-tight">
              Turn scattered links into a clean, searchable personal library.
            </h2>
            <p className="text-base leading-relaxed text-[#c1c6d7]/75">
              Bookmark Vault helps you save meaningful resources, organize research, and revisit your favorite articles without losing focus. It is designed for people who want a simple yet powerful bookmark manager for everyday browsing.
            </p>
          </div>
        </section>

        <section aria-label="Upcoming features" className="space-y-4">
          <div className="text-center space-y-1.5 mb-8">
            <p
              className="font-sans text-xs font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Coming Soon
            </p>
            <h2 className="text-white font-sans text-xl font-bold tracking-tight">
              Future Enhancements
            </h2>
          </div>
          <FeaturesBento accentColor={accentColor} />
        </section>

      </main>
      <footer className="w-full z-10 shrink-0 border-t border-white/5 bg-transparent py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-4 h-4 opacity-50" style={{ color: accentColor }} />
            <span className="font-sans text-xs text-[#c1c6d7]/50 tracking-wider uppercase">
              © 2026 Bookmark VAULT.
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs font-semibold text-[#c1c6d7]/50">
            <a href="https://www.linkedin.com/in/murali-dharan-s" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/murali0127/Personal-Bookmark-App" className="hover:text-white transition-colors">Github</a>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Alive</span>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
}