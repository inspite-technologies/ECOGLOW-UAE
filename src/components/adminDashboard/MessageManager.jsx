import React, { useState, useRef, useEffect } from 'react';
import { Save, User, Mail, Upload, Image as ImageIcon, Loader2, PenTool, X, AtSign } from 'lucide-react';
import { fetchMessages, updateMessageSection } from '../../services/messageAPI';
import './AdminStyles.css';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MessageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [docId, setDocId] = useState(null);

  const [content, setContent] = useState({
    mdTitle: "",
    mdMessage: "",
    gratitudeText: "",
    mdName: "",
    mdPhoto: null,
    mdSignature: null,
    connectTitle: "",
    connectSubtitle: "",
    contactEmail: "" // <--- 1. Added State
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);

  // --- IMAGE COMPRESSION FUNCTIONS (Unchanged) ---
  const compressAsWebP = (canvas, originalFile) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
          const compressedFile = new File([blob], originalFile.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp', lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/webp', 0.80
      );
    });
  };

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 1920; const MAX_HEIGHT = 1080;
          let width = img.width; let height = img.height;
          
          if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
          else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
          
          canvas.width = width; canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          compressAsWebP(canvas, file).then(resolve);
        };
        img.onerror = () => reject(new Error('Image loading failed'));
      };
      reader.onerror = () => reject(new Error('File reading failed'));
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchMessages();
        let data = response.data || response;
        if (Array.isArray(data)) data = data[0];

        if (data) {
          setDocId(data._id);
          setContent({
            mdTitle: data.mdTitle || "",
            mdMessage: data.mdMessage || "",
            gratitudeText: data.gratitudeText || "",
            mdName: data.mdName || "",
            mdPhoto: data.mdPhoto || null,
            mdSignature: data.mdSignature || null,
            connectTitle: data.connectTitle || "",
            connectSubtitle: data.connectSubtitle || "",
            contactEmail: data.contactEmail || "" // <--- 2. Load Email Data
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setCompressing(true);
      let finalFile = file;
      if (file.size / 1024 / 1024 > 0.5) finalFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(finalFile);
      
      if (type === 'photo') {
        setContent(prev => ({ ...prev, mdPhoto: previewUrl }));
        setPhotoFile(finalFile);
      } else {
        setContent(prev => ({ ...prev, mdSignature: previewUrl }));
        setSignatureFile(finalFile);
      }
    } catch (error) {
      console.error('Image error:', error);
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'photo') {
      setContent(prev => ({ ...prev, mdPhoto: null }));
      setPhotoFile(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
    } else {
      setContent(prev => ({ ...prev, mdSignature: null }));
      setSignatureFile(null);
      if (signatureInputRef.current) signatureInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append('mdTitle', content.mdTitle);
      formData.append('mdMessage', content.mdMessage);
      formData.append('gratitudeText', content.gratitudeText);
      formData.append('mdName', content.mdName);
      formData.append('connectTitle', content.connectTitle);
      formData.append('connectSubtitle', content.connectSubtitle);
      formData.append('contactEmail', content.contactEmail); // <--- 3. Save Email

      if (docId) formData.append('_id', docId);

      if (photoFile) formData.append('mdPhoto', photoFile);
      else if (content.mdPhoto === null) formData.append('removePhoto', 'true');

      if (signatureFile) formData.append('mdSignature', signatureFile);
      else if (content.mdSignature === null) formData.append('removeSignature', 'true');

      await updateMessageSection(formData);
      alert('✅ Changes saved successfully!');
    } catch (error) {
      console.error("Update failed:", error);
      alert('❌ Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="admin-container fade-in">
      <div className="admin-header-row">
        <div>
          <h2>Message & Connect Editor</h2>
          <p className="text-muted">Manage MD statement and contact settings.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || compressing}>
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {saving ? " Saving..." : " Save All Changes"}
        </button>
      </div>

      {compressing && (
        <div className="admin-card" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Loader2 className="animate-spin" size={20} />
            <span>Compressing image...</span>
          </div>
        </div>
      )}

      <div className="admin-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
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
              <label className="input-label">Gratitude Text</label>
              <textarea name="gratitudeText" className="form-input" rows="3" placeholder="Enter a short gratitude note..." value={content.gratitudeText} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">MD Name (Text)</label>
              <input type="text" name="mdName" className="form-input" value={content.mdName} onChange={handleChange} />
            </div>
          </div>

          {/* CONTACT & NEWSLETTER SETTINGS */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <Mail size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Contact & Newsletter</h3>
            </div>
            
            {/* New Email Field */}
            <div className="input-group">
              <label className="input-label" style={{display:'flex', alignItems:'center', gap:'5px'}}>
                <AtSign size={14}/> Contact Email (Receives Messages)
              </label>
              <input 
                type="email" 
                name="contactEmail" 
                className="form-input" 
                placeholder="info@ecoglow.com"
                value={content.contactEmail} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Newsletter Title</label>
              <input type="text" name="connectTitle" className="form-input" value={content.connectTitle} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Newsletter Subtitle</label>
              <input type="text" name="connectSubtitle" className="form-input" value={content.connectSubtitle} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IMAGES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* PROFILE PHOTO */}
          <div className="admin-card">
            <div className="flex justify-between items-center mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ImageIcon size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MD Profile Photo</h3>
              </div>
              {content.mdPhoto && (
                <button className="btn-icon text-red-500" onClick={() => handleRemoveImage('photo')} title="Remove Photo">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="upload-box" style={{ height: '250px', cursor: 'pointer' }} onClick={() => photoInputRef.current.click()}>
              {content.mdPhoto ? (
                <img src={getImageUrl(content.mdPhoto)} alt="MD" className="preview-img" loading="lazy" />
              ) : (
                <div className="text-center">
                  <Upload size={30} className="text-muted" />
                  <p>Upload Photo</p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block' }}>Supports: PNG, JPG, WebP</span>
                </div>
              )}
            </div>
            <input type="file" ref={photoInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
          </div>

          {/* SIGNATURE IMAGE */}
          <div className="admin-card">
            <div className="flex justify-between items-center mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenTool size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MD Signature Image</h3>
              </div>
              {content.mdSignature && (
                <button className="btn-icon text-red-500" onClick={() => handleRemoveImage('signature')} title="Remove Signature">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="upload-box" style={{ height: '150px', backgroundColor: '#f9fafb', cursor: 'pointer' }} onClick={() => signatureInputRef.current.click()}>
              {content.mdSignature ? (
                <img src={getImageUrl(content.mdSignature)} alt="Signature" className="preview-img" style={{ objectFit: 'contain' }} loading="lazy" />
              ) : (
                <div className="text-center">
                  <Upload size={30} className="text-muted" />
                  <p>Upload Signature PNG</p>
                </div>
              )}
            </div>
            <input type="file" ref={signatureInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'signature')} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessageManager;