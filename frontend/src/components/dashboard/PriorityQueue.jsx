import { AlertTriangle, Clock, MapPin, ArrowUpRight } from "lucide-react";
import "../../style/priorityQueue.css";

export default function PriorityQueue({
  bins = [],
  loading = false,
  onBinClick,
}) {
  const getFill = (bin) =>
    Number(bin.fill_level ?? bin.fill_percentage ?? 0);

  const getPriority = (fill) => {
    if (fill >= 90) return { label: "Critical", className: "critical" };
    if (fill >= 75) return { label: "High", className: "high" };
    if (fill >= 50) return { label: "Medium", className: "medium" };
    return { label: "Normal", className: "normal" };
  };

  const priorityBins = [...bins]
    .filter((bin) => getFill(bin) >= 50)
    .sort((a, b) => getFill(b) - getFill(a))
    .slice(0, 6);

  return (
    <section className="priority-queue">
      <div className="priority-queue-header">
        <div>
          <h3>
            <AlertTriangle size={19} />
            Priority Queue
          </h3>
          <p>Bins that need attention first</p>
        </div>
        <span className="priority-queue-count">
          {priorityBins.length} bins
        </span>
      </div>

      {loading ? (
        <p className="priority-queue-message">Loading priority bins...</p>
      ) : priorityBins.length === 0 ? (
        <p className="priority-queue-message">
          All bins are below 50% capacity.
        </p>
      ) : (
        <div className="priority-queue-list">
          {priorityBins.map((bin, index) => {
            const fill = getFill(bin);
            const priority = getPriority(fill);

            return (
              <button
                type="button"
                className="priority-queue-item"
                key={bin.id ?? bin.bin_id ?? index}
                onClick={() => onBinClick?.(bin)}
              >
                <span className={`priority-queue-rank ${priority.className}`}>
                  {index + 1}
                </span>

                <span className="priority-queue-info">
                  <strong>
                    {bin.name ?? bin.bin_name ?? `Bin ${bin.id ?? bin.bin_id ?? index + 1}`}
                  </strong>
                  <span className="priority-queue-location">
                    <MapPin size={13} />
                    {bin.location ?? bin.area ?? "Location unavailable"}
                  </span>
                  <span className="priority-queue-progress">
                    <span
                      className={`priority-queue-progress-fill ${priority.className}`}
                      style={{ width: `${Math.min(100, Math.max(0, fill))}%` }}
                    />
                  </span>
                </span>

                <span className="priority-queue-right">
                  <strong>{fill}%</strong>
                  <span className={`priority-queue-status ${priority.className}`}>
                    {priority.label}
                  </span>
                  <ArrowUpRight size={15} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="priority-queue-footer">
        <Clock size={14} />
        <span>Sorted by highest fill level</span>
      </div>
    </section>
  );
}
