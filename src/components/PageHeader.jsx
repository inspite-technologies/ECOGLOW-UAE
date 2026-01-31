import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { fetchHeader } from '../services/headerAPI';
import './PageHeader.css';

// Asset Import
import logo from '../assets/eco.png';

// Searchable pages data
const searchablePages = [
  { name: 'Home', path: '/', keywords: ['home', 'main', 'ecoglow', 'start'] },
  { name: 'About Us', path: '/about', keywords: ['about', 'company', 'who', 'story', 'team'] },
  { name: 'All Services', path: '/services', keywords: ['services', 'cleaning', 'all'] },
  { name: 'Commercial Services', path: '/services/commercial', keywords: ['commercial', 'office', 'business', 'corporate'] },
  { name: 'Residential Services', path: '/services#residential', keywords: ['residential', 'home', 'house', 'apartment'] },
  { name: 'Packages', path: '/packages', keywords: ['packages', 'deals', 'offers', 'pricing', 'plans'] },
  { name: 'FAQ', path: '/faq', keywords: ['faq', 'questions', 'help', 'answers', 'support'] },
  { name: 'Contact Us', path: '/contact', keywords: ['contact', 'reach', 'email', 'phone', 'location'] },
  { name: 'Book Service', path: '/book-service', keywords: ['book', 'booking', 'schedule', 'appointment', 'reserve'] },
  { name: 'Advantages', path: '/#advantages', keywords: ['why', 'choose', 'benefits', 'features', 'advantages', 'quality'] },
  { name: 'Newsletter', path: '/#message', keywords: ['subscribe', 'newsletter', 'updates', 'connect', 'signup'] },
  { name: 'Our Services', path: '/#services', keywords: ['home services', 'cleaning', 'what we offer'] },
  { name: 'About EcoGlow', path: '/#about', keywords: ['about us', 'mission', 'story', 'who we are'] },
];

function PageHeader() {
  const navigate = useNavigate();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    contactWhatsApp: '',
    contactPhone: ''
  });

  // Filter search results
  const searchResults = searchQuery.trim()
    ? searchablePages.filter(page => {
      const query = searchQuery.toLowerCase();
      return page.name.toLowerCase().includes(query) ||
        page.keywords.some(keyword => keyword.includes(query));
    })
    : [];

  const toggleSearch = (e) => {
    // Prevent event bubbling if necessary
    if (e) e.stopPropagation();

    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      // Slight delay to focus input after animation/render
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleResultClick = (path) => {
    closeSearch();
    if (isMobileMenuOpen) closeMobileMenu();
    navigate(path);
  };

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest('.page-search-trigger-wrapper')
      ) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard events (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Load Data & Scroll Logic
  useEffect(() => {
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
      // Prevent header change if mobile menu is open
      if (isMobileMenuOpen) return;

      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.1; // Trigger scroll effect earlier
      setIsScrolled(scrollPosition >= heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Body Lock for Mobile Menu
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

  const cleanNumber = (num) => num ? num.replace(/[^0-9+]/g, '') : '';

  return (
    <>
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
            style={{ order: -1 }}
          >
            {isMobileMenuOpen ? <X size={24} className="page-menu-icon" /> : <Menu size={24} className="page-menu-icon" />}
          </button>

          {/* CENTER: Logo Section */}
          <div className="page-logo-section">
            <Link to="/">
              <img src={logo} alt="EcoGlow" className="page-header-logo-img" />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="page-nav-links">
            <Link to="/about">About Us</Link>
            
            {/* --- UPDATED: All Services (No Navigation) --- */}
            <div
              className="page-services-dropdown"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              {/* Changed from Link to div to prevent navigation */}
              <div 
                className="page-services-toggle" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                All Services <ChevronDown size={12} />
              </div>
              
              <div className={`page-dropdown-menu ${servicesDropdownOpen ? 'active' : ''}`}>
                <Link to="/services/commercial">Commercial</Link>
                <Link to="/services#residential">Residential</Link>
              </div>
            </div>
            {/* --------------------------------------------- */}

            <Link to="/packages">Packages</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="page-header-actions">

            {/* Search Icon Trigger - Wrapped in div for click targeting */}
            <div
              className="page-search-trigger-wrapper"
              onClick={toggleSearch}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Search
                size={18}
                className="page-search-icon search-trigger-icon"
              />
            </div>

            {isSearchOpen && (
              <div className="page-search-dropdown-wrapper" ref={searchContainerRef}>
                <div className="page-search-input-wrapper">
                  <Search size={16} className="page-search-input-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="page-search-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                  <button className="page-search-close-btn" onClick={closeSearch}>
                    <X size={14} />
                  </button>
                </div>

                {searchQuery.trim() && (
                  <div className="page-search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <button
                          key={index}
                          className="page-search-result-item"
                          onClick={() => handleResultClick(result.path)}
                        >
                          <span className="page-result-name">{result.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="page-search-no-results">No results found</div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Link to="/book-service" className="page-desktop-only">
              <button className="page-book-btn">Book Your Service</button>
            </Link>

            <div className="page-social-icons">
              <a href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'} target="_blank" rel="noopener noreferrer" className="page-icon-circle page-whatsapp">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: 'white' }}></i>
              </a>
              <a href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'} className="page-icon-circle">
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
          <Link to="/book-service">
            <button className="page-mobile-book-btn" onClick={closeMobileMenu}>Book Your Service</button>
          </Link>
          {/* Mobile Social Links */}
          <div className="page-mobile-social-section">
            <a href={contactInfo.contactWhatsApp ? `https://wa.me/${cleanNumber(contactInfo.contactWhatsApp)}` : '#'} target="_blank" rel="noopener noreferrer" className="page-mobile-social-link page-whatsapp" onClick={closeMobileMenu}>
              <i className="fa-brands fa-whatsapp"></i><span>WhatsApp Us</span>
            </a>
            <a href={contactInfo.contactPhone ? `tel:${cleanNumber(contactInfo.contactPhone)}` : '#'} className="page-mobile-social-link page-phone" onClick={closeMobileMenu}>
              <i className="fa-solid fa-phone"></i><span>Call Us</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default PageHeader;