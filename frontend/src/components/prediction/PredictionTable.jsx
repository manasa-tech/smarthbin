import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  AlertTriangle,
  Eye,
} from "lucide-react";

export default function PredictionTable({
  predictions = [],
  loading = false,
  onViewDetails,
}) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortDescending, setSortDescending] = useState(true);

  const getFill = (item) => {
    const value = Number(
      item.fill_level ??
      item.fill_percentage ??
      item.current_fill ??
      0
    );

    return Number.isFinite(value)
      ? Math.max(0, Math.min(100, value))
      : 0;
  };

  const getRisk = (item) => {
    const suppliedRisk = String(
      item.risk_level ?? item.risk ?? item.status ?? ""
    ).toLowerCase();

    if (
      suppliedRisk.includes("critical") ||
      suppliedRisk.includes("very high")
    ) {
      return "Critical";
    }

    if (suppliedRisk.includes("high")) return "High";

    if (
      suppliedRisk.includes("medium") ||
      suppliedRisk.includes("moderate")
    ) {
      return "Medium";
    }

    if (
      suppliedRisk.includes("low") ||
      suppliedRisk.includes("normal")
    ) {
      return "Low";
    }

    const fill = getFill(item);

    if (fill >= 90) return "Critical";
    if (fill >= 80) return "High";
    if (fill >= 50) return "Medium";
    return "Low";
  };

  const getProbability = (item) => {
    const raw =
      item.overflow_probability ??
      item.probability ??
      item.risk_percentage ??
      null;

    if (raw === null || raw === "") return null;

    const value = Number(raw);
    if (!Number.isFinite(value)) return null;

    return Math.max(
      0,
      Math.min(100, value >= 0 && value <= 1 ? value * 100 : value)
    );
  };

  const getTime = (item) =>
    item.predicted_overflow_time ??
    item.estimated_time ??
    item.time_to_overflow ??
    item.estimated_overflow ??
    "—";

  const riskStyles = {
    Critical: { color: "#b91c1c", background: "#fee2e2" },
    High: { color: "#c2410c", background: "#ffedd5" },
    Medium: { color: "#a16207", background: "#fef9c3" },
    Low: { color: "#15803d", background: "#dcfce7" },
  };

  const filteredPredictions = useMemo(() => {
    const filtered = predictions.filter((item) => {
      const name =
        item.bin_name ||
        item.name ||
        item.bin_code ||
        `Bin ${item.bin_id ?? item.id ?? ""}`;

      const query = search.toLowerCase();

      const matchesSearch =
        String(name).toLowerCase().includes(query) ||
        String(item.location || item.area || "")
          .toLowerCase()
          .includes(query);

      const matchesRisk =
        riskFilter === "All" || getRisk(item) === riskFilter;

      return matchesSearch && matchesRisk;
    });

    return [...filtered].sort((a, b) =>
      sortDescending
        ? getFill(b) - getFill(a)
        : getFill(a) - getFill(b)
    );
  }, [predictions, search, riskFilter, sortDescending]);

  return (
    <section
      className="prediction-table"
      style={{
        width: "100%",
        minWidth: 0,
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: 18 }}>
            Bin Prediction Details
          </h3>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 12 }}>
            Monitor predicted overflow risks for each bin
          </p>
        </div>

        <span style={{ color: "#64748b", fontSize: 12 }}>
          {filteredPredictions.length} results
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 210px" }}>
          <Search
            size={17}
            style={{
              position: "absolute",
              left: 11,
              top: 11,
              color: "#94a3b8",
            }}
          />
          <input
            type="search"
            placeholder="Search bin or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search bins"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 36px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              outlineColor: "#16a34a",
            }}
          />
        </div>

        <select
          value={riskFilter}
          onChange={(event) => setRiskFilter(event.target.value)}
          aria-label="Filter by risk"
          style={{
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            background: "#ffffff",
            color: "#334155",
          }}
        >
          <option value="All">All risk levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          type="button"
          onClick={() => setSortDescending((previous) => !previous)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            background: "#ffffff",
            color: "#334155",
            cursor: "pointer",
          }}
        >
          <ArrowUpDown size={16} />
          Fill {sortDescending ? "High to Low" : "Low to High"}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 35, textAlign: "center", color: "#64748b" }}>
          Loading predictions...
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div
          style={{
            padding: 35,
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: 10,
            color: "#64748b",
          }}
        >
          <AlertTriangle size={25} />
          <p style={{ marginBottom: 0 }}>No matching predictions found.</p>
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 700,
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc", color: "#64748b" }}>
                {[
                  "Bin",
                  "Location",
                  "Current Fill",
                  "Overflow Probability",
                  "Risk",
                  "Estimated Time",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "13px 12px",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredPredictions.map((item, index) => {
                const id = item.bin_id ?? item.id ?? index;
                const name =
                  item.bin_name ||
                  item.name ||
                  item.bin_code ||
                  `Bin ${id}`;

                const fill = getFill(item);
                const risk = getRisk(item);
                const probability = getProbability(item);
                const colors = riskStyles[risk];

                return (
                  <tr key={id}>
                    <td style={cellStyle}>
                      <strong style={{ color: "#0f172a" }}>{name}</strong>
                    </td>

                    <td style={{ ...cellStyle, color: "#64748b" }}>
                      {item.location || item.area || "—"}
                    </td>

                    <td style={cellStyle}>
                      <div style={{ minWidth: 85 }}>
                        <strong>{fill}%</strong>
                        <div
                          style={{
                            height: 5,
                            marginTop: 6,
                            borderRadius: 5,
                            background: "#e2e8f0",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${fill}%`,
                              background: colors.color,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      {probability === null
                        ? "—"
                        : `${Math.round(probability)}%`}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: 20,
                          background: colors.background,
                          color: colors.color,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {risk}
                      </span>
                    </td>

                    <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                      {String(getTime(item))}
                    </td>

                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(item)}
                        disabled={!onViewDetails}
                        title="View prediction details"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 9px",
                          border: "1px solid #d1d5db",
                          borderRadius: 7,
                          background: "#ffffff",
                          color: "#166534",
                          cursor: onViewDetails ? "pointer" : "default",
                          opacity: onViewDetails ? 1 : 0.6,
                        }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const cellStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  verticalAlign: "middle",
};
