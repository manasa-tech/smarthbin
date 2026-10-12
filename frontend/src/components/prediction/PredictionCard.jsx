import {
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function PredictionCard({
  prediction = {},
  onViewDetails,
}) {
  const binName =
    prediction.bin_name ||
    prediction.name ||
    prediction.bin_code ||
    `Bin ${prediction.bin_id ?? prediction.id ?? ""}`;

  const rawRisk =
    prediction.risk_level ??
    prediction.risk ??
    prediction.status ??
    "Unknown";

  const normalizedRisk = String(rawRisk).toLowerCase();

  const risk =
    normalizedRisk.includes("critical") ||
    normalizedRisk.includes("very high")
      ? "Critical"
      : normalizedRisk.includes("high")
      ? "High"
      : normalizedRisk.includes("medium") ||
        normalizedRisk.includes("moderate")
      ? "Medium"
      : normalizedRisk.includes("low") ||
        normalizedRisk.includes("normal")
      ? "Low"
      : "Unknown";

  const riskColors = {
    Critical: {
      color: "#b91c1c",
      background: "#fee2e2",
    },
    High: {
      color: "#c2410c",
      background: "#ffedd5",
    },
    Medium: {
      color: "#a16207",
      background: "#fef9c3",
    },
    Low: {
      color: "#15803d",
      background: "#dcfce7",
    },
    Unknown: {
      color: "#475569",
      background: "#f1f5f9",
    },
  };

  const colors = riskColors[risk];

  const rawProbability =
    prediction.overflow_probability ??
    prediction.probability ??
    prediction.risk_percentage ??
    prediction.confidence;

  const probability = Number(rawProbability);
  const hasProbability =
    rawProbability !== undefined &&
    rawProbability !== null &&
    rawProbability !== "" &&
    Number.isFinite(probability);

  const probabilityPercent = hasProbability
    ? Math.round(
        probability <= 1 && probability >= 0
          ? probability * 100
          : probability
      )
    : null;

  const fill = Number(
    prediction.fill_level ??
      prediction.fill_percentage ??
      prediction.current_fill
  );

  const hasFill = Number.isFinite(fill);

  const estimatedTime =
    prediction.predicted_overflow_time ||
    prediction.estimated_time ||
    prediction.time_to_overflow ||
    prediction.estimated_overflow ||
    null;

  const formatTime = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      if (value < 60) return `${Math.round(value)} minutes`;
      return `${Math.floor(value / 60)} hr ${Math.round(value % 60)} min`;
    }

    return String(value);
  };

  const recommendation =
    prediction.recommendation ||
    prediction.suggested_action ||
    (risk === "Critical"
      ? "Arrange immediate waste collection."
      : risk === "High"
      ? "Prioritize this bin for the next pickup."
      : risk === "Medium"
      ? "Monitor the fill level and plan collection."
      : risk === "Low"
      ? "Continue routine monitoring."
      : "Review the available bin data.");

  return (
    <article
      className="prediction-card"
      style={{
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 11, minWidth: 0 }}>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 11,
              background: "#f1f5f9",
              color: "#334155",
            }}
          >
            <Trash2 size={21} />
          </div>

          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                color: "#0f172a",
                overflowWrap: "anywhere",
              }}
            >
              {binName}
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: 12,
              }}
            >
              {prediction.location ||
                prediction.area ||
                "Location unavailable"}
            </p>
          </div>
        </div>

        <span
          style={{
            padding: "5px 9px",
            borderRadius: 20,
            background: colors.background,
            color: colors.color,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {risk} Risk
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
          gap: 12,
          marginTop: 22,
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#64748b",
              fontSize: 12,
            }}
          >
            <AlertTriangle size={15} />
            Risk Level
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              color: colors.color,
              fontSize: 20,
            }}
          >
            {risk}
          </strong>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#64748b",
              fontSize: 12,
            }}
          >
            <TrendingUp size={15} />
            {prediction.confidence != null &&
            rawProbability === prediction.confidence
              ? "Confidence"
              : "Overflow Probability"}
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              color: "#0f172a",
              fontSize: 20,
            }}
          >
            {probabilityPercent !== null
              ? `${Math.max(0, Math.min(100, probabilityPercent))}%`
              : "N/A"}
          </strong>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#64748b",
              fontSize: 12,
            }}
          >
            <Clock size={15} />
            Est. Overflow
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              color: "#0f172a",
              fontSize: 16,
            }}
          >
            {estimatedTime != null
              ? formatTime(estimatedTime)
              : "Not available"}
          </strong>
        </div>
      </div>

      {hasFill && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 8,
              fontSize: 12,
              color: "#64748b",
            }}
          >
            <span>Current Fill Level</span>
            <strong style={{ color: "#0f172a" }}>
              {Math.round(Math.max(0, Math.min(100, fill)))}%
            </strong>
          </div>

          <div
            style={{
              height: 7,
              overflow: "hidden",
              borderRadius: 8,
              background: "#e2e8f0",
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(100, fill))}%`,
                height: "100%",
                borderRadius: 8,
                background: colors.color,
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginTop: 17,
          padding: 12,
          borderRadius: 9,
          background: colors.background,
          color: colors.color,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {risk === "Low" ? (
          <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
        ) : (
          <AlertTriangle size={17} style={{ flexShrink: 0 }} />
        )}

        <span>{recommendation}</span>
      </div>

      {onViewDetails && (
        <button
          type="button"
          onClick={() => onViewDetails(prediction)}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            background: "#ffffff",
            color: "#166534",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View Prediction Details
        </button>
      )}
    </article>
  );
}
