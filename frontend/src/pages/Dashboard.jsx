
import SmartBinAssistant from "../components/ai/SmartBinAssistant";
import React, { useEffect, useMemo, useState } from "react";
import {
  Trash2, ShieldCheck, AlertTriangle, Siren, CalendarDays,
  Bell, ChevronDown, RefreshCw, MapPin, Layers, Plus, Minus,
  LocateFixed, ArrowRight, CheckCircle2, Clock3, Recycle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css";

const API = "http://localhost:8000";

const wasteTypes = [
  { name: "Organic", value: 45, color: "#16b86a" },
  { name: "Recyclable", value: 30, color: "#4c8dff" },
  { name: "Plastic", value: 15, color: "#ffb21a" },
  { name: "Others", value: 10, color: "#8a9db7" }
];

const getFill = b => Math.max(0, Math.min(100, Number(
  b.fill_level ?? b.fill_percentage ?? b.fillLevel ?? b.fill ?? 0
)));
const getId = b => b.bin_id ?? b.id ?? b.bin_number ?? "—";
const getLocation = b => b.location ?? b.area ?? b.address ?? "Unknown location";
const getStatus = b => {
  const s = String(b.status ?? "").toLowerCase();
  if (s.includes("overflow") || getFill(b) >= 90) return "Overflowing";
  if (s.includes("full") || s.includes("high") || getFill(b) >= 70) return "Nearly Full";
  return "Normal";
};
const statusClass = s => s === "Overflowing" || s === "Open"
  ? "sb-red" : s === "Nearly Full" || s === "In Progress"
    ? "sb-amber" : s === "Resolved" || s === "Normal"
      ? "sb-green" : "sb-blue";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("This Week");
  const [updated, setUpdated] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/bins`);
      if (!response.ok) throw new Error("Could not load bins. Check that FastAPI is running.");
      const data = await response.json();
      setBins(Array.isArray(data) ? data : data.bins ?? data.data ?? []);

      try {
        const rr = await fetch(`${API}/api/reports`);
        if (rr.ok) {
          const rd = await rr.json();
          setReports(Array.isArray(rd) ? rd : rd.reports ?? rd.data ?? []);
        } else setReports([]);
      } catch {
        setReports([]);
      }
      setUpdated(new Date());
    } catch (e) {
      setError(e.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  const stats = useMemo(() => {
    const normal = bins.filter(b => getStatus(b) === "Normal").length;
    const nearly = bins.filter(b => getStatus(b) === "Nearly Full").length;
    const overflow = bins.filter(b => getStatus(b) === "Overflowing").length;
    return { total: bins.length, normal, nearly, overflow };
  }, [bins]);

  const attention = [...bins]
    .filter(b => getStatus(b) !== "Normal")
    .sort((a, b) => getFill(b) - getFill(a))
    .slice(0, 5);

  const recentReports = reports.slice(0, 5);
  const date = new Intl.DateTimeFormat("en-IN", {
    month: "short", day: "numeric", year: "numeric"
  }).format(new Date());

  const cards = [
    { title: "Total Bins", value: stats.total, note: "Registered bins", icon: Trash2, tone: "green", tag: "Live" },
    { title: "Normal Bins", value: stats.normal, note: "Within fill threshold", icon: ShieldCheck, tone: "green", tag: "Normal" },
    { title: "Nearly Full", value: stats.nearly, note: "Require monitoring", icon: AlertTriangle, tone: "amber", tag: "Priority" },
    { title: "Overflowing", value: stats.overflow, note: "Need urgent attention", icon: Siren, tone: "red", tag: "Urgent" }
  ];

  const positions = [
    [20,25],[40,18],[60,29],[78,20],[14,55],[32,45],
    [52,54],[73,48],[87,62],[24,76],[45,80],[64,72],
    [81,83],[10,37],[37,32],[57,40],[68,18],[49,65],
    [18,88],[90,38],[34,60],[76,34],[58,88],[8,67]
  ];

  return (
    <div className="sb-dashboard">
      <header className="sb-welcome-bar">
        <div className="sb-welcome">
          <span className="sb-wave">👋</span>
          <div>
            <h1>Hello, Welcome back!</h1>
            <p>Here's the real-time overview of your city's waste management.</p>
          </div>
        </div>
        <div className="sb-header-actions">
          <div className="sb-date-chip"><CalendarDays size={19}/><div><strong>{date}</strong><small>{new Date().toLocaleDateString("en-IN",{weekday:"long"})}</small></div></div>
          <button className="sb-icon-button" aria-label="Notifications"><Bell size={21}/><i/></button>
          <div className="sb-admin"><span className="sb-avatar">V</span><div><strong>SmartBin Admin</strong><small>Administrator</small></div><ChevronDown size={16}/></div>
        </div>
      </header>

      <main className="sb-dashboard-content">
        {error && <div className="sb-error"><AlertTriangle size={18}/><span>{error}</span><button onClick={loadDashboard}>Retry</button></div>}

        <div className="sb-topline">
          <div><span className="sb-eyebrow">CITY OPERATIONS</span><h2>Dashboard</h2><p>Monitor bin activity and collection priorities in one place.</p></div>
          <button className="sb-refresh" onClick={loadDashboard} disabled={loading}><RefreshCw size={16}/>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
        {updated && <div className="sb-updated"><i/> Updated {updated.toLocaleTimeString()}</div>}

        <section className="sb-kpi-grid">
          {cards.map(c => {
            const Icon = c.icon;
            return <article className="sb-kpi-card" key={c.title}>
              <div className={`sb-kpi-icon ${c.tone}`}><Icon size={25}/></div>
              <div className="sb-kpi-main"><span>{c.title}</span><strong>{c.value}</strong><small>{c.note}</small></div>
              <span className={`sb-kpi-tag ${c.tone}`}>{c.tag}</span>
            </article>;
          })}
        </section>

        <section
          className="sb-panel smart-disposal-card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "24px",
            padding: "24px",
            background: "#f0faf3",
            border: "1px solid #ccebd6"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: "54px",
                height: "54px",
                flexShrink: 0,
                borderRadius: "14px",
                background: "#d9f3e2",
                color: "#16865b"
              }}
            >
              <Recycle size={28} />
            </div>

            <div>
              <h3 style={{ margin: "0 0 8px", color: "#203752", fontSize: "18px" }}>
                Smart Disposal &amp; Cleaning
              </h3>
              <p style={{ margin: 0, color: "#718096", fontSize: "13px", lineHeight: 1.7 }}>
                Find collection vehicles, report roadside waste, and track your civic complaints.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-btn dashboard-btn-primary"
            onClick={() => navigate("/smart-disposal")}
          >
            Open Smart Disposal <ArrowRight size={16} />
          </button>
        </section>

          <section className="sb-main-grid">
          <article className="sb-panel sb-map-panel">
            <div className="sb-panel-heading">
              <div><h3>Bin Locations</h3><p>Real-time status of all bins in the city</p></div>
              <div className="sb-map-legend"><span><i className="dot-green"/>Normal</span><span><i className="dot-amber"/>Nearly Full</span><span><i className="dot-red"/>Overflowing</span></div>
            </div>
            <div className="sb-city-map">
              <div className="sb-map-grid-lines"/>
              <div className="sb-road road-one"/><div className="sb-road road-two"/><div className="sb-road road-three"/><div className="sb-road road-four"/>
              <div className="sb-map-river"/>
              <div className="sb-map-label"><Layers size={16}/></div>
              <div className="sb-city-name">Bengaluru</div>
              {bins.slice(0,24).map((b,i) => {
                const [x,y] = positions[i % positions.length];
                return <div key={getId(b)} className={`sb-marker ${getStatus(b)==="Overflowing"?"marker-red":getStatus(b)==="Nearly Full"?"marker-amber":"marker-green"}`} style={{left:`${x}%`,top:`${y}%`}} title={`Bin ${getId(b)} · ${getLocation(b)} · ${getFill(b)}% full`}><Trash2 size={14}/></div>;
              })}
              {!bins.length && !loading && <div className="sb-map-empty">Bin locations will appear here when backend data is available.</div>}
              <div className="sb-map-controls"><button title="Zoom in"><Plus/></button><button title="Zoom out"><Minus/></button><button title="Locate bins"><LocateFixed/></button></div>
              <span className="sb-map-caption"><MapPin size={13}/> Bin status overview</span>
            </div>
          </article>

          <div className="sb-side-panels">
            <article className="sb-panel">
              <div className="sb-panel-heading"><div><h3>Waste Distribution</h3><p>Illustrative category breakdown</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>This Week</option><option>This Month</option><option>This Year</option></select></div>
              <div className="sb-waste-content">
                <div className="sb-donut"><div><strong>100%</strong><span>Categories</span></div></div>
                <div className="sb-waste-legend">{wasteTypes.map(w=><div key={w.name}><span><i style={{background:w.color}}/>{w.name}</span><strong>{w.value}%</strong></div>)}</div>
              </div>
            </article>

            <article className="sb-panel sb-collection">
              <div className="sb-panel-heading"><div><h3>Collection Progress</h3><p>Based on current bin status</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>This Week</option><option>This Month</option><option>This Year</option></select></div>
              <div className="sb-progress-line"><div><span style={{width:`${stats.total ? stats.normal/stats.total*100 : 0}%`}}/></div><strong>{stats.total ? Math.round(stats.normal/stats.total*100) : 0}%</strong></div>
              <div className="sb-collection-stats">
                <div><CheckCircle2 className="green-text"/><strong>{stats.normal}</strong><small>Normal</small></div>
                <div><Clock3 className="amber-text"/><strong>{stats.nearly}</strong><small>Pending</small></div>
                <div><Trash2 className="blue-text"/><strong>{stats.total}</strong><small>Total Bins</small></div>
              </div>
            </article>
          </div>
        </section>

        <section className="sb-bottom-grid">
          <article className="sb-panel sb-table-panel">
            <div className="sb-panel-heading"><div><h3>Bins Needing Attention</h3><p>Highest fill levels first</p></div><a href="/predictions">View All <ArrowRight size={15}/></a></div>
            <div className="sb-table-scroll"><table className="sb-table"><thead><tr><th>Bin ID</th><th>Location</th><th>Fill Level</th><th>Status</th></tr></thead><tbody>
              {attention.map(b=><tr key={getId(b)}><td className="id-cell">#{getId(b)}</td><td>{getLocation(b)}</td><td><div className="sb-fill-cell"><span>{getFill(b)}%</span><div><i className={getFill(b)>=90?"fill-red":getFill(b)>=70?"fill-amber":"fill-green"} style={{width:`${getFill(b)}%`}}/></div></div></td><td><span className={`sb-pill ${statusClass(getStatus(b))}`}>{getStatus(b)}</span></td></tr>)}
              {!loading && !attention.length && <tr><td colSpan="4" className="empty-cell">{error?"Unable to load bins.":"No bins currently need attention."}</td></tr>}
            </tbody></table></div>
          </article>

          <article className="sb-panel sb-table-panel">
            <div className="sb-panel-heading"><div><h3>Recent Citizen Reports</h3><p>Latest submitted reports</p></div><a href="/reports-history">View All <ArrowRight size={15}/></a></div>
            <div className="sb-table-scroll"><table className="sb-table"><thead><tr><th>ID</th><th>Location</th><th>Issue</th><th>Status</th></tr></thead><tbody>
              {recentReports.map((r,i)=>{const raw=String(r.status??"Open");const s=raw.toLowerCase().includes("resolv")?"Resolved":raw.toLowerCase().includes("progress")?"In Progress":"Open";return <tr key={r.id??r.report_id??i}><td className="id-cell">#{r.id??r.report_id??"—"}</td><td>{r.location??r.area??"—"}</td><td className="issue-cell">{r.issue??r.description??r.title??"Waste report"}</td><td><span className={`sb-pill ${statusClass(s)}`}>{s}</span></td></tr>;})}
              {!loading && !recentReports.length && <tr><td colSpan="4" className="empty-cell">No citizen reports available yet.</td></tr>}
            </tbody></table></div>
          </article>
        </section>

        
        <footer className="sb-footer"><span><Recycle size={15}/> SmartBin AI</span><span>Smart Waste Management Dashboard</span></footer>
        <SmartBinAssistant />
      </main>
    </div>
  );
}



