import React, { useState, useRef, useEffect } from 'react';
import { Save, User, Mail, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fetchMessages, updateMessageSection } from '../../services/messageAPI';
import './AdminStyles.css';

// Ensure this matches your backend URL
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MessageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState(null); // Store the document ID

  // 1. Initialize with empty structure
  const [content, setContent] = useState({
    mdTitle: "",
    mdMessage: "",
    mdName: "",
    mdPhoto: null, // Stores preview URL or backend path
    connectTitle: "",
    connectSubtitle: ""
  });

  const [photoFile, setPhotoFile] = useState(null); // Store raw file for upload
  const fileInputRef = useRef(null);

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    
    // Fix Windows backslashes and add server URL
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchMessages();
        
        let data = response;
        if (data.data) data = data.data; 
        if (Array.isArray(data)) data = data[0]; // If array, take first item

        if (data) {
          setDocId(data._id);
          setContent({
            mdTitle: data.mdTitle || "",
            mdMessage: data.mdMessage || "",
            mdName: data.mdName || "",
            mdPhoto: data.mdPhoto || null, // Keep raw DB path
            connectTitle: data.connectTitle || "",
            connectSubtitle: data.connectSubtitle || ""
          });
        }
      } catch (error) {
        console.error("Error loading message data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      setContent(prev => ({ ...prev, mdPhoto: URL.createObjectURL(file) }));
      // Store actual file
      setPhotoFile(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Append text fields
      formData.append('mdTitle', content.mdTitle);
      formData.append('mdMessage', content.mdMessage);
      formData.append('mdName', content.mdName);
      formData.append('connectTitle', content.connectTitle);
      formData.append('connectSubtitle', content.connectSubtitle);

      // Append ID if exists (optional depending on backend logic)
      if (docId) formData.append('_id', docId);

      // Append file ONLY if new one selected
      if (photoFile) {
        formData.append('mdPhoto', photoFile);
      }

      await updateMessageSection(formData);
      alert('✅ Changes saved successfully!');
      
      // Optional: Refresh page or reload data
      // window.location.reload();

    } catch (error) {
      console.error("Update failed:", error);
      alert('❌ Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;
  }

  return (
    <div className="admin-container fade-in">
      
      {/* HEADER SECTION */}
      <div className="admin-header-row">
        <div>
          <h2>Message & Connect Editor</h2>
          <p className="text-muted">Manage MD statement and newsletter section content.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {saving ? " Saving..." : " Save All Changes"}
        </button>
      </div>

      <div className="admin-grid-2">
        
        {/* LEFT COLUMN: TEXT CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* MD MESSAGE BOX */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <User size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MD Message Settings</h3>
            </div>
            
            <div className="input-group">
              <label className="input-label">Section Heading</label>
              <input type="text" name="mdTitle" className="form-input" value={content.mdTitle} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">The Message</label>
              <textarea name="mdMessage" className="form-input" rows="8" value={content.mdMessage} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">MD Signature Name</label>
              <input type="text" name="mdName" className="form-input" style={{ fontFamily: 'cursive' }} value={content.mdName} onChange={handleChange} />
            </div>
          </div>

          {/* CONNECT SECTION BOX */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <Mail size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Newsletter Section Content</h3>
            </div>

            <div className="input-group">
              <label className="input-label">Connect Title</label>
              <input type="text" name="connectTitle" className="form-input" value={content.connectTitle} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Connect Subtitle</label>
              <input type="text" name="connectSubtitle" className="form-input" value={content.connectSubtitle} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IMAGE UPLOAD */}
        <div>
          <div className="admin-card" style={{ position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <ImageIcon size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MD Profile Photo</h3>
            </div>
            
            <div className="upload-box large" style={{ height: '400px' }} onClick={() => fileInputRef.current.click()}>
              {content.mdPhoto ? (
                <img 
                    // 👇 Use Helper Function Here
                    src={getImageUrl(content.mdPhoto)} 
                    alt="MD Preview" 
                    className="preview-img" 
                />
              ) : (
                <>
                  <Upload size={40} className="text-muted" />
                  <p className="text-muted" style={{ marginTop: '10px' }}>Click to upload profile photo</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />

            <div style={{ marginTop: '1.5rem', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#166534' }}>Preview Tip:</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#15803d', lineHeight: '1.4' }}>
                For the best look on the website, use a portrait-oriented image with a clean background.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageManager;