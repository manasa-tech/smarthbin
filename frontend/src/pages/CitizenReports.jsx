import { useEffect, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Send,
  RefreshCw,
  FileText,
} from "lucide-react";
import { createReport, fetchReports } from "../services/reportService";
import "../style/report.css";

export default function CitizenReports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "Overflowing bin",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchReports();
      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch {
      setError("Unable to load reports. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.location.trim()) {
      setError("Please enter a report title and location.");
      return;
    }

    setSubmitting(true);

    try {
      await createReport({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
      });

      setForm({
        title: "",
        description: "",
        location: "",
        category: "Overflowing bin",
      });

      setSuccess("Your citizen report was submitted successfully.");
      await loadReports();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit report. Check your backend API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h1>Citizen Reports</h1>
          <p>Report waste problems in your neighbourhood.</p>
        </div>

        <button
          type="button"
          className="reports-refresh-btn"
          onClick={loadReports}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="reports-message reports-error">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="reports-message reports-success">
          {success}
        </div>
      )}

      <div className="reports-content-grid">
        <section className="reports-panel">
          <h2>
            <Send size={20} />
            Submit a Report
          </h2>

          <form className="reports-form" onSubmit={handleSubmit}>
            <label htmlFor="report-title">Report title</label>
            <input
              id="report-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Garbage bin overflowing"
              required
            />

            <label htmlFor="report-category">Problem category</label>
            <select
              id="report-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Overflowing bin</option>
              <option>Illegal dumping</option>
              <option>Missed collection</option>
              <option>Damaged bin</option>
              <option>Other</option>
            </select>

            <label htmlFor="report-location">Location</label>
            <input
              id="report-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter street or area"
              required
            />

            <label htmlFor="report-description">Description</label>
            <textarea
              id="report-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the waste problem..."
              rows={4}
            />

            <button
              type="submit"
              className="reports-submit-btn"
              disabled={submitting}
            >
              <Send size={17} />
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </section>

        <section className="reports-panel">
          <h2>
            <FileText size={20} />
            Recent Reports
          </h2>

          {loading ? (
            <p className="reports-empty">Loading reports...</p>
          ) : reports.length === 0 ? (
            <div className="reports-empty">
              <MapPin size={34} />
              <p>No citizen reports found yet.</p>
            </div>
          ) : (
            <div className="reports-list">
              {reports.map((report, index) => (
                <article
                  className="reports-item"
                  key={report.id ?? report.report_id ?? index}
                >
                  <div className="reports-item-top">
                    <strong>{report.title || report.category || "Waste report"}</strong>
                    <span className="reports-status">
                      {report.status || "Pending"}
                    </span>
                  </div>

                  <p>{report.description || "No description provided."}</p>

                  <div className="reports-item-location">
                    <MapPin size={15} />
                    {report.location || "Location not specified"}
                  </div>

                  {report.created_at && (
                    <small>
                      {new Date(report.created_at).toLocaleString()}
                    </small>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
