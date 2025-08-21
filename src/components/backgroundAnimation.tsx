'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function BackgroundAnimation() {
	const containerRef = useRef<HTMLDivElement>(null)
	const blobRefs = useRef<HTMLDivElement[]>([])

	useEffect(() => {
		if (!containerRef.current) return

		const blobs = blobRefs.current

		// Set initial positions for each blob - pushed to left and right sides
		blobs.forEach((blob, index) => {
			if (!blob) return

			// Position blobs more towards the edges, leaving center cleaner
			const positions = [
				{ x: '5%', y: '25%' },   // Far left, upper
				{ x: '95%', y: '20%' },  // Far right, upper
				{ x: '0%', y: '65%' },   // Far left, lower
				{ x: '85%', y: '70%' },  // Right side, lower
				{ x: '15%', y: '5%' },   // Left side, top
				{ x: '100%', y: '85%' }  // Far right, bottom
			]

			gsap.set(blob, {
				left: positions[index].x,
				top: positions[index].y,
				xPercent: -50,
				yPercent: -50
			})
		})

		// Create individual timelines for each blob
		const timelines = blobs.map((blob, index) => {
			if (!blob) return null

			const tl = gsap.timeline({ repeat: -1, yoyo: false })

			switch (index) {
				case 0: // Slow circular drift with scaling
					tl.to(blob, {
						motionPath: {
							path: "M0,0 Q100,50 200,0 T400,0",
							autoRotate: false,
						},
						scale: 1.3,
						duration: 25,
						ease: "power1.inOut"
					})
					.to(blob, {
						scale: 0.7,
						duration: 20,
						ease: "power2.inOut"
					})
					break

				case 1: // Vertical sway with pulsing (right side)
					tl.to(blob, {
						y: "+=200",
						x: "+=50", // Slight inward drift
						scale: 1.4,
						duration: 18,
						ease: "power2.inOut"
					})
					.to(blob, {
						y: "-=400",
						x: "-=100", // Move back out
						scale: 0.8,
						duration: 20,
						ease: "power2.inOut"
					})
					.to(blob, {
						y: "+=200",
						x: "+=50", // Return to position
						scale: 1.1,
						duration: 18,
						ease: "power2.inOut"
					})
					break

				case 2: // Constrained horizontal sway (left side)
					tl.to(blob, {
						x: "+=150", // Reduced from 300
						scale: 0.9,
						duration: 22,
						ease: "power1.inOut"
					})
					.to(blob, {
						x: "-=200", // Reduced from 600, keep on left
						scale: 1.5,
						duration: 24,
						ease: "power1.inOut"
					})
					.to(blob, {
						x: "+=50", // Gentle return
						scale: 1.0,
						duration: 22,
						ease: "power1.inOut"
					})
					break

				case 3: // Smaller figure-8 pattern (right side)
					tl.to(blob, {
						x: "+=75", // Reduced movement
						y: "+=100",
						scale: 1.2,
						duration: 15,
						ease: "power2.inOut"
					})
					.to(blob, {
						x: "-=75",
						y: "+=100",
						scale: 0.6,
						duration: 15,
						ease: "power2.inOut"
					})
					.to(blob, {
						x: "-=75",
						y: "-=100",
						scale: 1.6,
						duration: 15,
						ease: "power2.inOut"
					})
					.to(blob, {
						x: "+=75",
						y: "-=100",
						scale: 1.0,
						duration: 15,
						ease: "power2.inOut"
					})
					break

				case 4: // Contained drift (left side)
					tl.to(blob, {
						x: "+=100", // Reduced from 250
						y: "+=180",
						scale: 0.8,
						duration: 28,
						ease: "power1.inOut"
					})
					.to(blob, {
						x: "-=100", // Keep contained to left
						y: "-=180",
						scale: 1.3,
						duration: 28,
						ease: "power1.inOut"
					})
					break

				case 5: // Organic circular motion with pulsing
					tl.to(blob, {
						rotation: 360,
						transformOrigin: "450px 450px",
						scale: 1.2,
						duration: 15,
						ease: "power2.inOut"
					})
					.to(blob, {
						scale: 0.7,
						duration: 15,
						ease: "power2.inOut"
					})
					break

				default:
					break
			}

			return tl
		})

		// Add independent scaling animations for more organic feel
		const scaleTimelines = blobs.map((blob, index) => {
			if (!blob) return null

			const scaleTl = gsap.timeline({ repeat: -1, yoyo: true })
			const baseDelay = index * 2.5 // Stagger the scaling animations
			
			scaleTl.to(blob, {
				scaleX: gsap.utils.random(0.8, 1.4),
				scaleY: gsap.utils.random(0.9, 1.3),
				duration: gsap.utils.random(12, 18),
				delay: baseDelay,
				ease: "power2.inOut"
			})

			return scaleTl
		})

		// Cleanup function
		return () => {
			timelines.forEach(tl => tl && tl.kill())
			scaleTimelines.forEach(tl => tl && tl.kill())
		}
	}, [])

	const blobColors = [
		'#FF6D19',
		'#FF96C8', 
		'#FF6D19',
		'#3595D6',
		'#BFFFFF',
		'#FF96C8'
	]

	return (
		<div 
			ref={containerRef}
			className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
			style={{ zIndex: -1 }}
		>
			{/* Background blobs */}
			<div className="absolute inset-0">
				{blobColors.map((color, index) => (
					<div
						key={index}
						ref={(el) => {
							if (el) blobRefs.current[index] = el
						}}
						className="absolute"
						style={{
							width: '1200px',
							height: '1200px',
							background: `radial-gradient(circle, ${color}40 0%, ${color}20 30%, transparent 70%)`,
							borderRadius: '50%',
							filter: 'blur(50px)',
							mixBlendMode: 'multiply',
							opacity: 0.7
						}}
					/>
				))}
			</div>
			
			{/* Overall smoothing blur layer */}
			<div 
				className="absolute inset-0"
				style={{
					backdropFilter: 'blur(80px)',
					WebkitBackdropFilter: 'blur(80px)',
					background: 'rgba(255, 255, 255, 0.02)'
				}}
			/>
		</div>
	)
}
