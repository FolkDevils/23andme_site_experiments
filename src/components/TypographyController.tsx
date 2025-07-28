'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FontProperties {
  size: number;
  lineHeight: number;
  mobileSize?: number;
  tabletSize?: number;
  desktopSize?: number;
}

interface FontState {
  [key: string]: FontProperties;
}

interface TypographyControllerProps {
  isVisible: boolean;
}

export default function TypographyController({
  isVisible,
}: TypographyControllerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Load persisted component selection from localStorage
  const [selectedComponent, setSelectedComponent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fontController-selectedComponent') || 'hero';
    }
    return 'hero';
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Default font values - SINGLE SOURCE OF TRUTH
  const defaultFonts: FontState = useMemo(() => ({
    'button-text': { size: 14, lineHeight: 1.25, mobileSize: 12, tabletSize: 14, desktopSize: 14 },
    'body-copy': { size: 16, lineHeight: 1.5 },
    'caption-text': { size: 12, lineHeight: 1.25 },
    'card-eyebrow': { size: 12, lineHeight: 1 },
    'card-header': { size: 33, lineHeight: 1.1 },
    'disclaimer-text': { size: 10, lineHeight: 1.33, mobileSize: 9, tabletSize: 10, desktopSize: 10 },
    'email-capture-title': { size: 60, lineHeight: 1, mobileSize: 36, tabletSize: 48, desktopSize: 60 },
    'email-capture-subtitle': { size: 20, lineHeight: 1.4, mobileSize: 16, tabletSize: 18, desktopSize: 20 },
    'email-capture-input': { size: 16, lineHeight: 1.375 },
    'email-capture-button': { size: 16, lineHeight: 1.375 },
    'eyebrow-text': { size: 16, lineHeight: 1 },
    'faq-title': { size: 40, lineHeight: 1.1, mobileSize: 32, tabletSize: 36, desktopSize: 40 },
    'faq-question': { size: 16, lineHeight: 1.4 },
    'faq-answer': { size: 16, lineHeight: 1.4 },
    'heading-1': { size: 36, lineHeight: 1.1 },
    'hero-header': { size: 80, lineHeight: 1, mobileSize: 40, tabletSize: 60, desktopSize: 80 },
    'hero-pills': { size: 60, lineHeight: 1, mobileSize: 30, tabletSize: 45, desktopSize: 60 },
    'kit-header': { size: 36, lineHeight: 1.1, mobileSize: 24, tabletSize: 30, desktopSize: 36 },
    'kit-pills': { size: 28, lineHeight: 1, mobileSize: 19, tabletSize: 22, desktopSize: 28 },
    'price-text': { size: 36, lineHeight: 1.1 },
    'price-small': { size: 24, lineHeight: 1 },
    'quote-text': { size: 40, lineHeight: 1.2, mobileSize: 24, tabletSize: 32, desktopSize: 40 },
    'story-link': { size: 16, lineHeight: 1.5, mobileSize: 14, tabletSize: 15, desktopSize: 16 },
    'totalhealth-text': { size: 16, lineHeight: 1.4 }
  }), []);
  
  const [fonts, setFonts] = useState<FontState>(defaultFonts);

  // Update fonts state when defaultFonts changes in code
  useEffect(() => {
    setFonts(defaultFonts);
  }, [defaultFonts]);

  // Component to font mapping
  const componentFonts = {
    'navigation': ['button-text'],
    'hero': ['eyebrow-text', 'hero-header', 'hero-pills'],
    'email-banner': ['body-copy'],
    'kit-section': ['kit-header', 'kit-pills', 'card-eyebrow', 'card-header', 'caption-text', 'price-text', 'price-small', 'button-text'],
    'service-carousel': ['eyebrow-text', 'heading-1', 'body-copy', 'button-text', 'quote-text', 'story-link'],
    'totalhealth': ['totalhealth-text', 'button-text'],
    'privacy': ['heading-1', 'body-copy', 'button-text'],
    'faq': ['faq-title', 'faq-question', 'faq-answer'],
    'email-capture': ['email-capture-title', 'email-capture-subtitle', 'email-capture-input', 'email-capture-button'],
    'footer': ['disclaimer-text']
  };

  const componentLabels = {
    'navigation': 'Navigation',
    'hero': 'Hero',
    'email-banner': 'Email Banner', 
    'kit-section': 'Kit Section',
    'service-carousel': 'Service Carousel',
    'totalhealth': 'Total Health',
    'privacy': 'Privacy',
    'faq': 'FAQ',
    'email-capture': 'Email Capture',
    'footer': 'Footer'
  };

  // Responsive fonts that have different sizes per breakpoint
  const responsiveFonts = useMemo(() => ['hero-header', 'hero-pills', 'kit-header', 'kit-pills', 'quote-text', 'story-link', 'button-text', 'faq-title', 'email-capture-title', 'email-capture-subtitle', 'disclaimer-text'], []);

  // Get fonts for selected component
  const fontsToShow = componentFonts[selectedComponent as keyof typeof componentFonts] || [];

  // Detect screen size changes
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 768) {
        setCurrentBreakpoint('mobile');
      } else if (window.innerWidth < 1024) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Save selected component to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fontController-selectedComponent', selectedComponent);
    }
  }, [selectedComponent]);

  useEffect(() => {
    const root = document.documentElement
    for (const [name, properties] of Object.entries(fonts)) {
      if (responsiveFonts.includes(name)) {
        // Set responsive font sizes
        root.style.setProperty(`--font-size-${name}-mobile`, `${properties.mobileSize || properties.size}px`)
        root.style.setProperty(`--font-size-${name}-tablet`, `${properties.tabletSize || properties.size}px`)
        root.style.setProperty(`--font-size-${name}-desktop`, `${properties.desktopSize || properties.size}px`)
      } else {
        root.style.setProperty(`--font-size-${name}`, `${properties.size}px`)
      }
      root.style.setProperty(`--line-height-${name}`, `${properties.lineHeight}`)
    }
  }, [fonts, responsiveFonts])

  const handleFontChange = (name: string, prop: string, value: number) => {
    // Validate that the value is a valid number
    if (isNaN(value) || !isFinite(value)) {
      return; // Don't update if the value is invalid
    }
    
    setFonts((prevFonts) => ({
      ...prevFonts,
      [name]: {
        ...prevFonts[name],
        [prop]: value,
      },
    }))
  }

  const handleInputChange = (name: string, prop: string, inputValue: string) => {
    const parsedValue = parseFloat(inputValue);
    
    // Only update if we have a valid number
    if (!isNaN(parsedValue) && isFinite(parsedValue)) {
      handleFontChange(name, prop, parsedValue);
    }
  }

  const getCurrentSize = (fontName: string, properties: FontProperties) => {
    if (!responsiveFonts.includes(fontName)) return properties.size;
    
    switch (currentBreakpoint) {
      case 'mobile': return properties.mobileSize || properties.size;
      case 'tablet': return properties.tabletSize || properties.size;
      case 'desktop': return properties.desktopSize || properties.size;
      default: return properties.size;
    }
  };

  const getCurrentSizeProp = (fontName: string) => {
    if (!responsiveFonts.includes(fontName)) return 'size';
    
    switch (currentBreakpoint) {
      case 'mobile': return 'mobileSize';
      case 'tablet': return 'tabletSize';
      case 'desktop': return 'desktopSize';
      default: return 'size';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset.x, dragOffset.y]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  // Always run the CSS variable setting logic, but only show UI when visible
  if (!isVisible) {
    return null;
  }

  const style = position.x !== 0 || position.y !== 0 
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : {};

  return (
    <div 
      ref={panelRef}
      className={`fixed ${position.x === 0 && position.y === 0 ? 'top-[340px] right-2' : ''} bg-gray-900 text-white p-3 rounded shadow-xl w-72 space-y-3 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border border-gray-700 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      style={{ fontFamily: 'system-ui, sans-serif', ...style }}
      onMouseDown={handleMouseDown}
    >
      <h2 className="text-sm font-bold border-b border-gray-700 pb-1 text-white" style={{ fontSize: '14px', lineHeight: '1.2' }}>Typography</h2>
      
      <div className="space-y-2">
        <div>
          <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '11px' }}>Component</label>
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-full h-6 bg-gray-800 border-gray-600 text-white text-xs" style={{ fontSize: '11px' }}>
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {Object.entries(componentLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-gray-700 text-xs" style={{ fontSize: '11px' }}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(selectedComponent === 'hero' || selectedComponent === 'kit-section') && (
          <div className="bg-gray-800 rounded px-2 py-1">
            <label className="text-gray-200 text-xs block" style={{ fontSize: '10px' }}>Current Screen: <span className="text-blue-400 font-semibold">{currentBreakpoint.charAt(0).toUpperCase() + currentBreakpoint.slice(1)}</span></label>
            <p className="text-gray-400 text-xs" style={{ fontSize: '9px' }}>Resize window to adjust different breakpoints</p>
          </div>
        )}
      </div>

      {fontsToShow.map((fontName) => {
        const properties = fonts[fontName];
        return (
          <div key={fontName} className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-100" style={{ fontSize: '11px', lineHeight: '1.3' }}>{fontName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <div className="space-y-1">
              <label className="text-gray-200 text-xs" style={{ fontSize: '10px' }}>Size: {getCurrentSize(fontName, properties)}px</label>
              <Input
                type="number"
                step={1}
                value={getCurrentSize(fontName, properties)}
                onChange={(e) => handleInputChange(fontName, getCurrentSizeProp(fontName), e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 h-6 text-xs px-1"
                style={{ fontSize: '11px' }}
              />
            </div>
            <div>
              <label className="text-gray-200 text-xs block" style={{ fontSize: '10px' }}>Line Height</label>
              <Input
                type="number"
                step={0.1}
                value={properties.lineHeight}
                onChange={(e) => handleInputChange(fontName, 'lineHeight', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 h-6 text-xs px-1"
                style={{ fontSize: '11px' }}
              />
            </div>
          </div>
        );
      })}
      
      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700" style={{ fontSize: '10px' }}>
        Press &apos;2&apos; to toggle • Drag to move
      </div>
    </div>
  )
} 