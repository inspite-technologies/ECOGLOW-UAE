import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AboutUs.css";
import { fetchAboutUs } from "../services/aboutAPI";
import Preloader from "../components/Preloader";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetchAboutUs();
        setAboutData(res.data);
      } catch (err) {
        console.error("Failed to load About Us data", err);
      } finally {
        setLoading(false); // Trigger exit animation
      }
    };
    loadAbout();
  }, []);

  // --- HELPER FUNCTION TO FIX URLS ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // 1. If it's already a full URL (Cloudinary, external), return it as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // 2. If it's a local path (uploads/...), prepend BASE_URL and fix slashes
    return `${BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
  };

  if (!aboutData && !loading) return <div className="error-message">Failed to load content.</div>;

  const { hero, intro, slogan, vision, mission, valuesSection, clients } = aboutData || {}; // Safety fallback

  return (
    <>
      {showPreloader && (
        <Preloader
          loading={loading}
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {aboutData && (
        <div className="about-page" style={{ opacity: showPreloader && loading ? 0 : 1 }}>
          {/* HERO */}
          <section
            className="about-hero"
            style={{
              backgroundImage: `url('${getImageUrl(hero?.bannerImg)}')`,
            }}
          >
            <h1 className="hero-title" data-aos="fade-up">
              <span className="about-text">{hero?.titlePart1}</span>
              <br />
              <span className="brand-text">{hero?.titlePart2}</span>
            </h1>
          </section>

          {/* INTRO */}
          <section className="about-intro">
            <div data-aos="fade-up">
              <div className="hero-breadcrumb">
                <span style={{ color: "#14b8a6", display: "flex", gap: "5px" }}>
                  <Home size={16} /> About Us
                </span>
                <span style={{ marginLeft: "6px" }}>/ About EcoGlow</span>
              </div>

              <div className="section-label">About</div>
              <h2 className="main-heading">{intro?.heading}</h2>
              <p className="intro-subtitle">{intro?.subtitle}</p>
              <p className="intro-desc">{intro?.description}</p>
            </div>
          </section>

          {/* SLOGAN */}
          <section
            className="slogan-banner"
            style={{
              backgroundImage: `url('${getImageUrl(slogan?.bannerImg)}')`,
            }}
          >
            <h2 className="slogan-text" data-aos="zoom-in">
              {slogan?.text}
            </h2>
          </section>

          {/* VISION */}
          <section className="vision-section-fixed">
            <div className="vision-content" data-aos="fade-right">
              <div className="pillar-inner-wrapper">
                <div className="section-icon">
                  <img
                    src={getImageUrl(vision?.icon)}
                    alt="Vision"
                    className="vision-icon-img"
                  />
                </div>
                <h3 className="section-title">{vision?.title}</h3>
                <p className="vision-text">{vision?.text}</p>
              </div>
            </div>

            <div
              className="vision-image"
              style={{
                backgroundImage: `url('${getImageUrl(vision?.image)}')`,
              }}
            />
          </section>

          {/* MISSION */}
          <section className="split-section reverse">
            <div className="split-content" data-aos="fade-left">
              <div className="section-icon">
                <img
                  src={getImageUrl(mission?.icon)}
                  alt="Mission"
                  className="mission-icon-img"
                />
              </div>
              <h2 className="mission-title">{mission?.title}</h2>
              <p className="section-text">{mission?.text}</p>
            </div>

            <div
              className="split-image"
              style={{
                backgroundImage: `url('${getImageUrl(mission?.image)}')`,
              }}
            />
          </section>

          {/* VALUES */}
          <section className="pillar-section">
            <div className="pillar-content" data-aos="fade-right">
              <div className="pillar-inner-wrapper">
                {/* Values Icon */}
                {valuesSection?.icon && (
                  <div className="section-icon">
                    <img
                      src={getImageUrl(valuesSection.icon)}
                      alt="Values Icon"
                      className="values-icon-img"
                    />
                  </div>
                )}

                {/* Values Title */}
                <h2 className="section-title">{valuesSection?.title}</h2>

                {/* Values List */}
                <ul className="values-list">
                  {valuesSection?.list?.map((item, index) => (
                    <li className="value-item" key={index}>
                      <span className="value-number">{index + 1}.</span>
                      <div className="value-body">
                        <h3 className="value-head">{item.head}</h3>
                        <p className="value-desc">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Values Image */}
            {valuesSection?.image && (
              <div
                className="pillar-image"
                style={{
                  backgroundImage: `url('${getImageUrl(valuesSection.image)}')`,
                }}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default AboutUs;