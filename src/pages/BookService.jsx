import React, { useState, useEffect } from "react";
import AOS from "aos";
import { fetchBookingPage } from "../services/bookingAPI";
import "./BookService.css";

function BookService() {
  // State to hold the dynamic data from the backend
  const [pageData, setPageData] = useState(null);

  // Replace this with your actual backend base URL (e.g., http://localhost:5000)
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cleaningFor: "Residential",
    needMaterials: "Yes, I need cleaning materials.",
    bedrooms: "Studio",
    rooms: "Studio",
    date: "",
    timing: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetchBookingPage();

        // Handling different possible response structures
        // If response is { data: { ... } } or just { ... }
        const rawData = response.data ? response.data : response;

        // If the backend returns an array, pick the first document
        const finalData = Array.isArray(rawData) ? rawData[0] : rawData;

        setPageData(finalData);
      } catch (error) {
        console.error("Error loading booking page content:", error);
      }
    };

    loadContent();

    AOS.init({
      duration: 1000,
      once: false,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Must be 9 digits";
    }

    // Date validation - no past dates
    if (!formData.date) {
      errors.date = "Select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      if (selectedDate < today) {
        errors.date = "Cannot select past dates";
      }
    }

    if (!formData.timing) errors.timing = "Select a time";
    return errors;
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cleaningFor: "Residential",
      needMaterials: "Yes, I need cleaning materials.",
      bedrooms: "Studio",
      rooms: "Studio",
      date: "",
      timing: "",
    });
    setFormErrors({});
    setFormStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    try {
      const response = await fetch(`${BASE_URL}/message/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Required newsletter fields
          userEmail: formData.email,
          adminEmail: pageData.contactEmail || 'bookings@ecoglow.ae',

          // All booking form fields
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: `+971${formData.phone}`,
          cleaningFor: formData.cleaningFor,
          needMaterials: formData.needMaterials,
          bedrooms: formData.bedrooms,
          rooms: formData.rooms,
          date: formData.date,
          timing: formData.timing,

          // Subject and message for email formatting
          subject: `Service Booking - ${formData.cleaningFor}`,
          message: `
Booking Details:
- Service Type: ${formData.cleaningFor}
- Materials Needed: ${formData.needMaterials}
- Bedrooms: ${formData.bedrooms}
- Preferred Date: ${formData.date}
- Preferred Time: ${formData.timing}
          `.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus("success");
        setTimeout(() => handleReset(), 5000);
      } else {
        setFormStatus("error");
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setFormStatus("error");
    }
  };

  if (!pageData) return null;

  // Correcting the image path for CSS background-image
  const backgroundImagePath = pageData.heroBannerImage
    ? `${BASE_URL}/${pageData.heroBannerImage
      .replace(/\\/g, "/")
      .replace(/^\//, "")}`
    : "";

  return (
    <>
      {/* Hero Banner Section */}
      <section
        className="bookservice-hero-banner"
        style={{ backgroundImage: `url("${backgroundImagePath}")` }}
      >
        <div className="bookservice-hero-overlay"></div>
        <div className="bookservice-hero-content">
          <div className="bookservice-hero-text-wrapper">
            <p className="bookservice-hero-small-text">
              {pageData.heroSmallText}
            </p>
            <h1 className="bookservice-hero-large-text">
              {pageData.heroLargeText}
            </h1>
          </div>
        </div>
      </section>

      <section className="bookservice-section" id="book">
        <div className="bookservice-container">
          {/* Top Label */}
          <div className="bookservice-top-label-wrapper">
            <span className="bookservice-home-icon"></span>
            <span className="bookservice-label-separator">/</span>
            <span className="bookservice-label-text">{pageData.topLabel}</span>
          </div>

          <div className="bookservice-form-section">
            <div className="bookservice-section-header">
              <p className="bookservice-small-label">
                {pageData.sectionSmallLabel}
              </p>
              <h2 className="bookservice-main-title">
                {pageData.sectionMainTitle}
              </h2>
              <div className="bookservice-accent-line"></div>
              <p className="bookservice-subtitle">{pageData.sectionSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="bookservice-form">
              {/* Name Row */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.firstName ? "bookservice-error" : ""
                      }`}
                  />
                </div>
                <div className="bookservice-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.lastName ? "bookservice-error" : ""
                      }`}
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bookservice-input"
                  />
                </div>
                <div className="bookservice-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="bookservice-phone-wrapper">
                    <div className="bookservice-country-code">+971</div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bookservice-input bookservice-phone-input"
                      maxLength="9"
                    />
                  </div>
                </div>
              </div>
              <div className="bookservice-form-group">
                <label htmlFor="cleaningFor">Cleaning For?</label>
                <select
                  id="cleaningFor"
                  name="cleaningFor"
                  value={formData.cleaningFor}
                  onChange={handleChange}
                  className="bookservice-select"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Dropdowns Row */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label htmlFor="bedrooms">No. of Bedrooms</label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="bookservice-select"
                  >
                    <option value="Studio">Studio</option>
                    <option value="1 Bedroom">1 Bedroom</option>
                    <option value="2 Bedrooms">2 Bedrooms</option>
                  </select>
                </div>
                <div className="bookservice-form-group">
                  <label htmlFor="date">Select Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`bookservice-input ${formErrors.date ? "bookservice-error" : ""
                      }`}
                  />
                  {formErrors.date && (
                    <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>
                      {formErrors.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Date & Timing Row */}
              <div className="bookservice-form-row bookservice-inline-row">
                <div className="bookservice-form-group timing-col">
                  <label htmlFor="timing">Select Timing</label>
                  <input
                    type="time"
                    id="timing"
                    name="timing"
                    value={formData.timing}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.timing ? "bookservice-error" : ""
                      }`}
                  />
                  {formErrors.timing && (
                    <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>
                      {formErrors.timing}
                    </span>
                  )}
                </div>

                <div className="bookservice-form-actions action-col">
                  <button
                    type="button"
                    className="bookservice-btn-reset"
                    onClick={handleReset}
                    disabled={formStatus === 'sending'}
                  >
                    {pageData.resetButtonText}
                  </button>

                  <button
                    type="submit"
                    className="bookservice-btn-submit"
                    disabled={formStatus === 'sending'}
                    style={{ opacity: formStatus === 'sending' ? 0.7 : 1 }}
                  >
                    {formStatus === 'sending' ? 'Sending...' : pageData.submitButtonText}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {formStatus === 'sending' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  textAlign: 'center'
                }}>
                  Sending your booking request...
                </div>
              )}

              {formStatus === 'success' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  color: '#166534',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  ✅ Thank you! Your booking request has been submitted successfully. We'll contact you shortly!
                </div>
              )}

              {formStatus === 'error' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  textAlign: 'center'
                }}>
                  ❌ {Object.keys(formErrors).length > 0
                    ? 'Please fix the errors above and try again.'
                    : 'Failed to submit booking. Please try again.'}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookService;