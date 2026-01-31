import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';
import logo from '../assets/eco.png';

const Preloader = ({ loading, onComplete }) => {
  const preloaderRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const brandNameRef = useRef(null);
  const loadingRingRef = useRef(null);

  useEffect(() => {
    let tl = null;

    if (!loading) {
      tl = gsap.timeline({
        onComplete: onComplete
      });

      // 1. Fade out text and ring immediately
      tl.to([brandNameRef.current, loadingRingRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });

      // 2. Get target position (Header Logo)
      const targetLogo = document.querySelector('.header-logo-img');

      if (targetLogo && logoWrapperRef.current) {
        const targetRect = targetLogo.getBoundingClientRect();
        const currentRect = logoWrapperRef.current.getBoundingClientRect();

        // Calculate deltas to match centers
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        const currentCenterX = currentRect.left + currentRect.width / 2;
        const currentCenterY = currentRect.top + currentRect.height / 2;

        const xDiff = targetCenterX - currentCenterX;
        const yDiff = targetCenterY - currentCenterY;

        // Scale: Match heights (approximate)
        const scale = targetRect.height / currentRect.height;

        // Stop CSS animation on the image
        if (logoImgRef.current) {
          gsap.set(logoImgRef.current, { animation: 'none' });
        }

        // Animate Logo Wrapper
        tl.to(logoWrapperRef.current, {
          x: xDiff,
          y: yDiff,
          scale: scale,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          duration: 1.5,
          ease: 'power4.inOut'
        }, "<");

        // Fade out main background
        tl.to(preloaderRef.current, {
          backgroundColor: 'rgba(255,255,255,0)',
          duration: 1.2,
          ease: 'power2.inOut'
        }, "<+=0.2");

      } else {
        // Fallback
        tl.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.5
        });
      }
    }

    // Cleanup function to kill timeline if component unmounts
    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, [loading, onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader-content">
        {/* Logo Container with Animation */}
        <div className="logo-container">
          <div className="logo-wrapper" ref={logoWrapperRef}>
            <img ref={logoImgRef} src={logo} alt="EcoGlow" className="preloader-logo-img" />
          </div>

          {/* Elegant Loading Ring */}
          <div ref={loadingRingRef} className="loading-ring"></div>
        </div>

        {/* Premium Brand Name */}
        <div ref={brandNameRef} className="brand-name">
          <span className="brand-eco">Eco</span>
          <span className="brand-glow">Glow</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;