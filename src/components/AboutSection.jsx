import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AboutSection.css";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
gsap.registerPlugin(ScrollTrigger);

function AboutSection({ data }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const sectionRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);
  const imageRef = useRef(null);
  const accordionRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  // Default fallback link if none is provided in Admin
  const defaultLink = "https://api.whatsapp.com/send/?phone=%2B971585766424&text&type=phone_number";

  useEffect(() => {
    if (data && data.items && data.items.length > 0) {
      setExpandedSection(data.items[0].title.toLowerCase());
    }
  }, [data]);

  useLayoutEffect(() => {
    if (!data) return;

    let ctx;
    const timer = setTimeout(() => {
        ctx = gsap.context(() => {
            gsap.fromTo(textLeftRef.current, { opacity: 0, x: -60 }, {
                opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
            });

            gsap.fromTo(textRightRef.current, { opacity: 0, x: 60 }, {
                opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
            });

            gsap.fromTo(imageRef.current, { opacity: 0, y: 100 }, {
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
            });

            gsap.fromTo(accordionRef.current, { opacity: 0, y: 50 }, {
                opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
            });
            
            ScrollTrigger.refresh();
        }, sectionRef);
    }, 100); 

    return () => {
        if(ctx) ctx.revert();
        clearTimeout(timer);
    };
  }, [data]);

  const getImgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${SERVER_URL}/${path.replace(/\\/g, "/")}`;
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => { ScrollTrigger.refresh(); }, 500);
  };

  const handleImageLoad = () => { ScrollTrigger.refresh(); };

  if (!data) return null;

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-text-row">
        <div className="about-text-left" ref={textLeftRef}>
          <h2 className="about-main-title">
            <span className="luxury-text" style={{ color: "#14b8a6" }}>
              {data.heroHighlightText}
            </span>{" "}
            {data.heroTitle}
          </h2>
        </div>

        <div className="about-text-right" ref={textRightRef}>
          {data.heroParagraphs?.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          
          {/* UPDATED: Know More Button with dynamic link */}
          <a 
            href={data.aboutLink || defaultLink} 
            target={data.aboutLink?.startsWith('http') ? "_blank" : "_self"} 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="know-more-secondary-btn">
              Know More
            </button>
          </a>
        </div>
      </div>

      <div className="about-content-row">
        <div className="about-image-column" ref={imageRef}>
          <div className="about-image-wrapper">
            <img
              src={getImgUrl(data.valuesCommonImage)}
              alt="EcoGlow About"
              className="about-image"
              loading="lazy"
              onLoad={handleImageLoad}
            />
          </div>
        </div>

        <div className="about-accordion-column" ref={accordionRef}>
          <div className="about-accordion">
            {data.items?.map((item) => {
               const isOpen = expandedSection === item.title.toLowerCase();
               return (
                <div className="accordion-item" key={item._id}>
                  <button className="accordion-header" onClick={() => toggleSection(item.title.toLowerCase())}>
                    <span className="accordion-title">{item.title}</span>
                    <span className={`accordion-icon ${isOpen ? "expanded" : ""}`}></span>
                  </button>
                  <div className={`accordion-content ${isOpen ? "expanded" : ""}`}>
                      {item.content?.split("\n").map((paragraph, idx) => {
                        if (!paragraph.trim()) return null;
                        const [titlePart, ...rest] = paragraph.split(":");
                        const hasColon = paragraph.includes(":");
                        return (
                          <p key={idx} style={{ textAlign: "left", margin: "0", lineHeight: "1.8" }}>
                            {hasColon ? (
                              <>
                                <strong style={{ fontWeight: "700", color: "#1b1a1a" }}>{titlePart}:</strong>
                                {rest.join(":")}
                              </>
                            ) : paragraph}
                          </p>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;