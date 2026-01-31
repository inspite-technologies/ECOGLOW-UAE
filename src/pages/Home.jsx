import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import BannerSection from '../components/BannerSection';
import AdvantagesSection from '../components/AdvantagesSection';
import MessageSection from '../components/MessageSection';
import Preloader from '../components/Preloader'
import { useLocation } from 'react-router-dom';


const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home-content`);
        setHomeData(response.data.data);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Handle preloader exit animation completion
  const handlePreloaderComplete = () => {
    setShowContent(true);
  };

  // If no data yet, show only preloader
  if (!homeData) {
    return loading ? <Preloader loading={loading} onComplete={handlePreloaderComplete} /> : null;
  }

  return (
    <>
      {/* Show preloader while loading OR while exit animation is playing */}
      {(loading || !showContent) && (
        <Preloader loading={loading} onComplete={handlePreloaderComplete} />
      )}

      {/* Content is rendered immediately but hidden until preloader completes */}
      <div style={{
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
        pointerEvents: showContent ? 'auto' : 'none'
      }}>
        <Header />

        {/* 1. Hero (Top of page) */}
        <section id="home">
          <HeroSection data={homeData.hero} />
        </section>

        {/* 2. Add ID="about" for navigation */}
        <section id="about">
          <AboutSection data={homeData.about} />
        </section>

        {/* 3. Add ID="services" for navigation */}
        <section id="services">
          <ServicesSection data={homeData.services} />
        </section>

        {/* 4. Banner (usually part of flow, no specific ID needed unless requested) */}
        <BannerSection data={homeData.banner} />

        {/* 5. Advantages */}
        <section id="advantages">
          <AdvantagesSection data={homeData.advantages} />
        </section>

        {/* 6. Add ID="message" for navigation */}
        <section id="message">
          <MessageSection data={homeData.message} />
        </section>

        {/* Reverted Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;