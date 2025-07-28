'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface SiteControllerProps {
  heroTheme: 'Gradient' | 'White';
  setHeroTheme: (theme: 'Gradient' | 'White') => void;
  cardState: boolean;
  setCardState: (state: boolean) => void;
  isVisible: boolean;
}

export default function SiteController({
  heroTheme,
  setHeroTheme,
  cardState,
  setCardState,
  isVisible,
}: SiteControllerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

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
      className={`fixed ${position.x === 0 && position.y === 0 ? 'top-20 right-2' : ''} bg-gray-900 text-white p-3 rounded shadow-xl w-72 space-y-3 z-50 border border-gray-700 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
      style={{ fontFamily: 'system-ui, sans-serif', ...style }}
      onMouseDown={handleMouseDown}
    >
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
      
      <div className="text-xs text-gray-400 pt-2 border-t border-gray-700" style={{ fontSize: '10px' }}>
        Press &apos;1&apos; or click logo to toggle • Drag to move
      </div>
    </div>
  )
} 