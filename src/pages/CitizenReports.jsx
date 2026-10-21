import { useMemo, useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp,
  FileText, History, Bell, UserRound, Menu, Home, ChevronRight,
  Trash2, CheckCircle2, Clock3, AlertTriangle, Search, Plus,
  MoreVertical, X, MapPin, Eye, Filter
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/citizen-reports.css";

const initialReports = [
  {id:325,category:"Garbage Overflow",location:"MG Road, Downtown",description:"Bin is completely full and waste is overflowing.",status:"Open",reporter:"Rahul Sharma",date:"Oct 9, 2026",time:"10:24 AM",pos:[12.9716,77.5946],color:"#ff4545",icon:"!"},
  {id:324,category:"Damaged Bin",location:"Indiranagar",description:"Bin lid is broken and needs repair.",status:"In Progress",reporter:"Priya Nair",date:"Oct 9, 2026",time:"09:18 AM",pos:[12.978,77.64],color:"#ffad12",icon:"▣"},
  {id:323,category:"Recycling Issue",location:"HSR Layout",description:"Recyclable waste is not being collected.",status:"Resolved",reporter:"Arjun Reddy",date:"Oct 9, 2026",time:"08:45 AM",pos:[12.9116,77.6389],color:"#079b53",icon:"♻"},
  {id:322,category:"Bin Not Collected",location:"Koramangala",description:"Scheduled collection was missed.",status:"Open",reporter:"Sneha Verma",date:"Oct 9, 2026",time:"07:30 AM",pos:[12.9352,77.6245],color:"#ff4545",icon:"!"},
  {id:321,category:"Other Issue",location:"Whitefield",description:"Unpleasant smell around the bin.",status:"Resolved",reporter:"Vikram Singh",date:"Oct 8, 2026",time:"06:12 PM",pos:[12.9698,77.75],color:"#8b65ee",icon:"•••"},
  {id:320,category:"Garbage Overflow",location:"BTM Layout",description:"Overflowing bin near the bus stop.",status:"Open",reporter:"Ananya Rao",date:"Oct 8, 2026",time:"04:35 PM",pos:[12.9166,77.6101],color:"#ff4545",icon:"!"},
  {id:319,category:"Damaged Bin",location:"JP Nagar",description:"The collection bin is damaged.",status:"In Progress",reporter:"Kiran Kumar",date:"Oct 8, 2026",time:"03:12 PM",pos:[12.9077,77.585],color:"#ffad12",icon:"▣"},
];

const categoryData = [
  {name:"Garbage Overflow",value:42,color:"#ff4949"},
  {name:"Damaged Bin",value:24,color:"#ffb627"},
  {name:"Bin Not Collected",value:18,color:"#2db778"},
  {name:"Other Issues",value:10,color:"#3c8dff"},
  {name:"Recycling Issue",value:6,color:"#8c5cf6"},
];

const activities = [
  {type:"resolved",title:"Report #321 resolved by team",time:"10 minutes ago"},
  {type:"open",title:"New report submitted (Overflow)",time:"42 minutes ago"},
  {type:"progress",title:"Report #318 in progress",time:"1 hour ago"},
  {type:"open",title:"New report submitted (Damaged Bin)",time:"2 hours ago"},
  {type:"resolved",title:"Report #310 resolved",time:"3 hours ago"},
];

function makeMarker(report, selected) {
  return L.divIcon({
    className:"cr-map-marker",
    html:`<div style="background:${report.color};${selected ? "outline:3px solid #b9d8ff;outline-offset:2px;" : ""}">${report.icon}</div>`,
    iconSize:[27,27],
    iconAnchor:[13,13],
  });
}

function Sidebar({active,onNavigate}) {
  const items=[
    ["Dashboard",LayoutDashboard],["City Simulator",Map],
    ["AI Waste Classifier",Brain],["Route Optimizer",Route],
    ["Overflow Prediction",TrendingUp],["Citizen Reports",FileText],
    ["Reports History",History],
  ];
  return (
    <aside className="cr-sidebar">
      <div className="cr-brand"><span><Recycle size={25}/></span><div><strong>SmartBin</strong><small>Smart Waste Management</small></div></div>
      <div className="cr-menu-label">MAIN MENU</div>
      <nav className="cr-nav">
        {items.map(([label,Icon])=><button key={label} className={`cr-nav-item ${active===label?"active":""}`} onClick={()=>onNavigate(label)}><Icon size={19}/><span>{label}</span></button>)}
      </nav>
      <div className="cr-sidebar-note"><i/><div><strong>Waste Management</strong><p>Monitor bins, optimize collection routes, and manage reports.</p></div></div>
      <button className="cr-collapse" aria-label="Collapse sidebar">⌄</button>
    </aside>
  );
}

function Metric({icon:Icon,value,label,trend,kind}) {
  return <article className="cr-metric"><span className={`cr-metric-icon ${kind}`}><Icon size={21}/></span><div className="cr-metric-copy"><strong>{value}</strong><span>{label}</span></div><div className={`cr-trend ${kind==="red"?"negative":""}`}>{trend}<small>vs last week</small></div></article>;
}

function StatusBadge({status}) {
  const kind=status==="Resolved"?"resolved":status==="In Progress"?"progress":"open";
  return <span className={`cr-status ${kind}`}>{status}</span>;
}

export default function CitizenReports() {
  const [active,setActive]=useState("Citizen Reports");
  const [reports,setReports]=useState(initialReports);
  const [search,setSearch]=useState("");
  const [locationSearch,setLocationSearch]=useState("");
  const [category,setCategory]=useState("All Categories");
  const [status,setStatus]=useState("All Status");
  const [period,setPeriod]=useState("This Week");
  const [selectedId,setSelectedId]=useState(325);
  const [showForm,setShowForm]=useState(false);
  const [viewReport,setViewReport]=useState(null);
  const [notice,setNotice]=useState("");
  const [newReport,setNewReport]=useState({category:"Garbage Overflow",location:"",description:"",reporter:""});

  const filteredReports=useMemo(()=>reports.filter((report)=>{
    const term=search.toLowerCase();
    const matchesSearch=!term||[report.id,report.category,report.location,report.description,report.reporter].some((v)=>String(v).toLowerCase().includes(term));
    const matchesCategory=category==="All Categories"||report.category===category;
    const matchesStatus=status==="All Status"||report.status===status;
    return matchesSearch&&matchesCategory&&matchesStatus;
  }),[reports,search,category,status]);

  const mapReports=reports.filter((report)=>!locationSearch||report.location.toLowerCase().includes(locationSearch.toLowerCase()));
  const selected=reports.find((report)=>report.id===selectedId)||reports[0];
  const openCount=reports.filter((r)=>r.status==="Open").length;
  const progressCount=reports.filter((r)=>r.status==="In Progress").length;
  const resolvedCount=reports.filter((r)=>r.status==="Resolved").length;

  function navigate(label) {
    setActive(label);
    if(label!=="Citizen Reports") {
      window.dispatchEvent(new CustomEvent("smartbin-nav",{detail:label}));
      setNotice(`${label} selected. Connect this menu item to its page route when ready.`);
    } else setNotice("");
  }

  function submitReport(e) {
    e.preventDefault();
    const report={
      id:Math.max(0,...reports.map(r=>r.id))+1,
      category:newReport.category,
      location:newReport.location.trim(),
      description:newReport.description.trim(),
      status:"Open",
      reporter:newReport.reporter.trim()||"Current User",
      date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
      pos:[12.96+(Math.random()-.5)*.04,77.60+(Math.random()-.5)*.06],
      color:"#ff4545",icon:"!",
    };
    setReports(old=>[report,...old]);
    setSelectedId(report.id);
    setNewReport({category:"Garbage Overflow",location:"",description:"",reporter:""});
    setShowForm(false);
    setNotice(`Report #${report.id} added to the local demo.`);
  }

  function updateStatus(report) {
    const next=report.status==="Open"?"In Progress":report.status==="In Progress"?"Resolved":"Open";
    setReports(old=>old.map(r=>r.id===report.id?{...r,status:next}:r));
    setViewReport({...report,status:next});
    setNotice(`Report #${report.id} status changed to ${next}.`);
  }

  return (
    <div className="cr-app">
      <Sidebar active={active} onNavigate={navigate}/>
      <main className="cr-main">
        <header className="cr-topbar">
          <button className="cr-menu-button" aria-label="Menu"><Menu size={20}/></button>
          <div className="cr-topbar-spacer"/>
          <button className="cr-bell" aria-label="Notifications" onClick={()=>setNotice(`${openCount} reports are currently open.`)}><Bell size={18}/><i/></button>
          <span className="cr-avatar"><UserRound size={20}/></span>
          <div className="cr-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="cr-breadcrumb"><Home size={13}/><span>Home</span><b>›</b><strong>Citizen Reports</strong></div>

        <section className="cr-heading">
          <div className="cr-heading-icon"><FileText size={32}/></div>
          <div className="cr-heading-copy"><h1>Citizen Reports</h1><p>View and manage reports submitted by citizens. Take quick action to keep the city clean.</p></div>
          <button className="cr-new-report" onClick={()=>setShowForm(true)}><Plus size={19}/>New Report</button>
        </section>

        {notice&&<div className="cr-notice">{notice}<button onClick={()=>setNotice("")}><X size={14}/></button></div>}

        <section className="cr-metrics">
          <Metric icon={FileText} value={reports.length+117} label="Total Reports" trend="↑ +18%" kind="blue"/>
          <Metric icon={CheckCircle2} value={resolvedCount+74} label="Resolved" trend="↑ +25%" kind="green"/>
          <Metric icon={Clock3} value={progressCount+26} label="In Progress" trend="↓ -8%" kind="amber"/>
          <Metric icon={AlertTriangle} value={openCount+18} label="Open" trend="↓ -10%" kind="red"/>
        </section>

        <section className="cr-middle-grid">
          <article className="cr-card cr-map-card">
            <h2>Reports Map</h2>
            <p className="cr-subtitle">Locations of citizen reports across the city</p>
            <div className="cr-map-wrap">
              <MapContainer center={[12.96,77.605]} zoom={12} zoomControl={false} scrollWheelZoom>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {mapReports.map(report=><Marker key={report.id} position={report.pos} icon={makeMarker(report,report.id===selectedId)} eventHandlers={{click:()=>setSelectedId(report.id)}}><Popup><strong>#{report.id} · {report.category}</strong><br/>{report.location}<br/>Status: {report.status}</Popup></Marker>)}
                <ZoomControl position="bottomleft"/>
              </MapContainer>
              <div className="cr-map-search"><Search size={15}/><input value={locationSearch} onChange={e=>setLocationSearch(e.target.value)} placeholder="Search location..."/></div>
              <div className="cr-map-legend"><span><i className="open"/>Open</span><span><i className="progress"/>In Progress</span><span><i className="resolved"/>Resolved</span></div>
              <div className="cr-map-selected">
                <span className="cr-selected-symbol"><AlertTriangle size={17}/></span>
                <div><strong>{selected.category}</strong><small>{selected.location}</small><p>{selected.time} <StatusBadge status={selected.status}/></p></div>
                <button aria-label="View selected report" onClick={()=>setViewReport(selected)}><ChevronRight size={16}/></button>
              </div>
            </div>
          </article>

          <div className="cr-side-panels">
            <article className="cr-card cr-category-card">
              <div className="cr-card-heading"><h2>Report Categories</h2><select aria-label="Report category period" value={period} onChange={e=>setPeriod(e.target.value)}><option>This Week</option><option>Today</option><option>This Month</option></select></div>
              <div className="cr-category-content">
                <div className="cr-donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={categoryData} dataKey="value" innerRadius="59%" outerRadius="88%" paddingAngle={2} stroke="none">{categoryData.map(d=><Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/></PieChart>
                  </ResponsiveContainer>
                  <div className="cr-donut-center"><strong>{reports.length+117}</strong><span>Reports</span></div>
                </div>
                <div className="cr-category-legend">{categoryData.map(d=><div key={d.name}><span><i style={{background:d.color}}/>{d.name}</span><b>{d.value}%</b></div>)}</div>
              </div>
            </article>

            <article className="cr-card cr-activity-card">
              <div className="cr-card-heading"><h2>Recent Activity</h2><button onClick={()=>setNotice("Recent activity is showing the latest sample report events.")}>View All <ChevronRight size={13}/></button></div>
              <div className="cr-activity-list">{activities.map((item,i)=><div className="cr-activity-row" key={i}><span className={`cr-activity-icon ${item.type}`}>{item.type==="resolved"?<CheckCircle2 size={16}/>:item.type==="progress"?<Clock3 size={16}/>:<AlertTriangle size={16}/>}</span><span>{item.title}</span><time>{item.time}</time></div>)}</div>
            </article>
          </div>
        </section>

        <section className="cr-card cr-table-card">
          <div className="cr-table-heading">
            <h2>Citizen Reports List</h2>
            <label className="cr-table-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reports..."/></label>
            <div className="cr-table-filters">
              <select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Filter by category"><option>All Categories</option>{categoryData.map(d=><option key={d.name}>{d.name}</option>)}</select>
              <select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filter by status"><option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option></select>
              <select value={period} onChange={e=>setPeriod(e.target.value)} aria-label="Filter by date"><option>This Week</option><option>Today</option><option>This Month</option></select>
            </div>
          </div>
          <div className="cr-table-scroll">
            <table className="cr-table">
              <thead><tr><th>ID</th><th>Category</th><th>Location</th><th>Description</th><th>Image</th><th>Status</th><th>Reported By</th><th>Date &amp; Time</th><th>Action</th></tr></thead>
              <tbody>
                {filteredReports.map(report=><tr key={report.id}>
                  <td><strong>#{report.id}</strong></td>
                  <td><span className={`cr-category-symbol ${report.category==="Garbage Overflow"?"overflow":report.category==="Damaged Bin"?"damaged":report.category==="Recycling Issue"?"recycling":"other"}`}>{report.icon}</span><span className="cr-category-name">{report.category}</span></td>
                  <td>{report.location}</td>
                  <td className="cr-description-cell" title={report.description}>{report.description}</td>
                  <td><span className={`cr-report-thumb ${report.category==="Garbage Overflow"?"thumb-red":report.category==="Damaged Bin"?"thumb-yellow":"thumb-green"}`}><Trash2 size={17}/></span></td>
                  <td><StatusBadge status={report.status}/></td>
                  <td>{report.reporter}</td>
                  <td><span className="cr-date-cell">{report.date}<small>{report.time}</small></span></td>
                  <td><div className="cr-actions"><button className="cr-view-button" onClick={()=>setViewReport(report)}>View</button><button className="cr-more-button" aria-label={`More actions for report ${report.id}`} onClick={()=>setViewReport(report)}><MoreVertical size={16}/></button></div></td>
                </tr>)}
                {filteredReports.length===0&&<tr><td colSpan="9" className="cr-empty">No reports match your search or filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="cr-table-footer">Showing {filteredReports.length} of {reports.length} reports <button onClick={()=>{setSearch("");setCategory("All Categories");setStatus("All Status");}}>Clear filters</button></div>
        </section>
        <footer className="cr-footer"><span><i/>Citizen Reports ready</span><span>SmartBin AI · Demo data</span></footer>
      </main>

      {showForm&&<div className="cr-modal-backdrop" onClick={()=>setShowForm(false)}><section className="cr-modal" onClick={e=>e.stopPropagation()}><div className="cr-modal-heading"><div><h2>Submit a Citizen Report</h2><p>Enter the issue details below.</p></div><button onClick={()=>setShowForm(false)} aria-label="Close"><X size={18}/></button></div>
        <form onSubmit={submitReport} className="cr-report-form">
          <label>Issue category<select value={newReport.category} onChange={e=>setNewReport({...newReport,category:e.target.value})}><option>Garbage Overflow</option><option>Damaged Bin</option><option>Recycling Issue</option><option>Bin Not Collected</option><option>Other Issue</option></select></label>
          <label>Location<input required value={newReport.location} onChange={e=>setNewReport({...newReport,location:e.target.value})} placeholder="e.g. MG Road, Downtown"/></label>
          <label>Description<textarea required rows="3" value={newReport.description} onChange={e=>setNewReport({...newReport,description:e.target.value})} placeholder="Describe the waste management issue"/></label>
          <label>Your name<input value={newReport.reporter} onChange={e=>setNewReport({...newReport,reporter:e.target.value})} placeholder="Enter your name (optional)"/></label>
          <button type="submit" className="cr-new-report cr-submit-report"><Plus size={16}/>Submit Report</button>
        </form>
      </section></div>}

      {viewReport&&<div className="cr-modal-backdrop" onClick={()=>setViewReport(null)}><section className="cr-modal cr-details-modal" onClick={e=>e.stopPropagation()}><div className="cr-modal-heading"><div><p className="cr-modal-eyebrow">CITIZEN REPORT · #{viewReport.id}</p><h2>{viewReport.category}</h2></div><button onClick={()=>setViewReport(null)} aria-label="Close"><X size={18}/></button></div>
        <div className="cr-detail-status"><StatusBadge status={viewReport.status}/><span>{viewReport.date} · {viewReport.time}</span></div>
        <div className="cr-detail-row"><MapPin size={16}/><div><small>Location</small><strong>{viewReport.location}</strong></div></div>
        <div className="cr-detail-row"><UserRound size={16}/><div><small>Reported by</small><strong>{viewReport.reporter}</strong></div></div>
        <div className="cr-detail-description"><small>Description</small><p>{viewReport.description}</p></div>
        <button className="cr-new-report cr-update-status" onClick={()=>updateStatus(viewReport)}>Update status</button>
      </section></div>}
    </div>
  );
}
