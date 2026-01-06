import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Image as ImageIcon, Upload, 
  Layers, Layout, Users, Send, Monitor, Loader2
} from 'lucide-react';
import { fetchServices, updateService } from '../../services/serviceAPI';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

const FullServicesManager = () => {
  const [loading, setLoading] = useState(false);
  
  // Store raw files for upload (Key: "bannerImage", "serviceImage_0", etc.)
  const [selectedFiles, setSelectedFiles] = useState({});

  const [servicesData, setServicesData] = useState({
    // Banner
    bannerImage: null, 
    
    // Hero & Intro
    heroTitlePart1: "",
    heroTitlePart2: "",
    introLabel: "",
    introMainTitle: "",
    introDescription: "",
    introLongText: "",
    introSideImage: null, 

    // Grid Section
    gridMainHeading: "", 
    gridSubheading: "",
    
    // Services List (Default to 4 empty items)
    servicesList: [
      { id: 'temp_1', title: "", subtitle: "", image: null, desc: "" },
      { id: 'temp_2', title: "", subtitle: "", image: null, desc: "" },
      { id: 'temp_3', title: "", subtitle: "", image: null, desc: "" },
      { id: 'temp_4', title: "", subtitle: "", image: null, desc: "" }
    ],

    // Footer / Trust
    trustedText: "",
    newsletterTitle: "",
    newsletterSubtitle: ""
  });

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // 1. If it's a local preview (blob), return as is
    if (imagePath.startsWith("blob:")) return imagePath;
    
    // 2. If it's already a full URL (external), return as is
    if (imagePath.startsWith("http")) return imagePath;

    // 3. Fix Windows backslashes coming from DB
    const formattedPath = imagePath.replace(/\\/g, "/");

    // 4. Construct full URL (Adding the missing slash)
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("📡 Fetching Service Data...");
        const response = await fetchServices();
        console.log("✅ Raw Response:", response);

        // 1. Resolve Data Structure
        // Handle axios (response.data) or fetch (response)
        let data = response.data || response;
        
        // If data is wrapped in another 'data' object (common in some setups)
        if (data.data) data = data.data;

        // If it's an array, take the first item
        if (Array.isArray(data)) {
            data = data[0]; 
        }

        // Check if we actually have data now
        if (!data) {
            console.warn("⚠️ No data found in response");
            return;
        }

        console.log("🛠️ Processed Data:", data);

        // --- FORCE 4 CARDS LOGIC ---
        // Ensure we map '_id' to 'id' if needed for frontend keys
        let currentList = (data.servicesList || []).map(item => ({
            ...item,
            id: item._id || item.id || `temp_${Date.now()}_${Math.random()}`
        }));

        // Pad with empty items until length is 4
        while (currentList.length < 4) {
            currentList.push({ 
                id: `temp_${Date.now()}_${currentList.length}`, 
                title: "", 
                subtitle: "", 
                image: null, 
                desc: "" 
            });
        }

        // Slice to ensure max 4
        currentList = currentList.slice(0, 4);

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
            
            servicesList: currentList,

            trustedText: data.trustedText || "",
            newsletterTitle: data.newsletterTitle || "",
            newsletterSubtitle: data.newsletterSubtitle || ""
        });

      } catch (error) {
        console.error("❌ Error loading Service Page data:", error);
      }
    };

    loadData();
  }, []);

  const introImgRef = useRef(null);
  const bannerImgRef = useRef(null); 

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setServicesData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardUpdate = (index, field, value) => {
    const newList = [...servicesData.servicesList];
    newList[index][field] = value;
    setServicesData(prev => ({ ...prev, servicesList: newList }));
  };

  const handleImageUpload = (e, key, index = null) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);

      if (index !== null) {
        // It's a service card image
        handleCardUpdate(index, 'image', previewUrl);
        // Store with specific key for backend mapping: "serviceImage_0", "serviceImage_1"
        setSelectedFiles(prev => ({ ...prev, [`serviceImage_${index}`]: file }));
      } else {
        // It's a top-level image (Banner or Intro)
        setServicesData(prev => ({ ...prev, [key]: previewUrl }));
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
      }
    }
  };

  // --- PUBLISH ---
  const handlePublish = async () => {
    setLoading(true);
    try {
        const formData = new FormData();

        // 1. Append simple text fields (excluding lists and image preview URLs)
        Object.keys(servicesData).forEach(key => {
            if (key !== 'servicesList' && !key.includes('Image') && !key.includes('Img')) {
                formData.append(key, servicesData[key]);
            }
        });

        // 2. Prepare and Append Services List
        // Remove temporary IDs and Image URLs (backend only needs text, images sent separately)
        const listToSend = servicesData.servicesList.map(item => {
             const cleanItem = { ...item };
             // Remove temp ID
             if (String(cleanItem.id).startsWith('temp_')) {
                 delete cleanItem.id;
             }
             // Don't send blob URL or full URL string to backend for 'image' field, 
             // the backend controller should handle mapping the uploaded file to this item.
             return cleanItem;
        });

        formData.append('servicesList', JSON.stringify(listToSend));

        // 3. Append Actual Files
        // Keys will be "bannerImage", "introSideImage", "serviceImage_0", etc.
        Object.keys(selectedFiles).forEach(key => {
            if(selectedFiles[key]) {
                formData.append(key, selectedFiles[key]);
            }
        });

        // 4. Send to Backend
        await updateService(formData);
        alert("✅ Services page updated successfully!");
        
        // Optional: Refresh data to get permanent IDs and final paths
        // window.location.reload();

    } catch (error) {
        console.error("Update failed:", error);
        alert("❌ Failed to update. Check console.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* CMS HEADER */}
      <div style={headerBarStyle}>
        <div>
          <h2 style={{ margin: 0, color: '#0f766e' }}>Services Master Manager</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Edit headings, descriptions, and images for all sections.</p>
        </div>
        <button onClick={handlePublish} style={publishBtnStyle} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
          {loading ? " Updating..." : " Publish Changes"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* 1. HERO & INTRO */}
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

          {/* 2. THE 4 SERVICE CARDS */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Layers size={20} color="#14b8a6" /> <h3>The 4 Service Cards Section</h3></div>
            
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
                <div key={service.id || index} style={serviceCardItem}>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                    <div onClick={() => document.getElementById(`card-up-${index}`).click()} style={thumbStyle}>
                      {service.image ? (
                        <img 
                            // 👇 USING THE HELPER HERE 👇
                            src={getImageUrl(service.image)} 
                            style={fullImg} 
                            alt="service" 
                        />
                      ) : (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                            <Upload size={18} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                    {/* Unique ID ensures specific mapping in handler */}
                    <input type="file" id={`card-up-${index}`} hidden onChange={(e) => handleImageUpload(e, 'servicesList', index)} />
                    <div style={{ flex: 1 }}>
                      <input style={smallInput} value={service.title} onChange={(e) => handleCardUpdate(index, 'title', e.target.value)} placeholder="Title" />
                      <input style={{ ...smallInput, marginTop: '5px', fontSize: '0.75rem' }} value={service.subtitle} onChange={(e) => handleCardUpdate(index, 'subtitle', e.target.value)} placeholder="Subtitle" />
                    </div>
                  </div>
                  <textarea style={{ ...smallInput, fontSize: '0.8rem' }} rows="2" value={service.desc} onChange={(e) => handleCardUpdate(index, 'desc', e.target.value)} placeholder="Card description..." />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* BANNER IMAGE */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Monitor size={18} color="#14b8a6" /> <h3>Main Hero Banner</h3></div>
            <div onClick={() => bannerImgRef.current.click()} style={bannerUploadBox}>
               {servicesData.bannerImage ? (
                  <img 
                    // 👇 USING THE HELPER HERE 👇
                    src={getImageUrl(servicesData.bannerImage)} 
                    style={fullImg} 
                    alt="banner" 
                  />
               ) : ( 
                  <div style={{ textAlign: 'center' }}><Upload color="#94a3b8" /><p style={{ fontSize: '0.8rem' }}>Upload Banner</p></div>
               )}
            </div>
            <input type="file" ref={bannerImgRef} hidden onChange={(e) => handleImageUpload(e, 'bannerImage')} />
          </section>

          {/* INTRO SIDE IMAGE */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><ImageIcon size={18} color="#14b8a6" /> <h3>Residential Intro Image</h3></div>
            <div onClick={() => introImgRef.current.click()} style={bannerUploadBox}>
               {servicesData.introSideImage ? (
                  <img 
                    // 👇 USING THE HELPER HERE 👇
                    src={getImageUrl(servicesData.introSideImage)} 
                    style={fullImg} 
                    alt="residential" 
                  />
               ) : (
                  <div style={{ textAlign: 'center' }}><Upload color="#94a3b8" /><p style={{ fontSize: '0.8rem' }}>Upload side image</p></div>
               )}
            </div>
            <input type="file" ref={introImgRef} hidden onChange={(e) => handleImageUpload(e, 'introSideImage')} />
          </section>

          {/* TRUST SECTION */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Users size={18} color="#14b8a6" /> <h3>Trust Section</h3></div>
            <label style={labelStyle}>Client Trust Text</label>
            <input name="trustedText" style={inputStyle} value={servicesData.trustedText} onChange={handleTextChange} />
          </section>

          {/* NEWSLETTER SECTION */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}><Send size={18} color="#14b8a6" /> <h3>Newsletter Content</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

// --- STYLES ---
const headerBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const publishBtnStyle = { backgroundColor: '#14b8a6', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', justifyContent: 'center' };
const cardStyle = { background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' };
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' };
const serviceCardItem = { padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' };
const thumbStyle = { width: '80px', height: '60px', background: '#e2e8f0', borderRadius: '6px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const smallInput = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' };
const bannerUploadBox = { width: '100%', height: '180px', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };

export default FullServicesManager; 