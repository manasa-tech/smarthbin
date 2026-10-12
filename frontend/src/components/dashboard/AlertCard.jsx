import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  ArrowRight,
  XCircle,
} from "lucide-react";

export default function AlertCard({
  alert = {},
  onClick,
  onDismiss,
  compact = false,
}) {
  const title =
    alert.title ||
    alert.message ||
    alert.name ||
    "Waste Management Alert";

  const description =
    alert.description ||
    alert.details ||
    alert.message ||
    "Review this alert for more information.";

  const rawSeverity = String(
    alert.severity || alert.priority || alert.level || "medium"
  ).toLowerCase();

  const severity =
    rawSeverity.includes("critical") ||
    rawSeverity.includes("urgent")
      ? "Critical"
      : rawSeverity.includes("high")
      ? "High"
      : rawSeverity.includes("low")
      ? "Low"
      : rawSeverity.includes("info")
      ? "Info"
      : "Medium";

  const severityStyles = {
    Critical: {
      color: "#b91c1c",
      background: "#fee2e2",
      border: "#fecaca",
      icon: AlertTriangle,
    },
    High: {
      color: "#c2410c",
      background: "#ffedd5",
      border: "#fed7aa",
      icon: AlertTriangle,
    },
    Medium: {
      color: "#a16207",
      background: "#fef9c3",
      border: "#fde68a",
      icon: Clock,
    },
    Low: {
      color: "#15803d",
      background: "#dcfce7",
      border: "#bbf7d0",
      icon: CheckCircle2,
    },
    Info: {
      color: "#1d4ed8",
      background: "#dbeafe",
      border: "#bfdbfe",
      icon: Info,
    },
  };

  const style = severityStyles[severity];
  const SeverityIcon = style.icon;

  const isResolved =
    alert.resolved === true ||
    ["resolved", "dismissed", "closed"].includes(
      String(alert.status || "").toLowerCase()
    );

  const timestamp =
    alert.created_at ||
    alert.createdAt ||
    alert.timestamp ||
    alert.date;

  const formatTime = (value) => {
    if (!value) return "Time unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <article
      className={`alert-card ${compact ? "alert-card-compact" : ""}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        minWidth: 0,
        padding: compact ? 12 : 16,
        border: `1px solid ${isResolved ? "#e2e8f0" : style.border}`,
        borderRadius: 12,
        background: "#ffffff",
        opacity: isResolved ? 0.75 : 1,
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: 10,
          background: isResolved ? "#f1f5f9" : style.background,
          color: isResolved ? "#64748b" : style.color,
        }}
      >
        {isResolved ? (
          <CheckCircle2 size={19} />
        ) : (
          <SeverityIcon size={19} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: 14,
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </h3>

          <span
            style={{
              padding: "4px 8px",
              borderRadius: 20,
              background: isResolved ? "#f1f5f9" : style.background,
              color: isResolved ? "#64748b" : style.color,
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {isResolved ? "Resolved" : severity}
          </span>
        </div>

        {!compact && (
          <p
            style={{
              margin: "7px 0 10px",
              color: "#64748b",
              fontSize: 12,
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            {description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            color: "#94a3b8",
            fontSize: 11,
          }}
        >
          {(alert.location || alert.area) && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MapPin size={12} />
              {alert.location || alert.area}
            </span>
          )}

          {timestamp && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={12} />
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        {(onClick || (onDismiss && !isResolved)) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
            }}
          >
            {onClick && (
              <button
                type="button"
                onClick={() => onClick(alert)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  background: "#ffffff",
                  color: "#166534",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Details
                <ArrowRight size={13} />
              </button>
            )}

            {onDismiss && !isResolved && (
              <button
                type="button"
                onClick={() => onDismiss(alert)}
                aria-label={`Dismiss ${title}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 7,
                  background: "#ffffff",
                  color: "#64748b",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                <XCircle size={13} />
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
