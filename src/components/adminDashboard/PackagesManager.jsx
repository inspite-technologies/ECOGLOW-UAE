import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Layout, Info, Plus, Trash2, 
  Image as ImageIcon, Table as TableIcon, AlignLeft, 
  PlusCircle, Package, Briefcase, Loader2, MinusCircle, X,
  Link as LinkIcon, MessageCircle
} from 'lucide-react';
import { fetchPackages, updatePackages } from '../../services/packageAPI';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- STYLES ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' };
const publishBtn = { backgroundColor: '#80cbc4', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
const addSectionBtn = { backgroundColor: '#fff', color: '#5ab3ac', border: '1px solid #5ab3ac', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
const cardWrapper = { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' };
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' };
const topRowGrid = { display: 'flex', gap: '30px', alignItems: 'flex-start' };
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: '#fcfdfd', boxSizing: 'border-box' };
const imageBox = { width: '100%', height: '110px', border: '2px dashed #cbd5e1', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };
const imgRemoveBtn = { position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const tableWrap = { border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' };
const nakedInput = { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#334155', boxSizing: 'border-box' };
const headerCell = { ...inputStyle, borderRadius: 0, border: 'none', background: '#80cbc4', color: 'white', fontWeight: 'bold' };
const addRowBtn = { background: 'none', border: 'none', color: '#80cbc4', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' };
const tableDelBtn = { color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '0 12px', cursor: 'pointer', height: '45px' };
const rowDelBtn = { border:'none', background:'none', cursor:'pointer', color:'#ef4444' };
const rowDelAction = { display:'flex', alignItems:'center', justifyContent:'center' };
const tableFooter = { display: 'flex', gap: '20px', padding: '15px', background: '#fcfdfd', borderTop:'1px solid #e2e8f0' };
const colControl = { display:'flex', gap:'5px', alignItems:'center', background:'#f1f5f9', padding:'8px', borderRadius:'8px', height: '45px', boxSizing: 'border-box' };
const miniBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' };
const cardBox = { background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' };

// --- SUB-COMPONENT: CARD INPUTS ---
const CardInputGroup = ({ title, titleColor, cardData, onChange }) => {
  return (
    <div style={cardBox}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px', fontWeight: 'bold', color: titleColor, textTransform: 'capitalize' }}>
        {title}
      </div>
      
      <label style={labelStyle}>Title</label>
      <input style={{...inputStyle, marginBottom: '10px'}} value={cardData.title} onChange={(e) => onChange('title', e.target.value)} />
      
      <label style={labelStyle}>Features</label>
      <textarea style={{...inputStyle, minHeight: '120px', marginBottom: '10px', fontSize: '0.85rem'}} value={cardData.features} onChange={(e) => onChange('features', e.target.value)} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
            <label style={labelStyle}>Price</label>
            <input style={inputStyle} value={cardData.price} onChange={(e) => onChange('price', e.target.value)} />
        </div>
        <div>
            <label style={labelStyle}>Minimum</label>
            <input style={inputStyle} value={cardData.min} onChange={(e) => onChange('min', e.target.value)} />
        </div>
        <div>
            <label style={labelStyle}>Depend</label>
            <input style={inputStyle} placeholder="(Optional)" value={cardData.depend || ""} onChange={(e) => onChange('depend', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
            <label style={labelStyle}>Book Now Link</label>
            <input style={inputStyle} placeholder="tel:..." value={cardData.bookNow || ""} onChange={(e) => onChange('bookNow', e.target.value)} />
        </div>
        <div>
            <label style={labelStyle}>WhatsApp Link</label>
            <input style={inputStyle} placeholder="wa.me/..." value={cardData.whatsappNow || ""} onChange={(e) => onChange('whatsappNow', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

// --- ✅ SUB-COMPONENT: COMMON INFO INPUTS (Extra Column) ---
const CommonInputGroup = ({ title, cardData, onChange }) => {
    return (
      <div style={{ ...cardBox, background: '#f0fdfa', borderColor: '#ccfbf1' }}>
        <div style={{ borderBottom: '1px solid #ccfbf1', paddingBottom: '10px', marginBottom: '10px', fontWeight: 'bold', color: '#0f766e', textTransform: 'capitalize' }}>
          {title}
        </div>
        
        <label style={labelStyle}>Common Title</label>
        <input style={{...inputStyle, marginBottom: '10px'}} value={cardData.title || ""} onChange={(e) => onChange('title', e.target.value)} placeholder="e.g. Both Packages Include" />
        
        <label style={labelStyle}>Common Features</label>
        <textarea 
            style={{...inputStyle, minHeight: '220px', fontSize: '0.85rem'}} 
            value={cardData.features || ""} 
            onChange={(e) => onChange('features', e.target.value)} 
            placeholder="List features that apply to both..."
        />
      </div>
    );
};

const PackagesManager = () => {
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);

  // --- INITIAL STATE ---
  const [packagesData, setPackagesData] = useState({
    heroSmall: "",
    heroLarge: "",
    heroBannerImg: null, 
    introLabel: "",
    introTitle: "",
    introDesc: "",
    residential: {
      heading: "",
      card1: { title: "", features: "", price: "", min: "", depend: "", bookNow: "", whatsappNow: "" },
      card2: { title: "", features: "", price: "", min: "", depend: "", bookNow: "", whatsappNow: "" },
      // ✅ Added Common
      common: { title: "", features: "" }
    },
    commercial: {
      heading: "",
      card1: { title: "", features: "", price: "", min: "", depend: "", bookNow: "", whatsappNow: "" },
      card2: { title: "", features: "", price: "", min: "", depend: "", bookNow: "", whatsappNow: "" },
      // ✅ Added Common
      common: { title: "", features: "" }
    },
    tables: []
  });

  const fileRefs = { hero: useRef(null) };

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http")) return imagePath;
    const formattedPath = imagePath.replace(/\\/g, "/");
    return `${SERVER_URL}/${formattedPath}`;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPackages();
        let data = response;
        if (data.data && data.status) data = data.data; 
        if (data.data) data = data.data; 
        if (Array.isArray(data)) data = data[0]; 

        if (!data) return;

        // Migrate Tables
        const migratedTables = (data.tables || []).map(table => {
            const cols = table.columns?.length > 0 ? table.columns : ["Service", "Price"]; 
            const rows = (table.rows || []).map(row => ({
                ...row,
                cells: row.cells?.length > 0 ? row.cells : [row.c1 || "", row.c2 || ""].slice(0, cols.length),
                depend: row.depend || "" 
            }));
            
            return { 
                ...table, 
                columns: cols, 
                rows: rows,
                bookNow: table.bookNow || "", 
                whatsappNow: table.whatsappNow || "" 
            };
        });

        const safeCard = (cardData) => ({
            title: cardData?.title || "",
            features: cardData?.features || "",
            price: cardData?.price || "",
            min: cardData?.min || "",
            depend: cardData?.depend || "",
            bookNow: cardData?.bookNow || "",
            whatsappNow: cardData?.whatsappNow || ""
        });

        // ✅ Helper for Common
        const safeCommon = (commonData) => ({
            title: commonData?.title || "",
            features: commonData?.features || ""
        });

        setPackagesData({
            heroSmall: data.heroSmall || "",
            heroLarge: data.heroLarge || "",
            heroBannerImg: data.heroBannerImg || null,
            introLabel: data.introLabel || "",
            introTitle: data.introTitle || "",
            introDesc: data.introDesc || "",
            residential: {
                heading: data.residential?.heading || "Residential",
                card1: safeCard(data.residential?.card1),
                card2: safeCard(data.residential?.card2),
                common: safeCommon(data.residential?.common)
            },
            commercial: {
                heading: data.commercial?.heading || "Commercial",
                card1: safeCard(data.commercial?.card1),
                card2: safeCard(data.commercial?.card2),
                common: safeCommon(data.commercial?.common)
            },
            tables: migratedTables
        });
      } catch (error) {
        console.error("❌ Error loading Packages data:", error);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setPackagesData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
        setPackagesData(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
        if (key === 'heroBannerImg') setBannerFile(file);
    }
  };

  const removeBanner = (e) => {
    e.stopPropagation();
    setPackagesData(prev => ({ ...prev, heroBannerImg: null }));
    setBannerFile(null);
    if (fileRefs.hero.current) fileRefs.hero.current.value = "";
  };

  const handlePackageCardChange = (sectionKey, cardKey, field, value) => {
    setPackagesData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [cardKey]: { ...prev[sectionKey][cardKey], [field]: value }
      }
    }));
  };

  const handleSectionHeadingChange = (sectionKey, value) => {
    setPackagesData(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], heading: value }
    }));
  };

  // --- DYNAMIC TABLE HANDLERS ---
  const createNewTable = () => {
    const newTable = {
      id: `table-${Date.now()}`,
      sectionLabel: "New Section",
      title: "New Service Table",
      columns: ["Service", "Price"],
      rows: [{ cells: ["New Item", "0"], isSubheader: false, depend: "" }],
      bookNow: "",     
      whatsappNow: ""  
    };
    setPackagesData(prev => ({ ...prev, tables: [...prev.tables, newTable] }));
  };

  const updateColumnCount = (tIdx, delta) => {
    const newTables = [...packagesData.tables];
    const table = newTables[tIdx];
    if (delta > 0) {
        table.columns.push(`Col ${table.columns.length + 1}`);
        table.rows.forEach(row => row.cells.push(""));
    } else {
        if (table.columns.length <= 1) return;
        table.columns.pop();
        table.rows.forEach(row => row.cells.pop());
    }
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const updateHeader = (tIdx, cIdx, value) => {
    const newTables = [...packagesData.tables];
    newTables[tIdx].columns[cIdx] = value;
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const updateCell = (tIdx, rIdx, cIdx, value) => {
    const newTables = [...packagesData.tables];
    newTables[tIdx].rows[rIdx].cells[cIdx] = value;
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const updateRowDepend = (tIdx, rIdx, value) => {
    const newTables = [...packagesData.tables];
    newTables[tIdx].rows[rIdx].depend = value;
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const addRow = (tIdx, isSub) => {
    const newTables = [...packagesData.tables];
    const colCount = newTables[tIdx].columns.length;
    const newCells = new Array(colCount).fill("");
    if(isSub && colCount > 0) newCells[0] = "NEW SUBHEADER"; 
    else if(colCount > 0) newCells[0] = "New Item";
    
    newTables[tIdx].rows.push({ cells: newCells, isSubheader: isSub, depend: "" });
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const deleteRow = (tIdx, rIdx) => {
    const newTables = [...packagesData.tables];
    newTables[tIdx].rows.splice(rIdx, 1);
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  const updateTableMetadata = (tIdx, field, value) => {
    const newTables = [...packagesData.tables];
    newTables[tIdx][field] = value;
    setPackagesData(prev => ({ ...prev, tables: newTables }));
  };

  // --- PUBLISH ---
  const handlePublish = async () => {
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append('heroSmall', packagesData.heroSmall);
        formData.append('heroLarge', packagesData.heroLarge);
        formData.append('introLabel', packagesData.introLabel);
        formData.append('introTitle', packagesData.introTitle);
        formData.append('introDesc', packagesData.introDesc);
        formData.append('residential', JSON.stringify(packagesData.residential));
        formData.append('commercial', JSON.stringify(packagesData.commercial));
        formData.append('tables', JSON.stringify(packagesData.tables));

        if (bannerFile) {
            formData.append('heroBannerImg', bannerFile);
        } else if (!packagesData.heroBannerImg) {
            formData.append('heroBannerImg', ""); 
        }
        
        await updatePackages(formData);
        alert("✅ Packages updated successfully!");
    } catch (error) {
        console.error("Update failed:", error);
        alert("❌ Failed to update. Check console.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f4f7f6' }}>
      
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#5ab3ac' }}>Packages Content Manager</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={addSectionBtn} onClick={createNewTable}><PlusCircle size={18} /> Add Table</button>
          <button style={publishBtn} onClick={handlePublish} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
            {loading ? " Saving..." : " Publish Changes"}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* 1. HERO SECTION */}
        <section style={cardWrapper}>
          <div style={sectionHeader}><Layout size={20} color="#80cbc4" /> <h3>1. Hero & Banner</h3></div>
          <div style={topRowGrid}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Hero Text</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                <input name="heroSmall" style={inputStyle} value={packagesData.heroSmall} onChange={handleTextChange} placeholder="Small Text" />
                <input name="heroLarge" style={inputStyle} value={packagesData.heroLarge} onChange={handleTextChange} placeholder="Large Title" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Banner Image</label>
              <div style={imageBox} onClick={() => fileRefs.hero.current.click()}>
                {packagesData.heroBannerImg ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={getImageUrl(packagesData.heroBannerImg)} style={fullImg} alt="Hero" />
                        <button onClick={removeBanner} style={imgRemoveBtn} title="Remove Image"><X size={14}/></button>
                    </div>
                ) : ( 
                    <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                        <ImageIcon size={24} />
                        <p style={{ fontSize: '0.65rem', marginTop: '5px' }}>Click to Upload</p>
                    </div> 
                )}
              </div>
              <input type="file" ref={fileRefs.hero} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'heroBannerImg')} />
            </div>
          </div>
        </section>

        {/* 2. INTRO SECTION */}
        <section style={cardWrapper}>
          <div style={sectionHeader}><Info size={20} color="#80cbc4" /> <h3>2. Intro Section</h3></div>
          <input name="introLabel" style={{ ...inputStyle, color: '#80cbc4', fontWeight: 'bold', marginBottom: '10px' }} value={packagesData.introLabel} onChange={handleTextChange} placeholder="Label (e.g. OUR PRICING)" />
          <input name="introTitle" style={{ ...inputStyle, marginBottom: '10px' }} value={packagesData.introTitle} onChange={handleTextChange} placeholder="Main Title" />
          <textarea name="introDesc" style={{ ...inputStyle, minHeight: '80px' }} value={packagesData.introDesc} onChange={handleTextChange} placeholder="Description paragraph..." />
        </section>

        {/* 3. RESIDENTIAL */}
        <section style={cardWrapper}>
          <div style={sectionHeader}><Package size={20} color="#80cbc4" /> <h3>3. Residential Packages</h3></div>
          <input style={{...inputStyle, marginBottom:'20px'}} value={packagesData.residential.heading} onChange={(e) => handleSectionHeadingChange('residential', e.target.value)} placeholder="Residential Heading" />
          
          {/* ✅ UPDATED GRID: 3 COLUMNS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
             <CardInputGroup 
                title="Card 1 (With Materials)" 
                titleColor="#5ab3ac" 
                cardData={packagesData.residential.card1} 
                onChange={(field, val) => handlePackageCardChange('residential', 'card1', field, val)} 
             />
             <CardInputGroup 
                title="Card 2 (Without)" 
                titleColor="#5ab3ac" 
                cardData={packagesData.residential.card2} 
                onChange={(field, val) => handlePackageCardChange('residential', 'card2', field, val)} 
             />
             {/* ✅ Extra Column */}
             <CommonInputGroup 
                title="Common Features"
                cardData={packagesData.residential.common}
                onChange={(field, val) => handlePackageCardChange('residential', 'common', field, val)}
             />
          </div>
        </section>

        {/* 4. COMMERCIAL */}
        <section style={cardWrapper}>
          <div style={sectionHeader}><Briefcase size={20} color="#80cbc4" /> <h3>4. Commercial Packages</h3></div>
          <input style={{...inputStyle, marginBottom:'20px'}} value={packagesData.commercial.heading} onChange={(e) => handleSectionHeadingChange('commercial', e.target.value)} placeholder="Commercial Heading" />
          
          {/* ✅ UPDATED GRID: 3 COLUMNS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
             <CardInputGroup 
                title="Card 1" 
                titleColor="#5ab3ac" 
                cardData={packagesData.commercial.card1} 
                onChange={(field, val) => handlePackageCardChange('commercial', 'card1', field, val)} 
             />
             <CardInputGroup 
                title="Card 2" 
                titleColor="#5ab3ac" 
                cardData={packagesData.commercial.card2} 
                onChange={(field, val) => handlePackageCardChange('commercial', 'card2', field, val)} 
             />
             {/* ✅ Extra Column */}
             <CommonInputGroup 
                title="Common Features"
                cardData={packagesData.commercial.common}
                onChange={(field, val) => handlePackageCardChange('commercial', 'common', field, val)}
             />
          </div>
        </section>

        {/* 5. DYNAMIC TABLES */}
        <section style={cardWrapper}>
          <div style={sectionHeader}><TableIcon size={20} color="#80cbc4" /> <h3>5. Dynamic Services Tables</h3></div>
          {packagesData.tables.map((table, tIdx) => (
            <div key={table.id || tIdx} style={{ marginBottom: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={labelStyle}>Section Label</label>
                  <input style={{ ...inputStyle, color: '#80cbc4', fontWeight: 'bold' }} value={table.sectionLabel} onChange={(e) => updateTableMetadata(tIdx, 'sectionLabel', e.target.value)} />
                </div>
                <div style={{ flex: 2, minWidth: '200px' }}>
                  <label style={labelStyle}>Table Title</label>
                  <input style={{ ...inputStyle, fontWeight: 'bold' }} value={table.title} onChange={(e) => updateTableMetadata(tIdx, 'title', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={colControl}>
                        <span style={{fontSize:'0.75rem', fontWeight:'bold', color:'#64748b'}}>COLS:</span>
                        <button onClick={() => updateColumnCount(tIdx, -1)} style={miniBtn}><MinusCircle size={16}/></button>
                        <span style={{fontWeight:'bold', width:'20px', textAlign:'center'}}>{table.columns.length}</span>
                        <button onClick={() => updateColumnCount(tIdx, 1)} style={{...miniBtn, color: '#0f766e'}}><PlusCircle size={16}/></button>
                    </div>
                    <button style={tableDelBtn} onClick={() => {
                      const filtered = packagesData.tables.filter((_, i) => i !== tIdx);
                      setPackagesData(prev => ({...prev, tables: filtered}));
                    }}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                <div>
                    <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px'}}>
                        <LinkIcon size={12}/> Book Now Number
                    </label>
                    <input 
                        style={inputStyle} 
                        placeholder="e.g. +971500000000" 
                        value={table.bookNow || ""} 
                        onChange={(e) => updateTableMetadata(tIdx, 'bookNow', e.target.value)} 
                    />
                </div>
                <div>
                    <label style={{...labelStyle, display:'flex', alignItems:'center', gap:'5px', color:'#22c55e'}}>
                        <MessageCircle size={12}/> WhatsApp Number
                    </label>
                    <input 
                        style={inputStyle} 
                        placeholder="e.g. +971500000000" 
                        value={table.whatsappNow || ""} 
                        onChange={(e) => updateTableMetadata(tIdx, 'whatsappNow', e.target.value)} 
                    />
                </div>
              </div>

              <div style={tableWrap}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${table.columns.length}, 1fr) 100px 40px`, borderBottom: '2px solid #80cbc4' }}>
                    {table.columns.map((col, cIdx) => (
                        <input key={`h-${cIdx}`} value={col} onChange={(e) => updateHeader(tIdx, cIdx, e.target.value)} style={headerCell} />
                    ))}
                    <div style={{...headerCell, fontSize:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center'}}>Depend?</div>
                    <div style={{background:'#80cbc4'}}></div>
                </div>

                {/* Rows */}
                {table.rows.map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: `repeat(${table.columns.length}, 1fr) 100px 40px`, background: row.isSubheader ? '#f0fdfa' : 'white', borderBottom: '1px solid #f1f5f9' }}>
                        {row.cells.map((cell, cIdx) => {
                            if (row.isSubheader) {
                                if (cIdx === 0) return (
                                  <input key={`c-${rIdx}-${cIdx}`} value={cell} onChange={(e) => updateCell(tIdx, rIdx, cIdx, e.target.value)} style={{...nakedInput, padding: '12px', fontWeight: 'bold', color: '#0f766e', textAlign: 'center', gridColumn: `1 / span ${table.columns.length}`}} placeholder="Subheader Title" />
                                );
                                return null;
                            }
                            return <input key={`c-${rIdx}-${cIdx}`} value={cell} onChange={(e) => updateCell(tIdx, rIdx, cIdx, e.target.value)} style={{...nakedInput, padding: '12px'}} />;
                        })}
                        
                        {!row.isSubheader ? (
                            <input 
                              value={row.depend || ""} 
                              onChange={(e) => updateRowDepend(tIdx, rIdx, e.target.value)} 
                              style={{...nakedInput, padding: '12px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center'}} 
                              placeholder="e.g. Survey" 
                            />
                        ) : <div />}

                        <div style={rowDelAction}>
                            <button onClick={() => deleteRow(tIdx, rIdx)} style={rowDelBtn}><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))}

                <div style={tableFooter}>
                  <button onClick={() => addRow(tIdx, false)} style={addRowBtn}><Plus size={14} /> Add Service Row</button>
                  <button onClick={() => addRow(tIdx, true)} style={{ ...addRowBtn, color: '#64748b' }}><AlignLeft size={14} /> Add Subheader</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default PackagesManager;