import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, FileText, Check, Layout, Loader2, Link2 } from 'lucide-react';
import { fetchHomeServices, updateAndCreateHomeServices } from '../../services/homeServices';
import './AdminStyles.css';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ServicesManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState(null);

  const [servicePageContent, setServicePageContent] = useState({
    mainTitle: "",
    mainDescription: "",
    mainLink: "", // 🔥 Added
    card1Title: "",
    card1Subtitle: "",
    card1Link: "", // 🔥 Added
    card1Image: null,
    card2Title: "",
    card2Subtitle: "",
    card2Link: "", // 🔥 Added
    card2Image: null
  });

  const [newFiles, setNewFiles] = useState({ card1: null, card2: null });
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apiResponse = await fetchHomeServices();
      const data = apiResponse.data || apiResponse;

      if (data) {
        setDocId(data._id);
        setServicePageContent({
          mainTitle: data.mainTitle || "",
          mainDescription: data.mainDescription || "",
          mainLink: data.mainLink || "", // 🔥 Load from DB
          card1Title: data.card1Title || "",
          card1Subtitle: data.card1Subtitle || "",
          card1Link: data.card1Link || "", // 🔥 Load from DB
          card1Image: data.card1Image || null,
          card2Title: data.card2Title || "",
          card2Subtitle: data.card2Subtitle || "",
          card2Link: data.card2Link || "", // 🔥 Load from DB
          card2Image: data.card2Image || null,
        });
      }
    } catch (error) {
      console.error("Error loading services data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setServicePageContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, cardKey) => {
    const file = e.target.files[0];
    if (file) {
      setServicePageContent(prev => ({ ...prev, [`${cardKey}Image`]: URL.createObjectURL(file) }));
      setNewFiles(prev => ({ ...prev, [cardKey]: file }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Appending all text and link fields
      formData.append("mainTitle", servicePageContent.mainTitle);
      formData.append("mainDescription", servicePageContent.mainDescription);
      formData.append("mainLink", servicePageContent.mainLink); // 🔥 Save to DB
      formData.append("card1Title", servicePageContent.card1Title);
      formData.append("card1Subtitle", servicePageContent.card1Subtitle);
      formData.append("card1Link", servicePageContent.card1Link); // 🔥 Save to DB
      formData.append("card2Title", servicePageContent.card2Title);
      formData.append("card2Subtitle", servicePageContent.card2Subtitle);
      formData.append("card2Link", servicePageContent.card2Link); // 🔥 Save to DB

      if (newFiles.card1 instanceof File) formData.append("card1Image", newFiles.card1);
      if (newFiles.card2 instanceof File) formData.append("card2Image", newFiles.card2);

      await updateAndCreateHomeServices(formData);
      alert("✅ Saved successfully");
      loadData();
      setNewFiles({ card1: null, card2: null });
    } catch (error) {
      alert("❌ Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600" size={40} /></div>;

  return (
    <div className="admin-container fade-in">
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

      {/* PAGE INTRO SETTINGS */}
      <div className="admin-card">
        <div className="section-header">
          <FileText size={18} color="#0f766e" /> <h3>Page Introduction</h3>
        </div>
        <div className="admin-grid-2">
          <div className="input-group">
            <label className="input-label">Main Heading</label>
            <input type="text" name="mainTitle" className="form-input" value={servicePageContent.mainTitle} onChange={handleContentChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Short Description</label>
            <textarea name="mainDescription" className="form-input" rows="2" value={servicePageContent.mainDescription} onChange={handleContentChange} />
          </div>
        </div>
        {/* NEW MAIN LINK FIELD */}
        <div className="input-group" style={{ marginTop: '15px' }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Link2 size={14} color="#0f766e" /> Main Section Link (e.g. /services)
            </label>
            <input type="text" name="mainLink" className="form-input" placeholder="URL for 'View All' button" value={servicePageContent.mainLink} onChange={handleContentChange} />
        </div>
      </div>

      {/* CATEGORY CARDS SECTION */}
      <div className="admin-card">
        <div className="section-header">
          <Layout size={18} color="#0f766e" /> <h3>Service Categories</h3>
        </div>
        
        <div className="admin-grid-2" style={{ alignItems: 'stretch' }}>
          
          {/* CARD 1 */}
          <div className="service-category-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="service-img-wrapper">
                  <div className="service-upload-box" onClick={() => fileInputRef1.current.click()} style={{ overflow: 'hidden', position: 'relative' }}>
                    {getImageUrl(servicePageContent.card1Image) ? (
                      <img src={getImageUrl(servicePageContent.card1Image)} alt="Commercial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center' }}><Upload size={24}/><span style={{fontSize:'0.7rem'}}>Upload</span></div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef1} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'card1')} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label className="input-label">Commercial Title</label>
                    <input type="text" name="card1Title" className="form-input" value={servicePageContent.card1Title} onChange={handleContentChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Subtitle</label>
                    <textarea name="card1Subtitle" className="form-input" rows="2" value={servicePageContent.card1Subtitle} onChange={handleContentChange} />
                  </div>
                </div>
            </div>
            {/* NEW CARD 1 LINK FIELD */}
            <div className="input-group" style={{ marginTop: '10px' }}>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Link2 size={14} /> Commercial Category Link
                </label>
                <input type="text" name="card1Link" className="form-input" placeholder="/commercial-services" value={servicePageContent.card1Link} onChange={handleContentChange} />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="service-category-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="service-img-wrapper">
                  <div className="service-upload-box" onClick={() => fileInputRef2.current.click()} style={{ overflow: 'hidden', position: 'relative' }}>
                    {getImageUrl(servicePageContent.card2Image) ? (
                      <img src={getImageUrl(servicePageContent.card2Image)} alt="Residential" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center' }}><Upload size={24}/><span style={{fontSize:'0.7rem'}}>Upload</span></div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef2} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'card2')} />
                </div>

                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label className="input-label">Residential Title</label>
                    <input type="text" name="card2Title" className="form-input" value={servicePageContent.card2Title} onChange={handleContentChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Subtitle</label>
                    <textarea name="card2Subtitle" className="form-input" rows="2" value={servicePageContent.card2Subtitle} onChange={handleContentChange} />
                  </div>
                </div>
            </div>
            {/* NEW CARD 2 LINK FIELD */}
            <div className="input-group" style={{ marginTop: '10px' }}>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Link2 size={14} /> Residential Category Link
                </label>
                <input type="text" name="card2Link" className="form-input" placeholder="/residential-services" value={servicePageContent.card2Link} onChange={handleContentChange} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServicesManager;