import { useState } from "react";
import { NavLink } from "react-router-dom";
import { UserRound,
  LayoutDashboard,
  Map,
  Brain,
  Route,
  TrendingUp,
  FileText,
  History,
  ChevronLeft,
  ChevronRight,
  Recycle,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "City Simulator", path: "/simulator", icon: Map },
  { label: "AI Waste Classifier", path: "/classifier", icon: Brain },
  { label: "Route Optimizer", path: "/routes", icon: Route },
  { label: "Overflow Prediction", path: "/predictions", icon: TrendingUp },
  { label: "Citizen Reports", path: "/reports", icon: FileText },
  { label: "Reports History", path: "/reports-history", icon: History },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onClose,
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isControlled = typeof onToggle === "function";
  const isCollapsed = isControlled ? Boolean(collapsed) : internalCollapsed;

  const toggleSidebar = () => {
    if (isControlled) {
      onToggle();
    } else {
      setInternalCollapsed((previous) => !previous);
    }
  };

  const closeMobileSidebar = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeMobileSidebar}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1090,
            width: "100%",
            height: "100%",
            border: 0,
            background: "rgba(15, 23, 42, 0.45)",
          }}
        />
      )}

      <aside
        className={`smartbin-sidebar ${
          isCollapsed ? "sidebar-collapsed" : ""
        } ${mobileOpen ? "sidebar-mobile-open" : ""}`}
        style={{
          position: mobileOpen ? "fixed" : "relative",
          top: 0,
          left: 0,
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          width: isCollapsed ? 78 : 250,
          minWidth: isCollapsed ? 78 : 250,
          height: "100vh",
          boxSizing: "border-box",
          background: "#0f172a",
          color: "#e2e8f0",
          transition: "width 180ms ease, min-width 180ms ease",
          overflowX: "hidden",
          overflowY: "auto",
          transform:
            mobileOpen || typeof window === "undefined"
              ? "translateX(0)"
              : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: 10,
            minHeight: 76,
            padding: isCollapsed ? "12px 10px" : "12px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: 12,
                background: "#166534",
                color: "#ffffff",
              }}
            >
              <Recycle size={23} />
            </span>

            {!isCollapsed && (
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: 19,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  SmartBin
                </strong>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  Smart Waste Management
                </span>
              </div>
            )}
          </div>

          {mobileOpen && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={closeMobileSidebar}
              style={iconButtonStyle}
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div
          style={{
            padding: isCollapsed ? "22px 8px 8px" : "22px 16px 8px",
            color: "#64748b",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "1.4px",
            textAlign: isCollapsed ? "center" : "left",
          }}
        >
          {isCollapsed ? "MENU" : "MAIN MENU"}
        </div>

        <nav
          aria-label="Main navigation"
          style={{
            display: "grid",
            gap: 5,
            padding: isCollapsed ? "4px 9px" : "4px 12px",
          }}
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                title={isCollapsed ? item.label : undefined}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                }
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  gap: 12,
                  minHeight: 44,
                  padding: isCollapsed ? "10px 8px" : "10px 12px",
                  borderRadius: 9,
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  background: isActive
                    ? "linear-gradient(90deg, #166534, #15803d)"
                    : "transparent",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: isActive ? 650 : 450,
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />

                {!isCollapsed && (
                  <span style={{ whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ flex: 1, minHeight: 25 }} />

        {!isCollapsed && (
          <div
            style={{
              margin: 12,
              padding: 14,
              borderRadius: 11,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "#86efac",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              Waste Management
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#94a3b8",
                fontSize: 11,
                lineHeight: 1.6,
              }}
            >
              Monitor bins, optimize collection routes, and manage reports.
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 12,
            borderTop: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={iconButtonStyle}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

const iconButtonStyle = {
  display: "grid",
  placeItems: "center",
  width: 34,
  height: 34,
  flexShrink: 0,
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 8,
  background: "rgba(255,255,255,0.05)",
  color: "#e2e8f0",
  cursor: "pointer",
};



