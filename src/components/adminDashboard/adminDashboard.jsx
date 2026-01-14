import React, { useState } from "react";
// 1. Add this import
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PanelTop,
  Briefcase,
  Info,
  MessageSquare,
  LogOut,
  Menu,
  X,
  DollarSign,
  Calendar,
  PanelBottom,
  Users,
  Activity,
  Building2,
  Home as HomeIcon,
} from "lucide-react";
import "./AdminDashboard.css";

import Home from "./Home";
import AboutUsManager from "./AboutUsManager";
import Service from "./Service";
import Commercial from "./CommercialManager";
import PackagesManager from "./PackagesManager";
import FAQManager from "./FAQManager";
import ContactManager from "./contactManager";
import Booking from "./bookingServices";
import Footer from "./FooterManagement";
import Header from "./headerManager"

// 2. Remove 'navigate' from the props here
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 3. Initialize the hook here
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            Eco<span>Glow</span> Admin
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <HomeIcon size={20} /> <span>Home Page Content</span>
          </button>

          <button
            className={`nav-item ${activeTab === "aboutUs" ? "active" : ""}`}
            onClick={() => setActiveTab("aboutUs")}
          >
            <Info size={20} /> <span>About Us</span>
          </button>

          <button
            className={`nav-item ${activeTab === "service" ? "active" : ""}`}
            onClick={() => setActiveTab("service")}
          >
            <Briefcase size={20} /> <span>Residential Page</span>
          </button>
          <button
            className={`nav-item ${activeTab === "commercial" ? "active" : ""}`}
            onClick={() => setActiveTab("commercial")}
          >
            <Building2 size={20} />
            <span>Commercial Page</span>
          </button>

          <button
            className={`nav-item ${activeTab === "packages" ? "active" : ""}`}
            onClick={() => setActiveTab("packages")}
          >
            <DollarSign size={20} /> <span>Packages</span>
          </button>

          <button
            className={`nav-item ${activeTab === "faq" ? "active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <Info size={20} /> <span>FAQs</span>
          </button>
          <button
            className={`nav-item ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            <MessageSquare size={20} /> <span>Contact Settings</span>
          </button>
          <button
            className={`nav-item ${activeTab === "booking" ? "active" : ""}`}
            onClick={() => setActiveTab("booking")}
          >
            <Calendar size={20} /> <span>Booking Settings</span>
          </button>
           <button
            className={`nav-item ${activeTab === "header" ? "active" : ""}`}
            onClick={() => setActiveTab("header")}
          >
           <PanelTop size={20} />
            <span>Header Settings</span>
          </button>
          <button
            className={`nav-item ${activeTab === "footer" ? "active" : ""}`}
            onClick={() => setActiveTab("footer")}
          >
            <PanelBottom size={20} />
            <span>Footer Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> <span>Back to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="btn-secondary mobile-only"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="admin-profile">
            <div className="avatar-circle">A</div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "home" && <Home />}
          {activeTab === "aboutUs" && <AboutUsManager />}
          {activeTab === "service" && <Service />}
          {activeTab === "commercial" && <Commercial />}
          {activeTab === "packages" && <PackagesManager />}
          {activeTab === "faq" && <FAQManager />}
          {activeTab === "contact" && <ContactManager />}
          {activeTab === "booking" && <Booking />}
          {activeTab === 'header' && <Header/>}
          {activeTab === "footer" && <Footer />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
