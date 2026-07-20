'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Download, Trash2, MessageSquare, ExternalLink, Users, ArrowLeft, ArrowRight, Eye, EyeOff, ChevronDown, ChevronUp, Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PageGuide } from '@/components/dashboard/PageGuide';

const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
const LEAD_STATUSES = ['pending', 'sent', 'replied', 'closed'] as const;

interface Lead {
  id: string;
  niche: string;
  business_name: string;
  phone: string | null;
  city: string | null;
  has_website: boolean;
  cta_link: string | null;
  ad_text: string | null;
  is_lead: boolean;
  confidence: string;
  rejection_reason: string | null;
  slug: string | null;
  demo_links: string[] | null;
  message_draft: string | null;
  status: string;
  email: string | null;
  emails: string[];
  raw_ads: { page_id: string; page_name: string; raw_json: any } | null;
  created_at: string;
}

export default function GeneratedLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState('');
  const [niches, setNiches] = useState<{ value: string; label: string }[]>([]);
  const [reclassifying, setReclassifying] = useState(false);

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
      const res = await fetch('/api/lead-gen/niches');
      const data = await res.json();
      if (data.niches) setNiches(data.niches);
    } catch { console.error('Failed to load niches'); }
  }, []);

  useEffect(() => { fetchNiches(); }, [fetchNiches]);

  const runReclassify = async () => {
    if (!confirm('This will prune spam ads and re-classify all remaining ads. Proceed?')) return;
    setReclassifying(true);
    try {
      const res = await fetch('/api/lead-gen/leads/reclassify', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Database cleaned! Pruned ${data.pruned} spam ads. Re-classified ${data.classified} ads.`);
      fetchLeads();
    } catch (err: any) {
      toast.error(`Re-classification failed: ${err.message}`);
    } finally { setReclassifying(false); }
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

      const res = await fetch(`/api/lead-gen/leads?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      toast.error(`Failed to fetch leads: ${err.message}`);
    } finally { setLoading(false); }
  }, [filters, page, pageSize]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateFilter = (key: string, value: string) => {
    setSelectAllMatching(false);
    setSelectedIds(new Set());
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const updateLead = async (id: string, updates: Record<string, any>) => {
    try {
      const res = await fetch('/api/lead-gen/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
      toast.success('Lead updated');
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      const res = await fetch('/api/lead-gen/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(prev => prev.filter(l => l.id !== id));
      setTotal(prev => prev - 1);
      toast.success('Lead deleted');
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const deleteSelectedLeads = async () => {
    if (selectedIds.size === 0 && !selectAllMatching) return;
    const countToDelete = selectAllMatching ? total : selectedIds.size;
    if (!confirm(`Delete all ${countToDelete} leads?`)) return;
    try {
      const res = await fetch('/api/lead-gen/leads', {
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
      toast.success(`${countToDelete} leads deleted`);
    } catch (err: any) {
      toast.error(`Bulk delete failed: ${err.message}`);
    }
  };

  const startEdit = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setEditPhone(lead.phone || '');
  };

  const savePhone = async (id: string) => {
    await updateLead(id, { phone: editPhone });
    setEditingLeadId(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleMessage = (id: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectAllMatching(false);
    setSelectedIds(prev => {
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
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const exportCSV = (type: 'selected' | 'filtered' | 'emails') => {
    const doExport = async () => {
      let dataToExport: Lead[];
      if (type === 'selected') {
        dataToExport = leads.filter(l => selectedIds.has(l.id));
        if (dataToExport.length === 0) { toast.error('Select leads to export'); return; }
      } else {
        try {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([key, val]) => {
            if (val !== '') params.set(key, val);
          });
          params.set('limit', '9999');
          const res = await fetch(`/api/lead-gen/leads?${params}`);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          dataToExport = data.leads || [];
        } catch (err: any) {
          toast.error(`Export failed: ${err.message}`);
          return;
        }
      }

      if (type === 'emails') {
        const emailRows = dataToExport
          .map(l => ({ name: l.business_name, email: l.email, phone: l.phone, niche: l.niche, confidence: l.confidence }))
          .filter(l => l.email);
        if (emailRows.length === 0) { toast.error('No emails found'); return; }
        const headers = ['Business Name', 'Email', 'Phone', 'Niche', 'Confidence'];
        const csvRows = [headers.join(',')];
        emailRows.forEach(r => {
          csvRows.push(`"${(r.name || '').replace(/"/g, '""')}","${(r.email || '').replace(/"/g, '""')}","${(r.phone || '').replace(/"/g, '""')}","${r.niche}","${r.confidence}"`);
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_emails_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${emailRows.length} emails`);
        return;
      }

      const headers = ['business_name', 'phone', 'email', 'city', 'niche', 'confidence', 'status', 'cta_link', 'demo_links', 'message_draft'];
      const csvRows = [headers.join(',')];
      dataToExport.forEach(lead => {
        const row = headers.map(h => {
          let val = (lead as any)[h] || '';
          if (h === 'demo_links' && Array.isArray(val)) val = val.join(' | ');
          if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) val = `"${val.replace(/"/g, '""')}"`;
          return val;
        });
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${dataToExport.length} leads`);
    };
    doExport();
  };

  const openWhatsApp = (phone: string | null, message: string | null) => {
    if (!phone) { toast.error('No phone number'); return; }
    const encoded = encodeURIComponent(message || '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const confidenceColor = (c: string) => {
    switch(c) {
      case 'high': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-slate-300 border-gray-500/20';
    }
  };

  const statusColor = (s: string) => {
    switch(s) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'sent': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'replied': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'closed': return 'bg-gray-500/10 text-slate-300 border-gray-500/20';
      default: return 'bg-gray-500/10 text-slate-300 border-gray-500/20';
    }
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-1">Generated Leads</h2>
          <p className="text-slate-300 text-lg">Review, filter, and manage leads discovered by the AI pipeline.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="border-white/10 bg-[#0f1422] text-white hover:bg-white/[0.06] h-10" onClick={runReclassify} disabled={reclassifying}>
            {reclassifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-purple-400" />}
            {reclassifying ? 'Cleaning...' : 'Prune & Re-classify'}
          </Button>
          <Button variant="outline" className="border-white/10 bg-[#0f1422] text-white hover:bg-white/[0.06] h-10" onClick={() => exportCSV('filtered')}>
            <Download className="w-4 h-4 mr-2 text-emerald-400" />
            Export All CSV
          </Button>
          <Button variant="outline" className="border-white/10 bg-[#0f1422] text-white hover:bg-white/[0.06] h-10" onClick={() => exportCSV('emails')}>
            <Mail className="w-4 h-4 mr-2 text-blue-400" />
            Export Emails
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white h-10" asChild>
            <Link href="/dashboard/lead-generation">
              <Search className="w-4 h-4 mr-2" />
              Pipeline
            </Link>
          </Button>
        </div>
      </div>

      <PageGuide title="Understanding your generated leads">
        <p>These are leads discovered by the AI pipeline. Each lead represents a local business that likely doesn't have a website.</p>
        <p><strong>Confidence:</strong> High = strong match, Medium = possible lead, Low = uncertain (review manually).</p>
        <p><strong>Status:</strong> Track your outreach — mark as <em>Sent</em> after emailing, <em>Replied</em> when they respond, <em>Closed</em> when done.</p>
        <p>Use the <strong>Export</strong> button to save leads with phone numbers for WhatsApp outreach, or export emails-only for campaign use.</p>
      </PageGuide>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0f1422] border-white/[0.08]">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{total}</div>
            <p className="text-sm text-slate-300">Total Classified</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1422] border-white/[0.08]">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-400">{leads.filter(l => l.status === 'pending').length}</div>
            <p className="text-sm text-slate-300">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1422] border-white/[0.08]">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">{leads.filter(l => l.status === 'sent').length}</div>
            <p className="text-sm text-slate-300">Sent Campaigns</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1422] border-white/[0.08]">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-400">{leads.filter(l => l.status === 'replied').length}</div>
            <p className="text-sm text-slate-300">Replied Deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="bg-[#0f1422] border-white/[0.08]">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 min-w-[140px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Niche</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.niche} onChange={e => updateFilter('niche', e.target.value)}>
                <option value="">All Niches</option>
                {niches.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead Rating</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.is_lead} onChange={e => updateFilter('is_lead', e.target.value)}>
                <option value="">All</option>
                <option value="true">Qualified</option>
                <option value="false">Rejected</option>
              </select>
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confidence</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.confidence} onChange={e => updateFilter('confidence', e.target.value)}>
                <option value="">All</option>
                {CONFIDENCE_LEVELS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.status} onChange={e => updateFilter('status', e.target.value)}>
                <option value="">All</option>
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Has Website</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.has_website} onChange={e => updateFilter('has_website', e.target.value)}>
                <option value="">All</option>
                <option value="false">No Website</option>
                <option value="true">Has Website</option>
              </select>
            </div>
            <div className="space-y-2 min-w-[130px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contact</label>
              <select className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50" value={filters.contact_type} onChange={e => updateFilter('contact_type', e.target.value)}>
                <option value="">All</option>
                <option value="phone">Has Phone</option>
                <option value="email">Has Email</option>
                <option value="both">Phone + Email</option>
                <option value="either">Phone or Email</option>
              </select>
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Search</label>
              <input
                type="text"
                className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Search business name..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Bar */}
      {(selectedIds.size > 0 || selectAllMatching) && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-purple-300 font-medium">
            {selectAllMatching ? `All ${total} matching leads selected` : `${selectedIds.size} leads selected`}
          </span>
          <div className="flex gap-3 items-center">
            {!selectAllMatching && total > leads.length && (
              <button
                className="text-xs text-blue-400 hover:text-blue-300 underline"
                onClick={() => setSelectAllMatching(true)}
              >
                Select all {total} matching
              </button>
            )}
            {selectAllMatching && (
              <button
                className="text-xs text-slate-300 hover:text-slate-200 underline"
                onClick={() => { setSelectedIds(new Set()); setSelectAllMatching(false); }}
              >
                Clear selection
              </button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/[0.06] h-8 text-xs" onClick={() => exportCSV('selected')}>
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>
              <Button variant="destructive" size="sm" className="h-8 text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40" onClick={deleteSelectedLeads}>
                <Trash2 className="w-3 h-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No leads found</h3>
              <p className="text-slate-400 text-sm mb-4">Run the pipeline to discover leads, or adjust your filters.</p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" asChild>
                <Link href="/dashboard/lead-generation">
                  <Search className="w-4 h-4 mr-2" />
                  Go to Pipeline
                </Link>
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="p-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={selectedIds.size === leads.length && leads.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Business</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ad Preview</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Confidence</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demos</th>
                  <th className="p-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Message</th>
                  <th className="p-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const isRowExpanded = expandedRows.has(lead.id);
                  const isMessageExpanded = expandedMessages.has(lead.id);
                  const leadEmail = lead.email;

                  return (
                    <tr key={lead.id} className="border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="accent-purple-500"
                          checked={selectedIds.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white text-sm">{lead.business_name || '—'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{lead.niche}</div>
                        {lead.raw_ads?.page_id && (
                          <a
                            href={`https://facebook.com/${lead.raw_ads.page_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" /> View Facebook
                          </a>
                        )}
                      </td>
                      <td className="p-3">
                        {editingLeadId === lead.id ? (
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              className="w-28 bg-[#07090e] border border-white/10 rounded px-2 py-1 text-white text-xs"
                              value={editPhone}
                              onChange={e => setEditPhone(e.target.value)}
                              autoFocus
                            />
                            <button className="text-emerald-400 text-xs hover:text-emerald-300 px-1" onClick={() => savePhone(lead.id)}>Save</button>
                            <button className="text-red-400 text-xs hover:text-red-300" onClick={() => setEditingLeadId(null)}>X</button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1 text-sm text-white">
                              {lead.phone ? (
                                <>
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{lead.phone}</span>
                                  <button onClick={() => startEdit(lead)} className="text-slate-400 hover:text-slate-300 text-xs ml-1">✎</button>
                                </>
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </div>
                            {leadEmail && (
                              <a href={`mailto:${leadEmail}`} className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-0.5">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[140px]">{leadEmail}</span>
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-sm text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lead.city || '—'}</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-[200px]">
                        <div className="relative">
                          <div
                            className={`text-xs text-slate-300 cursor-pointer leading-relaxed ${isRowExpanded ? '' : 'line-clamp-2'}`}
                            onClick={() => toggleRow(lead.id)}
                          >
                            {lead.ad_text || '—'}
                          </div>
                          {lead.ad_text && lead.ad_text.length > 80 && (
                            <button
                              onClick={() => toggleRow(lead.id)}
                              className="text-[10px] text-purple-400 hover:text-purple-300 mt-1 flex items-center gap-1"
                            >
                              {isRowExpanded ? <><EyeOff className="w-3 h-3" /> Less</> : <><Eye className="w-3 h-3" /> More</>}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {lead.confidence && (
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${confidenceColor(lead.confidence)}`}>
                            {lead.confidence}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          className="bg-[#07090e] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-w-[90px]"
                          value={lead.status || 'pending'}
                          onChange={e => updateLead(lead.id, { status: e.target.value })}
                        >
                          {LEAD_STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        {lead.demo_links && lead.demo_links.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {lead.demo_links.map((link, i) => (
                              <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Demo {i + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3 max-w-[220px]">
                        {lead.message_draft ? (
                          <div>
                            {isMessageExpanded ? (
                              <div className="bg-[#07090e] border border-white/10 rounded-lg p-3">
                                <div className="bg-emerald-900/30 border border-emerald-700/30 rounded-lg p-3 text-xs text-slate-100 leading-relaxed whitespace-pre-wrap">
                                  {lead.message_draft}
                                  <div className="text-right text-[10px] text-slate-400 mt-2">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                                  </div>
                                </div>
                                <button onClick={() => toggleMessage(lead.id)} className="text-[10px] text-slate-400 hover:text-slate-300 mt-1">▲ Collapse</button>
                              </div>
                            ) : (
                              <div className="cursor-pointer" onClick={() => toggleMessage(lead.id)}>
                                <div className="text-xs text-slate-300 italic line-clamp-2">{lead.message_draft}</div>
                                <div className="text-[10px] text-purple-400 mt-1">Click to preview</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => openWhatsApp(lead.phone, lead.message_draft)}
                            disabled={!lead.phone}
                            title="Open WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => deleteLead(lead.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <div className="border-t border-white/[0.08] px-4 py-3 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">
                Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </span>
              <select
                className="bg-[#07090e] border border-white/10 rounded px-2 py-1 text-white text-xs"
                value={pageSize}
                onChange={e => { setPageSize(parseInt(e.target.value)); setPage(1); }}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="9999">All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-300 hover:text-white" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ArrowLeft className="w-3 h-3 mr-1" /> Prev
              </Button>
              <span className="text-xs text-slate-400 px-2">Page {page} of {totalPages}</span>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-300 hover:text-white" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
