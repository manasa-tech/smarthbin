import { useMemo } from "react";
import { ArrowDown, ArrowUp, MapPin, Trash2, GripVertical } from "lucide-react";

export default function PickupSequence({
  bins = [],
  sequence,
  onSequenceChange,
  onRemove,
  onOptimize,
  loading = false,
}) {
  const pickupBins = useMemo(() => {
    if (Array.isArray(sequence)) {
      return sequence
        .map((item) => {
          if (typeof item === "object") return item;
          return bins.find(
            (bin) =>
              String(bin.id ?? bin.bin_id) === String(item)
          );
        })
        .filter(Boolean);
    }

    return [...bins].sort(
      (a, b) =>
        Number(b.fill_level ?? b.fill_percentage ?? 0) -
        Number(a.fill_level ?? a.fill_percentage ?? 0)
    );
  }, [bins, sequence]);

  const moveBin = (index, direction) => {
    const next = [...pickupBins];
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= next.length ||
      typeof onSequenceChange !== "function"
    ) {
      return;
    }

    [next[index], next[targetIndex]] = [
      next[targetIndex],
      next[index],
    ];

    onSequenceChange(next);
  };

  const getFill = (bin) =>
    Math.max(
      0,
      Math.min(
        100,
        Number(bin.fill_level ?? bin.fill_percentage ?? 0)
      )
    );

  const getStatus = (fill) => {
    if (fill >= 90) return "Critical";
    if (fill >= 80) return "High";
    if (fill >= 50) return "Medium";
    return "Normal";
  };

  const statusColor = (fill) => {
    if (fill >= 90) return "#dc2626";
    if (fill >= 80) return "#ea580c";
    if (fill >= 50) return "#ca8a04";
    return "#16a34a";
  };

  return (
    <section
      className="pickup-sequence"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 18,
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
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>
            Pickup Sequence
          </h3>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 13 }}>
            {pickupBins.length} bins in the current pickup order
          </p>
        </div>

        {onOptimize && (
          <button
            type="button"
            onClick={onOptimize}
            disabled={loading || pickupBins.length === 0}
            style={{
              border: 0,
              borderRadius: 8,
              padding: "10px 14px",
              background: "#166534",
              color: "#ffffff",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Optimizing..." : "Optimize Route"}
          </button>
        )}
      </div>

      {pickupBins.length === 0 ? (
        <div
          style={{
            padding: 28,
            textAlign: "center",
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: 10,
          }}
        >
          <MapPin size={28} style={{ marginBottom: 8 }} />
          <p style={{ margin: 0 }}>No pickup bins available.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {pickupBins.map((bin, index) => {
            const fill = getFill(bin);
            const id = bin.id ?? bin.bin_id ?? index;
            const color = statusColor(fill);

            return (
              <div
                key={id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "34px minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 12,
                  padding: 13,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 9,
                    background: "#dcfce7",
                    color: "#166534",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <GripVertical size={15} color="#94a3b8" />
                    <strong style={{ color: "#0f172a" }}>
                      {bin.name || bin.bin_code || `Bin ${id}`}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 5,
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    <MapPin size={13} />
                    <span>
                      {bin.location || bin.area || "Location unavailable"}
                    </span>
                  </div>

                  <div
                    style={{
                      height: 5,
                      background: "#e2e8f0",
                      borderRadius: 5,
                      marginTop: 9,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${fill}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <strong style={{ color, fontSize: 14 }}>
                    {fill}%
                  </strong>

                  <span
                    style={{
                      color,
                      background: `${color}18`,
                      borderRadius: 20,
                      padding: "3px 7px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {getStatus(fill)}
                  </span>

                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      aria-label={`Move ${bin.name || `bin ${id}`} up`}
                      title="Move up"
                      onClick={() => moveBin(index, -1)}
                      disabled={
                        index === 0 ||
                        typeof onSequenceChange !== "function"
                      }
                      style={iconButtonStyle}
                    >
                      <ArrowUp size={15} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Move ${bin.name || `bin ${id}`} down`}
                      title="Move down"
                      onClick={() => moveBin(index, 1)}
                      disabled={
                        index === pickupBins.length - 1 ||
                        typeof onSequenceChange !== "function"
                      }
                      style={iconButtonStyle}
                    >
                      <ArrowDown size={15} />
                    </button>

                    {onRemove && (
                      <button
                        type="button"
                        aria-label={`Remove ${bin.name || `bin ${id}`}`}
                        title="Remove from route"
                        onClick={() => onRemove(bin)}
                        style={{
                          ...iconButtonStyle,
                          color: "#dc2626",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

const iconButtonStyle = {
  display: "grid",
  placeItems: "center",
  width: 29,
  height: 29,
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
};
