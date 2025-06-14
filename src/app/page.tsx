'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Video array and current video state
  const videos = ['/hero.mp4', '/hero_1.mp4'];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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



  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
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
        
        <div className="relative z-10 flex flex-col justify-between h-full p-8">
          {/* Header */}
          <header className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-white">
              <svg className="h-7 w-auto" viewBox="0 0 169 28" fill="none">
                <path
                  d="M21.3103 13.9552L24.1653 10.9215C24.6876 10.3585 24.9293 9.75171 24.9293 8.8844V5.85066C24.9293 5.15645 24.6082 4.42034 24.1653 3.90105L21.4709 0.996672C20.908 0.389924 20.3451 0.129368 19.5405 0.129368H1.1258C0.321194 0.129368 0 0.475561 0 1.34287V26.6532C0 27.5205 0.321194 27.8667 1.1258 27.8667H19.7011C20.5057 27.8667 21.0686 27.6061 21.6315 26.9994L24.4054 24.0094C24.8482 23.532 25.1694 22.7522 25.1694 22.0598V19.2429C25.1694 18.3756 24.9277 17.7688 24.4054 17.2058L21.3103 13.9552ZM3.33845 3.25057H18.9793L21.5926 6.15495L21.6737 8.97186L18.4976 12.4393H3.34014V3.25057H3.33845ZM21.9138 21.7555L19.1804 24.7455H3.33845V15.5568H18.4959L21.9932 19.241L21.9121 21.7555H21.9138Z"
                  fill="white"
                />
                <path
                  d="M54.0797 3.20712H67.9507L70.4828 6.06777C71.0457 6.71825 71.5275 6.71825 72.0515 6.15523L72.9761 5.20229C73.539 4.63927 73.4984 4.11816 72.9761 3.55514L70.4034 0.825681C69.8811 0.262662 69.3182 0.00210666 68.5136 0.00210666H53.7179C52.9133 0.00210666 52.3504 0.262662 51.7875 0.869411L47.2844 5.7234C46.7215 6.33015 46.4798 6.9369 46.4798 7.8042V20.2416C46.4798 21.1089 46.7215 21.7157 47.2438 22.2787L51.8281 27.1764C52.3504 27.7394 52.9133 28 53.7179 28H68.5136C69.3182 28 69.8811 27.7394 70.4034 27.1764L72.9372 24.4889C73.4596 23.9259 73.4596 23.4047 72.9372 22.8417L72.0938 21.8888C71.5714 21.282 71.088 21.3258 70.5251 21.9762L68.0318 24.7932H54.1202L49.8183 20.1997V7.75865L54.0797 3.20712Z"
                  fill="white"
                />
                <path
                  d="M102.63 0.867304C102.067 0.260556 101.504 0 100.699 0H85.4202C84.6156 0 84.0527 0.260556 83.5304 0.823575L78.9073 5.85066C78.385 6.41368 78.1432 7.02043 78.1432 7.88773V20.1521C78.1432 21.0194 78.385 21.6261 78.9073 22.1891L83.571 27.1725C84.0933 27.7355 84.6562 27.9961 85.4608 27.9961H100.699C101.504 27.9961 102.067 27.7355 102.589 27.1725L107.253 22.231C107.775 21.668 108.017 21.0613 108.017 20.194V7.88773C108.017 7.02043 107.775 6.41368 107.212 5.80693L102.628 0.865482L102.63 0.867304ZM104.68 20.1521L100.378 24.7892H85.8242L81.4817 20.0646V7.844L85.7836 3.20684H100.299L104.682 7.93146V20.1539L104.68 20.1521Z"
                  fill="white"
                />
                <path
                  d="M134.627 0.952943C134.104 0.389924 133.542 0.129368 132.737 0.129368H115.247C114.442 0.129368 114.121 0.475561 114.121 1.34287V26.7388C114.121 27.6061 114.483 27.9086 115.287 27.9086H116.253C117.057 27.9086 117.378 27.5187 117.378 26.6514V18.2006H131.692L135.151 21.8849L135.07 26.7826C135.07 27.6061 135.391 27.9523 136.195 27.9523H137.362C138.166 27.9523 138.487 27.6061 138.487 26.7388V21.8849C138.487 21.0176 138.246 20.4108 137.723 19.8478L134.588 16.5098L137.884 13.0424C138.406 12.4793 138.648 11.8726 138.648 11.0053V6.54122C138.648 5.67392 138.406 5.06717 137.884 4.50415L134.627 0.951121V0.952943ZM135.269 11.2239L131.691 15.0375H117.377V3.33803H132.333L135.267 6.50114V11.2258L135.269 11.2239Z"
                  fill="white"
                />
                <path
                  d="M167.857 23.317L167.014 22.4497C166.451 21.8867 166.008 21.9304 165.445 22.5371L163.476 24.7036H148.036V15.6461L163.275 15.6898C164.039 15.6898 164.36 15.3436 164.36 14.4763V13.4359C164.36 12.5686 164.039 12.2224 163.234 12.2224H148.036V3.29429H163.315L165.325 5.54819C165.888 6.19867 166.37 6.19867 166.933 5.54819L167.656 4.76834C168.219 4.16159 168.219 3.59857 167.697 3.03556L165.728 0.954755C165.205 0.391736 164.642 0.13118 163.838 0.13118H145.945C145.141 0.13118 144.819 0.477373 144.819 1.34468V26.655C144.819 27.5223 145.141 27.8685 145.945 27.8685H163.958C164.762 27.8685 165.325 27.608 165.848 27.0449L167.778 25.0079C168.381 24.4011 168.381 23.8818 167.859 23.317H167.857Z"
                  fill="white"
                />
                <path
                  d="M41.9799 3.14853H41.2936C40.7206 3.14853 40.4924 3.42549 40.5211 4.04317L40.5786 6.23329L29.7046 18.4794C29.3039 18.9422 29.1315 19.374 29.1315 19.9899V22.1491C29.1315 22.7667 29.3597 23.0127 29.9328 23.0127H30.6191C31.1921 23.0127 31.3915 22.7358 31.3915 22.1181L31.3628 19.897L42.2081 7.68184C42.6087 7.21903 42.7812 6.7872 42.7812 6.17134V4.01219C42.7812 3.39451 42.553 3.14853 41.9799 3.14853Z"
                  fill="#D6E200"
                />
              </svg>
            </div>

                      {/* Navigation */}
          <nav className="hidden lg:block">
            <div className="flex space-x-8 xl:space-x-14 font-kode text-sm  uppercase tracking-wider">
              {['Who We Are', 'What We Do', 'News & Insights', 'Join Us'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  ref={(el) => { navRefs.current[index] = el; }}
                  data-text={item}
                  className="hover:text-bcore-green transition-colors cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>

            {/* Mobile menu button */}
            <button className="lg:hidden text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Hero Content */}
          <div className="max-w-5xl py-16 space-y-6">
            <h1 
              className="font-jetbrains text-3xl lg:text-5xl font-extralight text-bcore-green uppercase"
              style={{wordSpacing: '-0.4em'}}
            >
              Outthink.
              Outbuild.
              Outfight.
            </h1>
            <p className="font-jetbrains font-extralight text-sm text-white max-w-3xl leading-relaxed">
              Bcore delivers rapid mission impact for those charged with protecting the nation—through integrated intelligence, engineering, and tradecraft.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <section className="py-16 lg:py-20">
                <div className="px-8 lg:px-16">
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
      <div className="hidden lg:flex h-32 items-center px-16">
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
                    <p className="font-jetbrains font-extralight text-xs text-white leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <button 
                      ref={(el) => { buttonRefs.current[index] = el; }}
                      data-text="Explore Capabilities"
                      className="w-full bg-bcore-green text-black font-jetbrains font-extrabold text-xs uppercase px-4 py-2 cursor-pointer"
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
                <div className="flex flex-row gap-16 items-start justify-start px-16 py-0 relative w-full">
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
                        className="bg-bcore-green text-black font-jetbrains font-extrabold text-xs uppercase px-4 py-2 cursor-pointer"
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
              <div className="h-32 flex items-center px-4 lg:px-16">
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
  );
}
