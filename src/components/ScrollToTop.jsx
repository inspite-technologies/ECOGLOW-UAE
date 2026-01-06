// Create a new file: src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' to avoid smooth scroll delay
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;