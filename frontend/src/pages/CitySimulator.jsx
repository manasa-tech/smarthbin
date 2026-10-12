import { useEffect, useState } from "react";
import { RefreshCw, Trash2, AlertTriangle, SlidersHorizontal } from "lucide-react";
import { fetchBins, updateBin } from "../services/binService";
import "../style/simulator.css";

export default function CitySimulator() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getFill = (bin) =>
    Number(bin.fill_level ?? bin.fill_percentage ?? 0);

  const loadBins = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await fetchBins();
      setBins(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load bins. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBins();
  }, []);

  const handleFillChange = (binId, value) => {
    setBins((current) =>
      current.map((bin) =>
        (bin.id ?? bin.bin_id) === binId
          ? { ...bin, fill_level: Number(value) }
          : bin
      )
    );
    setMessage("");
  };

  const saveFillLevel = async (bin) => {
    const binId = bin.id ?? bin.bin_id;
    if (binId == null) {
      setError("This bin has no ID, so it cannot be updated.");
      return;
    }

    setSavingId(binId);
    setError("");
    setMessage("");

    try {
      const updated = await updateBin(binId, {
        fill_level: getFill(bin),
      });

      setBins((current) =>
        current.map((item) =>
          (item.id ?? item.bin_id) === binId
            ? { ...item, ...updated }
            : item
        )
      );

      setMessage(`Bin ${binId} updated successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not save the fill level. Check the backend update endpoint."
      );
    } finally {
      setSavingId(null);
    }
  };

  const getStatus = (level) => {
    if (level >= 90) return "Critical";
    if (level >= 80) return "High";
    if (level >= 50) return "Medium";
    return "Normal";
  };

  const highCount = bins.filter((bin) => getFill(bin) >= 80).length;

  return (
    <div className="simulator-page">
      <header className="simulator-header">
        <div>
          <h1>City Simulator</h1>
          <p>Simulate smart-bin fill levels and collection priorities.</p>
        </div>

        <button
          type="button"
          className="simulator-refresh-btn"
          onClick={loadBins}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <div className="simulator-summary">
        <div className="simulator-summary-card">
          <Trash2 size={22} />
          <div>
            <span>Total Smart Bins</span>
            <strong>{loading ? "..." : bins.length}</strong>
          </div>
        </div>

        <div className="simulator-summary-card">
          <AlertTriangle size={22} />
          <div>
            <span>Priority Bins</span>
            <strong>{loading ? "..." : highCount}</strong>
          </div>
        </div>
      </div>

      {error && <div className="simulator-error">{error}</div>}
      {message && <div className="simulator-success">{message}</div>}

      <section className="simulator-panel">
        <div className="simulator-panel-heading">
          <div>
            <h2>
              <SlidersHorizontal size={20} />
              Bin Fill-Level Simulator
            </h2>
            <p>
              Adjust a bin's fill percentage and save it to the backend.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="simulator-empty">Loading smart bins...</p>
        ) : bins.length === 0 ? (
          <p className="simulator-empty">
            No bins found. Check your backend seed data.
          </p>
        ) : (
          <div className="simulator-bin-grid">
            {bins.map((bin, index) => {
              const binId = bin.id ?? bin.bin_id;
              const fill = getFill(bin);
              const status = getStatus(fill);

              return (
                <article
                  className="simulator-bin-card"
                  key={binId ?? index}
                >
                  <div className="simulator-bin-card-header">
                    <div className="simulator-bin-icon">
                      <Trash2 size={21} />
                    </div>
                    <span className={`simulator-status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <h3>
                    {bin.name || bin.bin_code || `Smart Bin ${binId ?? index + 1}`}
                  </h3>

                  <p className="simulator-bin-location">
                    {bin.location || bin.area || "City collection point"}
                  </p>

                  <div className="simulator-fill-heading">
                    <span>Fill level</span>
                    <strong>{Math.round(fill)}%</strong>
                  </div>

                  <div className="simulator-progress-track">
                    <div
                      className={`simulator-progress-fill ${status.toLowerCase()}`}
                      style={{
                        width: `${Math.min(100, Math.max(0, fill))}%`,
                      }}
                    />
                  </div>

                  <label className="simulator-slider-label">
                    Adjust fill level
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.min(100, Math.max(0, fill))}
                      onChange={(event) =>
                        handleFillChange(binId, event.target.value)
                      }
                    />
                  </label>

                  <div className="simulator-slider-values">
                    <span>0%</span>
                    <span>100%</span>
                  </div>

                  <button
                    type="button"
                    className="simulator-save-btn"
                    onClick={() => saveFillLevel(bin)}
                    disabled={savingId === binId || binId == null}
                  >
                    {savingId === binId ? "Saving..." : "Save Fill Level"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
