import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { fetchBookingPage } from "../services/bookingAPI";
import { fetchServices as fetchCommercialServices } from "../services/commercialAPI";
import { fetchServices as fetchResidentialServices } from "../services/serviceAPI";
import "./BookService.css";

function BookService() {
  const [pageData, setPageData] = useState(null);

  // Data State
  const [residentialList, setResidentialList] = useState([]);
  const [commercialList, setCommercialList] = useState([]);

  // Custom Dropdown State (Start Time)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeDropdownRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // --- HELPER: Generate Time Slots (8:00 AM - 5:00 PM, 30 min) ---
  const generateTimeSlots = () => {
    const slots = [];
    let start = 8 * 60; // 8:00 AM in minutes
    const end = 17 * 60; // 5:00 PM in minutes

    while (start <= end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      const minutesStr = minutes === 0 ? '00' : minutes;
      slots.push(`${hours12}:${minutesStr} ${ampm}`);
      start += 30;
    }
    return slots;
  };

  // --- HELPER: Generate Duration Options (2-8 Hours) ---
  const generateDurationOptions = () => Array.from({ length: 8 }, (_, i) => `${i + 2} Hours`);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cleaningFor: "Residential",
    serviceName: "",
    needMaterials: "Yes, I need cleaning materials.",
    bedrooms: "Studio",
    rooms: "Studio",
    date: "",
    timing: "",
    duration: "2 Hours", // Default duration
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");

  // --- CLICK OUTSIDE HANDLER (Closes the custom time dropdown) ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [timeDropdownRef]);

  // Load Data
  useEffect(() => {
    const loadContent = async () => {
      try {
        const bookingRes = await fetchBookingPage();
        setPageData(Array.isArray(bookingRes.data || bookingRes) ? (bookingRes.data || bookingRes)[0] : (bookingRes.data || bookingRes));

        const resRes = await fetchResidentialServices();
        const resData = Array.isArray(resRes.data || resRes) ? (resRes.data || resRes)[0] : (resRes.data || resRes);
        if (resData?.servicesList) setResidentialList(resData.servicesList);

        const comRes = await fetchCommercialServices();
        const comData = Array.isArray(comRes.data || comRes) ? (comRes.data || comRes)[0] : (comRes.data || comRes);
        if (comData?.servicesList) setCommercialList(comData.servicesList);
      } catch (error) { console.error(error); }
    };
    loadContent();
    AOS.init({ duration: 1000 });
  }, []);

  // --- LOGIC: Active List & Card Details ---
  const activeServiceList = formData.cleaningFor === "Residential" ? residentialList : commercialList;

  // Auto-select first option on category change
  useEffect(() => {
    if (activeServiceList.length > 0) {
      const exists = activeServiceList.some(s => s.title === formData.serviceName);
      if (!exists) setFormData(prev => ({ ...prev, serviceName: activeServiceList[0].title }));
    }
  }, [formData.cleaningFor, activeServiceList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Custom Time Handler
  const handleTimeSelect = (timeSlot) => {
    setFormData(prev => ({ ...prev, timing: timeSlot }));
    setShowTimeDropdown(false);
    if (formErrors.timing) setFormErrors(prev => ({ ...prev, timing: "" }));
  };

  const validateForm = () => {
    const errors = {};

    // Name Validation
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    // Email Validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    // Phone Validation (9 Digits)
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Phone must be 9 digits";
    }

    // Date Validation
    if (!formData.date) {
      errors.date = "Select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time
      if (selectedDate < today) errors.date = "Cannot select past dates";
    }

    // Time Validation
    if (!formData.timing) errors.timing = "Please select a start time";

    return errors;
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cleaningFor: "Residential",
      serviceName: "",
      needMaterials: "Yes, I need cleaning materials.",
      bedrooms: "Studio",
      rooms: "Studio",
      date: "",
      timing: "",
      duration: "2 Hours",
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: formData.email,
          adminEmail: pageData.contactEmail || 'bookings@ecoglow.ae',
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
          duration: formData.duration,
          subject: `Service Booking - ${formData.cleaningFor}`,
          message: `
Booking Details:
- Service Type: ${formData.cleaningFor}
- Specific Service: ${formData.serviceName}
- Materials Needed: ${formData.needMaterials}
- Bedrooms: ${formData.bedrooms}
- Duration: ${formData.duration}
- Preferred Date: ${formData.date}
- Start Time: ${formData.timing}
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
  const bgImage = pageData.heroBannerImage ? `${BASE_URL}/${pageData.heroBannerImage.replace(/\\/g, "/").replace(/^\//, "")}` : "";

  return (
    <>
      <section className="bookservice-hero-banner" style={{ backgroundImage: `url("${bgImage}")` }}>
        <div className="bookservice-hero-overlay"></div>
        <div className="bookservice-hero-content">
          <h1 className="bookservice-hero-large-text">{pageData.heroLargeText}</h1>
        </div>
      </section>

      <section className="bookservice-section">
        <div className="bookservice-container">
          <div className="bookservice-form-section">
            {/* Breadcrumb */}
            <div className="bookservice-top-label-wrapper">
              <Link to="/" className="bookservice-home-icon"></Link>
              <span className="bookservice-label-separator">/</span>
              <span className="bookservice-label-text">Book Service</span>
            </div>

            <p className="bookservice-small-label">{pageData.sectionSmallLabel}</p>
            <h2 className="bookservice-main-title">{pageData.sectionMainTitle}</h2>
            <div className="bookservice-accent-line"></div>
            <p className="bookservice-subtitle">{pageData.sectionSubtitle}</p>

            <form onSubmit={handleSubmit} className="bookservice-form">

              {/* Row 1: Name */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.firstName ? 'bookservice-error' : ''}`}
                  />
                  {formErrors.firstName && <span className="bookservice-error-message">{formErrors.firstName}</span>}
                </div>
                <div className="bookservice-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.lastName ? 'bookservice-error' : ''}`}
                  />
                  {formErrors.lastName && <span className="bookservice-error-message">{formErrors.lastName}</span>}
                </div>
              </div>

              {/* Row 2: Contact */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bookservice-input ${formErrors.email ? 'bookservice-error' : ''}`}
                  />
                  {formErrors.email && <span className="bookservice-error-message">{formErrors.email}</span>}
                </div>
                <div className="bookservice-form-group">
                  <label>Phone</label>
                  <div className={`bookservice-phone-wrapper ${formErrors.phone ? 'bookservice-error' : ''}`}>
                    <span className="bookservice-country-code">+971</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bookservice-phone-input"
                      placeholder="50 123 4567"
                    />
                  </div>
                  {formErrors.phone && <span className="bookservice-error-message">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Row 3: Service Selection */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label>Cleaning For?</label>
                  <div className="bookservice-select-wrapper">
                    <select
                      name="cleaningFor"
                      value={formData.cleaningFor}
                      onChange={handleChange}
                      className="bookservice-select bookservice-cleaning-select"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    <span className="bookservice-select-arrow">▼</span>
                  </div>
                </div>
                <div className="bookservice-form-group">
                  <label>Specific Service</label>
                  <div className="bookservice-select-wrapper">
                    <select
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleChange}
                      className="bookservice-select"
                    >
                      {activeServiceList.map((service, idx) => (
                        <option key={idx} value={service.title}>{service.title}</option>
                      ))}
                    </select>
                    <span className="bookservice-select-arrow">▼</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Bedrooms & Date */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label>Bedrooms</label>
                  <div className="bookservice-select-wrapper">
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="bookservice-select"
                      disabled={formData.cleaningFor === "Commercial"}
                    >
                      <option value="Studio">Studio</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 Bedrooms">2 Bedrooms</option>
                      <option value="3 Bedrooms">3 Bedrooms</option>
                      <option value="4 Bedrooms">4 Bedrooms</option>
                      <option value="5 Bedrooms">5 Bedrooms</option>
                      <option value="6 Bedrooms">6 Bedrooms</option>
                    </select>
                    <span className="bookservice-select-arrow">▼</span>
                  </div>
                </div>
                <div className="bookservice-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`bookservice-input ${formErrors.date ? 'bookservice-error' : ''}`}
                  />
                  {formErrors.date && <span className="bookservice-error-message">{formErrors.date}</span>}
                </div>
              </div>

              {/* Row 5: Duration & Custom Time Dropdown */}
              <div className="bookservice-form-row">
                <div className="bookservice-form-group">
                  <label>How many hours?</label>
                  <div className="bookservice-select-wrapper">
                    <select name="duration" value={formData.duration} onChange={handleChange} className="bookservice-select">
                      {generateDurationOptions().map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="bookservice-select-arrow">▼</span>
                  </div>
                </div>

                <div className="bookservice-form-group" ref={timeDropdownRef}>
                  <label>Select Start Time</label>

                  {/* Custom Trigger (needs relative position for the absolute arrow) */}
                  <div
                    className={`bookservice-select custom-dropdown-trigger ${showTimeDropdown ? 'active' : ''} ${formErrors.timing ? 'bookservice-error' : ''}`}
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      position: 'relative' // Added to contain the arrow properly
                    }}
                  >
                    {formData.timing || "-- Select Time --"}
                    <span className="bookservice-select-arrow">▼</span>
                  </div>

                  {/* Custom Scrollable List */}
                  {showTimeDropdown && (
                    <div className="bookservice-custom-dropdown-list">
                      {generateTimeSlots().map((slot, i) => (
                        <div
                          key={i}
                          className="bookservice-custom-option"
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  )}

                  {formErrors.timing && (
                    <span className="bookservice-error-message">
                      {formErrors.timing}
                    </span>
                  )}
                </div>
              </div>

              <div className="bookservice-form-actions">
                <button type="submit" className="bookservice-btn-submit">
                  {formStatus === "sending" ? "Booking..." : "Book Now"}
                </button>
              </div>

              {formStatus === "success" && <div className="bookservice-message bookservice-success">Booking request sent successfully!</div>}
              {formStatus === "error" && <div className="bookservice-message bookservice-error-msg">Please fix the errors highlighted above.</div>}

            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookService;