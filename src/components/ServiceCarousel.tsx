'use client';

import { useState, useRef, useEffect } from 'react';

interface ServiceSlide {
  id: string;
  type: 'quote' | 'gradient';
  content?: {
    quote?: string;
    linkText?: string;
    linkUrl?: string;
  };
  gradient?: string;
}

interface ServiceCarouselProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tabs?: string[];
  slides?: ServiceSlide[];
  learnMoreText?: string;
  quoteCaption?: string;
  storyLink?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  backgroundVideo?: string;
  mobileBackgroundVideo?: string;
  buttonColor?: string;
  arrowColor?: string;
  cardGradientFrom?: string;
  cardGradientTo?: string;
  accentColor?: string; // controls eyebrow and tab colors
}

export default function ServiceCarousel({
  eyebrow = "23andMe+ Premium",
  title = "Connect the dots between past, present, and future you.",
  description = "Best in class genotyping experience combines the most comprehensive ancestry breakdown with hundreds of health reports and insights. Plus ongoing information based on your DNA as the science becomes available.",
  tabs = ["Advanced Health", "Advanced Ancestry", "Pharmacogenetics"],
  slides = [
    {
      id: 'quote',
      type: 'quote',
      content: {
        quote: "Eventually the fear and the sadness gave way to hope.",
        linkText: "Watch Kristin's story",
        linkUrl: "#"
      }
    },
    {
      id: 'gradient',
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #FF6D19 0%, #D12F11 100%)'
    }
  ],
  learnMoreText = "Learn More",
  quoteCaption = "Eventually the fear and the sadness gave way to hope.",
  storyLink = "Watch Kristin's story",
  backgroundImage = "/services/Service-Slide-LG.png",
  mobileBackgroundImage = "/services/Service-Slide-Sm_01.png",
  backgroundVideo,
  mobileBackgroundVideo,
  buttonColor = "#D12F11",
  arrowColor = "#D12F11",
  cardGradientFrom = "#FF6D19",
  cardGradientTo = "#D12F11",
  accentColor
}: ServiceCarouselProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [carouselPadding, setCarouselPadding] = useState(0);
  const [slideWidth, setSlideWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  const gap = 24; // gap-6

  useEffect(() => {
    const calculateDimensions = () => {
      // Calculate responsive slide width
      const width = window.innerWidth;
      let newSlideWidth;
      
      // Set mobile state
      setIsMobile(width < 768);
      
      if (width >= 1280) { // xl breakpoint
        newSlideWidth = 1200;
      } else if (width >= 1024) { // lg breakpoint  
        newSlideWidth = 800;
      } else if (width >= 768) { // md breakpoint
        newSlideWidth = 600;
      } else if (width >= 640) { // sm breakpoint
        newSlideWidth = 320; // w-80
      } else { // mobile - 80vw
        newSlideWidth = Math.floor(width * 0.8);
      }
      
      setSlideWidth(newSlideWidth);

      // Calculate padding for alignment
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        setCarouselPadding(rect.left + 40);
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  const changeSlide = (direction: 'left' | 'right') => {
    let newSlideIndex = currentSlideIndex;
    if (direction === 'right' && currentSlideIndex < slides.length - 1) {
      newSlideIndex = currentSlideIndex + 1;
    } else if (direction === 'left' && currentSlideIndex > 0) {
      newSlideIndex = currentSlideIndex - 1;
    }
    setCurrentSlideIndex(newSlideIndex);
  };

  const isScrolled = currentSlideIndex > 0;
  const canScrollRight = currentSlideIndex < slides.length - 1;

  // No more useEffect needed for scroll checking
  
  return (
    <section className="w-full pt-0 pb-0">
      {/* Header Section - Constrained */}
      <div className="max-w-[1440px] mx-auto px-8 pt-16">
        <div className="flex flex-col items-center w-full">
          <div className=" py-0 md:px-40 w-full">
            <div className="flex flex-col gap-6 items-center text-center w-full">
              <div className="font-rialta font-semibold text-eyebrow-text" style={{ color: accentColor || buttonColor }}>
                {eyebrow}
              </div>
              <div className="font-rialta font-light text-heading-1 text-text-primary">
                {title}
              </div>
              <div className="font-rialta text-body-copy text-text-secondary">
                {description}
              </div>
            </div>
            
            {/* Tab Bar */}
            <div className="flex flex-row gap-2.5 items-start justify-center pt-10 w-full">
              {tabs.map((tab, index) => (
                <div key={index} className="flex flex-row gap-2 items-center justify-start p-4 rounded-full border relative" style={{ borderColor: accentColor || buttonColor }}>
                  <div className="font-rialta text-button-text whitespace-nowrap" style={{ color: accentColor || buttonColor }}>
                    {tab}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Section - Full Width using overflow and transforms */}
      <div className="w-full pt-16 pb-0">
        
        {/* Slides Container - This acts as the "viewport" */}
        <div 
          className="overflow-hidden"
          style={{ paddingLeft: `${carouselPadding}px` }}
        >
          {/* Slides Track - This moves with transform */}
          <div 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlideIndex * (slideWidth + gap)}px)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="flex-shrink-0 w-[80vw] sm:w-80 md:w-[600px] lg:w-[800px] xl:w-[1200px] h-[700px] lg:h-[752px] rounded-3xl relative overflow-hidden">
                {slide.type === 'quote' && slide.content ? (
                  <div className="w-full h-full flex flex-col justify-end p-4.5 relative">
                    {/* Background Video or Image */}
                    {(isMobile ? mobileBackgroundVideo : backgroundVideo) ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                      >
                        <source src={isMobile ? mobileBackgroundVideo : backgroundVideo} type="video/mp4" />
                        {/* Fallback to image if video fails */}
                        <div 
                          className="absolute inset-0 w-full h-full rounded-3xl"
                          style={{
                            backgroundImage: `url(${isMobile ? mobileBackgroundImage : backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      </video>
                    ) : (
                      <div 
                        className="absolute inset-0 w-full h-full rounded-3xl"
                        style={{
                          backgroundImage: `url(${isMobile ? mobileBackgroundImage : backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    )}
                    
                    {/* Content Overlay */}
                    <div className="rounded-lg w-full relative z-10">
                      <div className="flex flex-col gap-4 md:gap-10 px-4 md:pl-8 py-4 md:py-6 w-full">
                        {/* Quote with hang quotes */}
                        <div className="relative">
                          <div className="font-rialta font-light -left-[16px] md:-left-[24px] text-quote-text text-white tracking-[-0.4px] leading-normal w-full max-w-[631px] relative pl-4 md:pl-6">
                            <span 
                              className="absolute -left-[-12px]  top-0 font-rialta font-light text-quote-text text-white/80"
                              style={{ 
                                transform: 'translateX(-50%)',
                                lineHeight: '0.8'
                              }}
                            >
                              &ldquo;
                            </span>
                            {quoteCaption}
                            <span className="font-rialta font-light text-quote-text text-white/80">&rdquo;</span>
                          </div>
                        </div>
                        
                        {/* Story Link */}
                        <a 
                           href={slide.content.linkUrl} 
                           className="font-rialta font-bold text-story-link text-white underline hover:opacity-80 transition-opacity"
                         >
                           {storyLink}
                         </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full rounded-3xl"
                    style={{
                      background: slide.gradient || `linear-gradient(135deg, ${cardGradientFrom} 0%, ${cardGradientTo} 100%)`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination & Navigation */}
        <div ref={contentRef} className="max-w-[1440px] mx-auto px-10 pt-8 pb-10">
          <div className="flex items-center justify-between h-12 w-full">
            
            {/* Learn More Button */}
            <button 
              className="min-w-48 w-52 h-14 rounded-full font-rialta text-button-text text-white transition-colors"
              style={{
                backgroundColor: buttonColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {learnMoreText}
            </button>

            {/* Arrow Navigation */}
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => changeSlide('left')}
                className={`flex items-center justify-center w-10 h-10 rounded-full border relative ${
                  isScrolled 
                    ? 'cursor-pointer hover:opacity-80' 
                    : 'border-gray-300 cursor-not-allowed'
                }`}
                style={{
                  borderColor: isScrolled ? arrowColor : '#D1D5DB',
                  backgroundColor: isScrolled ? `${arrowColor}10` : 'transparent'
                }}
                aria-label="Previous slide"
                disabled={!isScrolled}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M8.75 16.25L2.5 10M2.5 10L8.75 3.75M2.5 10H17.5"
                    stroke={isScrolled ? arrowColor : "#D1D5DB"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              
              <button 
                onClick={() => changeSlide('right')}
                className={`flex items-center justify-center w-10 h-10 rounded-full border relative ${
                  canScrollRight 
                    ? 'cursor-pointer hover:opacity-80' 
                    : 'border-gray-300 cursor-not-allowed'
                }`}
                style={{
                  borderColor: canScrollRight ? arrowColor : '#D1D5DB',
                  backgroundColor: canScrollRight ? `${arrowColor}10` : 'transparent'
                }}
                aria-label="Next slide"
                disabled={!canScrollRight}
              >
                <svg
                  className="w-5 h-5 rotate-180"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M8.75 16.25L2.5 10M2.5 10L8.75 3.75M2.5 10H17.5"
                    stroke={canScrollRight ? arrowColor : "#D1D5DB"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 