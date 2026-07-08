"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
      Bookmark, Folder, FolderHeart, Link2, Sparkles, Tag,
      Globe, Compass, BookOpen, Layers, Inbox, Star
} from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingBackgroundProps {
      accentColor: string;
}

interface FloatingItem {
      id: number;
      IconComponent: React.ComponentType<any>;
      x: number; // percentage left
      y: number; // percentage top
      targetX: number[];
      targetY: number[];
      size: number; // px size
      duration: number; // float duration
      delay: number;
      opacity: number;
      rotateDir: number; // 1 or -1
      pulseScale: number[];
}

// Deterministic pseudo-random so server and client render the same items
// and the icons appear on the very first paint (no empty-then-pop-in).
function mulberry32(seed: number) {
      return () => {
            let t = (seed += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
}

const ICON_POOL = [
      Bookmark, Folder, FolderHeart, Link2, Sparkles, Tag,
      Globe, Compass, BookOpen, Layers, Inbox, Star
];

const COLUMNS = 5;
const ROWS = 8;

function generateItems(): FloatingItem[] {
      const rand = mulberry32(1337);
      const totalItems = COLUMNS * ROWS;

      return Array.from({ length: totalItems }).map((_, i) => {
            const IconComponent = ICON_POOL[i % ICON_POOL.length];
            const col = i % COLUMNS;
            const row = Math.floor(i / COLUMNS);

            const baseLeft = col * (100 / COLUMNS) + 4;
            const baseTop = row * (100 / ROWS) + 4;

            const willPulse = rand() > 0.6;

            return {
                  id: i,
                  IconComponent,
                  x: baseLeft + (rand() * 12 - 6),
                  y: baseTop + (rand() * 8 - 4),
                  targetX: [0, rand() * 40 - 20, rand() * -40 + 20, 0],
                  targetY: [0, rand() * 40 - 20, rand() * -40 + 20, 0],
                  size: Math.floor(rand() * 16) + 24,
                  duration: Math.floor(rand() * 25) + 25,
                  delay: rand() * -20,
                  // Visible against bg-black; tinted via CSS `color` from the parent.
                  opacity: rand() * 0.18 + 0.14,
                  rotateDir: rand() > 0.5 ? 1 : -1,
                  pulseScale: willPulse ? [1, 1.12, 0.92, 1] : [1, 1],
            };
      });
}

export default function FloatingBackground({ accentColor = "#007AFF" }: FloatingBackgroundProps) {
      // Generated once, deterministically, on the very first render.
      const items = React.useState<FloatingItem[]>(generateItems)[0];

      return (
            <div
                  className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
                  style={{ zIndex: 0 }}
                  aria-hidden="true"
            >
                  {/* Soft radial vignette to anchor the composition */}
                  <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                              backgroundImage: `radial-gradient(ellipse at center, transparent 0%, #000 90%)`,
                        }}
                  />

                  {/* Dynamic Grid Overlay — bumped to 8% so it actually reads */}
                  <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                              opacity: 0.08,
                              backgroundImage: `
                                    linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px)
                              `,
                              backgroundSize: '40px 40px, 40px 40px',
                              maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
                              WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
                        }}
                  />

                  {items.map((item) => {
                        const {
                              IconComponent, id, x, y,
                              targetX, targetY, size, duration, delay,
                              opacity, rotateDir, pulseScale
                        } = item;

                        return (
                              <motion.div
                                    key={id}
                                    className="absolute flex items-center justify-center pointer-events-none"
                                    style={{
                                          left: `${x}%`,
                                          top: `${y}%`,
                                          opacity,
                                          // Drives the SVG `stroke` via `currentColor`.
                                          color: accentColor,
                                          filter: `drop-shadow(0 0 14px ${accentColor}55)`,
                                    }}
                                    animate={{
                                          x: targetX,
                                          y: targetY,
                                          rotate: [0, rotateDir * 180, rotateDir * 360],
                                          scale: pulseScale,
                                    }}
                                    transition={{
                                          duration,
                                          delay,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                    }}
                              >
                                    <IconComponent
                                          style={{ width: size, height: size, strokeWidth: 1.2 }}
                                    />
                              </motion.div>
                        );
                  })}
            </div>
      );
}
