import { useEffect, useState } from "react";
import { Trash2, AlertTriangle, Recycle, RefreshCw } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";
import "../style/dashboard.css";

export default function Dashboard() {
  const [bins, setBins] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [binsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.BINS}`),
        axios.get(`${API_BASE_URL}${API_ENDPOINTS.DASHBOARD_STATS}`),
      ]);

      const data = binsResponse.data;
      setBins(Array.isArray(data) ? data : data.bins || []);
      setStats(statsResponse.data || {});
    } catch (err) {
      setError("Cannot connect to the backend. Check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const getFill = (bin) =>
    Number(bin.fill_level ?? bin.fill_percentage ?? 0);

  const highBins = bins.filter((bin) => getFill(bin) >= 80).length;

  const averageFill = bins.length
    ? Math.round(
        bins.reduce((sum, bin) => sum + getFill(bin), 0) / bins.length
      )
    : 0;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>SmartBin Dashboard</h1>
          <p>Monitor and manage city waste collection.</p>
        </div>

        <button className="dashboard-btn" onClick={loadDashboard}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <Trash2 size={24} />
          <h3>Total Smart Bins</h3>
          <h2>{loading ? "..." : stats.total_bins ?? bins.length}</h2>
        </div>

        <div className="dashboard-stat-card">
          <AlertTriangle size={24} />
          <h3>High-Fill Bins</h3>
          <h2>{loading ? "..." : stats.full_bins ?? highBins}</h2>
        </div>

        <div className="dashboard-stat-card">
          <Recycle size={24} />
          <h3>Average Fill Level</h3>
          <h2>{loading ? "..." : `${stats.average_fill_level ?? averageFill}%`}</h2>
        </div>
      </div>

      <section className="dashboard-panel">
        <h2>Bin Monitoring</h2>

        {loading ? (
          <p>Loading bins...</p>
        ) : bins.length === 0 ? (
          <p>No bins found in the database.</p>
        ) : (
          bins.map((bin, index) => {
            const fill = getFill(bin);
            const status =
              fill >= 90 ? "Critical" :
              fill >= 80 ? "High" :
              fill >= 50 ? "Medium" : "Normal";

            return (
              <div className="dashboard-bin-item" key={bin.id ?? index}>
                <div className="dashboard-bin-details">
                  <strong>
                    {bin.name || bin.bin_code || `Smart Bin ${bin.id ?? index + 1}`}
                  </strong>
                  <span>{Math.round(fill)}% — {status}</span>
                </div>

                <div className="dashboard-progress-track">
                  <div
                    className={`dashboard-progress-fill ${status.toLowerCase()}`}
                    style={{ width: `${Math.min(100, Math.max(0, fill))}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
