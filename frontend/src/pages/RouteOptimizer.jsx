import { useState } from "react";
import {
  Home, ChevronRight, ChevronDown, Bell, Route, Truck, Trash2,
  Navigation, Clock, Fuel, Play, RotateCcw, Target, Zap,
  AlertTriangle, CheckCircle2
} from "lucide-react";
import "./route-optimizer.css";

const initialRoutes = [
  { id: 1, name: "Route 1", color: "green", bins: 11, distance: 16.1, time: "1h 05m", minutes: 65, points: "12,70 20,80 24,65 35,73 39,57 47,62 52,46" },
  { id: 2, name: "Route 2", color: "blue", bins: 9, distance: 12.4, time: "45 mins", minutes: 45, points: "36,25 40,36 34,44 47,48 52,46 61,32 53,17" },
  { id: 3, name: "Route 3", color: "orange", bins: 8, distance: 14.1, time: "55 mins", minutes: 55, points: "70,29 65,40 60,51 69,65 83,77 87,59 78,41" }
];

const binData = [
  [17,38,32],[23,55,45],[30,27,26],[34,61,75],[42,18,55],
  [45,38,95],[49,54,42],[56,34,67],[60,65,35],[68,54,91],
  [75,28,82],[81,51,38],[88,39,96],[20,76,25],[38,78,56],
  [54,79,41],[72,76,73],[92,62,33],[28,44,89],[64,18,48],
  [47,72,31],[82,23,62],[12,55,77],[57,49,94],[35,19,34],
  [76,64,58],[43,61,81],[25,30,29]
];

function status(fill) {
  return fill >= 90 ? "overflow" : fill >= 70 ? "warning" : "normal";
}

