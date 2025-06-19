"use client";
import React, { useRef, useContext, useState, useEffect } from 'react';
import { MouseContext } from './Hero';

const SHAPES = [
  // Original shapes (1 of each)
  { type: 'polygon', points: '100,300 300,100 500,300', key: 'triangle' },
  { type: 'rect', x: 600, y: 200, width: 200, height: 200, key: 'square' },
  { type: 'circle', cx: 200, cy: 700, r: 100, key: 'circle' },
  { type: 'polygon', points: '700,600 750,550 800,600 800,700 750,750 700,700', key: 'hexagon' },
  { type: 'polygon', points: '400,800 420,750 450,800 420,850 400,800', key: 'star' },
  { type: 'polygon', points: '800,400 850,350 900,400 850,450', key: 'diamond' },
  { type: 'path', d: 'M 100,100 Q 150,100 150,150 Q 150,200 100,200 Q 50,200 50,150 Q 50,100 100,100', key: 'spiral' },
  { type: 'path', d: 'M 50,900 Q 200,850 350,900 Q 500,950 650,900 Q 800,850 950,900', key: 'wave' },
  
  // Unique shapes (1 of each)
  { type: 'polygon', points: '250,250 260,240 270,250 270,260 260,270 250,260', key: 'cross' },
  { type: 'polygon', points: '750,150 760,140 770,150 760,160 750,150', key: 'arrow' },
  { type: 'path', d: 'M 300,300 Q 320,280 340,300 Q 320,320 300,300', key: 'heart' },
  { type: 'polygon', points: '400,200 410,190 420,200 415,210 425,220 415,210 400,200', key: 'lightning' },
  { type: 'path', d: 'M 100,400 Q 120,380 140,400 Q 120,420 100,400', key: 'infinity' },
  { type: 'path', d: 'M 200,200 Q 220,180 240,200 Q 220,220 200,200', key: 'crescent' },
  { type: 'path', d: 'M 500,100 L 510,110 L 520,100 L 530,110 L 540,100', key: 'zigzag' },
  
  // Medium shapes (1 of each type)
  { type: 'polygon', points: '150,150 200,100 250,150 200,200', key: 'diamond2' },
  { type: 'circle', cx: 800, cy: 800, r: 30, key: 'circle2' },
  { type: 'rect', x: 50, y: 600, width: 60, height: 60, key: 'square2' },
  { type: 'polygon', points: '650,250 670,230 690,250 670,270', key: 'triangle2' },
  { type: 'path', d: 'M 300,400 Q 350,350 400,400 Q 350,450 300,400', key: 'curve' },
  
  // Tiny shapes (1 of each unique type)
  { type: 'polygon', points: '160,160 180,140 200,160 180,180', key: 'tiny-star' },
  { type: 'polygon', points: '380,380 385,375 390,380 385,385', key: 'tiny-cross' },
  { type: 'polygon', points: '580,580 585,575 590,580 585,585', key: 'tiny-arrow' },
  { type: 'path', d: 'M 780,780 Q 785,775 790,780 Q 785,785 780,780', key: 'tiny-heart' },
  { type: 'polygon', points: '980,180 985,175 990,180 985,185', key: 'tiny-lightning' },
  { type: 'path', d: 'M 80,480 Q 85,475 90,480 Q 85,485 80,480', key: 'tiny-infinity' },
  { type: 'path', d: 'M 280,680 Q 285,675 290,680 Q 285,685 280,680', key: 'tiny-crescent' },
  { type: 'path', d: 'M 680,280 L 685,285 L 690,280 L 695,285 L 700,280', key: 'tiny-zigzag' },
  { type: 'circle', cx: 880, cy: 480, r: 8, key: 'tiny-circle' },
  { type: 'rect', x: 180, y: 680, width: 16, height: 16, key: 'tiny-square' },
  { type: 'polygon', points: '380,880 390,870 400,880 390,890', key: 'tiny-diamond' },
  { type: 'polygon', points: '580,380 590,370 600,380 590,390', key: 'tiny-triangle' },
  { type: 'path', d: 'M 480,880 Q 485,875 490,880 Q 485,885 480,880', key: 'tiny-spiral' },
  
  // New wavy and unique shapes (1 of each)
  { type: 'path', d: 'M 100,500 Q 150,450 200,500 Q 250,550 300,500 Q 350,450 400,500', key: 'wavy-line' },
  { type: 'path', d: 'M 600,300 Q 650,250 700,300 Q 750,350 800,300 Q 850,250 900,300', key: 'wavy-curve' },
  { type: 'path', d: 'M 200,100 Q 250,50 300,100 Q 350,150 400,100 Q 450,50 500,100', key: 'wavy-top' },
  { type: 'polygon', points: '350,350 360,340 370,350 365,360 375,370 365,360 350,350', key: 'bolt' },
  { type: 'polygon', points: '450,450 460,440 470,450 465,460 475,470 465,460 450,450', key: 'flash' },
  { type: 'path', d: 'M 550,550 Q 570,530 590,550 Q 610,570 630,550 Q 650,530 670,550', key: 'sine-wave' },
  { type: 'polygon', points: '750,750 760,740 770,750 760,760 750,750', key: 'teardrop' },
  { type: 'path', d: 'M 850,850 Q 870,830 890,850 Q 910,870 930,850 Q 950,830 970,850', key: 'ripple' },
  { type: 'polygon', points: '150,850 160,840 170,850 165,860 175,870 165,860 150,850', key: 'spark' },
  { type: 'path', d: 'M 250,950 Q 270,930 290,950 Q 310,970 330,950 Q 350,930 370,950', key: 'ocean-wave' },
  { type: 'polygon', points: '950,950 960,940 970,950 965,960 975,970 965,960 950,950', key: 'energy' },
  { type: 'path', d: 'M 50,750 Q 70,730 90,750 Q 110,770 130,750 Q 150,730 170,750', key: 'mountain' },
  { type: 'polygon', points: '650,650 660,640 670,650 665,660 675,670 665,660 650,650', key: 'pulse' },
  { type: 'path', d: 'M 750,450 Q 770,430 790,450 Q 810,470 830,450 Q 850,430 870,450', key: 'frequency' },
  { type: 'polygon', points: '450,750 460,740 470,750 465,760 475,770 465,760 450,750', key: 'signal' },
];

