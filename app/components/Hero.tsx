// components/Hero.tsx
"use client";
import React, { useRef, useEffect, useState, createContext, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import SelfDrawingShapes from "./SelfDrawingShapes";

// Create context for unified mouse tracking
interface MouseContextType {
  mousePosition: { x: number; y: number };
  centerOffset: { x: number; y: number };
}

const MouseContext = createContext<MouseContextType>({
  mousePosition: { x: 0, y: 0 },
  centerOffset: { x: 0, y: 0 }
});

// Provider component for mouse tracking
const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate center offset based on cursor position
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const maxOffset = 100; // Maximum pixels to move
        
        const offsetX = ((x - centerX) / centerX) * maxOffset;
        const offsetY = ((y - centerY) / centerY) * maxOffset;
        
        setMousePosition({ x, y });
        setCenterOffset({ x: offsetX, y: offsetY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isClient]);

  return (
    <MouseContext.Provider value={{ mousePosition, centerOffset }}>
      {children}
    </MouseContext.Provider>
  );
};

// Hook to use mouse context
const useMouse = () => useContext(MouseContext);

// Parallax wrapper component for dynamic movement
const ParallaxWrapper: React.FC<{ 
  children: React.ReactNode; 
  speed?: number; 
  className?: string;
  direction?: 'horizontal' | 'vertical' | 'both';
}> = ({ children, speed = 0.5, className = '', direction = 'both' }) => {
  const { centerOffset } = useMouse();

  const offsetX = direction === 'horizontal' || direction === 'both' ? centerOffset.x * speed : 0;
  const offsetY = direction === 'vertical' || direction === 'both' ? centerOffset.y * speed : 0;

  return (
    <div
      className={className}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        transition: 'transform 0.15s ease-out'
      }}
    >
      {children}
    </div>
  );
};

// Magnetic headline effect
const MagneticHeadline: React.FC<{ children: string }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Update each letter's position based on mouse proximity
    Array.from(container.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      
      const letterRect = child.getBoundingClientRect();
      const letterCenterX = letterRect.left + letterRect.width / 2;
      const letterCenterY = letterRect.top + letterRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - letterCenterX, 2) + 
        Math.pow(mousePosition.y - letterCenterY, 2)
      );
      
      // Attract letters within 80px of cursor
      if (distance < 80) {
        const strength = (80 - distance) / 80; // 0 to 1
        const angle = Math.atan2(mousePosition.y - letterCenterY, mousePosition.x - letterCenterX);
        const attractDistance = 20 * strength;
        
        const x = Math.cos(angle) * attractDistance;
        const y = Math.sin(angle) * attractDistance;
        
        child.style.transform = `translate(${x}px, ${y}px)`;
        child.style.transition = 'transform 0.15s ease-out';
      } else {
        // Return to original position
        child.style.transform = 'translate(0px, 0px)';
        child.style.transition = 'transform 0.15s ease-out';
      }
    });
  }, [mousePosition, isClient]);

  return (
    <div
      ref={containerRef}
      className="inline-block cursor-pointer stylish-headline"
      style={{ fontFamily: 'Inter, sans-serif' }}
      data-text={children}
    >
      {children.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            transition: "color 0.2s ease",
          }}
          whileHover={{ 
            background: 'linear-gradient(135deg, #e30613 0%, #dc2626 100%)',
            backgroundClip: 'text'
          }}
          onHoverStart={(e) => {
            const target = e.target as HTMLElement;
            target.style.webkitBackgroundClip = 'text';
            target.style.webkitTextFillColor = 'transparent';
          }}
          onHoverEnd={(e) => {
            const target = e.target as HTMLElement;
            target.style.webkitBackgroundClip = '';
            target.style.webkitTextFillColor = '';
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

// Particle system with repelling effect
const PARTICLE_COUNT = 60;
const PARTICLE_SIZE = 8;
const REPEL_RADIUS = 100;
const REPEL_STRENGTH = 2.2;
const SPEED = 0.5;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    randomChangeCounter: number;
    baseSpeed: number;
  }>>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    setIsClient(true);
    
    // Initialize particles only on client side to prevent hydration mismatch
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: randomBetween(0, 1),
      y: randomBetween(0, 1),
      vx: randomBetween(-SPEED, SPEED),
      vy: randomBetween(-SPEED, SPEED),
      randomChangeCounter: Math.floor(randomBetween(0, 100)),
      baseSpeed: randomBetween(0.3, 0.8),
    }));
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };
    window.addEventListener("mouseout", handleMouseLeave);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles.current) {
        // Random direction changes
        p.randomChangeCounter++;
        if (p.randomChangeCounter > randomBetween(50, 150)) {
          // Add random velocity changes
          p.vx += randomBetween(-0.2, 0.2);
          p.vy += randomBetween(-0.2, 0.2);
          p.randomChangeCounter = 0;
        }

        // Repel from mouse
        const dx = p.x * width - mouse.current.x;
        const dy = p.y * height - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_STRENGTH;
          p.vx += Math.cos(angle) * force * 0.1;
          p.vy += Math.sin(angle) * force * 0.1;
        }

        // Move
        p.x += p.vx / width;
        p.y += p.vy / height;

        // Bounce off edges with some randomness
        if (p.x < 0) { 
          p.x = 0; 
          p.vx = Math.abs(p.vx) + randomBetween(0, 0.1);
        }
        if (p.x > 1) { 
          p.x = 1; 
          p.vx = -Math.abs(p.vx) - randomBetween(0, 0.1);
        }
        if (p.y < 0) { 
          p.y = 0; 
          p.vy = Math.abs(p.vy) + randomBetween(0, 0.1);
        }
        if (p.y > 1) { 
          p.y = 1; 
          p.vy = -Math.abs(p.vy) - randomBetween(0, 0.1);
        }

        // Variable friction based on base speed
        const friction = 0.98 + (p.baseSpeed - 0.5) * 0.02;
        p.vx *= friction;
        p.vy *= friction;

        // Keep velocity within reasonable bounds
        const maxSpeed = p.baseSpeed * 2;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

        // Draw with varying opacity based on speed
        const opacity = 0.1 + (currentSpeed / maxSpeed) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, PARTICLE_SIZE, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(227,6,19,${opacity})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [isClient]);

  // Don't render canvas until client-side
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: "block" }}
      width={1920}
      height={1080}
      aria-hidden="true"
    />
  );
};

