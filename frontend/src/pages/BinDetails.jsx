import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { fetchBinById } from "../services/binService";
import "../style/dashboard.css";

export default function BinDetails() {
  const { id, binId } = useParams();
  const navigate = useNavigate();
  const currentId = binId ?? id;

  const [bin, setBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBin = async () => {
    if (!currentId) {
      setError("No bin ID was provided in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchBinById(currentId);
      setBin(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load bin details. Check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBin();
  }, [currentId]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading bin details...</p>
      </div>
    );
  }

  if (error || !bin) {
    return (
      <div className="dashboard-page">
        <button className="dashboard-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="dashboard-error">
          <AlertTriangle size={18} />
          {error || "Bin not found."}
        </div>

        <button className="dashboard-btn" onClick={loadBin}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const fill = Math.min(
    100,
    Math.max(0, Number(bin.fill_level ?? bin.fill_percentage ?? 0))
  );

  const status =
    fill >= 90
      ? "Critical"
      : fill >= 80
      ? "High"
      : fill >= 50
      ? "Medium"
      : "Normal";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <button className="dashboard-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>

          <h1>
            {bin.name || bin.bin_code || `Smart Bin ${bin.id ?? currentId}`}
          </h1>
          <p>Smart waste bin details and current status.</p>
        </div>

        <button className="dashboard-btn" onClick={loadBin}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="dashboard-stats-grid">
        <section className="dashboard-stat-card">
          <Trash2 size={24} />
          <div>
            <p>Fill Level</p>
            <h2>{Math.round(fill)}%</h2>
          </div>
        </section>

        <section className="dashboard-stat-card">
          {fill >= 80 ? (
            <AlertTriangle size={24} />
          ) : (
            <CheckCircle size={24} />
          )}
          <div>
            <p>Current Status</p>
            <h2>{status}</h2>
          </div>
        </section>

        <section className="dashboard-stat-card">
          <MapPin size={24} />
          <div>
            <p>Location</p>
            <h2>{bin.location || bin.area || "Not available"}</h2>
          </div>
        </section>
      </div>

      <section className="dashboard-panel">
        <h2>Bin Information</h2>

        <div className="dashboard-bin-list">
          <div className="dashboard-bin-item">
            <div className="dashboard-bin-details">
              <strong>Bin ID</strong>
              <span>{bin.id ?? bin.bin_id ?? currentId}</span>
            </div>
          </div>

          <div className="dashboard-bin-item">
            <div className="dashboard-bin-details">
              <strong>Fill Level</strong>
              <span>{Math.round(fill)}%</span>
            </div>

            <div className="dashboard-progress-track">
              <div
                className={`dashboard-progress-fill ${status.toLowerCase()}`}
                style={{ width: `${fill}%` }}
              />
            </div>
          </div>

          <div className="dashboard-bin-item">
            <div className="dashboard-bin-details">
              <strong>Waste Type</strong>
              <span>
                {bin.waste_type || bin.category || "Not specified"}
              </span>
            </div>
          </div>

          <div className="dashboard-bin-item">
            <div className="dashboard-bin-details">
              <strong>Last Updated</strong>
              <span>
                {bin.updated_at
                  ? new Date(bin.updated_at).toLocaleString()
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
