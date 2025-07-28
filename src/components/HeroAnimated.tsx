'use client';

import Button from './Button';

interface HeadlineSegment {
  text: string;
  pilled?: boolean;
}

interface HeadlineData {
  eyebrow: string;
  lines: HeadlineSegment[][];
  subheadline: string;
}

interface HeroAnimatedProps {
  headlineData: HeadlineData;
  heroTheme: 'Gradient' | 'White';
}

export default function HeroAnimated({ headlineData, heroTheme }: HeroAnimatedProps) {
  const isWhiteTheme = heroTheme === 'White';

  // Define theme-based styles
  const textColor = isWhiteTheme ? 'text-text-primary' : 'text-white';
  const eyebrowColor = isWhiteTheme ? 'text-text-secondary' : 'text-white';

  let pillCount = 0;

  return (
    <div className="relative w-full h-[700px] md:h-[550px] lg:h-[700px] overflow-hidden">
      {/* Animated Background */}
      {!isWhiteTheme && (
        <div className="absolute inset-0 overflow-hidden">
          {/* SVG Filter for Goo Effect */}
          <svg className="fixed top-0 left-0 w-0 h-0">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

          {/* Base gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(40deg, var(--hero-bg1, rgb(46, 17, 91)), var(--hero-bg2, rgb(74, 31, 153)))'
            }}
          />

          {/* Gradient blobs container */}
          <div 
            className="absolute inset-0 w-full h-full hero-blob-container"
            style={{
              filter: 'url(#goo) blur(var(--hero-blur, 60px))'
            }}
          >
            {/* Blob 1 - Controllable */}
            <div 
              className="absolute hero-blob-1"
              style={{
                background: `radial-gradient(circle at center, color-mix(in srgb, var(--hero-blob1-color, #FF6D19) calc(var(--hero-blob1-opacity, 0.8) * 100%), transparent) 0%, transparent 60%)`,
                mixBlendMode: 'var(--hero-blob1-blend, hard-light)' as React.CSSProperties['mixBlendMode'],
                width: '160%',
                height: '160%',
                top: 'calc(50% - 80%)',
                left: 'calc(50% - 80%)',
                transformOrigin: 'center center',
                animation: 'moveVertical var(--hero-blob1-duration, 30s) ease infinite'
              }}
            />

            {/* Blob 2 - Controllable */}
            <div 
              className="absolute hero-blob-2"
              style={{
                background: `radial-gradient(circle at center, color-mix(in srgb, var(--hero-blob2-color, #D50F67) calc(var(--hero-blob2-opacity, 0.8) * 100%), transparent) 0%, transparent 60%)`,
                mixBlendMode: 'var(--hero-blob2-blend, color-dodge)' as React.CSSProperties['mixBlendMode'],
                width: '160%',
                height: '160%',
                top: 'calc(50% - 80%)',
                left: 'calc(50% - 80%)',
                transformOrigin: 'calc(50% - 400px)',
                animation: 'moveInCircle var(--hero-blob2-duration, 20s) reverse infinite'
              }}
            />

            {/* Blob 3 - Controllable */}
            <div 
              className="absolute hero-blob-3"
              style={{
                background: `radial-gradient(circle at center, color-mix(in srgb, var(--hero-blob3-color, #6F3598) calc(var(--hero-blob3-opacity, 0.7) * 100%), transparent) 0%, transparent 60%)`,
                mixBlendMode: 'var(--hero-blob3-blend, overlay)' as React.CSSProperties['mixBlendMode'],
                width: '160%',
                height: '160%',
                top: 'calc(50% - 80% + 200px)',
                left: 'calc(50% - 80% - 500px)',
                transformOrigin: 'calc(50% + 400px)',
                animation: 'moveInCircle var(--hero-blob3-duration, 40s) linear infinite'
              }}
            />

            {/* Blob 4 - Controllable */}
            <div 
              className="absolute hero-blob-4"
              style={{
                background: `radial-gradient(circle at center, color-mix(in srgb, var(--hero-blob4-color, #FF4081) calc(var(--hero-blob4-opacity, 0.6) * 100%), transparent) 0%, transparent 65%)`,
                mixBlendMode: 'var(--hero-blob4-blend, screen)' as React.CSSProperties['mixBlendMode'],
                width: '160%',
                height: '160%',
                top: 'calc(50% - 80%)',
                left: 'calc(50% - 80%)',
                transformOrigin: 'calc(50% - 200px)',
                animation: 'moveHorizontal var(--hero-blob4-duration, 40s) ease infinite'
              }}
            />

            {/* Blob 5 - Controllable */}
            <div 
              className="absolute hero-blob-5"
              style={{
                background: `radial-gradient(circle at center, color-mix(in srgb, var(--hero-blob5-color, #8A2BE2) calc(var(--hero-blob5-opacity, 0.5) * 100%), transparent) 0%, transparent 70%)`,
                mixBlendMode: 'var(--hero-blob5-blend, multiply)' as React.CSSProperties['mixBlendMode'],
                width: '320%',
                height: '320%',
                top: 'calc(50% - 160%)',
                left: 'calc(50% - 160%)',
                transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
                animation: 'moveInCircle var(--hero-blob5-duration, 20s) ease infinite'
              }}
            />
          </div>
        </div>
      )}
      
      {/* White theme background */}
      {isWhiteTheme && (
        <div 
          className="absolute inset-0"
          style={{ background: '#FFFFFF' }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center h-full z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 items-center max-w-8xl mx-auto">
            {/* Eyebrow text */}
            <div className={`font-rialta font-semibold text-eyebrow-text text-center leading-none ${eyebrowColor}`}>
              {headlineData.eyebrow}
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 items-center justify-evenly justify-center w-full px-4 md:px-6 lg:px-0">
              {headlineData.lines.map((line, lineIndex) => (
                <div key={lineIndex} className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 items-center justify-center">
                  {line.map((segment, segmentIndex) => {
                    if (segment.pilled) {
                      pillCount++;
                      const pillStyle = isWhiteTheme ? {
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #92C746 0%, #0081A5 26%, #00B5B5 100%) border-box',
                        border: '2px solid transparent'
                      } : {
                        background: 'rgba(255, 255, 255, 0.02)',
                      };
                      
                      if (isWhiteTheme && pillCount > 1) {
                        pillStyle.background = 'linear-gradient(white, white) padding-box, linear-gradient(90deg, var(--color-brand-orange) 0%, var(--color-primary) 75%, #6F3598 100%) border-box';
                      }

                      const borderClass = isWhiteTheme ? '' : 'border-2 border-white';

                      return (
                        <div key={segmentIndex} className={`backdrop-blur-[50px] h-[46px] md:h-[60px] lg:h-20 rounded-full relative ${borderClass}`} style={pillStyle}>
                          <div className="flex items-center justify-center h-full px-4 md:px-6 lg:px-7">
                            <div className={`font-rialta font-light text-hero-pills uppercase leading-none ${isWhiteTheme ? 'bg-clip-text text-transparent' : textColor} tracking-[-0.6px] md:tracking-[-0.9px] lg:tracking-[-1.2px] text-center`}
                              style={isWhiteTheme ? {
                                backgroundImage: pillCount === 1 
                                  ? 'linear-gradient(90deg, #92C746 0%, #0081A5 26%, #00B5B5 100%)' 
                                  : 'linear-gradient(90deg, var(--color-brand-orange) 0%, var(--color-primary) 75%, #6F3598 100%)',
                              } : {}}
                            >
                              {segment.text}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return (
                      <div key={segmentIndex} className={`font-rialta font-extralight text-hero-header text-center ${textColor}`}>
                        {segment.text}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Subheadline */}
            <div className={`font-rialta text-button-text md:text-body-copy lg:text-body-copy text-center max-w-sm md:max-w-2xl lg:max-w-3xl leading-6 ${eyebrowColor} tracking-tight`}>
              {headlineData.subheadline}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 pt-4 items-start">
              <Button 
                variant={isWhiteTheme ? "outline-dark" : "primary"} 
                size="medium"
                className={isWhiteTheme ? "!bg-primary !text-white !border-primary hover:!bg-[#B8095A]" : ""}
              >
                Shop now
              </Button>
              <Button variant={isWhiteTheme ? "outline-dark" : "outline"} size="medium">Learn More</Button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes moveInCircle {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes moveVertical {
          0% {
            transform: translateY(-50%);
          }
          50% {
            transform: translateY(50%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes moveHorizontal {
          0% {
            transform: translateX(-50%) translateY(-10%);
          }
          50% {
            transform: translateX(50%) translateY(10%);
          }
          100% {
            transform: translateX(-50%) translateY(-10%);
          }
        }
      `}</style>
    </div>
  );
} 