import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchHomeAbout } from '../services/homeAboutAPI';
import './AboutSection.css';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
gsap.registerPlugin(ScrollTrigger);

function AboutSection() {
  const [data, setData] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null); 
  
  const sectionRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);
  const imageRef = useRef(null);
  const accordionRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  // --- FETCH ACTUAL DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHomeAbout();
        let fetchedData = response.data?.data || response.data || response;
        if (Array.isArray(fetchedData)) fetchedData = fetchedData[0];
        
        setData(fetchedData);
        
        // Open the first accordion item by default once data is loaded
        if (fetchedData?.items?.length > 0) {
          setExpandedSection(fetchedData.items[0].title.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch About data:", err);
      }
    };
    loadData();
  }, []);

  // --- GSAP ANIMATIONS ---
  useEffect(() => {
    if (!data) return; // Only animate once data is present

    const ctx = gsap.context(() => {
      gsap.fromTo(textLeftRef.current, { opacity: 0, x: -60 }, {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
      });

      gsap.fromTo(textRightRef.current, { opacity: 0, x: 60 }, {
        opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
      });

      gsap.fromTo(imageRef.current, { opacity: 0, y: 100 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true }
      });

      gsap.fromTo(accordionRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${SERVER_URL}/${path.replace(/\\/g, "/")}`;
  };

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500); 
  };

  if (!data) return null; // Or a loader

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      {/* First Row - Title and Paragraphs */}
      <div className="about-text-row">
        <div className="about-text-left" ref={textLeftRef}>
          <h2 className="about-main-title">
            {/* Color the highlighted part */}
            <span className="luxury-text" style={{ color: '#14b8a6' }}>
                {data.heroHighlightText}
            </span>{" "}
            {data.heroTitle}
          </h2>
        </div>
        
        <div className="about-text-right" ref={textRightRef}>
          {data.heroParagraphs?.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          <button className="know-more-secondary-btn">Know More</button>
        </div>
      </div>

      {/* Second Row - Values common Image & Dynamic Accordion */}
      <div className="about-content-row">
        <div className="about-image-column" ref={imageRef}>
          <div className="about-image-wrapper">
            <img 
              src={getImgUrl(data.valuesCommonImage)} 
              alt="EcoGlow Luxury" 
              className="about-image" 
            />
          </div>
        </div>

        <div className="about-accordion-column" ref={accordionRef}>
          <div className="about-accordion">
            {data.items?.map((item) => (
              <div className="accordion-item" key={item._id}>
                <button
                  className="accordion-header"
                  onClick={() => toggleSection(item.title.toLowerCase())}
                >
                  <span className="accordion-title">{item.title}</span>
                  <span className="accordion-icon">
                    {expandedSection === item.title.toLowerCase() ? '−' : '+'}
                  </span>
                </button>
                <div className={`accordion-content ${expandedSection === item.title.toLowerCase() ? 'expanded' : ''}`}>
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;