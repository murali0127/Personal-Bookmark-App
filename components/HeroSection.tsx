"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sparkles, Shield, CloudLightning, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface HeroSectionProps {
  onAuthSuccess: () => void;
  accentColor: string;
}

export default function HeroSection({ onAuthSuccess, accentColor }: HeroSectionProps) {
  const { signIn, signUp } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        // Adapt signUp payload to match SignUpCredentials shape (no 'options' property)
        await signUp({
          email,
          password,
          user_name: userName?.trim() || email.split(/[.@]/)[0]
        });
        onAuthSuccess();
      } else {
        await signIn({ email, password });
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };





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
            {isRegisterMode &&
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 px-1 uppercase tracking-wide">
                  User name <span className='text-red-700'>*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="name@company.com"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-black border border-white/10 rounded-xl focus:border-white/20 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 px-1 uppercase tracking-wide">
                Email Address <span className='text-red-700'>*</span>
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
                  Password <span className='text-red-700'>*</span>
                </label>
                {!isRegisterMode &&
                  <button type="button" className="text-xs font-bold hover:underline" style={{ color: accentColor }}>
                    Forgot?
                  </button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-white transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-black border border-white/10 rounded-xl focus:border-white/20 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            {!isRegisterMode &&
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
            }
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
              {isLoading &&
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              }
              <span className="text-black font-semibold">
                {isRegisterMode ? 'Create Account' : 'Sign In'}
              </span>
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}
