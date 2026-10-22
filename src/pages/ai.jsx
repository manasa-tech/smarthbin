import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Leaf, Mail, LockKeyhole, UserRound, Phone, ArrowRight } from "lucide-react";
import { getProfile, saveProfile } from "../utils/profileStore";
import "../styles/auth.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();

    if (isSignup) {
      if (!form.name.trim() || !email || !form.password) {
        setError("Please complete all required fields.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Save profile information only; this is not secure authentication.
      saveProfile({
        name: form.name.trim(),
        email,
        phone: form.phone.trim(),
        role: "SmartBin AI member",
      });

      // Keep the password out of browser profile storage.
      navigate("/dashboard");
      return;
    }

    const profile = getProfile();

    if (!profile || profile.email?.toLowerCase() !== email) {
      setError("No matching local profile found. Please sign up first.");
      return;
    }

    // Prototype-only login check; real password verification needs a backend.
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          <span><Leaf size={26} /></span>
          <strong>SmartBin <b>AI</b></strong>
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">A GREENER FUTURE STARTS HERE</p>
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isSignup
              ? "Join us in building cleaner, smarter communities."
              : "Sign in to continue to your SmartBin dashboard."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <>
              <label>Full name
                <span className="auth-input-wrap">
                  <UserRound size={18} />
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Enter your full name" autoComplete="name" required />
                </span>
              </label>

              <label>Phone number <small>(optional)</small>
                <span className="auth-input-wrap">
                  <Phone size={18} />
                  <input name="phone" type="tel" value={form.phone}
                    onChange={handleChange} placeholder="Enter phone number" autoComplete="tel" />
                </span>
              </label>
            </>
          )}

          <label>Email address
            <span className="auth-input-wrap">
              <Mail size={18} />
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email" required />
            </span>
          </label>

          <label>Password
            <span className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="At least 8 characters"
                autoComplete={isSignup ? "new-password" : "current-password"} required />
            </span>
          </label>

          {isSignup && (
            <label>Confirm password
              <span className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input name="confirmPassword" type="password"
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Enter password again" autoComplete="new-password" required />
              </span>
            </label>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit">
            {isSignup ? "Create account" : "Sign in"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to SmartBin AI?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Create account"}
          </Link>
        </p>

        <p className="auth-back"><Link to="/">← Back to home</Link></p>
        <p className="auth-notice">
          Prototype only: account information is stored in this browser.
          Secure login and password verification require backend authentication.
        </p>
      </section>
    </main>
  );
}
