import { useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp,
  FileText, History, Trash2, ShieldCheck, AlertTriangle,
  Siren, Bell, CalendarDays, ChevronDown, ChevronRight,
  CheckCircle2, Clock3, Layers, Settings, MapPin
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/dashboard.css";

const bins = [
  { id: "045", location: "Koramangala", fill: 90, status: "Overflowing" },
  { id: "032", location: "Indiranagar", fill: 80, status: "Nearly Full" },
  { id: "078", location: "Whitefield", fill: 78, status: "Nearly Full" },
  { id: "104", location: "HSR Layout", fill: 76, status: "Nearly Full" },
  { id: "067", location: "Electronic City", fill: 72, status: "Nearly Full" },
];

const reports = [
  { id: "#321", location: "BTM Layout", issue: "Overflowing bin", status: "Open", time: "2 hours ago" },
  { id: "#320", location: "JP Nagar", issue: "Damaged bin", status: "In Progress", time: "4 hours ago" },
  { id: "#319", location: "Koramangala", issue: "Garbage not collected", status: "Resolved", time: "6 hours ago" },
  { id: "#318", location: "Whitefield", issue: "Overflowing bin", status: "Open", time: "8 hours ago" },
  { id: "#317", location: "Indiranagar", issue: "Bin cleaning needed", status: "Resolved", time: "1 day ago" },
];

const wasteData = [
  { name: "Organic", value: 45, color: "#18b66a" },
  { name: "Recyclable", value: 30, color: "#4388ff" },
  { name: "Plastic", value: 15, color: "#ffb51b" },
  { name: "Others", value: 10, color: "#91a4bb" },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "City Simulator", icon: Map },
  { label: "AI Waste Classifier", icon: Brain },
  { label: "Route Optimizer", icon: Route },
  { label: "Overflow Prediction", icon: TrendingUp },
  { label: "Citizen Reports", icon: FileText },
  { label: "Reports History", icon: History },
];

const locations = [
  { id: "045", position: [12.9352, 77.6245], fill: 90 },
  { id: "032", position: [12.9784, 77.6408], fill: 80 },
  { id: "078", position: [12.9698, 77.7500], fill: 78 },
  { id: "104", position: [12.9116, 77.6474], fill: 76 },
  { id: "067", position: [12.8399, 77.6770], fill: 72 },
  { id: "021", position: [12.9716, 77.5946], fill: 43 },
  { id: "052", position: [12.9560, 77.5800], fill: 32 },
  { id: "063", position: [12.9950, 77.6050], fill: 55 },
  { id: "019", position: [12.9200, 77.5900], fill: 49 },
  { id: "088", position: [13.0100, 77.6350], fill: 38 },
  { id: "093", position: [12.9050, 77.7000], fill: 66 },
  { id: "017", position: [12.9500, 77.6800], fill: 28 },
];

function createBinIcon(fill) {
  const color = fill >= 85 ? "#ff4854" : fill >= 70 ? "#ffb51b" : "#13bd79";
  return L.divIcon({
    className: "bin-map-icon",
    html: `<div style="background:${color}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></svg></div>`,
    iconSize: [29, 29],
    iconAnchor: [14, 14],
  });
}

function StatCard({ icon: Icon, value, label, trend, kind, negative }) {
  return (
    <article className="sb-stat-card">
      <div className={`sb-stat-icon ${kind}`}><Icon size={23} strokeWidth={2.5} /></div>
      <div className="sb-stat-info">
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
      <div className={`sb-stat-trend ${negative ? "negative" : ""}`}>
        {negative ? "↘" : "↗"} {trend}
        <small>vs last week</small>
      </div>
    </article>
  );
}

