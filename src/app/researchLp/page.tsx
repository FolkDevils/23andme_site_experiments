'use client'

import ReserchHero from '@/components/ReserchHero'
import BackgroundAnimation from '@/components/backgroundAnimation'
import ResearchNavigation from '@/components/ResearchNavigation'
import FlexibleCard from '@/components/FlexibleCard'
import { useEffect, useState } from 'react'

export default function ResearchLpPage() {
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		// Set loaded state after page is fully mounted
		const timer = setTimeout(() => {
			setIsLoaded(true)
		}, 100) // Small delay to ensure everything is mounted

		return () => clearTimeout(timer)
	}, [])

	return (
		<>
			{/* Page loader - white overlay */}
			{!isLoaded && (
				<div className="fixed inset-0 bg-white z-[9999]" />
			)}
			
			<div className={`min-h-screen relative transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
				{/* Background animation stays behind everything */}
				<BackgroundAnimation />
			
			{/* Sticky Navigation - 24px from top, centered, above everything */}
			<div className="sticky top-6 z-50 flex justify-center">
				<ResearchNavigation />
			</div>
			
			{/* Hero Content - raised up to show cards below the fold */}
			<div className="relative z-10 flex items-end justify-center">
				<ReserchHero />
			</div>
			
			{/* Card Grid - individual cards arranged in three columns */}
			<div className="relative z-10 w-full max-w-[1440px] mx-auto px-10 pt-2 pb-16">
				<div className="grid grid-cols-3 gap-4">
					{/* Column 1 */}
					<div className="flex flex-col gap-4">
						<FlexibleCard 
							aspectRatio="9:16" 
							videoSrc="/assets/Video_02.mp4" 
							headline="The Empathy Gene"
							headlineVerticalAlignment="centered"
							headlineHorizontalAlignment="centered"
						/>
						<FlexibleCard 
							aspectRatio="1:1" 
							videoSrc="/assets/Video_05.mp4" 
							headline="It's Not Hormones"
						headlineVerticalAlignment="centered"
							headlineHorizontalAlignment="centered"
						/>
						<FlexibleCard 
							aspectRatio="1:1" 
							videoSrc="/assets/Video_09.mp4" 
							headline="The Brain's Hidden DJ"
							headlineVerticalAlignment="bottom"
						/>
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/Video_11.mp4" 
							headline="Neuro Inheritance"
							headlineVerticalAlignment="bottom"
						/>
					</div>
					
					{/* Column 2 */}
					<div className="flex flex-col gap-4">
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/Video_03.mp4" 
							headline="15 Million Reasons Why"
							headlineVerticalAlignment="bottom"
						/>
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/Video_06.mp4" 
							headline="The Youniverse"
								headlineVerticalAlignment="centered"
							headlineHorizontalAlignment="centered"
						/>
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/Video_04.mp4" 
							headline="Solved Mysteries"
							headlineVerticalAlignment="centered"
							headlineHorizontalAlignment="centered"
						/>
						<FlexibleCard 
							aspectRatio="1:1" 
							videoSrc="/assets/Video_08.mp4" 
							headline="Rhythm Ain't Random"
								headlineVerticalAlignment="centered"
							headlineHorizontalAlignment="centered"
						/>
					</div>
					
					{/* Column 3 */}
					<div className="flex flex-col gap-4">
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/Video_01.mp4" 
							headline="Sound, Fury & Stutter"
							headlineVerticalAlignment="bottom"
						/>
						<FlexibleCard 
							aspectRatio="4:5" 
							videoSrc="/assets/video_12.mp4" 
							headline="Diversity and DNA"
							headlineVerticalAlignment="top"
						/>
						<FlexibleCard 
							aspectRatio="1:1" 
							videoSrc="/assets/Video_10.mp4" 
							headline="Long COVID? Blame DNA"
							headlineVerticalAlignment="bottom"
						/>
						<FlexibleCard 
							aspectRatio="9:16" 
							videoSrc="/assets/Video_07.mp4" 
							headline="Your DNA, Your Choice"
							headlineVerticalAlignment="top"
						/>
					</div>
				</div>
			</div>
			</div>
		</>
	)
}
