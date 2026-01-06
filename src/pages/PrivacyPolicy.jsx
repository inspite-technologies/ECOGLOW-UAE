import React, { useEffect, useState } from "react";
import { Home } from "lucide-react";

import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
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
    <div className="privacy-page">

      {/* Hero Section - Matching Style */}
      <section className="privacy-hero">
        <h1 className="hero-title">
          <span className="privacy-text">Privacy</span>
          <br />
          <span className="brand-text">Policy</span>
        </h1>
      </section>

      {/* Breadcrumb Section */}
      <section className="privacy-intro">
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
            / Privacy Policy
          </span>
        </div>

        {/* Privacy Content */}
        <div className="privacy-content">
          <div className="section-label">Legal</div>
          <h2 className="main-heading">Privacy Policy</h2>
          <p className="intro-subtitle">
            <span className="highlight-text">Your privacy matters</span> to us at EcoGlow.
            <br />
            We are committed to protecting your personal information.
          </p>

          <div className="policy-section">
            <h3 className="policy-heading">1. Information We Collect</h3>
            <p className="policy-text">
              We collect information that you provide directly to us when you book our services, 
              subscribe to our newsletter, or contact us. This may include your name, email address, 
              phone number, physical address, and payment information.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">2. How We Use Your Information</h3>
            <p className="policy-text">
              We use the information we collect to:
            </p>
            <ul className="policy-list">
              <li>Provide, maintain, and improve our cleaning services</li>
              <li>Process your bookings and payments</li>
              <li>Send you service updates and promotional communications</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">3. Information Sharing</h3>
            <p className="policy-text">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only with trusted service providers who assist us in operating our business, 
              conducting our services, or serving you, as long as those parties agree to keep this 
              information confidential.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">4. Data Security</h3>
            <p className="policy-text">
              We implement appropriate security measures to protect your personal information from 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">5. Cookies and Tracking</h3>
            <p className="policy-text">
              Our website may use cookies to enhance your experience. You can choose to disable cookies 
              through your browser settings, though this may affect your ability to use certain features 
              of our website.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">6. Your Rights</h3>
            <p className="policy-text">
              You have the right to:
            </p>
            <ul className="policy-list">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">7. Children's Privacy</h3>
            <p className="policy-text">
              Our services are not directed to children under 18, and we do not knowingly collect 
              personal information from children. If we learn that we have collected personal information 
              from a child, we will delete it promptly.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">8. Changes to This Policy</h3>
            <p className="policy-text">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date below.
            </p>
          </div>

          <div className="policy-section">
            <h3 className="policy-heading">9. Contact Us</h3>
            <p className="policy-text">
              If you have any questions about this Privacy Policy or our practices, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@ecoglow.com</p>
              <p><strong>Phone:</strong> +971 XX XXX XXXX</p>
              <p><strong>Address:</strong> Dubai, UAE</p>
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

export default PrivacyPolicy;