import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Layout, Info, Mail, Phone, MapPin,
  ImageIcon, Loader2, X, Globe, MessageSquare, AtSign, Plus
} from 'lucide-react';
import { getContactSettings, upsertContactSettings } from '../../services/contactAPI';

// Ensure this matches your backend URL
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ContactAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);

  const [data, setData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    bannerImage: null,
    formLabel: "CONTACT US",
    formMainTitle: "Write to us",
    address: "",
    phone: "",
    email: "",
    mapEmbedUrl: "",
    contactEmail: "",
    enquirySubjects: [],
    // ✅ Social Links
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: ""
  });

  const fileRef = useRef(null);

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- 1. FETCH DATA ON LOAD ---
  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getContactSettings();
        if (res.success && res.data) {
          const apiData = res.data;

          // ---------------------------------------------------------
          // 🛠️ FIX: Manually parse socialLinks if it arrives as a string
          // ---------------------------------------------------------
          let socialObj = { facebook: "", instagram: "", youtube: "" };

          if (apiData.socialLinks) {
            if (typeof apiData.socialLinks === 'string') {
              // It looks like "{\"facebook\":\"...\"}" -> Parse it!
              try {
                socialObj = JSON.parse(apiData.socialLinks);
              } catch (e) {
                console.error("Error parsing socialLinks string:", e);
              }
            } else if (typeof apiData.socialLinks === 'object') {
              // It is already an object -> Use it directly
              socialObj = apiData.socialLinks;
            }
          }
          // ---------------------------------------------------------

          setData({
            heroTitle: apiData.heroTitle || "",
            heroSubtitle: apiData.heroSubtitle || "",
            bannerImage: apiData.bannerImage || null,
            formLabel: apiData.formLabel || "CONTACT US",
            formMainTitle: apiData.formMainTitle || "Write to us",
            address: apiData.contactInfo?.address || "",
            phone: apiData.contactInfo?.phone || "",
            email: apiData.contactInfo?.email || "",
            mapEmbedUrl: apiData.mapEmbedUrl || "",
            contactEmail: apiData.contactEmail || "",
            enquirySubjects: apiData.enquirySubjects || [],

            // ✅ Assign using the parsed object
            facebook: socialObj.facebook || "",
            instagram: socialObj.instagram || "",
            youtube: socialObj.youtube || "",
            twitter: socialObj.twitter || "",
            linkedin: socialObj.linkedin || ""
          });
        }
      } catch (error) {
        console.error("❌ Error loading Contact data:", error);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Enquiry Subject Handlers
  const handleAddSubject = () => {
    setData(prev => ({
      ...prev,
      enquirySubjects: [...prev.enquirySubjects, { label: "" }]
    }));
  };

  const handleSubjectChange = (index, value) => {
    const updated = [...data.enquirySubjects];
    updated[index].label = value;
    setData(prev => ({ ...prev, enquirySubjects: updated }));
  };

  const handleRemoveSubject = (index) => {
    setData(prev => ({
      ...prev,
      enquirySubjects: prev.enquirySubjects.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setData(prev => ({ ...prev, bannerImage: previewUrl }));
      setBannerFile(file);
    }
  };

  const removeBanner = (e) => {
    e.stopPropagation();
    setData(prev => ({ ...prev, bannerImage: null }));
    setBannerFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // --- 2. UPDATE HANDLER ---
  const handlePublish = async () => {
    setLoading(true);
    console.log("🚀 Publishing Contact Data:", data);
    console.log("📱 Social Links being sent:", {
      facebook: data.facebook,
      instagram: data.instagram,
      youtube: data.youtube,
      twitter: data.twitter,
      linkedin: data.linkedin
    });
    try {
      await upsertContactSettings(data, bannerFile);
      alert("✅ Contact Page updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc' }}>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f766e' }}>Contact Page Manager</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Manage company details, map locations, and contact forms.</p>
        </div>
        <button style={publishBtn} onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? " Saving..." : " Save & Publish"}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

        {/* 1. HERO SECTION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Layout size={18} color="#14b8a6" /> <h3>1. Hero Section</h3></div>
          <div style={topRowGrid}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Hero Titles (Main/Sub)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="heroTitle" style={inputStyle} value={data.heroTitle} onChange={handleTextChange} placeholder="EcoGlow" />
                <input name="heroSubtitle" style={inputStyle} value={data.heroSubtitle} onChange={handleTextChange} placeholder="Contact Us" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hero Background Image</label>
              <div style={smallUpload} onClick={() => fileRef.current.click()}>
                {data.bannerImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={getImageUrl(data.bannerImage)} style={fullImg} alt="Banner" />
                    <button onClick={removeBanner} style={imageRemoveBtn}><X size={12} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ImageIcon size={20} color="#94a3b8" />
                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>Upload Banner</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
        </section>

        {/* 2. FORM TEXT SECTION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><MessageSquare size={18} color="#14b8a6" /> <h3>2. Form Labels & Content</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Form Label (Uppercase)</label>
              <input name="formLabel" style={{ ...inputStyle, color: '#14b8a6', fontWeight: 'bold' }} value={data.formLabel} onChange={handleTextChange} />
            </div>
            <div>
              <label style={labelStyle}>Form Main Title</label>
              <input name="formMainTitle" style={inputStyle} value={data.formMainTitle} onChange={handleTextChange} />
            </div>
          </div>
        </section>

        {/* ✅ NEW SECTION: ENQUIRY SUBJECTS */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Plus size={18} color="#14b8a6" /> <h3>2.5 Enquiry Subjects</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={labelStyle}>Dropdown Options for Contact Form</label>
            {data.enquirySubjects.map((subject, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px' }}>
                <input
                  style={inputStyle}
                  value={subject.label}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  placeholder="e.g. Deep Cleaning"
                />
                <button
                  onClick={() => handleRemoveSubject(index)}
                  style={{ ...imageRemoveBtn, position: 'static', width: '40px', height: '40px', borderRadius: '10px' }}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button onClick={handleAddSubject} style={addBtnStyle}>
              <Plus size={16} /> Add Subject Option
            </button>
          </div>
        </section>

        {/* 3. CONTACT INFORMATION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Info size={18} color="#14b8a6" /> <h3>3. Business Information</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Physical Address (Supports Multi-line)</label>
              <div style={iconInputWrapper}>
                <MapPin size={16} style={{ ...inputIcon, top: '20px', transform: 'none' }} />
                <textarea
                  name="address"
                  style={{
                    ...inputStyle,
                    paddingLeft: '40px',
                    paddingTop: '12px',
                    minHeight: '100px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  value={data.address}
                  onChange={handleTextChange}
                  placeholder="Enter address..."
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={iconInputWrapper}>
                  <Phone size={16} style={inputIcon} />
                  <input name="phone" style={{ ...inputStyle, paddingLeft: '40px' }} value={data.phone} onChange={handleTextChange} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={iconInputWrapper}>
                  <Mail size={16} style={inputIcon} />
                  <input name="email" style={{ ...inputStyle, paddingLeft: '40px' }} value={data.email} onChange={handleTextChange} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3.5. FORM NOTIFICATION EMAIL */}
        <section style={cardStyle}>
          <div style={sectionHeader}><AtSign size={18} color="#14b8a6" /> <h3>3.5 Form Notification Email</h3></div>
          <div>
            <label style={labelStyle}>Contact Email (Receives Form Submissions)</label>
            <div style={iconInputWrapper}>
              <Mail size={16} style={inputIcon} />
              <input
                type="email"
                name="contactEmail"
                style={{ ...inputStyle, paddingLeft: '40px' }}
                value={data.contactEmail}
                onChange={handleTextChange}
                placeholder="contact@ecoglow.ae"
              />
            </div>
          </div>
        </section>

        {/* 4. MAP EMBED */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Globe size={18} color="#14b8a6" /> <h3>4. Map Integration</h3></div>
          <div>
            <label style={labelStyle}>Google Maps Embed URL (Iframe Src)</label>
            <textarea
              name="mapEmbedUrl"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              value={data.mapEmbedUrl}
              onChange={handleTextChange}
              placeholder="Paste the src link from Google Maps..."
            />
          </div>
        </section>

        {/* 5. SOCIAL MEDIA LINKS */}
        <section style={cardStyle}>
          <div style={sectionHeader}><MessageSquare size={18} color="#14b8a6" /> <h3>5. Social Media Links</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Facebook</label>
              <input name="facebook" style={inputStyle} value={data.facebook} onChange={handleTextChange} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input name="instagram" style={inputStyle} value={data.instagram} onChange={handleTextChange} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label style={labelStyle}>YouTube</label>
              <input name="youtube" style={inputStyle} value={data.youtube} onChange={handleTextChange} placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label style={labelStyle}>Twitter / X</label>
              <input name="twitter" style={inputStyle} value={data.twitter} onChange={handleTextChange} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input name="linkedin" style={inputStyle} value={data.linkedin} onChange={handleTextChange} placeholder="https://linkedin.com/..." />
            </div>
          </div>
        </section>
      </div>
    </div >
  );
};

// --- STYLES ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const publishBtn = { backgroundColor: '#14b8a6', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const cardStyle = { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' };
const topRowGrid = { display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '10px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const smallUpload = { height: '65px', border: '2px dashed #e2e8f0', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f8fafc', position: 'relative' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };
const imageRemoveBtn = { position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const iconInputWrapper = { position: 'relative', width: '100%' };
const inputIcon = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const addBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', borderRadius: '10px', border: '1px dashed #14b8a6', background: '#f0fdfa', color: '#0d9488', cursor: 'pointer', fontWeight: '600', width: 'fit-content' };



export default ContactAdmin;