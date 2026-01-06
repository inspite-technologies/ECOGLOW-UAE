import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Layout, Info, HelpCircle, 
  Plus, Trash2, Home, ImageIcon, 
  Loader2, X 
} from 'lucide-react';
import { fetchFAQs, updateFAQs } from '../../services/faqAPI';

// Ensure this matches your backend URL
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FAQManager = () => {
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState(null); // Store raw file for upload

  // Initial State
  const [faqData, setFaqData] = useState({
    heroTitlePart1: "", 
    heroTitlePart2: "", 
    heroBannerImg: null,
    breadcrumbHome: "Home",
    breadcrumbCurrent: "/ FAQs",
    sectionLabel: "",
    mainHeading: "", 
    faqs: []
  });

  const fileRefs = {
    hero: useRef(null),
  };

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchFAQs();
        let data = response;
        
        if (data.data) data = data.data; 
        if (Array.isArray(data)) data = data[0]; 

        if (!data) return;

        setFaqData({
            heroTitlePart1: data.heroSmall || "",
            heroTitlePart2: data.heroLarge || "",
            heroBannerImg: data.heroBannerImg || null,
            breadcrumbHome: "Home", 
            breadcrumbCurrent: "/ FAQs",
            sectionLabel: data.sectionLabel || "FAQs",
            mainHeading: data.sectionTitle || "",
            faqs: data.faqs || [] 
        });

      } catch (error) {
        console.error("❌ Error loading FAQ data:", error);
      }
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFaqData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);
        setFaqData(prev => ({ ...prev, [key]: previewUrl }));
        if (key === 'heroBannerImg') setBannerFile(file);
    }
  };

  const removeBanner = (e) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setFaqData(prev => ({ ...prev, heroBannerImg: null }));
    setBannerFile(null);
    if (fileRefs.hero.current) fileRefs.hero.current.value = "";
  };

  // FAQ List Logic
  const updateFaq = (index, field, value) => {
    const newFaqs = [...faqData.faqs];
    newFaqs[index][field] = value;
    setFaqData({ ...faqData, faqs: newFaqs });
  };

  const addFaq = () => {
    setFaqData({
      ...faqData,
      faqs: [...faqData.faqs, { question: "", answer: "" }]
    });
  };

  const removeFaq = (index) => {
    const newFaqs = faqData.faqs.filter((_, i) => i !== index);
    setFaqData({ ...faqData, faqs: newFaqs });
  };

  // --- 2. PUBLISH (UPDATE) HANDLER ---
  const handlePublish = async () => {
    setLoading(true);
    try {
        const formData = new FormData();

        formData.append('heroSmall', faqData.heroTitlePart1);
        formData.append('heroLarge', faqData.heroTitlePart2);
        formData.append('sectionLabel', faqData.sectionLabel);
        formData.append('sectionTitle', faqData.mainHeading);

        const cleanFaqs = faqData.faqs.map(item => ({
            question: item.question,
            answer: item.answer,
            ...(item._id && { _id: item._id }) 
        }));
        formData.append('faqs', JSON.stringify(cleanFaqs));

        // Append File if new one exists, otherwise send existing path/null
        if (bannerFile) {
            formData.append('heroBannerImg', bannerFile);
        } else {
            formData.append('heroBannerImg', faqData.heroBannerImg || "");
        }

        const response = await updateFAQs(formData);
        
        if (response) {
            alert("✅ FAQs updated successfully!");
        }

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
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f766e' }}>FAQ Content Manager</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Edit questions, answers, and visual assets.</p>
        </div>
        <button style={publishBtn} onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
          {loading ? " Saving..." : " Save & Publish"}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

        {/* 1. HERO SECTION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Layout size={18} color="#14b8a6" /> <h3>1. Hero Section</h3></div>
          <div style={topRowGrid}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Hero Titles (Top/Bottom)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="heroTitlePart1" style={inputStyle} value={faqData.heroTitlePart1} onChange={handleTextChange} placeholder="EcoGlow" />
                <input name="heroTitlePart2" style={inputStyle} value={faqData.heroTitlePart2} onChange={handleTextChange} placeholder="FAQs" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hero Background Image</label>
              <div style={smallUpload} onClick={() => fileRefs.hero.current.click()}>
                {faqData.heroBannerImg ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img 
                            src={getImageUrl(faqData.heroBannerImg)} 
                            style={fullImg} 
                            alt="Banner" 
                        />
                        <button onClick={removeBanner} style={imageRemoveBtn}><X size={12} /></button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ImageIcon size={20} color="#94a3b8" />
                        <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>Upload Banner</span>
                    </div>
                )}
              </div>
              <input type="file" ref={fileRefs.hero} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'heroBannerImg')} />
            </div>
          </div>
        </section>

        {/* 2. PAGE LABELS */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Info size={18} color="#14b8a6" /> <h3>2. Page Labels & Headings</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Breadcrumb (Home)</label>
              <input name="breadcrumbHome" style={inputStyle} value={faqData.breadcrumbHome} disabled={true} />
            </div>
            <div>
              <label style={labelStyle}>Breadcrumb (Current Path)</label>
              <input name="breadcrumbCurrent" style={inputStyle} value={faqData.breadcrumbCurrent} disabled={true} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Section Label</label>
              <input name="sectionLabel" style={{ ...inputStyle, color: '#14b8a6', fontWeight: 'bold' }} value={faqData.sectionLabel} onChange={handleTextChange} />
            </div>
            <div>
              <label style={labelStyle}>Main Question Title</label>
              <input name="mainHeading" style={inputStyle} value={faqData.mainHeading} onChange={handleTextChange} />
            </div>
          </div>
        </section>

        {/* 3. FAQ ITEMS */}
        <section style={cardStyle}>
          <div style={{ ...sectionHeader, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={18} color="#14b8a6" /> 
              <h3>3. FAQ Items Manager</h3>
            </div>
            <button onClick={addFaq} style={addBtn}><Plus size={16} /> Add New FAQ</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {faqData.faqs.map((faq, index) => (
              <div key={index} style={faqItemBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={faqBadge}>Question #{index + 1}</span>
                  <button onClick={() => removeFaq(index)} style={deleteBtn}><Trash2 size={14} /></button>
                </div>
                <input 
                  style={{ ...inputStyle, marginBottom: '10px', fontWeight: '600' }} 
                  placeholder="Enter Question" 
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                />
                <textarea 
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                  placeholder="Enter Answer" 
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                />
              </div>
            ))}
            {faqData.faqs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', border: '2px dashed #f1f5f9', borderRadius: '12px' }}>
                    No FAQs added yet. Click "Add New FAQ" to get started.
                </div>
            )}
          </div>
        </section>
      </div>
    </div>
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
const addBtn = { background: '#f0fdfa', color: '#0d9488', border: '1px solid #ccfbf1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' };
const faqItemBox = { padding: '20px', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#fafafa' };
const faqBadge = { fontSize: '0.7rem', color: '#14b8a6', fontWeight: 'bold', textTransform: 'uppercase' };
const deleteBtn = { color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' };

export default FAQManager;