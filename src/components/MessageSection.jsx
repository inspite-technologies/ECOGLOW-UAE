import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MessageSection.css';
// Keep the local image as a fallback
import mdPhotoFallback from '../assets/A11.webp';
import { fetchMessages } from '../services/messageAPI';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Resolve Image URL ---
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return mdPhotoFallback; // Return fallback if null
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  // Fix Windows backslashes and prepend server URL
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

function MessageSection() {
  const [messageData, setMessageData] = useState(null);
  
  const sectionRef = useRef(null);
  const messageContentRef = useRef(null);
  const messageImageRef = useRef(null);
  const dividerRef = useRef(null);
  const connectTextRef = useRef(null);
  const newsletterFormRef = useRef(null);

  // 1. FETCH DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchMessages();
        // Handle varied response structures
        let result = response.data || response;
        if (Array.isArray(result)) result = result[0];
        
        setMessageData(result);
      } catch (error) {
        console.error("Error fetching message section:", error);
      }
    };
    loadData();
  }, []);

  // 2. GSAP ANIMATIONS (Run only after data is loaded)
  useEffect(() => {
    if (!messageData) return; // Wait for data

    let ctx = gsap.context(() => {
      
      // Animate message content
      gsap.fromTo(
        messageContentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: messageContentRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          }
        }
      );

      // Animate message image
      gsap.fromTo(
        messageImageRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: messageImageRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          }
        }
      );

      // Animate divider
      gsap.fromTo(
        dividerRef.current,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          }
        }
      );

      // Animate connect text
      gsap.fromTo(
        connectTextRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: connectTextRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          }
        }
      );

      // Animate newsletter form
      gsap.fromTo(
        newsletterFormRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: newsletterFormRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          }
        }
      );

    }, sectionRef); 

    return () => ctx.revert();
  }, [messageData]); // Dependencies: Re-run GSAP when data changes

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter form submitted");
  };

  // Helper to split "LET'S CONNECT" for styling if needed
  const renderConnectTitle = (title) => {
    if (!title) return <span>LET'S <span className="teal-text-thin">CONNECT</span></span>;
    const parts = title.split(' ');
    // If it's exactly 2 words, style the second one teal
    if (parts.length === 2) {
        return <>{parts[0]} <span className="teal-text-thin">{parts[1]}</span></>;
    }
    return title;
  };

  if (!messageData) return null; // or a loading spinner

  return (
    <section 
      className="unified-footer-section" 
      id="message" 
      ref={sectionRef}
    >
      {/* MD'S MESSAGE SECTION */}
      <div className="message-container">
        <div className="message-content" ref={messageContentRef}>
          <h2 className="section-heading-thin">{messageData.mdTitle}</h2>
          <div className="thin-teal-underline"></div>
          
          <p className="message-text">
            {messageData.mdMessage}
          </p>

          <div className="signature-area">
            <span className="md-name-label">Full Name</span>
            {/* Displaying name from API */}
            <div className="handwritten-signature">{messageData.mdName}</div>
          </div>
        </div>

        <div className="message-image" ref={messageImageRef}>
          <img 
            src={getImageUrl(messageData.mdPhoto)} 
            alt="Managing Director" 
            className="md-profile-img" 
          />
        </div>
      </div>

      <div className="section-divider" ref={dividerRef}></div>

      {/* LET'S CONNECT SECTION */}
      <div className="connect-container">
        <div className="connect-text" ref={connectTextRef}>
          <h2 className="section-heading-thin">
            {renderConnectTitle(messageData.connectTitle)}
          </h2>
          <p className="connect-subtitle">{messageData.connectSubtitle}</p>
        </div>

        <div className="newsletter-form-container" ref={newsletterFormRef}>
          <span className="newsletter-label">You will get monthly newsletter</span>
          <form className="input-group-newsletter" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email ID" 
              className="newsletter-input"
              required
              aria-label="Email address for newsletter"
            />
            <button type="submit" className="newsletter-send-btn">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default MessageSection;