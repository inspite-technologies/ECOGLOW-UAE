import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// 1. Regular Imports (Public)
import PageHeader from './components/PageHeader';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Packages from './pages/Packages';
import BookService from './pages/BookService';
import TermsConditions from './pages/TermsConditions';
import ProtectedAdminRoute from './components/protectedAdminRoutes';

// 2. LAZY IMPORTS (Admin) - This is the secret fix. 
// This prevents Admin CSS from loading on the Home page.
const AdminDashboard = lazy(() => import('./components/adminDashboard/adminDashboard'));
const AdminLogin = lazy(() => import('./components/adminDashboard/AdminLogin'));

gsap.registerPlugin(ScrollTrigger);

// Layout for Public Pages
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <>
      {!isHomePage && <PageHeader />}
      {children}
      <Footer />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      ScrollTrigger.refresh();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading && <Preloader />}

      <div className={loading ? 'app-content hidden' : 'app-content visible'}>
        <ScrollToTop />
        
        {/* Suspense is required for Lazy Loading */}
        <Suspense fallback={<Preloader />}>
          <Routes>
            {/* 🔐 ADMIN ROUTES - CSS only loads when these are visited */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />

            {/* 🌐 PUBLIC PAGES */}
            <Route 
              path="/*" 
              element={
                <PublicLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/book-service" element={<BookService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                  </Routes>
                </PublicLayout>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;