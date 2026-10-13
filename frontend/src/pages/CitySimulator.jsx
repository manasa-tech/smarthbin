import { useMemo, useState } from "react";
import {
  Map as MapIcon, Trash2, CheckCircle2, AlertTriangle, CircleAlert,
  Play, RotateCcw, Search, Plus, Minus, LocateFixed, Bell, ChevronDown,
  Home, ChevronRight, Activity, Pause, Recycle
} from "lucide-react";
import "./city-simulator.css";

const initialBins = [
  { id: "SB-101", x: 18, y: 24, fill: 35, area: "Central Park" },
  { id: "SB-102", x: 31, y: 32, fill: 62, area: "Riverside" },
  { id: "SB-103", x: 43, y: 20, fill: 48, area: "Riverside" },
  { id: "SB-104", x: 51, y: 57, fill: 92, area: "Downtown" },
  { id: "SB-105", x: 61, y: 28, fill: 78, area: "Eastside" },
  { id: "SB-106", x: 72, y: 48, fill: 32, area: "Eastside" },
  { id: "SB-107", x: 24, y: 65, fill: 96, area: "West End" },
  { id: "SB-108", x: 38, y: 75, fill: 42, area: "Tech Park" },
  { id: "SB-109", x: 66, y: 76, fill: 85, area: "Brookfield" },
  { id: "SB-110", x: 82, y: 26, fill: 55, area: "Eastside" },
  { id: "SB-111", x: 13, y: 48, fill: 22, area: "West End" },
  { id: "SB-112", x: 79, y: 66, fill: 97, area: "Industrial Area" },
  { id: "SB-113", x: 45, y: 42, fill: 65, area: "Downtown" },
  { id: "SB-114", x: 33, y: 49, fill: 28, area: "Central Park" },
  { id: "SB-115", x: 57, y: 38, fill: 72, area: "Downtown" },
  { id: "SB-116", x: 87, y: 48, fill: 38, area: "Eastside" },
  { id: "SB-117", x: 19, y: 80, fill: 58, area: "West End" },
  { id: "SB-118", x: 54, y: 82, fill: 18, area: "Tech Park" },
];

const areas = ["Downtown", "Riverside", "Lakeside", "Tech Park", "University"];

function statusFor(fill) {
  if (fill >= 90) return "overflow";
  if (fill >= 70) return "warning";
  return "normal";
}

