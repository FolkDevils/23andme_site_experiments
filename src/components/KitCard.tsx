'use client';

import Image from 'next/image';
import Button from './Button';

interface KitCardProps {
  type: 'ancestry' | 'healthancestry' | 'premium' | 'totalhealth';
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  fsaEligible?: boolean;
  imageSrc: string;
}

export default function KitCard({
  type,
  title,
  subtitle,
  description,
  fsaEligible = false,
  imageSrc
}: KitCardProps) {
  const gradientColors = {
    ancestry: 'bg-gradient-to-r from-[#0081A5] via-[#0081A5] to-[#00B5B5]',
    healthancestry: 'bg-gradient-to-r from-[#D50F67] to-[#D282E6]',
    premium: 'bg-gradient-to-r from-[#D12F11] to-[#D50F67]',
    totalhealth: 'bg-gradient-to-r from-[#FF6D19] to-[#D12F11]'
  };

  // Removed discount styles since discount touts are no longer displayed

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 h-[584px] w-full overflow-hidden relative group cursor-pointer"
    >
      <div className="px-5 py-6 h-full flex flex-col justify-between relative z-10">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 -translate-y-10">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover scale-[115%] transition-transform duration-300 ease-out group-hover:scale-[125%]"
          />
        </div>

        {/* Top Content */}
        <div className="flex flex-col gap-2.5 relative z-20">
          <p className="font-rialta text-card-eyebrow text-text-primary">
            {title}
          </p>
          <p 
            className={`font-rialta text-card-header ${gradientColors[type]} bg-clip-text text-transparent`}
          >
            {subtitle}
          </p>
          <p className="font-rialta text-caption-text text-text-secondary max-w-[280px]">
            {description}
          </p>
        </div>

        {/* Bottom Content */}
        <div className="flex flex-col gap-6 relative z-20">
          {/* Price Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-end">
              <p className="font-rialta text-price-text text-text-primary">
                $XX
              </p>
            </div>
            {fsaEligible && (
              <p className="font-rialta text-caption-text text-text-muted/80">
                FSA/HSA Eligible
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-start">
            <Button 
              variant="outline-dark" 
              size="medium"
              className="group-hover:bg-primary group-hover:text-white group-hover:border-primary"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 