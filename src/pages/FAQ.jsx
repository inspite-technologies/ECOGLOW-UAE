import React, { useEffect, useState } from "react";
import { Home, Plus, Minus } from "lucide-react";
import { fetchFAQs } from "../services/faqAPI";
import "./FAQ.css";

// Helper to construct image URL
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('blob:') || path.startsWith('http')) return path;
  // Replace Windows backslashes with forward slashes and prepend server URL
  return `${SERVER_URL}/${path.replace(/\\/g, '/')}`;
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchFAQs();
        // Handle if response is wrapped in { data: ... } or is the array directly
        const result = response.data || response;
        
        // The API likely returns an array (or a single object). 
        // Based on your previous patterns, we take the first item if it's an array.
        const data = Array.isArray(result) ? result[0] : result;
        
        setFaqData(data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Loading FAQs...</div>;
  if (!faqData) return null;

  return (
    <div className="faq-page">

      {/* Hero Section - UPDATED WITH DYNAMIC DATA & IMAGE */}
      <section 
        className="faq-hero"
        style={{
            backgroundImage: faqData.heroBannerImg ? `url(${getImageUrl(faqData.heroBannerImg)})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
      >
        <h1 className="faq-hero-title">
          <span className="faq-hero-small">{faqData.heroSmall || "EcoGlow"}</span>
          <br />
          <span className="faq-hero-large">{faqData.heroLarge || "FAQs"}</span>
        </h1>
      </section>

      {/* Breadcrumb Section */}
      <section className="faq-breadcrumb-section" style={{ paddingBottom: "10px" }}>
        <div className="faq-breadcrumb" style={{ marginTop: "20px" }}>
          <span
            style={{
              color: "#14b8a6",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Home size={16} />
          </span>
          <span style={{ color: "black", marginLeft: "6px" }}>/ FAQs</span>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="container">
          <div className="content">
            {/* Dynamic Label */}
            <div className="section-labels">{faqData.sectionLabel || "FAQs"}</div>
            {/* Dynamic Title */}
            <h4 className="titles">{faqData.sectionTitle || "Frequently Asked Questions"}</h4>
            <div className="title-underline"></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* Dynamic FAQ List Loop */}
              {faqData.faqs && faqData.faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "white",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: "100%",
                      padding: "24px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        color: "#333",
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "1.5",
                        paddingRight: "20px",
                      }}
                    >
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <Minus size={20} color="#7dd3c0" />
                    ) : (
                      <Plus size={20} color="#555" />
                    )}
                  </button>

                  <div
                    style={{
                      maxHeight: openIndex === index ? "500px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease-in-out",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 0 24px 0",
                        color: "#666",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        maxWidth: "95%",
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FAQ;