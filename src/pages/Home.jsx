import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import BannerSection from '../components/BannerSection';
import AdvantagesSection from '../components/AdvantagesSection';
import MessageSection from '../components/MessageSection';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // ONE call to get everything
        const response = await axios.get(`${SERVER_URL}/home-content`);
        console.log("📦 Full Response:", response.data);
        console.log("💬 Message Data:", response.data.data?.message);
        setHomeData(response.data.data);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    // Return a loading spinner or skeleton here
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // If data failed to load entirely, handle safely
  if (!homeData) return null;

  return (
    <>
      <Header />
      {/* Pass specific chunks of data to each component */}
      <HeroSection data={homeData.hero} />
      <AboutSection data={homeData.about} />
      <ServicesSection data={homeData.services} />
      <BannerSection data={homeData.banner} />
      <AdvantagesSection data={homeData.advantages} />
      <MessageSection data={homeData.message} />
    </>
  );
};

export default Home;