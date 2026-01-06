import React, { useState, useRef, useEffect } from "react";
import {
  Save, Layout, Info, Sparkles, Eye, Target, Diamond, Users,
  Image as ImageIcon, Upload, Type, Loader2, X
} from "lucide-react";
import { fetchAboutUs, updateAboutUs } from "../../services/aboutAPI";

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutUsManager = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [aboutData, setAboutData] = useState({
    heroTitlePart1: "", heroTitlePart2: "", heroBannerImg: null,
    mainHeading: "", introSubtitle: "", introDesc: "",
    sloganText: "", sloganBannerImg: null,
    visionTitle: "", visionIcon: null, visionImg: null, visionText: "",
    missionTitle: "", missionIcon: null, missionImg: null, missionText: "",
    valuesTitle: "", valuesIcon: null, valuesImg: null, valuesList: [],
    clientsTitle: "", clientLogosImg: null,
  });

  const fileRefs = {
    hero: useRef(null), slogan: useRef(null),
    visionIcon: useRef(null), visionImg: useRef(null),
    missionIcon: useRef(null), missionImg: useRef(null),
    valuesIcon: useRef(null), valuesImg: useRef(null),
    clients: useRef(null),
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAboutUs();
        let data = response?.data?.data || response?.data || response;
        if (Array.isArray(data)) data = data[0];

        if (!data) return;

        const formatImg = (path) => {
          if (!path) return null;
          if (path.startsWith("http") || path.startsWith("blob:")) return path;
          return `${SERVER_URL}/${path.replace(/\\/g, "/")}`;
        };

        setAboutData({
          heroTitlePart1: data.hero?.titlePart1 || "",
          heroTitlePart2: data.hero?.titlePart2 || "",
          heroBannerImg: formatImg(data.hero?.bannerImg),
          mainHeading: data.intro?.heading || "",
          introSubtitle: data.intro?.subtitle || "",
          introDesc: data.intro?.description || "",
          sloganText: data.slogan?.text || "",
          sloganBannerImg: formatImg(data.slogan?.bannerImg),
          visionTitle: data.vision?.title || "Vision",
          visionIcon: formatImg(data.vision?.icon),
          visionImg: formatImg(data.vision?.image),
          visionText: data.vision?.text || "",
          missionTitle: data.mission?.title || "Mission",
          missionIcon: formatImg(data.mission?.icon),
          missionImg: formatImg(data.mission?.image),
          missionText: data.mission?.text || "",
          valuesTitle: data.valuesSection?.title || "Values",
          valuesIcon: formatImg(data.valuesSection?.icon),
          valuesImg: formatImg(data.valuesSection?.image),
          valuesList: data.valuesSection?.list || [{ head: "", desc: "" }],
          clientsTitle: data.clients?.title || "",
          clientLogosImg: formatImg(data.clients?.logosImg),
        });
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setAboutData((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
      setSelectedFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const removeImage = (e, key) => {
    e.stopPropagation();
    setAboutData(prev => ({ ...prev, [key]: null }));
    setSelectedFiles(prev => ({ ...prev, [key]: null }));
    const refKey = key.replace('Img', '').replace('Icon', '').replace('Banner', '').replace('Logos', '');
    if (fileRefs[refKey]?.current) fileRefs[refKey].current.value = "";
  };

  const handleValueChange = (idx, field, val) => {
    const updated = [...aboutData.valuesList];
    updated[idx][field] = val;
    setAboutData({ ...aboutData, valuesList: updated });
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(aboutData).forEach((key) => {
        if (!key.toLowerCase().includes("img") && !key.toLowerCase().includes("icon") && key !== "valuesList") {
          formData.append(key, aboutData[key]);
        }
      });
      formData.append("valuesList", JSON.stringify(aboutData.valuesList));

      const imageKeys = ["heroBannerImg", "sloganBannerImg", "visionIcon", "visionImg", "missionIcon", "missionImg", "valuesIcon", "valuesImg", "clientLogosImg"];
      imageKeys.forEach(key => {
        if (selectedFiles[key]) formData.append(key, selectedFiles[key]);
        else if (aboutData[key] === null) formData.append(key, "");
      });

      await updateAboutUs(formData);
      alert("✅ Content updated successfully!");
    } catch (error) {
      alert("❌ Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- REUSABLE BIG IMAGE COMPONENT ---
  const BigImageBox = ({ itemKey, label, height = "180px", isIcon = false }) => (
    <div style={{ flex: isIcon ? "0 0 140px" : "1" }}>
      <label style={labelStyle}>{label}</label>
      <div 
        style={{ ...bannerUpload, height, border: "2px solid #e2e8f0" }} 
        onClick={() => {
          const refName = itemKey.replace('Img', '').replace('Icon', '').replace('Banner', '').replace('Logos', '');
          fileRefs[refName]?.current?.click();
        }}
      >
        {aboutData[itemKey] ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img src={aboutData[itemKey]} style={coverImg} alt="preview" />
            <button onClick={(e) => removeImage(e, itemKey)} style={removeBtnStyle}><X size={14}/></button>
          </div>
        ) : (
          <div style={{ color: "#94a3b8", textAlign: "center" }}>
            <Upload size={24} />
            <div style={{ fontSize: "10px", marginTop: "4px" }}>UPLOAD</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", color: "#1e293b" }}>
      
      {/* STICKY HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", color: "#0f766e" }}>About Us Manager</h1>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Update your website's 'About' sections and media.</p>
        </div>
        <button style={publishBtn} onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          {loading ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* 1. HERO SECTION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Layout size={20} /> <h3>1. Hero Section</h3></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={labelStyle}>Hero Title (Split)</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input name="heroTitlePart1" style={inputStyle} value={aboutData.heroTitlePart1} onChange={handleChange} placeholder="First Part (e.g. Welcome to)" />
                  <input name="heroTitlePart2" style={inputStyle} value={aboutData.heroTitlePart2} onChange={handleChange} placeholder="Second Part (Highlight)" />
                </div>
              </div>
              <BigImageBox itemKey="heroBannerImg" label="Main Hero Banner" height="240px" />
              <input type="file" ref={fileRefs.hero} hidden onChange={(e) => handleImageUpload(e, "heroBannerImg")} />
            </div>
            <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={sectionHeader}><Info size={18}/> <h3>2. Intro Text</h3></div>
              <input name="mainHeading" style={inputStyle} value={aboutData.mainHeading} onChange={handleChange} placeholder="Main Heading" />
              <textarea name="introSubtitle" rows="2" style={inputStyle} value={aboutData.introSubtitle} onChange={handleChange} placeholder="Subtitle" />
              <textarea name="introDesc" rows="4" style={inputStyle} value={aboutData.introDesc} onChange={handleChange} placeholder="Long Description" />
            </div>
          </div>
        </section>

        {/* 3. SLOGAN */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Type size={20} /> <h3>3. Slogan & Mid-Banner</h3></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
            <textarea name="sloganText" style={{ ...inputStyle, height: "100%" }} value={aboutData.sloganText} onChange={handleChange} placeholder="Enter company slogan..." />
            <BigImageBox itemKey="sloganBannerImg" label="Slogan Background Image" height="180px" />
            <input type="file" ref={fileRefs.slogan} hidden onChange={(e) => handleImageUpload(e, "sloganBannerImg")} />
          </div>
        </section>

        {/* 4 & 5. VISION & MISSION */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          {/* Vision */}
          <section style={cardStyle}>
            <div style={sectionHeader}><Eye size={20} /> <h3>4. Vision</h3></div>
            <input name="visionTitle" style={{ ...inputStyle, marginBottom: "15px" }} value={aboutData.visionTitle} onChange={handleChange} placeholder="Vision Title" />
            <textarea name="visionText" rows="3" style={{ ...inputStyle, marginBottom: "15px" }} value={aboutData.visionText} onChange={handleChange} placeholder="Vision Text" />
            <div style={{ display: "flex", gap: "15px" }}>
              <BigImageBox itemKey="visionIcon" label="Icon" height="140px" isIcon />
              <BigImageBox itemKey="visionImg" label="Vision Image" height="140px" />
            </div>
            <input type="file" ref={fileRefs.visionIcon} hidden onChange={(e) => handleImageUpload(e, "visionIcon")} />
            <input type="file" ref={fileRefs.visionImg} hidden onChange={(e) => handleImageUpload(e, "visionImg")} />
          </section>

          {/* Mission */}
          <section style={cardStyle}>
            <div style={sectionHeader}><Target size={20} /> <h3>5. Mission</h3></div>
            <input name="missionTitle" style={{ ...inputStyle, marginBottom: "15px" }} value={aboutData.missionTitle} onChange={handleChange} placeholder="Mission Title" />
            <textarea name="missionText" rows="3" style={{ ...inputStyle, marginBottom: "15px" }} value={aboutData.missionText} onChange={handleChange} placeholder="Mission Text" />
            <div style={{ display: "flex", gap: "15px" }}>
              <BigImageBox itemKey="missionIcon" label="Icon" height="140px" isIcon />
              <BigImageBox itemKey="missionImg" label="Mission Image" height="140px" />
            </div>
            <input type="file" ref={fileRefs.missionIcon} hidden onChange={(e) => handleImageUpload(e, "missionIcon")} />
            <input type="file" ref={fileRefs.missionImg} hidden onChange={(e) => handleImageUpload(e, "missionImg")} />
          </section>
        </div>

        {/* 6. VALUES SECTION */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Diamond size={20} /> <h3>6. Core Values</h3></div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input name="valuesTitle" style={inputStyle} value={aboutData.valuesTitle} onChange={handleChange} placeholder="Values Section Title" />
              <div style={{ display: "flex", gap: "15px" }}>
                <BigImageBox itemKey="valuesIcon" label="Section Icon" height="150px" isIcon />
                <BigImageBox itemKey="valuesImg" label="Feature Image" height="150px" />
              </div>
              <input type="file" ref={fileRefs.valuesIcon} hidden onChange={(e) => handleImageUpload(e, "valuesIcon")} />
              <input type="file" ref={fileRefs.valuesImg} hidden onChange={(e) => handleImageUpload(e, "valuesImg")} />
            </div>
            <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              {aboutData.valuesList.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input style={{ flex: 1, ...inputStyle }} value={item.head} onChange={(e) => handleValueChange(idx, "head", e.target.value)} placeholder="Title" />
                  <input style={{ flex: 2, ...inputStyle }} value={item.desc} onChange={(e) => handleValueChange(idx, "desc", e.target.value)} placeholder="Description" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CLIENTS */}
        <section style={cardStyle}>
          <div style={sectionHeader}><Users size={20} /> <h3>7. Clients & Partners</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input name="clientsTitle" style={inputStyle} value={aboutData.clientsTitle} onChange={handleChange} placeholder="Clients Heading" />
            <BigImageBox itemKey="clientLogosImg" label="Partner Logos Compilation (Wide)" height="220px" />
            <input type="file" ref={fileRefs.clients} hidden onChange={(e) => handleImageUpload(e, "clientLogosImg")} />
          </div>
        </section>

      </div>
    </div>
  );
};

// --- STYLES ---
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", position: "sticky", top: "20px", zIndex: 10, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
const publishBtn = { backgroundColor: "#14b8a6", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" };
const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" };
const sectionHeader = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "#0f766e", fontWeight: "bold", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" };
const labelStyle = { display: "block", fontSize: "0.7rem", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s" };
const bannerUpload = { border: "2px dashed #cbd5e1", borderRadius: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#f8fafc", position: "relative" };
const removeBtnStyle = { position: "absolute", top: "10px", right: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" };
const coverImg = { width: "100%", height: "100%", objectFit: "cover" };

export default AboutUsManager;