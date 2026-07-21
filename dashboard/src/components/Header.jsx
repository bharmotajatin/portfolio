import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', active: true, title: 'Scheduled flight dashboard' },
  { label: 'Flights', title: 'Flights list' },
  { label: 'Reports', title: 'Reports' },
  { label: 'Others', title: 'Other tools' },
];

export default function Header({ dateRange, onExport }) {
  return (
    <motion.header
      className="dashboard-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      role="banner"
    >
      <div className="header-left">
        <div className="logo" role="img" aria-label="Bird Airport Services">
          <span className="logo-icon" aria-hidden>🐦</span>
          <span className="logo-text">BIRD AIRPORT SERVICES</span>
        </div>
        <nav className="nav-tabs" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-tab ${item.active ? 'active' : ''}`}
              type="button"
              title={item.title}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="header-right">
        <span className="user-badge">SU Super Admin</span>
        <div className="avatar" aria-hidden />
        <input
          type="text"
          className="date-range-input"
          readOnly
          value={dateRange}
          aria-label="Date range"
          title="Report period"
        />
        <button
          type="button"
          className="btn-export"
          onClick={onExport}
          title="Export dashboard data"
        >
          Export
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications" title="Notifications">
          🔔
        </button>
        <button type="button" className="icon-btn" aria-label="Settings" title="Settings">
          ⚙
        </button>
      </div>
    </motion.header>
  );
}
