import { useState } from "react";
import {
  FileText,
  MapPin,
  Send,
  AlertTriangle,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

const INITIAL_FORM = {
  title: "",
  report_type: "Overflowing Bin",
  location: "",
  description: "",
  priority: "Medium",
  reporter_name: "",
  reporter_contact: "",
};

export default function ReportForm({
  onSubmit,
  loading = false,
  onCancel,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
    setSuccess(false);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Please enter a report title.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Please enter the waste location.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Please describe the problem.";
    } else if (form.description.trim().length < 10) {
      nextErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (
      form.reporter_contact.trim() &&
      !/^[+0-9()\-\s]{7,20}$/.test(form.reporter_contact.trim())
    ) {
      nextErrors.reporter_contact =
        "Enter a valid contact number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !validate()) return;

    if (typeof onSubmit !== "function") {
      setSubmitError(
        "Submission handler is not connected. Please connect the form to your report service."
      );
      return;
    }

    setSubmitError("");
    setSuccess(false);

    const payload = {
      title: form.title.trim(),
      report_type: form.report_type,
      location: form.location.trim(),
      description: form.description.trim(),
      priority: form.priority,
      reporter_name: form.reporter_name.trim(),
      reporter_contact: form.reporter_contact.trim(),
    };

    try {
      await onSubmit(payload);
      setForm(INITIAL_FORM);
      setErrors({});
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error?.response?.data?.detail ||
          error?.message ||
          "Unable to submit the report. Please try again."
      );
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "#ffffff",
    color: "#0f172a",
    fontSize: 14,
    outlineColor: "#16a34a",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 7,
    color: "#334155",
    fontSize: 13,
    fontWeight: 600,
  };

  const renderError = (field) =>
    errors[field] ? (
      <p
        role="alert"
        style={{ margin: "5px 0 0", color: "#dc2626", fontSize: 12 }}
      >
        {errors[field]}
      </p>
    ) : null;

  return (
    <section
      className="report-form"
      style={{
        width: "100%",
        maxWidth: 760,
        boxSizing: "border-box",
        padding: 22,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 11,
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          <FileText size={22} />
        </div>

        <div>
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: 20 }}>
            Submit a Waste Report
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Report overflowing bins, missed pickups, or other waste issues.
          </p>
        </div>
      </div>

      {success && (
        <div
          role="status"
          style={{
            display: "flex",
            gap: 9,
            alignItems: "center",
            marginBottom: 18,
            padding: 12,
            borderRadius: 8,
            background: "#dcfce7",
            color: "#166534",
            fontSize: 13,
          }}
        >
          <CheckCircle2 size={18} />
          Report submitted successfully.
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          style={{
            display: "flex",
            gap: 9,
            alignItems: "flex-start",
            marginBottom: 18,
            padding: 12,
            borderRadius: 8,
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: 13,
            overflowWrap: "anywhere",
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          <div>
            <label htmlFor="report-title" style={labelStyle}>
              Report Title *
            </label>
            <input
              id="report-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Overflowing bin near park"
              maxLength={120}
              style={{
                ...inputStyle,
                borderColor: errors.title ? "#dc2626" : "#cbd5e1",
              }}
              aria-invalid={Boolean(errors.title)}
              required
            />
            {renderError("title")}
          </div>

          <div>
            <label htmlFor="report-type" style={labelStyle}>
              Issue Category *
            </label>
            <select
              id="report-type"
              name="report_type"
              value={form.report_type}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option>Overflowing Bin</option>
              <option>Missed Collection</option>
              <option>Illegal Dumping</option>
              <option>Damaged Bin</option>
              <option>Waste Segregation</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="report-location" style={labelStyle}>
              <MapPin
                size={14}
                style={{ verticalAlign: "middle", marginRight: 5 }}
              />
              Location *
            </label>
            <input
              id="report-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Area, street, or landmark"
              maxLength={250}
              style={{
                ...inputStyle,
                borderColor: errors.location ? "#dc2626" : "#cbd5e1",
              }}
              aria-invalid={Boolean(errors.location)}
              required
            />
            {renderError("location")}
          </div>

          <div>
            <label htmlFor="report-priority" style={labelStyle}>
              Priority
            </label>
            <select
              id="report-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="reporter-name" style={labelStyle}>
              Your Name (Optional)
            </label>
            <input
              id="reporter-name"
              name="reporter_name"
              value={form.reporter_name}
              onChange={handleChange}
              placeholder="Enter your name"
              maxLength={100}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="reporter-contact" style={labelStyle}>
              Contact Number (Optional)
            </label>
            <input
              id="reporter-contact"
              name="reporter_contact"
              type="tel"
              value={form.reporter_contact}
              onChange={handleChange}
              placeholder="Enter phone number"
              maxLength={20}
              style={{
                ...inputStyle,
                borderColor: errors.reporter_contact
                  ? "#dc2626"
                  : "#cbd5e1",
              }}
              aria-invalid={Boolean(errors.reporter_contact)}
            />
            {renderError("reporter_contact")}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <label htmlFor="report-description" style={labelStyle}>
            Description *
          </label>
          <textarea
            id="report-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain the issue and any details that can help the collection team..."
            rows={5}
            maxLength={1500}
            style={{
              ...inputStyle,
              resize: "vertical",
              borderColor: errors.description ? "#dc2626" : "#cbd5e1",
            }}
            aria-invalid={Boolean(errors.description)}
            required
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {renderError("description")}
            <span
              style={{
                marginLeft: "auto",
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              {form.description.length}/1500
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 22,
          }}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "11px 16px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                background: "#ffffff",
                color: "#334155",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 18px",
              border: 0,
              borderRadius: 8,
              background: "#166534",
              color: "#ffffff",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <LoaderCircle size={17} />
            ) : (
              <Send size={16} />
            )}
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </section>
  );
}
