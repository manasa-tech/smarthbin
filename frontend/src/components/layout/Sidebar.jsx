
import {
  BarChart3,
  Bell,
  Bot,
  ClipboardList,
  LayoutDashboard,
  Map,
  Route,
  Settings,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/simulator",
    label: "City Simulator",
    icon: Map,
  },
  {
    to: "/classifier",
    label: "AI Classifier",
    icon: Bot,
  },
  {
    to: "/route",
    label: "Route Optimizer",
    icon: Route,
  },
  {
    to: "/prediction",
    label: "Overflow Prediction",
    icon: BarChart3,
  },
  {
    to: "/reports",
    label: "Citizen Reports",
    icon: TriangleAlert,
  },
  {
    to: "/history",
    label: "Reports History",
    icon: ClipboardList,
  },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          mobileOpen
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Trash2 size={23} />
          </div>

          <div>
            <strong>SmartBin</strong>
            <span>AI Waste Intelligence</span>
          </div>

          <button
            type="button"
            className="icon-button mobile-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation label */}
        <div className="sidebar-label">
          WORKSPACE
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "nav-item nav-item-active"
                  : "nav-item"
              }
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={1.9} />

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-info">
            <div className="info-icon">
              <Bell size={17} />
            </div>

            <div>
              <strong>Simulation Mode</strong>
              <span>Virtual city data</span>
            </div>
          </div>

          <div className="sidebar-footer">
            <Settings size={15} />

            <span>
              Smart City Operations
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
