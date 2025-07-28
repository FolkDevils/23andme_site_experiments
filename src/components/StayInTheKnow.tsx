'use client';

import { useState } from 'react';

export default function StayInTheKnow() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Add your email submission logic here
    console.log('Email submitted:', email);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      // You could show a success message here
    }, 1000);
  };

  return (
    <section className="relative w-full">
      {/* Gradient Background - matching your reference */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#4A1672] to-[#B4A0FF]"
        style={{
          background: 'linear-gradient(90deg, #4A1672 0%, #B4A0FF 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] px-4 py-16 md:py-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="text-center mb-10 space-y-6">
            {/* Main Heading */}
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight">
              Stay in the know.
            </h2>
            
            {/* Description */}
            <div className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              <p>
                Keep up-to-date with new discoveries and exclusive
                <br className="hidden sm:block" />
                promotions on our DNA testing kits and services.
              </p>
            </div>
          </div>

          {/* Email Signup Form */}
          <div className="flex justify-center">
            <form 
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white rounded-full p-2 flex items-center gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 px-4 py-2 text-gray-600 placeholder-gray-500 bg-transparent border-none outline-none text-base"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="px-6 py-2 bg-transparent border border-gray-800 rounded-full text-gray-800 text-base font-normal hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[141px]"
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 