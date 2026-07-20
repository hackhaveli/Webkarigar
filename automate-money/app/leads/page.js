'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CONFIDENCE_LEVELS = ['high', 'medium', 'low'];
const LEAD_STATUSES = ['pending', 'sent', 'replied', 'closed'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editPhone, setEditPhone] = useState('');
  const [niches, setNiches] = useState([]);
  const [reclassifying, setReclassifying] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    niche: '',
    is_lead: 'true',
    confidence: '',
    status: '',
    has_website: '',
    search: '',
    contact_type: '',
  });
  const [pageSize, setPageSize] = useState(25);

  const fetchNiches = useCallback(async () => {
    try {
      const res = await fetch('/api/niches');
      const data = await res.json();
      if (data.niches) setNiches(data.niches);
    } catch (e) {
      console.error('Failed to load niches in UI:', e);
    }
  }, []);

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  const runReclassify = async () => {
    if (!confirm('This will prune all short drama/story app spam from the database and re-classify all remaining ads using the new AI rules. Proceed?')) return;
    setReclassifying(true);
    try {
      const res = await fetch('/api/leads/reclassify', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast(`Database cleaned! Pruned ${data.pruned} spam ads. Re-classified ${data.classified} ads.`, 'success');
      fetchLeads();
    } catch (err) {
      showToast(`Re-classification failed: ${err.message}`, 'error');
    } finally {
      setReclassifying(false);
    }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== '') params.set(key, val);
      });
      params.set('page', page.toString());
      params.set('limit', pageSize.toString());

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast(`Failed to fetch leads: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateFilter = (key, value) => {
    setSelectAllMatching(false);
    setSelectedIds(new Set());
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const updateLead = async (id, updates) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
      showToast('Lead updated');
    } catch (err) {
      showToast(`Update failed: ${err.message}`, 'error');
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setLeads((prev) => prev.filter((l) => l.id !== id));
      showToast('Lead deleted successfully');
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const deleteSelectedLeads = async () => {
    if (selectedIds.size === 0 && !selectAllMatching) return;
    const countToDelete = selectAllMatching ? total : selectedIds.size;
    if (!confirm(`Are you sure you want to delete all ${countToDelete} leads?`)) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectAllMatching ? [] : Array.from(selectedIds),
          selectAllMatching,
          filters
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSelectedIds(new Set());
      setSelectAllMatching(false);
      setPage(1);
      fetchLeads();
      showToast(`${countToDelete} leads deleted successfully`);
    } catch (err) {
      showToast(`Bulk delete failed: ${err.message}`, 'error');
    }
  };

  const startEdit = (lead) => {
    setEditingLeadId(lead.id);
    setEditPhone(lead.phone || '');
  };

  const savePhone = async (id) => {
    try {
      await updateLead(id, { phone: editPhone });
      setEditingLeadId(null);
      showToast('Phone number updated successfully');
    } catch (err) {
      showToast(`Failed to update phone number: ${err.message}`, 'error');
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleMessage = (id) => {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelect = (id) => {
    setSelectAllMatching(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectAllMatching(false);
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const exportCSV = () => {
    const selectedLeads = leads.filter((l) => selectedIds.has(l.id));
    if (selectedLeads.length === 0) {
      showToast('Select leads to export', 'error');
      return;
    }

    const headers = ['business_name', 'phone', 'email', 'city', 'niche', 'confidence', 'status', 'cta_link', 'demo_links', 'message_draft'];
    const csvRows = [headers.join(',')];

    selectedLeads.forEach((lead) => {
      const row = headers.map((h) => {
        let val = lead[h] || '';
        if (h === 'demo_links' && Array.isArray(val)) val = val.join(' | ');
        if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${selectedLeads.length} leads`);
  };

  const exportAllFiltered = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== '') params.set(key, val);
      });
      params.set('limit', '9999'); // bypass pagination limit

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const allLeads = data.leads || [];
      if (allLeads.length === 0) {
        showToast('No leads found to export', 'error');
        return;
      }

      const headers = ['business_name', 'phone', 'email', 'city', 'niche', 'confidence', 'status', 'cta_link', 'demo_links', 'message_draft'];
      const csvRows = [headers.join(',')];

      allLeads.forEach((lead) => {
        const row = headers.map((h) => {
          let val = lead[h] || '';
          if (h === 'demo_links' && Array.isArray(val)) val = val.join(' | ');
          if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_all_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${allLeads.length} leads`);
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error');
    }
  };

  const exportAllEmails = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== '') params.set(key, val);
      });
      params.set('limit', '9999'); // bypass pagination limit

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Extract emails from ad_text client-side (DB has no email column yet)
      const emailLeads = (data.leads || []).map((l) => {
        const match = (l.ad_text || '').match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
        return { ...l, _email: l.email || (match ? match[0] : null) };
      }).filter((l) => l._email);

      if (emailLeads.length === 0) {
        showToast('No emails found in the current filtered leads', 'error');
        return;
      }

      const headers = ['Business Name', 'Email', 'Phone', 'Niche', 'Confidence'];
      const csvRows = [headers.join(',')];

      emailLeads.forEach((lead) => {
        const row = [
          `"${(lead.business_name || '').replace(/"/g, '""')}"`,
          `"${(lead._email || '').replace(/"/g, '""')}"`,
          `"${(lead.phone || '').replace(/"/g, '""')}"`,
          `"${(lead.niche || '').replace(/"/g, '""')}"`,
          `"${(lead.confidence || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_emails_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${emailLeads.length} emails to CSV`);
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error');
    }
  };

  const openWhatsApp = (phone, message) => {
    if (!phone) {
      showToast('No phone number available', 'error');
      return;
    }
    const encoded = encodeURIComponent(message || '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const getBadgeClass = (type, value) => {
    if (type === 'confidence') return `badge badge-${value}`;
    if (type === 'status') return `badge badge-${value}`;
    if (type === 'lead') return value ? 'badge badge-lead' : 'badge badge-rejected';
    return 'badge';
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title text-gradient">Leads Pipeline</h1>
          <p className="page-subtitle">
            Review qualified leads, customize offers, and start WhatsApp campaigns.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-secondary ${reclassifying ? 'btn-loading' : ''}`}
            onClick={runReclassify}
            disabled={reclassifying}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {reclassifying ? 'Cleaning Database...' : '🧹 Prune Spam & Re-classify'}
          </button>

          <button className="btn btn-secondary" onClick={exportAllFiltered} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            📥 Export All (CSV)
          </button>

          <button className="btn btn-secondary" onClick={exportAllEmails} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            📧 Export Emails (CSV)
          </button>

          {selectedIds.size > 0 && (
            <button className="btn btn-success animate-fadeIn" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'black', fontWeight: 700 }}>
              📥 Export Selected ({selectedIds.size})
            </button>
          )}
          <Link href="/scrape" className="btn btn-primary">
            🔍 Scrape More
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass-panel card-glow-purple">
          <div className="stat-icon purple">👥</div>
          <div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Classified</div>
          </div>
        </div>
        <div className="stat-card glass-panel card-glow-amber">
          <div className="stat-icon amber">⏳</div>
          <div>
            <div className="stat-value">
              {leads.filter((l) => l.status === 'pending').length}
            </div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>
        <div className="stat-card glass-panel card-glow-blue">
          <div className="stat-icon blue">📨</div>
          <div>
            <div className="stat-value">
              {leads.filter((l) => l.status === 'sent').length}
            </div>
            <div className="stat-label">Sent Campaigns</div>
          </div>
        </div>
        <div className="stat-card glass-panel card-glow-green">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">
              {leads.filter((l) => l.status === 'replied').length}
            </div>
            <div className="stat-label">Replied Deals</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar glass-panel" style={{ padding: 20, borderRadius: 'var(--radius-lg)', marginBottom: 24 }}>
        <div className="filter-group">
          <label className="filter-label">Niche</label>
          <select
            className="select"
            value={filters.niche}
            onChange={(e) => updateFilter('niche', e.target.value)}
          >
            <option value="">All Niches</option>
            {niches.map((n) => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Lead Rating</label>
          <select
            className="select"
            value={filters.is_lead}
            onChange={(e) => updateFilter('is_lead', e.target.value)}
          >
            <option value="">All Scraped</option>
            <option value="true">Qualified Leads</option>
            <option value="false">Rejected Ads</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">AI Confidence</label>
          <select
            className="select"
            value={filters.confidence}
            onChange={(e) => updateFilter('confidence', e.target.value)}
          >
            <option value="">All Confidence</option>
            {CONFIDENCE_LEVELS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Campaign Status</label>
          <select
            className="select"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Has Website</label>
          <select
            className="select"
            value={filters.has_website}
            onChange={(e) => updateFilter('has_website', e.target.value)}
          >
            <option value="">All</option>
            <option value="false">No Website</option>
            <option value="true">Has Website</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Contact Details</label>
          <select
            className="select"
            value={filters.contact_type}
            onChange={(e) => updateFilter('contact_type', e.target.value)}
          >
            <option value="">All Leads</option>
            <option value="phone">Has Phone Number</option>
            <option value="email">Has Email</option>
            <option value="both">Has Phone and Email</option>
            <option value="either">Has Phone or Email</option>
          </select>
        </div>

        <div className="filter-group" style={{ flex: 1, minWidth: 220 }}>
          <label className="filter-label">Search Business</label>
          <input
            type="text"
            className="input"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.92rem', color: '#f87171', fontWeight: 700 }}>
            {selectAllMatching ? `All ${total} matching leads selected` : `${selectedIds.size} leads on this page selected`}
          </span>
          {!selectAllMatching && total > leads.length && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectAllMatching(true)}
              style={{ color: '#60a5fa', textDecoration: 'underline', padding: '2px 8px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Select all {total} leads matching filters
            </button>
          )}
          {selectAllMatching && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSelectedIds(new Set()); setSelectAllMatching(false); }}
              style={{ color: '#9ca3af', textDecoration: 'underline', padding: '2px 8px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Clear selection
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={deleteSelectedLeads} style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)', marginLeft: 'auto' }}>
            🗑️ Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-container glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: 12 }}>
        {loading ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading verified pipeline data...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state" style={{ padding: '64px 24px' }}>
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No matching leads</h3>
            <p className="empty-state-desc">
              Try modifying your filter settings or trigger a fresh Meta Ads scraping process.
            </p>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedIds.size === leads.length && leads.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Business Name</th>
                    <th>Contact Details</th>
                    <th>Location</th>
                    <th style={{ width: '25%' }}>Ad Text Preview</th>
                    <th>AI Confidence</th>
                    <th>Status</th>
                    <th>Demo Sites</th>
                    <th style={{ width: '25%' }}>WhatsApp Message Draft</th>
                    <th style={{ width: 140, minWidth: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => {
                    const isRowExpanded = expandedRows.has(lead.id);
                    const isMessageExpanded = expandedMessages.has(lead.id);
                    const extractedEmail = (lead.ad_text || '').match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
                    const leadEmail = lead.email || (extractedEmail ? extractedEmail[0] : null);
                    return (
                      <tr key={lead.id} className="table-row-hover" style={{ animationDelay: `${index * 0.03}s` }}>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedIds.has(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.business_name || '—'}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                            {lead.niche}
                          </div>
                          {lead.raw_ads?.page_id && (
                            <a
                              href={`https://facebook.com/${lead.raw_ads.page_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.72rem',
                                color: '#60a5fa',
                                marginTop: 4,
                                textDecoration: 'none',
                                fontWeight: 700
                              }}
                            >
                              🔵 View Meta Profile ↗
                            </a>
                          )}
                        </td>
                        <td>
                          {editingLeadId === lead.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 140 }}>
                              <input
                                type="text"
                                className="input input-sm"
                                placeholder="Enter phone"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                                autoFocus
                              />
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button 
                                  className="btn btn-success btn-xs" 
                                  onClick={() => savePhone(lead.id)} 
                                  style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#10b981', color: 'black', fontWeight: 700 }}
                                >
                                  💾 Save
                                </button>
                                <button 
                                  className="btn btn-ghost btn-xs" 
                                  onClick={() => setEditingLeadId(null)} 
                                  style={{ fontSize: '0.7rem', padding: '2px 6px', color: '#ef4444' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ position: 'relative', minWidth: 140 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{lead.phone || '—'}</span>
                                <button
                                  onClick={() => startEdit(lead)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '0.8rem', padding: 0 }}
                                  title="Edit Phone Number"
                                >
                                  ✏️
                                </button>
                              </div>
                              {leadEmail && (
                                <a
                                  href={`mailto:${leadEmail}`}
                                  style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    color: '#10b981',
                                    marginTop: 4,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    wordBreak: 'break-all'
                                  }}
                                  title="Send email"
                                >
                                  📧 {leadEmail}
                                </a>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{lead.city || '—'}</td>
                        <td>
                          <div
                            className={`cell-truncate ${isRowExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleRow(lead.id)}
                            style={{ cursor: 'pointer', fontSize: '0.85rem', color: isRowExpanded ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5 }}
                            title="Click to expand full ad copy"
                          >
                            {lead.ad_text || '—'}
                          </div>
                        </td>
                        <td>
                          {lead.confidence && (
                            <span className={getBadgeClass('confidence', lead.confidence)}>
                              {lead.confidence}
                            </span>
                          )}
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={lead.status || 'pending'}
                            onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                            style={{ minWidth: 100 }}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {lead.demo_links && lead.demo_links.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {lead.demo_links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="demo-link"
                                  style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                >
                                  Demo {i + 1} ↗
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                        <td>
                          {lead.message_draft ? (
                            <div className="message-draft" style={{ width: '100%' }}>
                              <div
                                className={`message-preview ${isMessageExpanded ? 'expanded' : ''}`}
                                onClick={() => toggleMessage(lead.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                {isMessageExpanded ? (
                                  <div className="chat-thread">
                                    <div className="chat-bubble-sent">
                                      {lead.message_draft}
                                      <span className="chat-time">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    {lead.message_draft.substring(0, 60)}...
                                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', marginTop: 4, fontWeight: 600 }}>Click to show WhatsApp preview</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ width: 140, minWidth: 140 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => openWhatsApp(lead.phone, lead.message_draft)}
                              disabled={!lead.phone}
                              style={{ 
                                background: lead.phone ? '#25D366' : 'rgba(255, 255, 255, 0.05)', 
                                color: lead.phone ? 'black' : 'var(--text-tertiary)', 
                                fontWeight: 700, 
                                padding: '8px 16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 6, 
                                border: 'none', 
                                flexShrink: 0,
                                opacity: lead.phone ? 1 : 0.45,
                                cursor: lead.phone ? 'pointer' : 'not-allowed'
                              }}
                            >
                              💬 Send
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => deleteLead(lead.id)}
                              style={{ color: '#ef4444', padding: '8px 12px', flexShrink: 0 }}
                              title="Delete Lead"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination" style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="pagination-info" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} leads
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show:</span>
                  <select
                    className="select select-sm"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setPage(1);
                    }}
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                  >
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                    <option value="9999">Show All</option>
                  </select>
                </div>
              </div>
              <div className="pagination-buttons">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </button>
                <span style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}
