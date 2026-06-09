"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
      size: number; // scale/px size
      duration: number; // rotation & float duration
      delay: number;
      opacity: number;
      rotateDir: number; // 1 or -1
      pulse: boolean;
      pulseScale: number[];
}

export default function FloatingBackground({ accentColor = "#007AFF" }: FloatingBackgroundProps) {
      const [items, setItems] = useState<FloatingItem[]>([]);

      // Dynamically generate floating elements on mount to avoid server-client mismatch
      useEffect(() => {
            const iconPool = [
                  Bookmark, Folder, FolderHeart, Link2, Sparkles, Tag,
                  Globe, Compass, BookOpen, Layers, Inbox, Star
            ];

            const generatedItems: FloatingItem[] = Array.from({ length: 18 }).map((_, i) => {
                  const IconComponent = iconPool[i % iconPool.length];

                  // Distribute items nicely across the grid with some randomness
                  const col = i % 4; // 4 vertical sectors
                  const row = Math.floor(i / 4); // 5 horizontal sectors
                  const baseLeft = (col * 25) + 5;
                  const baseTop = (row * 20) + 5;

                  return {
                        id: i,
                        IconComponent,
                        x: baseLeft + (Math.random() * 15 - 7.5),
                        y: baseTop + (Math.random() * 12 - 6),
                        targetX: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
                        targetY: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
                        size: Math.floor(Math.random() * 20) + 24, // sizes from 24px to 44px
                        duration: Math.floor(Math.random() * 25) + 25, // 25s to 50s for super slow drifting
                        delay: Math.random() * -20, // Negative delay so they are already moving on mount
                        opacity: Math.random() * 0.08 + 0.04, // 4% to 12% opacity keeps background premium and readable
                        rotateDir: Math.random() > 0.5 ? 1 : -1,
                        pulse: Math.random() > 0.6,
                        pulseScale: Math.random() > 0.6 ? [1, 1.15, 0.9, 1] : [1, 1]
                  };
            });

            setItems(generatedItems);
      }, []);

      return (
            <div
                  className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
                  style={{ zIndex: -1 }}>
                  {/* Dynamic Grid Overlay to blend beautifully with the floating assets */}
                  <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                              backgroundImage: `radial-gradient(ellipse at center, transparent 30%, #000 100%), 
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                              backgroundSize: '100% 100%, 40px 40px, 40px 40px'
                        }}
                  />

                  {items.map((item) => {
                        const { IconComponent, id, x, y, targetX, targetY, size, duration, delay, opacity, rotateDir, pulseScale } = item;

                        return (
                              <motion.div
                                    key={id}
                                    className="absolute flex items-center justify-center pointer-events-none"
                                    style={{
                                          left: `${x}%`,
                                          top: `${y}%`,
                                          opacity: opacity,
                                          color: "white",
                                          filter: `drop-shadow(0 0 12px ${accentColor}30)`
                                    }}
                                    animate={{
                                          x: targetX,
                                          y: targetY,
                                          rotate: [0, rotateDir * 180, rotateDir * 360],
                                          scale: pulseScale,
                                    }}
                                    transition={{
                                          duration: duration,
                                          delay: delay,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                    }}
                              >
                                    <IconComponent
                                          style={{ width: size, height: size, strokeWidth: 1.2 }}
                                          className="transition-colors duration-500"
                                    />
                              </motion.div>
                        );
                  })}
            </div>
      );
}
