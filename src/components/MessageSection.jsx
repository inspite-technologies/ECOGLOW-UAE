import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MessageSection.css';
import mdPhotoFallback from '../assets/A11.webp';

gsap.registerPlugin(ScrollTrigger);

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath, fallback = mdPhotoFallback) => {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
  return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
};

function MessageSection({ data }) {
  const sectionRef = useRef(null);
  const messageContentRef = useRef(null);
  const messageImageRef = useRef(null);
  const dividerRef = useRef(null);
  const connectTextRef = useRef(null);
  const newsletterFormRef = useRef(null);

  // --- STATE FOR INPUT ---
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [sending, setSending] = useState(false);

  // Handle array vs object structure
  const content = Array.isArray(data) ? data[0] : data;

  // Debug logging
  console.log("🔍 MessageSection - Raw data prop:", data);
  console.log("🔍 MessageSection - Processed content:", content);

  // --- HANDLE SUBMIT (CONNECTS TO NODEMAILER) ---
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!subscriberEmail) return;

    // 1. Get the admin email from your database (Admin Dashboard)
    const adminEmail = content?.contactEmail || "developer.inspitetech@gmail.com";

    // Debug logging
    console.log("📧 Newsletter Submission:");
    console.log("  - contactEmail from DB:", content?.contactEmail);
    console.log("  - adminEmail being used:", adminEmail);
    console.log("  - subscriberEmail:", subscriberEmail);

    try {
      setSending(true);

      // 2. Send Data to Backend
      // Ensure this matches your route structure (e.g. /api/message/send-newsletter)
      const response = await fetch(`${SERVER_URL}/message/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: subscriberEmail, // The user's input
          adminEmail: adminEmail      // The email saved in your DB
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Subscribed successfully! Please check your email.");
        setSubscriberEmail(""); // Clear input
      } else {
        alert("❌ Failed to subscribe. Please try again.");
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ Error connecting to server.");
    } finally {
      setSending(false);
    }
  };

  // --- ANIMATIONS ---
  useEffect(() => {
    if (!content) return;

    let ctx = gsap.context(() => {
      const anims = [
        { ref: messageContentRef, x: -50 },
        { ref: messageImageRef, x: 50, delay: 0.1 },
        { ref: connectTextRef, x: -50 },
        { ref: newsletterFormRef, x: 50, delay: 0.1 }
      ];

      anims.forEach(anim => {
        if (anim.ref.current) {
          gsap.fromTo(anim.ref.current,
            { opacity: 0, x: anim.x },
            {
              opacity: 1, x: 0, duration: 1, delay: anim.delay || 0,
              scrollTrigger: {
                trigger: anim.ref.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1, scaleX: 1, duration: 0.8,
            scrollTrigger: { trigger: dividerRef.current, start: 'top 90%' }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  const renderConnectTitle = (title) => {
    if (!title) return <span>LET'S <span className="teal-text-thin">CONNECT</span></span>;
    const parts = title.split(' ');
    if (parts.length >= 2) {
      return <>{parts.slice(0, -1).join(' ')} <span className="teal-text-thin">{parts[parts.length - 1]}</span></>;
    }
    return title;
  };

  if (!content) return null;

  return (
    <section className="unified-footer-section" id="message" ref={sectionRef}>
      {/* MD'S MESSAGE SECTION */}
      <div className="message-container">
        <div className="message-content" ref={messageContentRef}>
          <h2 className="section-heading-thin">{content.mdTitle}</h2>
          <div className="thin-teal-underline"></div>

          <div className="message-text">
            {content.mdMessage?.split('\n').map((line, i) => (
              line.trim() !== "" ? <p key={i}>{line}</p> : <br key={i} />
            ))}
          </div>

          <div className="signature-area">
            {content.gratitudeText && (
              <p className="gratitude-text" style={{ marginBottom: '5px', fontStyle: 'italic', fontWeight: 500 }}>
                {content.gratitudeText}
              </p>
            )}

            <span className="md-name-label">{content.mdName}</span>

            {content.mdSignature && (
              <img
                src={getImageUrl(content.mdSignature, null)}
                alt="MD Signature"
                className="md-signature-img"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="message-image" ref={messageImageRef}>
          <img
            src={getImageUrl(content.mdPhoto)}
            alt="Managing Director"
            className="md-profile-img"
            loading="lazy"
          />
        </div>
      </div>

      <div className="section-divider" ref={dividerRef}></div>

      {/* LET'S CONNECT SECTION */}
      <div className="connect-container">
        <div className="connect-text" ref={connectTextRef}>
          <h2 className="section-heading-thin">
            {renderConnectTitle(content.connectTitle)}
          </h2>
          <p className="connect-subtitle">{content.connectSubtitle}</p>
        </div>

        <div className="newsletter-form-container" ref={newsletterFormRef}>
          <span className="newsletter-label">You will get monthly newsletter</span>

          {/* NEWSLETTER FORM (Connects to Backend) */}
          <form className="input-group-newsletter" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email ID"
              className="newsletter-input"
              required
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
            />
            <button
              type="submit"
              className="newsletter-send-btn"
              disabled={sending}
              style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}

export default MessageSection;