export default function RouteOptimizer() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [routeCount, setRouteCount] = useState(3);
  const [objective, setObjective] = useState("distance");
  const [capacity, setCapacity] = useState("10");
  const [depot, setDepot] = useState("Main Depot");
  const [normal, setNormal] = useState(true);
  const [nearlyFull, setNearlyFull] = useState(true);
  const [traffic, setTraffic] = useState(true);
  const [optimized, setOptimized] = useState(false);
  const [selected, setSelected] = useState(1);

  const colors = { green: "#079749", blue: "#1677f2", orange: "#f97316", purple: "#8b5cf6" };
  const totalBins = routes.reduce((sum, r) => sum + r.bins, 0);
  const distance = routes.reduce((sum, r) => sum + r.distance, 0);
  const minutes = routes.reduce((sum, r) => sum + r.minutes, 0);
  const time = `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
  const fuel = (distance * 0.16).toFixed(1);

  function optimize() {
    const routeColors = ["green", "blue", "orange", "purple"];
    const newRoutes = Array.from({ length: routeCount }, (_, i) => {
      const base = initialRoutes[i % 3];
      const factor = optimized ? 1 : 0.88;
      const km = Number((base.distance * factor * (3 / routeCount)).toFixed(1));
      const mins = Math.round(km * (objective === "time" ? 3.5 : 4));
      return {
        ...base,
        id: i + 1,
        name: `Route ${i + 1}`,
        color: routeColors[i],
        bins: Math.max(1, Math.round(28 / routeCount)),
        distance: km,
        minutes: mins,
        time: mins >= 60
          ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`
          : `${mins} mins`
      };
    });
    setRoutes(newRoutes);
    setSelected(1);
    setOptimized(true);
  }

  function reset() {
    setRoutes(initialRoutes);
    setRouteCount(3);
    setObjective("distance");
    setCapacity("10");
    setDepot("Main Depot");
    setNormal(true);
    setNearlyFull(true);
    setTraffic(true);
    setOptimized(false);
    setSelected(1);
  }

  return (
    <div className="ro">
      <div className="ro-top">
        <div className="ro-crumb"><Home size={14}/><ChevronRight size={14}/>Route Optimizer</div>
        <div className="ro-admin"><Bell size={18}/><span className="ro-avatar">SA</span><div><b>SmartBin Admin</b><small>Administrator <ChevronDown size={12}/></small></div></div>
      </div>

      <header className="ro-heading">
        <div className="ro-title-icon"><Route size={30}/></div>
        <div className="ro-heading-copy">
          <h1>Route Optimizer</h1>
          <p>Generate the most efficient waste collection routes using AI. Save time, fuel, and resources.</p>
        </div>
        <div className="ro-actions">
          <button className="ro-btn ro-primary" onClick={optimize}><Play size={15}/>Optimize Routes</button>
          <button className="ro-btn ro-light" onClick={reset}><RotateCcw size={15}/>Reset</button>
        </div>
      </header>

      <section className="ro-kpis">
        <article className="ro-kpi"><span className="ro-kpi-icon"><Truck/></span><div><strong>{routes.length}</strong><span>Collection Routes</span><small>Optimized for efficiency</small></div></article>
        <article className="ro-kpi"><span className="ro-kpi-icon"><Trash2/></span><div><strong>{totalBins}</strong><span>Bins to Collect</span><small>Across all routes</small></div></article>
        <article className="ro-kpi"><span className="ro-kpi-icon"><Navigation/></span><div><strong>{distance.toFixed(1)} km</strong><span>Total Distance</span><small>{optimized ? "↓ 12% estimated" : "Estimated distance"}</small></div></article>
        <article className="ro-kpi"><span className="ro-kpi-icon"><Clock/></span><div><strong>{time}</strong><span>Estimated Time</span><small>{optimized ? "↓ 12% estimated" : "Estimated duration"}</small></div></article>
        <article className="ro-kpi"><span className="ro-kpi-icon ro-fuel"><Fuel/></span><div><strong>{fuel} L</strong><span>Estimated Fuel</span><small>Approximate consumption</small></div></article>
      </section>

      <section className="ro-workspace">
        <div className="ro-map">
          <div className="ro-map-art">
            <div className="ro-park ro-park-a"/><div className="ro-park ro-park-b"/><div className="ro-park ro-park-c"/>
            <div className="ro-lake"/><div className="ro-river"/>
            {Array.from({length:9},(_,i)=><div key={i} className={`ro-road road-${i+1}`}/>)}
            <span className="ro-place place-a">Central Park</span><span className="ro-place place-b">Downtown</span>
            <span className="ro-place place-c">Eastside</span><span className="ro-place place-d">West End</span>
            <span className="ro-place place-e">Tech Park</span><span className="ro-place place-f">Industrial Area</span>
            <svg className="ro-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {routes.map(r=><polyline key={r.id} points={r.points} fill="none" stroke={colors[r.color]} strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round"/>)}
            </svg>
            {binData.filter(b => (normal && b[2] < 70) || (nearlyFull && b[2] >= 70)).map((b,i)=>
              <span key={i} className={`ro-bin ${status(b[2])}`} style={{left:`${b[0]}%`,top:`${b[1]}%`}}><Trash2 size={14}/></span>
            )}
            <div className="ro-depot"><Home size={20}/></div>
            {routes.map(r=><button key={r.id} onClick={()=>setSelected(r.id)} className={`ro-route-label label-${r.color}`} style={{left:`${r.id===1?28:r.id===2?47:78}%`,top:`${r.id===1?72:r.id===2?10:43}%`}}>
              <b>Route {r.id}</b><span>{r.bins} bins · {r.distance} km</span><span>{r.time}</span>
            </button>)}
          </div>

          <div className="ro-legend">
            <span><i className="dot-green"/>Normal Bin (≤ 70%)</span>
            <span><i className="dot-yellow"/>Nearly Full (70–90%)</span>
            <span><i className="dot-red"/>Overflowing (≥ 90%)</span>
            {routes.map(r=><span key={r.id}><i className="ro-route-line" style={{background:colors[r.color]}}/>Route {r.id}</span>)}
            <span><Home size={14}/> Depot / Start</span>
          </div>
          <div className="ro-zoom"><button>+</button><button>−</button><button><Target size={16}/></button></div>
          <div className="ro-map-note">Illustrative map · Demo route data</div>
        </div>

        <aside className="ro-settings">
          <h3>Optimization Settings</h3>
          <label>Objective</label>
          <select value={objective} onChange={e=>setObjective(e.target.value)}>
            <option value="distance">Minimize Distance (Default)</option><option value="time">Minimize Time</option><option value="fuel">Minimize Fuel</option>
          </select>
          <label>Number of Routes</label>
          <div className="ro-count">{[2,3,4].map(n=><button key={n} className={routeCount===n?"active":""} onClick={()=>setRouteCount(n)}>{n}</button>)}</div>
          <label>Truck Capacity (bins)</label>
          <select value={capacity} onChange={e=>setCapacity(e.target.value)}><option value="10">10 bins</option><option value="15">15 bins</option><option value="20">20 bins</option><option value="30">30 bins</option></select>
          <label>Start Location</label>
          <select value={depot} onChange={e=>setDepot(e.target.value)}><option>Main Depot</option><option>Downtown Depot</option><option>West End Depot</option><option>Eastside Depot</option></select>
          <label className="ro-toggle"><input type="checkbox" checked={nearlyFull} onChange={e=>setNearlyFull(e.target.checked)}/><span/>Include Nearly Full Bins (70–90%)</label>
          <label className="ro-toggle"><input type="checkbox" checked={normal} onChange={e=>setNormal(e.target.checked)}/><span/>Include Normal Bins (≤ 70%)</label>
          <label className="ro-toggle"><input type="checkbox" checked={traffic} onChange={e=>setTraffic(e.target.checked)}/><span/>Real-time Traffic Data</label>
          <button className="ro-btn ro-primary ro-optimize" onClick={optimize}><Zap size={15}/>Optimize Routes</button>
          {optimized && <p className="ro-success"><CheckCircle2 size={14}/>Demo routes recalculated.</p>}
          <p className="ro-note"><AlertTriangle size={13}/> Estimates are illustrative, not live traffic data.</p>
        </aside>
      </section>

      <section className="ro-bottom">
        <article className="ro-panel">
          <h3>Route Details</h3>
          {routes.map(r=><button key={r.id} onClick={()=>setSelected(r.id)} className={`ro-detail ${selected===r.id?"selected":""}`}>
            <b className={`ro-badge badge-${r.color}`}>Route {r.id}</b><span>{r.bins} bins</span><span>{r.distance} km</span><span>{r.time}</span><ChevronRight size={15}/>
          </button>)}
        </article>

        <article className="ro-panel">
          <h3>Bin Status by Route</h3>
          <div className="ro-chart">{routes.map((r,i)=><div className="ro-column" key={r.id}>
            <div className="ro-stack"><i style={{height:`${58-i*8}%`}}/><i style={{height:`${22+i*2}%`}}/><i style={{height:`${20+i*5}%`}}/></div>
            <small>Route {r.id}</small>
          </div>)}</div>
          <div className="ro-chart-legend"><span><i className="dot-green"/>Normal</span><span><i className="dot-yellow"/>Nearly Full</span><span><i className="dot-red"/>Overflowing</span></div>
        </article>

        <article className="ro-panel ro-comparison">
          <h3>Efficiency Comparison</h3>
          <table><thead><tr><th>Metric</th><th>Previous Routes</th><th>Current Routes</th><th>Improvement</th></tr></thead>
          <tbody>
            <tr><td>Total Distance</td><td>58.9 km</td><td>{distance.toFixed(1)} km</td><td>{optimized?"↓ 28%":"—"}</td></tr>
            <tr><td>Estimated Time</td><td>4h 05m</td><td>{time}</td><td>{optimized?"↓ 32%":"—"}</td></tr>
            <tr><td>Estimated Fuel</td><td>9.1 L</td><td>{fuel} L</td><td>{optimized?"↓ 25%":"—"}</td></tr>
            <tr><td>Bins Planned</td><td>28</td><td>{totalBins}</td><td>—</td></tr>
          </tbody></table>
        </article>
      </section>
      <footer className="ro-footer"><span><i/> Demo mode</span><span>SmartBin Route Optimizer · Sample estimates</span></footer>
    </div>
  );
}
