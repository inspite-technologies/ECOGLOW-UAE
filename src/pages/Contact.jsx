import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
      easing: "ease-in-out",
      mirror: true,
      anchorPlacement: "top-bottom",
    });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      AOS.refresh();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "General Enquiry",
      message: "",
    });
    setFormStatus("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      setFormStatus("error");
      return;
    }

    // Simulate form submission
    console.log("Form submitted:", formData);
    setFormStatus("success");

    // Reset form after submission
    setTimeout(() => {
      handleReset();
    }, 3000);
  };

  return (
    <>
      {/* Hero Banner Section */}
      <section className="contact-hero-banner">
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <div className="hero-text-wrapper">
            <p className="hero-small-text">Contact</p>
            <h1 className="hero-large-text">EcoGlow</h1>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-container">
          {/* Top Label with Slash - MATCHES BOOKSERVICE */}
          <div className="contact-top-label-wrapper">
            <span className="contact-home-icon"></span>
            <span className="contact-label-separator">/</span>
            <span className="contact-label-text">CONTACT US</span>
          </div>

          {/* Write to us Form */}
          <div className="write-to-us-section">
            <div className="section-header">
              <p className="section-small-title">Contact</p>
              <h2 className="section-main-title">Write to us</h2>
              <div className="title-accent-line"></div>
              <p className="section-subtitle">All fields are mandatory</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form-large">
              <div className="form-row-grid">
                <div className="form-group-large">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input-large"
                    required
                  />
                </div>

                <div className="form-group-large">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input-large"
                    required
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group-large">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input-large"
                    required
                  />
                </div>

                <div className="form-group-large">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-input-wrapper">
                    <div className="country-code">+971</div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input-large phone-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-large full-width">
                <label htmlFor="subject">Enquiry Subject</label>
                <div className="custom-select-wrapper">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select-large"
                    required
                  >
                    <option value="">General Enquiry</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="AC & Duct Cleaning">
                      AC & Duct Cleaning
                    </option>
                    <option value="Carpet Cleaning">Carpet Cleaning</option>
                    <option value="Move In/Out Cleaning">
                      Move In/Out Cleaning
                    </option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group-large full-width">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea-large"
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-reset"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button type="submit" className="btn-submit-teal">
                  Submit
                </button>
              </div>

              {formStatus === "success" && (
                <div className="form-message success">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {formStatus === "error" && (
                <div className="form-message error">
                  Please fill in all required fields.
                </div>
              )}
            </form>
          </div>

          {/* Address & Get in Touch Row */}
          <div
            className="info-row-section"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <div className="address-block">
              <p className="address-text">
                Baghdad Street, Al Nahda 1<br />
                Dubai, P.O Box 123456<br />
                United Arab Emirates
              </p>
            </div>

            <div className="contact-links-block">
              <h3 className="contact-links-title">Get in Touch</h3>
              <div className="contact-link-item">
                <svg
                  className="contact-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="contact-link-text">+971 4 123 4567</span>
              </div>
              <div className="contact-link-item">
                <svg
                  className="contact-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="contact-link-text">info@ecoglow.ae</span>
              </div>
            </div>
          </div>

          {/* Follow Us Section */}
          <div
            className="follow-us-section"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <h3 className="follow-us-title">Follow Us</h3>
            <div className="social-accent-line"></div>
            <div className="social-icons-row">
              <a
                href="#facebook"
                className="social-icon-circle"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#instagram"
                className="social-icon-circle"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#youtube"
                className="social-icon-circle"
                aria-label="YouTube"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Map */}
      <section
        className="map-section-full"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115681.06297469943!2d55.27980585!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="EcoGlow Location"
        ></iframe>
      </section>
    </>
  );
}

export default Contact;