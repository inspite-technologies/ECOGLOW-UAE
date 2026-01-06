import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, FileText, Check, Layout, Loader2 } from 'lucide-react';
import { fetchHomeServices, updateAndCreateHomeServices } from '../../services/homeServices';
import './AdminStyles.css';

// ⚠️ CHANGE THIS TO MATCH YOUR SERVER URL
const API_BASE_URL = "http://localhost:5000";

const ServicesManager = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState(null); // Store _id

  const [servicePageContent, setServicePageContent] = useState({
    mainTitle: "",
    mainDescription: "",
    card1Title: "",
    card1Subtitle: "",
    card1Image: null, // Stores backend path or preview URL
    card2Title: "",
    card2Subtitle: "",
    card2Image: null
  });

  // Separate state to hold actual File objects for upload
  const [newFiles, setNewFiles] = useState({
    card1: null,
    card2: null
  });

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apiResponse = await fetchHomeServices();
      // Handle potential response wrappers
      const data = apiResponse.data || apiResponse;

      if (data) {
        setDocId(data._id);
        setServicePageContent({
          mainTitle: data.mainTitle || "",
          mainDescription: data.mainDescription || "",
          card1Title: data.card1Title || "",
          card1Subtitle: data.card1Subtitle || "",
          card1Image: data.card1Image || null,
          card2Title: data.card2Title || "",
          card2Subtitle: data.card2Subtitle || "",
          card2Image: data.card2Image || null,
        });
      }
    } catch (error) {
      console.error("Error loading services data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // 1. If it's a local Blob (preview of new file), return as is
    if (imagePath.startsWith("blob:")) return imagePath;

    // 2. If it's a backend path, format it
    const formatted = imagePath.replace(/\\/g, "/");
    return formatted.startsWith("http") 
      ? formatted 
      : `${API_BASE_URL}/${formatted}`;
  };

  // --- HANDLERS ---
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setServicePageContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, cardKey) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Create Preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // 2. Update Content State (for UI)
      setServicePageContent(prev => ({ 
        ...prev, 
        [`${cardKey}Image`]: previewUrl 
      }));

      // 3. Update File State (for API)
      setNewFiles(prev => ({ 
        ...prev, 
        [cardKey]: file 
      }));
    }
  };

 const handleSave = async () => {
  try {
    setSaving(true);

    const formData = new FormData();

    // TEXT
    formData.append("mainTitle", servicePageContent.mainTitle);
    formData.append("mainDescription", servicePageContent.mainDescription);
    formData.append("card1Title", servicePageContent.card1Title);
    formData.append("card1Subtitle", servicePageContent.card1Subtitle);
    formData.append("card2Title", servicePageContent.card2Title);
    formData.append("card2Subtitle", servicePageContent.card2Subtitle);

    // FILES (ONLY IF FILE)
    if (newFiles.card1 instanceof File) {
      formData.append("card1Image", newFiles.card1);
    }

    if (newFiles.card2 instanceof File) {
      formData.append("card2Image", newFiles.card2);
    }

    await updateAndCreateHomeServices(formData);

    alert("Saved successfully");
    loadData();
  } catch (error) {
    console.error(error);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="admin-container fade-in">
      
      {/* 1. HEADER SECTION */}
      <div className="admin-header-row">
        <div>
          <h2>Services Page Editor</h2>
          <p>Manage introduction, categories, and service details.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {saving ? " Saving..." : " Save Changes"}
        </button>
      </div>

      {/* 2. PAGE INTRO SETTINGS */}
      <div className="admin-card">
        <div className="section-header">
          <FileText size={18} color="#0f766e" /> <h3>Page Introduction</h3>
        </div>
        <div className="admin-grid-2">
          <div className="input-group">
            <label className="input-label">Main Heading</label>
            <input 
              type="text" name="mainTitle" className="form-input" 
              value={servicePageContent.mainTitle} onChange={handleContentChange} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Short Description</label>
            <textarea 
              name="mainDescription" className="form-input" rows="2" 
              value={servicePageContent.mainDescription} onChange={handleContentChange} 
            />
          </div>
        </div>
      </div>

      {/* 3. CATEGORY CARDS SECTION */}
      <div className="admin-card">
        <div className="section-header">
          <Layout size={18} color="#0f766e" /> <h3>Service Categories</h3>
        </div>
        
        {/* Grid for Commercial & Residential Cards */}
        <div className="admin-grid-2" style={{ alignItems: 'stretch' }}>
          
          {/* CARD 1: COMMERCIAL */}
          <div className="service-category-card">
            {/* Left: Image */}
            <div className="service-img-wrapper">
              <label className="input-label">Commercial Image</label>
              <div 
                className="service-upload-box" 
                onClick={() => fileInputRef1.current.click()}
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                {getImageUrl(servicePageContent.card1Image) ? (
                  <img 
                    src={getImageUrl(servicePageContent.card1Image)} 
                    alt="Commercial" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Upload size={24} style={{marginBottom:'5px'}}/>
                    <span style={{fontSize:'0.7rem'}}>Upload Image</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef1} 
                hidden 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'card1')} 
              />
              {servicePageContent.card1Image && (
                <div className="status-text">
                  <Check size={12}/> {newFiles.card1 ? "New File Selected" : "Loaded from Server"}
                </div>
              )}
            </div>
            
            {/* Right: Inputs */}
            <div>
              <div className="input-group">
                <label className="input-label">Card Title</label>
                <input 
                  type="text" name="card1Title" className="form-input" 
                  value={servicePageContent.card1Title} onChange={handleContentChange} 
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Subtitle</label>
                <textarea 
                  name="card1Subtitle" className="form-input" rows="4" 
                  value={servicePageContent.card1Subtitle} onChange={handleContentChange} 
                />
              </div>
            </div>
          </div>

          {/* CARD 2: RESIDENTIAL */}
          <div className="service-category-card">
            {/* Left: Image */}
            <div className="service-img-wrapper">
              <label className="input-label">Residential Image</label>
              <div 
                className="service-upload-box" 
                onClick={() => fileInputRef2.current.click()}
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                {getImageUrl(servicePageContent.card2Image) ? (
                  <img 
                    src={getImageUrl(servicePageContent.card2Image)} 
                    alt="Residential" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Upload size={24} style={{marginBottom:'5px'}}/>
                    <span style={{fontSize:'0.7rem'}}>Upload Image</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef2} 
                hidden 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'card2')} 
              />
              {servicePageContent.card2Image && (
                <div className="status-text">
                  <Check size={12}/> {newFiles.card2 ? "New File Selected" : "Loaded from Server"}
                </div>
              )}
            </div>

            {/* Right: Inputs */}
            <div>
              <div className="input-group">
                <label className="input-label">Card Title</label>
                <input 
                  type="text" name="card2Title" className="form-input" 
                  value={servicePageContent.card2Title} onChange={handleContentChange} 
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Subtitle</label>
                <textarea 
                  name="card2Subtitle" className="form-input" rows="4" 
                  value={servicePageContent.card2Subtitle} onChange={handleContentChange} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ServicesManager;