'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function EmailCapture({
  title = "Stay in the know.",
  subtitle = "Keep up-to-date with new discoveries and exclusive promotions on our DNA testing kits and services.",
  placeholder = "Email Address",
  buttonText = "Sign up"
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
    // Reset form
    setEmail('');
  };

  return (
    <section 
      className="w-full relative"
      style={{
        background: 'linear-gradient(135deg, #4A1672 0%, #B4A0FF 100%)'
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-10 lg:px-[200px]">
          {/* Content */}
          <div className="flex flex-col gap-6 items-center text-center w-full">
            {/* Title */}
            <div className="flex flex-row gap-4 items-center justify-center w-full">
              <h2 className="font-rialta font-extralight text-white text-email-capture-title tracking-tight">
                {title}
              </h2>
            </div>
            
            {/* Subtitle */}
            <div className="w-full">
              <p className="font-rialta text-white text-center text-email-capture-subtitle max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          </div>
          
          {/* Email Form */}
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-white rounded-[78px] h-14 flex items-center pl-6 pr-2 py-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="flex-1 bg-transparent outline-none font-rialta text-gray-500 placeholder-gray-500"
                  style={{
                    fontSize: 'var(--font-size-email-capture-input)',
                    lineHeight: 'var(--line-height-email-capture-input)'
                  }}
                />
                <button
                  type="submit"
                  className="bg-transparent border border-[#282828] text-[#282828] rounded-[60px] px-6 py-2 font-rialta transition-colors hover:bg-[#282828] hover:text-white"
                  style={{
                    fontSize: 'var(--font-size-email-capture-button)',
                    lineHeight: 'var(--line-height-email-capture-button)'
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 