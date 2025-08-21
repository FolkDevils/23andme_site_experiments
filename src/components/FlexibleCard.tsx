'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16' | 'custom-square' | 'custom-landscape'
type HeadlineVerticalAlignment = 'top' | 'bottom' | 'centered'
type HeadlineHorizontalAlignment = 'left' | 'centered'

interface FlexibleCardProps {
  aspectRatio: AspectRatio
  imageSrc?: string
  videoSrc?: string
  headline?: string
  headlineVerticalAlignment?: HeadlineVerticalAlignment
  headlineHorizontalAlignment?: HeadlineHorizontalAlignment
  children?: React.ReactNode
  className?: string
}

const aspectRatioClasses = {
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  'custom-square': 'w-full',
  'custom-landscape': 'w-full'
}

export default function FlexibleCard({ 
  aspectRatio, 
  imageSrc, 
  videoSrc, 
  headline, 
  headlineVerticalAlignment = 'bottom',
  headlineHorizontalAlignment = 'left',
  children, 
  className = '' 
}: FlexibleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const cardEl = cardRef.current
    const headlineEl = headlineRef.current
    const videoEl = videoRef.current
    const imageEl = imageRef.current
    const overlayEl = overlayRef.current

    // Set initial states for hover effects
    if (headlineEl) {
      gsap.set(headlineEl, {
        opacity: 1,
        y: 0
      })
    }

    if (overlayEl) {
      gsap.set(overlayEl, {
        opacity: 0
      })
    }

    // Check if card is initially below the fold (not visible on page load)
    const cardRect = cardEl.getBoundingClientRect()
    const isInitiallyVisible = cardRect.top < window.innerHeight

    if (!isInitiallyVisible) {
      // Set initial state for scroll animation - card starts below and faded
      gsap.set(cardEl, {
        y: 120,
        opacity: 0
      })

      // Create scroll-triggered animation only for cards below the fold
      ScrollTrigger.create({
        trigger: cardEl,
        start: "top 85%", // Animation starts when top of card hits 85% down the viewport
        end: "top 60%",   // Animation completes when top of card hits 60% down the viewport
        onEnter: () => {
          gsap.to(cardEl, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power1.out'
          })
        },
        once: true // Only animate once when entering viewport
      })
    } else {
      // Cards already visible should remain in their normal state
      gsap.set(cardEl, {
        y: 0,
        opacity: 1
      })
    }

    const handleMouseEnter = () => {
      // Scale up video/image by 15%
      if (videoEl) {
        gsap.to(videoEl, {
          scale: 1.15,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
      
      if (imageEl) {
        gsap.to(imageEl, {
          scale: 1.15,
          duration: 0.6,
          ease: 'power2.out'
        })
      }

      // Show darkening overlay
      if (overlayEl) {
        gsap.to(overlayEl, {
          opacity: 0.5,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    }

    const handleMouseLeave = () => {
      // Scale back to normal
      if (videoEl) {
        gsap.to(videoEl, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.in'
        })
      }
      
      if (imageEl) {
        gsap.to(imageEl, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.in'
        })
      }

      // Hide darkening overlay
      if (overlayEl) {
        gsap.to(overlayEl, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in'
        })
      }
    }

    cardEl.addEventListener('mouseenter', handleMouseEnter)
    cardEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cardEl.removeEventListener('mouseenter', handleMouseEnter)
      cardEl.removeEventListener('mouseleave', handleMouseLeave)
      // Clean up ScrollTrigger instances for this element
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === cardEl) {
          trigger.kill()
        }
      })
    }
  }, [headline])

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative cursor-pointer ${aspectRatioClasses[aspectRatio]} ${className}`}
      style={
        aspectRatio === 'custom-square' 
          ? { height: 'calc(100vw / 3 - 32px - 90px)' }
          : aspectRatio === 'custom-landscape'
          ? { height: 'calc((100vw - 80px) / 16 * 9 - 300px)' }
          : {}
      }
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : imageSrc ? (
        <div ref={imageRef} className="w-full h-full">
          <Image
            src={imageSrc}
            alt="Card content"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        children
      )}
      
      {/* Darkening overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black pointer-events-none"
      />
      
      {headline && (
        <div 
          className={`absolute left-0 right-0 px-8 py-8 pointer-events-none z-10 ${
            headlineVerticalAlignment === 'top' 
              ? 'top-0' 
              : headlineVerticalAlignment === 'bottom' 
              ? 'bottom-0' 
              : 'top-1/2 -translate-y-1/2'
          } ${
            headlineVerticalAlignment === 'centered' ? 'flex items-center' : ''
          }`}
        >
          <h3 
            ref={headlineRef}
            className={`font-million text-[64px] text-white leading-tight ${
              headlineHorizontalAlignment === 'centered' ? 'text-center w-full' : 'text-left'
            }`}
            style={{ 
              fontFamily: 'Million Serif MM, serif',
              lineHeight: '1.1',
              textShadow: '0 0px 50px rgba(0, 0, 0, 1)',
              WebkitTextStroke: '.8pt white'
            }}
          >
            {headline}
          </h3>
        </div>
      )}
    </div>
  )
}
