import React, { useState, useEffect } from "react";
import { fetchHeader, updateHeader } from "../../services/headerAPI";
import { 
  Save, 
  Phone, 
  MessageCircle, 
  Loader2 
} from "lucide-react";
import "./HeaderManager.css"; // Uses the CSS file we created earlier

const HeaderManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Simplified State
  const [formData, setFormData] = useState({
    contactWhatsApp: "",
    contactPhone: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchHeader();
      const data = response.data || response || {};

      setFormData({
        contactWhatsApp: data.contactWhatsApp || "",
        contactPhone: data.contactPhone || "",
      });
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // We still use FormData to match the backend 'upload.none()' expectation
      const dataToSend = new FormData();
      dataToSend.append("contactWhatsApp", formData.contactWhatsApp);
      dataToSend.append("contactPhone", formData.contactPhone);

      await updateHeader(dataToSend);
      alert("✅ Contacts updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("❌ Failed to update contacts.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="header-manager-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Loader2 className="animate-spin" style={{color: '#2563eb'}} size={32} />
    </div>
  );

  return (
    <div className="header-manager-container">
      <div className="header-row">
        <div>
          <h1 className="page-title">Header Contacts</h1>
          <p className="page-subtitle">Manage public contact numbers.</p>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="btn-save">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="admin-card">
          <h2 className="card-title">Contact Information</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            <div className="form-group">
              <label className="input-label">
                <MessageCircle size={16} color="#22c55e" /> WhatsApp Number
              </label>
              <input
                type="text"
                name="contactWhatsApp"
                value={formData.contactWhatsApp}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="form-input"
              />
              <p style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem'}}>
                This number will be linked to the WhatsApp button.
              </p>
            </div>

            <div className="form-group">
              <label className="input-label">
                <Phone size={16} color="#3b82f6" /> Phone Number
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="form-input"
              />
               <p style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem'}}>
                This number will appear in the top header bar.
              </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default HeaderManager;