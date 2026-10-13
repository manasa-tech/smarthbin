import { useMemo, useState } from "react";
import {
  Home, ChevronRight, ChevronDown, Bell, FileText, Plus, Search,
  AlertTriangle, Clock, CheckCircle2, MapPin, ImagePlus, Send,
  Eye, Filter, Trash2, LocateFixed, X
} from "lucide-react";
import "./citizen-reports.css";

const initialReports = [
  { id: 104, type: "Overflowing Bin", location: "HSR Layout", description: "Bin is full and waste spilled outside.", status: "Pending", date: "Oct 9, 2026", time: "02:15 PM" },
  { id: 103, type: "Uncollected Waste", location: "Indiranagar", description: "Garbage not collected for 3 days.", status: "In Progress", date: "Oct 8, 2026", time: "05:20 PM" },
  { id: 102, type: "Damaged Bin", location: "Koramangala", description: "Bin lid is broken.", status: "Resolved", date: "Oct 7, 2026", time: "11:10 AM" },
  { id: 101, type: "Overflowing Bin", location: "Whitefield", description: "Overflowing during evening hours.", status: "Resolved", date: "Oct 6, 2026", time: "08:45 PM" },
];

const markers = [
  { x: 18, y: 39, status: "Pending" },
  { x: 35, y: 30, status: "Resolved" },
  { x: 53, y: 35, status: "Pending" },
  { x: 68, y: 25, status: "In Progress" },
  { x: 75, y: 39, status: "In Progress" },
  { x: 27, y: 68, status: "Resolved" },
  { x: 55, y: 72, status: "Resolved" },
  { x: 67, y: 75, status: "Pending" },
  { x: 32, y: 86, status: "In Progress" },
];

function StatusBadge({ status }) {
  return <span className={"cr-status cr-status-" + status.toLowerCase().replace(" ", "-")}>{status}</span>;
}

