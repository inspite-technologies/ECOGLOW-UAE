import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchHomeServices } from '../services/homeServices';
import './ServicesSection.css';

// Asset Imports (Fallbacks)
import commercialImgFallback from '../assets/A6.webp';
import residentialImgFallback from '../assets/A7.webp';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Resolve Image URL ---
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  // Fix Windows backslashes and prepend server URL
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

function ServicesSection() {
  const [data, setData] = useState(null);

  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  // 1. FETCH DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHomeServices();
        // Handle varied response structures
        let result = response.data || response;
        if (Array.isArray(result)) result = result[0];
        
        setData(result);
      } catch (error) {
        console.error("Error fetching home services:", error);
      }
    };
    loadData();
  }, []);

  // 2. ANIMATIONS (Run only after data is loaded)
  useEffect(() => {
    if (!data) return; // Wait for data

    let ctx = gsap.context(() => {
      // 1. Animate Text Content Group
      gsap.fromTo(textContentRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );

      // 2. Animate Image Cards
      gsap.fromTo([card1Ref.current, card2Ref.current],
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // Helper to split title for styling (e.g. "Our Services" -> "Our" <br/> "Services")
  const renderTitle = (title) => {
    if (!title) return <>Our<br />Services</>;
    const parts = title.split(' ');
    if (parts.length >= 2) {
        return <>{parts[0]}<br />{parts.slice(1).join(' ')}</>;
    }
    return title;
  };

  if (!data) return null; // or a loading spinner

  return (
    <section className="services-section-replica" ref={sectionRef}>
      <div className="services-grid-container">
        
        {/* Column 1: Text Content */}
        <div className="services-text-col" ref={textContentRef}>
          <h2 className="services-main-title">
            {renderTitle(data.mainTitle)}
          </h2>
          <div className="services-accent-line" />
          <p className="services-description-text">
            {data.mainDescription}
          </p>
          <button className="services-know-more-btn">Know More</button>
        </div>

        {/* Column 2: Card 1 (Commercial) */}
        <div className="service-card-item" ref={card1Ref}>
          <div className="service-card-img-wrapper">
            <img 
                src={getImageUrl(data.card1Image) || commercialImgFallback} 
                alt={data.card1Title} 
            />
            <div className="service-card-info">
              <h3 className="service-card-name">{data.card1Title}</h3>
              <p className="service-card-detail">{data.card1Subtitle}</p>
              <div className="service-card-arrow">→</div>
            </div>
          </div>
        </div>

        {/* Column 3: Card 2 (Residential - Bleed Effect) */}
        <div className="service-card-item bleed-to-edge" ref={card2Ref}>
          <div className="service-card-img-wrapper">
            <img 
                src={getImageUrl(data.card2Image) || residentialImgFallback} 
                alt={data.card2Title} 
            />
            <div className="service-card-info">
              <h3 className="service-card-name">{data.card2Title}</h3>
              <p className="service-card-detail">{data.card2Subtitle}</p>
              <div className="service-card-arrow">→</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;