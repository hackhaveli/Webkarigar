'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualified: 0,
    pending: 0,
    sent: 0,
    replied: 0,
    closed: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch qualified leads
      const res = await fetch('/api/leads?is_lead=true&limit=5');
      const data = await res.json();

      if (data.leads) {
        const allLeads = data.leads;
        setRecentLeads(allLeads);
        setStats({
          totalLeads: data.total || 0,
          qualified: data.total || 0,
          pending: allLeads.filter((l) => l.status === 'pending').length,
          sent: allLeads.filter((l) => l.status === 'sent').length,
          replied: allLeads.filter((l) => l.status === 'replied').length,
          closed: allLeads.filter((l) => l.status === 'closed').length,
          highConfidence: allLeads.filter((l) => l.confidence === 'high').length,
          mediumConfidence: allLeads.filter((l) => l.confidence === 'medium').length,
          lowConfidence: allLeads.filter((l) => l.confidence === 'low').length,
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="dashboard-hero animate-fadeIn" style={{ display: 'flex', gap: 32, alignItems: 'center', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h1 className="page-title text-gradient" style={{ fontSize: '2.5rem', marginBottom: 12 }}>Command Center</h1>
          <p className="page-subtitle" style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 24, color: 'var(--text-secondary)' }}>
            Real-time pipeline analytics, Meta Ads scraping metrics, and automated outreach triggers — all unified in one premium dark dashboard.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/scrape" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              🔍 Run Pipeline Scraper
            </Link>
            <Link href="/leads" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              👥 Review Leads
            </Link>
          </div>
        </div>
        <div style={{ flex: '0 0 240px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/dashboard_graphic.png" 
            alt="Dashboard Graphic" 
            style={{ width: '100%', maxWidth: 240, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)' }} 
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card animate-fadeInUp stagger-1 card-glow-emerald" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon purple">📊</div>
            <div>
              <div className="stat-value">{loading ? '—' : stats.totalLeads}</div>
              <div className="stat-label">Total Leads</div>
            </div>
          </div>
          <div style={{ width: 80, height: 35, opacity: 0.85 }}>
            <svg viewBox="0 0 100 40" width="100%" height="100%">
              <path
                d="M0,35 Q15,10 30,28 T60,15 T90,5 T100,12"
                fill="none"
                stroke="#a29bfe"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 2px 5px rgba(162, 155, 254, 0.5))' }}
              />
            </svg>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp stagger-2 card-glow-amber" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon amber">⏳</div>
            <div>
              <div className="stat-value">{loading ? '—' : stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div style={{ width: 80, height: 35, opacity: 0.85 }}>
            <svg viewBox="0 0 100 40" width="100%" height="100%">
              <path
                d="M0,15 Q20,38 40,20 T70,30 T100,8"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 2px 5px rgba(245, 158, 11, 0.5))' }}
              />
            </svg>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp stagger-3 card-glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon blue">📨</div>
            <div>
              <div className="stat-value">{loading ? '—' : stats.sent}</div>
              <div className="stat-label">Messages Sent</div>
            </div>
          </div>
          <div style={{ width: 80, height: 35, opacity: 0.85 }}>
            <svg viewBox="0 0 100 40" width="100%" height="100%">
              <path
                d="M0,38 L20,30 L40,25 L60,15 L80,10 L100,5"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 2px 5px rgba(59, 130, 246, 0.5))' }}
              />
            </svg>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp stagger-4 card-glow-green" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon green">💬</div>
            <div>
              <div className="stat-value">{loading ? '—' : stats.replied}</div>
              <div className="stat-label">Replies Received</div>
            </div>
          </div>
          <div style={{ width: 80, height: 35, opacity: 0.85 }}>
            <svg viewBox="0 0 100 40" width="100%" height="100%">
              <path
                d="M0,35 C20,35 20,5 50,5 C70,5 80,25 100,5"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 2px 5px rgba(16, 185, 129, 0.5))' }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card glass-panel">
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
          <h2 className="card-title">👥 Recently Discovered Leads</h2>
          <Link href="/leads" className="btn btn-ghost btn-sm">
            View all leads →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon">🚀</div>
            <h3 className="empty-state-title">No Leads Found</h3>
            <p className="empty-state-desc">
              Your database is currently empty. Run the Meta Graph API scraper to find leads!
            </p>
            <Link href="/scrape" className="btn btn-primary" style={{ marginTop: 20 }}>
              Scrape Meta Ads Now
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Niche</th>
                  <th>Contact Phone</th>
                  <th>AI Confidence</th>
                  <th>Outreach Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, index) => (
                  <tr key={lead.id} className="table-row-hover" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.business_name || '—'}</td>
                    <td>
                      <span className="badge badge-lead" style={{ textTransform: 'capitalize' }}>{lead.niche}</span>
                    </td>
                    <td>{lead.phone || '—'}</td>
                    <td>
                      <span className={`badge badge-${lead.confidence}`}>
                        {lead.confidence}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${lead.status}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
