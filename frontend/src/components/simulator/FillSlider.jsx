import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function FillSlider({
  bin,
  value,
  onChange,
  onSave,
  disabled = false,
}) {
  const initialValue = Number(
    bin?.fill_level ?? bin?.fill_percentage ?? 0
  );

  const [fillLevel, setFillLevel] = useState(
    value ?? initialValue
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFillLevel(value ?? initialValue);
  }, [value, initialValue]);

  const status =
    fillLevel >= 90
      ? "Critical"
      : fillLevel >= 80
      ? "High"
      : fillLevel >= 50
      ? "Medium"
      : "Normal";

  const handleChange = (event) => {
    const nextValue = Number(event.target.value);
    setFillLevel(nextValue);
    setError("");

    if (typeof onChange === "function") {
      onChange(nextValue, bin);
    }
  };

  const handleSave = async () => {
    if (typeof onSave !== "function") {
      setError("Provide an onSave handler to save this fill level.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(bin, fillLevel);
    } catch (err) {
      setError(err.message || "Unable to save the fill level.");
    } finally {
      setSaving(false);
    }
  };

  const color =
    fillLevel >= 90
      ? "#dc2626"
      : fillLevel >= 80
      ? "#f97316"
      : fillLevel >= 50
      ? "#eab308"
      : "#16a34a";

  return (
    <div
      className="fill-slider"
      style={{
        padding: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            {bin?.name ||
              bin?.bin_code ||
              `Smart Bin ${bin?.id ?? bin?.bin_id ?? ""}`}
          </h3>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 13 }}>
            {bin?.location || bin?.area || "Location not specified"}
          </p>
        </div>

        <span
          style={{
            color,
            background: `${color}18`,
            padding: "5px 9px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {status}
        </span>
      </div>

      <label
        htmlFor={`fill-level-${bin?.id ?? bin?.bin_id ?? "new"}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        <span>
          <SlidersHorizontal
            size={16}
            style={{ verticalAlign: "middle", marginRight: 6 }}
          />
          Fill level
        </span>
        <span>{fillLevel}%</span>
      </label>

      <input
        id={`fill-level-${bin?.id ?? bin?.bin_id ?? "new"}`}
        type="range"
        min="0"
        max="100"
        step="5"
        value={Math.min(100, Math.max(0, fillLevel))}
        onChange={handleChange}
        disabled={disabled || saving}
        style={{
          width: "100%",
          accentColor: color,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#64748b",
        }}
      >
        <span>0% — Empty</span>
        <span>100% — Full</span>
      </div>

      <div
        style={{
          height: 8,
          marginTop: 12,
          borderRadius: 8,
          overflow: "hidden",
          background: "#e2e8f0",
        }}
      >
        <div
          style={{
            width: `${fillLevel}%`,
            height: "100%",
            background: color,
            transition: "width 150ms ease",
          }}
        />
      </div>

      {error && (
        <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>
          {error}
        </p>
      )}

      {onSave && (
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || saving}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "10px 14px",
            border: 0,
            borderRadius: 8,
            background: "#166534",
            color: "#ffffff",
            fontWeight: 600,
            cursor: saving ? "wait" : "pointer",
            opacity: disabled || saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Fill Level"}
        </button>
      )}
    </div>
  );
}
