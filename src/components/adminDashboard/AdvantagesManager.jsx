import React, { useState, useRef, useEffect } from 'react';
import { Save, Edit2, Star, Layout, X, Upload, Check, Trash2, Plus, Image as ImageIcon, Link, MessageCircle } from 'lucide-react';
import { fetchAdvantages, updateAdvantages } from '../../services/advantageAPI';
import './AdminStyles.css';

const API_BASE_URL = "http://localhost:5000"; 

// --- HELPER TO FIX IMAGE URLs ---
const getImageUrl = (path) => {
  if (!path) return null;
  // If it's already an external link (Cloudinary) or a local preview (blob), return as is
  if (path.startsWith('http') || path.startsWith('https') || path.startsWith('blob:')) {
    return path;
  }
  // Otherwise, assume it's a local server file
  return `${API_BASE_URL}/${path.replace(/\\/g, '/')}`;
};

const AdvantagesManager = () => {
  // --- STATE ---
  const [generalContent, setGeneralContent] = useState({
    sectionTitle: "",
    ctaTitleLine1: "",
    ctaTitleLine2: "",
    ctaButtonText: "",
    ctaButtonLink: "",
    ctaWhatsappText: "",
    ctaWhatsappLink: "",
    ctaImage: null
  });

  const [advantages, setAdvantages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const ctaFileInputRef = useRef(null);
  const iconFileInputRef = useRef(null);

  // --- LOAD DATA FROM API ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAdvantages();
        if (res.success) {
          const data = res.data;

          // 1. USE HELPER FOR CTA IMAGE
          const formattedCtaImage = getImageUrl(data.ctaImage);

          const formattedItems = data.items.map(item => ({
            ...item,
            id: item._id, 
            // 2. USE HELPER FOR ICONS
            icon: getImageUrl(item.icon)
          }));

          setGeneralContent({
            sectionTitle: data.sectionTitle || "",
            ctaTitleLine1: data.ctaTitleLine1 || "",
            ctaTitleLine2: data.ctaTitleLine2 || "",
            ctaButtonText: data.ctaButtonText || "",
            ctaButtonLink: data.ctaButtonLink || "", 
            ctaWhatsappText: data.ctaWhatsappText || "",
            ctaWhatsappLink: data.ctaWhatsappLink || "", 
            ctaImage: formattedCtaImage // Set the fixed URL
          });

          setAdvantages(formattedItems);
        }
      } catch (error) {
        console.error("Failed to fetch advantages:", error);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralContent(prev => ({ ...prev, [name]: value }));
  };

  const handleCtaImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGeneralContent(prev => ({
        ...prev,
        ctaImage: URL.createObjectURL(file), // Create blob preview
        _file: file 
      }));
    }
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingItem(prev => ({
        ...prev,
        icon: URL.createObjectURL(file), // Create blob preview
        _file: file
      }));
    }
  };

  // --- CARD MODAL LOGIC ---
  const addNewCard = () => {
    setEditingItem({ id: Date.now().toString(), title: "", description: "", icon: null });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const deleteCard = (id) => {
    if (window.confirm("Are you sure you want to delete this advantage card?")) {
      setAdvantages(prev => prev.filter(item => item.id !== id));
    }
  };

  const saveAdvantage = () => {
    const index = advantages.findIndex(item => item.id === editingItem.id);
    if (index >= 0) {
      const updated = [...advantages];
      updated[index] = editingItem;
      setAdvantages(updated);
    } else {
      setAdvantages(prev => [...prev, editingItem]);
    }
    setShowModal(false);
  };

 // --- SAVE ALL TO API ---
  const handleSaveAll = async () => {
    try {
      const formData = new FormData();

      // Append General Fields
      formData.append("sectionTitle", generalContent.sectionTitle);
      formData.append("ctaTitleLine1", generalContent.ctaTitleLine1);
      formData.append("ctaTitleLine2", generalContent.ctaTitleLine2);
      
      formData.append("ctaButtonText", generalContent.ctaButtonText);
      formData.append("ctaButtonLink", generalContent.ctaButtonLink);

      formData.append("ctaWhatsappText", generalContent.ctaWhatsappText);
      formData.append("ctaWhatsappLink", generalContent.ctaWhatsappLink); 

      // Only append image if a NEW file was selected
      if (generalContent._file) {
        formData.append("ctaImage", generalContent._file);
      }

      // Advantages Items Logic
      const itemsToSend = advantages.map((item, index) => {
        if (item._file) {
          formData.append(`itemIcon_${index}`, item._file);
        }
        return {
          title: item.title,
          description: item.description,
          // IMPORTANT: If uploading new file, send null for icon string
          // If keeping old image, send the original URL string
          icon: item._file ? null : item.icon 
        };
      });

      formData.append("items", JSON.stringify(itemsToSend));

      await updateAdvantages(formData);
      alert("Advantages section updated successfully!");
      window.location.reload(); 

    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update advantages section");
    }
  };

  return (
    <div className="admin-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
          <h2>Advantages & CTA Editor</h2>
          <p>Manage the "Why Choose Us" grid and the bottom Promise banner.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveAll}>
          <Save size={18} /> Save All Changes
        </button>
      </div>

      {/* SECTION GRID */}
      <div className="admin-grid-2" style={{ alignItems: 'start' }}>
        
        {/* LEFT COLUMN: CTA Image */}
        <div className="admin-card">
          <div className="section-header">
            <ImageIcon size={18} /> CTA Banner Image
          </div>
          <div className="upload-box" style={{ height: '100%', minHeight: '300px' }} onClick={() => ctaFileInputRef.current.click()}>
            {generalContent.ctaImage ? (
              <img src={generalContent.ctaImage} alt="CTA" className="preview-img" style={{objectFit: 'cover'}} />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <Upload size={32} style={{ opacity: 0.5, marginBottom: '10px' }} />
                <span>Upload Banner</span>
              </div>
            )}
            <input type="file" ref={ctaFileInputRef} hidden accept="image/*" onChange={handleCtaImageUpload} />
          </div>
        </div>

        {/* RIGHT COLUMN: Text Configuration */}
        <div className="admin-card">
          <div className="section-header">
            <Layout size={18} /> Text Configuration
          </div>
          
          <div className="input-group">
            <label className="input-label">Main Section Title</label>
            <input type="text" className="form-input" name="sectionTitle" value={generalContent.sectionTitle} onChange={handleGeneralChange} />
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', margin: '20px 0' }}></div>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f766e', fontSize: '0.9rem' }}>Promise Banner Content</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className="input-group">
                <label className="input-label">Banner Line 1</label>
                <input type="text" className="form-input" name="ctaTitleLine1" value={generalContent.ctaTitleLine1} onChange={handleGeneralChange} />
            </div>
            <div className="input-group">
                <label className="input-label">Banner Line 2</label>
                <input type="text" className="form-input" name="ctaTitleLine2" value={generalContent.ctaTitleLine2} onChange={handleGeneralChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className="input-group">
                <label className="input-label">Button Text</label>
                <input type="text" className="form-input" name="ctaButtonText" value={generalContent.ctaButtonText} onChange={handleGeneralChange} placeholder="e.g. Book Now" />
            </div>
            <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <Link size={12} /> Button Link
                </label>
                <input type="text" className="form-input" name="ctaButtonLink" value={generalContent.ctaButtonLink} onChange={handleGeneralChange} placeholder="e.g. /book or tel:12345" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
                <label className="input-label">WhatsApp Text</label>
                <input type="text" className="form-input" name="ctaWhatsappText" value={generalContent.ctaWhatsappText} onChange={handleGeneralChange} placeholder="e.g. Chat on WhatsApp" />
            </div>
            <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <MessageCircle size={12} /> WhatsApp Link
                </label>
                <input type="text" className="form-input" name="ctaWhatsappLink" value={generalContent.ctaWhatsappLink} onChange={handleGeneralChange} placeholder="e.g. 971501234567" />
            </div>
          </div>

        </div>
      </div>

      {/* ADVANTAGES GRID */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Advantage Cards</h3>
          <button className="btn btn-secondary" onClick={addNewCard} style={{ backgroundColor: '#fff', border: '1px dashed #cbd5e1' }}>
            <Plus size={18} /> Add New Card
          </button>
        </div>

        <div className="admin-grid-responsive">
          {advantages.map(item => (
            <div key={item.id} className="admin-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dcfce7' }}>
                  {item.icon ? <img src={item.icon} style={{ width: '60%', height: '60%', objectFit: 'contain' }} alt="icon" /> : <Star size={24} color="#15803d" />}
                </div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#166534' }}>{item.title || "No Title"}</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', flex: 1, marginBottom: '20px', lineHeight: '1.5' }}>
                {item.description.length > 80 ? item.description.substring(0, 80) + "..." : item.description}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => openEditModal(item)}><Edit2 size={16} /> Edit</button>
                <button className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={() => deleteCard(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{advantages.find(i => i.id === editingItem.id) ? 'Edit Advantage' : 'Add New Advantage'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="upload-box" style={{ width: '100px', height: '100px' }} onClick={() => iconFileInputRef.current.click()}>
                {editingItem.icon ? <img src={editingItem.icon} className="preview-img" alt="Icon" /> : <Upload size={20} />}
                <input type="file" ref={iconFileInputRef} hidden accept="image/*" onChange={handleIconUpload} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label">Title</label>
                <input type="text" className="form-input" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea className="form-input" rows="5" value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            <button className="btn btn-primary full-width" onClick={saveAdvantage}>
              <Check size={18} /> {advantages.find(i => i.id === editingItem.id) ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdvantagesManager;