import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Contact.css';
import Preloader from '../components/Preloader'
import { getContactSettings } from '../services/contactAPI';

// Adjust this URL to match your backend port
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Contact() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  // 1. Fetch Actual Data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getContactSettings();
        if (res.success) {
          const apiData = res.data || {};

          // Robustly handle socialLinks (could be object or stringified JSON)
          if (apiData.socialLinks && typeof apiData.socialLinks === 'string') {
            try {
              apiData.socialLinks = JSON.parse(apiData.socialLinks);
            } catch (e) {
              console.error("Error parsing socialLinks in Contact page:", e);
            }
          }

          setSettings(apiData);
        }
      } catch (error) {
        console.error("Error fetching contact settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Update default subject when settings load
  useEffect(() => {
    if (settings && settings.enquirySubjects && settings.enquirySubjects.length > 0) {
      setFormData(prev => ({
        ...prev,
        subject: settings.enquirySubjects[0].label
      }));
    }
  }, [settings]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
      easing: 'ease-in-out',
      mirror: true,
      anchorPlacement: 'top-bottom'
    });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      AOS.refresh();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'General Enquiry',
      message: ''
    });
    setFormStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic empty check
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      setFormStatus('error_missing');
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('error_email');
      return;
    }

    // 3. Phone validation (Exactly 9 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 9) {
      setFormStatus('error_phone');
      return;
    }

    setFormStatus('sending');

    try {
      const response = await fetch(`${SERVER_URL}/message/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Required newsletter fields
          userEmail: formData.email,
          adminEmail: settings.contactEmail || 'contact@ecoglow.ae',

          // Contact form fields
          name: `${formData.firstName} ${formData.lastName}`,
          phone: `+971${formData.phone}`,
          subject: formData.subject,
          message: formData.message
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('success');
        setTimeout(() => {
          handleReset();
        }, 5000);
      } else {
        setFormStatus('error');
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setFormStatus('error');
    }
  };

  if (!settings && !loading) return null; // Or a simple loading spinner

  // Helper to fix backslashes in image paths from Windows servers
  const bannerUrl = settings?.bannerImage
    ? `${SERVER_URL}/${settings.bannerImage.replace(/\\/g, '/')}`
    : '';

  return (
    <>
      {showPreloader && (
        <Preloader
          loading={loading}
          onComplete={() => setShowPreloader(false)}
        />
      )}

      {settings && (
        <div className="contact-page" style={{ opacity: showPreloader && loading ? 0 : 1 }}>
          {/* Hero Banner Section */}
          <section
            className="contact-hero-banner"
            style={{ backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover' }}
          >
            <div className="hero-banner-overlay"></div>
            <div className="hero-banner-content">
              <div className="hero-text-wrapper">
                <p className="hero-small-text">{settings.heroSubtitle || "Contact"}</p>
                <h1 className="hero-large-text">{settings.heroTitle || "EcoGlow"}</h1>
              </div>
            </div>
          </section>

          {/* Breadcrumbs */}
          <section className="about-intro">
            <div data-aos="fade-up">
              <div className="hero-breadcrumb">
                <span style={{ color: "#14b8a6", display: "flex", gap: "5px" }}>
                  <Home size={16} /> Contact
                </span>
                <span style={{ marginLeft: "6px" }}>/ Contact EcoGlow</span>
              </div>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-container">

              {/* Write to us Form (EXACT SAME STRUCTURE) */}
              <div className="write-to-us-section" data-aos="fade-up" data-aos-duration="1000">
                <div className="section-header">
                  <p className="section-small-title">Contact</p>
                  <h2 className="section-main-title">{settings.formMainTitle}</h2>
                  <div className="title-accent-line"></div>
                  <p className="section-subtitle">All fields are mandatory</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form-large">
                  {formStatus === 'sending' && (
                    <div className="form-message sending">Sending your message...</div>
                  )}

                  {formStatus === 'success' && (
                    <div className="form-message success">✅ Thank you! Your message has been sent successfully. We'll respond soon!</div>
                  )}

                  {formStatus === 'error_missing' && (
                    <div className="form-message error">❌ Please fill in all mandatory fields.</div>
                  )}

                  {formStatus === 'error_email' && (
                    <div className="form-message error">❌ Please enter a valid email address.</div>
                  )}

                  {formStatus === 'error_phone' && (
                    <div className="form-message error">❌ Please enter a valid phone number (7-9 digits).</div>
                  )}

                  {formStatus === 'error' && (
                    <div className="form-message error">❌ Failed to send message. Please try again later.</div>
                  )}

                  <div className="form-row-grid">
                    <div className="form-group-large">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={`form-input-large ${formStatus === 'error_missing' && !formData.firstName ? 'error-field' : ''}`} required />
                    </div>
                    <div className="form-group-large">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={`form-input-large ${formStatus === 'error_missing' && !formData.lastName ? 'error-field' : ''}`} required />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group-large">
                      <label htmlFor="email">Email ID</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`form-input-large ${formStatus === 'error_email' || (formStatus === 'error_missing' && !formData.email) ? 'error-field' : ''}`} required />
                    </div>
                    <div className="form-group-large">
                      <label htmlFor="phone">Phone Number</label>
                      <div className={`phone-input-wrapper ${formStatus === 'error_phone' || (formStatus === 'error_missing' && !formData.phone) ? 'error-field' : ''}`}>
                        <div className="country-code">+971</div>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input-large phone-input" required />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-large full-width">
                    <label htmlFor="subject">Enquiry Subject</label>
                    <div className="custom-select-wrapper">
                      <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="form-select-large" required>
                        {settings.enquirySubjects && settings.enquirySubjects.length > 0 ? (
                          settings.enquirySubjects.map((subject, index) => (
                            <option key={index} value={subject.label}>{subject.label}</option>
                          ))
                        ) : (
                          <>
                            <option value="General Enquiry">General Enquiry</option>
                            <option value="Deep Cleaning">Deep Cleaning</option>
                            <option value="Upholstery cleaning">Upholstery cleaning</option>
                            <option value="Carpet Cleaning">Carpet Cleaning</option>
                            <option value="Move In/Out Cleaning">Move In/Out Cleaning</option>
                          </>
                        )}
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  <div className="form-group-large full-width">
                    <label htmlFor="message">Your Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} className={`form-textarea-large ${formStatus === 'error_missing' && !formData.message ? 'error-field' : ''}`} rows="6" required></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-reset" onClick={handleReset} disabled={formStatus === 'sending'}>Reset</button>
                    <button type="submit" className="btn-submit-teal" disabled={formStatus === 'sending'}>
                      {formStatus === 'sending' ? 'Sending...' : 'Submit'}
                    </button>
                  </div>

                </form>
              </div>

              {/* Address & Get in Touch Row */}
              <div className="info-row-section" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                <div className="address-block">
                  <p className="address-text" style={{ whiteSpace: 'pre-line' }}>
                    {settings.contactInfo?.address}
                  </p>
                </div>

                <div className="contact-links-block">
                  <h3 className="contact-links-title">Get in Touch</h3>
                  <div className="contact-link-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
                    </svg>
                    <a href={`tel:${settings.contactInfo?.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className="contact-link-text">{settings.contactInfo?.phone}</span>
                    </a>
                  </div>
                  <div className="contact-link-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
                    </svg>
                    <a href={`mailto:${settings.contactInfo?.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className="contact-link-text">{settings.contactInfo?.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Follow Us Section */}
              <div className="follow-us-section" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                <h3 className="follow-us-title">Follow Us</h3>
                <div className="social-accent-line"></div>
                <div className="social-icons-row">
                  {settings.socialLinks?.facebook && (
                    <a href={settings.socialLinks.facebook} className="social-icon-circle" aria-label="Facebook" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                  {settings.socialLinks?.instagram && (
                    <a href={settings.socialLinks.instagram} className="social-icon-circle" aria-label="Instagram" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                  {settings.socialLinks?.youtube && (
                    <a href={settings.socialLinks.youtube} className="social-icon-circle" aria-label="YouTube" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                  {settings.socialLinks?.twitter && (
                    <a href={settings.socialLinks.twitter} className="social-icon-circle" aria-label="Twitter" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                  {settings.socialLinks?.linkedin && (
                    <a href={settings.socialLinks.linkedin} className="social-icon-circle" aria-label="LinkedIn" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.141 0 2.064.925 2.064 2.063 0 1.139-.923 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Newsletter Subscription Section */}
              {/* <div className="newsletter-subscription-section" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                <NewsletterForm contactEmail={settings.contactEmail} />
              </div> */}
            </div>
          </section>

          {/* Full Width Map */}
          <section className="map-section-full" data-aos="fade-up" data-aos-duration="1000">
            <iframe
              src={settings.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EcoGlow Location"
            ></iframe>
          </section>
        </div>
      )}
    </>
  );
}

// Newsletter Form Component
const NewsletterForm = ({ contactEmail }) => {
  const [subscriberEmail, setSubscriberEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberEmail) return;

    const adminEmail = contactEmail || "contact@ecoglow.ae";

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
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <h3>Subscribe to our Newsletter</h3>
      <div className="newsletter-input-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={subscriberEmail}
          onChange={(e) => setSubscriberEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={sending}>
          {sending ? "..." : "Subscribe"}
        </button>
      </div>
    </form>
  );
};

export default Contact;