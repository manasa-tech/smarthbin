import { Link } from "react-router-dom";
import { UserRound, Mail, Phone, MapPin, CalendarDays, Pencil, Leaf, ShieldCheck } from "lucide-react";
import { getProfile } from "../utils/profileStore";
import "../styles/profile.css";

export default function ProfilePage() {
  const user = getProfile() || {};

  const fields = [
    ["Full name", user.name || "Not provided"],
    ["Email address", user.email || "Not provided"],
    ["Phone number", user.phone || "Not provided"],
    ["Date of birth", user.dateOfBirth || "Not provided"],
    ["Gender", user.gender || "Not provided"],
    ["Address", user.address || "Not provided"],
  ];

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/dashboard" className="profile-back">← Dashboard</Link>
        <span className="profile-brand"><Leaf size={22} /> SmartBin <b>AI</b></span>
      </header>

      <section className="profile-title">
        <span className="profile-title-icon"><UserRound size={23} /></span>
        <div><h1>My Profile</h1><p>Manage your personal information and account details.</p></div>
        <Link className="profile-edit-button" to="/profile/edit"><Pencil size={16} /> Edit profile</Link>
      </section>

      <section className="profile-card">
        <div className="profile-person">
          <div className="profile-photo">
            {user.photo ? <img src={user.photo} alt="Profile" /> : <UserRound size={40} />}
          </div>
          <div>
            <h2>{user.name || "Your name"}</h2>
            <p>{user.role || "SmartBin AI member"}</p>
            <span className="profile-active"><ShieldCheck size={14} /> Profile information</span>
          </div>
        </div>

        <div className="profile-divider" />

        <h3>Personal information</h3>
        <div className="profile-fields">
          {fields.map(([label, value]) => (
            <div className="profile-field" key={label}>
              <span>{label}</span><b>{value}</b>
            </div>
          ))}
        </div>

        <p className="profile-note">
          Profile details are currently stored in this browser. Secure account storage will be connected to the backend separately.
        </p>
      </section>
    </div>
  );
}
