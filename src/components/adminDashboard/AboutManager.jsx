import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  ImageIcon,
  FileText,
  Layers,
  Loader2,
  Plus,
  Trash2,
  Link2
} from 'lucide-react';
import { fetchHomeAbout, updateHomeAbout } from '../../services/homeAboutAPI';
import './AdminStyles.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [aboutDocId, setAboutDocId] = useState(null);

  const valuesImageRef = useRef(null);

  const [aboutGeneral, setAboutGeneral] = useState({
    heroHighlightText: '',
    heroTitle: '',
    heroParagraphs: [''],
    aboutLink: '' 
  });

  const [cards, setCards] = useState({
    vision: { title: 'Our Vision', content: '' },
    mission: { title: 'Our Mission', content: '' },
    values: { title: 'Our Values', content: '' }
  });

  const [valuesSection, setValuesSection] = useState({
    commonImage: null,
    newFile: null
  });

  useEffect(() => {
    loadData();
  }, []);

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
          aboutLink: data.aboutLink || '', 
          heroParagraphs: data.heroParagraphs?.length ? data.heroParagraphs : ['']
        });
        setValuesSection({
          commonImage: data.valuesCommonImage || null,
          newFile: null
        });
        setCards({
          vision: data.vision || { title: 'Our Vision', content: '' },
          mission: data.mission || { title: 'Our Mission', content: '' },
          values: data.values || { title: 'Our Values', content: '' }
        });
      }
    } catch (err) {
      console.error('Failed to load about data', err);
    } finally {
      setLoading(false);
    }
  };

  const compressAsWebP = (canvas, originalFile) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], originalFile.name.replace(/\.[^/.]+$/, '.webp'), {
          type: 'image/webp',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/webp', 0.80);
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
          let width = img.width;
          let height = img.height;
          const MAX_W = 1920; 
          const MAX_H = 1080;
          if (width > MAX_W) { height *= MAX_W / width; width = MAX_W; }
          canvas.width = width; canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          compressAsWebP(canvas, file).then(resolve);
        };
      };
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('blob:')) return imagePath;
    const formatted = imagePath.replace(/\\/g, '/');
    return formatted.startsWith('http') ? formatted : `${API_BASE_URL}/${formatted}`;
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setAboutGeneral((prev) => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...aboutGeneral.heroParagraphs];
    updated[index] = value;
    setAboutGeneral((prev) => ({ ...prev, heroParagraphs: updated }));
  };

  const removeParagraph = (index) => {
    const updated = aboutGeneral.heroParagraphs.filter((_, i) => i !== index);
    setAboutGeneral((prev) => ({ ...prev, heroParagraphs: updated }));
  };

  const handleCardChange = (cardKey, field, value) => {
    setCards(prev => ({ ...prev, [cardKey]: { ...prev[cardKey], [field]: value } }));
  };

  const handleValuesImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setCompressing(true);
      const finalFile = file.size > 500000 ? await compressImage(file) : file;
      setValuesSection({ commonImage: URL.createObjectURL(finalFile), newFile: finalFile });
    } catch (error) {
      alert('Image error');
    } finally { setCompressing(false); }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      if (aboutDocId) formData.append('_id', aboutDocId);
      formData.append('heroHighlightText', aboutGeneral.heroHighlightText);
      formData.append('heroTitle', aboutGeneral.heroTitle);
      formData.append('aboutLink', aboutGeneral.aboutLink);
      formData.append('heroParagraphs', JSON.stringify(aboutGeneral.heroParagraphs));
      formData.append('vision', JSON.stringify(cards.vision));
      formData.append('mission', JSON.stringify(cards.mission));
      formData.append('values', JSON.stringify(cards.values));
      if (valuesSection.newFile) formData.append('valuesCommonImage', valuesSection.newFile);
      await updateHomeAbout(formData);
      alert('✅ Saved Successfully');
      loadData();
    } catch (err) {
      alert('Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-600" size={40} /></div>;

  return (
    <div className="admin-container fade-in">
      {/* Header Section */}
      <div className="admin-header-row" style={{ marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>About Us Manager</h2>
          <p style={{ color: '#64748b' }}>Manage section content and the global action link.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving || compressing} style={{ padding: '10px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? ' Saving...' : ' Save All Changes'}
        </button>
      </div>

      <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Left Column: Hero Content */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-header" style={{ marginBottom: '5px' }}><FileText size={18} /> Hero Content</div>
          
          <div className="input-group">
            <label className="input-label">Highlight Text</label>
            <input className="form-input" name="heroHighlightText" value={aboutGeneral.heroHighlightText} onChange={handleGeneralChange} />
          </div>

          <div className="input-group">
            <label className="input-label">Main Heading</label>
            <input className="form-input" name="heroTitle" value={aboutGeneral.heroTitle} onChange={handleGeneralChange} />
          </div>

          <div className="paragraph-manager">
            <label className="input-label">Hero Paragraphs</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aboutGeneral.heroParagraphs.map((para, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                  <textarea className="form-input" rows={3} value={para} onChange={(e) => handleParagraphChange(index, e.target.value)} />
                  <button className="btn-icon text-red" onClick={() => removeParagraph(index)} style={{ marginTop: '5px' }}><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setAboutGeneral(prev => ({ ...prev, heroParagraphs: [...prev.heroParagraphs, ''] }))} style={{ marginTop: '12px' }}>
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          {/* Separated Link Section for clarity */}
          <div className="input-group" style={{ 
            backgroundColor: '#f0fdfa', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #ccfbf1',
            marginTop: '10px'
          }}>
            <label className="input-label" style={{ color: '#0f766e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Link2 size={18} /> Global "Know More" Link
            </label>
            <input 
              className="form-input" 
              name="aboutLink" 
              placeholder="e.g. /about or https://wa.me/..."
              value={aboutGeneral.aboutLink} 
              onChange={handleGeneralChange}
              style={{ borderColor: '#5eead4', backgroundColor: '#fff' }}
            />
          </div>
        </div>

        {/* Right Column: Side Image */}
        <div className="admin-card">
          <div className="section-header" style={{ marginBottom: '15px' }}><ImageIcon size={18} /> Section Side Image</div>
          <div className="upload-box" style={{ height: '400px', cursor: 'pointer', borderRadius: '12px' }} onClick={() => valuesImageRef.current.click()}>
            {valuesSection.commonImage ? (
              <img src={getImageUrl(valuesSection.commonImage)} alt="Common" className="preview-img" style={{ objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <div className="text-center" style={{ color: '#94a3b8' }}>
                <Plus size={40} />
                <p style={{ marginTop: '10px' }}>Upload Side Image</p>
              </div>
            )}
          </div>
          <input type="file" ref={valuesImageRef} hidden onChange={handleValuesImageUpload} />
        </div>
      </div>

      {/* Core Pillars Section */}
      <div className="section-header" style={{ marginTop: '50px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Layers size={20} /> <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>Core Pillars</span>
      </div>

      <div className="vmv-grid-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {['vision', 'mission', 'values'].map((key) => (
          <div key={key} className="admin-card pillar-card" style={{ transition: 'all 0.3s ease' }}>
            <h3 style={{ textTransform: 'capitalize', color: 'var(--primary-teal)', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>{key}</h3>
            <div className="input-group" style={{ marginBottom: '15px' }}>
              <label className="input-label">Title</label>
              <input className="form-input" value={cards[key].title} onChange={(e) => handleCardChange(key, 'title', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Content</label>
              <textarea className="form-input" rows={6} value={cards[key].content} onChange={(e) => handleCardChange(key, 'content', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutManager;