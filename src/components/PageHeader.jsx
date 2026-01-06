import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import './PageHeader.css';

// Asset Import
import logo from '../assets/eco.png';

function PageHeader() {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Calculate 40% of viewport height, with minimum of 350px
      const bannerHeight = Math.max(window.innerHeight * 0.4, 350);
      
      // THE SMOOTHNESS FIX: 10px buffer prevents the "stuck" flickering loop
      if (scrollPosition > bannerHeight + 10) {
        setIsScrolled(true);
      } else if (scrollPosition <= bannerHeight) {
        setIsScrolled(false);
      }
    };

    const onScroll = () => {
      // Synchronize with the browser's refresh rate
      window.requestAnimationFrame(handleScroll);
    };

    handleScroll(); // Check on mount

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <>
      <header className={`page-main-header ${isScrolled ? 'page-scrolled' : ''}`}>
        <div className="page-header-container">
          <div className="page-logo-section">
            <Link to="/">
              <img src={logo} alt="EcoGlow" className="page-header-logo-img" />
            </Link>
          </div>

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
                <Link to="/services#commercial">Commercial</Link>
                <Link to="/services#residential">Residential</Link>
              </div>
            </div>
            <Link to="/packages">Packages</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <div className="page-header-actions">
            <Search size={18} className="page-search-icon" />
            <Link to="/book-service">
              <button className="page-book-btn">Book Your Service</button>
            </Link>
            <div className="page-social-icons">
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="page-icon-circle page-whatsapp">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: 'white' }}></i>
              </a>
              <a href="tel:+97141234567" className="page-icon-circle">
                <i className="fa-solid fa-phone" style={{ fontSize: '14px', color: isScrolled ? '#333' : 'white' }}></i>
              </a>
            </div>

            <button className={`page-mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} className="page-menu-icon" /> : <Menu size={24} className="page-menu-icon" />}
            </button>
          </div>
        </div>
      </header>

      <nav className={`page-mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="page-mobile-nav-links">
          <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
          <div className="page-mobile-services-section">
            <button className="page-mobile-services-toggle" onClick={toggleMobileServices}>
              All Services
              <ChevronDown size={16} style={{ transform: isMobileServicesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </button>
            <div className={`page-mobile-services-menu ${isMobileServicesOpen ? 'active' : ''}`}>
              <Link to="/services#commercial" onClick={closeMobileMenu}>Commercial</Link>
              <Link to="/services#residential" onClick={closeMobileMenu}>Residential</Link>
            </div>
          </div>
          <Link to="/packages" onClick={closeMobileMenu}>Packages</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          <Link to="/book-service">
            <button className="page-mobile-book-btn" onClick={closeMobileMenu}>Book Your Service</button>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default PageHeader;