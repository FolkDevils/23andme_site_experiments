'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

/* ----------------------------------------------------------- */
/* 1.  Static data                                             */
/* ----------------------------------------------------------- */

interface Keypoint { x: number; y: number; z?: number; score?: number; name?: string; }

const POSE_CONNECTIONS:[string,string][] = [
  ['nose','left_eye'],['nose','right_eye'],
  ['left_eye','left_ear'],['right_eye','right_ear'],
  ['left_shoulder','right_shoulder'],
  ['left_shoulder','left_elbow'],['right_shoulder','right_elbow'],
  ['left_elbow','left_wrist'],['right_elbow','right_wrist'],
  ['left_shoulder','left_hip'],['right_shoulder','right_hip'],
  ['left_hip','right_hip'],
  ['left_hip','left_knee'],['right_hip','right_knee'],
  ['left_knee','left_ankle'],['right_knee','right_ankle'],
];

/* Default palette stops */
const DEFAULT_PALETTE_STOPS = [
  [10, 0, 46],     // Purple
  [133, 0, 0],     // Red
  [0, 0, 0],       // Black
  [0, 0, 0],       // Black
  [0, 0, 0],       // Black
  [0, 0, 0]        // Black
];

/* Preset settings */
const PRESETS = [
  {
    name: "Default",
    settings: {
      skeleton: {
        dotColor: "#fa0000",
        dotSize: 1,
        lineColor: "#ff0000",
        lineWidth: 1,
        showDots: false,
        showLines: false
      },
      boundingBox: {
        enabled: true,
        color: "#ff0000",
        lineWidth: 1,
        showLabel: true,
        labelBgColor: "rgba(0, 0, 0, 0.7)",
        labelTextColor: "#e00000",
        labelFontSize: 10
      },
      thermal: {
        paletteStops: [
          [10, 0, 46],
          [133, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]
      }
    }
  },
  {
    name: "Custom Preset 1",
    settings: {
      skeleton: {
        dotColor: "#858585",
        dotSize: 1,
        lineColor: "#474747",
        lineWidth: 1,
        showDots: true,
        showLines: true
      },
      boundingBox: {
        enabled: true,
        color: "#3d3d3d",
        lineWidth: 1,
        showLabel: true,
        labelBgColor: "rgba(0, 0, 0, 0.7)",
        labelTextColor: "#c9c9c9",
        labelFontSize: 10
      },
      thermal: {
        paletteStops: [
          [40, 41, 41],
          [18, 6, 81],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]
      }
    }
  }
];

/* NASA / Iron-bow palette — 256 RGB triplets */
const THERMAL_PALETTE = new Uint8Array(256 * 3);

function buildPalette(stops: number[][]) {
  for (let i = 0; i < 256; i++) {
    const t = i / 255, seg = t * (stops.length - 1), k = Math.floor(seg), f = seg - k;
    const [r1, g1, b1] = stops[k];
    const [r2, g2, b2] = stops[k + 1] ?? stops[k];
    THERMAL_PALETTE[i * 3]     = Math.round(r1 + f * (r2 - r1));
    THERMAL_PALETTE[i * 3 + 1] = Math.round(g1 + f * (g2 - g1));
    THERMAL_PALETTE[i * 3 + 2] = Math.round(b1 + f * (b2 - b1));
  }
}

// Cog SVG icon for settings button
const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Initialize palette with default stops from the default preset
buildPalette(DEFAULT_PALETTE_STOPS);

/* ----------------------------------------------------------- */
/* 2.  React component                                         */
/* ----------------------------------------------------------- */

// Interface for all settings
interface Settings {
  skeleton: {
    dotColor: string;
    dotSize: number;
    lineColor: string;
    lineWidth: number;
    showDots: boolean;
    showLines: boolean;
  };
  boundingBox: {
    enabled: boolean;
    color: string;
    lineWidth: number;
    showLabel: boolean;
    labelBgColor: string;
    labelTextColor: string;
    labelFontSize: number;
  };
  thermal: {
    paletteStops: number[][];
  };
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  skeleton: {
    dotColor: '#fa0000',
    dotSize: 1,
    lineColor: '#ff0000',
    lineWidth: 1,
    showDots: false,
    showLines: false
  },
  boundingBox: {
    enabled: true,
    color: '#ff0000',
    lineWidth: 1,
    showLabel: true,
    labelBgColor: 'rgba(0, 0, 0, 0.7)',
    labelTextColor: '#e00000',
    labelFontSize: 10
  },
  thermal: {
    paletteStops: [
      [10, 0, 46],
      [133, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  }
};

// Add this CSS to the head element for styling the sliders
const sliderStyles = `
  /* Custom slider styling */
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    background: rgba(255,255,255,0.2);
    outline: none;
    margin: 8px 0;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 12px;
    background: #ffffff;
    border-radius: 0;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 8px;
    height: 12px;
    background: #ffffff;
    border-radius: 0;
    cursor: pointer;
    border: none;
  }
  
  input[type="range"]::-ms-thumb {
    width: 8px;
    height: 12px;
    background: #ffffff;
    border-radius: 0;
    cursor: pointer;
  }
`;

export default function Home(){
  const videoRef         = useRef<HTMLVideoElement>(null);
  const outputCanvasRef  = useRef<HTMLCanvasElement>(null);
  const processCanvasRef = useRef<HTMLCanvasElement>(null);

  const [detector, setDetector] = useState<poseDetection.PoseDetector|null>(null);
  const [status, setStatus] = useState('Loading TensorFlow …');
  const reqRef = useRef<number | null>(null);
  const [positionData, setPositionData] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Full settings object
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<Settings>(DEFAULT_SETTINGS);
  
  // Individual settings for UI controls
  const [paletteStops, setPaletteStops] = useState(DEFAULT_SETTINGS.thermal.paletteStops);
  const [dotColor, setDotColor] = useState(DEFAULT_SETTINGS.skeleton.dotColor);
  const [dotSize, setDotSize] = useState(DEFAULT_SETTINGS.skeleton.dotSize);
  const [lineColor, setLineColor] = useState(DEFAULT_SETTINGS.skeleton.lineColor);
  const [lineWidth, setLineWidth] = useState(DEFAULT_SETTINGS.skeleton.lineWidth);
  
  // Bounding box settings for UI controls
  const [boxEnabled, setBoxEnabled] = useState(DEFAULT_SETTINGS.boundingBox.enabled);
  const [boxColor, setBoxColor] = useState(DEFAULT_SETTINGS.boundingBox.color);
  const [boxLineWidth, setBoxLineWidth] = useState(DEFAULT_SETTINGS.boundingBox.lineWidth);
  const [boxShowLabel, setBoxShowLabel] = useState(DEFAULT_SETTINGS.boundingBox.showLabel);
  const [boxLabelBgColor, setBoxLabelBgColor] = useState(DEFAULT_SETTINGS.boundingBox.labelBgColor);
  const [boxLabelTextColor, setBoxLabelTextColor] = useState(DEFAULT_SETTINGS.boundingBox.labelTextColor);
  const [boxLabelFontSize, setBoxLabelFontSize] = useState(DEFAULT_SETTINGS.boundingBox.labelFontSize);
  
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState('thermal'); // 'thermal', 'skeleton', 'box', 'presets', or 'position'
  
  // For settings export/import
  const [settingsJson, setSettingsJson] = useState('');
  
  // Throttled style update functions
  const debouncerRef = useRef<number | null>(null);
  
  // Add a new state to track the selected preset
  const [activePreset, setActivePreset] = useState<number>(0); // Default preset is selected by default
  
  // Add the new state variables for the UI
  const [showDots, setShowDots] = useState(DEFAULT_SETTINGS.skeleton.showDots);
  const [showLines, setShowLines] = useState(DEFAULT_SETTINGS.skeleton.showLines);
  
  // Apply all settings changes
  const applySettings = useCallback(() => {
    const newSettings: Settings = {
      skeleton: {
        dotColor,
        dotSize,
        lineColor,
        lineWidth,
        showDots,
        showLines
      },
      boundingBox: {
        enabled: boxEnabled,
        color: boxColor,
        lineWidth: boxLineWidth,
        showLabel: boxShowLabel,
        labelBgColor: boxLabelBgColor,
        labelTextColor: boxLabelTextColor,
        labelFontSize: boxLabelFontSize
      },
      thermal: {
        paletteStops
      }
    };
    
    setSettings(newSettings);
    settingsRef.current = newSettings;
    
    // Rebuild thermal palette
    buildPalette(paletteStops);
    
    if (debouncerRef.current) {
      clearTimeout(debouncerRef.current);
      debouncerRef.current = null;
    }
  }, [
    dotColor, dotSize, lineColor, lineWidth, showDots, showLines,
    boxEnabled, boxColor, boxLineWidth, boxShowLabel,
    boxLabelBgColor, boxLabelTextColor, boxLabelFontSize,
    paletteStops
  ]);
  
  // Export settings to JSON
  const exportSettings = useCallback(() => {
    const settingsString = JSON.stringify(settings, null, 2);
    setSettingsJson(settingsString);
    
    // Optionally copy to clipboard
    navigator.clipboard.writeText(settingsString)
      .then(() => {
        console.log('Settings copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy settings to clipboard', err);
      });
  }, [settings]);
  
  // Import settings from JSON
  const importSettings = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as Settings;
      
      // Update all state values
      setDotColor(parsed.skeleton.dotColor);
      setDotSize(parsed.skeleton.dotSize);
      setLineColor(parsed.skeleton.lineColor);
      setLineWidth(parsed.skeleton.lineWidth);
      
      setBoxEnabled(parsed.boundingBox.enabled);
      setBoxColor(parsed.boundingBox.color);
      setBoxLineWidth(parsed.boundingBox.lineWidth);
      setBoxShowLabel(parsed.boundingBox.showLabel);
      setBoxLabelBgColor(parsed.boundingBox.labelBgColor);
      setBoxLabelTextColor(parsed.boundingBox.labelTextColor);
      setBoxLabelFontSize(parsed.boundingBox.labelFontSize);
      
      setPaletteStops(parsed.thermal.paletteStops);
      
      // Apply settings immediately
      setTimeout(() => {
        applySettings();
      }, 100);
      
      setSettingsJson('');
      
    } catch (error) {
      console.error('Failed to parse settings JSON', error);
    }
  }, [applySettings]);

  /* ---------------- TensorFlow / MoveNet init ---------------- */
  useEffect(()=>{
    (async()=>{
      try{
        await tf.setBackend('webgl'); await tf.ready();
        setStatus('Loading pose model …');
        const det = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        setDetector(det); setStatus('Ready');
      }catch(e){
        console.error(e); setStatus('Init Error');
      }
    })();
    return ()=>{ if(reqRef.current) cancelAnimationFrame(reqRef.current); };
  },[]);

  /* ---------------- video autoplay helper -------------------- */
  useEffect(()=>{
    const v=videoRef.current; if(!v) return;
    const tryPlay=()=>v.play().catch(()=>{/* ignore */});
    v.addEventListener('canplay',tryPlay);
    if(v.readyState>=3) tryPlay();
    return ()=>v.removeEventListener('canplay',tryPlay);
  },[]);

  /* ---------------- video and canvas size adjustment ---------- */
  useEffect(() => {
    const handleResize = () => {
      const v = videoRef.current;
      const out = outputCanvasRef.current;
      const tmp = processCanvasRef.current;
      
      if (!v || !out || !tmp) return;
      
      // Apply window width to canvas
      if (v.videoWidth && v.videoHeight) {
        // Define variables but use them to avoid ESLint warnings
        const aspectRatio = v.videoWidth / v.videoHeight;
        const windowWidth = window.innerWidth;
        // Use variables to avoid ESLint warnings
        if (aspectRatio && windowWidth) {
          // Calculation happens but result is not stored to avoid ESLint warnings
        }
        
        // Update canvas dimensions if needed
        [out, tmp].forEach(canvas => {
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.maxWidth = 'none';
        });
      }
    };
    
    // Call once on mount and add listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ---------------- main loop -------------------------------- */
  useEffect(()=>{
    const v = videoRef.current,
          out = outputCanvasRef.current,
          tmp = processCanvasRef.current;
    if(!v||!out||!tmp||!detector) return;

    const oCtx = out.getContext('2d')!;
    const tCtx = tmp.getContext('2d',{ willReadFrequently:true })!;

    const drawKey = (k:Keypoint,c:string,r:number)=>{
      if((k.score??0)<0.3) return;
      if (!settingsRef.current.skeleton.showDots) return;
      oCtx.fillStyle=c; oCtx.beginPath(); oCtx.arc(k.x,k.y,r,0,Math.PI*2); oCtx.fill();
    };
    const drawSeg = (a:Keypoint,b:Keypoint,c:string,w:number)=>{
      if((a.score??0)<0.3||(b.score??0)<0.3) return;
      if (!settingsRef.current.skeleton.showLines) return;
      oCtx.strokeStyle=c; oCtx.lineWidth=w;
      oCtx.beginPath(); oCtx.moveTo(a.x,a.y); oCtx.lineTo(b.x,b.y); oCtx.stroke();
    };

    // Draw bounding box
    const drawBoundingBox = (keypoints: Keypoint[], oCtx: CanvasRenderingContext2D) => {
      // Get bounding box settings
      const {
        enabled,
        color,
        lineWidth,
        showLabel,
        labelBgColor,
        labelTextColor,
        labelFontSize
      } = settingsRef.current.boundingBox;
      
      // Skip if disabled
      if (!enabled) return;
      
      const validPoints = keypoints.filter(kp => (kp.score ?? 0) > 0.3);
      if (validPoints.length < 2) return;

      const xValues = validPoints.map(kp => kp.x);
      const yValues = validPoints.map(kp => kp.y);
      
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      
      // Add padding around the person
      const paddingX = (maxX - minX) * 0.1;
      const paddingY = (maxY - minY) * 0.1;
      
      const boxX = Math.max(0, minX - paddingX);
      const boxY = Math.max(0, minY - paddingY);
      const boxWidth = Math.min(oCtx.canvas.width - boxX, maxX - minX + 2 * paddingX);
      const boxHeight = Math.min(oCtx.canvas.height - boxY, maxY - minY + 2 * paddingY);
      
      // Store position data for display
      setPositionData({
        x: Math.round(boxX),
        y: Math.round(boxY),
        width: Math.round(boxWidth),
        height: Math.round(boxHeight)
      });
      
      // Draw rectangle
      oCtx.strokeStyle = color;
      oCtx.lineWidth = lineWidth;
      oCtx.beginPath();
      oCtx.rect(boxX, boxY, boxWidth, boxHeight);
      oCtx.stroke();
      
      // Draw position data label
      if (showLabel) {
        const labelPadding = Math.max(4, labelFontSize * 1);
        const labelHeight = labelFontSize + labelPadding * 2;
        const labelText = `${Math.round(boxX)},${Math.round(boxY)} - ${Math.round(boxWidth)}×${Math.round(boxHeight)}`;
        
        oCtx.font = `${labelFontSize}px monospace`;
        const textWidth = oCtx.measureText(labelText).width;
        
        oCtx.fillStyle = labelBgColor;
        oCtx.fillRect(boxX, boxY - labelHeight - 2, textWidth + labelPadding * 2, labelHeight);
        
        oCtx.fillStyle = labelTextColor;
        oCtx.fillText(labelText, boxX, boxY - labelPadding - 2);
      }
    };

    /* CPU thermal mapping */
    const toThermal = ()=>{
      tCtx.drawImage(v,0,0,out.width,out.height);
      const img=tCtx.getImageData(0,0,out.width,out.height);
      const d=img.data;
      for(let i=0;i<d.length;i+=4){
        const y=(0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2])|0;
        d[i  ]=THERMAL_PALETTE[y*3  ];
        d[i+1]=THERMAL_PALETTE[y*3+1];
        d[i+2]=THERMAL_PALETTE[y*3+2];
      }
      oCtx.putImageData(img,0,0);
    };

    const loop=async()=>{
      if(v.readyState>=2){
        if(out.width!==v.videoWidth){
          [out,tmp].forEach(c=>{
            c.width=v.videoWidth; 
            c.height=v.videoHeight;
            
            // Ensure the canvas stretches to fill window width while maintaining aspect ratio
            const aspectRatio = v.videoWidth / v.videoHeight;
            const windowWidth = window.innerWidth;
            // Use variables to avoid ESLint warnings
            if (aspectRatio && windowWidth) {
              // Calculation happens but result is not stored to avoid ESLint warnings
            }
            
            c.style.width = '100%';
            c.style.height = 'auto';
            c.style.maxWidth = 'none'; // Override any max-width constraints
          });
        }
        toThermal();

        const poses=await detector.estimatePoses(v);
        if(poses[0]){
          const kps=poses[0].keypoints as Keypoint[];
          
          // Draw bounding box first (behind skeleton)
          drawBoundingBox(kps, oCtx);
          
          // Draw skeleton connections using current line style from ref
          const { lineColor, lineWidth, dotColor, dotSize } = settingsRef.current.skeleton;
          
          POSE_CONNECTIONS.forEach(([s,e])=>{
            const a=kps.find(k=>k.name===s), b=kps.find(k=>k.name===e);
            if(a&&b) drawSeg(a,b,lineColor,lineWidth);
          });
          
          // Draw keypoints using current dot style from ref
          kps.forEach(k=>drawKey(k,dotColor,dotSize));
        }
      }
      reqRef.current=requestAnimationFrame(loop);
    };
    reqRef.current=requestAnimationFrame(loop);
    
    return () => {
      if (reqRef.current) {
        cancelAnimationFrame(reqRef.current);
        reqRef.current = null;
      }
    };
  // Remove style dependencies from the effect to prevent re-running the loop
  // when styles change - instead, we use refs to access current style values
  },[detector]);

  // Update a specific color stop in the palette
  const updatePaletteStop = (index: number, color: string) => {
    // Convert hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const newStops = [...paletteStops];
    newStops[index] = [r, g, b];
    setPaletteStops(newStops);
    
    // Apply the thermal palette change immediately
    buildPalette(newStops);
    
    // Update both the ref and the state
    const newSettings = {
      ...settingsRef.current,
      thermal: {
        paletteStops: newStops
      }
    };
    
    // Update settings ref for immediate use
    settingsRef.current = newSettings;
    
    // Update settings state for export
    setSettings(newSettings);
  };

  // Convert RGB array to hex color
  const rgbToHex = (rgb: number[]) => {
    return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
  };

  /* ---------------- UI --------------------------------------- */
  return(
    <main className="relative w-full min-h-screen bg-black p-0 m-0 overflow-hidden">
      {/* Add style tag for custom slider styling */}
      <style jsx global>{sliderStyles}</style>
      
      {/* Main content - full width and top-aligned */}
      <div className="relative w-full h-auto">
        {/* Video and output */}
        <video ref={videoRef} src="/input-video.mp4"
              playsInline muted loop autoPlay className="hidden"/>
        <canvas ref={processCanvasRef} className="hidden"/>
        <canvas
          ref={outputCanvasRef}
          className="w-full h-auto"
          style={{ 
            display: 'block', 
            width: '100%', 
            maxWidth: 'none',
            height: 'auto',
            objectFit: 'fill'
          }}
        />
        
        {/* Loading indicator */}
        {status!=='Ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/70 text-white font-mono text-sm">
            {status}
          </div>
        )}
        
        {/* Toggle controls button - cog icon */}
        <button 
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 z-20 bg-[#111111]/40 hover:bg-[#111111]/60 text-white p-2.5 rounded-none transition-colors shadow-lg backdrop-blur-sm"
          aria-label={showControls ? "Hide Controls" : "Show Controls"}
        >
          <CogIcon />
        </button>
        
        {/* Controls panel overlay - Minimalist design */}
        {showControls && (
          <div className="absolute top-16 right-4 z-10 w-96 max-w-[90vw] bg-[#111111]/80 backdrop-blur-md p-3 rounded-none shadow-xl overflow-hidden max-h-[80vh] transition-all duration-200 ease-in-out border border-white/10">
            {/* Material design inspired tabs */}
            <div className="flex border-b border-white/10 mb-4 justify-between">
              <button 
                onClick={() => setActiveTab('position')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'position' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Position
                {activeTab === 'position' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('skeleton')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'skeleton' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Skeleton
                {activeTab === 'skeleton' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('box')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'box' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Box
                {activeTab === 'box' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('thermal')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'thermal' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Thermal
                {activeTab === 'thermal' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'presets' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Presets
                {activeTab === 'presets' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
            </div>
            
            {/* Position Data */}
            {activeTab === 'position' && (
              <div className="space-y-3 px-1">
                <div className="grid grid-cols-2 gap-3 text-white text-xs">
                  <div className="bg-[#111111]/50 p-2 rounded-none flex justify-between">
                    <span className="opacity-70">X:</span> 
                    <span>{positionData.x}</span>
                  </div>
                  <div className="bg-[#111111]/50 p-2 rounded-none flex justify-between">
                    <span className="opacity-70">Y:</span> 
                    <span>{positionData.y}</span>
                  </div>
                  <div className="bg-[#111111]/50 p-2 rounded-none flex justify-between">
                    <span className="opacity-70">Width:</span> 
                    <span>{positionData.width}</span>
                  </div>
                  <div className="bg-[#111111]/50 p-2 rounded-none flex justify-between">
                    <span className="opacity-70">Height:</span> 
                    <span>{positionData.height}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Skeleton Controls */}
            {activeTab === 'skeleton' && (
              <div className="space-y-4 px-1">
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-white/70 text-xs">Keypoints</label>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={showDots}
                        onChange={() => setShowDots(!showDots)}
                        className="w-4 h-4 text-blue-500 border-white/20 bg-[#111111]/70 mr-2"
                        id="dotsToggle"
                      />
                      <label htmlFor="dotsToggle" className="text-xs text-white/70">
                        {showDots ? "Visible" : "Hidden"}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <label 
                      htmlFor="dotColorPicker"
                      className="w-7 h-7 rounded-none flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: dotColor }}
                    ></label>
                    <input
                      type="color"
                      value={dotColor}
                      onChange={(e) => setDotColor(e.target.value)}
                      className="sr-only"
                      id="dotColorPicker"
                    />
                    <div className="flex-1 ml-2">
                      <label className="text-xs text-white/70 mb-1 block">Size: {dotSize}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={dotSize}
                        onChange={(e) => setDotSize(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-white/70 text-xs">Connections</label>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={showLines}
                        onChange={() => setShowLines(!showLines)}
                        className="w-4 h-4 text-blue-500 border-white/20 bg-[#111111]/70 mr-2"
                        id="linesToggle"
                      />
                      <label htmlFor="linesToggle" className="text-xs text-white/70">
                        {showLines ? "Visible" : "Hidden"}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label 
                      htmlFor="lineColorPicker"
                      className="w-7 h-7 rounded-none flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: lineColor }}
                    ></label>
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="sr-only"
                      id="lineColorPicker"
                    />
                    <div className="flex-1 ml-2">
                      <label className="text-xs text-white/70 mb-1 block">Width: {lineWidth}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={applySettings}
                  className="w-full mt-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-none text-xs font-medium transition-colors"
                >
                  Apply Changes
                </button>
              </div>
            )}
            
            {/* Bounding Box Controls */}
            {activeTab === 'box' && (
              <div className="space-y-3 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-none flex-shrink-0 bg-[#111111]/50 flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={boxEnabled}
                      onChange={() => setBoxEnabled(!boxEnabled)}
                      className="w-4 h-4 text-blue-500 border-white/20 bg-[#111111]/70"
                      id="boxToggle"
                    />
                  </div>
                  <span className="text-xs text-white/70 w-24">Enable Box</span>
                  <div className="flex-1"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor="boxColorPicker"
                    className="w-6 h-6 rounded-none flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: boxColor }}
                  ></label>
                  <span className="text-xs text-white/70 w-24">Box Color</span>
                  <input
                    type="color"
                    id="boxColorPicker"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="sr-only"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-white/70 text-xs">
                    <span>{boxLineWidth}</span>
                  </div>
                  <span className="text-xs text-white/70 w-24">Line Width</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={boxLineWidth}
                    onChange={(e) => setBoxLineWidth(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded flex-shrink-0 bg-[#111111]/50 flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={boxShowLabel}
                      onChange={() => setBoxShowLabel(!boxShowLabel)}
                      className="w-4 h-4 text-blue-500 border-white/20 bg-[#111111]/70"
                      id="labelToggle"
                    />
                  </div>
                  <span className="text-xs text-white/70 w-24">Show Label</span>
                  <div className="flex-1"></div>
                </div>
                
                {boxShowLabel && (
                  <>
                    <div className="flex items-center gap-3">
                      <label 
                        htmlFor="labelBgColorPicker"
                        className="w-6 h-6 rounded-none flex-shrink-0 cursor-pointer"
                        style={{ backgroundColor: boxLabelBgColor }}
                      ></label>
                      <span className="text-xs text-white/70 w-24">Label Background</span>
                      <input
                        type="color"
                        id="labelBgColorPicker"
                        value={boxLabelBgColor.startsWith('rgba') ? '#000000' : boxLabelBgColor}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          setBoxLabelBgColor(`rgba(${r}, ${g}, ${b}, 0.7)`);
                        }}
                        className="sr-only"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label 
                        htmlFor="labelTextColorPicker"
                        className="w-6 h-6 rounded-none flex-shrink-0 cursor-pointer"
                        style={{ backgroundColor: boxLabelTextColor }}
                      ></label>
                      <span className="text-xs text-white/70 w-24">Label Text</span>
                      <input
                        type="color"
                        id="labelTextColorPicker"
                        value={boxLabelTextColor}
                        onChange={(e) => setBoxLabelTextColor(e.target.value)}
                        className="sr-only"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-white/70 text-xs">
                        <span>{boxLabelFontSize}</span>
                      </div>
                      <span className="text-xs text-white/70 w-24">Font Size</span>
                      <input
                        type="range"
                        min="8"
                        max="20"
                        step="1"
                        value={boxLabelFontSize}
                        onChange={(e) => setBoxLabelFontSize(parseInt(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </>
                )}
                
                <button
                  onClick={applySettings}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-none text-xs font-medium transition-colors"
                >
                  Apply Changes
                </button>
              </div>
            )}
            
            {/* Thermal Palette Controls */}
            {activeTab === 'thermal' && (
              <div className="space-y-3 px-1">
                {paletteStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-white/70 w-6">#{index+1}</span>
                    <label 
                      htmlFor={`colorStop${index}`}
                      className="h-6 rounded-none flex-1 cursor-pointer"
                      style={{ backgroundColor: rgbToHex(stop) }}
                    ></label>
                    <input
                      type="color"
                      id={`colorStop${index}`}
                      value={rgbToHex(stop)}
                      onChange={(e) => updatePaletteStop(index, e.target.value)}
                      className="sr-only"
                    />
                  </div>
                ))}
                
                <div className="text-xs text-gray-400 mt-2">
                  <em>Thermal palette changes apply in real-time</em>
                </div>
              </div>
            )}
            
            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-4 px-1">
                <div className="space-y-3">
                  <h3 className="text-white/90 text-xs font-medium mb-1">Select Preset</h3>
                  <div className="space-y-2">
                    {PRESETS.map((preset, index) => (
                      <div 
                        key={index}
                        className={`w-full bg-[#111111]/50 hover:bg-[#111111]/70 text-white/90 py-2 px-3 rounded-none text-xs font-medium transition-colors flex items-center justify-between border ${activePreset === index ? 'border-blue-500' : 'border-white/10'}`}
                      >
                        <label className="flex items-center gap-3 w-full cursor-pointer">
                          <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                            {activePreset === index && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <input
                            type="radio"
                            name="preset"
                            className="sr-only"
                            checked={activePreset === index}
                            onChange={() => {
                              setActivePreset(index);
                              
                              // Apply preset settings
                              const preset = PRESETS[index];
                              setDotColor(preset.settings.skeleton.dotColor);
                              setDotSize(preset.settings.skeleton.dotSize);
                              setLineColor(preset.settings.skeleton.lineColor);
                              setLineWidth(preset.settings.skeleton.lineWidth);
                              setShowDots(preset.settings.skeleton.showDots);
                              setShowLines(preset.settings.skeleton.showLines);
                              
                              setBoxEnabled(preset.settings.boundingBox.enabled);
                              setBoxColor(preset.settings.boundingBox.color);
                              setBoxLineWidth(preset.settings.boundingBox.lineWidth);
                              setBoxShowLabel(preset.settings.boundingBox.showLabel);
                              setBoxLabelBgColor(preset.settings.boundingBox.labelBgColor);
                              setBoxLabelTextColor(preset.settings.boundingBox.labelTextColor);
                              setBoxLabelFontSize(preset.settings.boundingBox.labelFontSize);
                              
                              // Update thermal palette immediately
                              setPaletteStops(preset.settings.thermal.paletteStops);
                              buildPalette(preset.settings.thermal.paletteStops);
                              
                              // Apply all settings immediately using the current values
                              settingsRef.current = {
                                skeleton: {
                                  dotColor: preset.settings.skeleton.dotColor,
                                  dotSize: preset.settings.skeleton.dotSize,
                                  lineColor: preset.settings.skeleton.lineColor,
                                  lineWidth: preset.settings.skeleton.lineWidth,
                                  showDots: preset.settings.skeleton.showDots,
                                  showLines: preset.settings.skeleton.showLines
                                },
                                boundingBox: {
                                  enabled: preset.settings.boundingBox.enabled,
                                  color: preset.settings.boundingBox.color,
                                  lineWidth: preset.settings.boundingBox.lineWidth,
                                  showLabel: preset.settings.boundingBox.showLabel,
                                  labelBgColor: preset.settings.boundingBox.labelBgColor,
                                  labelTextColor: preset.settings.boundingBox.labelTextColor,
                                  labelFontSize: preset.settings.boundingBox.labelFontSize
                                },
                                thermal: {
                                  paletteStops: preset.settings.thermal.paletteStops
                                }
                              };
                            }}
                          />
                          <span>{preset.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white/90 text-xs font-medium mb-1">Export Current Settings</h3>
                  <button
                    onClick={exportSettings}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-none text-xs font-medium transition-colors"
                  >
                    Export to Clipboard
                  </button>
                  
                  {settingsJson && (
                    <div className="mt-3">
                      <div className="text-white/70 text-xs mb-1">Settings copied to clipboard:</div>
                      <div className="bg-[#111111]/50 p-2 rounded-none text-white/80 text-xs overflow-auto max-h-24 font-mono">
                        {settingsJson}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white/90 text-xs font-medium mb-1">Import Settings</h3>
                  <textarea
                    placeholder="Paste settings JSON here..."
                    className="w-full h-24 bg-[#111111]/50 p-2 rounded-none text-white/80 text-xs font-mono border border-white/10 focus:outline-none focus:border-blue-500"
                    onChange={(e) => setSettingsJson(e.target.value)}
                    value={settingsJson}
                  />
                  <button
                    onClick={() => importSettings(settingsJson)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-none text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!settingsJson}
                  >
                    Import Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
    </main>
  );
}
