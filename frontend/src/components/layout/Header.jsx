import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Leaf,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/simulator": "City Simulator",
  "/classifier": "AI Waste Classifier",
  "/routes": "Route Optimizer",
  "/predictions": "Overflow Prediction",
  "/reports": "Citizen Reports",
  "/reports-history": "Reports History",
};

export default function Header({
  onMenuClick,
  onSearch,
  onNotificationClick,
  user = { name: "Admin", role: "Administrator" },
}) {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const title =
    pageTitles[location.pathname] ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
    "SmartBin";

  const handleSearch = (event) => {
    event.preventDefault();

    if (typeof onSearch === "function") {
      onSearch(searchValue.trim());
    }
  };

  return (
    <header
      className="app-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        minHeight: 76,
        padding: "12px 24px",
        boxSizing: "border-box",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 0,
        }}
      >
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
          style={iconButtonStyle}
        >
          <Menu size={21} />
        </button>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Leaf size={17} color="#16a34a" />
            <h1
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: 20,
                fontWeight: 750,
                overflowWrap: "anywhere",
              }}
            >
              {title}
            </h1>
          </div>

          <p
            style={{
              margin: "4px 0 0",
              color: "#64748b",
              fontSize: 12,
            }}
          >
            SmartBin Waste Management
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "min(280px, 100%)",
            padding: "9px 11px",
            border: "1px solid #e2e8f0",
            borderRadius: 9,
            background: "#f8fafc",
          }}
        >
          <Search size={17} color="#94a3b8" />

          <input
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            aria-label="Search SmartBin"
            style={{
              width: "100%",
              minWidth: 0,
              border: 0,
              outline: "none",
              background: "transparent",
              color: "#0f172a",
              fontSize: 13,
            }}
          />

          {searchValue && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchValue("")}
              style={{
                border: 0,
                padding: 0,
                background: "transparent",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => {
              setShowNotifications((previous) => !previous);
              setShowProfile(false);
              if (typeof onNotificationClick === "function") {
                onNotificationClick();
              }
            }}
            style={iconButtonStyle}
          >
            <Bell size={19} />
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#ef4444",
                border: "1px solid #ffffff",
              }}
            />
          </button>

          {showNotifications && (
            <div style={popoverStyle}>
              <strong style={{ color: "#0f172a", fontSize: 14 }}>
                Notifications
              </strong>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#64748b",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                Connect your alerts service here to display new reports and
                high-fill bin notifications.
              </p>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                style={smallButtonStyle}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setShowProfile((previous) => !previous);
              setShowNotifications(false);
            }}
            aria-label="Open user profile menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: 5,
              border: 0,
              borderRadius: 9,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 37,
                height: 37,
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#166534",
                fontSize: 14,
                fontWeight: 750,
              }}
            >
              {(user.name || "A").trim().charAt(0).toUpperCase()}
            </span>

            <span
              className="header-user-info"
              style={{ textAlign: "left" }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#0f172a",
                  fontSize: 12,
                }}
              >
                {user.name || "Admin"}
              </strong>
              <span style={{ color: "#64748b", fontSize: 11 }}>
                {user.role || "Administrator"}
              </span>
            </span>

            <ChevronDown size={15} color="#64748b" />
          </button>

          {showProfile && (
            <div style={popoverStyle}>
              <strong style={{ color: "#0f172a", fontSize: 13 }}>
                {user.name || "Admin"}
              </strong>
              <p
                style={{
                  margin: "5px 0 12px",
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                {user.role || "Administrator"}
              </p>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                style={smallButtonStyle}
              >
                Close menu
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const iconButtonStyle = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: 39,
  height: 39,
  flexShrink: 0,
  border: "1px solid #e2e8f0",
  borderRadius: 9,
  background: "#ffffff",
  color: "#475569",
  cursor: "pointer",
};

const popoverStyle = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  zIndex: 1100,
  width: 245,
  boxSizing: "border-box",
  padding: 16,
  border: "1px solid #e2e8f0",
  borderRadius: 11,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
};

const smallButtonStyle = {
  padding: "7px 10px",
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  background: "#f8fafc",
  color: "#334155",
  fontSize: 12,
  cursor: "pointer",
};
