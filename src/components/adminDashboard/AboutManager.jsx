import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  Edit2,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Layers,
  Loader2
} from 'lucide-react';
import { fetchHomeAbout, updateHomeAbout } from '../../services/homeAboutAPI';
import './AdminStyles.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutDocId, setAboutDocId] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const valuesImageRef = useRef(null);

  /* 🔥 GENERAL ABOUT STATE — SCHEMA ALIGNED */
  const [aboutGeneral, setAboutGeneral] = useState({
    heroHighlightText: '',
    heroTitle: '',
    heroParagraphs: ['']
  });

  const [valuesSection, setValuesSection] = useState({
    commonImage: null,
    newFile: null
  });

  const [aboutItems, setAboutItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  /* LOAD DATA */
  const loadData = async () => {
    try {
      setLoading(true);
      const apiResponse = await fetchHomeAbout();
      const data = apiResponse.data || apiResponse;

      if (data) {
        setAboutDocId(data._id);

        setAboutGeneral({
          heroHighlightText: data.heroHighlightText || '',
          heroTitle: data.heroTitle || '',
          heroParagraphs: data.heroParagraphs?.length
            ? data.heroParagraphs
            : ['']
        });

        setValuesSection({
          commonImage: data.valuesCommonImage || null,
          newFile: null
        });

        setAboutItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load about data', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('blob:')) return imagePath;
    const formatted = imagePath.replace(/\\/g, '/');
    return formatted.startsWith('http')
      ? formatted
      : `${API_BASE_URL}/${formatted}`;
  };

  /* GENERAL HANDLERS */
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setAboutGeneral((prev) => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...aboutGeneral.heroParagraphs];
    updated[index] = value;
    setAboutGeneral((prev) => ({ ...prev, heroParagraphs: updated }));
  };

  const handleValuesImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValuesSection({
        commonImage: URL.createObjectURL(file),
        newFile: file
      });
    }
  };

  /* ITEM MODAL */
  const openEditModal = (item = null) => {
    setEditingItem(item ? { ...item } : { id: null, title: '', content: '' });
    setShowModal(true);
  };

  const saveAboutItem = () => {
    if (!editingItem.title.trim() || !editingItem.content.trim()) {
      alert('Title and Content are required');
      return;
    }

    if (editingItem._id || editingItem.id) {
      setAboutItems((prev) =>
        prev.map((item) =>
          item._id === editingItem._id || item.id === editingItem.id
            ? editingItem
            : item
        )
      );
    } else {
      setAboutItems((prev) => [...prev, { ...editingItem, id: Date.now() }]);
    }

    setShowModal(false);
  };

  const deleteAboutItem = (id) => {
    if (window.confirm('Delete this item?')) {
      setAboutItems((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );
    }
  };

  /* SAVE ALL */
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      if (aboutDocId) formData.append('_id', aboutDocId);

      formData.append('heroHighlightText', aboutGeneral.heroHighlightText);
      formData.append('heroTitle', aboutGeneral.heroTitle);
      formData.append(
        'heroParagraphs',
        JSON.stringify(aboutGeneral.heroParagraphs)
      );

      if (valuesSection.newFile) {
        formData.append('valuesCommonImage', valuesSection.newFile);
      }

      formData.append(
        'items',
        JSON.stringify(
          aboutItems.map((item) => ({
            title: item.title,
            content: item.content,
            _id: item._id
          }))
        )
      );

      await updateHomeAbout(formData);
      alert('✅ Changes Saved');
      loadData();
    } catch (err) {
      console.error('Save failed', err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );

  return (
    <div className="admin-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
          <h2>About Us Manager</h2>
          <p>Manage hero content and core values.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? ' Saving...' : ' Save Changes'}
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="admin-card">
        <div className="section-header">
          <FileText size={18} /> About Hero Content
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label className="input-label">Highlight Text</label>
            <input
              className="form-input"
              name="heroHighlightText"
              value={aboutGeneral.heroHighlightText}
              onChange={handleGeneralChange}
              placeholder="Luxury standard"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Main Heading</label>
            <input
              className="form-input"
              name="heroTitle"
              value={aboutGeneral.heroTitle}
              onChange={handleGeneralChange}
              placeholder="cleaning service born in Dubai..."
            />
          </div>

          {aboutGeneral.heroParagraphs.map((para, index) => (
            <div className="input-group" key={index}>
              <label className="input-label">Paragraph {index + 1}</label>
              <textarea
                className="form-input"
                rows={3}
                value={para}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
              />
            </div>
          ))}

          <button
            className="btn btn-secondary"
            onClick={() =>
              setAboutGeneral((prev) => ({
                ...prev,
                heroParagraphs: [...prev.heroParagraphs, '']
              }))
            }
          >
            <Plus size={14} /> Add Paragraph
          </button>
        </div>
      </div>
      {/* CORE VALUES SECTION */}
      <div className="admin-card" style={{ marginTop: '30px' }}>
        <div className="section-header">
          <Layers size={18} /> Core Values & Items
        </div>
        
        {/* LAYOUT: Image Left, Cards Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
          
          {/* LEFT: IMAGE */}
          <div>
            <label className="input-label">Common Values Image</label>
            <div 
              className="upload-box" 
              style={{ height: '300px', width: '100%', overflow: 'hidden', borderRadius: '12px' }}
              onClick={() => valuesImageRef.current.click()}
            >
              {valuesSection.commonImage ? (
                <img 
                    src={getImageUrl(valuesSection.commonImage)} 
                    alt="Values Common" 
                    className="preview-img" 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                  <span style={{ fontSize: '0.9rem' }}>Upload Common Image</span>
                </div>
              )}
            </div>
            <input type="file" ref={valuesImageRef} hidden accept="image/*" onChange={handleValuesImageUpload} />
          </div>

          {/* RIGHT: SEPARATED CARDS GRID */}
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                <label className="input-label" style={{margin:0, fontSize: '1.1rem'}}>Value Items (Vision, Mission, Values)</label>
                <button className="btn btn-secondary" style={{padding:'8px 16px', fontSize:'0.9rem'}} onClick={() => openEditModal(null)}>
                    <Plus size={16}/> Add New
                </button>
            </div>
            
            {/* GRID CONTAINER: Forces 3 distinct columns */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '20px',
                alignItems: 'stretch'
            }}> 
              
              {aboutItems.length === 0 && (
                  <div style={{textAlign:'center', padding:'30px', color:'#94a3b8', border:'2px dashed #cbd5e1', borderRadius:'12px', gridColumn: '1 / -1'}}>
                      No items added yet. Click "Add New".
                  </div>
              )}

             {aboutItems.map((item, index) => (
  <div
    key={item._id || item.id || index}
    className="vmv-card"
  >
    {/* CONTENT */}
    <div>
      <h4 className="vmv-title">
        {item.title}
      </h4>

      <p className="vmv-content">
        {item.content && item.content.length > 80
          ? item.content.substring(0, 80) + '...'
          : item.content}
      </p>
    </div>

    {/* ACTION BUTTONS */}
    <div className="vmv-actions">
      <button
        className="vmv-btn edit"
        onClick={() => openEditModal(item)}
      >
        <Edit2 size={14} /> Edit
      </button>

      <button
        className="vmv-btn delete"
        onClick={() => deleteAboutItem(item._id || item.id)}
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
))}

            </div>
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
                {editingItem.id || editingItem._id ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="input-group">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    className="form-input"
                    style={{ fontWeight: 'bold' }} 
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Vision"
                />
            </div>
            
            <div className="input-group">
              <label className="input-label">Content</label>
              <textarea
                className="form-input"
                rows="5"
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                placeholder="Write the description here..."
              />
            </div>
            
            <button className="btn btn-primary full-width" onClick={saveAboutItem}>
              {editingItem.id || editingItem._id ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutManager;