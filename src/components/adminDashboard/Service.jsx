import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Image as ImageIcon, Upload,
  Layers, Layout, Users, Send, Monitor, Loader2,
  Plus, Trash2, GripVertical, MessageSquare,
  Link, AtSign // 1. Imported AtSign for Email
} from 'lucide-react';
import { fetchServices, updateService } from '../../services/serviceAPI';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FullServicesManager = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [servicesData, setServicesData] = useState({
    bannerImage: null,
    heroTitlePart1: "",
    heroTitlePart2: "",
    introLabel: "",
    introMainTitle: "",
    introDescription: "",
    introLongText: "",
    introSideImage: null,
    gridMainHeading: "",
    gridSubheading: "",
    servicesList: [],
    trustedText: "",
    newsletterTitle: "",
    newsletterSubtitle: "",
    contactEmail: "" // Email field for newsletter notifications
  });

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const introImgRef = useRef(null);
  const bannerImgRef = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const cleanServerUrl = SERVER_URL.replace(/\/+$/, '');
    return `${cleanServerUrl}/${cleanPath}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchServices();
        let data = response.data || response;
        if (data.data) data = data.data;
        if (Array.isArray(data)) data = data[0];

        if (!data) return;

        setServicesData({
          bannerImage: data.bannerImage || null,
          heroTitlePart1: data.heroTitlePart1 || "",
          heroTitlePart2: data.heroTitlePart2 || "",
          introLabel: data.introLabel || "",
          introMainTitle: data.introMainTitle || "",
          introDescription: data.introDescription || "",
          introLongText: data.introLongText || "",
          introSideImage: data.introSideImage || null,
          gridMainHeading: data.gridMainHeading || "",
          gridSubheading: data.gridSubheading || "",
          servicesList: (data.servicesList || []).map(item => ({
            ...item,
            phoneNumber: item.phoneNumber || "",
            whatsappNumber: item.whatsappNumber || "",
            id: item._id || item.id || `temp_${Date.now()}_${Math.random()}`
          })),
          trustedText: data.trustedText || "",
          newsletterTitle: data.newsletterTitle || "",
          newsletterSubtitle: data.newsletterSubtitle || "",
          contactEmail: data.contactEmail || "" // Load email from API
        });
      } catch (error) {
        console.error("❌ Error loading Service Page data:", error);
      }
    };
    loadData();
  }, []);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setServicesData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardUpdate = (index, field, value) => {
    const newList = [...servicesData.servicesList];
    newList[index][field] = value;
    setServicesData(prev => ({ ...prev, servicesList: newList }));
  };

  const handleSort = () => {
    let _servicesList = [...servicesData.servicesList];
    const draggedItemContent = _servicesList.splice(dragItem.current, 1)[0];
    _servicesList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setServicesData(prev => ({ ...prev, servicesList: _servicesList }));
  };

  const handleAddCard = () => {
    setServicesData(prev => ({
      ...prev,
      servicesList: [...prev.servicesList, {
        id: `temp_${Date.now()}`,
        title: "",
        subtitle: "",
        image: null,
        desc: "",
        phoneNumber: "",
        whatsappNumber: ""
      }]
    }));
  };

  const handleRemoveCard = (index) => {
    if (!window.confirm("Are you sure you want to remove this card?")) return;
    setServicesData(prev => ({
      ...prev,
      servicesList: prev.servicesList.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e, key, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (index !== null) {
        handleCardUpdate(index, 'image', previewUrl);
        setSelectedFiles(prev => ({ ...prev, [`serviceImage_${index}`]: file }));
      } else {
        setServicesData(prev => ({ ...prev, [key]: previewUrl }));
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
      }
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(servicesData).forEach(key => {
        if (key === 'servicesList') return;
        const value = servicesData[key];
        if (typeof value === 'string' && value.startsWith('blob:')) return;
        formData.append(key, value);
      });

      const listToSend = servicesData.servicesList.map(item => {
        const cleanItem = { ...item };
        if (String(cleanItem.id).startsWith('temp_')) delete cleanItem.id;
        if (cleanItem.image && cleanItem.image.startsWith('blob:')) delete cleanItem.image;
        return cleanItem;
      });
      formData.append('servicesList', JSON.stringify(listToSend));

      Object.keys(selectedFiles).forEach(key => {
        if (selectedFiles[key]) {
          formData.append(key, selectedFiles[key]);
        }
      });

      await updateService(formData);
      alert("✅ Services page updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc' }}>

      <div style={headerBarStyle}>
        <div>
          <h2 style={{ margin: 0, color: '#0f766e' }}>Residential Master Manager</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Edit headings, descriptions, and contact info.</p>
        </div>
        <button onClick={handlePublish} style={publishBtnStyle} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? " Updating..." : " Publish Changes"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Layout size={20} color="#14b8a6" /> <h3>Hero & Residential Intro</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={labelStyle}>Hero Title Part 1</label>
                <input name="heroTitlePart1" style={inputStyle} value={servicesData.heroTitlePart1} onChange={handleTextChange} />
              </div>
              <div>
                <label style={labelStyle}>Hero Title Part 2</label>
                <input name="heroTitlePart2" style={inputStyle} value={servicesData.heroTitlePart2} onChange={handleTextChange} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="introLabel" style={inputStyle} value={servicesData.introLabel} onChange={handleTextChange} placeholder="Intro Label" />
              <input name="introMainTitle" style={inputStyle} value={servicesData.introMainTitle} onChange={handleTextChange} placeholder="Intro Title" />
              <textarea name="introDescription" style={inputStyle} rows="2" value={servicesData.introDescription} onChange={handleTextChange} placeholder="Short description..." />
              <textarea name="introLongText" style={inputStyle} rows="4" value={servicesData.introLongText} onChange={handleTextChange} placeholder="Long body text..." />
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#14b8a6" />
                <h3 style={{ margin: 0 }}>Service Cards ({servicesData.servicesList.length})</h3>
              </div>
              <button onClick={handleAddCard} style={addBtnStyle}>
                <Plus size={16} /> Add Card
              </button>
            </div>

            <div style={{ background: '#f0fdfa', padding: '15px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #ccfbf1' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Grid Main Heading</label>
                <input name="gridMainHeading" style={inputStyle} value={servicesData.gridMainHeading} onChange={handleTextChange} />
              </div>
              <div>
                <label style={labelStyle}>Grid Subheading</label>
                <textarea name="gridSubheading" style={inputStyle} rows="2" value={servicesData.gridSubheading} onChange={handleTextChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {servicesData.servicesList.map((service, index) => (
                <div
                  key={service.id || index}
                  style={serviceCardItem}
                  draggable
                  onDragStart={(e) => {
                    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) { e.preventDefault(); return; }
                    dragItem.current = index;
                    e.target.style.opacity = '0.5';
                  }}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={(e) => { e.target.style.opacity = '1'; handleSort(); }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: '#94a3b8' }} title="Drag to reorder"><GripVertical size={18} /></div>
                    <button onClick={() => handleRemoveCard(index)} style={deleteBtnStyle}><Trash2 size={14} /></button>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <div onClick={() => document.getElementById(`card-up-${index}`).click()} style={thumbStyle}>
                      {service.image ? <img src={getImageUrl(service.image)} style={fullImg} alt="service" /> : <div style={{ textAlign: 'center' }}><Upload size={18} color="#94a3b8" /></div>}
                    </div>
                    <input type="file" id={`card-up-${index}`} hidden onChange={(e) => handleImageUpload(e, 'servicesList', index)} />
                    <div style={{ flex: 1 }}>
                      <input style={smallInput} value={service.title} onChange={(e) => handleCardUpdate(index, 'title', e.target.value)} placeholder="Title" />
                      <input style={{ ...smallInput, marginTop: '5px', fontSize: '0.75rem' }} value={service.subtitle} onChange={(e) => handleCardUpdate(index, 'subtitle', e.target.value)} placeholder="Subtitle" />
                    </div>
                  </div>
                  <textarea style={{ ...smallInput, fontSize: '0.8rem', marginBottom: '10px' }} rows="2" value={service.desc} onChange={(e) => handleCardUpdate(index, 'desc', e.target.value)} placeholder="Card description..." />

                  {/* CONTACT FIELDS (2 Columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ position: 'relative' }}>
                      <Link size={12} style={{ position: 'absolute', left: '8px', top: '10px', color: '#64748b' }} />
                      <input style={{ ...smallInput, paddingLeft: '25px', fontSize: '0.75rem' }} value={service.phoneNumber} onChange={(e) => handleCardUpdate(index, 'phoneNumber', e.target.value)} placeholder="Book Link" />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <MessageSquare size={12} style={{ position: 'absolute', left: '8px', top: '10px', color: '#059669' }} />
                      <input style={{ ...smallInput, paddingLeft: '25px', fontSize: '0.75rem' }} value={service.whatsappNumber} onChange={(e) => handleCardUpdate(index, 'whatsappNumber', e.target.value)} placeholder="WhatsApp" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleAddCard} style={{ ...addBtnStyle, width: '100%', marginTop: '20px', justifyContent: 'center' }}>
              <Plus size={16} /> Add New Service Card
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Monitor size={18} color="#14b8a6" /> <h3>Main Hero Banner</h3></div>
            <div onClick={() => bannerImgRef.current.click()} style={bannerUploadBox}>
              {servicesData.bannerImage ? <img src={getImageUrl(servicesData.bannerImage)} style={fullImg} alt="banner" /> : <div style={{ textAlign: 'center' }}><Upload color="#94a3b8" /><p style={{ fontSize: '0.8rem' }}>Upload Banner</p></div>}
            </div>
            <input type="file" ref={bannerImgRef} hidden onChange={(e) => handleImageUpload(e, 'bannerImage')} />
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><ImageIcon size={18} color="#14b8a6" /> <h3>Residential Intro Image</h3></div>
            <div onClick={() => introImgRef.current.click()} style={bannerUploadBox}>
              {servicesData.introSideImage ? <img src={getImageUrl(servicesData.introSideImage)} style={fullImg} alt="residential" /> : <div style={{ textAlign: 'center' }}><Upload color="#94a3b8" /><p style={{ fontSize: '0.8rem' }}>Upload side image</p></div>}
            </div>
            <input type="file" ref={introImgRef} hidden onChange={(e) => handleImageUpload(e, 'introSideImage')} />
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Users size={18} color="#14b8a6" /> <h3>Trust Section</h3></div>
            <label style={labelStyle}>Client Trust Text</label>
            <input name="trustedText" style={inputStyle} value={servicesData.trustedText} onChange={handleTextChange} />
          </section>

          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Send size={18} color="#14b8a6" /> <h3>Newsletter & Contact</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

              {/* Contact Email Field */}
              <div>
                <label style={labelStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AtSign size={14} /> Contact Email (Receives Newsletter Notifications)
                  </div>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  style={inputStyle}
                  placeholder="residential@ecoglow.ae"
                  value={servicesData.contactEmail}
                  onChange={handleTextChange}
                />
              </div>

              <div>
                <label style={labelStyle}>Newsletter Title</label>
                <input name="newsletterTitle" style={inputStyle} value={servicesData.newsletterTitle} onChange={handleTextChange} />
              </div>
              <div>
                <label style={labelStyle}>Newsletter Subtitle</label>
                <textarea name="newsletterSubtitle" style={inputStyle} rows="2" value={servicesData.newsletterSubtitle} onChange={handleTextChange} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Styles
const headerBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const publishBtnStyle = { backgroundColor: '#14b8a6', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', justifyContent: 'center' };
const cardStyle = { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' };
const serviceCardItem = { padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' };
const thumbStyle = { width: '80px', height: '60px', background: '#e2e8f0', borderRadius: '6px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const smallInput = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' };
const bannerUploadBox = { width: '100%', height: '180px', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };
const addBtnStyle = { backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' };
const deleteBtnStyle = { background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' };

export default FullServicesManager;