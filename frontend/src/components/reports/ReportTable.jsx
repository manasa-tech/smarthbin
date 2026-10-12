import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function ReportTable({
  reports = [],
  loading = false,
  onViewDetails,
  onUpdateStatus,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [newestFirst, setNewestFirst] = useState(true);

  const getStatus = (report) => {
    const value = String(report.status || "Pending").toLowerCase();

    if (value.includes("progress") || value.includes("processing")) {
      return "In Progress";
    }

    if (
      value.includes("resolved") ||
      value.includes("completed") ||
      value.includes("closed")
    ) {
      return "Resolved";
    }

    if (value.includes("reject")) return "Rejected";

    return "Pending";
  };

  const getPriority = (report) => {
    const value = String(
      report.priority || report.severity || "Medium"
    ).toLowerCase();

    if (value === "critical" || value === "urgent") return "Critical";
    if (value === "high") return "High";
    if (value === "low") return "Low";

    return "Medium";
  };

  const statusStyles = {
    Pending: { color: "#b45309", background: "#fef3c7" },
    "In Progress": { color: "#1d4ed8", background: "#dbeafe" },
    Resolved: { color: "#15803d", background: "#dcfce7" },
    Rejected: { color: "#b91c1c", background: "#fee2e2" },
  };

  const priorityStyles = {
    Critical: { color: "#b91c1c", background: "#fee2e2" },
    High: { color: "#c2410c", background: "#ffedd5" },
    Medium: { color: "#a16207", background: "#fef9c3" },
    Low: { color: "#15803d", background: "#dcfce7" },
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = reports.filter((report) => {
      const name =
        report.title ||
        report.subject ||
        report.report_type ||
        "Waste Report";

      const location =
        report.location || report.address || report.area || "";

      const id = report.id ?? report.report_id ?? "";

      const matchesSearch = [
        name,
        location,
        id,
        report.description,
        report.reporter_name,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" || getStatus(report) === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        getPriority(report) === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return result.sort((a, b) => {
      const dateA = new Date(
        a.created_at || a.createdAt || a.date || 0
      ).getTime();

      const dateB = new Date(
        b.created_at || b.createdAt || b.date || 0
      ).getTime();

      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  }, [reports, search, statusFilter, priorityFilter, newestFirst]);

  return (
    <section
      className="report-table"
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
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: 18 }}>
            Citizen Reports
          </h3>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 12 }}>
            Search and manage waste collection complaints
          </p>
        </div>

        <span style={{ color: "#64748b", fontSize: 12 }}>
          {filteredReports.length} reports
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
              top: 11,
              left: 11,
              color: "#94a3b8",
            }}
          />
          <input
            type="search"
            placeholder="Search reports or locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search reports"
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
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          style={selectStyle}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          aria-label="Filter by priority"
          style={selectStyle}
        >
          <option value="All">All priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          type="button"
          onClick={() => setNewestFirst((previous) => !previous)}
          style={{
            display: "inline-flex",
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
          <ArrowUpDown size={15} />
          {newestFirst ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {loading ? (
        <div style={emptyStyle}>Loading reports...</div>
      ) : filteredReports.length === 0 ? (
        <div style={emptyStyle}>
          <AlertTriangle size={24} />
          <p style={{ marginBottom: 0 }}>No matching reports found.</p>
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 760,
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc", color: "#64748b" }}>
                {[
                  "Report",
                  "Location",
                  "Date",
                  "Priority",
                  "Status",
                  "Actions",
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
              {filteredReports.map((report, index) => {
                const id = report.id ?? report.report_id ?? index;
                const title =
                  report.title ||
                  report.subject ||
                  report.report_type ||
                  "Waste Report";

                const status = getStatus(report);
                const priority = getPriority(report);
                const StatusIcon =
                  status === "Resolved"
                    ? CheckCircle2
                    : status === "In Progress"
                    ? Clock
                    : AlertTriangle;

                return (
                  <tr key={id}>
                    <td style={cellStyle}>
                      <strong style={{ color: "#0f172a" }}>{title}</strong>
                      <div
                        style={{
                          marginTop: 4,
                          color: "#94a3b8",
                          fontSize: 11,
                        }}
                      >
                        #{id}
                      </div>
                    </td>

                    <td style={{ ...cellStyle, color: "#64748b" }}>
                      {report.location ||
                        report.address ||
                        report.area ||
                        "—"}
                    </td>

                    <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                      {formatDate(
                        report.created_at ||
                          report.createdAt ||
                          report.date
                      )}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          ...badgeStyle,
                          color: priorityStyles[priority].color,
                          background: priorityStyles[priority].background,
                        }}
                      >
                        {priority}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          ...badgeStyle,
                          color: statusStyles[status].color,
                          background: statusStyles[status].background,
                        }}
                      >
                        <StatusIcon size={12} />
                        {status}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 7,
                        }}
                      >
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(report)}
                            style={actionButtonStyle}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        )}

                        {onUpdateStatus &&
                          status !== "Resolved" &&
                          status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateStatus(
                                  report,
                                  status === "Pending"
                                    ? "In Progress"
                                    : "Resolved"
                                )
                              }
                              style={{
                                ...actionButtonStyle,
                                color: "#166534",
                              }}
                            >
                              {status === "Pending"
                                ? "Start"
                                : "Resolve"}
                            </button>
                          )}
                      </div>
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

const selectStyle = {
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#ffffff",
  color: "#334155",
};

const cellStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  verticalAlign: "middle",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "5px 9px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const actionButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 9px",
  border: "1px solid #cbd5e1",
  borderRadius: 7,
  background: "#ffffff",
  color: "#334155",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const emptyStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: 35,
  borderRadius: 10,
  background: "#f8fafc",
  color: "#64748b",
};
