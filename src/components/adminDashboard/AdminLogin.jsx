import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import "./AdminLogin.css";
import { login } from "../../services/adminAPI";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ email, password });

      if (response?.success) {
        localStorage.setItem("token", response.token);
        window.location.href = "/admin";
      } else {
        setError(response?.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        {/* Header */}
        <div className="login-header">
          <h1 className="brand-title">EcoGlow</h1>
          <p className="subtitle">Admin Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {error && <p className="error-text">{error}</p>}

          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
