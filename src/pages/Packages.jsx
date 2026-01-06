import React from "react";
import { Home } from "lucide-react";
import "./Packages.css";

const Packages = () => {
  return (
    <div className="packages-page">
      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      {/* Hero Section */}
      <section className="packages-hero">
        <h1 className="packages-hero-title">
          <span className="packages-hero-small">Premium Service</span>
          <br />
          <span className="packages-hero-large">Packages</span>
        </h1>
      </section>

      {/* Breadcrumb Section */}
      <section className="packages-breadcrumb-section">
        <div className="packages-breadcrumb">
          <span className="packages-breadcrumb-home">
            <Home size={16} />
          </span>
          <span className="packages-breadcrumb-separator">/ </span>
          <span className="packages-breadcrumb-text">PACKAGES</span>
        </div>
      </section>

      {/* Info / Intro Section */}
      <section className="packages-intro-section">
        <div className="packages-intro-label">EcoGlow</div>
        <h2 className="packages-intro-title">Luxury Cleaning Packages</h2>
        <div className="packages-intro-line"></div>
        <p className="packages-intro-desc">
          Experience a new standard of clean — where meticulous attention to detail meets eco-conscious luxury. Our premium packages are designed for discerning homes and offices, offering deep cleaning, specialty services, and the finest eco-friendly products.
          Each service is tailored to your space, ensuring a spotless, serene environment that reflects sophistication and care.
        </p>
      </section>

      {/* Residential Section */}
      <section className="packages-residential">
        <div className="packages-residential-header">
          <div className="packages-residential-title">Residential</div>
          <div className="packages-residential-actions">
            <a href="#" className="packages-book-link">
              Book Now
            </a>
            <div className="packages-divider"></div>
            <a href="#" className="packages-whatsapp-link">
              <span className="packages-whatsapp-icon-wrapper">
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              Whatsapp Now
            </a>
          </div>
        </div>

        <div className="packages-pricing-grid">
          {/* With Materials Card */}
          <div className="packages-pricing-card">
            <h3 className="packages-card-title">With Materials</h3>
            <ul className="packages-features-list">
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Complete cleaning materials will be provided
                  <br />
                  (Karcher Brand).
                </span>
              </li>
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Complete set of rooted regimen - eco friendly products.
                </span>
              </li>
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Includes floor and kitchen steaming.
                </span>
              </li>
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  well trained Filipina staff.
                </span>
              </li>
            </ul>
            <div className="packages-card-footer">
              <div className="packages-price-box">
                <div className="packages-price">65 AED / Hour</div>
              </div>
              <div className="packages-minimum">
                <strong>3hours</strong> Minimum Per Visit.
              </div>
            </div>
          </div>

          {/* Without Materials Card */}
          <div className="packages-pricing-card">
            <h3 className="packages-card-title">Without Materials</h3>
            <ul className="packages-features-list">
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Using products and tools already available in your home
                </span>
              </li>
              
            </ul>
            <div className="packages-card-footer">
              <div className="packages-price-box">
                <div className="packages-price">50 AED / Hour</div>
              </div>
              <div className="packages-minimum">
                <strong>3hours</strong> Minimum Per Visit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Section */}
      <section className="packages-commercial">
        <div className="packages-residential-header">
          <div className="packages-residential-title">Commercial</div>
          <div className="packages-residential-actions">
            <a href="#" className="packages-book-link">
              Book Now
            </a>
            <div className="packages-divider"></div>
            <a href="#" className="packages-whatsapp-link">
              <span className="packages-whatsapp-icon-wrapper">
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              Whatsapp Now
            </a>
          </div>
        </div>

        <div className="packages-pricing-grid">
          {/* With Materials Card */}
          <div className="packages-pricing-card">
            <h3 className="packages-card-title">With Materials</h3>
            <ul className="packages-features-list">
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Complete cleaning materials will be provided (Karcher Brand).
                </span>
              </li>
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Complete set of rooted regimen - eco friendly products.
                </span>
              </li>
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Well trained Filipina staff.
                </span>
              </li>
            </ul>
            <div className="packages-card-footer">
              <div className="packages-price-box">
                <div className="packages-price">70 AED / Hour</div>
              </div>
              <div className="packages-minimum">
                <strong>3hours</strong> Minimum Per Visit.
              </div>
            </div>
          </div>

          {/* Without Materials Card */}
          <div className="packages-pricing-card">
            <h3 className="packages-card-title">Without Materials</h3>
            <ul className="packages-features-list">
              <li className="packages-feature-item">
                <span className="packages-bullet">•</span>
                <span className="packages-feature-text">
                  Using products and tools already available in your home
                </span>
              </li>
            </ul>
            <div className="packages-card-footer">
              <div className="packages-price-box">
                <div className="packages-price">55 AED / Hour</div>
              </div>
              <div className="packages-minimum">
                <strong>3hours</strong> Minimum Per Visit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Cleaning - Interior Section */}
      <section className="packages-table-section">
        <div className="packages-table-header">
          <div className="packages-table-label">EcoGlow</div>
          <h2 className="packages-table-title">Deep Cleaning - Interior</h2>
        </div>

        <table className="packages-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Price</th>
              <th>No. of Staff / Hour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Studio</td>
              <td>335</td>
              <td>2 / 2hours each</td>
            </tr>
            <tr>
              <td>1 Bedroom</td>
              <td>580</td>
              <td>3 / 3hours each or less</td>
            </tr>
            <tr>
              <td>2 Bedroom</td>
              <td>775</td>
              <td>3-4 / 3-4hours each</td>
            </tr>
            <tr>
              <td>3 Bedroom</td>
              <td>1050</td>
              <td>4 / 4-5hours each</td>
            </tr>
            <tr>
              <td>4 Bedroom</td>
              <td>1350</td>
              <td>4-5 / 5-6hours each</td>
            </tr>
            <tr className="packages-table-subheader">
              <td colSpan="3">Villa</td>
            </tr>
            <tr>
              <td>1 Bedroom</td>
              <td>775</td>
              <td>3 / 3hours each or less</td>
            </tr>
            <tr>
              <td>2 Bedroom</td>
              <td>1050</td>
              <td>3 / 3-4hours each</td>
            </tr>
            <tr>
              <td>3 Bedroom</td>
              <td>1350</td>
              <td>4 / 4-5hours each</td>
            </tr>
            <tr>
              <td>4 Bedroom</td>
              <td>1650</td>
              <td>4-5 / 5-6hours each</td>
            </tr>
          </tbody>
        </table>

        <div className="packages-table-footer">
          <a href="#" className="packages-book-link">
            Book Now
          </a>
          <div className="packages-divider"></div>
          <a href="#" className="packages-whatsapp-link">
            <span className="packages-whatsapp-icon-wrapper">
              <i className="fa-brands fa-whatsapp"></i>
            </span>
            Whatsapp Now
          </a>
        </div>
      </section>

      {/* Mattress Section */}
      <section className="packages-table-section">
        <div className="packages-table-header">
          <div className="packages-table-label">EcoGlow</div>
          <h2 className="packages-table-title">Mattress</h2>
        </div>

        <table className="packages-table packages-table-two-col">
          <thead>
            <tr>
              <th>Size</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Baby</td>
              <td>95</td>
            </tr>
            <tr>
              <td>Single</td>
              <td>115</td>
            </tr>
            <tr>
              <td>Queen</td>
              <td>150</td>
            </tr>
            <tr>
              <td>King</td>
              <td>160</td>
            </tr>
            <tr>
              <td>California King</td>
              <td>170</td>
            </tr>
          </tbody>
        </table>

        <div className="packages-table-footer">
          <a href="#" className="packages-book-link">
            Book Now
          </a>
          <div className="packages-divider"></div>
          <a href="#" className="packages-whatsapp-link">
            <span className="packages-whatsapp-icon-wrapper">
              <i className="fa-brands fa-whatsapp"></i>
            </span>
            Whatsapp Now
          </a>
        </div>
      </section>

      {/* Sofa Section */}
      <section className="packages-table-section">
        <div className="packages-table-header">
          <div className="packages-table-label">EcoGlow</div>
          <h2 className="packages-table-title">Sofa</h2>
        </div>

        <table className="packages-table packages-table-two-col">
          <thead>
            <tr>
              <th>Size</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 seater</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2 seater</td>
              <td>160</td>
            </tr>
            <tr>
              <td>3 seater</td>
              <td>195</td>
            </tr>
            <tr>
              <td>4 seater</td>
              <td>235</td>
            </tr>
            <tr>
              <td>5 seater</td>
              <td>255</td>
            </tr>
            <tr>
              <td>7 seater</td>
              <td>275</td>
            </tr>
            <tr className="packages-table-subheader">
              <td colSpan="2">L-Shaped</td>
            </tr>
            <tr>
              <td>3 seater</td>
              <td>225</td>
            </tr>
            <tr>
              <td>4 seater</td>
              <td>235</td>
            </tr>
            <tr>
              <td>5 seater</td>
              <td>255</td>
            </tr>
          </tbody>
        </table>

        <div className="packages-table-footer">
          <a href="#" className="packages-book-link">
            Book Now
          </a>
          <div className="packages-divider"></div>
          <a href="#" className="packages-whatsapp-link">
            <span className="packages-whatsapp-icon-wrapper">
              <i className="fa-brands fa-whatsapp"></i>
            </span>
            Whatsapp Now
          </a>
        </div>
      </section>

      {/* Carpet Section - CORRECTED */}
      <section className="packages-table-section">
        <div className="packages-table-header">
          <div className="packages-table-label">EcoGlow</div>
          <h2 className="packages-table-title">Carpet</h2>
        </div>

        <table className="packages-table packages-table-two-col">
          <thead>
            <tr>
              <th>Size</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Small</td>
              <td>175</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td>195</td>
            </tr>
            <tr>
              <td>Large (up to 25 sq. ft)</td>
              <td>315</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>415</td>
            </tr>
            {/* CORRECTED: Last row with 2 separate columns instead of 2 separate rows */}
            <tr>
              <td>More than – fully carpeted</td>
              <td>Inspection - charge 10-15/sqm</td>
            </tr>
          </tbody>
        </table>

        <div className="packages-table-footer">
          <a href="#" className="packages-book-link">
            Book Now
          </a>
          <div className="packages-divider"></div>
          <a href="#" className="packages-whatsapp-link">
            <span className="packages-whatsapp-icon-wrapper">
              <i className="fa-brands fa-whatsapp"></i>
            </span>
            Whatsapp Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Packages;