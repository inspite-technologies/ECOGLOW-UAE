import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';
import ProtectedAdminRoute from './components/protectedAdminRoutes';
import PublicLayout from './layout/publicLayout';

// Public Pages (can be lazy too if needed)
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/Privacy';
import Packages from './pages/Packages';
import BookService from './pages/BookService';
import TermsConditions from './pages/TermsConditions';
import Commercial from './pages/Commercial';

// Lazy Admin Pages (important optimization)
const AdminDashboard = lazy(() => import('./components/adminDashboard/adminDashboard'));
const AdminLogin = lazy(() => import('./components/adminDashboard/AdminLogin'));

gsap.registerPlugin(ScrollTrigger);

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

            {/* 🌐 PUBLIC ROUTES WITH LAYOUT */}
            <Route element={<PublicLayout />}>
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
            </Route>

          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
