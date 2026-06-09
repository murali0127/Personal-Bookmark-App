
'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookMarked } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface FooterProps {
      accentColor?: string;
}

export default function Footer({ accentColor = '#007AFF' }: FooterProps) {
      const pathname = usePathname();
      if (pathname === '/') {
            return null;
      }
      return (


            <footer className="w-full shrink-0 border-t border-white/5 bg-[#09090B] py-8">
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
      );
}
