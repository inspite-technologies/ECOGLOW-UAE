import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Upload,
  Type,
  Layers,
  Loader2,
  Trash2,
  Link2,
  Image as ImageIcon
} from "lucide-react";
import { fetchHero, updateHero } from "../../services/heroAPI";
import "./AdminStyles.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

const HeroManager = () => {
  const [slides, setSlides] = useState([]);
  const [sectionLink, setSectionLink] = useState(""); // Global link state
  const [heroDocId, setHeroDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileRefs = useRef([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apiResponse = await fetchHero();
      const heroData = apiResponse.data || apiResponse; 
      
      if (heroData) {
        setHeroDocId(heroData._id);
        setSectionLink(heroData.sectionLink || "");
        
        const totalSlots = 4;
        let loadedSlides = heroData.slides || [];
        let finalSlides = [...loadedSlides];

        if (finalSlides.length < totalSlots) {
          for (let i = finalSlides.length; i < totalSlots; i++) {
            finalSlides.push({ id: i + 1, title: "", subtitle: "", image: null });
          }
        }
        setSlides(finalSlides.slice(0, totalSlots));
      }
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    // (Optional: Insert your compression logic here as per previous versions)
    const newSlides = [...slides];
    newSlides[index].newImageFile = file; 
    newSlides[index].preview = URL.createObjectURL(file); 
    setSlides(newSlides);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Append Global Link
      formData.append("sectionLink", sectionLink);

      // Clean slides payload (remove previews/files)
      const slidesPayload = slides.map(s => ({
        id: s.id, _id: s._id, title: s.title, subtitle: s.subtitle, image: s.image
      }));
      formData.append("slides", JSON.stringify(slidesPayload));

      // Append new image files
      slides.forEach(slide => {
        if (slide.newImageFile) {
          formData.append(`slideImage_${slide.id}`, slide.newImageFile);
        }
      });

      await updateHero(formData); 
      alert("Hero Carousel Updated!");
      loadData(); 
    } catch (error) {
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const getSlideImageSrc = (slide) => {
    if (slide.preview) return slide.preview;
    if (slide.image) {
      const path = slide.image.replace(/\\/g, "/");
      return path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;
    }
    return null;
  };

  if (loading) return <div className="loader-container"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="admin-container fade-in">
      <div className="admin-header-row">
        <div>
          <h2>Hero Carousel Editor</h2>
          <p>Update headlines and the global "Know More" link.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {saving ? " Saving..." : " Save Changes"}
        </button>
      </div>

      {/* GLOBAL LINK SECTION */}
      <div className="admin-card" style={{ borderLeft: "4px solid #2563eb", marginBottom: "20px" }}>
        <div className="section-header">
          <Link2 size={20} color="#2563eb" />
          <h3>Global Button Action</h3>
        </div>
        <div className="input-group" style={{ marginTop: "10px", marginBottom: 0 }}>
          <label className="input-label">"Know More" Destination (URL or Path)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. /services or https://yourlink.com"
            value={sectionLink}
            onChange={(e) => setSectionLink(e.target.value)}
            style={{ color: "#2563eb", fontWeight: "500" }}
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="section-header">
          <Layers size={20} color="#0f766e" /> <h3>Carousel Slides</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {slides.map((slide, index) => (
            <div key={index} className="hero-slide-card" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
              
              {/* Image Side */}
              <div className="image-upload-wrapper">
                <div className="aspect-ratio-box" onClick={() => fileRefs.current[index].click()} style={{ cursor: 'pointer', border: '2px dashed #e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
                  {getSlideImageSrc(slide) ? (
                    <img src={getSlideImageSrc(slide)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: '#94a3b8' }}>
                      <ImageIcon size={24} />
                      <span style={{ fontSize: '12px' }}>Upload Image</span>
                    </div>
                  )}
                </div>
                <input type="file" hidden ref={el => fileRefs.current[index] = el} onChange={e => handleImageUpload(index, e)} />
              </div>

              {/* Text Side */}
              <div className="slide-inputs-area">
                <div className="input-group">
                  <label className="input-label">Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={slide.title}
                    onChange={(e) => handleTextChange(index, "title", e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Subtitle</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={slide.subtitle}
                    onChange={(e) => handleTextChange(index, "subtitle", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroManager;