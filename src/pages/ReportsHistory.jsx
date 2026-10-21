import { useMemo, useState } from "react";
import {
  Recycle, LayoutDashboard, Map, Brain, Route, TrendingUp,
  FileText, History, Bell, UserRound, Menu, Home, ChevronRight,
  Search, Download, CalendarDays, CheckCircle2, Clock3,
  AlertTriangle, Eye, X, Filter, ArrowUpRight, Trash2
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import "../styles/reports-history.css";

const initialHistory = [
  {id:325,category:"Garbage Overflow",location:"MG Road, Downtown",description:"Waste bin is overflowing near the bus stop.",status:"Open",reporter:"Rahul Sharma",date:"2026-10-09",time:"10:24 AM",priority:"High"},
  {id:324,category:"Damaged Bin",location:"Indiranagar",description:"Bin lid is broken and needs repair.",status:"In Progress",reporter:"Priya Nair",date:"2026-10-09",time:"09:18 AM",priority:"Medium"},
  {id:323,category:"Recycling Issue",location:"HSR Layout",description:"Recyclable waste was not collected.",status:"Resolved",reporter:"Arjun Reddy",date:"2026-10-09",time:"08:45 AM",priority:"Low"},
  {id:322,category:"Bin Not Collected",location:"Koramangala",description:"Scheduled collection was missed.",status:"Open",reporter:"Sneha Verma",date:"2026-10-09",time:"07:30 AM",priority:"High"},
  {id:321,category:"Other Issue",location:"Whitefield",description:"Unpleasant smell around the bin.",status:"Resolved",reporter:"Vikram Singh",date:"2026-10-08",time:"06:12 PM",priority:"Low"},
  {id:320,category:"Garbage Overflow",location:"BTM Layout",description:"Overflowing bin near the main road.",status:"Open",reporter:"Ananya Rao",date:"2026-10-08",time:"04:35 PM",priority:"High"},
  {id:319,category:"Damaged Bin",location:"JP Nagar",description:"Collection bin has a damaged wheel.",status:"In Progress",reporter:"Kiran Kumar",date:"2026-10-08",time:"03:12 PM",priority:"Medium"},
  {id:318,category:"Bin Not Collected",location:"Electronic City",description:"Waste was not collected on the scheduled day.",status:"Resolved",reporter:"Meera Joshi",date:"2026-10-07",time:"01:40 PM",priority:"Medium"},
  {id:317,category:"Garbage Overflow",location:"Riverside",description:"Public bin has reached its capacity.",status:"Resolved",reporter:"Aditya Rao",date:"2026-10-07",time:"11:20 AM",priority:"High"},
  {id:316,category:"Recycling Issue",location:"Tech Park",description:"Recycling container needs attention.",status:"Resolved",reporter:"Divya S",date:"2026-10-06",time:"09:15 AM",priority:"Low"},
  {id:315,category:"Damaged Bin",location:"Central Park",description:"Bin cover has been damaged.",status:"In Progress",reporter:"Nikhil P",date:"2026-10-05",time:"04:50 PM",priority:"Medium"},
  {id:314,category:"Other Issue",location:"Lakeside",description:"Waste was left beside the collection point.",status:"Resolved",reporter:"Sana Khan",date:"2026-10-04",time:"02:10 PM",priority:"Low"},
];

const weeklyData = [
  {day:"Mon",reports:18,resolved:14},
  {day:"Tue",reports:24,resolved:20},
  {day:"Wed",reports:16,resolved:13},
  {day:"Thu",reports:31,resolved:26},
  {day:"Fri",reports:27,resolved:22},
  {day:"Sat",reports:22,resolved:18},
  {day:"Sun",reports:14,resolved:12},
];

const categoryData = [
  {name:"Garbage Overflow",value:42,color:"#ff4949"},
  {name:"Damaged Bin",value:24,color:"#ffb627"},
  {name:"Bin Not Collected",value:18,color:"#20ad67"},
  {name:"Recycling Issue",value:10,color:"#438bff"},
  {name:"Other Issue",value:6,color:"#9165ed"},
];

const navItems = [
  ["Dashboard",LayoutDashboard],
  ["City Simulator",Map],
  ["AI Waste Classifier",Brain],
  ["Route Optimizer",Route],
  ["Overflow Prediction",TrendingUp],
  ["Citizen Reports",FileText],
  ["Reports History",History],
];

function Sidebar({onNavigate}) {
  return (
    <aside className="rh-sidebar">
      <div className="rh-brand"><span><Recycle size={24}/></span><div><strong>SmartBin</strong><small>Smart Waste Management</small></div></div>
      <div className="rh-menu-label">MAIN MENU</div>
      <nav className="rh-nav">
        {navItems.map(([label,Icon])=><button key={label} className={`rh-nav-item ${label==="Reports History"?"active":""}`} onClick={()=>onNavigate(label)}><Icon size={19}/><span>{label}</span></button>)}
      </nav>
      <div className="rh-sidebar-note"><i/><div><strong>Waste Management</strong><p>Review reports, track resolutions, and keep the city clean.</p></div></div>
      <button className="rh-collapse" aria-label="Collapse sidebar">⌄</button>
    </aside>
  );
}

function Metric({icon:Icon,value,label,kind,sub}) {
  return <article className="rh-metric"><span className={`rh-metric-icon ${kind}`}><Icon size={21}/></span><div><strong>{value}</strong><span>{label}</span><small>{sub}</small></div></article>;
}

function StatusBadge({status}) {
  const type=status==="Resolved"?"resolved":status==="In Progress"?"progress":"open";
  return <span className={`rh-status ${type}`}>{status}</span>;
}

function formatDate(value) {
  if(!value)return "—";
  return new Date(value+"T12:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}

export default function ReportsHistory() {
  const [reports,setReports]=useState(initialHistory);
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("All Status");
  const [category,setCategory]=useState("All Categories");
  const [period,setPeriod]=useState("All Time");
  const [sort,setSort]=useState("Newest First");
  const [selected,setSelected]=useState(null);
  const [notice,setNotice]=useState("");

  const filtered=useMemo(()=>{
    let result=reports.filter(r=>{
      const term=search.trim().toLowerCase();
      const matchesSearch=!term||[r.id,r.category,r.location,r.description,r.reporter].some(v=>String(v).toLowerCase().includes(term));
      const matchesStatus=status==="All Status"||r.status===status;
      const matchesCategory=category==="All Categories"||r.category===category;
      const d=new Date(r.date+"T12:00:00");
      const today=new Date("2026-10-09T12:00:00");
      const days=(today-d)/86400000;
      const matchesPeriod=period==="All Time"||(period==="Today"&&days===0)||(period==="Last 7 Days"&&days>=0&&days<7)||(period==="Last 30 Days"&&days>=0&&days<30);
      return matchesSearch&&matchesStatus&&matchesCategory&&matchesPeriod;
    });
    result.sort((a,b)=>sort==="Newest First"?b.date.localeCompare(a.date)||b.id-a.id:a.date.localeCompare(b.date)||a.id-b.id);
    return result;
  },[reports,search,status,category,period,sort]);

  const resolved=reports.filter(r=>r.status==="Resolved").length;
  const inProgress=reports.filter(r=>r.status==="In Progress").length;
  const open=reports.filter(r=>r.status==="Open").length;
  const resolutionRate=reports.length?Math.round(resolved/reports.length*100):0;

  function navigate(label) {
    if(label==="Reports History")return;
    window.dispatchEvent(new CustomEvent("smartbin-nav",{detail:label}));
    setNotice(`${label} selected. Connect it to your existing route in App.jsx.`);
  }

  function exportCsv() {
    const headers=["Report ID","Category","Location","Description","Status","Reporter","Date","Time","Priority"];
    const rows=filtered.map(r=>[r.id,r.category,r.location,r.description,r.status,r.reporter,r.date,r.time,r.priority]);
    const csv=[headers,...rows].map(row=>row.map(value=>`"${String(value??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));
    const a=document.createElement("a");
    a.href=url;
    a.download="smartbin-reports-history.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} reports to CSV.`);
  }

  function updateStatus(report) {
    const next=report.status==="Open"?"In Progress":report.status==="In Progress"?"Resolved":"Open";
    setReports(old=>old.map(r=>r.id===report.id?{...r,status:next}:r));
    setSelected({...report,status:next});
    setNotice(`Report #${report.id} changed to ${next}.`);
  }

  return (
    <div className="rh-app">
      <Sidebar onNavigate={navigate}/>
      <main className="rh-main">
        <header className="rh-topbar">
          <button className="rh-menu-button" aria-label="Menu"><Menu size={20}/></button>
          <div className="rh-topbar-spacer"/>
          <button className="rh-bell" aria-label="Notifications" onClick={()=>setNotice(`${open} reports are still open.`)}><Bell size={18}/><i/></button>
          <span className="rh-avatar"><UserRound size={20}/></span>
          <div className="rh-admin"><strong>SmartBin Admin</strong><span>Administrator⌄</span></div>
        </header>

        <div className="rh-breadcrumb"><Home size={13}/><span>Home</span><b>›</b><strong>Reports History</strong></div>

        <section className="rh-heading">
          <div className="rh-heading-icon"><History size={32}/></div>
          <div className="rh-heading-copy"><h1>Reports History</h1><p>Track past citizen reports, review resolution progress, and analyze waste management activity.</p></div>
          <button className="rh-export-button" onClick={exportCsv}><Download size={17}/>Export CSV</button>
        </section>

        {notice&&<div className="rh-notice">{notice}<button onClick={()=>setNotice("")}><X size={14}/></button></div>}

        <section className="rh-metrics">
          <Metric icon={FileText} value={reports.length} label="Total Reports" kind="blue" sub="All recorded reports"/>
          <Metric icon={CheckCircle2} value={resolved} label="Resolved Reports" kind="green" sub={`${resolutionRate}% resolution rate`}/>
          <Metric icon={Clock3} value={inProgress} label="In Progress" kind="amber" sub="Being handled by the team"/>
          <Metric icon={AlertTriangle} value={open} label="Open Reports" kind="red" sub="Awaiting action"/>
        </section>

        <section className="rh-analytics-grid">
          <article className="rh-card rh-chart-card">
            <div className="rh-card-heading"><div><h2>Reports Activity</h2><p>Submitted vs. resolved reports</p></div><span className="rh-period-chip">Weekly overview</span></div>
            <div className="rh-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{top:8,right:8,left:-20,bottom:0}} barGap={4}>
                  <CartesianGrid stroke="#e9eff5" strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="day" tick={{fontSize:10,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <YAxis allowDecimals={false} tick={{fontSize:9,fill:"#71829a"}} axisLine={false} tickLine={false}/>
                  <Tooltip/>
                  <Bar dataKey="reports" name="Submitted" fill="#0ba65a" radius={[4,4,0,0]} maxBarSize={22}/>
                  <Bar dataKey="resolved" name="Resolved" fill="#a7e4bd" radius={[4,4,0,0]} maxBarSize={22}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rh-chart-legend"><span><i className="submitted"/>Submitted</span><span><i className="resolved"/>Resolved</span></div>
          </article>

          <article className="rh-card rh-category-card">
            <div className="rh-card-heading"><div><h2>Reports by Category</h2><p>Breakdown by issue type</p></div></div>
            <div className="rh-category-content">
              <div className="rh-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoryData} dataKey="value" innerRadius="60%" outerRadius="88%" paddingAngle={2} stroke="none">{categoryData.map(d=><Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/></PieChart>
                </ResponsiveContainer>
                <div className="rh-donut-center"><strong>{reports.length}</strong><span>Reports</span></div>
              </div>
              <div className="rh-category-legend">{categoryData.map(d=><div key={d.name}><span><i style={{background:d.color}}/>{d.name}</span><b>{d.value}%</b></div>)}</div>
            </div>
          </article>

          <article className="rh-card rh-resolution-card">
            <div className="rh-card-heading"><div><h2>Resolution Overview</h2><p>Current report status</p></div></div>
            <div className="rh-resolution-rate"><strong>{resolutionRate}%</strong><span>resolved</span></div>
            <div className="rh-progress-track"><span style={{width:`${resolutionRate}%`}}/></div>
            <div className="rh-resolution-row"><span><i className="resolved"/>Resolved</span><b>{resolved}</b></div>
            <div className="rh-resolution-row"><span><i className="progress"/>In Progress</span><b>{inProgress}</b></div>
            <div className="rh-resolution-row"><span><i className="open"/>Open</span><b>{open}</b></div>
            <p className="rh-demo-note">Based on reports in this demo.</p>
          </article>
        </section>

        <section className="rh-card rh-table-card">
          <div className="rh-table-heading">
            <div><h2>Report Records</h2><p>Review, search, and manage previously submitted reports.</p></div>
            <button className="rh-export-small" onClick={exportCsv}><Download size={15}/>Export</button>
          </div>
          <div className="rh-toolbar">
            <label className="rh-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ID, location, category, reporter..."/></label>
            <div className="rh-filter-control"><Filter size={15}/><select aria-label="Status filter" value={status} onChange={e=>setStatus(e.target.value)}><option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option></select></div>
            <select className="rh-select" aria-label="Category filter" value={category} onChange={e=>setCategory(e.target.value)}><option>All Categories</option>{categoryData.map(d=><option key={d.name}>{d.name}</option>)}</select>
            <select className="rh-select" aria-label="Date filter" value={period} onChange={e=>setPeriod(e.target.value)}><option>All Time</option><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option></select>
            <select className="rh-select rh-sort" aria-label="Sort order" value={sort} onChange={e=>setSort(e.target.value)}><option>Newest First</option><option>Oldest First</option></select>
          </div>

          <div className="rh-table-scroll">
            <table className="rh-table">
              <thead><tr><th>REPORT ID</th><th>CATEGORY</th><th>LOCATION</th><th>REPORTED BY</th><th>DATE &amp; TIME</th><th>PRIORITY</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody>
                {filtered.map(report=><tr key={report.id}>
                  <td><strong className="rh-report-id">#{report.id}</strong></td>
                  <td><span className="rh-category-cell">{report.category==="Garbage Overflow"?<Trash2 size={15}/>:report.category==="Damaged Bin"?<AlertTriangle size={15}/>:report.category==="Recycling Issue"?<Recycle size={15}/>:<FileText size={15}/>}<span>{report.category}</span></span></td>
                  <td>{report.location}</td>
                  <td>{report.reporter}</td>
                  <td><span className="rh-date-cell">{formatDate(report.date)}<small>{report.time}</small></span></td>
                  <td><span className={`rh-priority ${report.priority.toLowerCase()}`}>{report.priority}</span></td>
                  <td><StatusBadge status={report.status}/></td>
                  <td><button className="rh-view-button" onClick={()=>setSelected(report)}><Eye size={14}/>View</button></td>
                </tr>)}
                {filtered.length===0&&<tr><td colSpan="8" className="rh-empty">No reports found. Try changing your search or filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="rh-table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{reports.length}</strong> reports</span><button onClick={()=>{setSearch("");setStatus("All Status");setCategory("All Categories");setPeriod("All Time");setSort("Newest First");}}>Clear filters</button></div>
        </section>
        <footer className="rh-footer"><span><i/>Reports history ready</span><span>SmartBin AI · Reports History · Demo data</span></footer>
      </main>

      {selected&&<div className="rh-modal-backdrop" onClick={()=>setSelected(null)}><section className="rh-modal" onClick={e=>e.stopPropagation()}>
        <div className="rh-modal-heading"><div><p>REPORT DETAILS · #{selected.id}</p><h2>{selected.category}</h2></div><button onClick={()=>setSelected(null)} aria-label="Close"><X size={18}/></button></div>
        <div className="rh-modal-status"><StatusBadge status={selected.status}/><span className={`rh-priority ${selected.priority.toLowerCase()}`}>{selected.priority} priority</span></div>
        <div className="rh-detail-row"><Map size={17}/><div><small>Location</small><strong>{selected.location}</strong></div></div>
        <div className="rh-detail-row"><UserRound size={17}/><div><small>Reported by</small><strong>{selected.reporter}</strong></div></div>
        <div className="rh-detail-row"><CalendarDays size={17}/><div><small>Reported on</small><strong>{formatDate(selected.date)} · {selected.time}</strong></div></div>
        <div className="rh-description"><small>Description</small><p>{selected.description}</p></div>
        <button className="rh-update-button" onClick={()=>updateStatus(selected)}>{selected.status==="Open"?"Mark In Progress":selected.status==="In Progress"?"Mark Resolved":"Reopen Report"}<ArrowUpRight size={16}/></button>
      </section></div>}
    </div>
  );
}
