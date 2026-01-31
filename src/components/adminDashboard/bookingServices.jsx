import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Layout, Info, Calendar,
  ImageIcon, Loader2, AtSign, Plus, Trash2, Home
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
    contactEmail: "",
    cleaningForOptions: [],
    bedroomOptions: []
  });

  const fileRef = useRef(null);

  // Helper to resolve image paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
  };

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchBookingPage();
        let data = response.data || (Array.isArray(response) ? response[0] : response);

        if (data) {
          setFormData({
            heroSmallText: data.heroSmallText || "",
            heroLargeText: data.heroLargeText || "",
            heroBannerImage: data.heroBannerImage || null,
            topLabel: data.topLabel || "",
            sectionSmallLabel: data.sectionSmallLabel || "",
            sectionMainTitle: data.sectionMainTitle || "",
            sectionSubtitle: data.sectionSubtitle || "",
            contactEmail: data.contactEmail || "",
            cleaningForOptions: data.cleaningForOptions || ["Residential", "Commercial"],
            bedroomOptions: data.bedroomOptions || ["Studio", "1 Bedroom", "2 Bedrooms"]
          });
        }
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Dynamic Option Logic ---
  const handleAddOption = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], "New Option"] }));
  };

  const handleUpdateOption = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleRemoveOption = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, heroBannerImage: URL.createObjectURL(file) }));
      setBannerFile(file);
    }
  };

  // Save Data
  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    // Text fields
    data.append("heroSmallText", formData.heroSmallText);
    data.append("heroLargeText", formData.heroLargeText);
    data.append("topLabel", formData.topLabel);
    data.append("sectionMainTitle", formData.sectionMainTitle);
    data.append("sectionSubtitle", formData.sectionSubtitle);
    data.append("contactEmail", formData.contactEmail);

    // Arrays (stringify for backend parsing)
    data.append("cleaningForOptions", JSON.stringify(formData.cleaningForOptions));
    data.append("bedroomOptions", JSON.stringify(formData.bedroomOptions));

    if (bannerFile) {
      data.append("heroBannerImage", bannerFile);
    } else {
      data.append("existingImagePath", formData.heroBannerImage || "");
    }

    try {
      await updateBookingPage(data);
      setMessage("✅ Booking page updated successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '40px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    publishBtn: { backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '25px' },
    card: { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', marginBottom: '15px', outline: 'none', transition: 'border 0.2s' },
    optionRow: { display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' },
    addBtn: { width: '100%', padding: '12px', border: '2px dashed #99f6e4', borderRadius: '10px', background: '#f0fdfa', color: '#0f766e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', marginTop: '10px' },
    miniHero: { height: '180px', borderRadius: '15px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden' },
    overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' },
    uploadBox: { border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', borderRadius: '15px', cursor: 'pointer', background: '#f8fafc', color: '#475569', transition: '0.3s' },
    toast: { background: '#f0fdf4', color: '#166534', padding: '15px 25px', borderRadius: '12px', marginBottom: '25px', borderLeft: '6px solid #22c55e', fontWeight: '500' }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#134e4a' }}>Service Booking Admin</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Control form fields, dropdown options, and visuals.</p>
        </div>
        <button 
          style={styles.publishBtn} 
          onClick={handlePublish} 
          disabled={loading}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0f766e'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0d9488'}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? " Processing..." : " Publish Changes"}
        </button>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      <div style={styles.grid}>
        
        {/* COLUMN 1: TEXT CONTENT */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Layout size={20} color="#0d9488" />
            <h3 style={{ margin: 0 }}>Content & Contact</h3>
          </div>

          <label style={styles.label}>Hero Subtitle</label>
          <input name="heroSmallText" style={styles.input} value={formData.heroSmallText} onChange={handleChange} placeholder="e.g. Best Cleaning Services" />
          
          <label style={styles.label}>Hero Main Title</label>
          <input name="heroLargeText" style={styles.input} value={formData.heroLargeText} onChange={handleChange} placeholder="e.g. Book Your Sparkle" />

          <div style={{ height: '20px' }} />

          <label style={styles.label}>Section Form Title</label>
          <input name="sectionMainTitle" style={styles.input} value={formData.sectionMainTitle} onChange={handleChange} />

          <label style={styles.label}>Section Subtitle</label>
          <textarea 
            name="sectionSubtitle" 
            style={{ ...styles.input, height: '100px', resize: 'none' }} 
            value={formData.sectionSubtitle} 
            onChange={handleChange} 
          />

          <label style={styles.label}>Admin Notification Email</label>
          <div style={{ position: 'relative' }}>
            <AtSign size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
            <input 
              name="contactEmail" 
              style={{ ...styles.input, paddingLeft: '40px' }} 
              value={formData.contactEmail} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* COLUMN 2: DYNAMIC DROPDOWNS */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Info size={20} color="#0d9488" />
            <h3 style={{ margin: 0 }}>Form Dropdowns</h3>
          </div>

          {/* Cleaning For Section */}
          <label style={styles.label}>Cleaning Types (Cleaning For?)</label>
          {formData.cleaningForOptions.map((opt, i) => (
            <div key={`clean-${i}`} style={styles.optionRow}>
              <input 
                style={{ ...styles.input, marginBottom: 0 }} 
                value={opt} 
                onChange={(e) => handleUpdateOption('cleaningForOptions', i, e.target.value)} 
              />
              <button 
                onClick={() => handleRemoveOption('cleaningForOptions', i)} 
                style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => handleAddOption('cleaningForOptions')}>
            <Plus size={18} /> Add Category
          </button>

          <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #f1f5f9' }} />

          {/* Bedrooms Section */}
          <label style={styles.label}>Bedroom Options</label>
          {formData.bedroomOptions.map((opt, i) => (
            <div key={`bed-${i}`} style={styles.optionRow}>
              <input 
                style={{ ...styles.input, marginBottom: 0 }} 
                value={opt} 
                onChange={(e) => handleUpdateOption('bedroomOptions', i, e.target.value)} 
              />
              <button 
                onClick={() => handleRemoveOption('bedroomOptions', i)} 
                style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => handleAddOption('bedroomOptions')}>
            <Plus size={18} /> Add Room Type
          </button>
        </div>

        {/* COLUMN 3: PREVIEW & IMAGE */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Calendar size={20} color="#0d9488" />
            <h3 style={{ margin: 0 }}>Banner Preview</h3>
          </div>

          <div 
            style={{ 
              ...styles.miniHero, 
              backgroundImage: `url(${getImageUrl(formData.heroBannerImage)})` 
            }}
          >
            <div style={styles.overlay} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{formData.heroSmallText}</span>
              <h4 style={{ margin: '5px 0 0', fontSize: '1.4rem' }}>{formData.heroLargeText}</h4>
            </div>
          </div>

          <div style={{ marginTop: '25px' }}>
            <p style={styles.label}>Replace Header Image</p>
            <label style={{ cursor: 'pointer' }}>
              <input type="file" ref={fileRef} onChange={handleImageUpload} hidden accept="image/*" />
              <div 
                style={styles.uploadBox} 
                onClick={() => fileRef.current.click()}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#0d9488'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <ImageIcon size={30} style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 'bold' }}>Click to Upload</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>JPG, WEBP or PNG (Recommended: 1920x600)</div>
              </div>
            </label>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#0d9488' }}>
              <Home size={18} />
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Form Page Label</span>
            </div>
            <input 
              name="topLabel" 
              style={{ ...styles.input, marginTop: '10px', fontWeight: 'bold' }} 
              value={formData.topLabel} 
              onChange={handleChange} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookServiceAdmin;