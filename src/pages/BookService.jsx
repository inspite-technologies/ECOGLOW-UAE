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
    if (!formData.date) errors.date = "Select a date";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
    setTimeout(() => handleReset(), 3000);
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
                    className={`bookservice-input ${
                      formErrors.firstName ? "bookservice-error" : ""
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
                    className={`bookservice-input ${
                      formErrors.lastName ? "bookservice-error" : ""
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
                    className="bookservice-input"
                  />
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
                    className="bookservice-input"
                  />
                </div>

                <div className="bookservice-form-actions action-col">
                  <button
                    type="button"
                    className="bookservice-btn-reset"
                    onClick={handleReset}
                  >
                    {pageData.resetButtonText}
                  </button>

                  <button type="submit" className="bookservice-btn-submit">
                    {pageData.submitButtonText}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookService;