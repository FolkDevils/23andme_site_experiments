'use client';

import KitCard from './KitCard_css';
import { useState, useRef, useEffect } from 'react';
import styles from './KitSection.module.css';

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
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.headerText}>
          A kit for every
        </p>
        <div className={`${styles.pill} ${styles.pillCuriosity}`}>
          <p className={`${styles.pillText} ${styles.pillTextCuriosity}`}>
            CURIOSITY
          </p>
        </div>
        <p className={styles.headerText}>
          Find
        </p>
        <div className={`${styles.pill} ${styles.pillYours}`}>
          <p className={`${styles.pillText} ${styles.pillTextYours}`}>
            YOURS
          </p>
        </div>
      </div>

      {/* Cards Grid - DESKTOP */}
      <div className={styles.cardsContainer}>
        <div 
          key={`grid-${showFourCards ? '4' : '3'}-cards`}
          className={styles.cardsGrid}
        >
            {kits.map((kit) => (
              <KitCard key={kit.type} {...kit} />
            ))}
        </div>
      </div>
          
      {/* Mobile and tablet layouts - HORIZONTAL SCROLL */}
      <div className={styles.mobileContainer}>
        {isScrolled && (
          <button 
            onClick={() => scroll('left')}
            className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <div 
          ref={scrollContainerRef}
          className={styles.scrollContainer}
        >
          {kits.map((kit) => (
            <div key={kit.type} className={styles.cardWrapper}>
              <KitCard {...kit} />
            </div>
          ))}
        </div>
        {canScrollRight && (
           <button 
            onClick={() => scroll('right')}
            className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
            aria-label="Scroll right"
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/></svg>
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className={styles.disclaimer}>
        Limit 3. Offer ends Oct 31. Ancestry Service comparison based on prevailing price of $119 on July 17, 2024.
      </p>
    </section>
  );
} 