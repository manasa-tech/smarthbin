import {
  MapPin,
  Clock,
  Route,
  Trash2,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function RouteStats({
  stats = {},
  loading = false,
}) {
  const totalBins = Number(
    stats.totalBins ?? stats.total_bins ?? stats.bin_count ?? 0
  );

  const completedBins = Number(
    stats.completedBins ?? stats.completed_bins ?? 0
  );

  const distance = Number(
    stats.distanceKm ?? stats.distance_km ?? stats.total_distance ?? 0
  );

  const duration = Number(
    stats.durationMinutes ??
      stats.duration_minutes ??
      stats.estimated_time ??
      0
  );

  const pendingBins = Math.max(0, totalBins - completedBins);

  const progress =
    totalBins > 0
      ? Math.min(100, Math.round((completedBins / totalBins) * 100))
      : 0;

  const formatDuration = (minutes) => {
    if (minutes <= 0) return "—";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) return `${remainingMinutes} min`;

    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const cards = [
    {
      label: "Total Distance",
      value: `${distance.toFixed(1)} km`,
      icon: Route,
      color: "#2563eb",
      description: "Planned route distance",
    },
    {
      label: "Estimated Time",
      value: formatDuration(duration),
      icon: Clock,
      color: "#7c3aed",
      description: "Estimated collection time",
    },
    {
      label: "Bins to Collect",
      value: pendingBins,
      icon: Trash2,
      color: "#ea580c",
      description: `${completedBins} completed`,
    },
    {
      label: "Route Progress",
      value: `${progress}%`,
      icon: TrendingUp,
      color: "#16a34a",
      description: `${completedBins} of ${totalBins} bins completed`,
    },
  ];

  return (
    <section className="route-stats">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              color: "#0f172a",
            }}
          >
            Route Overview
          </h3>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Collection route performance
          </p>
        </div>

        {loading && (
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Updating route stats...
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              style={{
                minWidth: 0,
                padding: 17,
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                background: "#ffffff",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <span style={{ color: "#64748b", fontSize: 13 }}>
                  {card.label}
                </span>

                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    color: card.color,
                    background: `${card.color}15`,
                  }}
                >
                  <Icon size={19} />
                </span>
              </div>

              <div
                style={{
                  color: "#0f172a",
                  fontSize: 27,
                  fontWeight: 750,
                  lineHeight: 1.2,
                }}
              >
                {card.value}
              </div>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                {card.description}
              </p>

              {card.label === "Route Progress" && (
                <div
                  style={{
                    height: 6,
                    marginTop: 13,
                    overflow: "hidden",
                    borderRadius: 8,
                    background: "#e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      borderRadius: 8,
                      background: "#16a34a",
                      transition: "width 200ms ease",
                    }}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 14,
          padding: 12,
          borderRadius: 9,
          background: "#f8fafc",
          color: "#475569",
          fontSize: 12,
        }}
      >
        {progress === 100 && totalBins > 0 ? (
          <CheckCircle2 size={17} color="#16a34a" />
        ) : (
          <MapPin size={17} color="#2563eb" />
        )}

        <span>
          {totalBins === 0
            ? "Generate a pickup route to view collection statistics."
            : progress === 100
            ? "All planned pickups are completed."
            : `${pendingBins} pickup${pendingBins === 1 ? "" : "s"} remaining on this route.`}
        </span>
      </div>
    </section>
  );
}
