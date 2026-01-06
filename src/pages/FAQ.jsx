import React, { useEffect, useState } from "react";
import { Home, Plus, Minus } from "lucide-react";

import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Why is it called an estimate?",
      answer:
        "An estimate is not a guaranteed final price. The estimate provides you with an approximate idea of how much our service costs. During their visit our housekeepers will spend the amount of time specified in the estimate by performing the level of service you selected. The actual final price will not be known until after the housekeeper completes the job. To accurately quote a price, a housekeeper would need to see the home first. However, we know how valuable your time is and we didn't want to add another appointment for you. Most people prefer to receive an estimate over the phone and then simply have the housekeeper start their very first visit. Pricing shown does not include state sales tax (where applicable) or gratuity for your housekeeper.",
    },
    {
      question: "Why is it called an estimate?",
      answer:
        "An estimate is not a guaranteed final price. The estimate provides you with an approximate idea of how much our service costs. During their visit our housekeepers will spend the amount of time specified in the estimate by performing the level of service you selected.",
    },
    {
      question: "What areas does ExcelClean serve?",
      answer:
        "ExcelClean serves the greater metropolitan area and surrounding regions. Please contact us to confirm service availability in your specific location.",
    },
    {
      question: "How long does an estimate last?",
      answer:
        "Our estimates are typically valid for 30 days from the date of issue. Prices may be subject to change after this period due to market conditions.",
    },
    {
      question: "How does ExcelClean verify and hire its cleaners?",
      answer:
        "All our cleaners undergo thorough background checks, verification of references, and comprehensive training before joining our team.",
    },
    {
      question: "What if I'm not satisfied with the cleaning service?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with our service, please contact us within 24 hours and we'll make it right.",
    },
    {
      question: "What is RealPrice Guarantee policy?",
      answer:
        "Our RealPrice Guarantee ensures that the final price matches your estimate, provided the job specifications remain unchanged.",
    },
    {
      question: "What payment options do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods for your convenience.",
    },
    {
      question:
        "What is the difference between standard cleaning and deep cleaning?",
      answer:
        "Standard cleaning covers regular maintenance tasks, while deep cleaning includes more intensive work like baseboards, inside appliances, and hard-to-reach areas.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">

      {/* Hero Section - UPDATED CLASS NAMES */}
      <section className="faq-hero">
        <h1 className="faq-hero-title">
          <span className="faq-hero-small">EcoGlow</span>
          <br />
          <span className="faq-hero-large">FAQs</span>
        </h1>
      </section>

      {/* Breadcrumb Section - UPDATED CLASS NAMES */}
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
            <div className="section-labels">FAQs</div>
            <h4 className="titles">Before you choose a Cleaning Service</h4>
            <div className="title-underline"></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {faqs.map((faq, index) => (
                <div
                  key={index}
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