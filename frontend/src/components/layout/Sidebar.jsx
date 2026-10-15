import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Recycle,
  Route,
  TrendingUp,
  FileText,
  History,
  Trash2,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "City Simulator", path: "/simulator", icon: Map },
  { name: "AI Waste Classifier", path: "/classifier", icon: Recycle },
  { name: "Route Optimizer", path: "/routes", icon: Route },
  { name: "Overflow Prediction", path: "/prediction", icon: TrendingUp },
  { name: "Citizen Reports", path: "/reports", icon: FileText },
  { name: "Reports History", path: "/history", icon: History },
];

export default function Sidebar({
  mobileOpen = false,
  onClose = () => {},
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Trash2 size={25} />
          </div>

          <div className="sidebar-brand-text">
            <h2>SmartBin</h2>
            <p>Smart Waste Management</p>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item-active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status-dot" />
          <div>
            <strong>System Status</strong>
            <p>SmartBin Dashboard</p>
          </div>
        </div>
      </aside>
    </>
  );
}
