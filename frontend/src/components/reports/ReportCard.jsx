import {
  MapPin,
  CalendarDays,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  FileText,
} from "lucide-react";

export default function ReportCard({
  report = {},
  onViewDetails,
  onUpdateStatus,
  loading = false,
}) {
  const reportId = report.id ?? report.report_id ?? "N/A";

  const title =
    report.title ||
    report.subject ||
    report.report_type ||
    "Waste Collection Report";

  const description =
    report.description ||
    report.message ||
    "No additional description provided.";

  const location =
    report.location ||
    report.address ||
    report.area ||
    "Location unavailable";

  const rawStatus = String(
    report.status || "Pending"
  ).toLowerCase();

  const status =
    rawStatus.includes("progress") || rawStatus.includes("processing")
      ? "In Progress"
      : rawStatus.includes("resolved") ||
        rawStatus.includes("completed") ||
        rawStatus.includes("closed")
      ? "Resolved"
      : rawStatus.includes("reject")
      ? "Rejected"
      : "Pending";

  const rawPriority = String(
    report.priority || report.severity || "Medium"
  ).toLowerCase();

  const priority = ["critical", "urgent", "high"].includes(rawPriority)
    ? rawPriority === "critical" || rawPriority === "urgent"
      ? "Critical"
      : "High"
    : rawPriority === "low"
    ? "Low"
    : "Medium";

  const statusColors = {
    Pending: { color: "#b45309", background: "#fef3c7" },
    "In Progress": { color: "#1d4ed8", background: "#dbeafe" },
    Resolved: { color: "#15803d", background: "#dcfce7" },
    Rejected: { color: "#b91c1c", background: "#fee2e2" },
  };

  const priorityColors = {
    Critical: { color: "#b91c1c", background: "#fee2e2" },
    High: { color: "#c2410c", background: "#ffedd5" },
    Medium: { color: "#a16207", background: "#fef9c3" },
    Low: { color: "#15803d", background: "#dcfce7" },
  };

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusIcon =
    status === "Resolved"
      ? CheckCircle2
      : status === "In Progress"
      ? Clock
      : AlertTriangle;

  const StatusIcon = statusIcon;

  return (
    <article
      className="report-card"
      style={{
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 11, minWidth: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 11,
              background: "#dcfce7",
              color: "#166534",
            }}
          >
            <FileText size={21} />
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
              {title}
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: 12,
              }}
            >
              Report #{reportId}
            </p>
          </div>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 9px",
            borderRadius: 20,
            background: statusColors[status].background,
            color: statusColors[status].color,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <StatusIcon size={13} />
          {status}
        </span>
      </div>

      <p
        style={{
          margin: "16px 0",
          color: "#475569",
          fontSize: 13,
          lineHeight: 1.6,
          overflowWrap: "anywhere",
        }}
      >
        {description}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          color: "#64748b",
          fontSize: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={15} />
          {location}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <CalendarDays size={15} />
          {formatDate(
            report.created_at || report.createdAt || report.date
          )}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 17,
          paddingTop: 14,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <span
          style={{
            padding: "5px 9px",
            borderRadius: 20,
            background: priorityColors[priority].background,
            color: priorityColors[priority].color,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {priority} Priority
        </span>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {onUpdateStatus && status !== "Resolved" && status !== "Rejected" && (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                onUpdateStatus(
                  report,
                  status === "Pending" ? "In Progress" : "Resolved"
                )
              }
              style={{
                padding: "8px 10px",
                border: 0,
                borderRadius: 7,
                background: "#166534",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {status === "Pending" ? "Start Work" : "Mark Resolved"}
            </button>
          )}

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(report)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 10px",
                border: "1px solid #cbd5e1",
                borderRadius: 7,
                background: "#ffffff",
                color: "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Eye size={14} />
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
