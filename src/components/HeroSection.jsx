import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchHero } from '../services/heroAPI';
import './HeroSection.css';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const [services, setServices] = useState([]); // Live data
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [displayTextIndex, setDisplayTextIndex] = useState(0);
  const [cardPositions, setCardPositions] = useState([]);
  const [isExpanding, setIsExpanding] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const expandingCloneRef = useRef(null);
  const bgOverlayRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const response = await fetchHero();
        let heroData = response.data?.data || response.data || response;
        if (Array.isArray(heroData)) heroData = heroData[0];

        if (heroData && heroData.slides) {
          const slides = heroData.slides;
          setServices(slides);
          
          // Initialize positions based on actual slide count (4 in your case)
          const initialPositions = slides.map((_, index) => ({
            serviceIndex: (index + 1) % slides.length,
            position: index
          }));
          setCardPositions(initialPositions);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHeroData();
  }, []);

  const getImgUrl = (path) => {
    if (!path) return "";
    const formatted = path.replace(/\\/g, "/");
    return formatted.startsWith("http") ? formatted : `${SERVER_URL}/${formatted}`;
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
    });

    const masterTL = gsap.timeline({ onComplete: () => setIsExpanding(false) });

    masterTL.to([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0, y: -20, duration: 0.3
    }, 0);

    masterTL.to(clone, {
      top: 0, left: 0, width: '100vw', height: '100vh',
      borderRadius: 0, duration: 1.2, ease: "expo.inOut"
    }, 0.1);

    const allCards = cardsContainerRef.current.querySelectorAll('.card-item');
    allCards.forEach((card) => {
      const currentPos = parseInt(card.getAttribute('data-position'));
      const step = 160; 
      let targetY, targetOpacity = 1;

      if (direction === 'next') {
        if (currentPos === 0) { targetY = step * (services.length - 1); targetOpacity = 0; }
        else { targetY = step * (currentPos - 1); }
      } else {
        if (currentPos === services.length - 1) { targetY = 0; }
        else if (currentPos === services.length - 2) { targetY = step * (services.length - 1); targetOpacity = 0; }
        else { targetY = step * (currentPos + 1); }
      }

      masterTL.to(card, {
        y: targetY, opacity: targetOpacity, duration: 1.0, ease: "power3.inOut"
      }, 0.1);
    });

    masterTL.call(() => {
      bgOverlay.style.backgroundImage = `url(${nextBgImage})`;
      setCurrentBgIndex(nextBgIndex);
      setDisplayTextIndex(nextBgIndex);
      setCardPositions(prev => prev.map(c => ({
        ...c,
        position: direction === 'next' 
          ? (c.position === 0 ? services.length - 1 : c.position - 1) 
          : (c.position === services.length - 1 ? 0 : c.position + 1)
      })));
    }, null, 0.9);

    masterTL.fromTo([titleRef.current, subtitleRef.current, buttonRef.current], 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 1.1
    );

    masterTL.to(clone, {
      opacity: 0, duration: 0.6,
      onComplete: () => {
        gsap.set(clone, { display: 'none' });
        gsap.set(".card-item", { clearProps: "all" });
        ScrollTrigger.refresh();
        setIsExpanding(false);
      }
    }, 1.4);
  }, [isExpanding, cardPositions, services]);

  const moveToNext = useCallback(() => animateCardExpansion('next'), [animateCardExpansion]);
  const moveToPrevious = useCallback(() => animateCardExpansion('prev'), [animateCardExpansion]);

  useEffect(() => {
    if (!autoPlayEnabled || services.length === 0) return;
    const timer = setInterval(moveToNext, 5000);
    return () => clearInterval(timer);
  }, [autoPlayEnabled, moveToNext, services]);

  if (loading || services.length === 0) return null;

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
            <button ref={buttonRef} className="know-more-btn">Know More</button>
          </div>
        </div>

        <div ref={cardsContainerRef} className="cards-stack-container">
          {cardPositions.map((cardData, idx) => (
            <div key={`${services[cardData.serviceIndex]?._id}-${idx}`} className="card-item" data-position={cardData.position}>
              <img src={getImgUrl(services[cardData.serviceIndex]?.image)} alt="" />
              <div className="card-label">{services[cardData.serviceIndex]?.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="arrows">
        <div className="arrow" onClick={() => { setAutoPlayEnabled(false); moveToPrevious(); }}><ChevronUp size={20} /></div>
        <div className="arrow" onClick={() => { setAutoPlayEnabled(false); moveToNext(); }}><ChevronDown size={20} /></div>
      </div>
    </section>
  );
}

export default HeroSection;