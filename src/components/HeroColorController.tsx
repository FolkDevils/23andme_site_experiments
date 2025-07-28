'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface HeroColorControllerProps {
  isVisible: boolean;
}

interface BlobSettings {
  color: string;
  opacity: number;
  blendMode: string;
  animationDuration: number;
}

interface HeroSettings {
  blobs: {
    blob1: BlobSettings;
    blob2: BlobSettings;
    blob3: BlobSettings;
    blob4: BlobSettings;
    blob5: BlobSettings;
  };
  blurIntensity: number;
  background: {
    color1: string;
    color2: string;
  };
}

export default function HeroColorController({
  isVisible,
}: HeroColorControllerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState<HeroSettings>({
    blobs: {
      blob1: { color: '#FF301A', opacity: 0.8, blendMode: 'hard-light', animationDuration: 30 },
      blob2: { color: '#CB01C4', opacity: 0.8, blendMode: 'color-dodge', animationDuration: 20 },
      blob3: { color: '#7B00BD', opacity: 0.7, blendMode: 'overlay', animationDuration: 40 },
      blob4: { color: '#FF4081', opacity: 0.6, blendMode: 'screen', animationDuration: 40 },
      blob5: { color: '#8A2BE2', opacity: 0.5, blendMode: 'multiply', animationDuration: 20 }
    },
    blurIntensity: 60,
    background: {
      color1: '#7B00BD',
      color2: '#CB01C4'
    }
  });

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 
    'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion'
  ];

  const blobLabels = {
    blob1: 'Orange Blob',
    blob2: 'Pink Blob', 
    blob3: 'Purple Blob',
    blob4: 'Coral Blob',
    blob5: 'Electric Blob'
  };

  // Apply settings to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Blob colors and settings
    Object.entries(settings.blobs).forEach(([key, blob]) => {
      root.style.setProperty(`--hero-${key}-color`, blob.color);
      root.style.setProperty(`--hero-${key}-opacity`, blob.opacity.toString());
      root.style.setProperty(`--hero-${key}-blend`, blob.blendMode);
      root.style.setProperty(`--hero-${key}-duration`, `${blob.animationDuration}s`);
    });
    
    // Background and blur
    root.style.setProperty('--hero-blur', `${settings.blurIntensity}px`);
    root.style.setProperty('--hero-bg1', settings.background.color1);
    root.style.setProperty('--hero-bg2', settings.background.color2);
  }, [settings]);

  const updateBlobSetting = (blobKey: string, property: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      blobs: {
        ...prev.blobs,
        [blobKey]: {
          ...prev.blobs[blobKey as keyof typeof prev.blobs],
          [property]: value
        }
      }
    }));
  };

  const updateGlobalSetting = (property: string, value: string | number) => {
    if (property.startsWith('background.')) {
      const bgProp = property.split('.')[1];
      setSettings(prev => ({
        ...prev,
        background: {
          ...prev.background,
          [bgProp]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const resetToDefaults = () => {
    setSettings({
      blobs: {
        blob1: { color: '#FF301A', opacity: 0.8, blendMode: 'hard-light', animationDuration: 30 },
        blob2: { color: '#CB01C4', opacity: 0.8, blendMode: 'color-dodge', animationDuration: 20 },
        blob3: { color: '#7B00BD', opacity: 0.7, blendMode: 'overlay', animationDuration: 40 },
        blob4: { color: '#FF4081', opacity: 0.6, blendMode: 'screen', animationDuration: 40 },
        blob5: { color: '#8A2BE2', opacity: 0.5, blendMode: 'multiply', animationDuration: 20 }
      },
      blurIntensity: 60,
      background: {
        color1: '#7B00BD',
        color2: '#CB01C4'
      }
    });
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

  if (!isVisible) {
    return null;
  }

  const style = position.x !== 0 || position.y !== 0 
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : {};

  return (
    <div 
      ref={panelRef}
      className={`fixed ${position.x === 0 && position.y === 0 ? 'top-20 right-80' : ''} bg-gray-900 text-white p-3 rounded shadow-xl w-80 space-y-3 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border border-gray-700 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      style={{ fontFamily: 'system-ui, sans-serif', ...style }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white" style={{ fontSize: '14px', lineHeight: '1.2' }}>Hero Colors</h2>
        <button 
          onClick={resetToDefaults}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          style={{ fontSize: '10px' }}
        >
          Reset
        </button>
      </div>
      
      {/* Global Settings */}
      <div className="space-y-2 border-b border-gray-700 pb-3">
        <h3 className="text-xs font-semibold text-gray-100" style={{ fontSize: '11px' }}>Global Settings</h3>
        
        <div>
          <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '10px' }}>
            Blur Intensity: {settings.blurIntensity}px
          </label>
          <Slider
            value={[settings.blurIntensity]}
            onValueChange={(value) => updateGlobalSetting('blurIntensity', value[0])}
            max={100}
            min={20}
            step={5}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '10px' }}>Background 1</label>
            <input
              type="color"
              value={settings.background.color1}
              onChange={(e) => updateGlobalSetting('background.color1', e.target.value)}
              className="w-full h-6 rounded border border-gray-600"
            />
          </div>
          <div>
            <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '10px' }}>Background 2</label>
            <input
              type="color"
              value={settings.background.color2}
              onChange={(e) => updateGlobalSetting('background.color2', e.target.value)}
              className="w-full h-6 rounded border border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Blob Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-100" style={{ fontSize: '11px' }}>Blob Settings</h3>
        
        {Object.entries(settings.blobs).map(([key, blob]) => (
          <div key={key} className="bg-gray-800 rounded p-2 space-y-2">
            <h4 className="text-xs font-medium text-gray-100" style={{ fontSize: '10px' }}>
              {blobLabels[key as keyof typeof blobLabels]}
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '9px' }}>Color</label>
                <input
                  type="color"
                  value={blob.color}
                  onChange={(e) => updateBlobSetting(key, 'color', e.target.value)}
                  className="w-full h-6 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '9px' }}>
                  Opacity: {blob.opacity}
                </label>
                <Slider
                  value={[blob.opacity]}
                  onValueChange={(value) => updateBlobSetting(key, 'opacity', value[0])}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '9px' }}>Blend Mode</label>
                <Select value={blob.blendMode} onValueChange={(value) => updateBlobSetting(key, 'blendMode', value)}>
                  <SelectTrigger className="w-full h-6 bg-gray-700 border-gray-600 text-white text-xs" style={{ fontSize: '9px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 max-h-40">
                    {blendModes.map((mode) => (
                      <SelectItem key={mode} value={mode} className="text-white hover:bg-gray-700 text-xs" style={{ fontSize: '9px' }}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-gray-200 text-xs block mb-1" style={{ fontSize: '9px' }}>
                  Speed: {blob.animationDuration}s
                </label>
                <Slider
                  value={[blob.animationDuration]}
                  onValueChange={(value) => updateBlobSetting(key, 'animationDuration', value[0])}
                  max={60}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700" style={{ fontSize: '10px' }}>
        Press &apos;3&apos; to toggle • Drag to move
      </div>
    </div>
  )
} 