export default function CitizenReports() {
  const [reports, setReports] = useState(initialReports);
  const [filter, setFilter] = useState("All Status");
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("Overflowing Bin");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapSearch, setMapSearch] = useState("");

  const counts = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending").length,
    progress: reports.filter(r => r.status === "In Progress").length,
    resolved: reports.filter(r => r.status === "Resolved").length,
  }), [reports]);

  const filteredReports = reports.filter(r => {
    const matchesStatus = filter === "All Status" || r.status === filter;
    const text = `${r.id} ${r.type} ${r.location} ${r.description}`.toLowerCase();
    return matchesStatus && text.includes(search.toLowerCase());
  });

  function submitReport(e) {
    e.preventDefault();
    if (!location.trim()) {
      setMessage("Please enter a location before submitting.");
      return;
    }
    const now = new Date();
    const newReport = {
      id: Math.max(0, ...reports.map(r => r.id)) + 1,
      type: reportType,
      location: location.trim(),
      description: description.trim() || "No additional details provided.",
      status: "Pending",
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      photoUrl: photo ? URL.createObjectURL(photo) : null,
    };
    setReports(previous => [newReport, ...previous]);
    setLocation("");
    setDescription("");
    setPhoto(null);
    setMessage("Report submitted successfully!");
    setFilter("All Status");
    setSearch("");
  }

  const total = Math.max(1, reports.length);
  const pendingPercent = Math.round(counts.pending / total * 100);
  const progressPercent = Math.round(counts.progress / total * 100);
  const resolvedPercent = Math.round(counts.resolved / total * 100);

  return (
    <div className="citizen-reports">
      <div className="cr-topbar">
        <div className="cr-breadcrumb"><Home size={14}/><ChevronRight size={14}/>Citizen Reports</div>
        <div className="cr-admin"><Bell size={18}/><span className="cr-avatar">SA</span><div><b>SmartBin Admin</b><small>Administrator <ChevronDown size={12}/></small></div></div>
      </div>

      <header className="cr-heading">
        <div className="cr-heading-icon"><FileText size={30}/></div>
        <div className="cr-heading-text">
          <h1>Citizen Reports</h1>
          <p>Report overflowing bins, uncollected waste, or other sanitation issues in your area.</p>
        </div>
        <button className="cr-btn cr-btn-green" onClick={() => document.getElementById("cr-report-form")?.scrollIntoView({behavior:"smooth",block:"center"})}><Plus size={18}/>New Report</button>
      </header>

      <section className="cr-kpis">
        <article className="cr-kpi">
          <span className="cr-kpi-icon cr-red"><AlertTriangle/></span>
          <div><strong>{counts.total + 38}</strong><span>Total Reports</span><small>From citizens</small></div>
        </article>
        <article className="cr-kpi">
          <span className="cr-kpi-icon cr-yellow"><Clock/></span>
          <div className="cr-kpi-main"><strong>{counts.pending + 16}</strong><span>Pending</span></div>
          <div className="cr-kpi-progress"><small>43%</small><i><b className="cr-bar-yellow" style={{width:"43%"}}/></i></div>
        </article>
        <article className="cr-kpi">
          <span className="cr-kpi-icon cr-green"><CheckCircle2/></span>
          <div className="cr-kpi-main"><strong>{counts.resolved + 18}</strong><span>Resolved</span></div>
          <div className="cr-kpi-progress"><small>48%</small><i><b style={{width:"48%"}}/></i></div>
        </article>
        <article className="cr-kpi">
          <span className="cr-kpi-icon cr-blue"><Clock/></span>
          <div className="cr-kpi-main"><strong>{counts.progress}</strong><span>In Progress</span></div>
          <div className="cr-kpi-progress"><small>9%</small><i><b className="cr-bar-blue" style={{width:"9%"}}/></i></div>
        </article>
      </section>

      <section className="cr-main-grid">
        <div className="cr-left-column">
          <article className="cr-map">
            <div className="cr-map-art">
              <div className="cr-map-park park-a"/><div className="cr-map-park park-b"/><div className="cr-map-park park-c"/>
              <div className="cr-map-water"/>
              {Array.from({length:9},(_,i)=><div className={"cr-map-road road-"+i} key={i}/>)}
              <span className="cr-map-place place-a">Yeshwanthpur</span>
              <span className="cr-map-place place-b">Indiranagar</span>
              <span className="cr-map-place place-c">Bengaluru</span>
              <span className="cr-map-place place-d">Whitefield</span>
              <span className="cr-map-place place-e">Malleswaram</span>
              <span className="cr-map-place place-f">Koramangala</span>
              <span className="cr-map-place place-g">HSR Layout</span>
              <span className="cr-map-place place-h">RR Nagar</span>
              {markers.map((m,i)=><button key={i} title={m.status} className={"cr-map-marker "+m.status.toLowerCase().replace(" ","-")} style={{left:m.x+"%",top:m.y+"%"}} onClick={()=>setFilter(m.status)}><span>{m.status==="Resolved"?"✓":"!"}</span></button>)}
              <div className="cr-map-search"><Search size={16}/><input value={mapSearch} onChange={e=>setMapSearch(e.target.value)} placeholder="Search location..."/></div>
              <div className="cr-map-controls"><button onClick={()=>setMessage("Map zoom is illustrative in demo mode.")}>+</button><button onClick={()=>setMessage("Map zoom is illustrative in demo mode.")}>−</button><button onClick={()=>setMessage("Showing the illustrative Bengaluru map.")}><LocateFixed size={16}/></button></div>
              <div className="cr-map-legend"><span><i className="cr-dot cr-dot-red"/>Pending</span><span><i className="cr-dot cr-dot-blue"/>In Progress</span><span><i className="cr-dot cr-dot-green"/>Resolved</span></div>
              <div className="cr-map-caption">Illustrative map · Demo report locations</div>
            </div>
          </article>

          <article className="cr-panel cr-recent">
            <div className="cr-panel-heading"><h3>Recent Reports</h3><div className="cr-table-actions"><label className="cr-search"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reports"/></label><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All Status</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select><button className="cr-filter-btn" onClick={()=>{setFilter("All Status");setSearch("");}} title="Clear filters"><Filter size={15}/></button></div></div>
            <div className="cr-table-wrap"><table className="cr-table"><thead><tr><th>#</th><th>Image</th><th>Type</th><th>Location</th><th>Description</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>{filteredReports.map(r=><tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.photoUrl?<img className="cr-thumb" src={r.photoUrl} alt="Report attachment"/>:<div className="cr-placeholder"><Trash2 size={20}/></div>}</td>
                <td>{r.type}</td><td>{r.location}</td><td className="cr-description">{r.description}</td><td><StatusBadge status={r.status}/></td><td>{r.date}<small className="cr-time">{r.time}</small></td>
                <td><button className="cr-view-btn" onClick={()=>setSelectedReport(r)}><Eye size={13}/>View</button></td>
              </tr>)}
              {filteredReports.length===0&&<tr><td colSpan="8" className="cr-empty">No reports match your filters.</td></tr>}
              </tbody></table></div>
          </article>
        </div>

        <aside className="cr-right-column">
          <article className="cr-panel cr-form-panel" id="cr-report-form">
            <h3>Submit a Report</h3><p className="cr-form-subtitle">Help us keep your city clean!</p>
            <form onSubmit={submitReport}>
              <label htmlFor="cr-type">Report Type</label>
              <select id="cr-type" value={reportType} onChange={e=>setReportType(e.target.value)}>
                <option>Overflowing Bin</option><option>Uncollected Waste</option><option>Damaged Bin</option><option>Illegal Dumping</option><option>Other Issue</option>
              </select>
              <label htmlFor="cr-location">Location</label>
              <div className="cr-location-input"><input id="cr-location" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Enter location or area" required/><MapPin size={17}/></div>
              <label htmlFor="cr-photo">Upload Photo (Optional)</label>
              <label className="cr-upload" htmlFor="cr-photo"><ImagePlus size={26}/><span><b>{photo ? photo.name : "Click to upload or drag and drop"}</b><small>Supports JPG, PNG, WEBP (Max 5MB)</small></span></label>
              <input className="cr-file-input" id="cr-photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f&&f.size>5*1024*1024){setMessage("Please choose an image smaller than 5 MB.");setPhoto(null);}else{setPhoto(f||null);setMessage("");}}}/>
              {photo&&<button type="button" className="cr-remove-photo" onClick={()=>setPhoto(null)}><X size={13}/>Remove photo</button>}
              <label htmlFor="cr-description">Description (Optional)</label>
              <textarea id="cr-description" rows="3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add additional details..."/>
              {message&&<p className={message.includes("successfully")?"cr-message-success":"cr-message"}>{message}</p>}
              <button className="cr-btn cr-btn-green cr-submit" type="submit"><Send size={16}/>Submit Report</button>
            </form>
          </article>

          <article className="cr-panel cr-analytics">
            <h3>Report Analytics</h3>
            <div className="cr-donut-area"><div className="cr-donut"><div><strong>{counts.total+38}</strong><span>Reports</span></div></div>
              <div className="cr-donut-legend"><span><i className="cr-dot cr-dot-red"/>Pending <b>43%</b></span><span><i className="cr-dot cr-dot-yellow"/>In Progress <b>9%</b></span><span><i className="cr-dot cr-dot-green"/>Resolved <b>48%</b></span></div></div>
            <h4>Report Types</h4>
            {[["Overflowing Bin",45,"red"],["Uncollected Waste",30,"green"],["Damaged Bin",15,"yellow"],["Other Issues",10,"blue"]].map(([name,pct,color])=><div className="cr-type-row" key={name}><span className={"cr-type-icon "+color}>{color==="red"?"!":color==="green"?"↻":color==="yellow"?"!":"•"}</span><span className="cr-type-name">{name}</span><i><b className={"cr-type-bar "+color} style={{width:pct+"%"}}/></i><small>{pct}%</small></div>)}
          </article>
        </aside>
      </section>

      {selectedReport&&<div className="cr-modal-backdrop" onClick={()=>setSelectedReport(null)}><article className="cr-modal" onClick={e=>e.stopPropagation()}><button className="cr-modal-close" onClick={()=>setSelectedReport(null)}><X size={18}/></button><h3>Report #{selectedReport.id}</h3><StatusBadge status={selectedReport.status}/><p><b>Type:</b> {selectedReport.type}</p><p><b>Location:</b> {selectedReport.location}</p><p><b>Description:</b> {selectedReport.description}</p><p><b>Submitted:</b> {selectedReport.date} at {selectedReport.time}</p><button className="cr-btn cr-btn-green" onClick={()=>setSelectedReport(null)}>Close</button></article></div>}

      <footer className="cr-footer"><span><i/> Demo mode</span><span>SmartBin Citizen Reports · Local sample data</span></footer>
    </div>
  );
}
