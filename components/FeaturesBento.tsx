/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, FolderSync, Plug } from 'lucide-react';

interface FeaturesBentoProps {
  accentColor: string;
}

export default function FeaturesBento({ accentColor }: FeaturesBentoProps) {
  const cards = [
    {
      icon: <Search className="w-5 h-5 text-black font-semibold" />,
      title: 'Instant Search',
      description: 'Find anything in milliseconds with our lightning-fast indexing.'
    },
    {
      icon: <FolderSync className="w-5 h-5 text-black font-semibold" />,
      title: 'Smart Sorting',
      description: 'AI-powered tags that automatically categorize your bookmarks.'
    },
    {
      icon: <Plug className="w-5 h-5 text-black font-semibold" />,
      title: 'Extensions',
      description: 'Save content from Chrome, Safari, and Firefox with one single click.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">

      {cards.map((card, i) => (
        <div
          key={i}
          className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:border-white/20 transition-all group duration-300"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-105 duration-350"
            style={{
              backgroundColor: `${accentColor}`,
              border: `1.5px solid ${accentColor}40`,
              color: accentColor
            }}
          >
            {card?.icon ?
              card.icon
              : <i className="bi bi-browser-chrome"></i>
            }
          </div>
          <h3 className="font-sans font-bold text-lg text-white">
            {card.title}
          </h3>
          <p className="text-secondary/70 text-xs leading-relaxed max-w-[250px]">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
