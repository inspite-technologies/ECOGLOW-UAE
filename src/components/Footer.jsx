import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchFooterData } from '../services/footerAPI';
import { fetchServices as fetchResServices } from '../services/serviceAPI';
import { fetchServices as fetchCommServices } from '../services/commercialAPI';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [dynamicLinks, setDynamicLinks] = useState([]); // Store combined links
  const contactRowRef = useRef(null);
  const linksRowRef = useRef(null);
  const bottomRowRef = useRef(null);

  // Helper for slugify (matches what's in page components)
  const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Fetch all data in parallel
        const [footerRes, resServicesRes, commServicesRes] = await Promise.all([
          fetchFooterData(),
          fetchResServices(),
          fetchCommServices()
        ]);

        // 2. Process Footer Data
        const footerInfo = Array.isArray(footerRes) ? footerRes[0] : (footerRes.data || footerRes);
        setFooterData(footerInfo);

        // 3. Process Residential Services
        const resData = Array.isArray(resServicesRes) ? resServicesRes[0] : (resServicesRes.data || resServicesRes);
        const resLinks = (resData?.servicesList || [])
          .filter(s => s.title)
          .map(s => ({
            _id: s._id || `res-${Math.random()}`,
            label: s.title,
            url: `/services#${slugify(s.title)}` // Link to specific card ID
          }));

        // 4. Process Commercial Services
        const commData = Array.isArray(commServicesRes) ? commServicesRes[0] : (commServicesRes.data || commServicesRes);
        const commLinks = (commData?.servicesList || [])
          .filter(s => s.title)
          .map(s => ({
            _id: s._id || `comm-${Math.random()}`,
            label: s.title,
            url: `/services/commercial#${slugify(s.title)}` // Link to specific card ID
          }));

        // 5. Combine: Only Residential + Commercial Services (Limited to 12 links)
        const combinedLinks = [...resLinks, ...commLinks];
        setDynamicLinks(combinedLinks.slice(0, 12));

      } catch (error) {
        console.error("Error loading footer data:", error);
      }
    };
    loadAllData();
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

  const chunkLinks = (links, size) => {
    if (!links) return [];
    const result = [];
    for (let i = 0; i < links.length; i += size) {
      result.push(links.slice(i, i + size));
    }
    return result;
  };

  if (!footerData) return null;

  // Ensure items are distributed evenly across 4 columns
  const itemsPerColumn = Math.ceil(dynamicLinks.length / 4) || 1;
  const linkGroups = chunkLinks(dynamicLinks, itemsPerColumn);

  // Style for gap between icon and text
  const iconStyle = { marginRight: '12px' };

  return (
    <footer className="main-footer">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="footer-container">

        {/* TOP ROW: Contact Information */}
        <div className="footer-contact-row" ref={contactRowRef}>

          {/* Address: Use visibility to hide but keep space if empty */}
          <div
            className="contact-item address"
            style={{ visibility: footerData.officeAddress ? 'visible' : 'hidden' }}
          >
            <i className="fas fa-map-marker-alt" style={iconStyle}></i>
            <span>{footerData.officeAddress || 'Placeholder'}</span>
          </div>

          <div className="contact-details-group">

            {/* Phone */}
            <div
              className="contact-item phone"
              style={{ visibility: footerData.phone ? 'visible' : 'hidden' }}
            >
              <i className="fas fa-phone" style={iconStyle}></i>
              <a href={`tel:${footerData.phone}`}>{footerData.phone || '000'}</a>
            </div>

            {/* WhatsApp */}
            <div
              className="contact-item whatsapp"
              style={{ visibility: footerData.whatsapp ? 'visible' : 'hidden' }}
            >
              <i className="fab fa-whatsapp" style={iconStyle}></i>
              <a href={`https://wa.me/${footerData.whatsapp?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
                {footerData.whatsapp || '000'}
              </a>
            </div>

            {/* Email */}
            <div
              className="contact-item email"
              style={{ visibility: footerData.email ? 'visible' : 'hidden' }}
            >
              <i className="far fa-envelope" style={iconStyle}></i>
              <a href={`mailto:${footerData.email}`}>{footerData.email || 'mail@example.com'}</a>
            </div>

          </div>
        </div>

        {/* MIDDLE ROW: Links and Booking */}
        <div className="footer-links-row" ref={linksRowRef}>
          <div className="useful-links-label">USEFUL LINKS</div>
          <div className="links-grid">
            {linkGroups.map((group, index) => (
              <div className="link-column" key={index}>
                {group.map((link) => (
                  <Link key={link._id} to={link.url}>{link.label}</Link>
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
              {footerData.socialLinks?.linkedin && (
                <a href={footerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
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