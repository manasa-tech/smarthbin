import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Recycle, Mail, LockKeyhole, UserRound, Phone,
  Eye, EyeOff, ArrowRight, Leaf, Users, ChartNoAxesColumnIncreasing
} from "lucide-react";
import "./auth-page.css";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "", remember: true, agree: false
  });
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (isSignup && form.password !== form.confirm) {
      setError("Your passwords do not match.");
      return;
    }

    if (isSignup && !form.agree) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    // Demo navigation only. Add real backend authentication before production.
    navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-logo"><Recycle size={34}/></span>
          <span><strong>Smart<span>Bin</span></strong><small>Smart Waste Management</small></span>
        </Link>

        <div className="auth-brand-message">
          <span className="auth-mini-label"><Leaf size={15}/> A GREENER TOMORROW</span>
          <h1>{isSignup ? "Be a Part of a Cleaner, Greener Tomorrow" : "Cleaner Cities Start with Smarter People"}</h1>
          <p>{isSignup
            ? "Join our community and make a real impact in your city."
            : "Report. Monitor. Recycle. Together for a greener tomorrow."}</p>
        </div>

        <div className="auth-city-art" aria-label="Illustration of a greener city and recycling bins">
          <div className="auth-sun"/>
          <div className="auth-skyline"><i/><i/><i/><i/><i/><i/></div>
          <div className="auth-trees"><i/><i/><i/><i/></div>
          <div className="auth-bins">
            <div className="auth-bin auth-bin-green"><Recycle/><b>PLASTIC</b></div>
            <div className="auth-bin auth-bin-blue"><Recycle/><b>PAPER</b></div>
            <div className="auth-bin auth-bin-orange"><Recycle/><b>ORGANIC</b></div>
          </div>
          <div className="auth-ground"/>
        </div>

        <div className="auth-brand-benefits">
          <div><Leaf/><span>Cleaner<br/>Environment</span></div>
          <div><Users/><span>Active<br/>Communities</span></div>
          <div><ChartNoAxesColumnIncreasing/><span>Smarter Waste<br/>Management</span></div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-inner">
          <Link to="/" className="auth-mobile-brand"><Recycle/> SmartBin</Link>

          <span className="auth-welcome-label">WELCOME TO SMARTBIN</span>
          <h2>{isSignup ? "Create Your Account ✨" : "Welcome Back! 👋"}</h2>
          <p className="auth-subtitle">{isSignup
            ? "Join SmartBin and help build cleaner cities"
            : "Sign in to continue to SmartBin"}</p>

          <div className="auth-tabs">
            <button type="button" className={!isSignup ? "active" : ""} onClick={() => {setMode("signin");setError("");}}>Sign In</button>
            <button type="button" className={isSignup ? "active" : ""} onClick={() => {setMode("signup");setError("");}}>Sign Up</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {isSignup && (
              <label>Full Name
                <span className="auth-input-wrap"><UserRound/><input required autoComplete="name" placeholder="Enter your full name" value={form.name} onChange={(e) => update("name", e.target.value)}/></span>
              </label>
            )}

            <label>Email Address
              <span className="auth-input-wrap"><Mail/><input required type="email" autoComplete="email" placeholder="Enter your email" value={form.email} onChange={(e) => update("email", e.target.value)}/></span>
            </label>

            {isSignup && (
              <label>Phone Number
                <span className="auth-input-wrap"><Phone/><input required type="tel" autoComplete="tel" placeholder="Enter your phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)}/></span>
              </label>
            )}

            <label>Password
              <span className="auth-input-wrap"><LockKeyhole/><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "Create a password" : "Enter your password"} value={form.password} onChange={(e) => update("password", e.target.value)}/><button className="auth-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff/> : <Eye/>}</button></span>
            </label>

            {isSignup && (
              <label>Confirm Password
                <span className="auth-input-wrap"><LockKeyhole/><input required minLength={6} type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Confirm your password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)}/><button className="auth-eye" type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">{showConfirm ? <EyeOff/> : <Eye/>}</button></span>
              </label>
            )}

            {!isSignup ? (
              <div className="auth-form-options">
                <label className="auth-check"><input type="checkbox" checked={form.remember} onChange={(e) => update("remember", e.target.checked)}/> Remember me</label>
                <button type="button" className="auth-text-button" onClick={() => setError("Password reset needs to be connected to your backend.")}>Forgot password?</button>
              </div>
            ) : (
              <label className="auth-check auth-terms"><input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)}/> <span>I agree to the <a href="#terms" onClick={(e) => {e.preventDefault();setError("Add your Terms of Service and Privacy Policy pages here.");}}>Terms of Service</a> and <a href="#privacy" onClick={(e) => {e.preventDefault();setError("Add your Privacy Policy page here.");}}>Privacy Policy</a></span></label>
            )}

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-submit" type="submit">{isSignup ? "Create Account" : "Sign In"} <ArrowRight size={18}/></button>
          </form>

          <div className="auth-divider"><span/> OR <span/></div>

          <button className="auth-provider" type="button" onClick={() => setError("Google sign-in is not connected yet.")}><b className="auth-google">G</b> Continue with Google</button>
          <button className="auth-provider" type="button" onClick={() => setError("Microsoft sign-in is not connected yet.")}><b className="auth-microsoft">▦</b> Continue with Microsoft</button>

          <p className="auth-switch">{isSignup ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={() => {setMode(isSignup ? "signin" : "signup");setError("");}}>{isSignup ? "Sign In" : "Sign Up"}</button></p>
          <p className="auth-back-home"><Link to="/">← Back to SmartBin home</Link></p>
        </div>
      </section>
    </div>
  );
}
