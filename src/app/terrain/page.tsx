"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
// @ts-expect-error - THREE.js OrbitControls type issue
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Link from "next/link"

// Cog SVG icon for settings button
const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Default heat map color stops
const DEFAULT_HEAT_MAP_STOPS = [
  {name: "Lowest", color: "#000066"}, // Dark blue for lowest values
  {name: "Low", color: "#0000FF"},    // Blue
  {name: "Low-Mid", color: "#00FFFF"}, // Cyan
  {name: "Middle", color: "#00FF00"}, // Green
  {name: "Mid-High", color: "#FFFF00"}, // Yellow
  {name: "High", color: "#FF7F00"},   // Orange
  {name: "Highest", color: "#FF0000"}  // Red
];

// Terrain presets
const TERRAIN_PRESETS = [
  {
    name: "Alpine Lake",
    url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/13/1341/3145.png",
    description: "Latitude 38.7119° N, Longitude 106.2943° W — Alpine Lake, Colorado."
  },
  {
    name: "Rocky Mountains, Colorado, USA",
    url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/13/1342/3143.png",
    description: "Latitude 39.5501° N, Longitude 105.7821° W"
  },
  {
    name: "Andes Mountains, Chile Argentina Border",
    url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/13/2456/4096.png",
    description: "Latitude 32.6500° S, Longitude 70.0000° W "
  },
  {
    name: "Atlas Mountains, Morocco",
    url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/13/4091/3086.png",
    description: "Latitude 31.0675° N, Longitude 7.9189° W "
  }
];

