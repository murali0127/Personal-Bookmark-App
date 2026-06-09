

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesBento from '@/components/FeaturesBento';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_ACCENT = '#007AFF';
const ACCENT_STORAGE_KEY = 'memex_accent_color';

export default function LandingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (stored) setAccentColor(stored);
  }, []);

  // If the user is already authenticated, route them to /home immediately.
  useEffect(() => {
    if (user) router.replace('/home');
  }, [user, router]);


  const handleAuthSuccess = () => {
    router.push('/home');
  };
  

  return (
    <div className="bg-[#000000] text-[#e4e2e4] flex flex-col relative min-h-screen selection:bg-white/10 selection:text-white">

      {/* ── Ambient glow: purely decorative, uses accentColor ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-250px] left-[-250px] w-[600px] h-[600px] rounded-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor}1C 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor}12 0%, rgba(0,0,0,0) 70%)`,
        }}
      />


      <main className="flex-1 w-full pt-24 pb-20 px-4 md:px-10 max-w-6xl mx-auto flex flex-col gap-20 relative z-10">


        <HeroSection
          onAuthSuccess={handleAuthSuccess}
          accentColor={accentColor}
        />


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
    </div>
  );
}