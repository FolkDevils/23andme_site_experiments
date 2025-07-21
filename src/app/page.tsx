'use client';

import Navigation from '@/components/Navigation';
import EmailBanner from '@/components/EmailBanner';
import Hero from '@/components/Hero';
import KitSection from '@/components/KitSection';
import { Leva, useControls, button } from 'leva';
import { useState, useEffect } from 'react';

const heroStates = [
  { // State 0 (Original)
    eyebrow: '23ANDME+ PREMIUM',
    lines: [
      [{ text: 'A' }, { text: 'SUBSCRIPTION', pilled: true }],
      [{ text: 'at the speed of' }],
      [{ text: 'science', pilled: true }]
    ],
    subheadline: 'Emerging genetics in an evolving membership.'
  },
  { // State 1
    eyebrow: '23ANDME+ PREMIUM',
    lines: [
      [{ text: 'Bound' }, { text: 'ONLY', pilled: true }, { text: 'by the' }],
      [{ text: 'reaches of' }, { text: 'IMAGINATION', pilled: true }]
    ],
    subheadline: 'Emerging genetics in an evolving membership.'
  },
  { // State 2
    eyebrow: '23ANDME+ PREMIUM',
    lines: [
      [{ text: 'Gets' }, { text: 'SMARTER', pilled: true }, { text: 'every' }],
      [{ text: 'time' }, { text: 'SCIENCE', pilled: true }, { text: 'does' }]
    ],
    subheadline: 'Emerging genetics in an evolving membership.'
  },
  { // State 3 - STANDARD OF EXCELLENCE
    eyebrow: 'STANDARD OF EXCELLENCE',
    lines: [
      [{ text: 'The' }, { text: 'SAME', pilled: true }, { text: 'scrutiny and' }],
      [{ text: 'oversight as an' }, { text: 'EKG', pilled: true }]
    ],
    subheadline: '23andMe\'s health reports are sanctioned by the FDA as \'class II medical devices.\' This regulatory framework upholds the accuracy, reliability, and clinical relevance of these reports.'
  },
  { // State 4 - BREAKTHROUGH OF THE YEAR
    eyebrow: 'BREAKTHROUGH OF THE YEAR',
    lines: [
      [{ text: 'RIGHT', pilled: true }, { text: 'up there with' }],
      [{ text: 'landing on a' }, { text: 'COMET', pilled: true }]
    ],
    subheadline: 'Human genetic variation was named Science Magazine\'s Breakthrough of the Year in our launch year, specifically calling out 23andMe.'
  }
];

export default function Home() {
  const [showLeva, setShowLeva] = useState(true); // Keep Leva visible for this task

  // Centralized state management
  const [activeModule, setActiveModule] = useState('Hero');
  const [heroStateIndex, setHeroStateIndex] = useState(0);
  const [heroTheme, setHeroTheme] = useState<'Gradient' | 'White'>('Gradient');
  const [cardState, setCardState] = useState(true); // true = 4 cards, false = 3 cards

  // Leva Controls
  useControls(() => {
    const baseSchema = {
      'Active Module': {
        value: activeModule,
        options: ['Hero', 'Cards'],
        onChange: (value: string) => setActiveModule(value),
      },
    };

    if (activeModule === 'Hero') {
      return {
        ...baseSchema,
        Theme: {
          value: heroTheme,
          options: ['Gradient', 'White'],
          onChange: (v: 'Gradient' | 'White') => setHeroTheme(v),
        },
      };
    }

    if (activeModule === 'Cards') {
      return {
        ...baseSchema,
        'Toggle Layout': button(() => {
          setCardState((prev) => !prev);
        }),
      };
    }

    return baseSchema;
  }, [activeModule, heroTheme, cardState]);


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Toggle Leva panel with 'L'
      if (event.key.toLowerCase() === 'l' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setShowLeva(prev => !prev);
        return; // Prevent further action
      }

      // Handle arrow keys based on active module
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent browser scrolling
        
        switch (activeModule) {
          case 'Hero':
            setHeroStateIndex((prev) => {
              const increment = event.key === 'ArrowRight' ? 1 : -1;
              return (prev + increment + heroStates.length) % heroStates.length;
            });
            break;
          case 'Cards':
            setCardState((prev) => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeModule]); // Rerun effect if activeModule changes

  return (
    <>
      <Navigation />
      <EmailBanner />
      <Hero 
        headlineData={heroStates[heroStateIndex]}
        heroTheme={heroTheme}
      />
      <KitSection 
        showFourCards={cardState}
      />
      {showLeva && <Leva />}
    </>
  );
}
