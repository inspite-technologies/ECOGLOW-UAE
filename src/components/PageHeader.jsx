import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { fetchHeader } from '../services/headerAPI'; // API Import
import './PageHeader.css';

// Asset Import
import logo from '../assets/eco.png';

function PageHeader() {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  // 1. State for Dynamic Contact Info
  const [contactInfo, setContactInfo] = useState({
    contactWhatsApp: '',
    contactPhone: ''
  });

  useEffect(() => {
    // 2. Fetch Contact Data from API
    const loadContactData = async () => {
      try {
        const response = await fetchHeader();
        const data = response.data || response || {};
        setContactInfo({
          contactWhatsApp: data.contactWhatsApp || '',
          contactPhone: data.contactPhone || ''
        });
      } catch (error) {
        console.error("Failed to load header contacts", error);
      }
    };
    loadContactData();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Keep your smoothness fix: 40% height or min 350px
      const bannerHeight = Math.max(window.innerHeight * 0.4, 350);

      if (scrollPosition > bannerHeight + 10) {
        setIsScrolled(true);
      } else if (scrollPosition <= bannerHeight) {
        setIsScrolled(false);
      }
    };

    const onScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3. Body Lock for Mobile Menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('page-mobile-menu-open');
    } else {
      document.body.classList.remove('page-mobile-menu-open');
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setIsMobileServicesOpen(false);
  };

  const toggleMobileServices = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileServicesOpen(!isMobileServicesOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  // Helper to clean phone numbers for href links
  const cleanNumber = (num) => num ? num.replace(/[^0-9+]/g, '') : '';

  return (
    <>
      {/* FontAwesome for social icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <header className={`page-main-header ${isScrolled ? 'page-scrolled' : ''}`}>
        <div className="page-header-container">
          
          {/* LEFT: Mobile Menu Toggle */}
          <button 
            className={`page-mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            style={{ order: -1 }} // Ensures it stays left in flex containers
          >
            {isMobileMenuOpen ? <X size={24} className="page-menu-icon" /> : <Menu size={24} className="page-menu-icon" />}
          </button>

          {/* CENTER: Logo Section */}
          <div className="page-logo-section">
            <Link to="/">
              <img src={logo} alt="EcoGlow" className="page-header-logo-img" />
            </Link>
          </div>

          {/* DESKTOP NAV: Hidden on mobile via CSS */}
          <nav className="page-nav-links">
            <Link to="/about">About Us</Link>
            <div
              className="page-services-dropdown"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link to="/services" className="page-services-toggle">
                All Services <ChevronDown size={12} />
              </Link>
              <div className={`page-dropdown-menu ${servicesDropdownOpen ? 'active' : ''}`}>
                <Link to="/services/commercial">Commercial</Link>
                <Link to="/services#residential">Residential</Link>
              </div>
            </div>
            <Link to="/packages">Packages</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="page-header-actions">
            <Search size={18} className="page-search-icon" />
            
            <Link to="/book-service" className="page-desktop-only">
              <button className="page-book-btn">Book Your Service</button>
            </Link>
            
            <div className="page-social-icons">
              {/* WhatsApp */}
              <a 
                href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="page-icon-circle page-whatsapp"
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: 'white' }}></i>
              </a>
              
              {/* Phone */}
              <a 
                href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'} 
                className="page-icon-circle"
              >
                <i className="fa-solid fa-phone" style={{ fontSize: '14px', color: isScrolled ? '#333' : 'white' }}></i>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <nav className={`page-mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="page-mobile-nav-links">
          <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
          
          <div className="page-mobile-services-section">
            <button className="page-mobile-services-toggle" onClick={toggleMobileServices}>
              All Services
              <ChevronDown size={16} style={{ transform: isMobileServicesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </button>
            <div className={`page-mobile-services-menu ${isMobileServicesOpen ? 'active' : ''}`}>
              <Link to="/services/commercial" onClick={closeMobileMenu}>Commercial</Link>
              <Link to="/services#residential" onClick={closeMobileMenu}>Residential</Link>
            </div>
          </div>

          <Link to="/packages" onClick={closeMobileMenu}>Packages</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          <Link to="/coming-soon" onClick={closeMobileMenu}>Coming Soon</Link>
          
          <Link to="/book-service">
            <button className="page-mobile-book-btn" onClick={closeMobileMenu}>Book Your Service</button>
          </Link>

          {/* Mobile Social Links (matching the target style) */}
          <div className="page-mobile-social-section">
            <a
              href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="page-mobile-social-link page-whatsapp"
              onClick={closeMobileMenu}
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp Us</span>
            </a>
            
            <a
              href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'}
              className="page-mobile-social-link page-phone"
              onClick={closeMobileMenu}
            >
              <i className="fa-solid fa-phone"></i>
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default PageHeader;