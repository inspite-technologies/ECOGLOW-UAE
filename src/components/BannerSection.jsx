import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchBanner } from '../services/bannerAPI';
import './BannerSection.css';

// Fallback image
import fallbackImage from '../assets/A9.webp';

gsap.registerPlugin(ScrollTrigger);

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return fallbackImage;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
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
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchBanner();
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
    return () => window.removeEventListener('resize', setVH);
  }, []);

  // --- 3. GSAP ANIMATIONS ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%', 
        end: 'bottom 10%',
        onEnter: () => setSectionInView(true),
        onLeave: () => setSectionInView(false),
        onEnterBack: () => setSectionInView(true),
      });

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out',
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

  // --- 4. SLIDER AUTO-ANIMATION ---
  useEffect(() => {
    // Only animate after both images are loaded
    if (!imagesLoaded.before || !imagesLoaded.after) return;

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [sectionInView, isDragging, animationComplete, imagesLoaded]);

  // --- 5. DRAG HANDLERS ---
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
      if (isDragging) { e.preventDefault(); handleMove(e.clientX); }
    };
    const onTouchMove = (e) => { 
      if (isDragging) { e.preventDefault(); handleMove(e.touches[0].clientX); }
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
    if (e.type === 'mousedown') e.preventDefault();
    setIsDragging(true);
    setAnimationComplete(true);
  };

  // Image load handlers
  const handleBeforeImageLoad = () => {
    setImagesLoaded(prev => ({ ...prev, before: true }));
  };

  const handleAfterImageLoad = () => {
    setImagesLoaded(prev => ({ ...prev, after: true }));
  };

  // --- RESOLVE CONTENT VARIABLES ---
  const beforeImg = getImageUrl(bannerData?.beforeImage || bannerData?.image);
  const afterImg = getImageUrl(bannerData?.afterImage || bannerData?.image);
  const displayText = bannerData?.text || "A Place You Love to Return To";

  // Show loading state while images are loading
  const bothImagesLoaded = imagesLoaded.before && imagesLoaded.after;

  return (
    <section className="banner-section" id="banner" ref={sectionRef}>
      <div className="banner-wrapper">
        
        {/* Loading Overlay */}
        {!bothImagesLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <span style={{ fontSize: '1rem', color: '#6b7280' }}>Loading banner...</span>
          </div>
        )}

        {/* Layer 1 (Bottom/Background) -> RIGHT SIDE (BEFORE) */}
        <div className="banner-layer layer-dark">
          <div className="banner-img-container">
            <img 
              src={beforeImg} 
              alt="Before cleaning" 
              className="banner-img" 
              draggable="false"
              loading="lazy"
              onLoad={handleBeforeImageLoad}
              style={{ opacity: imagesLoaded.before ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          </div>
          <div className="banner-dark-filter"></div>
        </div>

        {/* Layer 2 (Top/Clipped) -> LEFT SIDE (AFTER) */}
        <div 
          className="banner-layer layer-reveal"
          style={{ clipPath: `inset(0 ${100 - slidePosition}% 0 0)` }}
        >
          <div className="banner-img-container">
            <img 
              src={afterImg} 
              alt="After cleaning" 
              className="banner-img" 
              draggable="false"
              loading="lazy"
              onLoad={handleAfterImageLoad}
              style={{ opacity: imagesLoaded.after ? 1 : 0, transition: 'opacity 0.3s' }}
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
          style={{ 
            left: `${slidePosition}%`,
            opacity: bothImagesLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="handle-line"></div>
          <div className="handle-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M8 18l-6-6 6-6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}

export default BannerSection;