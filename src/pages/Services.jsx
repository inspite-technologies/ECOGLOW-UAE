import React, { useEffect } from "react";
import { Home, MessageCircle } from "lucide-react";

import "./Services.css";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import all service images
import service1 from '../assets/service1.webp';
import service2 from '../assets/service2.webp';
import service3 from '../assets/service3.webp';
import service4 from '../assets/service4.webp';
import service5 from '../assets/service5.webp';
import service6 from '../assets/service6.webp';
import service7 from '../assets/service7.webp';

const Services = () => {
  useEffect(() => {
    // AOS init would go here if you have it installed
    // AOS.init({ duration: 1000, once: true });
  }, []);

  const servicesData = [
    {
      id: 1,
      title: "Luxury Cleaning",
      subtitle: "Complete Area and Corner Cleaning",
      description: "Experience premium cleaning services that cover every corner of your space. Our meticulous approach ensures no detail is overlooked, leaving your home spotless and refreshed with our eco-friendly solutions.Ideal for ongoing maintenance of homes and workspaces",
      image: service3
    },
    {
      id: 2,
      title: "Deep Cleaning",
      subtitle: "Aircon & AC Duct Cleaning",
      description: "Designed to restore ",
      image: service4
    },
    {
      id: 3,
      title: "Mattress Cleaning",
      subtitle: "We offer expert mattress cleaning services",
      description: "Sleep better with our professional mattress cleaning that eliminates dust mites, allergens, and stains. Our deep-cleaning process restores freshness and hygiene to your mattress for healthier, more restful sleep.",
      image: service5
    },
    {
      id: 4,
      title: "Sofa Cleaning",
      subtitle: "Our upholstery cleaning services",
      description: "Revitalize your furniture with our expert upholstery cleaning services. We carefully treat all fabric types, removing dirt, stains, and odors while protecting the material's integrity and extending its lifespan.",
      image: service6
    },
    {
      id: 5,
      title: "Disinfection & Sanitization",
      subtitle: "Our disinfection services provide comprehensive sanitation and disinfection",
      description: "Ensure a safe and healthy environment with our comprehensive disinfection and sanitization services. We use hospital-grade solutions to eliminate harmful bacteria, viruses, and germs from all surfaces.",
      image: service7
    }
  ];

  return (
    <div className="service-page">
      {/* Hero Section with Background */}
      <section className="service-hero" style={{ backgroundImage: `url(${service1})` }}>
        <h1 className="hero-title">
          <span className="service-text">All</span>
          <span className="brand-text">Services</span>
        </h1>
      </section>

      {/* Breadcrumb Section */}
      <section className="service-intro">
        <div className="hero-breadcrumb">
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Home size={16} /> HOME
          </span>
          <span style={{ color: "#80cbc4" }}>/</span>
          <span>ALL SERVICES</span>
        </div>
      </section>

      {/* Residential Services Section */}
      <section className="residential-section">
        <div className="container">
          <div className="content">
            <div className="section-label">All Services</div>
            <h4 className="title">Residential</h4>
            <div className="title-underline"></div>

            <p className="description">
              In a world where sustainability often comes at the cost of performance, EcoGlow was created to prove that the two can coexist beautifully. Our team is trained to deliver exceptional results using eco-friendly products and thoughtful methods that are
              safe for people, pets, and the planet.
            </p>

            <p className="lorem-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              tristique malesuada sem quis condimentum. Nam consectetur enim
              justo, quis pharetra tortor accumsan at. Vestibulum lacinia
              interdum nulla, et eleifend ex. Sed vel urna bibendum, varius
              lorem at molestie libero. Praesent laoreet finibus sem et rutrum.
              Cras luctus finibus leo ullamcorper tempus. Donec volutpat justo
              vitae lorem porta consequat. Vivamus nisl tellus, tincidunt ac
              tristique eget, bibendum nec leo. Nullam hendrerit aliquet massa,
              in fermentum purus ullamcorper vel. Suspendisse consequat varius
              dictum.
            </p>
          </div>

          <div className="image-container">
            <img src={service2} alt="Residential Cleaning" />
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="trust-section">
        <div className="trust-badge">
          <h2 className="trusted-outline-text">Trusted by 100+ Clients</h2>
        </div>
      </section>

      <section className="residential-luxury-section">
        <div className="section-header">
          <h1>Residential</h1>
          <p>At EcoGlow, we deliver luxury-standard cleaning experiences designed for conscious living.</p>
        </div>

        {servicesData.map((service, index) => (
          <div
            key={service.id}
            className={`content-grid ${index % 2 !== 0 ? "row-reverse" : ""}`}
          >
            <div className="image-side">
              <img src={service.image} alt={service.title} />
            </div>

            <div className="text-side">
              <h2>{service.title}</h2>
              <h3>{service.subtitle}</h3>
              <p>{service.description}</p>

              <div className="buttons">
                <button className="btn btn-book">Book Now</button>
                <button className="btn btn-whatsapp">
                  <span className="whatsapp-icon-circle">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  Whatsapp Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="left-content">
            <h2 className="title">
              <span className="lets">LET'S </span>
              <span className="connect">CONNECT</span>
            </h2>
            <p className="subtitle">
              Stay updated with upcoming EcoGlow events and news or simply get in touch.
            </p>
          </div>

          <div className="right-content">
            <p className="newsletter-label">You will get monthly newsletter</p>
            <form className="email-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="email-input"
                placeholder="Enter your email ID"
                required
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;