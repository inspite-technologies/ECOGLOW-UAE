import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchFooterData } from '../services/footerAPI';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const [footerData, setFooterData] = useState(null);
  const contactRowRef = useRef(null);
  const linksRowRef = useRef(null);
  const bottomRowRef = useRef(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const response = await fetchFooterData();
        const data = Array.isArray(response) ? response[0] : (response.data || response);
        setFooterData(data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    loadFooter();
  }, []);

  useEffect(() => {
    if (!footerData) return;

    const footerElements = [contactRowRef.current, linksRowRef.current, bottomRowRef.current];
    
    gsap.set(footerElements, {
      opacity: 1,
      y: 0,
      clearProps: 'all'
    });

    const timer = setTimeout(() => {
      const checkAndAnimate = () => {
        const footerRect = contactRowRef.current?.getBoundingClientRect();
        const isInViewport = footerRect && footerRect.top < window.innerHeight;

        if (isInViewport) {
          gsap.set(footerElements, { opacity: 1, y: 0 });
        } else {
          gsap.set(footerElements, { opacity: 0, y: 30 });

          gsap.to(contactRowRef.current, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: contactRowRef.current, start: 'top 90%', once: true }
          });

          gsap.to(linksRowRef.current, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: linksRowRef.current, start: 'top 90%', once: true }
          });

          gsap.to(bottomRowRef.current, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out',
            scrollTrigger: { trigger: bottomRowRef.current, start: 'top 90%', once: true }
          });
        }
      };
      checkAndAnimate();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [footerData]);

  // Function to split links into groups of 2 for your 4-column layout
  // Each column will display its links vertically
  const chunkLinks = (links, size) => {
    if (!links) return [];
    const result = [];
    for (let i = 0; i < links.length; i += size) {
      result.push(links.slice(i, i + size));
    }
    return result;
  };

  if (!footerData) return null;

  const linkGroups = chunkLinks(footerData.usefulLinks, 2);

  return (
    <footer className="main-footer">
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      
      <div className="footer-container">
        
        {/* TOP ROW: Contact Information */}
        <div className="footer-contact-row" ref={contactRowRef}>
          <div className="contact-item address">
            <i className="fas fa-map-marker-alt"></i>
            <span>{footerData.officeAddress}</span>
          </div>
          <div className="contact-details-group">
            <div className="contact-item phone">
              <i className="fas fa-phone"></i>
              <a href={`tel:${footerData.phone}`}>{footerData.phone}</a>
            </div>
            <div className="contact-item whatsapp">
              <i className="fab fa-whatsapp"></i>
              <a href={`https://wa.me/${footerData.whatsapp?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
                {footerData.whatsapp}
              </a>
            </div>
            <div className="contact-item email">
              <i className="far fa-envelope"></i>
              <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Links and Booking */}
        <div className="footer-links-row" ref={linksRowRef}>
          <div className="useful-links-label">USEFUL LINKS</div>
          <div className="links-grid">
            {/* Each column displays its links vertically - one link per row */}
            {linkGroups.map((group, index) => (
              <div className="link-column" key={index}>
                {group.map((link) => (
                  <a key={link._id} href={link.url}>{link.label}</a>
                ))}
              </div>
            ))}
          </div>
          <button className="footer-book-btn" onClick={() => window.location.href = '/book-service'}>
            Book Your Service
          </button>
        </div>

        {/* BOTTOM ROW: Social and Legal */}
        <div className="footer-bottom" ref={bottomRowRef}>
          <div className="social-follow">
            <span>FOLLOW US</span>
            <div className="social-icons">
              {footerData.socialLinks?.facebook && (
                <a href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {footerData.socialLinks?.instagram && (
                <a href={footerData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {footerData.socialLinks?.youtube && (
                <a href={footerData.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
            </div>
          </div>
          
          <div className="legal-row">
            <p className="copyright">{footerData.copyrightText}</p>
            <div className="legal-links">
              <a href="/terms-conditions">Terms and Conditions</a>
              <span> & </span>
              <a href="/privacy-policy">Privacy policy</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;