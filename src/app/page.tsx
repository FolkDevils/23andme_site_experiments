'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BcoreLogo from '@/components/BcoreLogo';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Video array and current video state
  const videos = ['/hero.mp4', '/hero_1.mp4'];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Parallax effect setup
  useEffect(() => {
    if (heroRef.current && heroTextRef.current && contentRef.current) {
      // Set initial positions
      gsap.set(heroRef.current, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 });
      gsap.set(contentRef.current, { position: 'relative', zIndex: 2, marginTop: '100vh' });

      // Create parallax animation for hero text
      gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
          onUpdate: (self) => {
            // Move hero text up at 75% speed of content scroll (faster)
            const textY = self.progress * -window.innerHeight * 0.75;
            gsap.set(heroTextRef.current, { y: textY });
          }
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  // Carousel navigation
  const goToSlide = (slideIndex: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(slideIndex);
    }
  };

  // Track scroll position for dot indicators
  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  const scrambleText = (element: HTMLElement, originalText: string, duration: number = 0.6) => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iterations = 0;
    
    const interval = setInterval(() => {
      element.textContent = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
      }
      
      iterations += 1 / 3;
    }, 15);
  };

  const handleMouseEnter = (index: number) => {
    const element = navRefs.current[index];
    if (element) {
      const originalText = element.getAttribute('data-text') || element.textContent || '';
      scrambleText(element, originalText);
    }
  };

  const handleMouseLeave = (index: number) => {
    const element = navRefs.current[index];
    if (element) {
      const originalText = element.getAttribute('data-text') || '';
      element.textContent = originalText;
    }
  };

  const handleButtonMouseEnter = (index: number) => {
    const element = buttonRefs.current[index];
    if (element) {
      const originalText = element.getAttribute('data-text') || element.textContent || '';
      scrambleText(element, originalText);
    }
  };

  const handleButtonMouseLeave = (index: number) => {
    const element = buttonRefs.current[index];
    if (element) {
      const originalText = element.getAttribute('data-text') || '';
      element.textContent = originalText;
    }
  };

  // Keyboard navigation for videos
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === 'ArrowLeft') {
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === 0 ? videos.length - 1 : prevIndex - 1
      );
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videos.length]);

  return (
    <div className="bg-black text-white">
      {/* Fixed Header - Outside of all stacking contexts */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-[9999]">
        {/* Logo */}
        <BcoreLogo 
          width={190} 
          height={40} 
          className="text-bcore-green"
        />

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center">
        <div className="bg-black/40 backdrop-blur-lg rounded-md px-6 py-2 overflow-hidden">
            <div className="flex items-center space-x-8">
              {['Services', 'Insights', 'Labs', 'Careers', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  ref={(el) => { navRefs.current[index] = el; }}
                  data-text={item}
                  className="font-kode text-xs uppercase tracking-wider text-white hover:text-bcore-green transition-colors"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <video
          key={currentVideoIndex}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Text Content */}
        <div ref={heroTextRef} className="absolute bottom-24 left-8 max-w-5xl space-y-6 z-10">
          <h1 
            className="font-jetbrains text-4xl lg:text-5xl font-extralight text-bcore-green uppercase leading-tight"
            style={{wordSpacing: '-0.4em'}}
          >
            Outthink.
            Outbuild.
            Outfight.
          </h1>
          <p 
            className="font-jetbrains font-extralight text-sm text-white max-w-3xl leading-relaxed"
          >
            Bcore delivers rapid mission impact for those charged with protecting the nation—through integrated intelligence, engineering, and tradecraft.
          </p>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div ref={contentRef} className="bg-black">
        {/* Core Values Section */}
        <section className="py-16 lg:py-20">
          <div className="px-8 lg:px-8">
            {/* Mobile Layout - Horizontal Carousel */}
            <div className="block lg:hidden">
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-0"
                onScroll={handleCarouselScroll}
              >
                {[
                  {
                    title: "Velocity",
                    description: "Speed isn't a tactic—it's a weapon. Our systems and teams are built to deliver real outcomes at mission tempo.",
                    image: "/B1.png"
                  },
                  {
                    title: "Precision",
                    description: "From code to strategy, we zero in on what matters and eliminate noise. Clarity leads. Accuracy follows.",
                    image: "/B2.png"
                  },
                  {
                    title: "Human Edge",
                    description: "Our operators, analysts, and engineers bring hard-earned wisdom and instinct you can't teach, and can't fake.",
                    image: "/B3.png"
                  },
                  {
                    title: "Relentless Grit",
                    description: "High-consequence missions don't come with second chances. We go beyond expectation—then go again.",
                    image: "/B4.png"
                  }
                ].map((value, index) => (
                  <div key={index} className="flex-none w-full snap-start">
                    {/* 80% Width Image with Auto Height */}
                    <div className="w-[80%] mb-4">
                      <Image
                        src={value.image}
                        alt={value.title}
                        width={1080}
                        height={600}
                        className="w-full h-auto"
                      />
                    </div>
                    {/* Text */}
                    <div className="w-full">
                      <h3 className="font-jetbrains text-lg font-extralight text-bcore-green uppercase mb-3">
                        {value.title}
                      </h3>
                      <p className="font-jetbrains font-extralight text-xs text-white leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Dot Navigation */}
              <div className="flex justify-between items-center mt-8">
                <div className="flex space-x-2">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-1.5 h-1.5 transition-colors duration-200 ${
                        currentSlide === index ? 'bg-bcore-green' : 'bg-white/30'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="font-jetbrains text-xs">
                  <span className="text-bcore-green">
                    {String(currentSlide + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white">/04</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Layout - Original Grid */}
            <div className="hidden lg:grid grid-cols-4 gap-16">
              {[
                {
                  title: "Velocity",
                  description: "Speed isn't a tactic—it's a weapon. Our systems and teams are built to deliver real outcomes at mission tempo.",
                  image: "/B1.png"
                },
                {
                  title: "Precision",
                  description: "From code to strategy, we zero in on what matters and eliminate noise. Clarity leads. Accuracy follows.",
                  image: "/B2.png"
                },
                {
                  title: "Human Edge",
                  description: "Our operators, analysts, and engineers bring hard-earned wisdom and instinct you can't teach, and can't fake.",
                  image: "/B3.png"
                },
                {
                  title: "Relentless Grit",
                  description: "High-consequence missions don't come with second chances. We go beyond expectation—then go again.",
                  image: "/B4.png"
                }
              ].map((value, index) => (
                <div key={index} className="space-y-8">
                  {/* Value Image */}
                  <div className="w-full h-64 relative">
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-contain object-left-bottom"
                    />
                  </div>
                  <div>
                    <h3 className="font-jetbrains text-xl font-extralight text-bcore-green uppercase mb-4">
                      {value.title}
                    </h3>
                    <p className="font-jetbrains font-extralight text-xs text-white leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider Line */}
        <div className="hidden lg:flex h-32 items-center px-8">
          <svg className="w-full h-0.5" viewBox="0 0 1728 1" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0.5"
              x2="1728"
              y2="0.5"
              stroke="white"
              strokeWidth="0.25"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Services Sections */}
        <div className="space-y-0">
          {[
            {
              category: "Mission Services",
              title: "End-to-end tech. On the ground, in the fight.",
              description: "We deploy integrated teams and tech—fast. From software and systems to infrastructure and ops, we deliver where and when it counts.",
              image: "/Card_MissionStatment.png"
            },
            {
              category: "Insight Solutions",
              title: "See more. Know first. Act faster.",
              description: "We turn raw data into tactical foresight—fusing tradecraft, automation, and intelligence to remove blind spots and unlock action.",
              image: "/Card_insightSolutions.png"
            },
            {
              category: "Bcore Labs",
              title: "Prototype today. Deploy tomorrow.",
              description: "We build, test, and iterate at mission speed. Labs is your proving ground for what's next—no slide decks, just real solutions.",
              image: "/Card_labs.png"
            }
          ].map((service, index) => (
            <div key={index}>
              <section className="w-full">
                {/* Mobile Layout - Vertical Stack */}
                <div className="block lg:hidden px-4 py-8">
                  <div className="space-y-6">
                    {/* Full Width Image - Instagram Portrait Aspect Ratio */}
                    <div className="w-full aspect-[4/5] relative">
                      <Image
                        src={service.image}
                        alt={service.category}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    {/* Full Width Text */}
                    <div className="w-full space-y-4">
                      <div className="font-kode text-xs text-white uppercase tracking-wider">
                        {service.category}
                      </div>
                      <h2 
                        className="font-jetbrains text-2xl font-extralight text-bcore-green uppercase"
                        style={{wordSpacing: '-0.4em'}}
                      >
                        {service.title}
                      </h2>
                      <p className="font-jetbrains font-extralight text-xs text-white leading-relaxed pb-6">
                        {service.description}
                      </p>
                      <button 
                        ref={(el) => { buttonRefs.current[index] = el; }}
                        data-text="Explore Capabilities"
                        className="w-full bg-bcore-green text-black font-jetbrains font-extrabold text-xs uppercase px-4 py-2  cursor-pointer rounded-sm"
                        onMouseEnter={() => handleButtonMouseEnter(index)}
                        onMouseLeave={() => handleButtonMouseLeave(index)}
                      >
                        Explore Capabilities
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Side by Side */}
                <div className="hidden lg:block overflow-clip relative size-full">
                  <div className="flex flex-row gap-16 items-start justify-start px-8 py-0 relative w-full">
                    <div className="flex-1 max-w-[25%]">
                      <div className="flex flex-col gap-4 items-start justify-start p-0 relative">
                        <div className="font-kode text-xs text-white uppercase tracking-wider">
                          {service.category}
                        </div>
                        <h2 
                          className="font-jetbrains text-2xl font-extralight text-bcore-green uppercase"
                          style={{wordSpacing: '-0.4em'}}
                        >
                          {service.title}
                        </h2>
                        <p className="font-jetbrains font-extralight text-xs text-white leading-relaxed mb-6">
                          {service.description}
                        </p>
                        <button 
                          ref={(el) => { buttonRefs.current[index] = el; }}
                          data-text="Explore Capabilities"
                          className="bg-bcore-green text-black font-jetbrains font-extrabold text-xs uppercase px-4 py-2 cursor-pointer rounded-sm"
                          onMouseEnter={() => handleButtonMouseEnter(index)}
                          onMouseLeave={() => handleButtonMouseLeave(index)}
                        >
                          Explore Capabilities
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 max-w-[75%]">
                      <Image
                        src={service.image}
                        alt={service.category}
                        width={800}
                        height={450}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Divider Line */}
              {index < 2 && (
                <div className="h-32 flex items-center px-4 lg:px-8">
                  <svg className="w-full h-0.5" viewBox="0 0 1728 1" preserveAspectRatio="none">
                    <line
                      x1="0"
                      y1="0.5"
                      x2="1728"
                      y2="0.5"
                      stroke="white"
                      strokeWidth="0.25"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Divider Line */}
        <div className="h-32 flex items-center px-16">
          <svg className="w-full h-0.5" viewBox="0 0 1728 1" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0.5"
              x2="1728"
              y2="0.5"
              stroke="white"
              strokeWidth="0.25"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
