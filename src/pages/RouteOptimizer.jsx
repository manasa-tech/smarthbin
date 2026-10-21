import { useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp, FileText,
  History, Bell, UserRound, Menu, Home, ChevronDown, ChevronRight,
  Truck, Trash2, Clock3, Fuel, RotateCcw, Play, MapPin, Settings2
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from "recharts";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/route-optimizer.css";

const initialBins = [
  { id: "SB-01", pos: [12.973,77.592], fill: 42 },
  { id: "SB-02", pos: [12.981,77.601], fill: 84 },
  { id: "SB-03", pos: [12.962,77.581], fill: 58 },
  { id: "SB-04", pos: [12.954,77.604], fill: 94 },
  { id: "SB-05", pos: [12.989,77.611], fill: 35 },
  { id: "SB-06", pos: [12.945,77.615], fill: 77 },
  { id: "SB-07", pos: [12.935,77.588], fill: 65 },
  { id: "SB-08", pos: [12.963,77.627], fill: 91 },
  { id: "SB-09", pos: [12.978,77.625], fill: 28 },
  { id: "SB-10", pos: [12.931,77.625], fill: 48 },
  { id: "SB-11", pos: [12.951,77.574], fill: 88 },
  { id: "SB-12", pos: [12.925,77.604], fill: 72 },
  { id: "SB-13", pos: [12.995,77.585], fill: 63 },
  { id: "SB-14", pos: [12.942,77.635], fill: 22 },
  { id: "SB-15", pos: [12.966,77.595], fill: 96 },
  { id: "SB-16", pos: [12.917,77.618], fill: 52 },
  { id: "SB-17", pos: [12.986,77.575], fill: 38 },
  { id: "SB-18", pos: [12.938,77.608], fill: 81 },
  { id: "SB-19", pos: [12.958,77.613], fill: 46 },
  { id: "SB-20", pos: [12.929,77.578], fill: 73 },
  { id: "SB-21", pos: [12.979,77.638], fill: 33 },
  { id: "SB-22", pos: [12.949,77.622], fill: 86 },
  { id: "SB-23", pos: [12.913,77.593], fill: 55 },
  { id: "SB-24", pos: [12.993,77.621], fill: 92 },
  { id: "SB-25", pos: [12.941,77.565], fill: 41 },
  { id: "SB-26", pos: [12.969,77.646], fill: 79 },
  { id: "SB-27", pos: [12.921,77.635], fill: 31 },
  { id: "SB-28", pos: [12.988,77.594], fill: 68 },
];

const routeColors = ["#079c4b", "#0868ff", "#ff6900"];

const routeCoordinates = [
  [[12.955,77.604],[12.945,77.595],[12.935,77.588],[12.925,77.596],[12.931,77.610],[12.941,77.615],[12.949,77.622],[12.955,77.604]],
  [[12.955,77.604],[12.966,77.595],[12.978,77.585],[12.989,77.591],[12.981,77.601],[12.973,77.612],[12.962,77.610],[12.955,77.604]],
  [[12.955,77.604],[12.962,77.620],[12.978,77.625],[12.989,77.611],[12.978,77.638],[12.958,77.627],[12.942,77.635],[12.955,77.604]],
];

const baseRoutes = [
  { id: 1, bins: 11, distance: 16.1, time: "1h 05m", minutes: 65, fuel: 2.6 },
  { id: 2, bins: 9, distance: 12.4, time: "45 mins", minutes: 45, fuel: 2.0 },
  { id: 3, bins: 8, distance: 14.1, time: "55 mins", minutes: 55, fuel: 2.2 },
];

const comparison = [
  { metric: "Total Distance", before: "58.9 km", after: "42.6 km", improvement: "↓ 28%" },
  { metric: "Estimated Time", before: "4h 05m", after: "2h 45m", improvement: "↓ 32%" },
  { metric: "Estimated Fuel", before: "9.1 L", after: "6.8 L", improvement: "↓ 25%" },
  { metric: "Bins Collected", before: "28", after: "28", improvement: "—" },
];

function markerIcon(fill) {
  const color = fill >= 90 ? "#ff3737" : fill >= 70 ? "#ffac00" : "#079b4d";
  return L.divIcon({
    className: "ro-bin-marker",
    html: `<div style="background:${color}"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></svg></div>`,
    iconSize: [23,23],
    iconAnchor: [11,11],
  });
}

function DepotIcon() {
  return L.divIcon({
    className: "ro-depot-marker",
    html: '<div>⌂</div>',
    iconSize: [27,27],
    iconAnchor: [13,13],
  });
}

function Sidebar({ active, onNavigate }) {
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
    <aside className="ro-sidebar">
      <div className="ro-brand">
        <span><Recycle size={24}/></span>
        <div><strong>SmartBin</strong><small>Smart Waste Management</small></div>
      </div>
      <div className="ro-menu-label">MAIN MENU</div>
      <nav className="ro-nav">
        {items.map(({label,icon:Icon}) => (
          <button key={label} className={`ro-nav-item ${active === label ? "active" : ""}`} onClick={() => onNavigate(label)}>
            <Icon size={18}/><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="ro-sidebar-note"><i/><div><strong>Waste Management</strong><p>Monitor bins, optimize collection routes, and manage reports.</p></div></div>
      <button className="ro-collapse" aria-label="Collapse sidebar"><ChevronDown size={17}/></button>
    </aside>
  );
}

function StatCard({ icon: Icon, value, label, kind, trend }) {
  return (
    <article className="ro-stat-card">
      <span className={`ro-stat-icon ${kind}`}><Icon size={20}/></span>
      <div className="ro-stat-info"><strong>{value}</strong><span>{label}</span>{trend && <small>{trend}</small>}</div>
    </article>
  );
}

export default function RouteOptimizer() {
  const [active, setActive] = useState("Route Optimizer");
  const [objective, setObjective] = useState("Minimize Distance (Default)");
  const [routeCount, setRouteCount] = useState(3);
  const [capacity, setCapacity] = useState("10 bins");
  const [start, setStart] = useState("Main Depot");
  const [includeNearly, setIncludeNearly] = useState(true);
  const [includeNormal, setIncludeNormal] = useState(true);
  const [traffic, setTraffic] = useState(true);
  const [optimized, setOptimized] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(1);
  const [notice, setNotice] = useState("");

  const visibleRoutes = baseRoutes.slice(0, routeCount);
  const displayedDistance = routeCount === 2 ? "34.8 km" : routeCount === 4 ? "48.2 km" : "42.6 km";
  const displayedTime = routeCount === 2 ? "2h 10m" : routeCount === 4 ? "3h 15m" : "2h 45m";
  const displayedFuel = routeCount === 2 ? "5.5 L" : routeCount === 4 ? "7.6 L" : "6.8 L";

  function optimizeRoutes() {
    setOptimized(true);
    setNotice(`Demo optimization complete: ${routeCount} routes using "${objective}". Connect a routing backend for real route optimization.`);
  }

  function resetSettings() {
    setObjective("Minimize Distance (Default)");
    setRouteCount(3);
    setCapacity("10 bins");
    setStart("Main Depot");
    setIncludeNearly(true);
    setIncludeNormal(true);
    setTraffic(true);
    setOptimized(false);
    setSelectedRoute(1);
    setNotice("Route settings reset.");
  }

  function navigate(label) {
    setActive(label);
    if (label !== "Route Optimizer") {
      window.dispatchEvent(new CustomEvent("smartbin-nav", { detail: label }));
      setNotice(`${label} selected. Connect this item to its page route when ready.`);
    } else setNotice("");
  }

  return (
    <div className="ro-app">
      <Sidebar active={active} onNavigate={navigate}/>
      <main className="ro-main">
        <header className="ro-topbar">
          <button className="ro-menu-toggle" aria-label="Menu"><Menu size={19}/></button>
          <div className="ro-topbar-spacer"/>
          <button className="ro-bell" aria-label="Notifications" onClick={() => setNotice("You have notifications to review.")}><Bell size={17}/><i/></button>
          <span className="ro-avatar"><UserRound size={19}/></span>
          <div className="ro-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="ro-breadcrumb"><Home size={12}/><span>Home</span><b>›</b><strong>Route Optimizer</strong></div>

        <section className="ro-heading">
          <div className="ro-heading-icon"><Route size={32}/></div>
          <div className="ro-heading-copy"><h1>Route Optimizer</h1><p>Generate the most efficient waste collection routes using AI. Save time, fuel, and resources.</p></div>
          <div className="ro-heading-actions">
            <button className="ro-primary-btn" onClick={optimizeRoutes}><Play size={12}/>Optimize Routes</button>
            <button className="ro-secondary-btn" onClick={resetSettings}><RotateCcw size={13}/>Reset</button>
          </div>
        </section>

        {notice && <div className="ro-notice"><span>{notice}</span><button onClick={() => setNotice("")}>×</button></div>}

        <section className="ro-stats">
          <StatCard icon={Truck} value={routeCount} label="Collection Routes" kind="green" trend="Optimized for efficiency"/>
          <StatCard icon={Trash2} value="28" label="Bins to Collect" kind="green" trend="Across all routes"/>
          <StatCard icon={TrendingUp} value={displayedDistance} label="Total Distance" kind="blue" trend="↓ 28% vs. previous route"/>
          <StatCard icon={Clock3} value={displayedTime} label="Estimated Time" kind="green" trend="↓ 32% vs. previous route"/>
          <StatCard icon={Fuel} value={displayedFuel} label="Estimated Fuel" kind="red" trend="↓ 25% vs. previous route"/>
        </section>

        <section className="ro-workspace">
          <article className="ro-map-panel">
            <MapContainer center={[12.96,77.605]} zoom={13} zoomControl={false} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {initialBins.filter((bin) => includeNormal || bin.fill >= 70).filter((bin) => includeNearly || bin.fill < 70).map((bin) => (
                <Marker key={bin.id} position={bin.pos} icon={markerIcon(bin.fill)}>
                  <Popup><strong>{bin.id}</strong><br/>Fill level: {bin.fill}%<br/>Status: {bin.fill >= 90 ? "Overflowing" : bin.fill >= 70 ? "Nearly Full" : "Normal"}</Popup>
                </Marker>
              ))}
              {visibleRoutes.map((route) => (
                <Polyline
                  key={route.id}
                  positions={routeCoordinates[route.id - 1]}
                  pathOptions={{ color: routeColors[route.id - 1], weight: selectedRoute === route.id ? 4 : 3, opacity: selectedRoute === route.id ? .95 : .7 }}
                  eventHandlers={{ click: () => setSelectedRoute(route.id) }}
                />
              ))}
              <Marker position={[12.955,77.604]} icon={DepotIcon()}>
                <Popup>Main Depot / Route Start</Popup>
              </Marker>
              <ZoomControl position="bottomleft"/>
            </MapContainer>

            <div className="ro-map-legend">
              <div><i className="ro-pin green"/>Normal Bins (≤ 70%)</div>
              <div><i className="ro-pin amber"/>Nearly Full (70–90%)</div>
              <div><i className="ro-pin red"/>Overflowing (≥ 90%)</div>
              <div><i className="ro-line green"/>Route 1</div>
              {routeCount >= 2 && <div><i className="ro-line blue"/>Route 2</div>}
              {routeCount >= 3 && <div><i className="ro-line orange"/>Route 3</div>}
              <div><i className="ro-depot-key"/>Depot / Start</div>
            </div>

            <div className="ro-map-route-label" style={{top:"52%",left:"29%",borderColor:routeColors[selectedRoute-1]}}>
              <strong>Route {selectedRoute}</strong>
              <span>{visibleRoutes[selectedRoute-1]?.bins || 8} bins · {visibleRoutes[selectedRoute-1]?.distance || 14.1} km</span>
              <span>{visibleRoutes[selectedRoute-1]?.time || "55 mins"}</span>
            </div>
          </article>

          <aside className="ro-settings-card">
            <h3><Settings2 size={14}/>Optimization Settings</h3>
            <label htmlFor="ro-objective">Objective</label>
            <select id="ro-objective" value={objective} onChange={(e) => setObjective(e.target.value)}>
              <option>Minimize Distance (Default)</option>
              <option>Minimize Travel Time</option>
              <option>Minimize Fuel Consumption</option>
              <option>Prioritize Overflowing Bins</option>
            </select>

            <label>Number of Routes</label>
            <div className="ro-route-count">
              {[2,3,4].map((num) => <button key={num} className={routeCount === num ? "chosen" : ""} onClick={() => {setRouteCount(num); if (selectedRoute > num) setSelectedRoute(num);}}>{num}</button>)}
            </div>

            <label htmlFor="ro-capacity">Truck Capacity (bins)</label>
            <select id="ro-capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
              <option>5 bins</option><option>10 bins</option><option>15 bins</option><option>20 bins</option>
            </select>

            <label htmlFor="ro-start">Start Location</label>
            <select id="ro-start" value={start} onChange={(e) => setStart(e.target.value)}>
              <option>Main Depot</option><option>Downtown Depot</option><option>North Depot</option><option>South Depot</option>
            </select>

            <div className="ro-toggles">
              <button onClick={() => setIncludeNearly(!includeNearly)} className={`ro-toggle-row ${includeNearly ? "on" : ""}`}><i/><span>Include Nearly Full Bins (70–90%)</span></button>
              <button onClick={() => setIncludeNormal(!includeNormal)} className={`ro-toggle-row ${includeNormal ? "on" : ""}`}><i/><span>Include Normal Bins (≤ 70%)</span></button>
              <button onClick={() => setTraffic(!traffic)} className={`ro-toggle-row ${traffic ? "on" : ""}`}><i/><span>Real-time Traffic Data</span></button>
            </div>

            <button className="ro-optimize-bottom" onClick={optimizeRoutes}><Play size={12}/>Optimize Routes</button>
            {optimized && <div className="ro-optimized-note">✓ Demo routes updated with your selected settings.</div>}
          </aside>
        </section>

        <section className="ro-bottom-grid">
          <article className="ro-bottom-card ro-route-details">
            <h3>Route Details</h3>
            {visibleRoutes.map((route) => (
              <button key={route.id} className={`ro-route-row ${selectedRoute === route.id ? "selected" : ""}`} onClick={() => setSelectedRoute(route.id)}>
                <span className="ro-route-badge" style={{background:routeColors[route.id-1]}}>Route {route.id}</span>
                <span>{route.bins} bins</span><span>{route.distance} km</span><span>{route.time}</span><ChevronRight size={14}/>
              </button>
            ))}
          </article>

          <article className="ro-bottom-card">
            <h3>Bin Status by Route</h3>
            <div className="ro-status-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visibleRoutes.map((route) => ({name:`Route ${route.id}`,normal:route.id === 1 ? 6 : route.id === 2 ? 4 : 5,nearly:route.id === 1 ? 3 : route.id === 2 ? 3 : 3,overflow:route.id === 1 ? 2 : route.id === 2 ? 2 : 3}))} margin={{top:8,right:5,left:-22,bottom:0}}>
                  <CartesianGrid stroke="#eaf0f5" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="name" tick={{fontSize:8,fill:"#60728a"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:8,fill:"#60728a"}} axisLine={false} tickLine={false}/>
                  <Tooltip/>
                  <Bar dataKey="normal" name="Normal" stackId="a" fill="#20ad58" radius={[2,2,0,0]}/>
                  <Bar dataKey="nearly" name="Nearly Full" stackId="a" fill="#ffb51a"/>
                  <Bar dataKey="overflow" name="Overflowing" stackId="a" fill="#ff4a40" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="ro-chart-legend"><span><i className="green"/>Normal</span><span><i className="amber"/>Nearly Full</span><span><i className="red"/>Overflowing</span></div>
          </article>

          <article className="ro-bottom-card ro-comparison-card">
            <h3>Efficiency Comparison</h3>
            <div className="ro-comparison-table-wrap">
              <table className="ro-comparison-table">
                <thead><tr><th>METRIC</th><th>PREVIOUS ROUTES</th><th>OPTIMIZED ROUTES</th><th>IMPROVEMENT</th></tr></thead>
                <tbody>{comparison.map((row) => <tr key={row.metric}><td>{row.metric}</td><td>{row.before}</td><td><strong>{row.metric === "Total Distance" ? displayedDistance : row.metric === "Estimated Time" ? displayedTime : row.metric === "Estimated Fuel" ? displayedFuel : row.after}</strong></td><td><span>{row.improvement}</span></td></tr>)}</tbody>
              </table>
            </div>
          </article>
        </section>

        <footer className="ro-footer"><span><i/>Route planning preview ready</span><span>SmartBin AI · {traffic ? "Traffic enabled" : "Traffic disabled"} · {optimized ? "Demo optimized" : "Preview mode"}</span></footer>
      </main>
    </div>
  );
}
