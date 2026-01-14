import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { fetchHeader } from '../services/headerAPI';
import './Header.css';

// Asset Import
import logo from '../assets/eco.png';

function Header() {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  // 1. Add State for Contact Info
  const [contactInfo, setContactInfo] = useState({
    contactWhatsApp: '',
    contactPhone: ''
  });

  useEffect(() => {
    // 2. Fetch Contact Data
    const loadContactData = async () => {
      try {
        const response = await fetchHeader();
        // Handle response structure safely
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
      const heroHeight = window.innerHeight; 

      if (scrollPosition >= heroHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setIsMobileServicesOpen(false);
    }
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

  // Helper to clean numbers for links (removes spaces/dashes)
  const cleanNumber = (num) => num ? num.replace(/[^0-9+]/g, '') : '';

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          
          {/* 1. Mobile Menu Toggle - Moved to LEFT for mobile layout */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            style={{ order: -1 }} // Inline style ensures it visually appears first if CSS flex settings vary
          >
            {isMobileMenuOpen ? (
              <X size={24} className="menu-icon" />
            ) : (
              <Menu size={24} className="menu-icon" />
            )}
          </button>

          {/* 2. Logo Section - CENTER */}
          <div className="logo-section">
            <Link to="/">
              <img src={logo} alt="EcoGlow" className="header-logo-img" />
            </Link>
          </div>

          {/* 3. Navigation Links - Hidden on Mobile */}
          <nav className="nav-links">
            <Link to="/about">About Us</Link>

            <div
              className="services-dropdown"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link to="/services" className="services-toggle">
                All Services <ChevronDown size={12} />
              </Link>
              <div className={`dropdown-menu ${servicesDropdownOpen ? 'active' : ''}`}>
                <Link to="/services/commercial">Commercial</Link>
                <Link to="/services#residential">Residential</Link>
              </div>
            </div>

            <Link to="/packages">Packages</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          {/* 4. Header Actions - RIGHT (Search Icon) */}
          <div className="header-actions">
            <Search size={18} className="search-icon" />
            
            <Link to="/book-service">
              <button className="book-btn">Book Your Service</button>
            </Link>
            
            <div className="social-icons">
              {/* WhatsApp Link */}
              <a
                href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-circle whatsapp"
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: 'white' }}></i>
              </a>

              {/* Phone Link */}
              <a
                href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'}
                className="icon-circle"
              >
                <i className="fa-solid fa-phone" style={{ fontSize: '14px', color: isScrolled ? '#333' : 'white' }}></i>
              </a>
            </div>
            
            {/* Removed the mobile-menu-toggle from here since it's now at the top of the container */}
          </div>
        </div>
      </header>

      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-links">
          <Link to="/about" onClick={closeMobileMenu}>About Us</Link>

          <div className="mobile-services-section">
            <button
              className="mobile-services-toggle"
              onClick={toggleMobileServices}
            >
              All Services
              <ChevronDown
                size={16}
                style={{
                  transform: isMobileServicesOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
            <div className={`mobile-services-menu ${isMobileServicesOpen ? 'active' : ''}`}>
              <Link to="/services/commercial" onClick={closeMobileMenu}>Commercial</Link>
              <Link to="/services#residential" onClick={closeMobileMenu}>Residential</Link>
            </div>
          </div>

          <Link to="/packages" onClick={closeMobileMenu}>Packages</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          <Link to="/coming-soon" onClick={closeMobileMenu}>Coming Soon</Link>

          <Link to="/book-service">
            <button className="mobile-book-btn" onClick={closeMobileMenu}>
              Book Your Service
            </button>
          </Link>

          <div className="mobile-social-section">
            <a
              href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-social-link whatsapp"
              onClick={closeMobileMenu}
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp Us</span>
            </a>
            
            <a
              href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'}
              className="mobile-social-link phone"
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

export default Header;