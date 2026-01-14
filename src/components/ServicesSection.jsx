import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesSection.css';

// Asset Imports (Fallbacks)
import commercialImgFallback from '../assets/A6.avif';
import residentialImgFallback from '../assets/A7.avif';

gsap.registerPlugin(ScrollTrigger);

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

function ServicesSection({ data }) {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  // Extract data from array if necessary
  const content = Array.isArray(data) ? data[0] : data;

  useEffect(() => {
    if (!content) return;

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
  }, [content]);

  const renderTitle = (title) => {
    if (!title) return <>Our<br />Services</>;
    const parts = title.split(' ');
    if (parts.length >= 2) {
        return <>{parts[0]}<br />{parts.slice(1).join(' ')}</>;
    }
    return title;
  };

  // Helper for Link attributes
  const getLinkProps = (url) => ({
    href: url || "#",
    target: url?.startsWith("http") ? "_blank" : "_self",
    rel: "noopener noreferrer",
    className: "service-link-wrapper" 
  });

  if (!content) return null;

  return (
    <section className="services-section-replica" ref={sectionRef}>
      <div className="services-grid-container">
        
        {/* Column 1: Text Content */}
        <div className="services-text-col" ref={textContentRef}>
          <h2 className="services-main-title">
            {renderTitle(content.mainTitle)}
          </h2>
          <div className="services-accent-line" />
          <p className="services-description-text">
            {content.mainDescription}
          </p>
          
          {/* IMPLEMENTED: Main Link */}
          <a {...getLinkProps(content.mainLink)} style={{ textDecoration: 'none' }}>
            <button className="services-know-more-btn">Know More</button>
          </a>
        </div>

        {/* Column 2: Card 1 (Commercial) */}
        <div className="service-card-item" ref={card1Ref}>
          {/* IMPLEMENTED: Card 1 Link */}
          <a {...getLinkProps(content.card1Link)}>
            <div className="service-card-img-wrapper">
              <img 
                src={getImageUrl(content.card1Image) || commercialImgFallback} 
                alt={content.card1Title || "Commercial Services"}
                loading="lazy"
              />
              <div className="service-card-info">
                <h3 className="service-card-name">{content.card1Title}</h3>
                <p className="service-card-detail">{content.card1Subtitle}</p>
                <div className="service-card-arrow">→</div>
              </div>
            </div>
          </a>
        </div>

        {/* Column 3: Card 2 (Residential) */}
        <div className="service-card-item bleed-to-edge" ref={card2Ref}>
          {/* IMPLEMENTED: Card 2 Link */}
          <a {...getLinkProps(content.card2Link)}>
            <div className="service-card-img-wrapper">
              <img 
                src={getImageUrl(content.card2Image) || residentialImgFallback} 
                alt={content.card2Title || "Residential Services"}
                loading="lazy"
              />
              <div className="service-card-info">
                <h3 className="service-card-name">{content.card2Title}</h3>
                <p className="service-card-detail">{content.card2Subtitle}</p>
                <div className="service-card-arrow">→</div>
              </div>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;