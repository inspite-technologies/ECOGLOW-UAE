import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importing all sections
import HeroSection from './HeroSection';
import AboutUs from './AboutManager'; 
import ServicesSection from './ServicesManager'; 
import BannerAdmin from './BannerSection'; // Import the Admin Component
import AdvantagesSection from './AdvantagesManager';
import MessageSection from './MessageManager';

import './HomePage.css'; 

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50, 
    });
    window.addEventListener('resize', () => AOS.refresh());
    return () => window.removeEventListener('resize', () => AOS.refresh());
  }, []);

  return (
    <main className="homepage-wrapper">
      
      {/* 1. HERO */}
      <div className="home-section hero">
        <HeroSection />
      </div>

      {/* 2. ABOUT */}
      <div className="home-section bg-white" style={{ padding: 0 }}>
        <AboutUs />
      </div>

      {/* 3. SERVICES */}
      <section className="home-section bg-gray">
        <div className="container">
          <ServicesSection />
        </div>
      </section>

      {/* 4. BANNER ADMIN SECTION (Alignment Fix Here) */}
      <section className="home-section bg-white">
        <div className="container">
          {/* Wrapping it in .container constrains width to 1320px */}
          <BannerAdmin />
        </div>
      </section>

      {/* 5. ADVANTAGES */}
      <section className="home-section bg-gray">
        <div className="container">
          <AdvantagesSection />
        </div>
      </section>

      {/* 6. MESSAGE */}
      <section className="home-section bg-white">
        <div className="container">
          <MessageSection />
        </div>
      </section>

    </main>
  );
};

export default HomePage;