const SHAPE_CENTERS = [
  // Original shapes
  { x: 300, y: 233 }, // triangle
  { x: 700, y: 300 }, // square
  { x: 200, y: 700 }, // circle
  { x: 750, y: 650 }, // hexagon
  { x: 420, y: 800 }, // star
  { x: 850, y: 400 }, // diamond
  { x: 100, y: 150 }, // spiral (approx)
  { x: 500, y: 900 }, // wave (approx)
  
  // Unique shapes
  { x: 260, y: 250 }, // cross
  { x: 760, y: 150 }, // arrow
  { x: 320, y: 300 }, // heart
  { x: 410, y: 200 }, // lightning
  { x: 120, y: 400 }, // infinity
  { x: 220, y: 200 }, // crescent
  { x: 520, y: 100 }, // zigzag
  
  // Medium shapes
  { x: 200, y: 150 }, // diamond2
  { x: 800, y: 800 }, // circle2
  { x: 80, y: 630 }, // square2
  { x: 670, y: 250 }, // triangle2
  { x: 350, y: 400 }, // curve
  
  // Tiny shapes
  { x: 180, y: 160 }, // tiny-star
  { x: 385, y: 380 }, // tiny-cross
  { x: 585, y: 580 }, // tiny-arrow
  { x: 785, y: 780 }, // tiny-heart
  { x: 985, y: 180 }, // tiny-lightning
  { x: 85, y: 480 }, // tiny-infinity
  { x: 285, y: 680 }, // tiny-crescent
  { x: 690, y: 280 }, // tiny-zigzag
  { x: 880, y: 480 }, // tiny-circle
  { x: 188, y: 688 }, // tiny-square
  { x: 390, y: 880 }, // tiny-diamond
  { x: 590, y: 380 }, // tiny-triangle
  { x: 485, y: 880 }, // tiny-spiral
  
  // New wavy and unique shapes
  { x: 250, y: 500 }, // wavy-line
  { x: 750, y: 300 }, // wavy-curve
  { x: 350, y: 100 }, // wavy-top
  { x: 360, y: 350 }, // bolt
  { x: 460, y: 450 }, // flash
  { x: 610, y: 550 }, // sine-wave
  { x: 760, y: 750 }, // teardrop
  { x: 910, y: 850 }, // ripple
  { x: 160, y: 850 }, // spark
  { x: 310, y: 950 }, // ocean-wave
  { x: 960, y: 950 }, // energy
  { x: 110, y: 750 }, // mountain
  { x: 660, y: 650 }, // pulse
  { x: 810, y: 450 }, // frequency
  { x: 460, y: 750 }, // signal
];

