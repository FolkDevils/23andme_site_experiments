'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from './Button';

interface NavigationProps {
  onLogoClick: () => void;
}

export default function Navigation({ onLogoClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white relative w-full">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-row items-center justify-between px-10 py-2">
        {/* Left Side */}
        <div className="flex flex-row items-center gap-5">
          {/* Logo */}
          <button onClick={onLogoClick} className="block relative w-[69px] h-10">
            <Image
              src="/23andme-logo.svg"
              alt="23andMe Logo"
              fill
              className="object-contain"
              priority
            />
          </button>

          {/* Main Navigation */}
          <div className="flex flex-row gap-6 items-center">
            {/* Shop Dropdown */}
            <Button variant="text" size="small">
              <div className="flex items-center gap-1">
                Shop
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M8.23425 0.234284C8.54665 -0.0781151 9.05268 -0.0780741 9.36511 0.234284C9.67753 0.546703 9.67753 1.05272 9.36511 1.36514L5.36511 5.36514C5.05268 5.67749 4.54664 5.67754 4.23425 5.36514L0.234247 1.36514C-0.0780864 1.05274 -0.0780783 0.546689 0.234247 0.234284C0.546646 -0.0781151 1.05268 -0.0780741 1.36511 0.234284L4.79968 3.66885L8.23425 0.234284Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Button>

            {/* Total Health */}
            <Button variant="text" size="small">
              Total Health
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button variant="text" size="small">Sign in</Button>
          <Button variant="text" size="small">Register kit</Button>
          <Button variant="text" size="small">Help</Button>
          <Button variant="outline-dark" size="small">Shop</Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex flex-row items-center justify-between px-6 py-2">
        <div className="flex flex-row gap-6 items-center">
          {/* Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-11 h-11 flex items-center justify-center"
          >
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path
                d="M25.666 18.334C26.6785 18.334 27.5 19.1545 27.5 20.167C27.4998 21.1794 26.6784 22 25.666 22H1.83301C0.82073 21.9998 0.000153469 21.1793 0 20.167C0 19.1546 0.820636 18.3342 1.83301 18.334H25.666ZM25.666 9.16699C26.6785 9.16699 27.5 9.9875 27.5 11C27.5 12.0125 26.6785 12.833 25.666 12.833H1.83301C0.820635 12.8328 0 12.0124 0 11C2.2147e-05 9.98761 0.820649 9.16717 1.83301 9.16699H25.666ZM25.666 0C26.6784 0 27.4998 0.820654 27.5 1.83301C27.5 2.84553 26.6785 3.66602 25.666 3.66602H1.83301C0.820636 3.66584 0 2.84542 0 1.83301C0.000197881 0.820763 0.820758 0.000175863 1.83301 0H25.666Z"
                fill="currentColor"
                className="text-text-muted"
              />
            </svg>
          </button>

          {/* Mobile Logo */}
          <button onClick={onLogoClick} className="block relative w-[71px] h-8">
            <Image
              src="/23andme-logo.svg"
              alt="23andMe Logo"
              fill
              className="object-contain"
              priority
            />
          </button>
        </div>

        {/* Mobile Shop Button */}
        <Button variant="outline-dark" size="small">Shop</Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 pt-20">
          <div className="flex flex-col gap-6 px-6">
            <Button variant="text" size="large" fullWidth className="justify-start">
              Shop
            </Button>
            <Button variant="text" size="large" fullWidth className="justify-start">
              Total Health
            </Button>
            <Button variant="text" size="large" fullWidth className="justify-start">
              Sign in
            </Button>
            <Button variant="text" size="large" fullWidth className="justify-start">
              Register kit
            </Button>
            <Button variant="text" size="large" fullWidth className="justify-start">
              Help
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
} 