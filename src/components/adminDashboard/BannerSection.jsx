import React, { useState, useEffect, useRef } from "react";
import { Save, Upload, Check, Info, Loader2 } from "lucide-react";
import { fetchBanner, updateBanner } from "../../services/bannerAPI";
import "./AdminStyles.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path.replace(/\\/g, "/")}`;
};

function BannerAdmin() {
  const [inputs, setInputs] = useState({
    text: "",
    beforePreview: "",
    afterPreview: "",
  });

  const [files, setFiles] = useState({
    beforeFile: null,
    afterFile: null,
  });

  const [loading, setLoading] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  // ================= FETCH BANNER =================
  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      setLoading(true);
      const res = await fetchBanner();
      const banner = res.data || res;

      setInputs({
        text: banner.text || "",
        beforePreview: getImageUrl(banner.beforeImage),
        afterPreview: getImageUrl(banner.afterImage),
      });

      setFiles({ beforeFile: null, afterFile: null });
    } catch (err) {
      console.error("Fetch banner failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE COMPRESSION =================
  const compressAsWebP = (canvas, originalFile) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], originalFile.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now()
          });
          console.log(`Original: ${(originalFile.size / 1024 / 1024).toFixed(2)}MB`);
          console.log(`Compressed WebP: ${(compressedFile.size / 1024).toFixed(2)}KB`);
          resolve(compressedFile);
        },
        'image/webp',
        0.80
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
          
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const fileExt = file.name.split('.').pop().toLowerCase();
          
          if (fileExt === 'avif') {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.avif'), {
                    type: 'image/avif',
                    lastModified: Date.now()
                  });
                  console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                  console.log(`Compressed AVIF: ${(compressedFile.size / 1024).toFixed(2)}KB`);
                  resolve(compressedFile);
                } else {
                  console.warn('AVIF encoding not supported, converting to WebP');
                  compressAsWebP(canvas, file).then(resolve);
                }
              },
              'image/avif',
              0.65
            );
          } else {
            compressAsWebP(canvas, file).then(resolve);
          }
        };
        img.onerror = () => reject(new Error('Image loading failed'));
      };
      reader.onerror = () => reject(new Error('File reading failed'));
    });
  };

  // ================= IMAGE HANDLERS =================
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCompressing(true);
      
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileSizeMB = file.size / 1024 / 1024;
      
      let finalFile = file;
      
      // Only compress if file is larger than 500KB
      if (fileSizeMB > 0.5) {
        console.log(`Compressing ${type} image (${fileExt.toUpperCase()}): ${fileSizeMB.toFixed(2)}MB`);
        finalFile = await compressImage(file);
      } else {
        console.log(`${type} image already optimized: ${fileSizeMB.toFixed(2)}MB`);
      }

      const previewUrl = URL.createObjectURL(finalFile);

      if (type === "before") {
        setFiles((prev) => ({ ...prev, beforeFile: finalFile }));
        setInputs((prev) => ({ ...prev, beforePreview: previewUrl }));
      } else {
        setFiles((prev) => ({ ...prev, afterFile: finalFile }));
        setInputs((prev) => ({ ...prev, afterPreview: previewUrl }));
      }
      
    } catch (error) {
      console.error('Image compression error:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  // ================= SAVE =================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("text", inputs.text);

      if (files.beforeFile) {
        formData.append("beforeImage", files.beforeFile);
      }
      if (files.afterFile) {
        formData.append("afterImage", files.afterFile);
      }

      await updateBanner(formData);

      alert("Banner updated successfully");
      loadBanner(); 
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  return (
    <div className="admin-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
          <h2>Banner Settings</h2>
          <p>Manage "Before & After" slider images and headline text</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || compressing}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? " Saving..." : " Save Changes"}
        </button>
      </div>

      {/* COMPRESSION STATUS */}
      {compressing && (
        <div className="admin-card" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Loader2 className="animate-spin" size={20} />
            <span>Compressing image...</span>
          </div>
        </div>
      )}

      <div className="admin-grid-2">
        {/* --- LEFT COLUMN: IMAGES --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* BEFORE IMAGE CARD */}
          <div className="admin-card">
            <div className="input-group">
              <label className="input-label">"Before" Image (Background)</label>
              <div
                className="banner-upload-box"
                onClick={() => beforeInputRef.current.click()}
                style={{ cursor: 'pointer' }}
              >
                {inputs.beforePreview ? (
                  <img 
                    src={inputs.beforePreview} 
                    alt="Before Preview"
                    loading="lazy"
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <Upload size={32} />
                    <p>Upload 'Before' Image</p>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block' }}>
                      Supports: PNG, JPG, WebP, AVIF
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                ref={beforeInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                onChange={(e) => handleFileChange(e, "before")}
              />
              {inputs.beforePreview && (
                <div className="status-text">
                  <Check size={14} />
                  {files.beforeFile ? "New file selected" : "Current image"}
                </div>
              )}
            </div>
          </div>

          {/* AFTER IMAGE CARD */}
          <div className="admin-card">
            <div className="input-group">
              <label className="input-label">"After" Image (Reveal)</label>
              <div
                className="banner-upload-box"
                onClick={() => afterInputRef.current.click()}
                style={{ cursor: 'pointer' }}
              >
                {inputs.afterPreview ? (
                  <img 
                    src={inputs.afterPreview} 
                    alt="After Preview"
                    loading="lazy"
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <Upload size={32} />
                    <p>Upload 'After' Image</p>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', display: 'block' }}>
                      Supports: PNG, JPG, WebP, AVIF
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                ref={afterInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                onChange={(e) => handleFileChange(e, "after")}
              />
              {inputs.afterPreview && (
                <div className="status-text">
                  <Check size={14} />
                  {files.afterFile ? "New file selected" : "Current image"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: TEXT --- */}
        <div className="admin-card">
          <div className="input-group">
            <label className="input-label">Headline Text</label>
            <textarea
              className="form-input"
              rows="5"
              value={inputs.text}
              onChange={(e) =>
                setInputs({ ...inputs, text: e.target.value })
              }
              placeholder="Enter banner headline..."
            />
          </div>
          
          <div className="info-box" style={{ marginTop: '20px' }}>
            <Info size={16} />
            <p>Recommended size for both images: 1920×800px</p>
            <p style={{ marginTop: '5px', fontSize:'12px' }}>
              Ensure both images have the exact same dimensions for the slider to work perfectly.
            </p>
            <p style={{ marginTop: '10px', fontSize:'12px', color: '#10b981' }}>
              ✓ Images will be automatically compressed to ~100-200KB
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BannerAdmin;