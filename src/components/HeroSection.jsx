import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Removed: import { fetchHero } from '../services/heroAPI'; 
import './HeroSection.css';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
gsap.registerPlugin(ScrollTrigger);

// 1. Accept 'data' as a prop
function HeroSection({ data }) {
  const [services, setServices] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [displayTextIndex, setDisplayTextIndex] = useState(0);
  const [cardPositions, setCardPositions] = useState([]);
  const [isExpanding, setIsExpanding] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  // Note: Loading state is removed because 'Home.js' handles loading before rendering this component.

  const expandingCloneRef = useRef(null);
  const bgOverlayRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // --- INITIALIZE DATA FROM PROPS ---
  useEffect(() => {
    if (data && data.slides) {
      const slides = data.slides;
      setServices(slides);

      // Initialize positions based on the passed data
      const initialPositions = slides.map((_, index) => ({
        serviceIndex: (index + 1) % slides.length,
        position: index
      }));
      setCardPositions(initialPositions);
    }
  }, [data]);

  // Fade in cards after positions are set (prevents flash on mobile)
  useEffect(() => {
    if (cardPositions.length > 0 && cardsContainerRef.current) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Small delay to ensure positions are set
        setTimeout(() => {
          if (cardsContainerRef.current) {
            cardsContainerRef.current.style.opacity = '1';
          }
        }, 100);
      }
    }
  }, [cardPositions]);

  const getImgUrl = (path) => {
    if (!path) return "";
    const formatted = path.replace(/\\/g, "/");
    return formatted.startsWith("http") ? formatted : `${SERVER_URL}/${formatted}`;
  };

  // Extract the global link from data
  const globalLink = data?.sectionLink || "https://api.whatsapp.com/send/?phone=%2B971585766424&text&type=phone_number&app_absent=0";

  // Handler for Know More button click
  const handleKnowMoreClick = () => {
    if (globalLink.startsWith('http')) {
      window.open(globalLink, "_blank", "noopener,noreferrer");
    } else {
      // For internal routes like /services
      window.location.href = globalLink;
    }
  };

  const getCardStep = () => {
    const w = window.innerWidth;
    // ... (Your existing breakpoint logic remains identical)
    if (w >= 5120) return 360;
    if (w >= 4480) return 315;
    if (w >= 3456) return 275;
    if (w >= 3024) return 250;
    if (w >= 2880) return 240;
    if (w >= 2560) return 225;
    if (w >= 1920) return 205;
    if (w >= 1728) return 175;
    if (w >= 1536) return 168;
    if (w >= 1440) return 163;
    if (w >= 1280) return 155;
    if (w >= 1024) return 135;
    if (w >= 900) return 123;
    if (w >= 834) return 118;
    if (w >= 768) return 113;
    if (w >= 640) return 180;
    if (w >= 576) return 160;
    if (w >= 480) return 150;
    if (w >= 428) return 140;
    if (w >= 375) return 135;
    if (w >= 320) return 112;
    return 100;
  };

  const animateCardExpansion = useCallback((direction) => {
    if (isExpanding || services.length === 0) return;

    const topCardElement = cardsContainerRef.current?.querySelector('[data-position="0"]');
    if (!topCardElement || !expandingCloneRef.current) return;

    setIsExpanding(true);
    const rect = topCardElement.getBoundingClientRect();
    const clone = expandingCloneRef.current;
    const bgOverlay = bgOverlayRef.current;

    const topCardData = cardPositions.find(c => c.position === 0);
    const nextService = services[topCardData.serviceIndex];
    const nextBgImage = getImgUrl(nextService.image);
    const nextBgIndex = topCardData.serviceIndex;

    // Mobile detection
    const isMobile = window.innerWidth <= 768;

    // 1. Setup Clone
    gsap.set(clone, {
      display: 'block',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${nextBgImage})`,
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      borderRadius: '8px',
      zIndex: 50,
      force3D: true
    });

    const masterTL = gsap.timeline({
      onComplete: () => {
        gsap.set(clone, { display: 'none' });
        gsap.set(".card-item", { clearProps: "all" });
        setIsExpanding(false);
      }
    });

    // 2. Fade out text
    masterTL.to([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0, y: -20, duration: isMobile ? 0.25 : 0.3, ease: "power2.in", force3D: true
    }, 0);

    // 3. Expand Clone
    masterTL.to(clone, {
      top: 0, left: 0, width: '100%', height: '100vh',
      borderRadius: 0, duration: isMobile ? 0.6 : 0.8, ease: "power3.inOut", force3D: true
    }, 0);

    // 4. Animate Stack
    const currentStep = getCardStep();
    const allCards = cardsContainerRef.current.querySelectorAll('.card-item');
    allCards.forEach((card) => {
      const currentPos = parseInt(card.getAttribute('data-position'));
      let targetY, targetOpacity = 1;

      if (direction === 'next') {
        if (currentPos === 0) {
          targetY = currentStep * (services.length - 1);
          targetOpacity = 1;
        } else {
          targetY = currentStep * (currentPos - 1);
        }
      } else {
        if (currentPos === services.length - 1) {
          targetY = 0;
        } else if (currentPos === services.length - 2) {
          targetY = currentStep * (services.length - 1);
          targetOpacity = 1;
        } else {
          targetY = currentStep * (currentPos + 1);
        }
      }

      masterTL.to(card, {
        y: targetY, opacity: targetOpacity, duration: isMobile ? 0.6 : 0.8, ease: "power3.inOut", force3D: true
      }, 0);
    });

    // 5. Update Background (Direct DOM) & React State
    masterTL.call(() => {
      if (bgOverlay) bgOverlay.style.backgroundImage = `url(${nextBgImage})`;
    }, null, 0.6);

    // 6. Update State (Logic)
    masterTL.call(() => {
      setCurrentBgIndex(nextBgIndex);
      setDisplayTextIndex(nextBgIndex);
      setCardPositions(prev => prev.map(c => ({
        ...c,
        position: direction === 'next'
          ? (c.position === 0 ? services.length - 1 : c.position - 1)
          : (c.position === services.length - 1 ? 0 : c.position + 1)
      })));
    }, null, 0.8);

    // 7. Fade Out Clone & Fade In Text
    masterTL.to(clone, {
      opacity: 0, duration: isMobile ? 0.4 : 0.5, ease: "power2.out", force3D: true
    }, isMobile ? 0.6 : 0.8);

    masterTL.fromTo([titleRef.current, subtitleRef.current, buttonRef.current],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: isMobile ? 0.5 : 0.6, stagger: 0.1, ease: "power2.out", force3D: true },
      isMobile ? 0.65 : 0.85
    );

  }, [isExpanding, cardPositions, services]);

  const moveToNext = useCallback(() => animateCardExpansion('next'), [animateCardExpansion]);
  const moveToPrevious = useCallback(() => animateCardExpansion('prev'), [animateCardExpansion]);

  useEffect(() => {
    if (!autoPlayEnabled || services.length === 0) return;
    const timer = setInterval(moveToNext, 5000);
    return () => clearInterval(timer);
  }, [autoPlayEnabled, moveToNext, services]);

  // Handle case where data might be empty initially to prevent crashes
  if (!services || services.length === 0) return null;

  return (
    <section className="hero-section">
      <div
        ref={bgOverlayRef}
        className="hero-bg-overlay"
        style={{ backgroundImage: `url(${getImgUrl(services[currentBgIndex]?.image)})` }}
      />
      <div ref={expandingCloneRef} className="expanding-card-clone-gsap" />

      <div className="hero-container">
        <div className="hero-content">
          <div className="text-box">
            <h1 ref={titleRef} className="hero-title">{services[displayTextIndex]?.title}</h1>
            <p ref={subtitleRef} className="hero-subtitle">{services[displayTextIndex]?.subtitle}</p>
            <button ref={buttonRef} className="know-more-btn" onClick={handleKnowMoreClick}>Know More</button>
          </div>
        </div>

        <div ref={cardsContainerRef} className="cards-stack-container">
          {cardPositions.map((cardData, idx) => (
            <div key={idx} className="card-item" data-position={cardData.position}>
              <img
                src={getImgUrl(services[cardData.serviceIndex]?.image)}
                alt={services[cardData.serviceIndex]?.title || "Hero slide"}
                loading={cardData.position === 0 ? "eager" : "lazy"}
              />
              <div className="card-label">{services[cardData.serviceIndex]?.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="arrows">
        <div
          className="arrow"
          onClick={() => { setAutoPlayEnabled(false); moveToPrevious(); }}
          onTouchStart={(e) => { e.preventDefault(); setAutoPlayEnabled(false); moveToPrevious(); }}
        >
          <ChevronUp size={20} />
        </div>
        <div
          className="arrow"
          onClick={() => { setAutoPlayEnabled(false); moveToNext(); }}
          onTouchStart={(e) => { e.preventDefault(); setAutoPlayEnabled(false); moveToNext(); }}
        >
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;