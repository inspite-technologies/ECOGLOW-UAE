import React from 'react';
import './Preloader.css';
import logo from '../assets/eco.png';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-background">
        {/* Animated Background Circles */}
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="preloader-content">
        {/* Logo Container with Animation */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <img src={logo} alt="EcoGlow" className="preloader-logo-img" />
          </div>
          
          {/* Elegant Loading Ring */}
          <div className="loading-ring">
            <div className="ring-segment segment-1"></div>
            <div className="ring-segment segment-2"></div>
            <div className="ring-segment segment-3"></div>
          </div>
        </div>

        {/* Premium Brand Name */}
        <div className="brand-name">
          <span className="brand-eco">Eco</span>
          <span className="brand-glow">Glow</span>
        </div>

        {/* Elegant Tagline */}
        <p className="preloader-tagline">Premium Cleaning Services</p>

        {/* Animated Loading Dots */}
        <div className="loading-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;