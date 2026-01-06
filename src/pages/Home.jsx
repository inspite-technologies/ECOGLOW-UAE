import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import BannerSection from '../components/BannerSection';
import AdvantagesSection from '../components/AdvantagesSection';
import MessageSection from '../components/MessageSection';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BannerSection />
      <AdvantagesSection />
      <MessageSection />
    </>
  );
};

export default Home;