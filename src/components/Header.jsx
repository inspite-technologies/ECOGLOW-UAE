import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import './Header.css';

// Asset Import
import logo from '../assets/eco.png';

function Header() {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight; // Full viewport height = hero section height
      
      // Change to white exactly when about section starts (after hero section ends)
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
    // Prevent body scroll when mobile menu is open
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

  return (
    <>
      {/* FontAwesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-section">
            <Link to="/">
              <img src={logo} alt="EcoGlow" className="header-logo-img" />
            </Link>
          </div>

          {/* Desktop Navigation */}
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
                <Link to="/services#commercial">Commercial</Link>
                <Link to="/services#residential">Residential</Link>
              </div>
            </div>
            
            <Link to="/packages">Packages</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <div className="header-actions">
            <Search size={18} className="search-icon" />
            <Link to="/book-service">
              <button className="book-btn">Book Your Service</button>
            </Link>
            <div className="social-icons">
              <a 
                href="https://wa.me/971501234567" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="icon-circle whatsapp"
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: 'white' }}></i>
              </a>
              <a 
                href="tel:+97141234567" 
                className="icon-circle"
              >
                <i className="fa-solid fa-phone" style={{ fontSize: '14px', color: isScrolled ? '#333' : 'white' }}></i>
              </a>
            </div>

            {/* Improved Mobile Menu Toggle Button */}
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="menu-icon" />
              ) : (
                <Menu size={24} className="menu-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
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
              <Link to="/services#commercial" onClick={closeMobileMenu}>Commercial</Link>
              <Link to="/services#residential" onClick={closeMobileMenu}>Residential</Link>
            </div>
          </div>
          
          <Link to="/packages" onClick={closeMobileMenu}>Packages</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          
          <Link to="/book-service">
            <button className="mobile-book-btn" onClick={closeMobileMenu}>
              Book Your Service
            </button>
          </Link>

          {/* Mobile Social Icons */}
          <div className="mobile-social-section">
            <a 
              href="https://wa.me/971501234567" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-social-link whatsapp"
              onClick={closeMobileMenu}
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp Us</span>
            </a>
            <a 
              href="tel:+97141234567" 
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