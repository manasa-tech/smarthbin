import { useEffect, useState } from "react";
import { FileText, RefreshCw, Search, MapPin, Calendar } from "lucide-react";
import { fetchReports } from "../services/reportService";
import "../style/report.css";

export default function ReportsHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchReports();
      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load report history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const text = [
      report.title,
      report.description,
      report.location,
      report.category,
      report.id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const reportStatus = String(report.status || "Pending").toLowerCase();
    const matchesStatus =
      status === "All" || reportStatus === status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatDate = (value) => {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleString();
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h1>Reports History</h1>
          <p>Search and review submitted citizen waste reports.</p>
        </div>

        <button
          type="button"
          className="reports-refresh-btn"
          onClick={loadReports}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="reports-panel">
        <div className="reports-history-toolbar">
          <div className="reports-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search reports..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by report status"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <p>Total reports: {reports.length}</p>

        {error && <p className="reports-error">{error}</p>}

        {loading ? (
          <p className="reports-empty">Loading reports...</p>
        ) : filteredReports.length === 0 ? (
          <div className="reports-empty">
            <FileText size={36} />
            <p>No matching reports found.</p>
          </div>
        ) : (
          <div className="reports-list">
            {filteredReports.map((report, index) => (
              <article
                className="reports-item"
                key={report.id ?? report.report_id ?? index}
              >
                <div className="reports-item-top">
                  <strong>
                    {report.title || report.category || "Waste Report"}
                  </strong>
                  <span className="reports-status">
                    {report.status || "Pending"}
                  </span>
                </div>

                <p>{report.description || "No description provided."}</p>

                <div className="reports-item-location">
                  <MapPin size={15} />
                  {report.location || "Location unavailable"}
                </div>

                <div className="reports-history-date">
                  <Calendar size={15} />
                  {formatDate(report.created_at || report.createdAt)}
                </div>

                <small>
                  Report ID: {report.id ?? report.report_id ?? "N/A"}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
