import React, { useEffect } from "react";
import { Eye, Target, Diamond, Home } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AboutUs.css";
import logos from "../assets/logos.png";
import abt1 from "../assets/about1.webp";
import values from "../assets/values.png";
import mission from "../assets/mission.png";
import vision from "../assets/vision.png";
import abt2 from "../assets/abt2.webp";
import abt3 from '../assets/abt3.webp'
import banner from '../assets/banner.webp'


const VisionIcon = ({ size = 48, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Eye Shape */}
    <path
      d="M32 12C18 12 6 32 6 32C6 32 18 52 32 52C46 52 58 32 58 32C58 32 46 12 32 12Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Iris Circle */}
    <circle cx="32" cy="32" r="10" stroke={color} strokeWidth="2.5" />
    {/* Sparkle 1 (Top Right) */}
    <path
      d="M56 12L58 8L60 12L64 14L60 16L58 20L56 16L52 14L56 12Z"
      fill={color}
      opacity="0.8"
    />
    {/* Sparkle 2 (Inside/Left Pupil) */}
    <path
      d="M28 28L29 26L30 28L32 29L30 30L29 32L28 30L26 29L28 28Z"
      fill={color}
    />
  </svg>
);

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="about-page">

      {/* 1. Hero Section */}
      <section className="about-hero">
        <h1 className="hero-title" data-aos="fade-up">
          <span className="about-text">About</span>
          <br />
          <span className="brand-text">EcoGlow</span>
        </h1>
      </section>

      {/* 2. Intro Text */}
      <section className="about-intro">
        <div data-aos="fade-up">
          {/* Breadcrumb */}
          <div className="hero-breadcrumb" data-aos="fade-down">
            <span
              style={{
                color: "#14b8a6",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Home size={16} /> About Us
            </span>
            <span style={{ color: "black", marginLeft: "6px" }}>
              / About EcoGlow
            </span>
          </div>

          {/* Subtitle */}
          <div data-aos="fade-up">
            {/* 1. "About" - Small, Teal, with Top Padding */}
            <div className="section-label">About</div>

            {/* 2. "EcoGlow Cleaning Services" - Darker & Bigger */}
            <h2 className="main-heading">EcoGlow Cleaning Services</h2>

            {/* 3. "Luxury standard..." - Smaller than heading, lighter weight */}
            <p className="intro-subtitle">
              <span className="highlight-text">Luxury standard</span> cleaning
              service born in Dubai,
              <br /> redefining what it means to live and
              <br /> work in clean, conscious spaces.
            </p>
          </div>
          {/* Description */}
          <p className="intro-desc">
            We go beyond surface cleaning; combining eco-friendly products,
            refined service standards, and a detail-oriented approach to create
            environments that feel as fresh as they look. Focused on quality
            over quantity ,EcoGlow serves both residential and commercial
            clients who value wellness,sustainability, and trust.Every service
            is delivered with a unique experience,care,using a non-toxic,
            biodegradable products that are safe for families,pets,and the
            planet
          </p>
        </div>
      </section>

      {/* 3. Slogan Banner */}
      <section className="slogan-banner">
        <h2 className="slogan-text" data-aos="zoom-in">
          Clean. Conscious. Trusted.
        </h2>
      </section>

      {/* 4. Vision (Image Right) */}
      <section className="vision-section-fixed">
        <div className="vision-content" data-aos="fade-right">
          <div className="pillar-inner-wrapper">
            <div className="section-icon">
              <img
                src={vision}
                alt="Vision Icon"
                className="vision-icon-img" /* Added this class */
              />
            </div>

            {/* Target these two classes in CSS */}
            <h3 className="section-title">Vision</h3>
            <p className="vision-text">
              To make every space shine with care through safe, sustainable, and
              detail-driven cleaning experiences.
            </p>
          </div>
        </div>
        <div
          className="vision-image"
          style={{
            backgroundImage: `url(${abt3})`, // Corrected template literal syntax
          }}
        ></div>
      </section>

      {/* 5. Mission (Image Left - Reversed) */}
      <section className="split-section reverse">
        <div className="split-content" data-aos="fade-left">
          <div className="section-icon">
            <img
              src={mission}
              alt="Mission Icon"
              className="mission-icon-img" /* Added specific class */
            />
          </div>
          <h2 className="mission-title">Mission</h2>
          <p className="section-text">
            To become the UAE's most trusted luxury standard ecocleaning brand
            leading the shift toward mindful living, where cleanliness,
            reliability, and sustainability coexist beautifully.
          </p>
        </div>
        <div
          className="split-image"
          style={{
            backgroundImage: `url(${abt2})`, // Corrected template literal syntax
          }}
        ></div>
      </section>
      <section className="pillar-section">
        <div className="pillar-content" data-aos="fade-right">
          <div className="pillar-inner-wrapper">
            <div className="section-icon">
              <div className="section-icon">
                {/* Added 'values-icon-img' class */}
                <img
                  src={values}
                  alt="Values Icon"
                  className="values-icon-img"
                />
              </div>
            </div>
            <h2 className="section-title">Values</h2>
            <ul className="values-list">
              {/* Value 1 */}
              <li className="value-item">
                <span className="value-number">1.</span>
                <div className="value-body">
                  <h3 className="value-head">Conscious:</h3>
                  <p className="value-desc">
                    We make mindful choices from the products we use to the care
                    we deliver; ensuring our impact is always clean, safe, and
                    sustainable.
                  </p>
                </div>
              </li>

              {/* Value 2 */}
              <li className="value-item">
                <span className="value-number">2.</span>
                <div className="value-body">
                  <h3 className="value-head">Crafted Experience:</h3>
                  <p className="value-desc">
                    Every detail reflects our boutique approach: elevated,
                    thoughtful, and tailored for those who value quality without
                    compromise.
                  </p>
                </div>
              </li>

              {/* Value 3 */}
              <li className="value-item">
                <span className="value-number">3.</span>
                <div className="value-body">
                  <h3 className="value-head">Trustworthy:</h3>
                  <p className="value-desc">
                    We say what we mean and do what we promise. Our clients
                    count on us for consistent service and unwavering integrity.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="pillar-image"
          style={{
            backgroundImage: `url(${abt1})`, // Corrected template literal syntax
          }}
        ></div>
      </section>
      {/* 7. Clients */}
      {/* <section className="clients-section">
        <h2 className="clients-title" data-aos="fade-up">
          Our Clients
        </h2>
        <div className="clients-grid" data-aos="fade-up" data-aos-delay="200"> */}
          {/* Using placeholder logos */}
          {/* <img src={logos} alt="Our Clients" className="clients-logo-img" />
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;