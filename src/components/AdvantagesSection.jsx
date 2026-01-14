import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom'; 
import './AdvantagesSection.css';

import icon1 from '../assets/01.png';
import ctaImageFallback from '../assets/A10.webp';

gsap.registerPlugin(ScrollTrigger);

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- HELPERS ---

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

const getWhatsAppUrl = (input) => {
  if (!input) return "https://wa.me/971585766424"; 
  if (input.startsWith("http")) return input;
  const cleanNumber = input.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}`;
};

// --- SMART BUTTON LOGIC ---
const getButtonProps = (input) => {
  // 1. Safety check: Trim spaces
  const safeInput = input ? input.trim() : "";

  // 2. Fallback if empty
  if (!safeInput) {
    return { isInternal: true, to: "/book-service" };
  }

  // 3. Website URL (http/www)
  if (safeInput.toLowerCase().startsWith("http") || safeInput.toLowerCase().startsWith("www")) {
    const href = safeInput.toLowerCase().startsWith("www") ? `https://${safeInput}` : safeInput;
    return { isInternal: false, href, target: "_blank", rel: "noopener noreferrer" };
  }

  // 4. Internal Route (starts with /)
  if (safeInput.startsWith("/")) {
    return { isInternal: true, to: safeInput };
  }

  // 5. Phone Number (Default for everything else)
  const cleanNum = safeInput.replace(/[^\d+]/g, '');
  return { isInternal: false, href: `tel:${cleanNum}` };
};

function AdvantagesSection({ data }) {
  const [expandedItem, setExpandedItem] = useState(null);
  
  const headerRef = useRef(null);
  const underlineRef = useRef(null);
  const accordionItemsRef = useRef([]);
  const ctaSectionRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  const content = Array.isArray(data) ? data[0] : data;

  useEffect(() => {
    if (content && content.items && content.items.length > 0) {
        setExpandedItem(content.items[0]._id);
    }
  }, [content]);

  // --- ANIMATIONS ---
  useEffect(() => {
    if (!content) return;

    let ctx = gsap.context(() => {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power2.out', scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none reverse', invalidateOnRefresh: true } }
        );

        gsap.fromTo(underlineRef.current,
          { width: 0, opacity: 0 },
          { width: '70px', opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: underlineRef.current, start: 'top 80%', toggleActions: 'play none none reverse', invalidateOnRefresh: true } }
        );

        const validItems = accordionItemsRef.current.filter(el => el !== null);
        if (validItems.length > 0) {
            gsap.fromTo(validItems,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: validItems[0], start: 'top 85%', toggleActions: 'play none none reverse', invalidateOnRefresh: true } }
            );
        }

        gsap.fromTo(ctaSectionRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse', invalidateOnRefresh: true } }
        );
    });

    return () => {
      ctx.revert();
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [content]);

  const toggleItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => { ScrollTrigger.refresh(); }, 800); 
  };

  if (!content) return null;

  // --- PREPARE DATA ---
  // 1. Get props based on the link provided in Admin
  const { isInternal, ...primaryBtnProps } = getButtonProps(content.ctaButtonLink);

  // 2. Strict Styling (White, No Underline, Clickable, On Top)
  const linkStyle = { 
    textDecoration: 'none', 
    color: '#ffffff', 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative', // Ensures z-index works
    zIndex: 10 // Ensures it sits above images/backgrounds
  };

  return (
    <section className="advantages-section" id="advantages">
      <div className="advantages-header" ref={headerRef}>
        <h2 className="advantages-title">
           {content.sectionTitle ? content.sectionTitle.split('\n').map((line, i) => (
             <React.Fragment key={i}>{line}<br/></React.Fragment>
           )) : <>Our Key<br />Advantages</>}
        </h2>
        <div className="advantages-underline" ref={underlineRef}></div>
      </div>

      <div className="advantages-accordion">
        {content.items && content.items.map((item, index) => (
          <div 
            key={item._id || index} 
            className={`advantage-item ${expandedItem === item._id ? 'active' : ''}`}
            ref={(el) => (accordionItemsRef.current[index] = el)}
          >
            <div className="advantage-wrapper">
              <div className="advantage-icon-section">
                <img 
                    src={getImageUrl(item.icon) || icon1} 
                    alt={item.title || "Advantage icon"} 
                    className="advantage-icon-image"
                    loading="lazy"
                />
              </div>
              <div className="advantage-content-section">
                <div 
                  className="advantage-header-row"
                  onClick={() => toggleItem(item._id)}
                >
                  <h3 className="advantage-title">{item.title}</h3>
                  <span className="advantage-toggle">
                    {expandedItem === item._id ? '−' : '+'}
                  </span>
                </div>
                <div 
                  id={`advantage-description-${item._id}`}
                  className={`advantage-description-container ${expandedItem === item._id ? 'show' : ''}`}
                >
                  <div className="advantage-description-content">
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="advantages-cta" ref={ctaSectionRef}>
        <div className="cta-left-full">
          <img 
            src={getImageUrl(content.ctaImage) || ctaImageFallback} 
            alt="Excellence in cleaning" 
            className="cta-photo"
            loading="lazy"
          />
        </div>
        <div className="cta-right-content">
          <h2 className="cta-title">
            {content.ctaTitleLine1} <span className="cta-highlight-text">Excellence</span><br />
            {content.ctaTitleLine2}
          </h2>
          
          <div className="cta-button-group">
            
            {/* BOOK BUTTON */}
            {isInternal ? (
              <Link to={primaryBtnProps.to} className="cta-button-primary" style={linkStyle}>
                {content.ctaButtonText || "Book Your Service"}
              </Link>
            ) : (
              <a 
                href={primaryBtnProps.href}
                target={primaryBtnProps.target}
                rel={primaryBtnProps.rel}
                className="cta-button-primary"
                style={linkStyle}
              >
                {content.ctaButtonText || "Book Your Service"}
              </a>
            )}

            {/* WHATSAPP BUTTON */}
            <a 
              href={getWhatsAppUrl(content.ctaWhatsappLink)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button-whatsapp"
              style={linkStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {content.ctaWhatsappText || "Connect with whatsapp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvantagesSection;