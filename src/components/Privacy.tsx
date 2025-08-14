'use client';

import Image from 'next/image';
import Button from './Button';

interface PrivacyProps {
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

export default function Privacy({
  title = "Privacy and Security by design.",
  description = "There is no advanced science that comes before your privacy. That's why, since day one, we've committed ourselves to protecting your privacy. And if you change your mind, you can opt out at any time, now or in the future. Read more about our protocol to keep your data private, in any scenario.",
  buttonText = "Learn more",
  backgroundImage = "/privacy/Privacy.png",
  backgroundVideo
}: PrivacyProps) {

  return (
    <section className="w-full pb-16">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content - Top on mobile, Right on desktop */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="flex flex-col items-center lg:items-start justify-center py-8 lg:py-16 px-4 lg:px-8">
              <div className="flex flex-col gap-8 items-center lg:items-start text-center lg:text-left w-full">
                {/* Title */}
                <h2 className="font-rialta font-light text-heading-1 text-text-primary tracking-tight">
                  {title}
                </h2>
                
                {/* Description */}
                <p className="font-rialta text-body-copy text-text-secondary leading-relaxed max-w-lg">
                  {description}
                </p>
                
                {/* CTA Button */}
                <Button 
                  variant="outline-dark" 
                  size="medium"
                  className="border-text-primary text-text-primary hover:bg-text-primary hover:text-white"
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>

          {/* Media - Bottom on mobile, Left on desktop */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
              {backgroundVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={backgroundVideo} type="video/mp4" />
                  {/* Fallback to image if video fails */}
                  <Image
                    src={backgroundImage}
                    alt="Privacy by design"
                    fill
                    className="object-cover"
                    priority
                  />
                </video>
              ) : (
                <Image
                  src={backgroundImage}
                  alt="Privacy by design"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 