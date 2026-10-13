import { useState } from "react";
import {
  Truck, Camera, ClipboardList, MapPin,
  ArrowRight, Clock, ShieldCheck, Recycle
} from "lucide-react";
import "./smart-disposal.css";

const features = [
  {
    id: "vehicles",
    title: "Nearby Collection Vehicles",
    description: "Find collection vehicles and their upcoming stops.",
    icon: Truck,
    button: "Find Vehicles",
  },
  {
    id: "report",
    title: "Report Roadside Waste",
    description: "Upload a photo and report garbage on roads.",
    icon: Camera,
    button: "Report Now",
  },
  {
    id: "complaints",
    title: "Track & Escalate",
    description: "Check complaint status and response deadlines.",
    icon: ShieldCheck,
    button: "Track Complaints",
  },
  {
    id: "reports",
    title: "My Reports",
    description: "Review complaints submitted by you.",
    icon: ClipboardList,
    button: "My Reports",
  },
];

export default function SmartDisposal() {
  const [active, setActive] = useState("overview");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");

  function submitReport(event) {
    event.preventDefault();

    const reports = JSON.parse(
      localStorage.getItem("smartbinCivicReports") || "[]"
    );

    const report = {
      id: `SB-${Date.now()}`,
      location,
      description,
      photo,
      status: "Submitted - Demo",
      createdAt: new Date().toLocaleString(),
    };

    reports.unshift(report);
    localStorage.setItem("smartbinCivicReports", JSON.stringify(reports));

    setMessage(`Demo complaint ${report.id} saved successfully.`);
    setLocation("");
    setDescription("");
    setPhoto("");
  }

  const reports = JSON.parse(
    localStorage.getItem("smartbinCivicReports") || "[]"
  );

  return (
    <div className="sd-page">
      <header className="sd-header">
        <div>
          <div className="sd-eyebrow"><Recycle size={17} /> SMARTBIN CIVIC CONNECT</div>
          <h1>Smart Disposal &amp; Cleaning</h1>
          <p>Dispose waste easily. Report roadside waste. Keep your city clean.</p>
        </div>
        <div className="sd-location"><MapPin size={18} /> Bengaluru, India</div>
      </header>

      <section className="sd-hero">
        <div>
          <span className="sd-pill">CLEANER CITY INITIATIVE</span>
          <h2>Cleaner Streets.<br />Stronger Communities.</h2>
          <p>Find collection vehicles, report waste hotspots, and follow complaints in one place.</p>
        </div>
        <div className="sd-hero-art"><Truck size={100} /><Recycle size={34} /></div>
      </section>

      <section className="sd-stats">
        <article><Truck /><strong>12</strong><span>Sample vehicles</span></article>
        <article><ClipboardList /><strong>{reports.length}</strong><span>Your demo reports</span></article>
        <article><ShieldCheck /><strong>Live</strong><span>Complaint tracking demo</span></article>
      </section>

      <div className="sd-heading">
        <h2>What would you like to do?</h2>
        <p>Select a service below.</p>
      </div>

      <section className="sd-grid">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <article className="sd-card" key={item.id}>
              <span className="sd-icon"><Icon size={28} /></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button onClick={() => { setActive(item.id); setMessage(""); }}>
                {item.button} <ArrowRight size={17} />
              </button>
            </article>
          );
        })}
      </section>

      <section className="sd-panel">
        {active === "overview" && (
          <>
            <h2>Welcome to Civic Connect</h2>
            <p>Choose one of the four services above to get started.</p>
          </>
        )}

        {active === "vehicles" && (
          <>
            <h2><Truck /> Nearby Collection Vehicles</h2>
            <p className="sd-muted">Illustrative vehicles for the prototype; these are not live GPS locations.</p>
            {[
              ["SV-103", "HSR Layout", "Arriving in 8 minutes"],
              ["SV-102", "Indiranagar", "Arriving in 15 minutes"],
              ["SV-104", "BTM Layout", "Arriving in 22 minutes"],
            ].map((vehicle) => (
              <div className="sd-list-row" key={vehicle[0]}>
                <div><strong>{vehicle[0]}</strong><span>{vehicle[1]}</span></div>
                <span className="sd-status">{vehicle[2]}</span>
              </div>
            ))}
            <p className="sd-muted">Live routes and arrival times require a vehicle tracking data source.</p>
          </>
        )}

        {active === "report" && (
          <>
            <h2><Camera /> Report Roadside Waste</h2>
            <form className="sd-form" onSubmit={submitReport}>
              <label>Road or area location
                <input value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter road, area or landmark" required />
              </label>
              <label>Describe the waste
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the dumped waste" rows={3} required />
              </label>
              <label>Photo (optional)
                <input type="file" accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0]?.name || "")} />
              </label>
              {photo && <p className="sd-muted">Selected file: {photo}</p>}
              <button type="submit">Submit Demo Complaint <ArrowRight size={17} /></button>
              {message && <p className="sd-success">{message}</p>}
            </form>
            <p className="sd-muted">Demo only. This does not send a complaint to a government office.</p>
          </>
        )}

        {(active === "complaints" || active === "reports") && (
          <>
            <h2><ClipboardList /> {active === "reports" ? "My Reports" : "Complaint Tracking & Escalation"}</h2>
            {reports.length === 0 ? (
              <p>No demo reports yet. Use Report Roadside Waste to create one.</p>
            ) : reports.map((report) => (
              <div className="sd-list-row" key={report.id}>
                <div>
                  <strong>{report.id}</strong>
                  <span>{report.location} - {report.description}</span>
                  <span>Created: {report.createdAt}</span>
                </div>
                <span className="sd-status">{report.status}</span>
              </div>
            ))}
            {active === "complaints" && (
              <div className="sd-notice">
                <Clock size={20} />
                Authority assignment, official deadlines, warning delivery, and MLA escalation
                require a verified backend and official contact information.
              </div>
            )}
          </>
        )}
      </section>

      <footer className="sd-footer"><Recycle size={17} /> SmartBin Civic Connect · Prototype</footer>
    </div>
  );
}
