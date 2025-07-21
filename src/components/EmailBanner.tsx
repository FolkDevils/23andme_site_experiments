'use client';

import { useState } from 'react';

export default function EmailBanner() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#f2f5f7] w-full relative">
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 lg:right-6 lg:top-6"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#939393]">
          <path
            d="M10.1406 0.242188C10.4628 -0.0799832 10.9854 -0.0799596 11.3076 0.242188C11.6295 0.564321 11.6295 1.08607 11.3076 1.4082L6.94043 5.77441L11.3076 10.1416L11.3643 10.2041C11.6283 10.528 11.6093 11.0056 11.3076 11.3076C10.9854 11.6298 10.4628 11.6298 10.1406 11.3076L5.77441 6.94141L1.40723 11.3086L1.34473 11.3652C1.02076 11.6292 0.543157 11.6103 0.241211 11.3086C-0.0808712 10.9865 -0.0807647 10.4638 0.241211 10.1416L4.60742 5.77441L0.241211 1.4082C-0.0806437 1.08599 -0.0808623 0.563284 0.241211 0.241211C0.563242 -0.0805045 1.0851 -0.0803508 1.40723 0.241211L5.77441 4.6084L10.1406 0.242188Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-4 lg:gap-8 p-6 lg:py-4 lg:px-[72px]">
        {/* Promotional Text */}
        <p className="font-rialta font-normal text-[16px] text-[#555555] text-center lg:text-left leading-[1.4] tracking-[-0.16px] w-full lg:w-auto">
          Celebrate DNA Day with 40% off our Health + Ancestry Service.
          Offer ends April 25. Limit 3.
        </p>
        
        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-auto">
          <div className="bg-white flex flex-row items-center justify-between gap-0.5 p-2 rounded-[88px] w-full lg:w-[360px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-grow font-rialta font-normal text-[16px] text-[#6b6b6b] tracking-[-0.16px] leading-[1.4] bg-transparent outline-none text-center lg:text-left px-4"
            />
            <button
              type="submit"
              className="shrink-0 w-8 h-8 relative flex items-center justify-center"
            >
              <div className="absolute inset-0">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <rect
                    x="0.636364"
                    y="0.636364"
                    width="32.7273"
                    height="32.7273"
                    rx="16.3636"
                    fill="white"
                  />
                  <rect
                    x="0.636364"
                    y="0.636364"
                    width="32.7273"
                    height="32.7273"
                    rx="16.3636"
                    stroke="#282828"
                    strokeWidth="0.727273"
                  />
                  <path
                    d="M17.2812 9.69773C17.5651 9.41379 18.0255 9.41392 18.3095 9.69773L25.0976 16.4858C25.3816 16.7698 25.3816 17.2301 25.0976 17.5141L18.3095 24.3022C18.0255 24.5861 17.5652 24.5862 17.2812 24.3022C16.9975 24.0182 16.9983 23.5578 17.2822 23.2739L22.8173 17.7387H9.41693C9.0154 17.7387 8.6896 17.4137 8.68939 17.0122C8.68958 16.6107 9.01539 16.2846 9.41693 16.2846H22.8398L17.2812 10.727C16.9972 10.443 16.9972 9.98175 17.2812 9.69773Z"
                    fill="#282828"
                  />
                </svg>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 