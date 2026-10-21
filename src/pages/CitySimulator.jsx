import { useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp,
  FileText, History, Bell, UserRound, Menu, Home, Play,
  RotateCcw, Trash2, CheckCircle2, AlertTriangle, Siren,
  Search, Layers, Settings, ChevronDown, MapPin, Clock3
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart,
  Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/city-simulator.css";

const binLocations = [
  { id: "SB-104", name: "Downtown", pos: [12.9716, 77.5946], fill: 92 },
  { id: "SB-102", name: "Riverside", pos: [12.985, 77.59], fill: 36 },
  { id: "SB-103", name: "Central Park", pos: [12.982, 77.57], fill: 48 },
  { id: "SB-108", name: "Lakeside", pos: [12.965, 77.62], fill: 63 },
  { id: "SB-110", name: "Eastside", pos: [12.978, 77.65], fill: 31 },
  { id: "SB-112", name: "Tech Park", pos: [12.935, 77.61], fill: 58 },
  { id: "SB-115", name: "West End", pos: [12.96, 77.56], fill: 88 },
  { id: "SB-118", name: "Maplewood", pos: [12.92, 77.58], fill: 42 },
  { id: "SB-121", name: "University", pos: [12.95, 77.64], fill: 18 },
  { id: "SB-125", name: "Brookfield", pos: [12.93, 77.67], fill: 94 },
  { id: "SB-127", name: "Industrial Area", pos: [12.91, 77.65], fill: 74 },
  { id: "SB-129", name: "Lakeside North", pos: [13.0, 77.62], fill: 22 },
  { id: "SB-131", name: "University East", pos: [12.945, 77.67], fill: 39 },
  { id: "SB-133", name: "Tech Park South", pos: [12.915, 77.62], fill: 61 },
  { id: "SB-136", name: "Riverside East", pos: [12.99, 77.61], fill: 84 },
  { id: "SB-140", name: "Central Market", pos: [12.965, 77.585], fill: 27 },
  { id: "SB-142", name: "Greenfield", pos: [12.945, 77.57], fill: 15 },
  { id: "SB-145", name: "South Avenue", pos: [12.905, 77.60], fill: 72 },
  { id: "SB-148", name: "North Gate", pos: [13.005, 77.59], fill: 51 },
  { id: "SB-150", name: "East Market", pos: [12.96, 77.66], fill: 33 },
  { id: "SB-153", name: "Hillview", pos: [12.93, 77.55], fill: 67 },
  { id: "SB-156", name: "Parkside", pos: [12.99, 77.57], fill: 44 },
  { id: "SB-159", name: "South Market", pos: [12.90, 77.64], fill: 86 },
  { id: "SB-162", name: "Lake Road", pos: [12.975, 77.63], fill: 53 },
  { id: "SB-165", name: "Garden Layout", pos: [12.94, 77.625], fill: 24 },
  { id: "SB-168", name: "Metro Junction", pos: [12.955, 77.60], fill: 79 },
  { id: "SB-171", name: "Airport Road", pos: [13.015, 77.65], fill: 35 },
  { id: "SB-174", name: "South Tech Park", pos: [12.89, 77.68], fill: 96 },
];

const areaStats = [
  { name: "Downtown", full: 28, total: 6 },
  { name: "Riverside", full: 18, total: 4 },
  { name: "Lakeside", full: 16, total: 2 },
  { name: "Tech Park", full: 20, total: 1 },
  { name: "University", full: 14, total: 3 },
];

const statusOf = (fill) =>
  fill >= 90 ? "Overflowing" : fill >= 70 ? "Nearly Full" : "Normal";

function binIcon(fill) {
  const color = fill >= 90 ? "#ff3434" : fill >= 70 ? "#ffa600" : "#078f4b";
  return L.divIcon({
    className: "cs-bin-marker",
    html: `<div style="background:${color}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></svg></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
}

function MapSearch({ query }) {
  const map = useMap();
  const searchArea = () => {
    const match = binLocations.find((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    if (query.trim() && match) map.flyTo(match.pos, 14, { duration: 0.8 });
  };
  return <button className="cs-hidden-map-action" onClick={searchArea} aria-hidden="true" tabIndex={-1} />;
}

function Sidebar({ activePage, setActivePage }) {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "City Simulator", icon: Map },
    { label: "AI Waste Classifier", icon: Brain },
    { label: "Route Optimizer", icon: Route },
    { label: "Overflow Prediction", icon: TrendingUp },
    { label: "Citizen Reports", icon: FileText },
    { label: "Reports History", icon: History },
  ];

  return (
    <aside className="cs-sidebar">
      <div className="cs-brand">
        <div className="cs-brand-mark"><Recycle size={25} /></div>
        <div><strong>SmartBin</strong><small>Smart Waste Management</small></div>
      </div>
      <div className="cs-menu-label">MAIN MENU</div>
      <nav className="cs-nav">
        {items.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`cs-nav-item ${activePage === label ? "selected" : ""}`}
            onClick={() => {
              setActivePage(label);
              if (label !== "City Simulator") {
                window.dispatchEvent(new CustomEvent("smartbin-nav", { detail: label }));
              }
            }}
          >
            <Icon size={19} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="cs-sidebar-note">
        <span className="cs-live-dot" />
        <div><strong>Waste Management</strong><p>Monitor bins, optimize collection routes, and manage reports.</p></div>
      </div>
      <button className="cs-sidebar-collapse" aria-label="Collapse sidebar"><ChevronDown size={18}/></button>
    </aside>
  );
}

function MetricCard({ icon: Icon, kind, value, label, percentage }) {
  return (
    <article className="cs-metric">
      <div className={`cs-metric-icon ${kind}`}><Icon size={21}/></div>
      <div className="cs-metric-content"><strong>{value}</strong><span>{label}</span></div>
      <div className="cs-metric-side"><span>{percentage}</span><i><b style={{ width: percentage }}/></i></div>
    </article>
  );
}

export default function CitySimulator() {
  const [activePage, setActivePage] = useState("City Simulator");
  const [selectedBin, setSelectedBin] = useState("SB-104");
  const [search, setSearch] = useState("");
  const [speed, setSpeed] = useState("1x");
  const [scenario, setScenario] = useState("Normal Day");
  const [running, setRunning] = useState(false);
  const [simCount, setSimCount] = useState(0);
  const [notice, setNotice] = useState("");

  const selected = binLocations.find((b) => b.id === selectedBin) || binLocations[0];
  const filteredBins = binLocations.filter((b) =>
    `${b.id} ${b.name} ${statusOf(b.fill)}`.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = {
    normal: binLocations.filter((b) => b.fill < 70).length,
    nearly: binLocations.filter((b) => b.fill >= 70 && b.fill < 90).length,
    overflow: binLocations.filter((b) => b.fill >= 90).length,
  };

  const pieData = [
    { name: "Normal (≤ 70%)", value: 75, color: "#079d51" },
    { name: "Nearly Full (70–90%)", value: 18, color: "#ffae00" },
    { name: "Overflowing (≥ 90%)", value: 6, color: "#ff3737" },
  ];

  const fillData = [
    { range: "0–20%", count: 38 },
    { range: "20–40%", count: 21 },
    { range: "40–60%", count: 24 },
    { range: "60–80%", count: 16 },
    { range: "80–100%", count: 11 },
  ];

  function runSimulation() {
    setRunning((previous) => !previous);
    setSimCount((count) => count + 1);
    setNotice(running ? "Simulation paused." : `Simulation running at ${speed} speed — ${scenario}.`);
  }

  function resetSimulation() {
    setRunning(false);
    setSpeed("1x");
    setScenario("Normal Day");
    setSelectedBin("SB-104");
    setSearch("");
    setNotice("Simulation view reset.");
  }

  return (
    <div className="cs-app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="cs-main">
        <header className="cs-topbar">
          <button className="cs-menu-toggle" aria-label="Toggle menu"><Menu size={19}/></button>
          <div className="cs-topbar-spacer"/>
          <button className="cs-notification" aria-label="Notifications" onClick={() => setNotice("You have 3 notifications to review.")}><Bell size={18}/><i/></button>
          <div className="cs-avatar"><UserRound size={20}/></div>
          <div className="cs-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="cs-breadcrumb"><Home size={13}/> <span>Home</span><b>›</b><strong>City Simulator</strong></div>

        <section className="cs-page-heading">
          <div className="cs-heading-icon"><Map size={30}/></div>
          <div className="cs-heading-text">
            <h1>City Simulator</h1>
            <p>Explore real-time bin status across the city. Simulate waste collection and analyze city-wide data.</p>
          </div>
          <div className="cs-heading-actions">
            <button className="cs-primary-btn" onClick={runSimulation}><Play size={13}/>{running ? "Pause Simulation" : "Run Simulation"}</button>
            <button className="cs-secondary-btn" onClick={resetSimulation}><RotateCcw size={14}/>Reset View</button>
          </div>
        </section>

        {notice && <div className="cs-notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}

        <section className="cs-metrics-grid">
          <MetricCard icon={Trash2} kind="green" value="128" label="Total Smart Bins" percentage="100%"/>
          <MetricCard icon={CheckCircle2} kind="normal" value={96 + (running ? simCount % 3 : 0)} label="Normal (≤ 70%)" percentage="75%"/>
          <MetricCard icon={Clock3} kind="warning" value={24} label="Nearly Full (70–90%)" percentage="18%"/>
          <MetricCard icon={AlertTriangle} kind="danger" value={8} label="Overflowing (≥ 90%)" percentage="6%"/>
        </section>

        <section className="cs-workspace">
          <article className="cs-map-panel">
            <div className="cs-map-search">
              <Search size={16}/>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search location or bin ID..." />
              {search && <button onClick={() => setSearch("")}>×</button>}
            </div>
            <MapContainer center={[12.96, 77.605]} zoom={13} zoomControl={false} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredBins.map((bin) => (
                <Marker key={bin.id} position={bin.pos} icon={binIcon(bin.fill)} eventHandlers={{ click: () => setSelectedBin(bin.id) }}>
                  <Popup>
                    <strong>Bin #{bin.id}</strong><br/>
                    Fill Level: {bin.fill}%<br/>
                    Location: {bin.name}<br/>
                    Status: {statusOf(bin.fill)}
                  </Popup>
                </Marker>
              ))}
              <ZoomControl position="bottomleft"/>
              <MapSearch query={search}/>
            </MapContainer>

            <div className="cs-selected-bin">
              <div className={`cs-selected-icon ${selected.fill >= 90 ? "red" : selected.fill >= 70 ? "amber" : "green"}`}><Trash2 size={16}/></div>
              <div><strong>Bin #{selected.id}</strong><p>Fill Level: <b className={selected.fill >= 90 ? "red-text" : ""}>{selected.fill}%</b></p><small>Location: {selected.name}</small></div>
              <ChevronDown size={15}/>
            </div>
            <div className="cs-map-caption"><MapPin size={12}/> City-wide bin locations</div>
            {running && <div className="cs-running-label"><span/> SIMULATION RUNNING · {speed}</div>}
          </article>

          <aside className="cs-controls-column">
            <article className="cs-control-card">
              <h3>Bin Status Legend</h3>
              <div className="cs-legend-row"><span className="cs-legend-bin green"><Trash2 size={13}/></span><span>Normal (≤ 70%)</span></div>
              <div className="cs-legend-row"><span className="cs-legend-bin amber"><Trash2 size={13}/></span><span>Nearly Full (70–90%)</span></div>
              <div className="cs-legend-row"><span className="cs-legend-bin red"><Trash2 size={13}/></span><span>Overflowing (≥ 90%)</span></div>
            </article>

            <article className="cs-control-card cs-simulation-controls">
              <h3>Simulation Controls</h3>
              <label>Time Speed</label>
              <div className="cs-speed-buttons">
                {["1x", "2x", "4x"].map((value) => <button key={value} className={speed === value ? "chosen" : ""} onClick={() => setSpeed(value)}>{value}</button>)}
              </div>
              <label htmlFor="cs-scenario">Scenario</label>
              <select id="cs-scenario" value={scenario} onChange={(e) => setScenario(e.target.value)}>
                <option>Normal Day</option>
                <option>Weekend Rush</option>
                <option>Festival Season</option>
                <option>Heavy Rain</option>
                <option>Collection Delay</option>
              </select>
              <button className="cs-start-btn" onClick={runSimulation}><Play size={13}/>{running ? "Pause Simulation" : "Start Simulation"}</button>
              {running && <p className="cs-simulation-state"><span/> Running · {simCount} cycles started</p>}
            </article>
          </aside>
        </section>

        <section className="cs-analytics-grid">
          <article className="cs-analytics-card">
            <h3>Fill Level Distribution</h3>
            <div className="cs-pie-layout">
              <div className="cs-pie-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={2} stroke="none">
                      {pieData.map((item) => <Cell key={item.name} fill={item.color}/>)}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="cs-pie-center"><strong>128</strong><span>Bins</span></div>
              </div>
              <div className="cs-pie-legend">
                {pieData.map((item) => <div key={item.name}><span><i style={{background:item.color}}/>{item.name}</span><b>{item.value}%</b></div>)}
              </div>
            </div>
          </article>

          <article className="cs-analytics-card">
            <h3>Real-time Fill Levels</h3>
            <div className="cs-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fillData} margin={{top:8,right:4,left:-20,bottom:0}}>
                  <CartesianGrid stroke="#eaf0f5" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="range" tick={{fontSize:9,fill:"#64758c"}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,50]} tick={{fontSize:9,fill:"#64758c"}} axisLine={false} tickLine={false}/>
                  <Tooltip/>
                  <Bar dataKey="count" radius={[4,4,0,0]}>
                    {fillData.map((item,index) => <Cell key={item.range} fill={["#29b65c","#65c97b","#91d78f","#ffb21c","#ff4b44"][index]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="cs-analytics-card cs-area-card">
            <h3>Area-wise Bin Status</h3>
            <div className="cs-area-list">
              {areaStats.map((area) => {
                const width = Math.min((area.full / area.total) * 2.5, 100);
                return <div className="cs-area-row" key={area.name}>
                  <span>{area.name}</span>
                  <div className="cs-area-track"><i style={{width:`${width}%`,background:area.full >= 25 ? "#ff4a4a" : area.full >= 15 ? "#ffb31a" : "#21b768"}}/></div>
                  <small>{area.full} / {area.total}</small>
                </div>;
              })}
            </div>
          </article>
        </section>

        <footer className="cs-footer"><span><i/>System ready</span><span>SmartBin AI · City Simulator {running ? "· Simulation active" : "· Preview mode"}</span></footer>
      </main>
    </div>
  );
}
