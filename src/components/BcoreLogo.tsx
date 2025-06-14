"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BcoreLogoProps {
    className?: string;
    width?: number;
    height?: number;
}

const BcoreLogo: React.FC<BcoreLogoProps> = ({
    className = '',
    width = 1635,
    height = 301
}) => {
    const ticksRef = useRef<SVGGElement>(null);
    const circleArrowsRef = useRef<SVGGElement>(null);
    const crosshairsRef = useRef<SVGGElement>(null);
    const arclinesRef = useRef<SVGGElement>(null);
    const dotsRef = useRef<SVGGElement>(null);
    const dotsTimelineRef = useRef<gsap.core.Timeline | null>(null);
    
    // Separate direction refs for each element
    const ticksDirectionRef = useRef(1);
    const circleArrowsDirectionRef = useRef(-1);
    const crosshairsDirectionRef = useRef(1);
    const arclinesDirectionRef = useRef(-1);

    useEffect(() => {
        // Create timelines for each element
        const ticksTimeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
        });
        
        const circleArrowsTimeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "power1.inOut" }
        });
        
        const crosshairsTimeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
        });
        
        const arclinesTimeline = gsap.timeline({
            repeat: -1,
            defaults: { ease: "power1.inOut" }
        });
        
        // Function to create animation for an element
        const createAnimation = (element: SVGGElement | null, direction: number, duration: number, timeline: gsap.core.Timeline) => {
            if (!element) return;
            
            timeline.clear();
            timeline.to(element, {
                rotation: 360 * direction,
                duration: duration,
                transformOrigin: "center center"
            });
        };
        
        // Initial animations
        createAnimation(ticksRef.current, ticksDirectionRef.current, 15, ticksTimeline);
        createAnimation(circleArrowsRef.current, circleArrowsDirectionRef.current, 12, circleArrowsTimeline);
        createAnimation(crosshairsRef.current, crosshairsDirectionRef.current, 18, crosshairsTimeline);
        createAnimation(arclinesRef.current, arclinesDirectionRef.current, 20, arclinesTimeline);
        
        // Function to randomly change direction
        const randomizeDirection = () => {
            // Randomly change direction for each element independently
            if (Math.random() > 0.5) ticksDirectionRef.current *= -1;
            if (Math.random() > 0.5) circleArrowsDirectionRef.current *= -1;
            if (Math.random() > 0.5) crosshairsDirectionRef.current *= -1;
            if (Math.random() > 0.5) arclinesDirectionRef.current *= -1;
            
            // Update animations with new directions
            createAnimation(ticksRef.current, ticksDirectionRef.current, 15, ticksTimeline);
            createAnimation(circleArrowsRef.current, circleArrowsDirectionRef.current, 12, circleArrowsTimeline);
            createAnimation(crosshairsRef.current, crosshairsDirectionRef.current, 18, crosshairsTimeline);
            createAnimation(arclinesRef.current, arclinesDirectionRef.current, 20, arclinesTimeline);
        };
        
        // Change directions at random intervals
        const interval = setInterval(randomizeDirection, 8000);
        
        // Also add some random direction changes at different intervals
        const randomIntervals = [
            setInterval(() => { if (Math.random() > 0.7) ticksDirectionRef.current *= -1; createAnimation(ticksRef.current, ticksDirectionRef.current, 15, ticksTimeline); }, 12000),
            setInterval(() => { if (Math.random() > 0.7) circleArrowsDirectionRef.current *= -1; createAnimation(circleArrowsRef.current, circleArrowsDirectionRef.current, 12, circleArrowsTimeline); }, 10000),
            setInterval(() => { if (Math.random() > 0.7) crosshairsDirectionRef.current *= -1; createAnimation(crosshairsRef.current, crosshairsDirectionRef.current, 18, crosshairsTimeline); }, 15000),
            setInterval(() => { if (Math.random() > 0.7) arclinesDirectionRef.current *= -1; createAnimation(arclinesRef.current, arclinesDirectionRef.current, 20, arclinesTimeline); }, 13000)
        ];

        // Animate all dot groups
        if (dotsRef.current) {
            const dotGroups = dotsRef.current.querySelectorAll('.dot-group');
            dotGroups.forEach((dot) => {
                // Random duration between 1.5 and 2.5 seconds
                const duration = 1.5 + Math.random();
                // Random delay between 0 and 1 second
                const startDelay = Math.random();
                
                gsap.to(dot, {
                    x: 'random(-15, 15)',
                    y: 'random(-15, 15)',
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: startDelay,
                    // Make the movement more fluid
                    smoothOrigin: true
                });
            });
        }

        return () => {
            clearInterval(interval);
            randomIntervals.forEach(clearInterval);
            ticksTimeline.kill();
            circleArrowsTimeline.kill();
            crosshairsTimeline.kill();
            arclinesTimeline.kill();
            if (dotsRef.current) {
                const dotGroups = dotsRef.current.querySelectorAll('.dot-group');
                dotGroups.forEach(dot => {
                    gsap.killTweensOf(dot);
                });
            }
        };
    }, []);

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1635 301"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <clipPath id="clip0_1_2">
                    <rect width="1635" height="301" fill="white" />
                </clipPath>
            </defs>
            <g clipPath="url(#clip0_1_2)">
                <g id="letters">
                    <path d="M0 28.81C0 20.61 3.28 17.33 11.48 17.33H199.22C207.42 17.33 213.16 19.79 218.89 25.53L246.35 52.99C250.86 57.91 254.14 64.88 254.14 71.44V100.13C254.14 108.33 251.68 114.07 246.35 119.4L217.25 148.09L248.81 178.83C254.14 184.16 256.6 189.9 256.6 198.1V224.74C256.6 231.3 253.32 238.68 248.81 243.19L220.53 271.47C214.79 277.21 209.05 279.67 200.85 279.67H11.48C3.28 279.67 0 276.39 0 268.19V28.81ZM34.02 133.75H188.56L220.94 100.96L220.12 74.32L193.48 46.86H34.02V133.76V133.75ZM195.53 250.16L223.4 221.88L224.22 198.11L188.56 163.27H34.02V250.17H195.52L195.53 250.16Z" fill="white" />
                    <path d="M386.01 82.18C385.79 77.86 387.52 75.91 391.85 75.91H397.04C401.36 75.91 403.09 77.64 403.09 81.96V97.09C403.09 101.41 401.79 104.44 398.77 107.68L316.86 193.26L317.08 208.82C317.08 213.14 315.57 215.09 311.24 215.09H306.05C301.73 215.09 300 213.36 300 209.04V193.91C300 189.59 301.3 186.56 304.32 183.32L386.44 97.52L386.01 82.17V82.18Z" fill="#D6E200" />
                    <path d="M724.12 49.71C729.45 55.04 729.86 59.96 724.12 65.29L714.69 74.31C709.36 79.64 704.44 79.64 698.7 73.49L672.88 46.43H531.46L488.01 89.47V207.11L531.87 250.56H673.7L699.11 223.91C704.85 217.76 709.77 217.35 715.1 223.09L723.71 232.11C729.04 237.44 729.04 242.36 723.71 247.69L697.89 273.11C692.56 278.44 686.82 280.9 678.62 280.9H527.77C519.57 280.9 513.83 278.44 508.51 273.11L461.78 226.79C456.45 221.46 453.99 215.72 453.99 207.52V89.88C453.99 81.68 456.45 75.94 462.19 70.2L508.1 24.29C513.84 18.55 519.58 16.09 527.77 16.09H678.62C686.82 16.09 692.56 18.55 697.89 23.88L724.12 49.7V49.71Z" fill="white" />
                    <path d="M1116.43 268.2C1116.43 276.4 1113.15 280.09 1104.95 280.09H1095.11C1086.91 280.09 1083.22 277.22 1083.22 269.02V28.81C1083.22 20.61 1086.5 17.33 1094.7 17.33H1273.01C1281.21 17.33 1286.95 19.79 1292.27 25.12L1325.47 58.73C1330.8 64.06 1333.26 69.8 1333.26 77.99V120.21C1333.26 128.41 1330.8 134.15 1325.47 139.48L1291.86 172.27L1323.83 203.83C1329.16 209.16 1331.62 214.9 1331.62 223.1V269.01C1331.62 277.21 1328.34 280.49 1320.14 280.49H1308.25C1300.05 280.49 1296.77 277.21 1296.77 269.42L1297.59 223.1L1262.34 188.26H1116.41V268.19L1116.43 268.2ZM1116.43 158.34H1262.36L1298.84 122.27V77.59L1268.92 47.67H1116.43V158.35V158.34Z" fill="white" />
                    <path d="M1396.19 28.81C1396.19 20.61 1399.47 17.33 1407.67 17.33H1590.08C1598.28 17.33 1604.02 19.79 1609.35 25.12L1629.43 44.8C1634.76 50.13 1634.76 55.46 1629.02 61.2L1621.64 68.58C1615.9 74.73 1610.98 74.73 1605.24 68.58L1584.74 47.27H1428.97V131.71H1583.92C1592.12 131.71 1595.4 134.99 1595.4 143.19V153.03C1595.4 161.23 1592.12 164.51 1584.33 164.51L1428.97 164.1V249.77H1586.38L1606.47 229.27C1612.21 223.53 1616.72 223.12 1622.46 228.45L1631.07 236.65C1636.4 241.98 1636.4 246.9 1630.25 252.64L1610.57 271.9C1605.24 277.23 1599.5 279.69 1591.31 279.69H1407.67C1399.47 279.69 1396.19 276.41 1396.19 268.21V28.81Z" fill="white" />
                </g>
                <g id="container">
                    <g id="crosshairs" ref={crosshairsRef}>
                        <path d="M934.26 114.35L933.88 113.98L953.85 94L954.23 94.38L934.26 114.35Z" fill="white" />
                        <path d="M953.85 206.23L938.84 191.21L939.22 190.83L954.23 205.85L953.85 206.23Z" fill="white" />
                        <path d="M842.38 206.23L842 205.85L861.98 185.87L862.36 186.25L842.38 206.23Z" fill="white" />
                        <path d="M861.98 114.35L842 94.38L842.38 94L862.36 113.98L861.98 114.35Z" fill="white" />
                    </g>
                    <path d="M897.68 165.36C889.58 165.36 883 158.77 883 150.68C883 142.59 889.59 136 897.68 136C905.77 136 912.36 142.59 912.36 150.68C912.36 158.77 905.77 165.36 897.68 165.36ZM897.68 138.13C890.77 138.13 885.14 143.75 885.14 150.67C885.14 157.59 890.76 163.21 897.68 163.21C904.6 163.21 910.22 157.59 910.22 150.67C910.22 143.75 904.59 138.13 897.68 138.13Z" fill="white" />
                    <path d="M897.61 300.22C857.65 300.22 820.08 284.66 791.82 256.4C763.56 228.14 748 190.57 748 150.61C748 110.65 763.56 73.08 791.82 44.82C820.08 16.57 857.65 1 897.61 1C937.57 1 975.14 16.56 1003.4 44.82C1031.66 73.08 1047.22 110.65 1047.22 150.61C1047.22 190.57 1031.66 228.14 1003.4 256.4C975.14 284.66 937.57 300.22 897.61 300.22ZM897.61 1.54C815.41 1.54 748.54 68.41 748.54 150.61C748.54 232.81 815.41 299.68 897.61 299.68C979.81 299.68 1046.68 232.81 1046.68 150.61C1046.68 68.41 979.81 1.54 897.61 1.54Z" fill="white" stroke="white" strokeWidth="1.51" strokeMiterlimit="10" />
                    <g id="arclines" ref={arclinesRef}>
                        <path d="M754.37 150.34H749C749 232.82 815.86 299.68 898.34 299.68V294.31C818.95 294.31 754.37 229.72 754.37 150.34Z" fill="white" />
                        <path d="M1042.31 150.34H1047.68C1047.68 67.86 980.82 1 898.34 1V6.37C977.73 6.37 1042.31 70.96 1042.31 150.34Z" fill="white" />
                    </g>
                    <g id="centerlines">
                        <path d="M909.74 254.97H887.26V255.51H909.74V254.97Z" fill="white" />
                        <path d="M913.42 232.32H883.58V232.86H913.42V232.32Z" fill="white" />
                        <path d="M911.02 247.42H885.99V247.96H911.02V247.42Z" fill="white" />
                        <path d="M912.19 239.87H884.8V240.41H912.19V239.87Z" fill="white" />
                        <path d="M914.64 224.78H882.35V225.32H914.64V224.78Z" fill="white" />
                        <path d="M915.87 217.23H881.13V217.77H915.87V217.23Z" fill="white" />
                        <path d="M917.1 209.68H879.9V210.22H917.1V209.68Z" fill="white" />
                        <path d="M918.33 202.14H878.68V202.68H918.33V202.14Z" fill="white" />
                        <path d="M919.55 194.59H877.45V195.13H919.55V194.59Z" fill="white" />
                        <path d="M920.77 187.04H876.22V187.58H920.77V187.04Z" fill="white" />
                        <path d="M922 179.49H875V180.03H922V179.49Z" fill="white" />
                        <path d="M911.02 53.55H885.99V54.09H911.02V53.55Z" fill="white" />
                        <path d="M909.74 46H887.26V46.54H909.74V46Z" fill="white" />
                        <path d="M913.42 68.64H883.58V69.18H913.42V68.64Z" fill="white" />
                        <path d="M912.19 61.09H884.8V61.63H912.19V61.09Z" fill="white" />
                        <path d="M914.64 76.19H882.35V76.73H914.64V76.19Z" fill="white" />
                        <path d="M918.33 98.83H878.68V99.37H918.33V98.83Z" fill="white" />
                        <path d="M915.87 83.74H881.13V84.28H915.87V83.74Z" fill="white" />
                        <path d="M917.1 91.28H879.9V91.82H917.1V91.28Z" fill="white" />
                        <path d="M919.55 106.38H877.45V106.92H919.55V106.38Z" fill="white" />
                        <path d="M920.77 113.93H876.22V114.47H920.77V113.93Z" fill="white" />
                        <path d="M922 121.47H875V122.01H922V121.47Z" fill="white" />
                    </g>
                    <g id="ticks" ref={ticksRef}>
                        <path d="M897.88 9H897.34V17.81H897.88V9Z" fill="white" />
                        <path d="M874.28 19.87L872.76 11.19L873.28 11.1L874.81 19.78L874.28 19.87Z" fill="white" />
                        <path d="M851.94 25.91L848.92 17.63L849.43 17.44L852.44 25.72L851.94 25.91Z" fill="white" />
                        <path d="M812.04 49.05L806.38 42.3L806.79 41.95L812.45 48.7L812.04 49.05Z" fill="white" />
                        <path d="M795.71 65.45L788.96 59.78L789.3 59.37L796.05 65.04L795.71 65.45Z" fill="white" />
                        <path d="M775.111 79.5699L774.841 80.0375L782.47 84.4425L782.74 83.9749L775.111 79.5699Z" fill="white" />
                        <path d="M772.73 105.43L764.45 102.42L764.64 101.92L772.91 104.93L772.73 105.43Z" fill="white" />
                        <path d="M827.072 27.8989L826.604 28.1689L831.009 35.7986L831.477 35.5286L827.072 27.8989Z" fill="white" />
                        <path d="M766.78 127.81L758.11 126.28L758.2 125.75L766.88 127.28L766.78 127.81Z" fill="white" />
                        <path d="M758.2 175.45L758.11 174.93L766.78 173.4L766.88 173.92L758.2 175.45Z" fill="white" />
                        <path d="M764.81 150.33H756V150.87H764.81V150.33Z" fill="white" />
                        <path d="M764.64 199.29L764.45 198.78L772.73 195.77L772.91 196.27L764.64 199.29Z" fill="white" />
                        <path d="M789.3 241.83L788.96 241.42L795.71 235.75L796.05 236.17L789.3 241.83Z" fill="white" />
                        <path d="M782.458 216.714L774.826 221.115L775.095 221.583L782.727 217.182L782.458 216.714Z" fill="white" />
                        <path d="M806.79 259.25L806.38 258.9L812.04 252.16L812.45 252.5L806.79 259.25Z" fill="white" />
                        <path d="M830.998 265.5L826.595 273.131L827.063 273.401L831.465 265.769L830.998 265.5Z" fill="white" />
                        <path d="M849.43 283.76L848.92 283.57L851.94 275.3L852.44 275.48L849.43 283.76Z" fill="white" />
                        <path d="M873.28 290.1L872.76 290.01L874.28 281.33L874.81 281.43L873.28 290.1Z" fill="white" />
                        <path d="M897.88 283.4H897.34V292.21H897.88V283.4Z" fill="white" />
                        <path d="M921.93 290.1L920.4 281.43L920.93 281.33L922.46 290.01L921.93 290.1Z" fill="white" />
                        <path d="M945.79 283.76L942.78 275.48L943.28 275.3L946.29 283.57L945.79 283.76Z" fill="white" />
                        <path d="M964.261 265.551L963.793 265.821L968.198 273.451L968.666 273.181L964.261 265.551Z" fill="white" />
                        <path d="M988.43 259.25L982.76 252.5L983.17 252.16L988.84 258.9L988.43 259.25Z" fill="white" />
                        <path d="M1005.91 241.83L999.16 236.17L999.51 235.75L1006.26 241.42L1005.91 241.83Z" fill="white" />
                        <path d="M1012.75 216.768L1012.48 217.235L1020.11 221.64L1020.38 221.173L1012.75 216.768Z" fill="white" />
                        <path d="M1030.58 199.29L1022.3 196.27L1022.49 195.77L1030.77 198.78L1030.58 199.29Z" fill="white" />
                        <path d="M1037.02 175.45L1028.34 173.92L1028.43 173.4L1037.11 174.93L1037.02 175.45Z" fill="white" />
                        <path d="M1039.21 150.33H1030.4V150.87H1039.21V150.33Z" fill="white" />
                        <path d="M1028.43 127.81L1028.34 127.28L1037.02 125.75L1037.11 126.28L1028.43 127.81Z" fill="white" />
                        <path d="M1030.57 101.872L1022.29 104.892L1022.48 105.399L1030.75 102.379L1030.57 101.872Z" fill="white" />
                        <path d="M1020.07 79.5069L1012.44 83.9079L1012.71 84.3757L1020.34 79.9747L1020.07 79.5069Z" fill="white" />
                        <path d="M999.51 65.45L999.16 65.04L1005.91 59.37L1006.26 59.78L999.51 65.45Z" fill="white" />
                        <path d="M983.17 49.05L982.76 48.7L988.43 41.95L988.84 42.3L983.17 49.05Z" fill="white" />
                        <path d="M968.228 27.8695L963.827 35.5014L964.295 35.7712L968.696 28.1392L968.228 27.8695Z" fill="white" />
                        <path d="M943.28 25.91L942.78 25.72L945.79 17.44L946.29 17.63L943.28 25.91Z" fill="white" />
                    </g>
                    <g id="circleArrows" ref={circleArrowsRef}>
                        <path d="M897.74 265.48C834.47 265.48 783 214.01 783 150.74C783 87.47 834.47 36 897.74 36C961.01 36 1012.48 87.47 1012.48 150.74C1012.48 214.01 961.01 265.48 897.74 265.48ZM897.74 36.53C834.77 36.53 783.53 87.76 783.53 150.74C783.53 213.72 834.76 264.95 897.74 264.95C960.72 264.95 1011.95 213.72 1011.95 150.74C1011.95 87.76 960.72 36.53 897.74 36.53Z" fill="white" />
                        <path d="M797.98 157.33L786.44 150.75L797.98 144.17V157.34V157.33ZM787.53 150.74L797.45 156.4V145.08L787.53 150.74Z" fill="white" />
                        <path d="M997.49 157.33V144.16L1009.03 150.74L997.49 157.32V157.33ZM998.03 145.08V156.4L1007.95 150.74L998.03 145.08Z" fill="white" />
                    </g>
                    <g id="dots" ref={dotsRef}>
                      <g className="dot-group">
                        <path d="M779.9 75.45C779.9 76.25 779.25 76.9 778.45 76.9C777.65 76.9 777 76.25 777 75.45C777 74.65 777.65 74 778.45 74C779.25 74 779.9 74.65 779.9 75.45Z" fill="white" />
                       </g>
                       <g className="dot-group">
                        <path d="M814.17 75.45C814.17 76.25 813.52 76.9 812.72 76.9C811.92 76.9 811.27 76.25 811.27 75.45C811.27 74.65 811.92 74 812.72 74C813.52 74 814.17 74.65 814.17 75.45Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M848.45 75.45C848.45 76.25 847.8 76.9 847 76.9C846.2 76.9 845.55 76.25 845.55 75.45C845.55 74.65 846.2 74 847 74C847.8 74 848.45 74.65 848.45 75.45Z" fill="white" />
                        </g>
                        <g className="dot-group">
                       <path d="M882.72 75.45C882.72 76.25 882.07 76.9 881.27 76.9C880.47 76.9 879.82 76.25 879.82 75.45C879.82 74.65 880.47 74 881.27 74C882.07 74 882.72 74.65 882.72 75.45Z" fill="white" />
                       </g>
                       <g className="dot-group">
                        <path d="M917 75.45C917 76.25 916.35 76.9 915.55 76.9C914.75 76.9 914.1 76.25 914.1 75.45C914.1 74.65 914.75 74 915.55 74C916.35 74 917 74.65 917 75.45Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M951.27 75.45C951.27 76.25 950.62 76.9 949.82 76.9C949.02 76.9 948.37 76.25 948.37 75.45C948.37 74.65 949.02 74 949.82 74C950.62 74 951.27 74.65 951.27 75.45Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M985.55 75.45C985.55 76.25 984.9 76.9 984.1 76.9C983.3 76.9 982.65 76.25 982.65 75.45C982.65 74.65 983.3 74 984.1 74C984.9 74 985.55 74.65 985.55 75.45Z" fill="white" />
                        </g>
                        <g className="dot-group">
                       <path d="M1019.83 75.45C1019.83 76.25 1019.18 76.9 1018.38 76.9C1017.58 76.9 1016.93 76.25 1016.93 75.45C1016.93 74.65 1017.58 74 1018.38 74C1019.18 74 1019.83 74.65 1019.83 75.45Z" fill="white" />
                       </g>
                       <g className="dot-group">
                        <path d="M778.45 127.03C779.251 127.03 779.9 126.381 779.9 125.58C779.9 124.779 779.251 124.13 778.45 124.13C777.649 124.13 777 124.779 777 125.58C777 126.381 777.649 127.03 778.45 127.03Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M814.17 125.58C814.17 126.38 813.52 127.03 812.72 127.03C811.92 127.03 811.27 126.38 811.27 125.58C811.27 124.78 811.92 124.13 812.72 124.13C813.52 124.13 814.17 124.78 814.17 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M848.45 125.58C848.45 126.38 847.8 127.03 847 127.03C846.2 127.03 845.55 126.38 845.55 125.58C845.55 124.78 846.2 124.13 847 124.13C847.8 124.13 848.45 124.78 848.45 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M882.72 125.58C882.72 126.38 882.07 127.03 881.27 127.03C880.47 127.03 879.82 126.38 879.82 125.58C879.82 124.78 880.47 124.13 881.27 124.13C882.07 124.13 882.72 124.78 882.72 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M915.55 127.03C916.351 127.03 917 126.381 917 125.58C917 124.779 916.351 124.13 915.55 124.13C914.749 124.13 914.1 124.779 914.1 125.58C914.1 126.381 914.749 127.03 915.55 127.03Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M951.27 125.58C951.27 126.38 950.62 127.03 949.82 127.03C949.02 127.03 948.37 126.38 948.37 125.58C948.37 124.78 949.02 124.13 949.82 124.13C950.62 124.13 951.27 124.78 951.27 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M985.55 125.58C985.55 126.38 984.9 127.03 984.1 127.03C983.3 127.03 982.65 126.38 982.65 125.58C982.65 124.78 983.3 124.13 984.1 124.13C984.9 124.13 985.55 124.78 985.55 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M1019.83 125.58C1019.83 126.38 1019.18 127.03 1018.38 127.03C1017.58 127.03 1016.93 126.38 1016.93 125.58C1016.93 124.78 1017.58 124.13 1018.38 124.13C1019.18 124.13 1019.83 124.78 1019.83 125.58Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M779.9 175.72C779.9 176.52 779.25 177.17 778.45 177.17C777.65 177.17 777 176.52 777 175.72C777 174.92 777.65 174.27 778.45 174.27C779.25 174.27 779.9 174.92 779.9 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M814.17 175.72C814.17 176.52 813.52 177.17 812.72 177.17C811.92 177.17 811.27 176.52 811.27 175.72C811.27 174.92 811.92 174.27 812.72 174.27C813.52 174.27 814.17 174.92 814.17 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M848.45 175.72C848.45 176.52 847.8 177.17 847 177.17C846.2 177.17 845.55 176.52 845.55 175.72C845.55 174.92 846.2 174.27 847 174.27C847.8 174.27 848.45 174.92 848.45 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M882.72 175.72C882.72 176.52 882.07 177.17 881.27 177.17C880.47 177.17 879.82 176.52 879.82 175.72C879.82 174.92 880.47 174.27 881.27 174.27C882.07 174.27 882.72 174.92 882.72 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M917 175.72C917 176.52 916.35 177.17 915.55 177.17C914.75 177.17 914.1 176.52 914.1 175.72C914.1 174.92 914.75 174.27 915.55 174.27C916.35 174.27 917 174.92 917 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M951.27 175.72C951.27 176.52 950.62 177.17 949.82 177.17C949.02 177.17 948.37 176.52 948.37 175.72C948.37 174.92 949.02 174.27 949.82 174.27C950.62 174.27 951.27 174.92 951.27 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                       <path d="M985.55 175.72C985.55 176.52 984.9 177.17 984.1 177.17C983.3 177.17 982.65 176.52 982.65 175.72C982.65 174.92 983.3 174.27 984.1 174.27C984.9 174.27 985.55 174.92 985.55 175.72Z" fill="white" />
                       </g>
                       <g className="dot-group">
                        <path d="M1019.83 175.72C1019.83 176.52 1019.18 177.17 1018.38 177.17C1017.58 177.17 1016.93 176.52 1016.93 175.72C1016.93 174.92 1017.58 174.27 1018.38 174.27C1019.18 174.27 1019.83 174.92 1019.83 175.72Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M779.9 225.86C779.9 226.66 779.25 227.31 778.45 227.31C777.65 227.31 777 226.66 777 225.86C777 225.06 777.65 224.41 778.45 224.41C779.25 224.41 779.9 225.06 779.9 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M814.17 225.86C814.17 226.66 813.52 227.31 812.72 227.31C811.92 227.31 811.27 226.66 811.27 225.86C811.27 225.06 811.92 224.41 812.72 224.41C813.52 224.41 814.17 225.06 814.17 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M848.45 225.86C848.45 226.66 847.8 227.31 847 227.31C846.2 227.31 845.55 226.66 845.55 225.86C845.55 225.06 846.2 224.41 847 224.41C847.8 224.41 848.45 225.06 848.45 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M882.72 225.86C882.72 226.66 882.07 227.31 881.27 227.31C880.47 227.31 879.82 226.66 879.82 225.86C879.82 225.06 880.47 224.41 881.27 224.41C882.07 224.41 882.72 225.06 882.72 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M917 225.86C917 226.66 916.35 227.31 915.55 227.31C914.75 227.31 914.1 226.66 914.1 225.86C914.1 225.06 914.75 224.41 915.55 224.41C916.35 224.41 917 225.06 917 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M951.27 225.86C951.27 226.66 950.62 227.31 949.82 227.31C949.02 227.31 948.37 226.66 948.37 225.86C948.37 225.06 949.02 224.41 949.82 224.41C950.62 224.41 951.27 225.06 951.27 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M985.55 225.86C985.55 226.66 984.9 227.31 984.1 227.31C983.3 227.31 982.65 226.66 982.65 225.86C982.65 225.06 983.3 224.41 984.1 224.41C984.9 224.41 985.55 225.06 985.55 225.86Z" fill="white" />
                        </g>
                        <g className="dot-group">
                        <path d="M1019.83 225.86C1019.83 226.66 1019.18 227.31 1018.38 227.31C1017.58 227.31 1016.93 226.66 1016.93 225.86C1016.93 225.06 1017.58 224.41 1018.38 224.41C1019.18 224.41 1019.83 225.06 1019.83 225.86Z" fill="white" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default BcoreLogo; 