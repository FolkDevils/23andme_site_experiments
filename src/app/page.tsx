'use client';

import Navigation from '@/components/Navigation';
import EmailBanner from '@/components/EmailBanner';

import HeroLogoAnimated from '@/components/HeroLogoAnimated';
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

// heroStates removed for logo-only hero

export default function Home() {
  // Individual panel visibility states
  const [showSiteController, setShowSiteController] = useState(false);
  const [showTypographyController, setShowTypographyController] = useState(false);
  const [showHeroColorController, setShowHeroColorController] = useState(false);
  
  // State previously managed by Leva
  const [heroTheme, setHeroTheme] = useState<'Gradient' | 'White'>('Gradient');
  const [cardState, setCardState] = useState(false); // true = 4 cards, false = 3 cards
  // const [heroStateIndex, setHeroStateIndex] = useState(0);

  const toggleSiteController = () => setShowSiteController((prev) => !prev);
  const toggleTypographyController = () => setShowTypographyController((prev) => !prev);
  const toggleHeroColorController = () => setShowHeroColorController((prev) => !prev);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent browser scrolling
        
        // cycling disabled for logo hero
        // setHeroStateIndex((prev) => {
        //   const increment = event.key === 'ArrowRight' ? 1 : -1;
        //   return (prev + increment + heroStates.length) % heroStates.length;
        // });
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
      <HeroLogoAnimated />
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
        backgroundVideo="/services/23andMe_Kristin.mp4"
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
        backgroundVideo="/services/23andMe_Hilary.mp4"
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
        backgroundVideo="/services/23andMe_Jordan.mp4"
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
