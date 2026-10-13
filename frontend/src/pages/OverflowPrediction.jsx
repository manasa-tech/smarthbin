import { useMemo, useState } from "react";
import {
  CalendarDays, ChevronDown, ChevronRight, Home, Trash2,
  Clock3, CheckCircle2, TrendingUp, Database, Gauge,
  CloudRain, Users, Plus, Minus, LocateFixed, MapPin,
  AlertTriangle, Activity, Search
} from "lucide-react";
import "./overflow-prediction.css";

const initialBins = [
  { id: "SB-042", area: "Central District", fill: 92, hours: 6, x: 32, y: 20 },
  { id: "SB-017", area: "Riverside Area", fill: 86, hours: 10, x: 40, y: 48 },
  { id: "SB-073", area: "Eastside", fill: 78, hours: 24, x: 68, y: 40 },
  { id: "SB-028", area: "West End", fill: 76, hours: 24, x: 26, y: 60 },
  { id: "SB-091", area: "Tech Park", fill: 65, hours: 48, x: 56, y: 72 },
  { id: "SB-106", area: "Downtown", fill: 35, hours: 72, x: 55, y: 32 },
  { id: "SB-119", area: "Riverside Area", fill: 48, hours: 72, x: 18, y: 43 },
  { id: "SB-125", area: "Eastside", fill: 56, hours: 48, x: 82, y: 22 },
  { id: "SB-134", area: "Central District", fill: 94, hours: 5, x: 62, y: 68 },
  { id: "SB-141", area: "West End", fill: 28, hours: 96, x: 12, y: 70 },
  { id: "SB-150", area: "Industrial Area", fill: 82, hours: 12, x: 85, y: 59 },
  { id: "SB-162", area: "Tech Park", fill: 42, hours: 72, x: 47, y: 85 },
  { id: "SB-175", area: "Downtown", fill: 89, hours: 8, x: 48, y: 56 },
  { id: "SB-181", area: "Lakeside", fill: 22, hours: 120, x: 75, y: 83 },
  { id: "SB-195", area: "Central District", fill: 63, hours: 48, x: 23, y: 29 },
  { id: "SB-202", area: "Industrial Area", fill: 96, hours: 4, x: 91, y: 74 },
];

function riskLevel(fill) {
  if (fill >= 80) return "high";
  if (fill >= 60) return "medium";
  return "low";
}

function timeLabel(hours) {
  if (hours < 12) return `~ ${hours} hours`;
  if (hours < 24) return "~ 12–24 hours";
  if (hours < 48) return "~ 1 day";
  return "~ 2 days";
}

