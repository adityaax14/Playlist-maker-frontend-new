import React, { useState } from "react";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res?.data?.user) {
        setUser(res.data.user);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Animated background ── */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
      </div>

      {/* ── Left hero ── */}
      <div className="auth-hero">
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
          </svg>
          <span>PlaylistHub</span>
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-tag">✦ Free forever</div>
          <h1 className="auth-hero-title">
            Learn with<br />
            <em>purpose.</em>
          </h1>
          <p className="auth-hero-sub">
            Organize YouTube videos into structured learning paths.
            Track progress, share with others, and never lose your place.
          </p>

          <ul className="auth-features">
  <li>
    <span className="feat-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
        <path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>
      </svg>
    </span>
    <span>Curate learning playlists</span>
  </li>
  <li>
    <span className="feat-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    </span>
    <span>Track your progress deeply</span>
  </li>
  <li>
    <span className="feat-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    </span>
    <span>Explore trending playlists</span>
  </li>
  <li>
    <span className="feat-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </span>
    <span>Rate &amp; comment with the community</span>
  </li>
</ul>
        </div>

        <div className="auth-hero-stat-row">
          <div className="auth-stat">
            <span className="auth-stat-val">100%</span>
            <span className="auth-stat-label">Free</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-val">∞</span>
            <span className="auth-stat-label">Playlists</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-val">0</span>
            <span className="auth-stat-label">Ads</span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-panel">
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button className="auth-tab auth-tab--active">Sign In</button>
            <button className="auth-tab" onClick={() => navigate("/register")}>Create Account</button>
          </div>

          <div className="auth-card-body">
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-sub">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Email</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-field-row">
                  <label>Password</label>
                  <span className="auth-forgot" onClick={() => navigate("/forgot-password")}>
                    Forgot password?
                  </span>
                </div>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : "Sign In →"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>Create one free</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}