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
  price,
  originalPrice,
  discount,
  fsaEligible = false,
  imageSrc
}: KitCardProps) {
  const gradientColors = {
    ancestry: 'bg-gradient-to-r from-[#0081A5] via-[#0081A5] to-[#00B5B5]',
    healthancestry: 'bg-gradient-to-r from-[#D50F67] to-[#D282E6]',
    premium: 'bg-gradient-to-r from-[#D12F11] to-[#D50F67]',
    totalhealth: 'bg-gradient-to-r from-[#FF6D19] to-[#D12F11]'
  };

  const discountBgColors = {
    ancestry: 'bg-[#e5f8f8] text-[#0e8c8c]',
    healthancestry: 'bg-[rgba(255,180,100,0.1)] text-[#d12f11]',
    premium: 'bg-[rgba(255,180,100,0.1)] text-[#d12f11]',
    totalhealth: ''
  };

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[rgba(40,40,40,0.1)] h-[584px] w-full overflow-hidden relative"
    >
      <div className="px-5 py-6 h-full flex flex-col justify-between relative z-10">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 -translate-y-10">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover scale-[115%]"
          />
        </div>

        {/* Top Content */}
        <div className="flex flex-col gap-2.5 relative z-20">
          <p className="font-rialta text-[12px] text-[#282828] tracking-[-0.12px] leading-[16px]">
            {title}
          </p>
          <p 
            className={`font-rialta text-[33px] tracking-[-1.32px] leading-[1.1] ${gradientColors[type]} bg-clip-text text-transparent`}
          >
            {subtitle}
          </p>
          <p className="font-rialta text-[12px] text-[#555555] tracking-[-0.12px] leading-[16px] max-w-[280px]">
            {description}
          </p>
        </div>

        {/* Bottom Content */}
        <div className="flex flex-col gap-6 relative z-20">
          {/* Price Section */}
          <div className="flex flex-col gap-2">
            {originalPrice && (
              <p className="font-rialta text-[24px] text-[#939393] tracking-[-0.96px] line-through">
                ${originalPrice}
              </p>
            )}
            <div className="flex flex-row gap-2 items-end">
              <p className="font-rialta font-light text-[36px] text-[#282828] tracking-[-1.08px] leading-[40px]">
                ${price}
              </p>
              {discount && (
                <div className={`backdrop-blur-[25px] px-[15px] py-1 rounded-[19.789px] ${discountBgColors[type]}`}>
                  <p className="font-rialta text-[15px] tracking-[-0.3px] uppercase leading-none">
                    {discount}% OFF
                  </p>
                </div>
              )}
            </div>
            {fsaEligible && (
              <p className="font-rialta text-[12px] text-[#9c9ea1] tracking-[-0.24px] leading-none">
                FSA/HSA Eligible
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-start">
            <Button variant="outline-dark" size="medium">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 