'use client';

import Navigation from '@/components/Navigation';
import EmailBanner from '@/components/EmailBanner';
import Hero from '@/components/Hero';
import KitSection from '@/components/KitSection';
import ServiceCarousel from '@/components/ServiceCarousel';
import TotalHealth from '@/components/TotalHealth';
import Privacy from '@/components/Privacy';
import FontController from '@/components/FontController';
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
  const [showFontController, setShowFontController] = useState(false);
  
  // State previously managed by Leva
  const [heroTheme, setHeroTheme] = useState<'Gradient' | 'White'>('Gradient');
  const [cardState, setCardState] = useState(true); // true = 4 cards, false = 3 cards
  const [heroStateIndex, setHeroStateIndex] = useState(0);



  const toggleFontController = () => setShowFontController((prev) => !prev);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent browser scrolling
        
        setHeroStateIndex((prev) => {
          const increment = event.key === 'ArrowRight' ? 1 : -1;
          return (prev + increment + heroStates.length) % heroStates.length;
        });
      } else if (event.key === 'h' || event.key === 'H') {
        event.preventDefault(); // Prevent any default behavior
        toggleFontController();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []); // Remove unnecessary dependency

  return (
    <>
      <Navigation onLogoClick={toggleFontController} />
      <EmailBanner />
      <Hero 
        headlineData={heroStates[heroStateIndex]}
        heroTheme={heroTheme}
      />
      <KitSection 
        showFourCards={cardState}
      />
      <ServiceCarousel 
        quoteCaption="Eventually the fear and the sadness gave way to hope."
        storyLink="Watch Kristin's story"
        mobileBackgroundImage="/services/Service-Slide-Sm_01.png"
      />
      <ServiceCarousel 
        quoteCaption="It never would've occurred to me. It just wasn't a part of our world."
        storyLink="Watch Hilary's story"
        backgroundImage="/services/Service-Slide-LG_02.png"
        mobileBackgroundImage="/services/Service-Slide-Sm_02.png"
        buttonColor="#D50F67"
        arrowColor="#D50F67"
        cardGradientFrom="#D50F67"
        cardGradientTo="#D282E6"
        slides={[
          {
            id: 'quote',
            type: 'quote',
            content: {
              quote: "It never would've occurred to me. It just wasn't a part of our world.",
              linkText: "Watch Hilary's story",
              linkUrl: "#"
            }
          },
          {
            id: 'gradient',
            type: 'gradient',
            gradient: 'linear-gradient(135deg, #D50F67 0%, #D282E6 100%)'
          }
        ]}
      />
      <ServiceCarousel 
        quoteCaption="I always wanted to know who are my ancestors? Who are the people that made me, me?"
        storyLink="Watch Jordan's story"
        backgroundImage="/services/Service-Slide-LG_03.png"
        mobileBackgroundImage="/services/Service-Slide-Sm_03.png"
        buttonColor="#0081A5"
        arrowColor="#0081A5"
        cardGradientFrom="#0081A5"
        cardGradientTo="#9FFAEC"
        slides={[
          {
            id: 'quote',
            type: 'quote',
            content: {
              quote: "I always wanted to know who are my ancestors? Who are the people that made me, me?",
              linkText: "Watch Jordan's story",
              linkUrl: "#"
            }
          },
          {
            id: 'gradient',
            type: 'gradient',
            gradient: 'linear-gradient(135deg, #0081A5 0%, #9FFAEC 100%)'
          }
        ]}
      />

      <TotalHealth />

      <Privacy />

      {showFontController && (
        <FontController
          heroTheme={heroTheme}
          setHeroTheme={setHeroTheme}
          cardState={cardState}
          setCardState={setCardState}
        />
        
      )}
    </>

    
  );
}
