import { useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp,
  FileText, History, Bell, UserRound, Menu, Home, ChevronDown,
  ChevronRight, Trash2, Clock3, BarChart3, AlertTriangle, Layers,
  CheckCircle2, Lightbulb, RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/overflow-prediction.css";

const bins = [
  { id:"SB-104", location:"Downtown", fill:92, hours:6, pos:[12.9716,77.5946] },
  { id:"SB-078", location:"Riverside", fill:91, hours:8, pos:[12.985,77.59] },
  { id:"SB-221", location:"Eastside", fill:89, hours:10, pos:[12.965,77.63] },
  { id:"SB-067", location:"Tech Park", fill:87, hours:12, pos:[12.935,77.61] },
  { id:"SB-132", location:"West End", fill:85, hours:14, pos:[12.96,77.56] },
  { id:"SB-045", location:"Central Park", fill:96, hours:4, pos:[12.982,77.57] },
  { id:"SB-092", location:"Lakeside", fill:77, hours:18, pos:[12.945,77.62] },
  { id:"SB-183", location:"Industrial Area", fill:42, hours:30, pos:[12.925,77.65] },
  { id:"SB-155", location:"Maplewood", fill:62, hours:24, pos:[12.92,77.58] },
  { id:"SB-204", location:"Brookfield", fill:94, hours:5, pos:[12.93,77.67] },
  { id:"SB-076", location:"University", fill:34, hours:36, pos:[12.95,77.64] },
  { id:"SB-109", location:"North Gate", fill:56, hours:28, pos:[13.0,77.59] },
  { id:"SB-112", location:"Garden Layout", fill:68, hours:22, pos:[12.94,77.625] },
  { id:"SB-161", location:"South Market", fill:93, hours:7, pos:[12.90,77.64] },
  { id:"SB-192", location:"Metro Junction", fill:73, hours:16, pos:[12.955,77.60] },
  { id:"SB-200", location:"Airport Road", fill:38, hours:32, pos:[13.015,77.65] },
  { id:"SB-202", location:"Parkside", fill:48, hours:29, pos:[12.99,77.57] },
  { id:"SB-211", location:"South Avenue", fill:82, hours:13, pos:[12.905,77.60] },
  { id:"SB-214", location:"Greenfield", fill:25, hours:40, pos:[12.945,77.57] },
  { id:"SB-216", location:"Lake Road", fill:88, hours:9, pos:[12.975,77.63] },
  { id:"SB-218", location:"East Market", fill:51, hours:27, pos:[12.96,77.66] },
  { id:"SB-220", location:"Riverside East", fill:79, hours:15, pos:[12.99,77.61] },
  { id:"SB-222", location:"Hillview", fill:31, hours:37, pos:[12.93,77.55] },
  { id:"SB-225", location:"South Tech Park", fill:95, hours:5, pos:[12.89,77.68] },
];

const statusOf = (fill) => fill >= 90 ? "High Risk" : fill >= 70 ? "Medium Risk" : "Low Risk";
const markerIcon = (fill, selected) => {
  const color = fill >= 90 ? "#ff3939" : fill >= 70 ? "#ffae00" : "#079b53";
  return L.divIcon({
    className: "op-map-marker",
    html: `<div style="background:${color};${selected ? "outline:3px solid #1677ff;outline-offset:2px;" : ""}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></svg></div>`,
    iconSize: [23,23], iconAnchor: [11,11],
  });
};

function Sidebar({ active, onNavigate }) {
  const items = [
    ["Dashboard",LayoutDashboard],["City Simulator",Map],
    ["AI Waste Classifier",Brain],["Route Optimizer",Route],
    ["Overflow Prediction",TrendingUp],["Citizen Reports",FileText],
    ["Reports History",History],
  ];
  return (
    <aside className="op-sidebar">
      <div className="op-brand"><span><Recycle size={24}/></span><div><strong>SmartBin</strong><small>Smart Waste Management</small></div></div>
      <div className="op-menu-label">MAIN MENU</div>
      <nav className="op-nav">
        {items.map(([label,Icon]) => <button key={label} className={`op-nav-item ${active === label ? "active" : ""}`} onClick={() => onNavigate(label)}><Icon size={19}/><span>{label}</span></button>)}
      </nav>
      <div className="op-sidebar-note"><i/><div><strong>Waste Management</strong><p>Monitor bins, optimize collection routes, and manage reports.</p></div></div>
      <button className="op-collapse" aria-label="Collapse sidebar"><ChevronDown size={17}/></button>
    </aside>
  );
}

function Metric({ icon: Icon, value, label, trend, kind }) {
  return <article className="op-metric"><div className={`op-metric-icon ${kind}`}><Icon size={20}/></div><div className="op-metric-copy"><strong>{value}</strong><span>{label}</span></div><div className={`op-trend ${kind === "red" ? "negative" : ""}`}>{trend}<small>vs last week</small></div></article>;
}

export default function OverflowPrediction() {
  const [active, setActive] = useState("Overflow Prediction");
  const [riskFilter, setRiskFilter] = useState("All Bins");
  const [selectedId, setSelectedId] = useState("SB-104");
  const [period, setPeriod] = useState("This Week");
  const [notice, setNotice] = useState("");

  const selected = bins.find((bin) => bin.id === selectedId) || bins[0];
  const predicted = bins.filter((bin) => bin.fill >= 85).sort((a,b) => b.fill - a.fill);
  const filteredBins = bins.filter((bin) => {
    if (riskFilter === "High Risk") return bin.fill >= 90;
    if (riskFilter === "Medium Risk") return bin.fill >= 70 && bin.fill < 90;
    if (riskFilter === "Low Risk") return bin.fill < 70;
    return true;
  });
  const trendData = period === "Today"
    ? [{day:"9 AM",high:8,medium:18,normal:41},{day:"11 AM",high:12,medium:22,normal:29},{day:"1 PM",high:18,medium:25,normal:23},{day:"3 PM",high:25,medium:29,normal:17},{day:"5 PM",high:32,medium:34,normal:12}]
    : [{day:"Oct 3",high:8,medium:18,normal:41},{day:"Oct 4",high:10,medium:23,normal:27},{day:"Oct 5",high:13,medium:25,normal:28},{day:"Oct 6",high:22,medium:30,normal:21},{day:"Oct 7",high:24,medium:21,normal:13},{day:"Oct 8",high:34,medium:25,normal:9},{day:"Oct 9",high:47,medium:31,normal:7}];

  function navigate(label) {
    setActive(label);
    if (label !== "Overflow Prediction") {
      window.dispatchEvent(new CustomEvent("smartbin-nav", {detail:label}));
      setNotice(`${label} selected. Connect this menu item to its page route when ready.`);
    } else setNotice("");
  }

  return (
    <div className="op-app">
      <Sidebar active={active} onNavigate={navigate}/>
      <main className="op-main">
        <header className="op-topbar">
          <button className="op-menu-button" aria-label="Menu"><Menu size={19}/></button>
          <div className="op-topbar-spacer"/>
          <button className="op-bell" aria-label="Notifications" onClick={() => setNotice(`${predicted.length} bins are approaching overflow.`)}><Bell size={18}/><i/></button>
          <span className="op-avatar"><UserRound size={20}/></span>
          <div className="op-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="op-breadcrumb"><Home size={13}/><span>Home</span><b>›</b><strong>Overflow Prediction</strong></div>

        <section className="op-heading">
          <div className="op-heading-icon"><TrendingUp size={32}/></div>
          <div className="op-heading-copy"><h1>Overflow Prediction</h1><p>Predict bin overflow using AI and real-time data. Take action before bins get full.</p></div>
          <div className="op-heading-filters">
            <div className="op-date"><span>▦</span><div><strong>Oct 9, 2026</strong><small>Thursday</small></div></div>
            <select aria-label="Prediction period" value={period} onChange={(e) => setPeriod(e.target.value)}><option>This Week</option><option>Today</option><option>This Month</option></select>
          </div>
        </section>

        {notice && <div className="op-notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}

        <section className="op-metrics">
          <Metric icon={AlertTriangle} value="10" label="Bins Predicted to Overflow" trend="↑ +25%" kind="red"/>
          <Metric icon={Clock3} value="18" label="Nearly Full Bins" trend="↓ -12%" kind="amber"/>
          <Metric icon={Trash2} value="96" label="Normal Bins" trend="↑ +8%" kind="green"/>
          <Metric icon={BarChart3} value="92%" label="Prediction Accuracy" trend="↑ +5%" kind="blue"/>
        </section>

        <section className="op-main-grid">
          <article className="op-card op-map-card">
            <h2>Overflow Risk Map</h2>
            <p className="op-card-subtitle">Real-time bin status and AI-predicted overflow risk across the city</p>
            <div className="op-map-wrap">
              <MapContainer center={[12.96,77.605]} zoom={13} zoomControl={false} scrollWheelZoom>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {filteredBins.map((bin) => <Marker key={bin.id} position={bin.pos} icon={markerIcon(bin.fill,bin.id === selectedId)} eventHandlers={{click:()=>setSelectedId(bin.id)}}><Popup><strong>{bin.id}</strong><br/>Location: {bin.location}<br/>Fill level: {bin.fill}%<br/>Risk: {statusOf(bin.fill)}</Popup></Marker>)}
                <ZoomControl position="bottomleft"/>
              </MapContainer>
              <div className="op-map-legend">
                <div><i className="op-dot high"/>High Risk (≥ 90%)</div>
                <div><i className="op-dot medium"/>Medium Risk (70–90%)</div>
                <div><i className="op-dot low"/>Low Risk (&lt; 70%)</div>
                <div><i className="op-dot selected"/>Selected Bin</div>
              </div>
              <div className="op-selected-bin">
                <div className={`op-selected-icon ${selected.fill >= 90 ? "high" : selected.fill >= 70 ? "medium" : "low"}`}><Trash2 size={17}/></div>
                <div><strong>Bin #{selected.id}</strong><p>Fill Level: <b>{selected.fill}%</b></p><p>Predicted Overflow: <b>{selected.hours} hours</b></p><small>Status: <span>{statusOf(selected.fill)}</span></small></div>
                <ChevronRight size={15}/>
              </div>
            </div>
          </article>

          <div className="op-right-column">
            <article className="op-card op-predicted-card">
              <div className="op-card-heading"><h2>Predicted Overflow Bins</h2><button onClick={() => {setRiskFilter("High Risk");setNotice("Showing all high-risk bins in the map.");}}>View All <ChevronRight size={13}/></button></div>
              <div className="op-predicted-list">
                {predicted.slice(0,5).map((bin) => <button key={bin.id} className={`op-predicted-row ${selectedId === bin.id ? "selected" : ""}`} onClick={() => setSelectedId(bin.id)}>
                  <span className={`op-predicted-trash ${bin.fill >= 90 ? "high" : "medium"}`}><Trash2 size={18}/></span>
                  <span className="op-predicted-name"><strong>#{bin.id}</strong><small>{bin.location}</small></span>
                  <span className={`op-risk-percent ${bin.fill >= 90 ? "high" : "medium"}`}>{bin.fill}%</span>
                  <span className="op-time-left"><strong>{bin.hours} hours</strong><small>until overflow</small></span>
                </button>)}
              </div>
            </article>

            <article className="op-card op-filter-card">
              <h2>Risk Level Filter</h2>
              <div className="op-risk-filters">
                {["All Bins","High Risk","Medium Risk","Low Risk"].map((risk) => <button key={risk} className={`op-risk-filter ${riskFilter === risk ? "active" : ""} ${risk.toLowerCase().replace(" ","-")}`} onClick={() => setRiskFilter(risk)}>{risk}</button>)}
              </div>
              <p className="op-filter-count">Showing {filteredBins.length} bins on the map</p>
            </article>
          </div>
        </section>

        <section className="op-bottom-grid">
          <article className="op-card op-trend-card">
            <div className="op-card-heading"><h2>Overflow Prediction Trend</h2><span className="op-period-label">{period}</span></div>
            <div className="op-line-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{top:8,right:8,left:-20,bottom:0}}>
                  <CartesianGrid stroke="#e9eff5" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="day" tick={{fontSize:9,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,50]} ticks={[0,10,20,30,40,50]} tick={{fontSize:9,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="high" name="High Risk" stroke="#ff4141" strokeWidth={2} dot={{r:2.5}}/>
                  <Line type="monotone" dataKey="medium" name="Medium Risk" stroke="#ffae00" strokeWidth={2} dot={{r:2.5}}/>
                  <Line type="monotone" dataKey="normal" name="Normal" stroke="#19a75b" strokeWidth={2} dot={{r:2.5}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="op-chart-legend"><span><i className="high"/>High Risk</span><span><i className="medium"/>Medium Risk</span><span><i className="low"/>Normal</span></div>
          </article>

          <article className="op-card op-distribution-card">
            <h2>Bin Status Distribution</h2>
            <div className="op-distribution-content">
              <div className="op-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={[{name:"High Risk",value:10,color:"#ff4141"},{name:"Medium Risk",value:18,color:"#ffb000"},{name:"Low Risk",value:96,color:"#18ad62"}]} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={2} stroke="none">
                    {[{color:"#ff4141"},{color:"#ffb000"},{color:"#18ad62"}].map((item,i)=><Cell key={i} fill={item.color}/>)}
                  </Pie><Tooltip/></PieChart>
                </ResponsiveContainer>
                <div className="op-donut-center"><strong>124</strong><span>Total Bins</span></div>
              </div>
              <div className="op-distribution-legend">
                <div><span><i className="high"/>High Risk</span><b>8% (10)</b></div>
                <div><span><i className="medium"/>Medium Risk</span><b>15% (18)</b></div>
                <div><span><i className="low"/>Low Risk</span><b>77% (96)</b></div>
              </div>
            </div>
          </article>

          <article className="op-card op-insights-card">
            <h2>AI Prediction Insights</h2>
            <div className="op-insight red"><AlertTriangle size={23}/><p><strong>10 bins</strong> are likely to overflow within the next 12 hours.</p></div>
            <div className="op-insight amber"><span className="op-bulb">♧</span><p>Collection routes can be optimized to empty high-risk bins first.</p></div>
            <div className="op-insight green"><CheckCircle2 size={23}/><p>Overall overflow risk has decreased by 12% compared to last week.</p></div>
          </article>
        </section>
        <footer className="op-footer"><span><i/>Prediction system ready</span><span>SmartBin AI · Overflow Prediction · Demo data</span></footer>
      </main>
    </div>
  );
}
