import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import "../../style/statCard.css";

export default function StatCard({
  title = "Total Bins",
  value = 0,
  subtitle = "",
  icon: Icon,
  color = "green",
  trend,
  trendLabel = "vs. last period",
  loading = false,
  onClick,
}) {
  const trendValue = Number(trend);
  const hasTrend = trend !== undefined && trend !== null && trend !== "";
  const trendDirection = !hasTrend || !Number.isFinite(trendValue)
    ? "neutral"
    : trendValue > 0
      ? "up"
      : trendValue < 0
        ? "down"
        : "neutral";

  const TrendIcon =
    trendDirection === "up"
      ? ArrowUpRight
      : trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <article
      className={`stat-card stat-card-${color} ${onClick ? "stat-card-clickable" : ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>

        {Icon && (
          <span className="stat-card-icon">
            <Icon size={21} />
          </span>
        )}
      </div>

      {loading ? (
        <div className="stat-card-loading">Loading...</div>
      ) : (
        <>
          <div className="stat-card-value">{value}</div>

          {subtitle && (
            <p className="stat-card-subtitle">{subtitle}</p>
          )}

          {hasTrend && Number.isFinite(trendValue) && (
            <div className={`stat-card-trend stat-card-trend-${trendDirection}`}>
              <TrendIcon size={15} />
              <span>{Math.abs(trendValue)}%</span>
              {trendLabel && <span className="stat-card-trend-label">{trendLabel}</span>}
            </div>
          )}
        </>
      )}
    </article>
  );
}