export default function OverflowPrediction() {
  const [bins, setBins] = useState(initialBins);
  const [selectedId, setSelectedId] = useState("SB-042");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("7 days");
  const [zoom, setZoom] = useState(1);

  const stats = useMemo(() => ({
    high: bins.filter((b) => b.fill >= 80).length,
    medium: bins.filter((b) => b.fill >= 60 && b.fill < 80).length,
    normal: bins.filter((b) => b.fill < 60).length,
  }), [bins]);

  const selected = bins.find((b) => b.id === selectedId) || bins[0];
  const filtered = bins
    .filter((b) => `${b.id} ${b.area}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.fill - a.fill);

  function refreshPredictions() {
    setBins((old) => old.map((b) => {
      const next = Math.max(10, Math.min(100, b.fill + Math.round(Math.random() * 8 - 1)));
      return { ...b, fill: next, hours: Math.max(3, Math.round((100 - next) / 2)) };
    }));
  }

  return (
    <div className="ov-page">
      <div className="ov-topbar">
        <div className="ov-breadcrumb"><Home size={14}/><ChevronRight size={14}/> <strong>Overflow Prediction</strong></div>
        <div className="ov-admin"><span className="ov-avatar">SA</span><div><b>SmartBin Admin</b><small>Administrator <ChevronDown size={12}/></small></div></div>
      </div>

      <header className="ov-heading">
        <div className="ov-title-icon"><TrendingUp size={29}/></div>
        <div className="ov-heading-copy">
          <h1>Overflow Prediction</h1>
          <p>Predict bin overflow levels using historical data. Take action before bins overflow.</p>
        </div>
        <label className="ov-period"><CalendarDays size={16}/>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>24 hours</option><option>7 days</option><option>30 days</option>
          </select><ChevronDown size={14}/>
        </label>
      </header>

      <section className="ov-stats">
        <article className="ov-stat"><div className="ov-stat-icon ov-red"><Trash2/></div><div><strong>{stats.high + 8}</strong><span>Bins at Risk</span><small>≥ 80% predicted fill</small></div></article>
        <article className="ov-stat"><div className="ov-stat-icon ov-yellow"><Clock3/></div><div><strong>{stats.medium + 23}</strong><span>Bins Near Full</span><small>60% – 80% predicted fill</small></div></article>
        <article className="ov-stat"><div className="ov-stat-icon ov-green"><CheckCircle2/></div><div><strong>{stats.normal + 140}</strong><span>Bins Normal</span><small>Below 60% predicted fill</small></div></article>
        <article className="ov-stat"><div className="ov-stat-icon ov-blue"><TrendingUp/></div><div><strong>87.4%</strong><span>Prediction Accuracy</span><small>Illustrative demo metric</small></div></article>
      </section>

      <section className="ov-main-grid">
        <article className="ov-card ov-map-card">
          <div className="ov-card-title"><div><h2>Bin Overflow Risk Map</h2><p>Predicted bin fill levels across the city.</p></div><button className="ov-refresh" onClick={refreshPredictions}><Activity size={14}/> Refresh demo</button></div>
          <div className="ov-map">
            <div className="ov-map-art" style={{transform:`scale(${zoom})`}}>
              <div className="ov-green-space ov-park-a"/><div className="ov-green-space ov-park-b"/><div className="ov-green-space ov-park-c"/>
              <div className="ov-water"/>
              {Array.from({length:11},(_,i)=><div key={`h${i}`} className="ov-street ov-street-h" style={{top:`${i*10}%`,transform:`rotate(${i%2?7:-5}deg)`}}/>)}
              {Array.from({length:10},(_,i)=><div key={`v${i}`} className="ov-street ov-street-v" style={{left:`${i*11}%`,transform:`rotate(${i%2?8:-8}deg)`}}/>)}
              <span className="ov-map-label ov-label-a">Central District</span>
              <span className="ov-map-label ov-label-b">Riverside Area</span>
              <span className="ov-map-label ov-label-c">Downtown</span>
              <span className="ov-map-label ov-label-d">Eastside</span>
              <span className="ov-map-label ov-label-e">West End</span>
              <span className="ov-map-label ov-label-f">Tech Park</span>
              <span className="ov-map-label ov-label-g">Industrial Area</span>
              {bins.map((bin) => <button key={bin.id} title={`${bin.id}: ${bin.fill}%`} onClick={() => setSelectedId(bin.id)} className={`ov-pin ${riskLevel(bin.fill)} ${selectedId===bin.id?"ov-pin-active":""}`} style={{left:`${bin.x}%`,top:`${bin.y}%`}}><Trash2 size={15}/></button>)}
            </div>
            <div className="ov-legend"><b>Risk level</b><span><i className="ov-dot high"/>High Risk (≥ 80%)</span><span><i className="ov-dot medium"/>Near Full (60–80%)</span><span><i className="ov-dot low"/>Normal (&lt; 60%)</span></div>
            <div className="ov-map-tooltip"><span className={`ov-tooltip-icon ${riskLevel(selected.fill)}`}><Trash2 size={20}/></span><div><b>Bin #{selected.id}</b><small>Predicted Fill Level</small><strong className={riskLevel(selected.fill)}>{selected.fill}%</strong><em>Overflow in: ~{selected.hours} hours</em><small><MapPin size={12}/> {selected.area}</small></div></div>
            <div className="ov-map-controls"><button onClick={()=>setZoom(z=>Math.min(1.35,z+.1))}><Plus size={17}/></button><button onClick={()=>setZoom(z=>Math.max(.85,z-.1))}><Minus size={17}/></button><button onClick={()=>setZoom(1)}><LocateFixed size={16}/></button></div>
            <span className="ov-map-caption">Illustrative map · Demo locations</span>
          </div>
        </article>

        <div className="ov-right-column">
          <article className="ov-card ov-predictions-card">
            <div className="ov-card-title"><h2>Overflow Predictions</h2><span className="ov-live-label">DEMO</span></div>
            <label className="ov-search"><Search size={15}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search bin or area"/></label>
            <div className="ov-prediction-list">
              {filtered.slice(0,6).map((bin)=><button className={`ov-prediction-row ${selectedId===bin.id?"ov-row-selected":""}`} key={bin.id} onClick={()=>setSelectedId(bin.id)}>
                <span className={`ov-row-icon ${riskLevel(bin.fill)}`}><Trash2 size={17}/></span>
                <span className="ov-row-name"><b>{bin.id}</b><small>{bin.area}</small></span>
                <span className={`ov-row-percent ${riskLevel(bin.fill)}`}>{bin.fill}%<i><b style={{width:`${bin.fill}%`}}/></i></span>
                <small className="ov-row-time">{timeLabel(bin.hours)}</small><ChevronRight size={15}/>
              </button>)}
              {filtered.length===0&&<p className="ov-no-results">No bins match your search.</p>}
            </div>
          </article>

          <article className="ov-card ov-factors-card">
            <div className="ov-card-title"><h2>Factors Used for Prediction</h2></div>
            <div className="ov-factors">
              <div><span className="ov-factor-icon"><Database/></span><p><b>Historical Fill Data</b><small>Past collection patterns</small></p></div>
              <div><span className="ov-factor-icon"><Gauge/></span><p><b>Current Fill Level</b><small>Latest available readings</small></p></div>
              <div><span className="ov-factor-icon"><CloudRain/></span><p><b>Weather Conditions</b><small>Potential waste variation</small></p></div>
              <div><span className="ov-factor-icon"><Users/></span><p><b>Area Activity</b><small>Population and events</small></p></div>
            </div>
          </article>
        </div>
      </section>

      <section className="ov-analytics">
        <article className="ov-card ov-distribution">
          <h2>Fill Level Distribution</h2>
          <div className="ov-donut-wrap"><div className="ov-donut"><div><strong>{bins.length+180}</strong><span>Bins Total</span></div></div><div className="ov-donut-legend"><span><i className="ov-dot high"/>High Risk <b>{Math.round((stats.high/bins.length)*100)}%</b></span><span><i className="ov-dot medium"/>Near Full <b>{Math.round((stats.medium/bins.length)*100)}%</b></span><span><i className="ov-dot low"/>Normal <b>{Math.round((stats.normal/bins.length)*100)}%</b></span></div></div>
        </article>
        <article className="ov-card ov-line-card">
          <h2>Predicted vs Actual Fill Levels</h2>
          <div className="ov-line-chart"><div className="ov-y-labels"><span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="ov-line-plot"><div className="ov-gridline"/><div className="ov-gridline"/><div className="ov-gridline"/><div className="ov-gridline"/><div className="ov-gridline"/><svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-label="Illustrative predicted and actual fill level chart"><path d="M0 110 L65 90 L130 73 L195 54 L260 52 L330 32 L400 22 L400 160 L0 160Z" fill="#15994d" fillOpacity=".1"/><polyline points="0,110 65,90 130,73 195,54 260,52 330,32 400,22" fill="none" stroke="#087cf0" strokeWidth="3"/><polyline points="0,120 65,98 130,82 195,70 260,68 330,49 400,39" fill="none" stroke="#16a35b" strokeWidth="3"/>{[[0,110],[65,90],[130,73],[195,54],[260,52],[330,32],[400,22]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3.5" fill="#087cf0"/>)}</svg><div className="ov-x-labels"><span>Oct 3</span><span>Oct 4</span><span>Oct 5</span><span>Oct 6</span><span>Oct 7</span><span>Oct 8</span><span>Oct 9</span></div></div></div>
          <div className="ov-chart-legend"><span><i className="ov-dot low"/>Actual Fill Level</span><span><i className="ov-dot blue"/>Predicted Fill Level</span></div>
        </article>
        <article className="ov-card ov-timeline-card">
          <h2>Prediction Timeline</h2><p>Bins by estimated time to overflow</p>
          <div className="ov-timeline">{[{label:"< 6h",n:12,c:"red"},{label:"6–12h",n:18,c:"orange"},{label:"12–24h",n:32,c:"yellow"},{label:"1–2 days",n:28,c:"green"},{label:"> 2 days",n:20,c:"green"}].map((v)=><div key={v.label}><b>{v.n}</b><span className={v.c} style={{height:`${v.n*3}px`}}/><small>{v.label}</small></div>)}</div>
          <div className="ov-timeline-foot">Time to Overflow</div>
        </article>
      </section>
      <footer className="ov-footer"><span><i/> Demo predictions</span><span>SmartBin AI · Sample data, not operational forecasts</span></footer>
    </div>
  );
}
