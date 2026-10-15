import { Menu, Bell, Search } from "lucide-react";

export default function Header({ onMenuClick }) {
  return (
    <header className="topbar">
      <button
        className="header-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="header-search">
        <Search size={18} />
        <input type="search" placeholder="Search SmartBin..." />
      </div>

      <div className="topbar-actions">
        <button className="header-icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="header-profile">
          <div className="header-avatar">SB</div>
          <div>
            <strong>SmartBin Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
