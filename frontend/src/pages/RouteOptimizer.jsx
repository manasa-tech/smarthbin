import { useEffect, useState } from "react";
import {
  MapPin,
  Route,
  RefreshCw,
  Truck,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import { fetchPriorityBins, fetchBins } from "../services/binService";
import { optimizeRoute } from "../services/routeService";
import "../style/route.css";

export default function RouteOptimizer() {
  const [bins, setBins] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState("");

  const getFill = (bin) =>
    Number(bin.fill_level ?? bin.fill_percentage ?? 0);

  const loadBins = async () => {
    setLoading(true);
    setError("");

    try {
      let data;

      try {
        data = await fetchPriorityBins();
      } catch {
        data = await fetchBins();
      }

      const availableBins = Array.isArray(data) ? data : [];
      const priorityBins = availableBins.filter((bin) => getFill(bin) >= 80);

      setBins(availableBins);
      setSelectedIds(
        (priorityBins.length ? priorityBins : availableBins)
          .map((bin) => bin.id ?? bin.bin_id)
          .filter((id) => id != null)
      );
      setRouteResult(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load bins. Check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBins();
  }, []);

  const toggleBin = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    setRouteResult(null);
  };

  const handleOptimize = async () => {
    if (selectedIds.length === 0) {
      setError("Select at least one bin to optimize the route.");
      return;
    }

    setOptimizing(true);
    setError("");

    try {
      const result = await optimizeRoute(selectedIds);
      setRouteResult(result);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Route optimization failed. Check that the backend route endpoint exists."
      );
    } finally {
      setOptimizing(false);
    }
  };

  const routeBins =
    routeResult?.route ||
    routeResult?.optimized_route ||
    routeResult?.bins ||
    [];

  return (
    <div className="route-page">
      <header className="route-header">
        <div>
          <h1>Route Optimizer</h1>
          <p>Plan efficient collection routes for priority waste bins.</p>
        </div>

        <button
          type="button"
          className="route-refresh-btn"
          onClick={loadBins}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="route-error">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <div className="route-summary-grid">
        <div className="route-summary-card">
          <Truck size={23} />
          <div>
            <span>Available Bins</span>
            <h2>{loading ? "..." : bins.length}</h2>
          </div>
        </div>

        <div className="route-summary-card">
          <MapPin size={23} />
          <div>
            <span>Selected for Collection</span>
            <h2>{selectedIds.length}</h2>
          </div>
        </div>
      </div>

      <div className="route-content-grid">
        <section className="route-panel">
          <div className="route-panel-heading">
            <h2>
              <MapPin size={20} />
              Select Bins
            </h2>
            <p>Select the bins that the collection vehicle should visit.</p>
          </div>

          {loading ? (
            <p className="route-empty">Loading bins...</p>
          ) : bins.length === 0 ? (
            <p className="route-empty">No bins are available.</p>
          ) : (
            <div className="route-bin-list">
              {bins.map((bin, index) => {
                const id = bin.id ?? bin.bin_id;
                const fill = getFill(bin);
                const selected = selectedIds.includes(id);

                return (
                  <label className="route-bin-item" key={id ?? index}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => id != null && toggleBin(id)}
                      disabled={id == null}
                    />

                    <div className="route-bin-info">
                      <strong>
                        {bin.name || bin.bin_code || `Smart Bin ${id ?? index + 1}`}
                      </strong>
                      <span>
                        {bin.location || bin.area || "Location unavailable"}
                      </span>
                    </div>

                    <span
                      className={`route-fill-badge ${
                        fill >= 80 ? "high" : "normal"
                      }`}
                    >
                      {Math.round(fill)}%
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          <button
            type="button"
            className="route-optimize-btn"
            onClick={handleOptimize}
            disabled={loading || optimizing || selectedIds.length === 0}
          >
            <Route size={18} />
            {optimizing ? "Optimizing..." : "Optimize Collection Route"}
          </button>
        </section>

        <section className="route-panel">
          <div className="route-panel-heading">
            <h2>
              <Navigation size={20} />
              Optimized Route
            </h2>
            <p>Review the route returned by your backend.</p>
          </div>

          {!routeResult ? (
            <div className="route-empty">
              <Route size={38} />
              <p>Select bins and optimize to view the route.</p>
            </div>
          ) : (
            <div className="route-result">
              <div className="route-result-success">
                <Navigation size={22} />
                <div>
                  <strong>Route generated</strong>
                  <p>
                    {routeResult.message ||
                      "Your backend returned a collection route."}
                  </p>
                </div>
              </div>

              {routeResult.total_distance != null && (
                <div className="route-metric">
                  <span>Total Distance</span>
                  <strong>{routeResult.total_distance} km</strong>
                </div>
              )}

              {routeResult.estimated_time != null && (
                <div className="route-metric">
                  <span>Estimated Time</span>
                  <strong>{routeResult.estimated_time}</strong>
                </div>
              )}

              {routeBins.length > 0 && (
                <ol className="route-stop-list">
                  {routeBins.map((stop, index) => {
                    const bin = typeof stop === "object" ? stop : null;

                    return (
                      <li key={bin?.id ?? bin?.bin_id ?? `${stop}-${index}`}>
                        <span className="route-stop-number">{index + 1}</span>
                        <div>
                          <strong>
                            {bin
                              ? bin.name || bin.bin_code || `Bin ${bin.id ?? bin.bin_id ?? index + 1}`
                              : `Bin ${stop}`}
                          </strong>
                          {bin?.location && <p>{bin.location}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}

              {routeResult.total_distance == null &&
                routeResult.estimated_time == null &&
                routeBins.length === 0 && (
                  <pre className="route-raw-result">
                    {JSON.stringify(routeResult, null, 2)}
                  </pre>
                )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
