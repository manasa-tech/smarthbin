import { useEffect, useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Clock,
  Trash2,
} from "lucide-react";
import { fetchOverflowPredictions } from "../services/predictionService";
import "../style/prediction.css";

export default function OverflowPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadPredictions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchOverflowPredictions();
      const items = Array.isArray(data)
        ? data
        : data.predictions || data.bins || [];

      setPredictions(items);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load overflow predictions. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const getFill = (bin) =>
    Number(bin.fill_level ?? bin.fill_percentage ?? 0);

  const getRisk = (bin) => {
    const explicitRisk = String(
      bin.risk_level ?? bin.risk ?? ""
    ).toLowerCase();

    if (explicitRisk.includes("critical")) return "Critical";
    if (explicitRisk.includes("high")) return "High";
    if (explicitRisk.includes("medium")) return "Medium";
    if (explicitRisk.includes("low")) return "Low";

    const fill = getFill(bin);
    if (fill >= 90) return "Critical";
    if (fill >= 80) return "High";
    if (fill >= 50) return "Medium";
    return "Low";
  };

  const getEstimatedTime = (bin) =>
    bin.predicted_overflow_time ||
    bin.estimated_overflow_time ||
    bin.hours_until_overflow ||
    bin.prediction ||
    "Not available";

  const criticalCount = predictions.filter(
    (bin) => getRisk(bin) === "Critical"
  ).length;

  const highCount = predictions.filter(
    (bin) => getRisk(bin) === "High"
  ).length;

  return (
    <div className="prediction-page">
      <header className="prediction-header">
        <div>
          <h1>Overflow Prediction</h1>
          <p>
            Monitor bin fill levels and identify bins that may require
            collection soon.
          </p>
        </div>

        <button
          type="button"
          className="prediction-refresh-btn"
          onClick={loadPredictions}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {lastUpdated && (
        <p className="prediction-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {error && (
        <div className="prediction-error">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <div className="prediction-summary-grid">
        <div className="prediction-summary-card">
          <div className="prediction-summary-icon">
            <Trash2 size={22} />
          </div>
          <div>
            <span>Bins Analysed</span>
            <h2>{loading ? "..." : predictions.length}</h2>
          </div>
        </div>

        <div className="prediction-summary-card">
          <div className="prediction-summary-icon high">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span>High Risk</span>
            <h2>{loading ? "..." : highCount}</h2>
          </div>
        </div>

        <div className="prediction-summary-card">
          <div className="prediction-summary-icon critical">
            <TrendingUp size={22} />
          </div>
          <div>
            <span>Critical Risk</span>
            <h2>{loading ? "..." : criticalCount}</h2>
          </div>
        </div>
      </div>

      <section className="prediction-panel">
        <div className="prediction-panel-heading">
          <div>
            <h2>
              <TrendingUp size={20} />
              Bin Overflow Risk
            </h2>
            <p>Review collection priorities for each bin.</p>
          </div>
        </div>

        {loading ? (
          <p className="prediction-empty">Loading predictions...</p>
        ) : predictions.length === 0 ? (
          <p className="prediction-empty">
            No predictions available. Check whether your backend returns
            prediction data.
          </p>
        ) : (
          <div className="prediction-list">
            {predictions.map((bin, index) => {
              const fill = getFill(bin);
              const risk = getRisk(bin);
              const id = bin.id ?? bin.bin_id ?? index;

              return (
                <article className="prediction-item" key={id}>
                  <div className="prediction-item-top">
                    <div className="prediction-bin-icon">
                      <Trash2 size={20} />
                    </div>

                    <div className="prediction-bin-info">
                      <h3>
                        {bin.name || bin.bin_code || `Smart Bin ${id}`}
                      </h3>
                      <p>
                        {bin.location || bin.area || "Location unavailable"}
                      </p>
                    </div>

                    <span
                      className={`prediction-risk ${risk.toLowerCase()}`}
                    >
                      {risk}
                    </span>
                  </div>

                  <div className="prediction-fill-details">
                    <span>Current fill level</span>
                    <strong>{Math.round(fill)}%</strong>
                  </div>

                  <div className="prediction-progress-track">
                    <div
                      className={`prediction-progress-fill ${risk.toLowerCase()}`}
                      style={{
                        width: `${Math.min(100, Math.max(0, fill))}%`,
                      }}
                    />
                  </div>

                  <div className="prediction-time">
                    <Clock size={16} />
                    <span>Estimated overflow: </span>
                    <strong>{getEstimatedTime(bin)}</strong>
                  </div>

                  {bin.recommendation && (
                    <p className="prediction-recommendation">
                      Recommendation: {bin.recommendation}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="prediction-disclaimer">
        Predictions depend on the data and model provided by the backend.
        Fill-level thresholds are used as a fallback when a risk prediction
        is not supplied.
      </p>
    </div>
  );
}
