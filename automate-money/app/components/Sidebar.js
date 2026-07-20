'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Leads', path: '/leads', icon: '👥' },
    { name: 'Pipeline', path: '/scrape', icon: '🔍' },
    { name: 'Niches', path: '/niches', icon: '🏷️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <img src="/logo.png" alt="LeadFlow Logo" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.15)' }} />
          <div className="sidebar-logo-text">
            Lead<span>Flow</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-name">{item.name}</span>
              {isActive && <span className="active-dot" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-badge">v1.0</div>
        <p className="sidebar-footer-text">LeadFlow Platform</p>
      </div>
    </aside>
  );
}
