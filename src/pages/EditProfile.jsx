import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Leaf, Save } from "lucide-react";
import { getProfile, saveProfile } from "../utils/profileStore";
import "../styles/profile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const initial = getProfile() || {};
  const fileInput = useRef(null);

  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    dateOfBirth: initial.dateOfBirth || "",
    gender: initial.gender || "",
    address: initial.address || "",
    photo: initial.photo || "",
  });

  const [message, setMessage] = useState("");

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage("Please choose an image smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm((previous) => ({ ...previous, photo: reader.result }));
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    saveProfile(form);
    navigate("/profile");
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/profile" className="profile-back"><ArrowLeft size={16} /> Back to profile</Link>
        <span className="profile-brand"><Leaf size={22} /> SmartBin <b>AI</b></span>
      </header>

      <section className="profile-title">
        <span className="profile-title-icon"><Camera size={23} /></span>
        <div><h1>Edit profile</h1><p>Update your personal information.</p></div>
      </section>

      <form className="profile-card profile-edit-form" onSubmit={submit}>
        <div className="profile-photo-edit">
          <div className="profile-photo">
            {form.photo ? <img src={form.photo} alt="Profile preview" /> : <Camera size={30} />}
          </div>
          <div>
            <b>Profile picture</b>
            <p>Choose an image up to 1 MB.</p>
            <button type="button" className="profile-secondary-button" onClick={() => fileInput.current?.click()}>
              Change photo
            </button>
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={uploadPhoto} />
          </div>
        </div>

        <div className="profile-edit-grid">
          <label>Full name<input name="name" value={form.name} onChange={update} required maxLength={100} /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={update} /></label>
          <label>Date of birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} /></label>
          <label>Gender
            <select name="gender" value={form.gender} onChange={update}>
              <option value="">Prefer not to say</option>
              <option>Female</option><option>Male</option><option>Non-binary</option><option>Other</option>
            </select>
          </label>
          <label className="profile-address">Address<textarea name="address" rows="3" value={form.address} onChange={update} maxLength={500} /></label>
        </div>

        {message && <p className="profile-error">{message}</p>}

        <div className="profile-form-actions">
          <Link to="/profile" className="profile-cancel-button">Cancel</Link>
          <button className="profile-edit-button" type="submit"><Save size={16} /> Save changes</button>
        </div>
      </form>
    </div>
  );
}
