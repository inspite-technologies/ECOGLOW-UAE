import React, { useState, useEffect, useRef } from "react";
import { Save, Upload, Check, Info } from "lucide-react";
import { fetchBanner, updateBanner } from "../../services/bannerAPI";
import "./AdminStyles.css";

const API_BASE_URL = "http://localhost:5000";

function BannerAdmin() {
  const [inputs, setInputs] = useState({
    image: "",
    text: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

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
        image: banner.image
          ? `${API_BASE_URL}/${banner.image.replace(/\\/g, "/")}`
          : "",
        text: banner.text || "",
      });

      setImageFile(null);
    } catch (err) {
      console.error("Fetch banner failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE HANDLER =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setInputs((prev) => ({
      ...prev,
      image: URL.createObjectURL(file), // preview
    }));
  };

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // append text
    formData.append("text", inputs.text);

    // append image only if selected
    if (imageFile instanceof File) {
      formData.append("bannerImage", imageFile); // Must match multer field name
    }

    // Do NOT set JSON headers; let Axios handle multipart
    await updateBanner(formData);

    alert("Banner updated successfully");
    loadBanner();
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update banner");
  }
};


  if (loading) {
    return <div className="admin-container">Loading banner...</div>;
  }

  return (
    <div className="admin-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
          <h2>Banner Settings</h2>
          <p>Manage banner image and headline text</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="admin-grid-2">
        {/* IMAGE */}
        <div className="admin-card">
          <div className="input-group">
            <label className="input-label">Banner Image</label>

            <div
              className="banner-upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              {inputs.image ? (
                <img src={inputs.image} alt="Banner" />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Upload size={32} />
                  <p>Click to upload</p>
                </div>
              )}
            </div>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
            />

            {inputs.image && (
              <div className="status-text">
                <Check size={14} />
                {imageFile ? "New image selected" : "Loaded from server"}
              </div>
            )}
          </div>

          <div className="info-box">
            <Info size={16} />
            <p>Recommended size: 1920×800px</p>
          </div>
        </div>

        {/* TEXT */}
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
        </div>
      </div>
    </div>
  );
}

export default BannerAdmin;
