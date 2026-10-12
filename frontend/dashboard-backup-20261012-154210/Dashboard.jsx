import React, { useEffect, useMemo, useState } from "react";
import {
  Trash2, ShieldCheck, AlertTriangle, Siren, TrendingUp,
  TrendingDown, CalendarDays, Bell, ChevronDown, MapPin,
  Layers, Plus, Minus, LocateFixed, CheckCircle2, Clock3,
  ArrowRight, FileText, RefreshCw, Recycle
} from "lucide-react";
import "../style/dashboard.css";

const API = "http://localhost:8000";

const initialReports = [];

function formatDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date());
}

function getBinId(bin) {
  return bin.bin_id ?? bin.id ?? bin.bin_number ?? "—";
}

function getFill(bin) {
  const value = Number(
    bin.fill_level ?? bin.fill_percentage ?? bin.fillLevel ?? bin.fill ?? 0
  );
  return Math.max(0, Math.min(100, value));
}

function getLocation(bin) {
  return bin.location ?? bin.area ?? bin.address ?? "Unknown location";
}

function getStatus(bin) {
  const raw = String(bin.status ?? "").toLowerCase();
  const fill = getFill(bin);

  if (raw.includes("overflow") || fill >= 90) return "Overflowing";
  if (raw.includes("full") || raw.includes("high") || fill >= 70) return "Nearly Full";
  if (raw.includes("pending")) return "Pending";
  return "Normal";
}

function statusClass(status) {
  if (status === "Overflowing" || status === "Open") return "sb-status-red";
  if (status === "Nearly Full" || status === "In Progress") return "sb-status-amber";
  if (status === "Resolved" || status === "Normal") return "sb-status-green";
  return "sb-status-blue";
}

