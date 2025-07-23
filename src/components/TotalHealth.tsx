'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './Button';

interface TotalHealthProps {
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
}

export default function TotalHealth({
  title = "Total Health is a next gen longevity platform built with the tools to not only help you live more years, but to live more healthy years. Discover a new take on growing older.",
  description = title,
  buttonText = "Learn more",
  backgroundImage = "/totalhealth/TH_Desktop.png",
  mobileBackgroundImage = "/totalhealth/TH_Mobile.png"
}: TotalHealthProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full pb-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div 
          className="relative h-[700px] md:h-[600px] lg:h-[600px] rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url("${isMobile ? mobileBackgroundImage : backgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#6b7280' // Fallback gray color
          }}
        >
          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 md:p-8 lg:p-16 flex items-start md:items-end ">
            <div 
              className="relative rounded-2xl p-6 md:p-8 lg:p-16 max-w-md lg:max-w-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(25px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(25px) saturate(1.8)',
                border: '.5px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), inset 0 .5px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Glass reflection overlay */}
        
              
              {/* Frost effect edge */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                }}
              />
              
              {/* Content container */}
              <div className="relative z-10">
                {/* Logo */}
                <div className="mb-6">
                  <Image
                    src="/totalhealth/THLogo.svg"
                    alt="23andMe+ Total Health"
                    width={270}
                    height={93}
                    className="w-48 md:w-60 lg:w-[270px] h-auto"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="font-rialta text-totalhealth-text text-white leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* CTA Button */}
                <Button 
                  variant="outline" 
                  size="medium"
                  className="border-white text-white hover:bg-white hover:text-text-primary"
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 