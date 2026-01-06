import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Upload,
  Type,
  Info,
  Check,
  Layers,
  Loader2,
  Trash2
} from "lucide-react";
import { fetchHero, updateHero } from "../../services/heroAPI";
import "./AdminStyles.css";

// ⚠️ CHANGE THIS TO MATCH YOUR SERVER URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

const HeroManager = () => {
  // --- STATE ---
  const [slides, setSlides] = useState([]);
  const [heroDocId, setHeroDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileRefs = useRef([]);

  // --- EFFECTS ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apiResponse = await fetchHero();
      const heroData = apiResponse.data || apiResponse; 
      
      let loadedSlides = [];

      if (heroData && heroData.slides) {
        setHeroDocId(heroData._id);
        loadedSlides = heroData.slides;
      }

      // ENFORCE 4 SLIDES
      const totalSlots = 4;
      const currentCount = loadedSlides.length;
      let finalSlides = [...loadedSlides];

      if (currentCount < totalSlots) {
        for (let i = 0; i < (totalSlots - currentCount); i++) {
          finalSlides.push({
            id: currentCount + i + 1,
            title: "",
            subtitle: "",
            image: null,
            isNewSlot: true 
          });
        }
      }
      if (finalSlides.length > totalSlots) {
        finalSlides = finalSlides.slice(0, totalSlots);
      }
      setSlides(finalSlides);

    } catch (error) {
      console.error("Error fetching hero data:", error);
      // Fallback
      setSlides([
        { id: 1, title: "", subtitle: "", image: null },
        { id: 2, title: "", subtitle: "", image: null },
        { id: 3, title: "", subtitle: "", image: null },
        { id: 4, title: "", subtitle: "", image: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleTextChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSlides = [...slides];
      newSlides[index].newImageFile = file; 
      newSlides[index].preview = URL.createObjectURL(file); 
      setSlides(newSlides);
    }
  };

  const handleRemoveImage = (index) => {
    const newSlides = [...slides];
    newSlides[index].image = null;
    newSlides[index].preview = null;
    newSlides[index].newImageFile = null;
    setSlides(newSlides);
  };

  // --- 🔴 CRITICAL FIX HERE ---
  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // 1. Prepare clean JSON payload
      const slidesPayload = slides.map((slide) => ({
        id: slide.id, // This ID is crucial for the matching logic
        _id: slide._id, 
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.image // Keep old path if no new file
      }));

      // 2. Append JSON
      formData.append("slides", JSON.stringify(slidesPayload));

      if (heroDocId) {
        formData.append("_id", heroDocId);
      }

      // 3. Append Files with CORRECT NAME
      // Backend expects: slideImage_${slide.id}
      slides.forEach((slide) => {
        if (slide.newImageFile) {
          // ⚠️ FIX: Using 'slideImage_' + slide.id to match backend
          formData.append(`slideImage_${slide.id}`, slide.newImageFile);
        }
      });

      await updateHero(formData); 
      alert("Hero Carousel Saved Successfully!");
      loadData(); 
      
    } catch (error) {
      console.error("Error saving hero data:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const getSlideImageSrc = (slide) => {
    if (slide.preview) return slide.preview;
    if (slide.image) {
      const formattedPath = slide.image.replace(/\\/g, "/");
      return formattedPath.startsWith("http") 
        ? formattedPath 
        : `${API_BASE_URL}/${formattedPath}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
         <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="admin-container fade-in">
      <div className="admin-header-row">
        <div>
          <h2>Hero Carousel Editor</h2>
          <p>Manage the 4 rotating slides displayed on the homepage.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {saving ? " Saving..." : " Save Changes"}
        </button>
      </div>

      <div className="admin-card">
        <div className="section-header">
          <Layers size={20} color="#0f766e" />{" "}
          <h3>Active Slides Configuration (4 Slots)</h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="hero-slide-card"
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="slide-badge">Slide {index + 1}</div>

              {/* IMAGE AREA */}
              <div className="slide-image-area">
                <label className="input-label" style={{ marginBottom: "5px" }}>
                  Background Image
                </label>

                <div
                  className="aspect-ratio-box"
                  style={{ backgroundColor: "#fff", overflow: 'hidden', position: 'relative' }}
                  onClick={() => fileRefs.current[index].click()}
                >
                  {getSlideImageSrc(slide) ? (
                    <img 
                      src={getSlideImageSrc(slide)} 
                      alt={`Slide ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#94a3b8" }}>
                      <Upload size={24} style={{ marginBottom: "5px", opacity: 0.6 }} />
                      <span style={{ fontSize: "0.7rem", display: "block" }}>Click to Upload</span>
                    </div>
                  )}
                </div>
                
                {(slide.image || slide.preview) && (
                   <button 
                     type="button"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleRemoveImage(index);
                     }}
                     style={{
                       marginTop: "5px",
                       background: "none",
                       border: "none",
                       color: "#ef4444",
                       fontSize: "0.75rem",
                       cursor: "pointer",
                       display: "flex",
                       alignItems: "center",
                       gap: "4px"
                     }}
                   >
                     <Trash2 size={12} /> Remove Image
                   </button>
                )}

                <input
                  type="file"
                  hidden
                  // ⚠️ RESTRICT TO IMAGES ONLY
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={(el) => (fileRefs.current[index] = el)}
                  onChange={(e) => handleImageUpload(index, e)}
                />
              </div>

              {/* TEXT AREA */}
              <div className="slide-inputs-area">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Main Headline</label>
                  <div style={{ position: "relative" }}>
                    <Type size={16} style={{ position: "absolute", left: "12px", top: "13px", color: "#94a3b8" }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: "38px", fontWeight: "bold", backgroundColor: "#fff" }}
                      value={slide.title}
                      onChange={(e) => handleTextChange(index, "title", e.target.value)}
                      placeholder="e.g. Pristine Spaces"
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Subtitle Description</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    style={{ backgroundColor: "#fff" }}
                    value={slide.subtitle}
                    onChange={(e) => handleTextChange(index, "subtitle", e.target.value)}
                    placeholder="e.g. Experience luxury cleaning at its finest..."
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