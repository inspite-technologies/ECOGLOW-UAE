import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // 1. Added Link import
import { Home } from "lucide-react";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchServices } from '../services/serviceAPI';
import "./Services.css";

// Import local images as Fallbacks
import service1 from '../assets/service1.webp';
import service2 from '../assets/service2.webp';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- HELPER 1: IMAGE URL FIXER ---
const getImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('blob:') || path.startsWith('http')) return path;
  return `${SERVER_URL}/${path.replace(/\\/g, '/')}`;
};

// --- HELPER 2: WHATSAPP LINK FIXER (STRICT HTTPS) ---
const getWhatsAppLink = (input) => {
  if (!input || input.trim() === "") return "https://wa.me/971585766424";
  if (input.startsWith('http')) return input;
  const cleanNumber = input.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}`;
};

// --- HELPER 3: BOOK BUTTON CONFIGURATOR ---
const getButtonConfig = (input) => {
  // 1. If empty -> Internal Link to '/book-service' (Prevents 404)
  if (!input) {
    return {
      type: 'internal',
      props: { to: "/book-service", className: "btn btn-book" },
      text: "Book Now"
    };
  }

  // 2. If website URL -> External Link
  if (input.startsWith('http') || input.startsWith('www')) {
    return {
      type: 'external',
      props: {
        href: input.startsWith('www') ? `https://${input}` : input,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "btn btn-book"
      },
      text: "Book Now"
    };
  }

  // 3. PRIORITY: Phone Number -> Tel Link
  const cleanNumber = input.replace(/[^\d+]/g, '');
  return {
    type: 'external',
    props: {
      href: `tel:${cleanNumber}`,
      className: "btn btn-book"
    },
    text: "Book Now"
  };
};

// --- HELPER 4: STRING SLUGIFY (For Deep Linking) ---
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

const Services = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchServices();
        const result = response.data || response;
        const serviceData = Array.isArray(result) ? result[0] : result;
        setData(serviceData);
      } catch (error) {
        console.error("Error fetching services page data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Only runs once on mount

  // --- SCROLL TO HASH EFFECT (With Retry) ---
  useEffect(() => {
    if (data && location.hash) {
      const id = decodeURIComponent(location.hash.replace('#', ''));
      let attempts = 0;
      const maxAttempts = 50; // Try for 5 seconds

      const attemptScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          // Found it! Scroll and stop.
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < maxAttempts) {
          // Not found yet, try again in 100ms
          attempts++;
          setTimeout(attemptScroll, 100);
        }
      };

      attemptScroll();
    }
  }, [data, location.hash]); // Runs when data loads OR hash changes

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!data) return null;

  return (
    <div className="service-page">

      {/* 1. HERO SECTION */}
      <section
        className="service-hero"
        style={{
          backgroundImage: `url(${getImageUrl(data.bannerImage, service1)})`
        }}
      >
        <h1 className="hero-title">
          <span className="service-text">{data.heroTitlePart1 || "All"}</span>
          <span className="brand-text">{data.heroTitlePart2 || "Services"}</span>
        </h1>
      </section>

      {/* 2. BREADCRUMB SECTION */}
      <section className="service-intro">
        <div className="hero-breadcrumb">
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Home size={16} /> HOME
          </span>
          <span style={{ color: "#80cbc4" }}>/</span>
          <span>{(data.introLabel || "ALL SERVICES").toUpperCase()}</span>
        </div>
      </section >

      {/* 3. RESIDENTIAL INTRO SECTION */}
      < section className="residential-section" >
        <div className="container">
          <div className="content">
            <div className="section-label">{data.introLabel || "All Services"}</div>
            <h4 className="title">
              {(() => {
                const title = data.introMainTitle || "Residential";
                const parts = title.split(' ');
                if (parts.length >= 2) {
                  return <>{parts.slice(0, -1).join(' ')} <span className="teal-text-thin">{parts[parts.length - 1]}</span></>;
                }
                return title;
              })()}
            </h4>
            <div className="title-underline"></div>

            <p className="description">
              {data.introDescription || "At EcoGlow, we deliver luxury-standard cleaning experiences designed for conscious living."}
            </p>

            <p className="lorem-text">
              {data.introLongText}
            </p>
          </div>

          <div className="image-container">
            <img
              src={getImageUrl(data.introSideImage, service2)}
              alt="Intro Side"
            />
          </div>
        </div>
      </section >

      {/* 4. TRUST BADGE */}
      < section className="trust-section" >
        <div className="trust-badge">
          <h2 className="trusted-outline-text">{data.trustedText || "Trusted by 100+ Clients"}</h2>
        </div>
      </section >

      {/* 5. DYNAMIC SERVICES GRID */}
      < section className="residential-luxury-section" >
        <div className="section-header">
          <h1>{data.gridMainHeading || "Residential"}</h1>
          <p>{data.gridSubheading || "Our premium cleaning services."}</p>
        </div>

        {
          data.servicesList && data.servicesList.map((service, index) => {

            // Fix: Hide empty cards
            if (!service.title && !service.description) return null;

            // Logic: Get configs for buttons
            const buttonConfig = getButtonConfig(service.phoneNumber);
            const whatsappLink = getWhatsAppLink(service.whatsappNumber);

            return (
              <div
                key={service._id || index}
                id={slugify(service.title)} // ADDED ID FOR DEEP LINKING
                className={`content-grid ${index % 2 !== 0 ? "row-reverse" : ""}`}
              >
                <div className="image-side">
                  <img
                    src={getImageUrl(service.image, service2)}
                    alt={service.title}
                  />
                </div>

                <div className="text-side">
                  <h2>{service.title}</h2>
                  {service.subtitle && <h3>{service.subtitle}</h3>}
                  <p>{service.desc || service.description}</p>

                  <div className="buttons">

                    {/* DYNAMIC BOOK BUTTON */}
                    {buttonConfig.type === 'internal' ? (
                      <Link {...buttonConfig.props}>
                        {buttonConfig.text}
                      </Link>
                    ) : (
                      <a {...buttonConfig.props}>
                        {buttonConfig.text}
                      </a>
                    )}

                    {/* WHATSAPP BUTTON */}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      <span className="whatsapp-icon-circle">
                        <FontAwesomeIcon icon={faWhatsapp} />
                      </span>
                      Whatsapp Now
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        }
      </section >

      {/* 6. NEWSLETTER SECTION */}
      < section className="newsletter-section" >
        <div className="newsletter-container">
          <div className="left-content">
            <h2 className="title">
              {(() => {
                const title = data.newsletterTitle || "LET'S CONNECT";
                const parts = title.split(' ');
                if (parts.length >= 2) {
                  return <>{parts.slice(0, -1).join(' ')} <span className="teal-text-thin">{parts[parts.length - 1]}</span></>;
                }
                return title;
              })()}
            </h2>
            <p className="subtitle">
              {data.newsletterSubtitle || "Stay updated with upcoming EcoGlow events and news."}
            </p>
          </div>

          <div className="right-content">
            <p className="newsletter-label">You will get monthly newsletter</p>
            <NewsletterForm contactEmail={data.contactEmail} />
          </div>
        </div>
      </section >
    </div >
  );
};

// Newsletter Form Component
const NewsletterForm = ({ contactEmail }) => {
  const [subscriberEmail, setSubscriberEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberEmail) return;

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(subscriberEmail)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    const adminEmail = contactEmail || "residential@ecoglow.ae";

    try {
      setSending(true);

      const response = await fetch(`${SERVER_URL}/message/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: subscriberEmail,
          adminEmail: adminEmail
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Subscribed successfully! Check your email for confirmation.");
        setSubscriberEmail("");
      } else {
        alert("❌ Failed to subscribe. Please try again.");
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ Error connecting to server.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="email-input"
        placeholder="Enter your email ID"
        value={subscriberEmail}
        onChange={(e) => setSubscriberEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="send-button"
        disabled={sending}
        style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default Services;