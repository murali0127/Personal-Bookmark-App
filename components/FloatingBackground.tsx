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

            // Configurable grid density
            const columns = 5;
            const rows = 8; // 5 columns * 8 rows = 40 perfectly distributed items
            const totalItems = columns * rows;

            const generatedItems: FloatingItem[] = Array.from({ length: totalItems }).map((_, i) => {
                  const IconComponent = iconPool[i % iconPool.length];

                  // Determine exact grid coordinates
                  const col = i % columns;
                  const row = Math.floor(i / columns);

                  // Calculate coordinates evenly across 100% of the screen width/height
                  // (Subtracting a small margin like 8% ensures icons don't clip off the screen edges)
                  const baseLeft = (col * (100 / columns)) + 4;
                  const baseTop = (row * (100 / rows)) + 4;

                  return {
                        id: i,
                        IconComponent,
                        // Add a controlled random offset so it feels organic, not like a rigid table
                        x: baseLeft + (Math.random() * 12 - 6),
                        y: baseTop + (Math.random() * 8 - 4),
                        targetX: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
                        targetY: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
                        size: Math.floor(Math.random() * 16) + 24, // 24px to 40px
                        duration: Math.floor(Math.random() * 25) + 25,
                        delay: Math.random() * -20,
                        opacity: Math.random() * 0.06 + 0.03, // Subtle premium opacity
                        rotateDir: Math.random() > 0.5 ? 1 : -1,
                        pulse: Math.random() > 0.6,
                        pulseScale: Math.random() > 0.6 ? [1, 1.12, 0.92, 1] : [1, 1]
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
                                          className="transition-colors duration-500 text-blue-400"
                                    />
                              </motion.div>
                        );
                  })}
            </div>
      );
}
