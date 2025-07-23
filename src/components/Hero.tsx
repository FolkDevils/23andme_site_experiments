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

interface HeroProps {
  headlineData: HeadlineData;
  heroTheme: 'Gradient' | 'White';
}

export default function Hero({ headlineData, heroTheme }: HeroProps) {
  const isWhiteTheme = heroTheme === 'White';

  // Define theme-based styles
  const containerStyle = {
    background: isWhiteTheme ? '#FFFFFF' : 'linear-gradient(88deg, var(--color-brand-orange) -6.71%, var(--color-primary) 44.12%, #6F3598 105.15%)'
  };
  const textColor = isWhiteTheme ? 'text-text-primary' : 'text-white';
  const eyebrowColor = isWhiteTheme ? 'text-text-secondary' : 'text-white';

  let pillCount = 0;

  return (
    <div 
      className="relative w-full h-[700px] md:h-[550px] lg:h-[600px]" 
      style={containerStyle}
    >
      <div className="relative flex items-center justify-center h-full">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 items-center max-w-4xl mx-auto">
            {/* Eyebrow text */}
            <div className={`font-rialta font-semibold text-eyebrow-text text-center leading-none ${eyebrowColor}`}>
              {headlineData.eyebrow}
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 items-center justify-center w-full px-4 md:px-6 lg:px-0">
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
    </div>
  );
} 