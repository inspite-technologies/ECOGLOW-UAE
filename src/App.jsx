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
import PrivacyPolicy from './pages/Privacy';
import Packages from './pages/Packages';
import BookService from './pages/BookService';
import TermsConditions from './pages/TermsConditions';
import ProtectedAdminRoute from './components/protectedAdminRoutes';
import Commercial from './pages/Commercial';

// 2. LAZY IMPORTS (Admin)
const AdminDashboard = lazy(() => import('./components/adminDashboard/adminDashboard'));
const AdminLogin = lazy(() => import('./components/adminDashboard/AdminLogin'));

gsap.registerPlugin(ScrollTrigger);

// --- PUBLIC LAYOUT ---
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
      {loading && <Preloader loading={loading} />}

      <div className={loading ? 'app-content hidden' : 'app-content visible'}>
        <ScrollToTop />

        <Suspense fallback={<Preloader />}>
          <Routes>
            {/* 🔐 ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* 🌐 PUBLIC ROUTES */}
            <Route
              path="/*"
              element={
                <PublicLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/commercial" element={<Commercial />} />
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
