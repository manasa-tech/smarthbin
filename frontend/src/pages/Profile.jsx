import { useRef, useState } from "react";
import {
  UserRound, Mail, ShieldCheck, Phone, Building2, MapPin, Camera,
  Pencil, LockKeyhole, Bell, Settings, Globe, Palette, CalendarDays,
  Clock, Trash2, Route, FileText, Users, Eye, EyeOff, Save, CheckCircle2
} from "lucide-react";
import "./profile.css";

const initialNotifications = [
  { id: "overflow", title: "Bin Overflow Alerts", description: "Get notified when bins are at risk of overflow", icon: Trash2, color: "red", enabled: true },
  { id: "routes", title: "Route Optimization Updates", description: "Notifications about new optimized routes", icon: Route, color: "green", enabled: true },
  { id: "reports", title: "System Reports", description: "Updates on generated reports", icon: FileText, color: "blue", enabled: true },
  { id: "citizen", title: "Citizen Reports", description: "New citizen reports and feedback", icon: Users, color: "purple", enabled: false },
  { id: "email", title: "Email Notifications", description: "Receive notifications via email", icon: Mail, color: "yellow", enabled: true },
];

export default function Profile() {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem("smartbinUser");
      const user = savedUser ? JSON.parse(savedUser) : {};

      return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Public User",
        department: "Waste Management",
        location: "Bengaluru, Karnataka",
      };
    } catch {
      return {
        name: "",
        email: "",
        phone: "",
        role: "Public User",
        department: "Waste Management",
        location: "Bengaluru, Karnataka",
      };
    }
  });

  const [passwords, setPasswords] = useState({
    current: "", next: "", confirm: "",
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "Light Mode",
    dateFormat: "Oct 13, 2026",
    timeFormat: "12 Hour (AM/PM)",
  });

  function updateProfile(key, value) {
    setProfile((old) => ({ ...old, [key]: value }));
  }

  function selectPhoto(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaved("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaved("Image must be smaller than 2 MB.");
      return;
    }
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setSaved("Profile photo preview updated. Save it through your backend to persist it.");
  }

  function saveProfile() {
    try {
      const existing = localStorage.getItem("smartbinUser");
      const user = existing ? JSON.parse(existing) : {};

      const updatedUser = {
        ...user,
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        role: profile.role || "Public User",
      };

      localStorage.setItem("smartbinUser", JSON.stringify(updatedUser));
      setProfile((old) => ({ ...old, ...updatedUser }));
      setEditing(false);
      setSaved("Profile saved successfully.");
    } catch {
      setSaved("Could not save the profile. Please try again.");
    }
  }

  function updatePassword(e) {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setSaved("Please fill in all password fields.");
      return;
    }
    if (passwords.next.length < 8) {
      setSaved("New password must contain at least 8 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setSaved("New password and confirmation do not match.");
      return;
    }
    setSaved("Password form validated. Connect a secure backend endpoint to change your password.");
    setPasswords({ current: "", next: "", confirm: "" });
  }

  function savePreferences() {
    setSaved("Preferences updated for this session. Backend storage is not connected yet.");
  }

  function updatePreference(key, value) {
    setPreferences((old) => ({ ...old, [key]: value }));
  }

  return (
    <div className="profile-page">
      <div className="profile-breadcrumb"><span>Home</span><span>›</span><strong>Profile</strong></div>

      <header className="profile-heading">
        <div className="profile-heading-icon"><UserRound size={30}/></div>
        <div><h1>Profile</h1><p>Manage your account information and preferences.</p></div>
      </header>

      {saved && <div className="profile-message"><CheckCircle2 size={17}/><span>{saved}</span><button onClick={() => setSaved("")}>Dismiss</button></div>}

      <section className="profile-top-grid">
        <article className="profile-card profile-photo-card">
          <h2><UserRound size={21}/> Profile Picture</h2>
          <div className="profile-photo-wrap">
            {photo ? <img src={photo} alt="Profile preview"/> : <div className="profile-avatar-large"><UserRound size={76}/></div>}
            <button className="profile-camera" onClick={() => fileRef.current?.click()} aria-label="Change profile photo"><Camera size={20}/></button>
          </div>
          <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => selectPhoto(e.target.files?.[0])}/>
          <button className="profile-photo-button" onClick={() => fileRef.current?.click()}><Camera size={16}/> Change Photo</button>
          <small className="profile-photo-help">JPG, PNG or WEBP (Max 2MB)</small>
        </article>

        <article className="profile-card profile-personal-card">
          <div className="profile-card-heading"><h2><ShieldCheck size={21}/> Personal Information</h2><button className="profile-edit-button" onClick={() => editing ? saveProfile() : setEditing(true)}><Pencil size={15}/>{editing ? "Save" : "Edit"}</button></div>
          <div className="profile-fields">
            <div className="profile-field-icon"><UserRound/></div>
            <label>Full Name<input disabled={!editing} value={profile.name} onChange={(e) => updateProfile("name", e.target.value)}/></label>

            <div className="profile-field-icon"><Mail/></div>
            <label>Email Address<input disabled={!editing} type="email" value={profile.email} onChange={(e) => updateProfile("email", e.target.value)}/></label>

            <div className="profile-field-icon"><ShieldCheck/></div>
            <label>Role<span className="profile-role">{profile.role}</span></label>

            <div className="profile-field-icon"><Phone/></div>
            <label>Phone Number<input disabled={!editing} value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)}/></label>

            <div className="profile-field-icon"><Building2/></div>
            <label>Department<input disabled={!editing} value={profile.department} onChange={(e) => updateProfile("department", e.target.value)}/></label>

            <div className="profile-field-icon"><MapPin/></div>
            <label>Location<input disabled={!editing} value={profile.location} onChange={(e) => updateProfile("location", e.target.value)}/></label>
          </div>
        </article>

        <article className="profile-card profile-statistics">
          <h2><Settings size={21}/> Account Statistics</h2>
          <div className="profile-stat blue"><span><FileText/></span><div><strong>24</strong><small>Reports Generated</small></div></div>
          <div className="profile-stat green"><span><Route/></span><div><strong>3</strong><small>Routes Optimized</small></div></div>
          <div className="profile-stat yellow"><span><Trash2/></span><div><strong>156</strong><small>Bins Monitored</small></div></div>
          <div className="profile-stat purple"><span><Users/></span><div><strong>12</strong><small>Citizen Reports Handled</small></div></div>
          <p className="profile-demo-caption">Illustrative account statistics</p>
        </article>
      </section>

      <section className="profile-bottom-grid">
        <article className="profile-card profile-password-card">
          <h2><LockKeyhole size={21}/> Change Password</h2>
          <form onSubmit={updatePassword}>
            <label>Current Password<div className="profile-password-input"><input required type={showPassword ? "text" : "password"} value={passwords.current} placeholder="Enter current password" onChange={(e) => setPasswords({...passwords,current:e.target.value})}/><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>
            <label>New Password<div className="profile-password-input"><input required minLength={8} type={showNewPassword ? "text" : "password"} value={passwords.next} placeholder="Enter new password" onChange={(e) => setPasswords({...passwords,next:e.target.value})}/><button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? <EyeOff/> : <Eye/>}</button></div></label>
            <label>Confirm New Password<div className="profile-password-input"><input required type={showConfirmPassword ? "text" : "password"} value={passwords.confirm} placeholder="Confirm new password" onChange={(e) => setPasswords({...passwords,confirm:e.target.value})}/><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff/> : <Eye/>}</button></div></label>
            <button className="profile-submit" type="submit"><LockKeyhole size={16}/> Update Password</button>
          </form>
          <p className="profile-security-note">Password changes require secure backend verification.</p>
        </article>

        <article className="profile-card profile-notifications-card">
          <h2><Bell size={21}/> Notification Preferences</h2>
          <p className="profile-card-subtitle">Choose what updates you want to receive.</p>
          <div className="profile-notification-list">
            {notifications.map((item) => {
              const Icon = item.icon;
              return <div className="profile-notification" key={item.id}>
                <span className={`profile-notification-icon ${item.color}`}><Icon size={21}/></span>
                <div className="profile-notification-copy"><strong>{item.title}</strong><small>{item.description}</small></div>
                <button type="button" role="switch" aria-checked={item.enabled} aria-label={item.title} className={`profile-switch ${item.enabled ? "on" : ""}`} onClick={() => setNotifications((old) => old.map((n) => n.id === item.id ? {...n,enabled:!n.enabled} : n))}><span/></button>
              </div>;
            })}
          </div>
        </article>

        <article className="profile-card profile-preferences-card">
          <h2><Settings size={21}/> Display Preferences</h2>
          <p className="profile-card-subtitle">Customize your application experience.</p>
          <div className="profile-preference-row"><span><Globe/></span><label>Language<select value={preferences.language} onChange={(e) => updatePreference("language",e.target.value)}><option>English</option><option>Kannada</option><option>Hindi</option><option>Tamil</option></select></label></div>
          <div className="profile-preference-row"><span><Palette/></span><label>Theme<select value={preferences.theme} onChange={(e) => updatePreference("theme",e.target.value)}><option>Light Mode</option><option>Dark Mode</option><option>System Default</option></select></label></div>
          <div className="profile-preference-row"><span><CalendarDays/></span><label>Date Format<select value={preferences.dateFormat} onChange={(e) => updatePreference("dateFormat",e.target.value)}><option>Oct 13, 2026</option><option>13/10/2026</option><option>2026-10-13</option></select></label></div>
          <div className="profile-preference-row"><span><Clock/></span><label>Time Format<select value={preferences.timeFormat} onChange={(e) => updatePreference("timeFormat",e.target.value)}><option>12 Hour (AM/PM)</option><option>24 Hour</option></select></label></div>
          <button className="profile-submit" onClick={savePreferences}><Save size={16}/> Save Preferences</button>
        </article>
      </section>
      <footer className="profile-footer"><span><i/> Profile settings ready</span><span>SmartBin AI · Settings preview</span></footer>
    </div>
  );
}



