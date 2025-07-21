'use client';

import KitCard from './KitCard';
import { useState, useRef, useEffect } from 'react';

type KitType = 'ancestry' | 'healthancestry' | 'premium' | 'totalhealth';

interface Kit {
  type: KitType;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  fsaEligible?: boolean;
  imageSrc: string;
}

interface KitSectionProps {
  showFourCards: boolean;
}

export default function KitSection({ showFourCards }: KitSectionProps) {
  const allKits: Kit[] = [
    {
      type: 'ancestry',
      title: 'Ancestry Service',
      subtitle: 'Hindsight',
      description: 'Ancestral intelligence engine links ancestral homes, people, and contemporaries.',
      price: 79,
      originalPrice: 119,
      discount: 30,
      imageSrc: '/kit/kit_ancestry.png'
    },
    {
      type: 'healthancestry',
      title: 'Health + Ancestry Service',
      subtitle: 'Insight',
      description: 'A deeper understanding of your health and heritage, powered by the data encoded in your DNA.',
      price: 199,
      fsaEligible: true,
      imageSrc: '/kit/kit_health&Ancestry.png'
    },
    {
      type: 'premium',
      title: '23andMe+ Premium™',
      subtitle: 'Foresight',
      description: 'Membership fueled by discovery, sharpened by time. Provides 100s of genetic insights and action tools.',
      price: 129,
      originalPrice: 269,
      discount: 30,
      fsaEligible: true,
      imageSrc: '/kit/kit_premium.png'
    },
    {
      type: 'totalhealth',
      title: '23andMe+ Total Health™',
      subtitle: 'Supersight',
      description: 'A medical-grade, longevity upgrade. Studies exome and blood to elicit thousands of answers. Hand-guidance to a healthier you.',
      price: 999,
      fsaEligible: true,
      imageSrc: '/kit/kit_totalhealth.png'
    }
  ];

  // Filter cards based on the prop
  const kits = showFourCards ? allKits : allKits.filter(kit => kit.type !== 'healthancestry');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrolled(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
      }
    };
    const currentRef = scrollContainerRef.current;
    currentRef?.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check

    // Add resize listener
    window.addEventListener('resize', checkScroll);

    return () => {
      currentRef?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [kits]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8; // Scroll by 80% of the container width
      current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };


  return (
    <section className="flex flex-col items-center pb-48  w-full max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap gap-2.5 items-center justify-center max-w-[400px] md:max-w-[1000px] p-8 md:p-16 px-10">
        <p className="font-rialta font-light text-[24px]  md:text-[36px] text-[#282828] tracking-[-1.8px] leading-[36px] md:leading-[60px]">
          A kit for every
        </p>
        <div 
          className="h-12 md:h-14 rounded-[100px] px-[18px] md:px-[22px] relative backdrop-blur-[50px] bg-white/[0.02] flex items-center justify-center"
          style={{
          background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #74125D 0%, #D50F67 73%, #D282E6 100%) border-box',
          border: '2.5px solid transparent'
        }}
        >
          <p className="font-rialta text-[20px] md:text-[28px] font-light md:font-light tracking-[-0.4px] md:tracking-[-0.56px] uppercase leading-none bg-gradient-to-r from-[#74125D] via-[#D50F67] to-[#D282E6] bg-clip-text text-transparent">
            CURIOSITY
          </p>
        </div>
        <p className="font-rialta font-light text-[24px] md:text-[36px] text-[#282828] tracking-[-1.8px] leading-[36px] md:leading-[60px]">
          Find
        </p>
        <div 
          className="h-12 md:h-14 rounded-[100px] px-[18px] md:px-[22px] relative backdrop-blur-[50px] bg-white/[0.02] flex items-center justify-center"
          style={{
          background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #92C746 0%, #00B5B5 100%) border-box',
          border: '2.5px solid transparent'
        }}
        >
          <p className="font-rialta text-[20px] md:text-[28px] font-light md:font-light tracking-[-0.4px] md:tracking-[-0.56px] uppercase leading-none bg-gradient-to-r from-[#92C746] to-[#00B5B5] bg-clip-text text-transparent">
            YOURS
          </p>
        </div>
      </div>

      {/* Cards Grid - DESKTOP */}
      <div className="w-full px-10">
        <div 
          key={`grid-${showFourCards ? '4' : '3'}-cards`}
          className="w-full hidden lg:flex gap-4 justify-center"
        >
            {kits.map((kit) => (
              <KitCard key={kit.type} {...kit} />
            ))}
        </div>
      </div>
          
      {/* Mobile and tablet layouts - HORIZONTAL SCROLL */}
      <div className="relative w-full  lg:hidden">
        {isScrolled && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md ml-4 opacity-0 pointer-events-none"
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 px-10 overflow-x-auto scrollbar-hide"
        >
          {kits.map((kit) => (
            <div key={kit.type} className="flex-shrink-0 w-[80vw] sm:w-[320px]">
              <KitCard {...kit} />
            </div>
          ))}
        </div>
        {canScrollRight && (
           <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md mr-4 opacity-0 pointer-events-none"
            aria-label="Scroll right"
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/></svg>
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="font-rialta text-[14px] text-[#555555] text-center tracking-[-0.14px] leading-[20px] max-w-[896px] mx-auto px-10 pt-4">
        Limit 3. Offer ends Oct 31. Ancestry Service comparison based on prevailing price of $119 on July 17, 2024.
      </p>
    </section>
  );
} 