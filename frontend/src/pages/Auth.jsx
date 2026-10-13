import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
    remember: true,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!form.agree) {
        setError("Please accept the Terms of Service.");
        return;
      }
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      const user = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: "Public User",
      };

      if (!user.name) {
        setError("Please enter your full name.");
        return;
      }

      localStorage.setItem("smartbinUser", JSON.stringify(user));
    } else {
      const savedUser = localStorage.getItem("smartbinUser");

      try {
        if (savedUser) {
          const user = JSON.parse(savedUser);

          if (
            user.email &&
            user.email.toLowerCase() === form.email.trim().toLowerCase()
          ) {
            localStorage.setItem("smartbinUser", JSON.stringify(user));
          }
        }
      } catch {
        localStorage.removeItem("smartbinUser");
      }
    }

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <Link to="/home" className="auth-logo">
          <span className="recycle-logo">♻</span>
          <span>Smart<span>Bin</span></span>
        </Link>
        <p className="brand-subtitle">Smart Waste Management</p>

        <div className="brand-message">
          <h1>
            Cleaner Cities
            <br />Start with
            <br /><span>Smarter People.</span>
          </h1>
          <p>Report. Monitor. Recycle.</p>
          <p>Together for a greener tomorrow.</p>
        </div>

        <div className="eco-scene">
          <div className="eco-skyline">🌳 🏙️ 🌳 🏢 🌳</div>
          <div className="eco-bins">
            <div className="eco-bin green-bin">♻<small>PLASTIC</small></div>
            <div className="eco-bin blue-bin">♻<small>PAPER</small></div>
            <div className="eco-bin yellow-bin">♻<small>ORGANIC</small></div>
          </div>
        </div>

        <div className="brand-footer">
          <span>🌿 Cleaner Environment</span>
          <span>👥 Active Communities</span>
          <span>♻ Smarter Waste Management</span>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <Link to="/home" className="mobile-logo">
            ♻ Smart<span>Bin</span>
          </Link>

          <h2>
            {mode === "login" ? "Welcome Back! 👋" : "Create Your Account ✨"}
          </h2>
          <p className="auth-description">
            {mode === "login"
              ? "Sign in to continue to SmartBin"
              : "Join SmartBin and help build cleaner cities"}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={update}
                  autoComplete="name"
                  required
                />
              </>
            )}

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={update}
              autoComplete="email"
              required
            />

            {mode === "signup" && (
              <>
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={update}
                  autoComplete="tel"
                />
              </>
            )}

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                value={form.password}
                onChange={update}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((old) => !old)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {mode === "signup" && (
              <>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={update}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={update}
                  />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>
              </>
            )}

            {mode === "login" && (
              <div className="auth-options">
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={update}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setError("Password recovery needs backend setup.")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit">
              {mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <button
            type="button"
            className="social-button"
            onClick={() => setError("Google sign-in is not configured yet.")}
          >
            <span className="google-mark">G</span> Continue with Google
          </button>

          <button
            type="button"
            className="social-button"
            onClick={() => setError("Microsoft sign-in is not configured yet.")}
          >
            <span>▦</span> Continue with Microsoft
          </button>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>

          <Link to="/home" className="back-home">← Back to SmartBin home</Link>
        </div>
      </section>
    </div>
  );
}

