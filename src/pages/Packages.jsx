import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { fetchPackages } from "../services/packageAPI"; // Ensure this path is correct
import Preloader from "../components/Preloader";
import "./Packages.css";

// --- HELPER: Resolve Image URL ---
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  // Fix Windows backslashes and prepend server URL
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

// --- HELPER: Format Phone Numbers for Links ---
// const formatWA = (num) => num ? `https://wa.me/${num.replace(/\D/g, "")}` : '#';
// const formatTel = (num) => num ? `tel:${num.replace(/\D/g, "")}` : '#';

const Packages = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPackages();
        // Handle varied response structures (array vs object)
        let result = response.data || response;
        if (Array.isArray(result)) result = result[0];
        setData(result);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false); // Trigger exit animation
      }
    };
    loadData();
  }, []);

  // --- HELPER: Render Feature List ---
  const renderFeatures = (featuresString) => {
    if (!featuresString) return null;

    return featuresString
      .split('\n')                  // 1. Split by new line
      .map(f => f.trim())           // 2. Remove extra spaces from start/end
      .filter(f => f.length > 0)    // 3. Remove empty lines
      .map((feature, index) => (
        <li key={index} className="packages-feature-item">
          <span className="packages-bullet">•</span>
          <span className="packages-feature-text">{feature}</span>
        </li>
      ));
  };

  // --- HELPER: Render Feature List Without Bullets ---
  const renderFeaturesNoBullets = (featuresString) => {
    if (!featuresString) return null;

    return featuresString
      .split('\n')                  // 1. Split by new line
      .map(f => f.trim())           // 2. Remove extra spaces from start/end
      .filter(f => f.length > 0)    // 3. Remove empty lines
      .map((feature, index) => (
        <li key={index} className="packages-feature-item">
          <span className="packages-feature-text">{feature}</span>
        </li>
      ));
  };

  // --- HELPER: Render Pricing Card (Standard) ---
  const renderCard = (cardData) => {
    if (!cardData) return null;
    return (
      <div className="packages-pricing-card">
        <h3 className="packages-card-title">{cardData.title}</h3>
        <ul className="packages-features-list">
          {renderFeatures(cardData.features)}
        </ul>
        <div className="packages-card-footer">
          <div className="packages-price-box">
            <div className="packages-price">{cardData.price}</div>
          </div>
          <div className="packages-minimum">
            {cardData.min}
          </div>
        </div>
      </div>
    );
  };

  // --- HELPER: Render Common Info (Small Box, Full Width) ---
  const renderCommon = (commonData) => {
    if (!commonData || (!commonData.title && !commonData.features)) return null;

    return (
      <div
        className="packages-pricing-card"
        style={{
          // ✅ Full Width
          gridColumn: "1 / -1",

          // ✅ Height depends STRICTLY on content (starts small)
          height: "fit-content",
          minHeight: "0",
          alignSelf: "start",

          // ✅ Visual adjustments
          padding: "1.5rem",
          display: "block" // Removes flex stretching behavior
        }}
      >
        {/* ✅ Smaller Title */}
        <h5
          className="packages-card-title"
          style={{
            fontSize: "1rem",   // Much smaller than main cards
            marginBottom: "0.5rem",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          {commonData.title}
        </h5>

        {/* Content */}
        <ul className="packages-features-list" style={{ marginTop: 0 }}>
          {renderFeatures(commonData.features)}
        </ul>
      </div>
    );
  };

  if (!data && !loading) return <div className="error-message">Failed to load packages.</div>;

  return (
    <>
      {showPreloader && (
        <Preloader
          loading={loading}
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {data && (
        <div className="packages-page" style={{ opacity: showPreloader && loading ? 0 : 1 }}>
          {/* FontAwesome CDN */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          />

          {/* 1. HERO SECTION */}
          <section
            className="packages-hero"
            style={{
              backgroundImage: data.heroBannerImg ? `url(${getImageUrl(data.heroBannerImg)})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <h1 className="packages-hero-title">
              <span className="packages-hero-small">{data.heroSmall || "Premium Service"}</span>
              <br />
              <span className="packages-hero-large">{data.heroLarge || "Packages"}</span>
            </h1>
          </section>

          {/* 2. BREADCRUMB */}
          <section className="packages-breadcrumb-section">
            <div className="packages-breadcrumb">
              <span className="packages-breadcrumb-home">
                <Home size={16} />
              </span>
              <span className="packages-breadcrumb-separator">/ </span>
              <span className="packages-breadcrumb-text">PACKAGES</span>
            </div>
          </section>

          {/* 3. INTRO SECTION */}
          <section className="packages-intro-section">
            <div className="packages-intro-label">{data.introLabel}</div>
            <h2 className="packages-intro-title">{data.introTitle}</h2>
            <div className="packages-intro-line"></div>
            <p className="packages-intro-desc">
              {data.introDesc}
            </p>
          </section>

          {/* 4. RESIDENTIAL SECTION */}
          {data.residential && (
            <section className="packages-residential">
              <div className="packages-residential-header">
                <div className="packages-residential-title">{data.residential.heading}</div>
                <div className="packages-residential-actions">
                  <a
                    href={data.residential.externalLink || "https://ecoglow.ae/"}
                    className="packages-book-link"
                    target="_blank" rel="noopener noreferrer"
                  >
                    Book Now
                  </a>
                  <div className="packages-divider"></div>
                  <a
                    href={data.residential.whatsappLink || "#"}
                    className="packages-whatsapp-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="packages-whatsapp-icon-wrapper">
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                    Whatsapp Now
                  </a>
                </div>
              </div>

              <div className="packages-pricing-grid">
                {renderCard(data.residential.card1)}
                {renderCard(data.residential.card2)}
                {/* ✅ Full Width, Small Box Common Card */}
                {renderCommon(data.residential.common)}
              </div>
            </section>
          )}

          {/* 5. COMMERCIAL SECTION */}
          {data.commercial && (
            <section className="packages-commercial">
              <div className="packages-residential-header">
                <div className="packages-residential-title">{data.commercial.heading}</div>
                <div className="packages-residential-actions">
                  <a
                    href={data.commercial.externalLink || "https://ecoglow.ae/"}
                    className="packages-book-link"
                    target="_blank" rel="noopener noreferrer"
                  >
                    Book Now
                  </a>
                  <div className="packages-divider"></div>
                  <a
                    href={data.commercial.whatsappLink || "#"}
                    className="packages-whatsapp-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="packages-whatsapp-icon-wrapper">
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                    Whatsapp Now
                  </a>
                </div>
              </div>

              <div className="packages-pricing-grid">
                {renderCard(data.commercial.card1)}
                {renderCard(data.commercial.card2)}
                {/* ✅ Full Width, Small Box Common Card - No Bullets */}
                {data.commercial.common && (
                  <div
                    className="packages-pricing-card"
                    style={{
                      gridColumn: "1 / -1",
                      height: "fit-content",
                      minHeight: "0",
                      alignSelf: "start",
                      padding: "1.5rem",
                      display: "block"
                    }}
                  >
                    <h5
                      className="packages-card-title"
                      style={{
                        fontSize: "1rem",
                        marginBottom: "0.5rem",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {data.commercial.common.title}
                    </h5>

                    <ul className="packages-features-list" style={{ marginTop: 0 }}>
                      {renderFeatures(data.commercial.common.features)}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 6. DYNAMIC TABLES SECTION */}
          {data.tables && data.tables.map((table) => (
            <section key={table._id || table.id} className="packages-table-section">
              <div className="packages-table-header">
                <div className="packages-table-label">{table.sectionLabel}</div>
                <h2 className="packages-table-title">{table.title}</h2>
              </div>

              <table className="packages-table">
                <thead>
                  <tr>
                    {table.columns.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rIdx) => {
                    if (row.isSubheader) {
                      return (
                        <tr key={rIdx} className="packages-table-subheader">
                          <td colSpan={table.columns.length}>{row.cells[0]}</td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={rIdx}>
                        {row.cells.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="packages-table-footer">
                <a href={table.externalLink || "https://ecoglow.ae/"} className="packages-book-link" target="_blank" rel="noopener noreferrer">Book Now</a>
                <div className="packages-divider"></div>
                <a
                  href={table.whatsappLink || "#"}
                  className="packages-whatsapp-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="packages-whatsapp-icon-wrapper">
                    <i className="fa-brands fa-whatsapp"></i>
                  </span>
                  Whatsapp Now
                </a>
              </div>
            </section>
          ))}

        </div>
      )}
    </>
  );
};

export default Packages;