function PanelTitle({ title, subtitle, action }) {
  return (
    <div className="sb-panel-title">
      <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [period, setPeriod] = useState("This Week");
  const [selectedBin, setSelectedBin] = useState("045");
  const [notice, setNotice] = useState("");

  function selectNav(label) {
    setActive(label);
    if (label !== "Dashboard") {
      setNotice(`${label} selected. Connect this section to its page or backend route when ready.`);
    } else {
      setNotice("");
    }
  }

  const activeBin = bins.find((bin) => bin.id === selectedBin) || bins[0];

  return (
    <div className="sb-app">
      <aside className="sb-sidebar">
        <div className="sb-brand">
          <div className="sb-brand-icon"><Recycle size={28} /></div>
          <div><h1>SmartBin</h1><p>Smart Waste Management</p></div>
        </div>

        <div className="sb-nav-caption">WORKSPACE</div>
        <nav className="sb-navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`sb-nav-item ${active === label ? "active" : ""}`} onClick={() => selectNav(label)}>
              <Icon size={21} /><span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sb-sidebar-bottom">
          <div className="sb-online-dot" />
          <div><strong>Waste Management</strong><p>A cleaner city starts here.</p></div>
          <Recycle size={27} className="sb-sidebar-leaf" />
        </div>
      </aside>

      <main className="sb-main">
        <header className="sb-topbar">
          <div className="sb-topbar-title">
            <span className="sb-wave">👋</span>
            <div><h2>Hello, Welcome back!</h2><p>Here's the real-time overview of your city's waste management.</p></div>
          </div>
          <div className="sb-topbar-right">
            <div className="sb-date"><CalendarDays size={16}/><span>Oct 21, 2026<small>Wednesday</small></span></div>
            <button className="sb-bell" aria-label="Notifications" onClick={() => setNotice("You have 3 notifications to review.")}><Bell size={20}/><i/></button>
            <div className="sb-user-avatar">V</div>
            <div className="sb-user"><strong>Videesha</strong><span>Admin</span></div>
            <ChevronDown size={15}/>
          </div>
        </header>

        {notice && <div className="sb-notice"><span>{notice}</span><button onClick={() => setNotice("")}>Dismiss ×</button></div>}

        <section className="sb-stat-grid">
          <StatCard icon={Trash2} value="124" label="Total Bins" trend="+12%" kind="green"/>
          <StatCard icon={ShieldCheck} value="86" label="Normal Bins" trend="+8%" kind="green"/>
          <StatCard icon={AlertTriangle} value="28" label="Nearly Full" trend="+5%" kind="amber"/>
          <StatCard icon={Siren} value="10" label="Overflowing" trend="-3%" kind="red" negative/>
        </section>

        <section className="sb-middle-grid">
          <article className="sb-panel sb-map-panel">
            <PanelTitle title="Bin Locations" subtitle="Real-time status of all bins in the city"
              action={<div className="sb-legend"><span><i className="green-dot"/>Normal</span><span><i className="amber-dot"/>Nearly Full</span><span><i className="red-dot"/>Overflowing</span></div>}/>
            <div className="sb-map-wrap">
              <MapContainer center={[12.955, 77.625]} zoom={12} zoomControl={false} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {locations.map((bin) => (
                  <Marker key={bin.id} position={bin.position} icon={createBinIcon(bin.fill)} eventHandlers={{ click: () => setSelectedBin(bin.id) }}>
                    <Popup><strong>Bin #{bin.id}</strong><br/>{bin.fill}% full<br/>{bin.fill >= 85 ? "Overflowing" : bin.fill >= 70 ? "Nearly full" : "Normal"}</Popup>
                  </Marker>
                ))}
                <ZoomControl position="bottomright"/>
              </MapContainer>
              <div className="sb-map-layer"><Layers size={19}/></div>
              <div className="sb-map-selected">
                <span className={activeBin.fill >= 85 ? "pin-red" : "pin-green"}><Trash2 size={15}/></span>
                <div><strong>Bin #{activeBin.id}</strong><small>{activeBin.fill}% Full · {activeBin.location}</small></div>
                <ChevronRight size={17}/>
              </div>
              <div className="sb-map-city"><MapPin size={14}/> Bengaluru</div>
            </div>
          </article>

          <div className="sb-right-stack">
            <article className="sb-panel sb-waste-panel">
              <PanelTitle title="Waste Distribution" action={<select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Waste distribution period"><option>This Week</option><option>This Month</option><option>This Year</option></select>}/>
              <div className="sb-waste-content">
                <div className="sb-donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={wasteData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
                        {wasteData.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="sb-donut-center"><strong>{period === "This Week" ? "2.4T" : period === "This Month" ? "9.8T" : "112T"}</strong><span>Total Waste</span></div>
                </div>
                <div className="sb-waste-legend">
                  {wasteData.map((item) => <div key={item.name}><span><i style={{background:item.color}}/>{item.name}</span><strong>{item.value}%</strong></div>)}
                </div>
              </div>
            </article>

            <article className="sb-panel sb-progress-panel">
              <PanelTitle title="Collection Progress" action={<select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Collection period"><option>This Week</option><option>This Month</option><option>This Year</option></select>}/>
              <div className="sb-progress-track"><span style={{width:"78%"}}/></div>
              <strong className="sb-progress-percent">78%</strong>
              <div className="sb-progress-stats">
                <div><span className="progress-icon green"><CheckCircle2 size={16}/></span><strong>96<small>Bins Collected</small></strong></div>
                <div><span className="progress-icon orange"><Clock3 size={16}/></span><strong>28<small>Pending</small></strong></div>
                <div><span className="progress-icon blue"><Trash2 size={16}/></span><strong>124<small>Total Bins</small></strong></div>
              </div>
            </article>
          </div>
        </section>

        <section className="sb-bottom-grid">
          <article className="sb-panel sb-table-panel">
            <PanelTitle title="Bins Needing Attention" action={<button className="sb-view-all" onClick={() => setNotice("Showing all bins that need attention.")}>View All <ChevronRight size={14}/></button>}/>
            <div className="sb-table-scroll"><table>
              <thead><tr><th>Bin ID</th><th>Location</th><th>Fill Level</th><th>Status</th><th/></tr></thead>
              <tbody>{bins.map((bin) => <tr key={bin.id} onClick={() => setSelectedBin(bin.id)} className={selectedBin === bin.id ? "sb-row-selected" : ""}>
                <td><strong>#{bin.id}</strong></td><td>{bin.location}</td>
                <td><div className="sb-fill-cell"><span>{bin.fill}%</span><div><i style={{width:`${bin.fill}%`,background:bin.fill >= 85 ? "#ff4c55" : "#ffb51b"}}/></div></div></td>
                <td><span className={`sb-status ${bin.status === "Overflowing" ? "status-red" : "status-amber"}`}>{bin.status}</span></td>
                <td><ChevronRight size={15}/></td>
              </tr>)}</tbody>
            </table></div>
          </article>

          <article className="sb-panel sb-table-panel">
            <PanelTitle title="Recent Citizen Reports" action={<button className="sb-view-all" onClick={() => selectNav("Citizen Reports")}>View All <ChevronRight size={14}/></button>}/>
            <div className="sb-table-scroll"><table>
              <thead><tr><th>ID</th><th>Location</th><th>Issue</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>{reports.map((report) => <tr key={report.id}>
                <td><strong>{report.id}</strong></td><td>{report.location}</td><td>{report.issue}</td>
                <td><span className={`sb-status ${report.status === "Open" ? "status-red" : report.status === "Resolved" ? "status-green" : "status-amber"}`}>{report.status}</span></td><td>{report.time}</td>
              </tr>)}</tbody>
            </table></div>
          </article>
        </section>
        <footer className="sb-footer"><span><i className="green-dot"/> SmartBin AI system operational</span><span>Smart Waste Management · Dashboard preview</span></footer>
      </main>
    </div>
  );
}
