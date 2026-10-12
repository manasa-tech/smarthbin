import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageContainer({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs = [],
  className = "",
  maxWidth = "100%",
  padding = "24px",
}) {
  return (
    <main
      className={`page-container ${className}`.trim()}
      style={{
        width: "100%",
        maxWidth,
        minWidth: 0,
        boxSizing: "border-box",
        margin: "0 auto",
        padding,
        color: "#0f172a",
      }}
    >
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 7,
            marginBottom: 18,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          <Link
            to="/"
            aria-label="Home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#64748b",
              textDecoration: "none",
            }}
          >
            <Home size={14} />
          </Link>

          {breadcrumbs.map((crumb, index) => {
            const label =
              typeof crumb === "string" ? crumb : crumb.label;

            const to =
              typeof crumb === "object" ? crumb.to : undefined;

            const isLast = index === breadcrumbs.length - 1;

            return (
              <span
                key={`${label}-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <ChevronRight size={13} />

                {to && !isLast ? (
                  <Link
                    to={to}
                    style={{
                      color: "#64748b",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    style={{
                      color: isLast ? "#166534" : "#64748b",
                      fontWeight: isLast ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {(title || subtitle || actions) && (
        <header
          className="page-container-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 220px" }}>
            {title && (
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(22px, 3vw, 30px)",
                  lineHeight: 1.3,
                  fontWeight: 750,
                  letterSpacing: "-0.5px",
                  overflowWrap: "anywhere",
                }}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                style={{
                  margin: "8px 0 0",
                  maxWidth: 720,
                  color: "#64748b",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div
              className="page-container-actions"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {actions}
            </div>
          )}
        </header>
      )}

      <div className="page-container-content" style={{ minWidth: 0 }}>
        {children}
      </div>
    </main>
  );
}