export default function Hero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mouse tracking for border light effect
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    button.style.setProperty('--mouse-x', `${x}%`);
    button.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.style.removeProperty('--mouse-x');
    button.style.removeProperty('--mouse-y');
  };

  // Don't render interactive elements until client-side
  if (!isClient) {
    return (
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-8 lg:px-12 py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Static background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="hero-bg-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/20"></div>
          <div className="absolute top-20 left-10 w-32 h-32 border border-red-200/30 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-red-200/30 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 border border-red-200/20 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Static content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8 md:mb-12 rounded-full" />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className="font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-6 md:mb-8 lg:mb-10 leading-tight drop-shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="stylish-headline">Design Made Intelligent</span>
            </h1>
          </motion.div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 md:mb-12 lg:mb-16 max-w-5xl leading-relaxed font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            From brand kit to launch-ready content, websites & apps — powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 md:gap-10 justify-center items-center">
            <button className="holographic-button relative rounded-3xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#e30613] focus:ring-opacity-50 overflow-hidden group" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="relative z-10">Try the Demo</span>
            </button>
            <button className="liquid-metal-button relative rounded-3xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#e30613] focus:ring-opacity-50 overflow-hidden group" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="relative z-10">Join Waitlist</span>
            </button>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-12 md:mt-16 rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <MouseProvider>
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-8 lg:px-12 py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="hero-bg-pulse"></div>
          {/* Additional subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/20"></div>
          {/* Decorative geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-red-200/30 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-red-200/30 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 border border-red-200/20 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Self-drawing shapes background */}
        <SelfDrawingShapes />
        
        {/* Particle background */}
        <ParticleBackground />
        
        {/* Main content fade-in */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Decorative accent line */}
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8 md:mb-12 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
          
          {/* Headline with parallax effect */}
          <ParallaxWrapper speed={0.3} direction="both">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <h1 className="font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-6 md:mb-8 lg:mb-10 leading-tight drop-shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <MagneticHeadline>Design Made Intelligent</MagneticHeadline>
              </h1>
            </motion.div>
          </ParallaxWrapper>
          
          {/* Subtitle with parallax effect */}
          <ParallaxWrapper speed={0.2} direction="horizontal">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 md:mb-12 lg:mb-16 max-w-5xl leading-relaxed font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              From brand kit to launch-ready content, websites & apps — powered by AI.
            </p>
          </ParallaxWrapper>
          
          {/* Enhanced button container with decorative elements and parallax effect */}
          <ParallaxWrapper speed={0.4} direction="both">
            <div className="flex flex-col sm:flex-row gap-8 md:gap-10 justify-center items-center">
              {/* Holographic Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="holographic-button relative rounded-3xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#e30613] focus:ring-opacity-50 overflow-hidden group"
                aria-label="Try the Demo"
                style={{ fontFamily: 'Inter, sans-serif' }}
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
              >
                <span className="relative z-10">Try the Demo</span>
                {/* Holographic scan lines */}
                <div className="absolute inset-0 holographic-scan-lines"></div>
                {/* Holographic glow */}
                <div className="absolute inset-0 holographic-glow"></div>
                {/* Floating holographic elements */}
                <div className="absolute inset-0 holographic-elements">
                  <div className="holographic-element" style={{ left: '10%', top: '20%' }}></div>
                  <div className="holographic-element" style={{ left: '80%', top: '60%' }}></div>
                  <div className="holographic-element" style={{ left: '50%', top: '80%' }}></div>
                </div>
              </motion.button>
              
              {/* Liquid Metal Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="liquid-metal-button relative rounded-3xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#e30613] focus:ring-opacity-50 overflow-hidden group"
                aria-label="Join Waitlist"
                style={{ fontFamily: 'Inter, sans-serif' }}
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
              >
                <span className="relative z-10">Join Waitlist</span>
                {/* Liquid metal surface */}
                <div className="absolute inset-0 liquid-metal-surface"></div>
                {/* Morphing shapes */}
                <div className="absolute inset-0 morphing-shapes">
                  <div className="morphing-shape shape-1"></div>
                  <div className="morphing-shape shape-2"></div>
                  <div className="morphing-shape shape-3"></div>
                </div>
                {/* Liquid droplets */}
                <div className="absolute inset-0 liquid-droplets">
                  <div className="droplet" style={{ left: '15%', top: '30%', animationDelay: '0s' }}></div>
                  <div className="droplet" style={{ left: '75%', top: '70%', animationDelay: '0.5s' }}></div>
                  <div className="droplet" style={{ left: '45%', top: '85%', animationDelay: '1s' }}></div>
                </div>
              </motion.button>
            </div>
          </ParallaxWrapper>
          
          {/* Bottom decorative accent */}
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-12 md:mt-16 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
          />
        </motion.div>
      </section>
    </MouseProvider>
  );
}

// Export the MouseContext for use in other components
export { MouseContext };