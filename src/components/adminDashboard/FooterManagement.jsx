import React, { useState, useEffect } from 'react';
import {
  Save, Layout, Info, Share2,
  Plus, Trash2, MapPin, Phone,
  Loader2, Globe, Link as LinkIcon
} from 'lucide-react';
import { fetchFooterData, updateFooterData } from '../../services/footerAPI';

const FooterManagement = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initial State matching your Schema
  const [footerData, setFooterData] = useState({
    officeAddress: "",
    phone: "",
    whatsapp: "",
    email: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    copyrightText: "Copyright © 2025 EcoGlow. All rights reserved",
    usefulLinks: []
  });

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFooterData();
        if (!data) return;

        setFooterData({
          officeAddress: data.officeAddress || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          facebook: data.socialLinks?.facebook || "",
          instagram: data.socialLinks?.instagram || "",
          youtube: data.socialLinks?.youtube || "",
          linkedin: data.socialLinks?.linkedin || "",
          copyrightText: data.copyrightText || "",
          usefulLinks: data.usefulLinks || []
        });
      } catch (error) {
        console.error("❌ Error loading Footer data:", error);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFooterData(prev => ({ ...prev, [name]: value }));
  };

  // Useful Links Logic
  const updateLink = (index, field, value) => {
    const newLinks = [...footerData.usefulLinks];
    newLinks[index][field] = value;
    setFooterData({ ...footerData, usefulLinks: newLinks });
  };

  const addLink = () => {
    setFooterData({
      ...footerData,
      usefulLinks: [...footerData.usefulLinks, { label: "", url: "" }]
    });
  };

  const removeLink = (index) => {
    const newLinks = footerData.usefulLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, usefulLinks: newLinks });
  };

  // --- 2. SAVE HANDLER ---
  const handleSave = async () => {
    setLoading(true);
    try {
      // Structure exactly as your backend expects
      const payload = {
        officeAddress: footerData.officeAddress,
        phone: footerData.phone,
        whatsapp: footerData.whatsapp,
        email: footerData.email,
        copyrightText: footerData.copyrightText,
        facebook: footerData.facebook,
        instagram: footerData.instagram,
        youtube: footerData.youtube,
        linkedin: footerData.linkedin,
        usefulLinks: footerData.usefulLinks
      };

      await updateFooterData(payload);
      setMessage({ type: 'success', text: "✅ Footer updated successfully!" });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ type: 'error', text: "❌ Failed to update. Check console." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc' }}>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f766e' }}>Footer Content Manager</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Global site information, links, and social media.</p>
        </div>
        <button style={publishBtn} onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? " Saving..." : " Save Changes"}
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

        {/* 1. CONTACT INFORMATION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><MapPin size={18} color="#14b8a6" /> <h3>1. Contact Information</h3></div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Office Address</label>
            <textarea
              name="officeAddress"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', whiteSpace: 'pre-wrap' }}
              value={footerData.officeAddress}
              onChange={handleTextChange}
              placeholder="Full address here..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Landline Phone</label>
              <input name="phone" style={inputStyle} value={footerData.phone} onChange={handleTextChange} placeholder="+971 4 ..." />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp Number</label>
              <input name="whatsapp" style={inputStyle} value={footerData.whatsapp} onChange={handleTextChange} placeholder="+971 50 ..." />
            </div>
            <div>
              <label style={labelStyle}>Official Email</label>
              <input name="email" style={inputStyle} value={footerData.email} onChange={handleTextChange} placeholder="info@example.com" />
            </div>
          </div>
        </section>

        {/* 2. SOCIAL MEDIA LINKS */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Share2 size={18} color="#14b8a6" /> <h3>2. Social Media Channels</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Facebook URL</label>
              <input name="facebook" style={inputStyle} value={footerData.facebook} onChange={handleTextChange} />
            </div>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <input name="instagram" style={inputStyle} value={footerData.instagram} onChange={handleTextChange} />
            </div>
            <div>
              <label style={labelStyle}>YouTube URL</label>
              <input name="youtube" style={inputStyle} value={footerData.youtube} onChange={handleTextChange} />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input name="linkedin" style={inputStyle} value={footerData.linkedin} onChange={handleTextChange} />
            </div>
          </div>
        </section>


        {/* 4. LEGAL & COPYRIGHT */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Globe size={18} color="#14b8a6" /> <h3>4. Legal & Copyright</h3></div>
          <div>
            <label style={labelStyle}>Copyright Notice</label>
            <input
              name="copyrightText"
              style={inputStyle}
              value={footerData.copyrightText}
              onChange={handleTextChange}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

// --- STYLES (MATCHING FAQ MANAGER) ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const publishBtn = { backgroundColor: '#14b8a6', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const cardStyle = { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const addBtn = { background: '#f0fdfa', color: '#0d9488', border: '1px solid #ccfbf1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' };
const itemBox = { padding: '15px', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#fafafa' };
const deleteBtn = { color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '10px 0 0 0' };
const emptyState = { textAlign: 'center', padding: '30px', color: '#94a3b8', border: '2px dashed #f1f5f9', borderRadius: '12px' };

export default FooterManagement;