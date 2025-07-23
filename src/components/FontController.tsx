'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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

interface FontControllerProps {
  heroTheme: 'Gradient' | 'White';
  setHeroTheme: (theme: 'Gradient' | 'White') => void;
  cardState: boolean;
  setCardState: (state: boolean) => void;
}

export default function FontController({
  heroTheme,
  setHeroTheme,
  cardState,
  setCardState,
}: FontControllerProps) {
  // Load persisted component selection from localStorage
  const [selectedComponent, setSelectedComponent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fontController-selectedComponent') || 'hero';
    }
    return 'hero';
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Function to read current CSS variable values
  const getCurrentFontValues = () => {
    if (typeof window === 'undefined') return {};
    
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      'button-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-button-text') || '14'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-button-text') || '1.25') 
      },
      'body-copy': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-body-copy') || '16'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-body-copy') || '1.5') 
      },
      'caption-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-caption-text') || '12'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-caption-text') || '1.25') 
      },
      'card-eyebrow': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-card-eyebrow') || '12'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-card-eyebrow') || '1') 
      },
      'card-header': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-card-header') || '33'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-card-header') || '1.1') 
      },
      'eyebrow-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-eyebrow-text') || '16'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-eyebrow-text') || '1') 
      },
      'heading-1': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-heading-1') || '36'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-heading-1') || '1.1') 
      },
      'hero-header': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-hero-header-desktop') || '80'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-hero-header') || '1'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-header-mobile') || '40'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-header-tablet') || '60'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-header-desktop') || '80')
      },
      'hero-pills': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-hero-pills-desktop') || '60'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-hero-pills') || '1'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-pills-mobile') || '30'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-pills-tablet') || '45'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-hero-pills-desktop') || '60')
      },
      'quote-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-quote-text-desktop') || '40'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-quote-text') || '1.2'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-quote-text-mobile') || '24'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-quote-text-tablet') || '32'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-quote-text-desktop') || '40')
      },
      'story-link': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-story-link-desktop') || '16'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-story-link') || '1.5'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-story-link-mobile') || '14'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-story-link-tablet') || '15'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-story-link-desktop') || '16')
      },
      'kit-header': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-kit-header-desktop') || '36'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-kit-header') || '1.1'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-header-mobile') || '24'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-header-tablet') || '30'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-header-desktop') || '36')
      },
      'kit-pills': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-kit-pills-desktop') || '28'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-kit-pills') || '1'),
        mobileSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-pills-mobile') || '19'),
        tabletSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-pills-tablet') || '22'),
        desktopSize: parseInt(computedStyle.getPropertyValue('--font-size-kit-pills-desktop') || '28')
      },
      'price-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-price-text') || '36'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-price-text') || '1.1') 
      },
      'price-small': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-price-small') || '24'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-price-small') || '1') 
      },
      'totalhealth-text': { 
        size: parseInt(computedStyle.getPropertyValue('--font-size-totalhealth-text') || '16'), 
        lineHeight: parseFloat(computedStyle.getPropertyValue('--line-height-totalhealth-text') || '1.4') 
      },
    };
  };
  
  const [fonts, setFonts] = useState<FontState>(() => {
    // Initialize with current CSS values or fallbacks
    return getCurrentFontValues() as FontState;
  });

  // Component to font mapping
  const componentFonts = {
    'navigation': ['button-text'],
    'hero': ['eyebrow-text', 'hero-header', 'hero-pills'],
    'email-banner': ['body-copy'],
    'kit-section': ['kit-header', 'kit-pills', 'card-eyebrow', 'card-header', 'caption-text', 'price-text', 'price-small', 'button-text'],
    'service-carousel': ['eyebrow-text', 'heading-1', 'body-copy', 'button-text', 'quote-text', 'story-link'],
    'totalhealth': ['totalhealth-text', 'button-text'],
    'privacy': ['heading-1', 'body-copy', 'button-text']
  };

  const componentLabels = {
    'navigation': 'Navigation',
    'hero': 'Hero',
    'email-banner': 'Email Banner', 
    'kit-section': 'Kit Section',
    'service-carousel': 'Service Carousel',
    'totalhealth': 'Total Health',
    'privacy': 'Privacy'
  };

  // Responsive fonts that have different sizes per breakpoint
  const responsiveFonts = useMemo(() => ['hero-header', 'hero-pills', 'kit-header', 'kit-pills', 'quote-text', 'story-link'], []);

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

  // Refresh font values from CSS when component mounts or becomes visible
  useEffect(() => {
    const refreshFromCSS = () => {
      const currentValues = getCurrentFontValues();
      setFonts(currentValues as FontState);
    };
    
    // Small delay to ensure CSS is loaded
    const timer = setTimeout(refreshFromCSS, 100);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="fixed top-20 right-2 bg-gray-900 text-white p-3 rounded shadow-xl w-72 space-y-3 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border border-gray-700" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2 className="text-sm font-bold border-b border-gray-700 pb-1 text-white" style={{ fontSize: '14px', lineHeight: '1.2' }}>Site Controls</h2>
      
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-100" style={{ fontSize: '12px', lineHeight: '1.3' }}>Module Controls</h3>
        <div className="flex items-center justify-between">
          <label className="text-gray-200 text-xs" style={{ fontSize: '11px' }}>Hero Theme</label>
          <Select value={heroTheme} onValueChange={setHeroTheme}>
            <SelectTrigger className="w-24 h-6 bg-gray-800 border-gray-600 text-white text-xs" style={{ fontSize: '11px' }}>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="Gradient" className="text-white hover:bg-gray-700 text-xs" style={{ fontSize: '11px' }}>Gradient</SelectItem>
              <SelectItem value="White" className="text-white hover:bg-gray-700 text-xs" style={{ fontSize: '11px' }}>White</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-gray-200 text-xs" style={{ fontSize: '11px' }}>4 Cards</label>
          <Switch 
            checked={cardState} 
            onCheckedChange={setCardState}
            className="data-[state=checked]:bg-blue-600 scale-75"
          />
        </div>
      </div>
      
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
    </div>
  )
} 