import { useState } from "react";
import {
  Trash2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
} from "lucide-react";

export default function BinDetails({ bin, onClose, onSave }) {
  const [fillLevel, setFillLevel] = useState(
    Number(bin?.fill_level ?? bin?.fill_percentage ?? 0)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!bin) return null;

  const status =
    fillLevel >= 90
      ? "Critical"
      : fillLevel >= 80
      ? "High"
      : fillLevel >= 50
      ? "Medium"
      : "Normal";

  const handleSave = async () => {
    if (typeof onSave !== "function") {
      setError("No save handler was provided by the parent component.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        ...bin,
        fill_level: Number(fillLevel),
      });
    } catch (err) {
      setError(err.message || "Unable to save the fill level.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bin-details-title"
        style={{
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Trash2 size={26} color="#15803d" />
            <div>
              <h2 id="bin-details-title" style={{ margin: 0 }}>
                {bin.name ||
                  bin.bin_code ||
                  `Smart Bin ${bin.id ?? bin.bin_id ?? ""}`}
              </h2>
              <p style={{ margin: "5px 0 0", color: "#64748b" }}>
                Bin details and simulator controls
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close bin details"
            style={{
              border: 0,
              background: "#f1f5f9",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </header>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: "#f8fafc",
          }}
        >
          <p style={{ margin: "0 0 6px", color: "#64748b" }}>
            <MapPin size={15} style={{ verticalAlign: "middle" }} /> Location
          </p>
          <strong>{bin.location || bin.area || "Not specified"}</strong>

          <p style={{ margin: "18px 0 6px", color: "#64748b" }}>
            Current status
          </p>
          <strong
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: fillLevel >= 80 ? "#c2410c" : "#15803d",
            }}
          >
            {fillLevel >= 80 ? (
              <AlertTriangle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            {status}
          </strong>
        </div>

        <div style={{ marginTop: 24 }}>
          <label
            htmlFor="bin-fill-level"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Fill Level
            <span>{fillLevel}%</span>
          </label>

          <input
            id="bin-fill-level"
            type="range"
            min="0"
            max="100"
            step="5"
            value={fillLevel}
            onChange={(event) => setFillLevel(Number(event.target.value))}
            style={{ width: "100%", accentColor: "#16a34a" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#64748b",
              fontSize: 12,
            }}
          >
            <span>Empty · 0%</span>
            <span>Full · 100%</span>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: "#dc2626", marginTop: 16 }}>
            {error}
          </p>
        )}

        <footer
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              border: 0,
              borderRadius: 8,
              background: "#15803d",
              color: "#ffffff",
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>
    </div>
  );
}