function Dashboard() {
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [wastePeriod, setWastePeriod] = useState("This Week");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [binsResponse, reportsResponse] = await Promise.allSettled([
        fetch(`${API}/api/bins`),
        fetch(`${API}/api/reports`)
      ]);

      if (binsResponse.status !== "fulfilled" || !binsResponse.value.ok) {
        throw new Error("Could not load bins. Check that FastAPI is running.");
      }

      const binsJson = await binsResponse.value.json();
      const binList = Array.isArray(binsJson)
        ? binsJson
        : binsJson.bins ?? binsJson.data ?? [];

      setBins(binList);

      if (reportsResponse.status === "fulfilled" && reportsResponse.value.ok) {
        const reportsJson = await reportsResponse.value.json();
        setReports(
          Array.isArray(reportsJson)
            ? reportsJson
            : reportsJson.reports ?? reportsJson.data ?? []
        );
      } else {
        setReports([]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = useMemo(() => {
    const normal = bins.filter(bin => getStatus(bin) === "Normal").length;
    const nearlyFull = bins.filter(bin => getStatus(bin) === "Nearly Full").length;
    const overflowing = bins.filter(bin => getStatus(bin) === "Overflowing").length;
    const averageFill = bins.length
      ? Math.round(bins.reduce((sum, bin) => sum + getFill(bin), 0) / bins.length)
      : 0;

    return {
      total: bins.length,
      normal,
      nearlyFull,
      overflowing,
      averageFill,
      collected: Math.max(0, bins.length - nearlyFull - overflowing)
    };
  }, [bins]);

  const attentionBins = useMemo(
    () => bins
      .filter(bin => getStatus(bin) !== "Normal")
      .sort((a, b) => getFill(b) - getFill(a))
      .slice(0, 5),
    [bins]
  );

  const mapBins = useMemo(() => bins.slice(0, 24), [bins]);

  const wasteTypes = [
    { name: "Organic", percentage: 45, color: "#16b86a" },
    { name: "Recyclable", percentage: 30, color: "#4c8dff" },
    { name: "Plastic", percentage: 15, color: "#ffb21a" },
    { name: "Others", percentage: 10, color: "#8a9db7" }
  ];

  const reportRows = reports.slice(0, 5).map((report, index) => {
    const rawStatus = String(report.status ?? "Open");
    const status = rawStatus.toLowerCase().includes("resolv")
      ? "Resolved"
      : rawStatus.toLowerCase().includes("progress")
        ? "In Progress"
        : "Open";

    return {
      id: report.id ?? report.report_id ?? `—`,
      location: report.location ?? report.area ?? "—",
      issue: report.issue ?? report.description ?? report.title ?? "Waste report",
      status,
      time: report.created_at
        ? new Date(report.created_at).toLocaleDateString()
        : "—",
      key: report.id ?? report.report_id ?? index
    };
  });

  return (
    <div className="sb-dashboard">
      <header className="sb-welcome-bar">
        <div className="sb-welcome">
          <span className="sb-wave">👋</span>
          <div>
            <h1>Hello, welcome back!</h1>
            <p>Here's the overview of your city's waste management.</p>
          </div>
        </div>

        <div className="sb-header-actions">
          <div className="sb-date-chip">
            <CalendarDays size={19} />
            <div><strong>{formatDate()}</strong><small>Today</small></div>
          </div>
          <button className="sb-icon-button" aria-label="Notifications">
            <Bell size={21} /><span className="sb-notification-dot" />
          </button>
          <div className="sb-admin">
            <span className="sb-avatar">A</span>
            <div><strong>SmartBin Admin</strong><small>Administrator</small></div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <main className="sb-dashboard-content">
        <div className="sb-dashboard-title-row">
          <div>
            <span className="sb-eyebrow">CITY OVERVIEW</span>
            <h2>Dashboard</h2>
            <p>Monitor bin activity and collection priorities in one place.</p>
          </div>
          <button className="sb-refresh-button" onClick={loadDashboard} disabled={loading}>
            <RefreshCw size={16} className={loading ? "sb-spinning" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="sb-error-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={loadDashboard}>Try again</button>
          </div>
        )}

        {lastUpdated && !error && (
          <p className="sb-updated-note">
            <span className="sb-live-dot" /> Data updated at {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <section className="sb-kpi-grid">
          <article className="sb-kpi-card">
            <div className="sb-kpi-icon sb-icon-green"><Trash2 size={23} /></div>
            <div className="sb-kpi-main">
              <span>Total Bins</span>
              <strong>{summary.total}</strong>
              <small>Registered bins</small>
            </div>
            <div className="sb-kpi-side sb-side-green"><TrendingUp size={15} /> Live</div>
          </article>

          <article className="sb-kpi-card">
            <div className="sb-kpi-icon sb-icon-green"><ShieldCheck size={23} /></div>
            <div className="sb-kpi-main">
              <span>Normal Bins</span>
              <strong>{summary.normal}</strong>
              <small>Within fill threshold</small>
            </div>
            <div className="sb-kpi-side sb-side-green"><CheckCircle2 size={15} /> Normal</div>
          </article>

          <article className="sb-kpi-card">
            <div className="sb-kpi-icon sb-icon-amber"><AlertTriangle size={23} /></div>
            <div className="sb-kpi-main">
              <span>Nearly Full</span>
              <strong>{summary.nearlyFull}</strong>
              <small>Require monitoring</small>
            </div>
            <div className="sb-kpi-side sb-side-amber"><TrendingUp size={15} /> Priority</div>
          </article>

          <article className="sb-kpi-card">
            <div className="sb-kpi-icon sb-icon-red"><Siren size={23} /></div>
            <div className="sb-kpi-main">
              <span>Overflowing</span>
              <strong>{summary.overflowing}</strong>
              <small>Need urgent attention</small>
            </div>
            <div className="sb-kpi-side sb-side-red"><AlertTriangle size={15} /> Urgent</div>
          </article>
        </section>

        <section className="sb-main-grid">
          <article className="sb-panel sb-map-panel">
            <div className="sb-panel-heading">
              <div>
                <h3>Bin Locations</h3>
                <p>Overview of registered bins and their status</p>
              </div>
              <div className="sb-map-legend">
                <span><i className="legend-green" /> Normal</span>
                <span><i className="legend-amber" /> Nearly full</span>
                <span><i className="legend-red" /> Overflowing</span>
              </div>
            </div>

            <div className="sb-city-map">
              <div className="sb-map-grid-lines" />
              <div className="sb-map-road road-one" />
              <div className="sb-map-road road-two" />
              <div className="sb-map-road road-three" />
              <div className="sb-map-road road-four" />
              <div className="sb-map-river" />
              <div className="sb-map-label">CITY BIN NETWORK</div>
              <div className="sb-map-city-name">SmartBin monitored area</div>

              {mapBins.map((bin, index) => {
                const status = getStatus(bin);
                const positions = [
                  [20, 25], [40, 18], [60, 29], [78, 20],
                  [14, 55], [32, 45], [52, 54], [73, 48],
                  [87, 62], [24, 76], [45, 80], [64, 72],
                  [81, 83], [10, 37], [37, 32], [57, 40],
                  [68, 18], [49, 65], [18, 88], [90, 38],
                  [34, 60], [76, 34], [58, 88], [8, 67]
                ];
                const [left, top] = positions[index % positions.length];
                const markerClass = status === "Overflowing"
                  ? "sb-marker-red"
                  : status === "Nearly Full" ? "sb-marker-amber" : "sb-marker-green";

                return (
                  <div
                    key={getBinId(bin)}
                    className={`sb-map-marker ${markerClass}`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    title={`Bin ${getBinId(bin)} · ${getLocation(bin)} · ${getFill(bin)}% full`}
                  >
                    <Trash2 size={14} />
                  </div>
                );
              })}

              {bins.length === 0 && !loading && (
                <div className="sb-map-empty">Bin locations will appear here when data is available.</div>
              )}

              <div className="sb-map-tools">
                <button aria-label="Map layers" title="Map layers"><Layers size={17} /></button>
                <button aria-label="Zoom in" title="Zoom in"><Plus size={18} /></button>
                <button aria-label="Zoom out" title="Zoom out"><Minus size={18} /></button>
                <button aria-label="Locate bins" title="Locate bins"><LocateFixed size={17} /></button>
              </div>
              <span className="sb-map-caption"><MapPin size={13} /> Bin status overview</span>
            </div>
          </article>

          <div className="sb-side-panels">
            <article className="sb-panel sb-waste-panel">
              <div className="sb-panel-heading">
                <div><h3>Waste Distribution</h3><p>Illustrative category breakdown</p></div>
                <select value={wastePeriod} onChange={event => setWastePeriod(event.target.value)} aria-label="Waste period">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="sb-waste-content">
                <div className="sb-donut">
                  <div className="sb-donut-center">
                    <strong>100%</strong>
                    <span>Categories</span>
                  </div>
                </div>
                <div className="sb-waste-legend">
                  {wasteTypes.map(item => (
                    <div className="sb-waste-legend-row" key={item.name}>
                      <span><i style={{ background: item.color }} />{item.name}</span>
                      <strong>{item.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="sb-panel sb-collection-panel">
              <div className="sb-panel-heading">
                <div><h3>Collection Overview</h3><p>Based on current bin status</p></div>
              </div>
              <div className="sb-progress-heading">
                <span>Bins within normal threshold</span><strong>{summary.total ? Math.round(summary.normal / summary.total * 100) : 0}%</strong>
              </div>
              <div className="sb-progress-track">
                <div style={{ width: `${summary.total ? summary.normal / summary.total * 100 : 0}%` }} />
              </div>
              <div className="sb-collection-stats">
                <div><span className="sb-mini-icon sb-icon-green"><CheckCircle2 size={17} /></span><strong>{summary.normal}</strong><small>Normal</small></div>
                <div><span className="sb-mini-icon sb-icon-amber"><Clock3 size={17} /></span><strong>{summary.nearlyFull}</strong><small>Priority</small></div>
                <div><span className="sb-mini-icon sb-icon-red"><Trash2 size={17} /></span><strong>{summary.overflowing}</strong><small>Urgent</small></div>
              </div>
            </article>
          </div>
        </section>

        <section className="sb-bottom-grid">
          <article className="sb-panel sb-table-panel">
            <div className="sb-panel-heading sb-table-heading">
              <div><h3>Bins Needing Attention</h3><p>Highest fill levels first</p></div>
              <a href="/predictions">View all <ArrowRight size={15} /></a>
            </div>
            <div className="sb-table-scroll">
              <table className="sb-table">
                <thead><tr><th>Bin ID</th><th>Location</th><th>Fill Level</th><th>Status</th></tr></thead>
                <tbody>
                  {attentionBins.map(bin => {
                    const fill = getFill(bin);
                    const status = getStatus(bin);
                    return (
                      <tr key={getBinId(bin)}>
                        <td className="sb-table-id">#{getBinId(bin)}</td>
                        <td>{getLocation(bin)}</td>
                        <td>
                          <div className="sb-fill-cell"><span>{fill}%</span><div className="sb-fill-track"><div className={fill >= 90 ? "fill-red" : fill >= 70 ? "fill-amber" : "fill-green"} style={{ width: `${fill}%` }} /></div></div>
                        </td>
                        <td><span className={`sb-status-pill ${statusClass(status)}`}>{status}</span></td>
                      </tr>
                    );
                  })}
                  {!loading && attentionBins.length === 0 && (
                    <tr><td colSpan="4" className="sb-empty-cell">{error ? "Unable to load bins." : "No bins currently need attention."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="sb-panel sb-table-panel">
            <div className="sb-panel-heading sb-table-heading">
              <div><h3>Recent Citizen Reports</h3><p>Latest submitted reports</p></div>
              <a href="/reports-history">View all <ArrowRight size={15} /></a>
            </div>
            <div className="sb-table-scroll">
              <table className="sb-table">
                <thead><tr><th>ID</th><th>Location</th><th>Issue</th><th>Status</th></tr></thead>
                <tbody>
                  {reportRows.map(report => (
                    <tr key={report.key}>
                      <td className="sb-table-id">#{report.id}</td>
                      <td>{report.location}</td>
                      <td className="sb-issue-cell">{report.issue}</td>
                      <td><span className={`sb-status-pill ${statusClass(report.status)}`}>{report.status}</span></td>
                    </tr>
                  ))}
                  {!loading && reportRows.length === 0 && (
                    <tr><td colSpan="4" className="sb-empty-cell">{error ? "Report data unavailable." : "No citizen reports available yet."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <footer className="sb-dashboard-footer">
          <span><Recycle size={16} /> SmartBin Waste Management</span>
          <span>{lastUpdated ? `Last refreshed ${lastUpdated.toLocaleTimeString()}` : "Connected city operations overview"}</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