export default function TerrainFromMapzen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ min: number; max: number; range: number } | null>(null)
  
  // Controls panel state
  const [showControls, setShowControls] = useState(false)
  const [activeTab, setActiveTab] = useState('presets') // Set default tab to presets
  
  // Heat map color state
  const [heatMapStops, setHeatMapStops] = useState(DEFAULT_HEAT_MAP_STOPS)
  
  // Selected terrain preset
  const [selectedTerrain, setSelectedTerrain] = useState(TERRAIN_PRESETS[0])
  
  // Reference to scene objects for updates
  const sceneRef = useRef<{
    terrain: THREE.Mesh | null,
    scene: THREE.Scene | null,
    updateColors: ((colors: {name: string, color: string}[]) => void) | null
  }>({
    terrain: null,
    scene: null,
    updateColors: null
  })
  
  // Reference for settings export/import
  const [settingsJson, setSettingsJson] = useState('')
  
  // Function to change the terrain
  const changeTerrain = useCallback((terrain: typeof TERRAIN_PRESETS[0]) => {
    setSelectedTerrain(terrain)
    setLoading(true)
    
    // Clean up existing terrain from the scene
    if (sceneRef.current.terrain && sceneRef.current.scene) {
      sceneRef.current.scene.remove(sceneRef.current.terrain)
      sceneRef.current.terrain = null
    }
    
    // The useEffect will handle loading the new terrain due to the dependency
  }, [])
  
  // Update a specific color stop in the heat map
  const updateColorStop = (index: number, color: string) => {
    const newStops = [...heatMapStops]
    newStops[index] = { ...newStops[index], color }
    setHeatMapStops(newStops)
    
    // If terrain is already rendered, update colors
    if (sceneRef.current.updateColors) {
      sceneRef.current.updateColors(newStops)
    }
  }
  
  // Export settings to JSON
  const exportSettings = useCallback(() => {
    const settingsString = JSON.stringify({
      heatMap: {
        stops: heatMapStops
      },
      terrain: {
        name: selectedTerrain.name,
        url: selectedTerrain.url
      }
    }, null, 2)
    setSettingsJson(settingsString)
    
    // Copy to clipboard
    navigator.clipboard.writeText(settingsString)
      .then(() => {
        console.log('Settings copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy settings to clipboard', err)
      })
  }, [heatMapStops, selectedTerrain])
  
  // Import settings from JSON
  const importSettings = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      
      // Update heat map stops if present
      if (parsed.heatMap && parsed.heatMap.stops) {
        setHeatMapStops(parsed.heatMap.stops)
        
        // Update colors if terrain is already rendered
        if (sceneRef.current.updateColors) {
          sceneRef.current.updateColors(parsed.heatMap.stops)
        }
      }
      
      // Update terrain if present
      if (parsed.terrain && parsed.terrain.url) {
        const matchingTerrain = TERRAIN_PRESETS.find(t => t.url === parsed.terrain.url)
        if (matchingTerrain) {
          changeTerrain(matchingTerrain)
        }
      }
      
      setSettingsJson('')
      
    } catch (error) {
      console.error('Failed to parse settings JSON', error)
    }
  }, [changeTerrain])

  useEffect(() => {
    if (!containerRef.current) return

    let terrain: THREE.Mesh | null = null
    let controls: OrbitControls | null = null
    let renderer: THREE.WebGLRenderer | null = null
    
    // Keep a ref to the container for cleanup
    const container = containerRef.current

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Black background
    sceneRef.current.scene = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 50, 100)

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Function to convert heat map colors to Three.js colors
    const getColorAtHeight = (normalizedHeight: number, colorStops: {name: string, color: string}[]) => {
      // Map the normalized height to a color from our color stops
      const numStops = colorStops.length
      const stopInterval = 1 / (numStops - 1)
      
      for (let i = 0; i < numStops - 1; i++) {
        const threshold = i * stopInterval
        const nextThreshold = (i + 1) * stopInterval
        
        if (normalizedHeight >= threshold && normalizedHeight < nextThreshold) {
          const lerpFactor = (normalizedHeight - threshold) / stopInterval
          const color1 = new THREE.Color(colorStops[i].color)
          const color2 = new THREE.Color(colorStops[i + 1].color)
          return color1.lerp(color2, lerpFactor)
        }
      }
      
      // If we're at the very top end
      return new THREE.Color(colorStops[numStops - 1].color)
    }

    // Load and process the Mapzen Terrarium PNG
    const loadTerrainData = async () => {
      try {
        setLoading(true)

        // Create an image element to load the PNG
        const img = new Image()
        img.crossOrigin = "anonymous" // Important for CORS

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error("Failed to load terrain image"))
          img.src = selectedTerrain.url // Use the selected terrain URL
        })

        // Create a canvas to extract pixel data
        const canvas = document.createElement("canvas")
        const width = img.width
        const height = img.height
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0)

        // Get the pixel data
        const imageData = ctx.getImageData(0, 0, width, height)
        const pixels = imageData.data

        // Extract elevation data using Mapzen Terrarium format
        // Elevation = (R * 256 + G + B / 256) - 32768
        const heightMap = new Float32Array(width * height)

        let minElevation = Number.POSITIVE_INFINITY
        let maxElevation = Number.NEGATIVE_INFINITY

        for (let i = 0; i < width * height; i++) {
          const r = pixels[i * 4]
          const g = pixels[i * 4 + 1]
          const b = pixels[i * 4 + 2]

          // Calculate elevation in meters
          const elevation = r * 256 + g + b / 256 - 32768

          // Store elevation
          heightMap[i] = elevation

          // Track min/max for statistics
          minElevation = Math.min(minElevation, elevation)
          maxElevation = Math.max(maxElevation, elevation)
        }

        // Update stats for display
        setStats({
          min: minElevation,
          max: maxElevation,
          range: maxElevation - minElevation,
        })

        // Create the terrain
        createTerrain(heightMap, width, height)
        setLoading(false)
      } catch (err) {
        console.error("Error loading terrain data:", err)
        setError("Failed to load terrain data. Using procedural generation instead.")

        // Fallback to procedural generation
        const resolution = 256
        const heightMap = generateProceduralHeightMap(resolution)
        createTerrain(heightMap, resolution, resolution)
        setLoading(false)
      }
    }

    // Generate procedural height map as fallback
    const generateProceduralHeightMap = (resolution: number) => {
      const heightMap = new Float32Array(resolution * resolution)
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const index = i * resolution + j
          const x = i / resolution
          const y = j / resolution

          heightMap[index] =
            Math.sin(x * 5) * Math.cos(y * 5) * 5 +
            Math.sin(x * 15) * Math.cos(y * 15) * 2.5 +
            Math.sin(x * 30) * Math.cos(y * 30) * 1.25 +
            Math.sin(x * 60) * Math.cos(y * 60) * 0.5
        }
      }
      return heightMap
    }

    // Create terrain with height data
    const createTerrain = (heightMap: Float32Array, width: number, height: number) => {
      // Scale factors for the terrain
      const terrainWidth = 100
      const terrainHeight = 100
      const heightScale = 0.05 // Scale down the height for better visualization

      // Create geometry
      const geometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, width - 1, height - 1)

      // Find min and max heights for normalization
      let minHeight = Number.POSITIVE_INFINITY
      let maxHeight = Number.NEGATIVE_INFINITY
      for (let i = 0; i < heightMap.length; i++) {
        minHeight = Math.min(minHeight, heightMap[i])
        maxHeight = Math.max(maxHeight, heightMap[i])
      }

      const heightRange = maxHeight - minHeight

      // Apply height map to geometry
      const vertices = geometry.attributes.position.array
      for (let i = 0; i < vertices.length; i += 3) {
        const vertexIndex = i / 3
        const x = Math.floor(vertexIndex % width)
        const y = Math.floor(vertexIndex / width)
        const heightMapIndex = y * width + x

        if (heightMapIndex < heightMap.length) {
          vertices[i + 2] = heightMap[heightMapIndex] * heightScale
        }
      }

      // Update normals for proper lighting
      geometry.computeVertexNormals()

      // Create a function to update the colors based on heat map settings
      const updateTerrainColors = (colorStops: {name: string, color: string}[]) => {
        // Create color map based on height
        const colorMap = new Float32Array(width * height * 3)
        for (let i = 0; i < heightMap.length; i++) {
          const height = heightMap[i]

          // Normalize height to 0-1 range for color mapping
          const normalizedHeight = (height - minHeight) / heightRange

          // Get color from our heat map color stops
          const color = getColorAtHeight(normalizedHeight, colorStops)

          colorMap[i * 3] = color.r
          colorMap[i * 3 + 1] = color.g
          colorMap[i * 3 + 2] = color.b
        }

        // Add/update colors to geometry
        geometry.setAttribute("color", new THREE.BufferAttribute(colorMap, 3))
        
        // Update the geometry if it's already been added to the scene
        if (terrain) {
          geometry.attributes.color.needsUpdate = true
        }
      }
      
      // Store the update function in our ref
      sceneRef.current.updateColors = updateTerrainColors
      
      // Initial color application
      updateTerrainColors(heatMapStops)

      // Create material with vertex colors
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        side: THREE.DoubleSide,
      })

      // Create mesh and add to scene
      terrain = new THREE.Mesh(geometry, material)
      terrain.rotation.x = -Math.PI / 2 // Rotate to horizontal
      scene.add(terrain)
      
      // Store reference to terrain
      sceneRef.current.terrain = terrain
    }

    // Start loading the terrain data
    loadTerrainData()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (controls) controls.update()
      if (renderer) renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!container || !renderer) return

      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (container && renderer) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [heatMapStops, selectedTerrain])

  // Add custom slider styles
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

  return (
    <main className="relative w-full min-h-screen bg-black p-0 m-0 overflow-hidden">
      {/* Custom slider styles */}
      <style jsx global>{sliderStyles}</style>
      
      {/* Main content - full width and takes full height */}
      <div className="relative w-full h-screen">
        {/* Terrain Container */}
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white font-mono text-sm">
            Loading terrain data...
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-4 right-4 max-w-xl mx-auto bg-red-900/70 border border-red-700 text-white px-4 py-3 rounded-none">
            {error}
          </div>
        )}
        
        {/* Toggle controls button - cog icon */}
        <button 
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-none transition-colors shadow-lg backdrop-blur-sm"
          aria-label={showControls ? "Hide Controls" : "Show Controls"}
        >
          <CogIcon />
        </button>
        
        {/* Controls panel overlay - Minimalist design */}
        {showControls && (
          <div className="absolute top-16 right-4 z-10 w-96 max-w-[90vw] bg-black/80 backdrop-blur-md p-3 rounded-none shadow-xl overflow-hidden max-h-[80vh] transition-all duration-200 ease-in-out border border-white/10">
            {/* Material design inspired tabs */}
            <div className="flex border-b border-white/10 mb-4 justify-between">
              <button 
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'presets' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Presets
                {activeTab === 'presets' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('heatmap')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'heatmap' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Heat Map
                {activeTab === 'heatmap' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('terrain')}
                className={`px-3 py-2 text-xs font-medium relative ${activeTab === 'terrain' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Terrain Data
                {activeTab === 'terrain' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                )}
              </button>
            </div>
            
            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-4 px-1">
                <div className="space-y-3">
                  <h3 className="text-white/90 text-xs font-medium mb-2">Terrain Selection</h3>
                  <div className="space-y-2">
                    {TERRAIN_PRESETS.map((terrain, index) => (
                      <div 
                        key={index}
                        className={`w-full bg-black/50 hover:bg-black/70 text-white/90 py-2 px-3 rounded-none text-xs font-medium transition-colors flex items-center justify-between border ${selectedTerrain.url === terrain.url ? 'border-blue-500' : 'border-white/10'}`}
                      >
                        <label className="flex items-center gap-3 w-full cursor-pointer">
                          <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                            {selectedTerrain.url === terrain.url && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <input
                            type="radio"
                            name="terrain"
                            className="sr-only"
                            checked={selectedTerrain.url === terrain.url}
                            onChange={() => changeTerrain(terrain)}
                          />
                          <div className="flex flex-col">
                            <span>{terrain.name}</span>
                            <span className="text-xs text-gray-400">{terrain.description}</span>
                          </div>
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
                      <div className="bg-black/50 p-2 rounded-none text-white/80 text-xs overflow-auto max-h-24 font-mono">
                        {settingsJson}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white/90 text-xs font-medium mb-1">Import Settings</h3>
                  <textarea
                    placeholder="Paste settings JSON here..."
                    className="w-full h-24 bg-black/50 p-2 rounded-none text-white/80 text-xs font-mono border border-white/10 focus:outline-none focus:border-blue-500"
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
            
            {/* Heat Map Controls */}
            {activeTab === 'heatmap' && (
              <div className="space-y-3 px-1">
                <h3 className="text-white/90 text-xs font-medium mb-2">Heat Map Colors</h3>
                {heatMapStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-white/70 w-20">{stop.name}</span>
                    <label 
                      htmlFor={`colorStop${index}`}
                      className="h-6 rounded-none flex-1 cursor-pointer"
                      style={{ backgroundColor: stop.color }}
                    ></label>
                    <input
                      type="color"
                      id={`colorStop${index}`}
                      value={stop.color}
                      onChange={(e) => updateColorStop(index, e.target.value)}
                      className="sr-only"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Terrain Data */}
            {activeTab === 'terrain' && stats && (
              <div className="space-y-4 px-1">
                <h3 className="text-white/90 text-xs font-medium mb-2">Terrain Statistics</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-black p-3 rounded-none border border-white/10 flex justify-between">
                    <span className="text-xs text-white/70">Minimum Elevation:</span>
                    <span className="text-xs text-white">{stats.min.toFixed(2)} m</span>
                  </div>
                  <div className="bg-black p-3 rounded-none border border-white/10 flex justify-between">
                    <span className="text-xs text-white/70">Maximum Elevation:</span>
                    <span className="text-xs text-white">{stats.max.toFixed(2)} m</span>
                  </div>
                  <div className="bg-black p-3 rounded-none border border-white/10 flex justify-between">
                    <span className="text-xs text-white/70">Elevation Range:</span>
                    <span className="text-xs text-white">{stats.range.toFixed(2)} m</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  <p>Use mouse to rotate, scroll to zoom, and right-click to pan.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Navigation back to main page */}
      <Link 
        href="/"
        className="absolute bottom-4 left-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-none transition-colors shadow-lg backdrop-blur-sm"
      >
        Back to Main
      </Link>
    </main>
  )
} 