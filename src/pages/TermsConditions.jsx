import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";

import "./TermsConditions.css";

const TermsConditions = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="terms-page">

      {/* Hero Section - Matching Style */}
      <section className="terms-hero">
        <h1 className="hero-title">
          <span className="terms-texts">Terms &</span>
          <br />
          <span className="brand-text">Conditions</span>
        </h1>
      </section>

      {/* Breadcrumb Section */}
      <section className="terms-intro">
        <div className="hero-breadcrumb">
          <span
            style={{
              color: "#14b8a6",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Home size={16} /> Home
          </span>
          <span style={{ color: "black", marginLeft: "6px" }}>
            / Terms & Conditions
          </span>
        </div>

        {/* Terms Content */}
        <div className="terms-content">
          <div className="section-label">Legal</div>
          <h2 className="main-heading">Terms & Conditions</h2>
          <p className="intro-subtitle">
            <span className="highlight-text">Welcome to EcoGlow.</span> Please read these terms carefully
            <br />
            before using our services.
          </p>

          <div className="terms-section">
            <h3 className="terms-heading">1. Agreement to Terms</h3>
            <p className="terms-text">
              By accessing or using EcoGlow Cleaning Services, you agree to be bound by these Terms and 
              Conditions. If you disagree with any part of these terms, you may not access our services. 
              These terms apply to all visitors, users, and others who access or use our services.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">2. Services Description</h3>
            <p className="terms-text">
              EcoGlow provides luxury-standard eco-friendly cleaning services for residential and 
              commercial properties in Dubai, UAE. Our services include but are not limited to:
            </p>
            <ul className="terms-list">
              <li>Regular house cleaning and maintenance</li>
              <li>Deep cleaning services</li>
              <li>Commercial office cleaning</li>
              <li>Specialized eco-friendly treatments</li>
              <li>Move-in/move-out cleaning</li>
            </ul>
            <p className="terms-text">
              We reserve the right to modify, suspend, or discontinue any aspect of our services at any 
              time without prior notice.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">3. Booking and Scheduling</h3>
            <p className="terms-text">
              All service bookings must be made through our official channels (website, phone, or WhatsApp). 
              We require at least 24 hours notice for standard bookings and 48 hours for specialized services. 
              Cancellations must be made at least 24 hours in advance to avoid cancellation fees.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">4. Pricing and Payment</h3>
            <ul className="terms-list">
              <li>All prices are quoted in UAE Dirhams (AED) and are subject to change</li>
              <li>Payment is due upon completion of services unless otherwise agreed</li>
              <li>We accept cash, bank transfer, and major credit cards</li>
              <li>Late payment may result in suspension of future services</li>
              <li>Any additional services requested during a visit will be charged accordingly</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">5. Client Responsibilities</h3>
            <p className="terms-text">
              As a client, you agree to:
            </p>
            <ul className="terms-list">
              <li>Provide safe and clear access to all areas requiring cleaning</li>
              <li>Secure all valuables and fragile items before our arrival</li>
              <li>Inform us of any pets, allergens, or special requirements</li>
              <li>Ensure someone 18+ is present during the service or provide access instructions</li>
              <li>Notify us immediately of any issues or concerns during service</li>
              <li>Provide accurate property information during booking</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">6. Liability and Insurance</h3>
            <p className="terms-text">
              EcoGlow maintains comprehensive insurance coverage for all services provided. However, we 
              are not liable for:
            </p>
            <ul className="terms-list">
              <li>Pre-existing damage to property or items</li>
              <li>Damage to items not disclosed during booking (antiques, delicate surfaces, etc.)</li>
              <li>Loss of unsecured valuables</li>
              <li>Damage caused by pets or third parties during service</li>
              <li>Issues arising from inadequate access or unsafe working conditions</li>
            </ul>
            <p className="terms-text">
              Any claims must be reported within 24 hours of service completion with photographic evidence.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">7. Cancellation and Refund Policy</h3>
            <p className="terms-text">
              <strong>Cancellations by Client:</strong>
            </p>
            <ul className="terms-list">
              <li>24+ hours notice: Full refund or reschedule</li>
              <li>12-24 hours notice: 50% cancellation fee</li>
              <li>Less than 12 hours: Full charge applies</li>
            </ul>
            <p className="terms-text">
              <strong>Cancellations by EcoGlow:</strong> If we cancel for any reason, you will receive 
              a full refund or priority rescheduling at no additional cost.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">8. Quality Guarantee</h3>
            <p className="terms-text">
              We stand behind the quality of our work. If you are not satisfied with any aspect of our 
              service, please notify us within 24 hours and we will return to address the issue at no 
              additional charge. This guarantee applies to the specific areas of concern only.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">9. Environmental Commitment</h3>
            <p className="terms-text">
              All EcoGlow services use eco-friendly, non-toxic, biodegradable cleaning products that are 
              safe for families, pets, and the environment. We are committed to sustainable practices and 
              will advise on the most appropriate products for your specific needs.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">10. Confidentiality</h3>
            <p className="terms-text">
              We respect your privacy. All information about your property, access codes, and personal 
              details are kept strictly confidential. Our staff are trained to maintain professional 
              discretion at all times.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">11. Force Majeure</h3>
            <p className="terms-text">
              EcoGlow shall not be liable for any failure to perform due to circumstances beyond our 
              reasonable control, including but not limited to acts of God, war, terrorism, pandemic, 
              government restrictions, or natural disasters.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">12. Governing Law</h3>
            <p className="terms-text">
              These Terms and Conditions are governed by and construed in accordance with the laws of 
              the United Arab Emirates. Any disputes arising from these terms shall be subject to the 
              exclusive jurisdiction of the courts of Dubai.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">13. Changes to Terms</h3>
            <p className="terms-text">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting to our website. Your continued use of our services after any changes constitutes 
              acceptance of the new terms.
            </p>
          </div>

          <div className="terms-section">
            <h3 className="terms-heading">14. Contact Information</h3>
            <p className="terms-text">
              For questions regarding these Terms and Conditions, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> info@ecoglow.com</p>
              <p><strong>Phone:</strong> +971 XX XXX XXXX</p>
              <p><strong>Address:</strong> Dubai, UAE</p>
              <p><strong>Hours:</strong> Sunday - Thursday, 8:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="last-updated">
            <p><strong>Last Updated:</strong> December 23, 2025</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Matching Your Design */}
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
            <div className="email-form">
              <input 
                type="email" 
                className="email-input" 
                placeholder="Enter your email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button onClick={handleSubmit} className="send-button">Send</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TermsConditions;