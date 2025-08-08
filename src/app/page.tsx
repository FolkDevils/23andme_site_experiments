'use client';

import Navigation from '@/components/Navigation';
import EmailBanner from '@/components/EmailBanner';

import HeroAnimated from '@/components/HeroAnimated';
import KitSection from '@/components/KitSection';
import ServiceCarousel from '@/components/ServiceCarousel';
import TotalHealth from '@/components/TotalHealth';
import Privacy from '@/components/Privacy';
import FAQ from '@/components/FAQ';
import EmailCapture from '@/components/EmailCapture';
import Footer from '@/components/Footer';
import SiteController from '@/components/SiteController';
import TypographyController from '@/components/TypographyController';
import HeroColorController from '@/components/HeroColorController';
import { useState, useEffect } from 'react';

const heroStates = [

  { // State 1
    eyebrow: '23ANDME+ PREMIUM',
    lines: [
      [{ text: 'Bound' }, { text: 'ONLY', pilled: true }, { text: 'by the' }],
      [{ text: 'reaches of' }, { text: 'IMAGINATION', pilled: true }]
    ],
    subheadline: 'Emerging genetics in an evolving membership.'
  },
  { // State 0 (Original)
    eyebrow: '23ANDME+ PREMIUM',
    lines: [
      [{ text: 'A' }, { text: 'SUBSCRIPTION', pilled: true }],
      [{ text: 'at the speed of' }],
      [{ text: 'science', pilled: true }]
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
  // Individual panel visibility states
  const [showSiteController, setShowSiteController] = useState(false);
  const [showTypographyController, setShowTypographyController] = useState(false);
  const [showHeroColorController, setShowHeroColorController] = useState(false);
  
  // State previously managed by Leva
  const [heroTheme, setHeroTheme] = useState<'Gradient' | 'White'>('Gradient');
  const [cardState, setCardState] = useState(false); // true = 4 cards, false = 3 cards
  const [heroStateIndex, setHeroStateIndex] = useState(0);

  const toggleSiteController = () => setShowSiteController((prev) => !prev);
  const toggleTypographyController = () => setShowTypographyController((prev) => !prev);
  const toggleHeroColorController = () => setShowHeroColorController((prev) => !prev);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent browser scrolling
        
        setHeroStateIndex((prev) => {
          const increment = event.key === 'ArrowRight' ? 1 : -1;
          return (prev + increment + heroStates.length) % heroStates.length;
        });
      } else if (event.key === '1') {
        event.preventDefault();
        toggleSiteController();
      } else if (event.key === '2') {
        event.preventDefault();
        toggleTypographyController();
      } else if (event.key === '3') {
        event.preventDefault();
        toggleHeroColorController();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []); // Remove unnecessary dependency

  return (
    <>
      <Navigation onLogoClick={toggleSiteController} />
      <EmailBanner />
      <HeroAnimated 
        headlineData={heroStates[heroStateIndex]}
        heroTheme={heroTheme}
      />
      <KitSection 
        showFourCards={cardState}
      />
      <ServiceCarousel 
        eyebrow="23andMe+ Premium"
        title="Connect the dots between past, present, and future you."
        description="Best in class genotyping experience combines the most comprehensive ancestry breakdown with hundreds of health reports and insights. Plus ongoing information based on your DNA as the science becomes available."
        tabs={["Advanced Health", "Advanced Ancestry", "Pharmacogenetics"]}
        quoteCaption="Eventually the fear and the sadness gave way to hope."
        storyLink="Watch Kristin's story"
        backgroundVideo="/services/Service-Slide-LG.mp4"
        mobileBackgroundImage="/services/Service-Slide-Sm_01.png"
        buttonColor="#D12F11"
        arrowColor="#D12F11"
        cardGradientFrom="#FF6D19"
        cardGradientTo="#D12F11"
        accentColor="#D12F11"
      />
      <ServiceCarousel 
        eyebrow="Health + Ancestry"
        title="For all the wonder that is you."
        description="From the lineage of your distant past to the insights into your future, it’s all coded in your DNA. Access the story with Health & Ancestry: combining health insights from 150+ personalized reports with the most comprehensive ancestry breakdown available."
        tabs={["Health predispositions", "Wellness", "Carrier status"]}
        quoteCaption="It never would've occurred to me. It just wasn't a part of our world."
        storyLink="Watch Hilary's story"
        backgroundVideo="/services/Service-Slide-LG_02.mp4"
        mobileBackgroundImage="/services/Service-Slide-Sm_02.png"
        buttonColor="#D50F67"
        arrowColor="#D50F67"
        cardGradientFrom="#D50F67"
        cardGradientTo="#D282E6"
        accentColor="#D50F67"
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
        eyebrow="Ancestry Service"
        title="There’s more to your story."
        description="Understand the larger context of where you come from with 99.9% of your ancestry breakdown. It’s the most complete genetic breakdown on the market, and the most comprehensive portrait of you yet."
        tabs={["Ancestry Composition", "DNA Relatives", "Ancestry Timeline"]}
        quoteCaption="I always wanted to know who are my ancestors? Who are the people that made me, me?"
        storyLink="Watch Jordan's story"
        backgroundVideo="/services/Service-Slide-LG_03.mp4"
        mobileBackgroundImage="/services/Service-Slide-Sm_03.png"
        buttonColor="#0081A5"
        arrowColor="#0081A5"
        cardGradientFrom="#0081A5"
        cardGradientTo="#9FFAEC"
        accentColor="#0081A5"
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

      <TotalHealth backgroundVideo="/totalhealth/TH_Desktop.mp4" />

      <Privacy backgroundVideo="/privacy/Privacy.mp4" />

      <FAQ />

      <EmailCapture />

      <Footer />

      {/* Control Panels */}
      <SiteController
        heroTheme={heroTheme}
        setHeroTheme={setHeroTheme}
        cardState={cardState}
        setCardState={setCardState}
        isVisible={showSiteController}
      />
      
      <TypographyController
        isVisible={showTypographyController}
      />
      
      <HeroColorController
        isVisible={showHeroColorController}
      />
    </>

    
  );
}