export default function CitySimulator() {
  const [bins, setBins] = useState(initialBins);
  const [speed, setSpeed] = useState("1x");
  const [scenario, setScenario] = useState("Normal Day");
  const [running, setRunning] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBin, setSelectedBin] = useState("SB-104");
  const [zoom, setZoom] = useState(1);

  const stats = useMemo(() => {
    const normal = bins.filter((b) => b.fill < 70).length;
    const warning = bins.filter((b) => b.fill >= 70 && b.fill < 90).length;
    const overflow = bins.filter((b) => b.fill >= 90).length;
    return { total: bins.length, normal, warning, overflow };
  }, [bins]);

  const visibleBins = bins.filter((b) =>
    `${b.id} ${b.area}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = bins.find((b) => b.id === selectedBin);

  function runSimulation() {
    if (running) {
      setRunning(false);
      return;
    }
    setBins((current) => current.map((bin) => {
      let increase = scenario === "Peak Hours" ? 18 : scenario === "Heavy Waste" ? 28 : 8;
      if (scenario === "Collection Day") increase = -35;
      return { ...bin, fill: Math.max(5, Math.min(100, bin.fill + increase)) };
    }));
    setRunning(true);
  }

  function resetSimulation() {
    setBins(initialBins);
    setSelectedBin("SB-104");
    setRunning(false);
    setScenario("Normal Day");
    setSpeed("1x");
    setSearch("");
    setZoom(1);
  }

  const areaStats = areas.map((area) => {
    const areaBins = bins.filter((b) => b.area === area);
    return {
      name: area,
      total: areaBins.length || [28, 18, 16, 20, 14][areas.indexOf(area)],
      urgent: areaBins.filter((b) => b.fill >= 70).length,
    };
  });

  return (
    <div className="citysim">
      <div className="cs-topline">
        <div className="cs-crumb"><Home size={14} /> <ChevronRight size={14} /> City Simulator</div>
        <div className="cs-admin"><Bell size={18} /><span className="cs-avatar">SA</span><div><b>SmartBin Admin</b><small>Administrator <ChevronDown size={12} /></small></div></div>
      </div>

      <header className="cs-heading">
        <div className="cs-heading-icon"><MapIcon size={29} /></div>
        <div className="cs-heading-copy">
          <h1>City Simulator</h1>
          <p>Explore bin status across the city. Simulate waste collection and analyze city-wide data.</p>
        </div>
        <div className="cs-heading-actions">
          <button className="cs-btn cs-btn-primary" onClick={runSimulation}>
            {running ? <Pause size={16} /> : <Play size={16} />} {running ? "Pause Simulation" : "Run Simulation"}
          </button>
          <button className="cs-btn cs-btn-light" onClick={resetSimulation}><RotateCcw size={16} /> Reset View</button>
        </div>
      </header>

      <section className="cs-kpis">
        <article className="cs-kpi"><div className="cs-kpi-icon cs-green"><Trash2 /></div><div><strong>{stats.total + 110}</strong><span>Total Smart Bins</span></div></article>
        <article className="cs-kpi"><div className="cs-kpi-icon cs-green"><CheckCircle2 /></div><div className="cs-kpi-number"><strong>{stats.normal + 78}</strong><span>Normal (≤ 70%)</span></div><div className="cs-kpi-side"><span>75%</span><i><b style={{width:"75%"}} /></i></div></article>
        <article className="cs-kpi"><div className="cs-kpi-icon cs-yellow"><AlertTriangle /></div><div className="cs-kpi-number"><strong>{stats.warning + 20}</strong><span>Nearly Full (70–90%)</span></div><div className="cs-kpi-side"><span>18%</span><i><b className="cs-bar-yellow" style={{width:"28%"}} /></i></div></article>
        <article className="cs-kpi"><div className="cs-kpi-icon cs-red"><CircleAlert /></div><div className="cs-kpi-number"><strong>{stats.overflow}</strong><span>Overflowing (≥ 90%)</span></div><div className="cs-kpi-side"><span>6%</span><i><b className="cs-bar-red" style={{width:"12%"}} /></i></div></article>
      </section>

      <section className="cs-workspace">
        <div className="cs-map">
          <div className="cs-map-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bin or location..." /></div>
          <div className="cs-map-art" style={{transform:`scale(${zoom})`}}>
            <div className="cs-park park-one" /><div className="cs-park park-two" /><div className="cs-park park-three" />
            <div className="cs-lake" /><div className="cs-river" />
            <div className="cs-road road-one" /><div className="cs-road road-two" /><div className="cs-road road-three" /><div className="cs-road road-four" /><div className="cs-road road-five" /><div className="cs-road road-six" /><div className="cs-road road-seven" /><div className="cs-road road-eight" /><div className="cs-road road-nine" />
            <div className="cs-map-label label-central">Central Park</div><div className="cs-map-label label-river">Riverside</div><div className="cs-map-label label-down">Downtown</div><div className="cs-map-label label-east">Eastside</div><div className="cs-map-label label-west">West End</div><div className="cs-map-label label-tech">Tech Park</div><div className="cs-map-label label-brook">Brookfield</div><div className="cs-map-label label-industry">Industrial Area</div>
            {visibleBins.map((bin) => (
              <button key={bin.id} title={`${bin.id} • ${bin.fill}% full • ${bin.area}`} className={`cs-pin ${statusFor(bin.fill)} ${selectedBin === bin.id ? "cs-pin-selected" : ""}`} style={{left:`${bin.x}%`,top:`${bin.y}%`}} onClick={() => setSelectedBin(bin.id)}>
                <Trash2 size={15} />
              </button>
            ))}
          </div>
          {selected && <div className="cs-map-tooltip"><div className={`cs-mini-bin ${statusFor(selected.fill)}`}><Trash2 size={20} /></div><div><b>Bin #{selected.id}</b><span>Fill Level: <strong className={statusFor(selected.fill)}>{selected.fill}%</strong></span><small>Location: {selected.area}</small></div><ChevronRight size={16} /></div>}
          <div className="cs-map-zoom"><button onClick={() => setZoom((z) => Math.min(1.3,z+.1))}><Plus size={17}/></button><button onClick={() => setZoom((z) => Math.max(.8,z-.1))}><Minus size={17}/></button><button onClick={() => {setZoom(1);setSearch("");}}><LocateFixed size={16}/></button></div>
          <div className="cs-map-credit">Illustrative city map · Demo bin locations</div>
        </div>

        <aside className="cs-sidepanels">
          <article className="cs-panel">
            <h3>Bin Status Legend</h3>
            <div className="cs-legend"><span className="cs-legend-bin normal"><Trash2 size={17}/></span><span>Normal (≤ 70%)</span></div>
            <div className="cs-legend"><span className="cs-legend-bin warning"><Trash2 size={17}/></span><span>Nearly Full (70–90%)</span></div>
            <div className="cs-legend"><span className="cs-legend-bin overflow"><Trash2 size={17}/></span><span>Overflowing (≥ 90%)</span></div>
          </article>
          <article className="cs-panel cs-controls">
            <h3>Simulation Controls</h3>
            <label>Time Speed</label>
            <div className="cs-segment">{["1x","2x","4x"].map((s)=><button key={s} className={speed===s?"active":""} onClick={()=>setSpeed(s)}>{s}</button>)}</div>
            <label htmlFor="cs-scenario">Scenario</label>
            <select id="cs-scenario" value={scenario} onChange={(e)=>setScenario(e.target.value)}>
              <option>Normal Day</option><option>Peak Hours</option><option>Heavy Waste</option><option>Collection Day</option>
            </select>
            <button className="cs-btn cs-btn-primary cs-start" onClick={runSimulation}>{running?<Pause size={16}/>:<Play size={16}/>} {running?"Pause Simulation":"Start Simulation"}</button>
            {running && <p className="cs-running"><Activity size={14}/> Simulation running at {speed} speed</p>}
          </article>
        </aside>
      </section>

      <section className="cs-bottom-grid">
        <article className="cs-panel cs-distribution">
          <h3>Fill Level Distribution</h3>
          <div className="cs-donut-wrap"><div className="cs-donut"><div><strong>{stats.total + 110}</strong><span>Bins</span></div></div><div className="cs-donut-legend"><span><i className="dot-green"/>Normal (≤ 70%) <b>75%</b></span><span><i className="dot-yellow"/>Nearly Full (70–90%) <b>18%</b></span><span><i className="dot-red"/>Overflowing (≥ 90%) <b>6%</b></span></div></div>
        </article>
        <article className="cs-panel cs-chart-panel">
          <h3>Real-time Fill Levels</h3>
          <div className="cs-bar-chart">{[38,20,23,16,12].map((v,i)=><div className="cs-chart-column" key={v}><span>{[50,40,30,20,10][i]}</span><div className={`cs-chart-bar bar-${i}`} style={{height:`${v*2.4}px`}}/><small>{["0–20%","20–40%","40–60%","60–80%","80–100%"][i]}</small></div>)}</div>
        </article>
        <article className="cs-panel cs-area-panel">
          <h3>Area-wise Bin Status</h3>
          {areaStats.map((area,i)=><div className="cs-area-row" key={area.name}><span>{area.name}</span><i><b className={i===0||i===4?"area-yellow":""} style={{width:`${Math.max(12,area.urgent*22)}%`}}/></i><small>{area.urgent} / {area.total}</small></div>)}
        </article>
      </section>
      <div className="cs-footnote"><span><i/> Demo mode</span><span>SmartBin City Simulator · Illustrative sample data</span></div>
    </div>
  );
}