const REPULSION_RADIUS = 120;
const REPULSION_STRENGTH = 40;

const SelfDrawingShapes: React.FC = () => {
  const { mousePosition, centerOffset } = useContext(MouseContext);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate repulsion for each shape
  const getRepelled = (cx: number, cy: number) => {
    const dx = cx - mousePosition.x;
    const dy = cy - mousePosition.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPULSION_RADIUS) {
      const angle = Math.atan2(dy, dx);
      const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS * REPULSION_STRENGTH;
      return {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
      };
    }
    return { x: 0, y: 0 };
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1000 1000"
        style={{
          transform: `translateX(${centerOffset.x}px)`
        }}
      >
        <defs>
          <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {SHAPES.map((shape, index) => {
          const center = SHAPE_CENTERS[index];
          const repelled = getRepelled(center.x, center.y);
          const animationDelay = (index * 0.1) % 3;
          const animationDuration = 2 + (index % 3);
          
          return (
            <g key={shape.key}>
              {shape.type === 'polygon' && (
                <polygon
                  points={shape.points}
                  fill="url(#shapeGradient)"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  opacity="0"
                  style={{
                    animation: `drawShape ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
                    transform: `translate(${repelled.x}px, ${repelled.y}px)`
                  }}
                />
              )}
              {shape.type === 'rect' && (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="url(#shapeGradient)"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  opacity="0"
                  style={{
                    animation: `drawShape ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
                    transform: `translate(${repelled.x}px, ${repelled.y}px)`
                  }}
                />
              )}
              {shape.type === 'circle' && (
                <circle
                  cx={shape.cx}
                  cy={shape.cy}
                  r={shape.r}
                  fill="url(#shapeGradient)"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  opacity="0"
                  style={{
                    animation: `drawShape ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
                    transform: `translate(${repelled.x}px, ${repelled.y}px)`
                  }}
                />
              )}
              {shape.type === 'path' && (
                <path
                  d={shape.d}
                  fill="url(#shapeGradient)"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  opacity="0"
                  style={{
                    animation: `drawShape ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
                    transform: `translate(${repelled.x}px, ${repelled.y}px)`
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
      
      <style jsx>{`
        @keyframes drawShape {
          0% {
            opacity: 0;
            stroke-dasharray: 0 1000;
            stroke-dashoffset: 1000;
          }
          20% {
            opacity: 0.8;
            stroke-dasharray: 1000 0;
            stroke-dashoffset: 0;
          }
          80% {
            opacity: 0.8;
            stroke-dasharray: 1000 0;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0;
            stroke-dasharray: 0 1000;
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};

export default SelfDrawingShapes; 