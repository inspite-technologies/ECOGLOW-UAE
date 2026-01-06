import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchBanner } from '../services/bannerAPI';
import './BannerSection.css';

// Fallback image in case API fails or is loading
import fallbackImage from '../assets/A9.webp';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Resolve Image URL ---
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return fallbackImage;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  // Fix Windows backslashes and prepend server URL
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

function BannerSection() {
  // Data State
  const [bannerData, setBannerData] = useState(null);
  
  // Animation/UI State
  const [slidePosition, setSlidePosition] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchBanner();
        // Handle varied response structures
        let result = response.data || response;
        if (Array.isArray(result)) result = result[0];
        
        setBannerData(result);
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    loadData();
  }, []);

  // --- 2. VIEWPORT HEIGHT FIX ---
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // --- 3. MOBILE DETECTION ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 4. GSAP ANIMATIONS ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%', 
        end: 'bottom 10%',
        onEnter: () => setSectionInView(true),
        onLeave: () => setSectionInView(false),
        onEnterBack: () => setSectionInView(true),
        onLeaveBack: () => setSectionInView(false),
      });

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- 5. SLIDER AUTO-ANIMATION ---
  useEffect(() => {
    const totalDuration = 6000;
    const cycles = 1;
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      if (elapsed >= totalDuration) {
        setSlidePosition(50);
        setAnimationComplete(true);
        return;
      }

      const progress = elapsed / totalDuration;
      const sineValue = Math.sin(progress * Math.PI * 2 * cycles);
      const position = 50 + (sineValue * 40);
      
      setSlidePosition(position);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (sectionInView && !isDragging && !animationComplete) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sectionInView, isDragging, animationComplete]);

  // --- 6. DRAG HANDLERS ---
  const handleMove = useCallback((clientX) => {
    const container = sectionRef.current?.querySelector('.banner-wrapper');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSlidePosition(Math.min(Math.max(percentage, 0), 100));
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => { 
      if (isDragging) {
        e.preventDefault();
        handleMove(e.clientX); 
      }
    };
    
    const onTouchMove = (e) => { 
      if (isDragging) {
        e.preventDefault();
        handleMove(e.touches[0].clientX); 
      }
    };
    
    const onStop = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onStop);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onStop);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onStop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onStop);
    };
  }, [isDragging, handleMove]);

  const handleDragStart = (e) => {
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    setIsDragging(true);
    setAnimationComplete(true);
  };

  // Resolve content variables
  const displayImage = getImageUrl(bannerData?.image);
  const displayText = bannerData?.text || "A Place You Love to Return To";

  return (
    <section className="banner-section" id="banner" ref={sectionRef}>
      <div className="banner-wrapper">
        
        {/* Layer 1: Dark / Before (Background) */}
        <div className="banner-layer layer-dark">
          <div className="banner-img-container">
            <img 
              src={displayImage} 
              alt="Before" 
              className="banner-img" 
              draggable="false" 
            />
          </div>
          <div className="banner-dark-filter"></div>
        </div>

        {/* Layer 2: Bright / After (Reveal) */}
        <div 
          className="banner-layer layer-reveal"
          style={{ clipPath: `inset(0 ${100 - slidePosition}% 0 0)` }}
        >
          <div className="banner-img-container">
            <img 
              src={displayImage} 
              alt="After" 
              className="banner-img" 
              draggable="false" 
            />
          </div>
          <div className="banner-content">
            <h2 className="banner-heading" ref={headingRef}>
              {displayText}
            </h2>
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="banner-handle"
          style={{ left: `${slidePosition}%` }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          role="slider"
          aria-label="Image comparison slider"
          aria-valuenow={Math.round(slidePosition)}
          aria-valuemin="0"
          aria-valuemax="100"
          tabIndex="0"
        >
          <div className="handle-line"></div>
          <div className="handle-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M8 18l-6-6 6-6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}

export default BannerSection;