import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Layout, Info, Calendar,
  ImageIcon, Loader2, AtSign
} from 'lucide-react';
import { fetchBookingPage, updateBookingPage } from '../../services/bookingAPI';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookServiceAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    heroSmallText: "",
    heroLargeText: "",
    heroBannerImage: null,
    topLabel: "",
    sectionSmallLabel: "",
    sectionMainTitle: "",
    sectionSubtitle: "",
    contactEmail: ""
  });

  const fileRef = useRef(null);

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath; // Local preview
    if (imagePath.startsWith("http")) return imagePath; // Full URL
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchBookingPage();
        let data = response;

        // Handle nested data structures if applicable
        if (data.data) data = data.data;
        if (Array.isArray(data)) data = data[0];

        if (data) {
          setFormData({
            heroSmallText: data.heroSmallText || "",
            heroLargeText: data.heroLargeText || "",
            heroBannerImage: data.heroBannerImage || null,
            topLabel: data.topLabel || "",
            sectionSmallLabel: data.sectionSmallLabel || "",
            sectionMainTitle: data.sectionMainTitle || "",
            sectionSubtitle: data.sectionSubtitle || "",
            contactEmail: data.contactEmail || ""
          });
        }
      } catch (err) {
        console.error("❌ Error loading booking data:", err);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview
      setFormData(prev => ({ ...prev, heroBannerImage: URL.createObjectURL(file) }));
      setBannerFile(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    // 1. Append all text fields
    data.append("heroSmallText", formData.heroSmallText);
    data.append("heroLargeText", formData.heroLargeText);
    data.append("topLabel", formData.topLabel);
    data.append("sectionMainTitle", formData.sectionMainTitle);
    data.append("sectionSubtitle", formData.sectionSubtitle);
    data.append("contactEmail", formData.contactEmail);

    // 2. Handle the Image logic carefully
    if (bannerFile) {
      // If there is a NEW file, append it to the key multer is watching
      data.append("heroBannerImage", bannerFile);
    } else {
      // If NO new file, send the current path as a regular text field
      // Your backend controller should check for this if heroBannerImage is undefined
      data.append("existingImagePath", formData.heroBannerImage || "");
    }

    try {
      await updateBookingPage(data);
      setMessage("✅ Booking page updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Server Error (500). Check Backend Console.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    publishBtn: { backgroundColor: '#14b8a6', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    grid: { display: 'flex', gap: '30px', flexDirection: 'row' },
    card: { flex: 1, background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' },
    label: { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '15px' },
    miniHero: { height: '160px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', marginTop: '10px' },
    uploadBox: { border: '2px dashed #e2e8f0', padding: '20px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: '#f8fafc', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    toast: { background: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #22c55e' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f766e' }}>Booking Manager</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Live control over the service booking page appearance.</p>
        </div>
        <button style={styles.publishBtn} onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? " Saving..." : " Save & Publish"}
        </button>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Layout size={18} color="#14b8a6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>1. Hero Content</h3>
          </div>

          <label style={styles.label}>Hero Titles (Top / Bottom)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="heroSmallText" style={styles.input} value={formData.heroSmallText} onChange={handleChange} />
            <input name="heroLargeText" style={styles.input} value={formData.heroLargeText} onChange={handleChange} />
          </div>

          <div style={{ ...styles.sectionHeader, marginTop: '20px' }}>
            <Info size={18} color="#14b8a6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>2. Form Labels</h3>
          </div>

          <label style={styles.label}>Accent Label</label>
          <input name="topLabel" style={{ ...styles.input, color: '#14b8a6', fontWeight: 'bold' }} value={formData.topLabel} onChange={handleChange} />

          <label style={styles.label}>Main Title</label>
          <input name="sectionMainTitle" style={styles.input} value={formData.sectionMainTitle} onChange={handleChange} />

          <label style={styles.label}>Subtitle</label>
          <input name="sectionSubtitle" style={styles.input} value={formData.sectionSubtitle} onChange={handleChange} />

          <label style={styles.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AtSign size={14} /> Contact Email (Receives Form Submissions)
            </div>
          </label>
          <input
            type="email"
            name="contactEmail"
            style={styles.input}
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="bookings@ecoglow.ae"
          />
        </div>

        <div style={{ ...styles.card, flex: '0.7' }}>
          <div style={styles.sectionHeader}>
            <Calendar size={18} color="#14b8a6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Banner Preview</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={styles.label}>Live Header Preview</p>
            <div
              style={{
                ...styles.miniHero,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${getImageUrl(formData.heroBannerImage)})`
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{formData.heroSmallText}</span>
              <h4 style={{ margin: 0, fontSize: '1.5rem' }}>{formData.heroLargeText}</h4>
            </div>
          </div>

          <label style={{ cursor: 'pointer' }}>
            <input type="file" ref={fileRef} onChange={handleImageUpload} hidden accept="image/*" />
            <div style={styles.uploadBox} onClick={() => fileRef.current.click()}>
              <ImageIcon size={24} />
              <span style={{ fontWeight: '600' }}>Change Banner Image</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BookServiceAdmin;