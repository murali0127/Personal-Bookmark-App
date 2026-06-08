"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Sparkles, Shield, CloudLightning, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface HeroSectionProps {
  onAuthSuccess: () => void;
  accentColor: string;
}

export default function HeroSection({ onAuthSuccess, accentColor }: HeroSectionProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          name
        });
        if (signUpError) throw signUpError;
        toast.success('Registration successful! Please check your email for a confirmation link.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        toast.success('Successfully signed in!');
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSocialLogin = async (provider: 'google' | 'facebook') => {
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider,
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback`,
  //       },
  //     });
  //     if (error) throw error;
  //   } catch (err: any) {
  //     setError(err.message || `An error occurred during ${provider} login`);
  //   }
  // };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
      {/* Hero Left Content */}
      <div className="md:col-span-6 flex flex-col space-y-6 text-center md:text-left">


        <h1 className="font-sans text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
          Save what matters. <br />
          <span style={{ color: accentColor }}>Organize effortlessly.</span>
        </h1>

        <p className="text-secondary text-base leading-relaxed max-w-md">
          Premium workspace for your digital library. Curate articles, research, and inspiration in a distraction-free environment designed for power users.
        </p>

        {/* Security / trust metrics */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 text-[#c1c6d7]/60 text-xs font-semibold">
          <div className="flex items-center gap-2 bg-white/[0.02] px-3.5 py-2 rounded-xl border border-white/5">
            <Shield className="w-4 h-4 text-secondary" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.02] px-3.5 py-2 rounded-xl border border-white/5">
            <CloudLightning className="w-4 h-4 text-secondary" />
            <span>Syncs Everywhere</span>
          </div>
        </div>
      </div>

      {/* Hero Right Authentication Form Card */}
      <div className="md:col-span-6 w-full max-w-[440px] mx-auto md:ml-auto">
        <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-3xl border border-white/10">

          {/* iOS Tab Switcher */}
          <div className="flex bg-black p-1 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError(null);
              }}
              className={`flex-1 py-2 font-sans text-xs font-bold rounded-lg transition-all ${!isRegisterMode
                ? 'bg-[#1C1C1E] text-white shadow-md'
                : 'text-secondary/60 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError(null);
              }}
              className={`flex-1 py-2 font-sans text-xs font-bold rounded-lg transition-all ${isRegisterMode
                ? 'bg-[#1C1C1E] text-white shadow-md'
                : 'text-secondary/60 hover:text-white'
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Authentication Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 px-1 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-black border border-white/10 rounded-xl focus:border-white/20 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                  Password
                </label>
                <button type="button" className="text-xs font-bold hover:underline" style={{ color: accentColor }}>
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-black border border-white/10 rounded-xl focus:border-white/20 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>
            {isRegisterMode &&
                <div className="flex items-center gap-2.5 py-1 px-1">
                  <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 bg-black border border-white/10 rounded-xl focus:border-white/20 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>}

            {/* Checkbox */}
            <div className="flex items-center gap-2.5 py-1 px-1">
              <input
                id="remember_me"
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-black text-[#007AFF] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                style={{ color: accentColor }}
              />
              <label htmlFor="remember_me" className="text-xs text-secondary/70 font-medium cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-white font-bold text-sm rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 24px ${accentColor}1A`
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-black font-semibold" />
              )}
              <span className="text-black font-semibold">
                {isRegisterMode ? 'Create Account' : 'Sign In'}
              </span>
            </button>
          </form>

          {/* OAuth. */}
          {/*<div className="relative flex items-center justify-center my-6">*/}
          {/*  <div className="absolute inset-0 flex items-center">*/}
          {/*    <div className="w-full border-t border-white/5"></div>*/}
          {/*  </div>*/}
          {/*  <span className="relative bg-[#1C1C1E] px-3 text-[10px] text-white/30 uppercase tracking-widest font-bold">*/}
          {/*    OR CONTINUE WITH*/}
          {/*  </span>*/}
          {/*</div>*/}

          {/*<div className="grid grid-cols-2 gap-3 pb-1">*/}
          {/*  <button*/}
          {/*    onClick={() => handleSocialLogin('google')}*/}
          {/*    className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-center gap-2.5 text-xs text-white active:scale-95 transition-all"*/}
          {/*  >*/}
          {/*    /!* Google path icon *!/*/}
          {/*    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">*/}
          {/*      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"></path>*/}
          {/*    </svg>*/}
          {/*    <span>Google</span>*/}
          {/*  </button>*/}

          {/*  <button*/}
          {/*    onClick={() => handleSocialLogin('facebook')}*/}
          {/*    className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-center gap-2.5 text-xs text-white active:scale-95 transition-all"*/}
          {/*  >*/}
          {/*    /!* Facebook path icon *!/*/}
          {/*    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">*/}
          {/*      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"></path>*/}
          {/*    </svg>*/}
          {/*    <span>Facebook</span>*/}
          {/*  </button>*/}
          {/*</div>*/}

        </div>
      </div>
    </div>
  );
}
