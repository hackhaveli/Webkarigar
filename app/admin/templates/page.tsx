'use client';

import { useState, useEffect } from 'react';
import {
  Star, StarOff, Eye, EyeOff, Pencil, RotateCcw, Trash2,
  Plus, Search, Filter, ExternalLink, Save, X, ChevronDown,
  Zap, Globe, Tag, Users, TrendingUp, Award, Sparkles,
  SlidersHorizontal, ChevronUp, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { MARKETPLACE_TEMPLATES, NICHE_CONFIG, MarketplaceTemplate } from '@/lib/marketplace-templates';

const NICHE_ICONS: Record<string, string> = {
  gym: '🏋️', salon: '💅', 'real-estate': '🏠',
  coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒',
};

interface Override {
  templateId: string;
  hidden?: boolean;
  isFeatured?: boolean;
  name?: string;
  description?: string;
  previewUrl?: string;
  demoClientName?: string;
  bestFor?: string;
  rating?: number;
  campaignUsage?: number;
  downloads?: number;
  niche?: string;
  tags?: string[];
  isCustomGlobal?: boolean;
}

export default function AdminTemplatesClientPage() {
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [search, setSearch] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Override>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  // Track which card has inline stat editor open
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<{ rating?: number; campaignUsage?: number; downloads?: number }>({});

  useEffect(() => {
    fetch('/api/admin/marketplace')
      .then(r => r.json())
      .then(d => { setOverrides(d.overrides || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const baseIds = new Set(MARKETPLACE_TEMPLATES.map(t => t.id));
  const newTemplates = Object.values(overrides)
    .filter(ov => !baseIds.has(ov.templateId))
    .map(ov => ({
      id: ov.templateId,
      name: ov.name || 'Unnamed Custom Template',
      niche: typeof (ov as any).niche === 'string' ? (ov as any).niche : 'other',
      tags: [],
      description: ov.description || '',
      previewUrl: ov.previewUrl || '',
      demoClientName: ov.demoClientName || 'Demo',
      githubUrl: '',
      isFeatured: ov.isFeatured,
      rating: ov.rating || 5,
      campaignUsage: ov.campaignUsage || 0,
      downloads: ov.downloads || 0,
      bestFor: ov.bestFor || 'Agencies',
      previewImage: '',
      features: [],
      conversionTag: '',
      trustBadges: [],
      isCustomGlobal: true
    } as unknown as MarketplaceTemplate));

  const ALL_COMBINED = [...MARKETPLACE_TEMPLATES, ...newTemplates];

  const applyFilters = (templates: MarketplaceTemplate[]) => {
    return templates.filter(t => {
      const ov = overrides[t.id] || {};
      const name = ov.name || t.name;
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) ||
        t.niche.includes(search.toLowerCase());
      const matchNiche = !nicheFilter || t.niche === nicheFilter;
      const isHidden = !!ov.hidden;
      return matchSearch && matchNiche && !isHidden;
    });
  };

  const visibleTemplates = applyFilters(ALL_COMBINED);
  const hiddenTemplates = ALL_COMBINED.filter(t => overrides[t.id]?.hidden);

  // Dynamic stats — computed from ALL_COMBINED + real overrides
  const stats = {
    total: ALL_COMBINED.length,
    visible: ALL_COMBINED.filter(t => !overrides[t.id]?.hidden).length,
    featured: ALL_COMBINED.filter(t => overrides[t.id]?.isFeatured ?? !!t.isFeatured).length,
    modified: Object.keys(overrides).length,
  };

  const doSave = async (templateId: string, fields: Partial<Override>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, ...fields }),
      });
      if (res.ok) {
        setOverrides(prev => ({ ...prev, [templateId]: { ...prev[templateId], templateId, ...fields } }));
        toast.success('Template updated!');
      } else {
        toast.error('Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleHide = async (t: MarketplaceTemplate) => {
    const isHidden = !!overrides[t.id]?.hidden;
    if (isHidden) {
      await doSave(t.id, { hidden: false });
    } else {
      const res = await fetch('/api/admin/marketplace', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: t.id }),
      });
      if (res.ok) {
        setOverrides(prev => ({ ...prev, [t.id]: { ...prev[t.id], templateId: t.id, hidden: true } }));
        toast.success('Template hidden from marketplace');
      }
    }
  };

  const toggleFeatured = async (t: MarketplaceTemplate) => {
    const isFeatured = overrides[t.id]?.isFeatured ?? !!t.isFeatured;
    await doSave(t.id, { isFeatured: !isFeatured });
  };

  const resetTemplate = async (templateId: string) => {
    const res = await fetch('/api/admin/marketplace', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, action: 'reset' }),
    });
    if (res.ok) {
      setOverrides(prev => { const n = { ...prev }; delete n[templateId]; return n; });
      toast.success('Template reset to defaults');
    }
  };

  const openEdit = (t: MarketplaceTemplate) => {
    const ov = overrides[t.id] || {};
    setEditForm({
      name: ov.name || t.name,
      description: ov.description || t.description,
      previewUrl: ov.previewUrl || t.previewUrl,
      demoClientName: ov.demoClientName || t.demoClientName,
      bestFor: ov.bestFor || t.bestFor,
      niche: (ov as any).niche || t.niche,
      rating: ov.rating ?? t.rating,
      campaignUsage: ov.campaignUsage ?? t.campaignUsage,
      downloads: ov.downloads ?? t.downloads,
    });
    setEditId(t.id);
  };

  const saveEdit = async () => {
    if (!editId) return;
    await doSave(editId, editForm);
    setEditId(null);
  };

  // Inline stat editor helpers
  const openInlineEdit = (t: MarketplaceTemplate) => {
    const ov = overrides[t.id] || {};
    setInlineForm({
      rating: ov.rating ?? t.rating,
      campaignUsage: ov.campaignUsage ?? t.campaignUsage,
      downloads: ov.downloads ?? t.downloads,
    });
    setInlineEditId(prev => (prev === t.id ? null : t.id));
  };

  const saveInlineStats = async (templateId: string) => {
    await doSave(templateId, inlineForm);
    setInlineEditId(null);
  };

  const adjustStat = (key: keyof typeof inlineForm, delta: number) => {
    setInlineForm(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) + delta),
    }));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-8 space-y-8 min-h-full">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-amber-400/80 font-bold uppercase tracking-widest mb-1">Supreme Admin › Templates</p>
            <h1 className="text-3xl font-extrabold text-white">Marketplace Template Control</h1>
            <p className="text-gray-400 text-sm mt-1">Full CRUD control over all marketplace templates</p>
          </div>
          <button
            onClick={() => { setEditForm({}); setAddingNew(true); }}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add Template
          </button>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Templates', value: stats.total, icon: Globe, color: 'text-blue-400' },
            { label: 'Visible', value: stats.visible, icon: Eye, color: 'text-green-400' },
            { label: 'Featured', value: stats.featured, icon: Star, color: 'text-amber-400' },
            { label: 'Modified', value: stats.modified, icon: Pencil, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.color} bg-white/5 flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40"
            />
          </div>

          {/* Category dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            <select
              value={nicheFilter}
              onChange={e => setNicheFilter(e.target.value)}
              className="appearance-none pl-9 pr-10 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 cursor-pointer min-w-[170px]"
            >
              <option value="">✨ All Categories</option>
              {Object.entries(NICHE_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {NICHE_ICONS[key] || '📄'} {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick pill filters */}
          <div className="flex gap-2 flex-wrap">
            {['', ...Object.keys(NICHE_CONFIG)].map(n => (
              <button key={n} onClick={() => setNicheFilter(n)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${nicheFilter === n
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-[#111827] border-white/5 text-gray-400 hover:text-white'}`}>
                {n ? `${NICHE_ICONS[n]} ${NICHE_CONFIG[n as keyof typeof NICHE_CONFIG].label}` : '✨ All'}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 -mt-4">
          Showing <span className="text-white font-semibold">{visibleTemplates.length}</span> of <span className="text-white font-semibold">{ALL_COMBINED.length}</span> templates
        </p>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleTemplates.map(t => {
            const ov = overrides[t.id] || {};
            const isHidden = !!ov.hidden;
            const isFeatured = ov.isFeatured ?? !!t.isFeatured;
            const isModified = !!overrides[t.id];
            const nicheConf = NICHE_CONFIG[t.niche as keyof typeof NICHE_CONFIG] || { label: t.niche || 'Other', bg: 'bg-gray-500/10', color: 'text-gray-400' };
            const displayName = ov.name || t.name;
            const displayUrl = ov.previewUrl || t.previewUrl;
            const isInlineOpen = inlineEditId === t.id;
            // Live values: while inline editor is open show the draft inlineForm values, otherwise show saved
            const rating = isInlineOpen ? (inlineForm.rating ?? ov.rating ?? t.rating) : (ov.rating ?? t.rating);
            const campaignUsage = isInlineOpen ? (inlineForm.campaignUsage ?? ov.campaignUsage ?? t.campaignUsage) : (ov.campaignUsage ?? t.campaignUsage);
            const downloads = isInlineOpen ? (inlineForm.downloads ?? ov.downloads ?? t.downloads) : (ov.downloads ?? t.downloads);

            return (
              <div key={t.id} className={`bg-[#111827] border rounded-2xl p-5 space-y-4 transition-all ${isHidden ? 'border-red-500/20 opacity-50' : isFeatured ? 'border-amber-500/30' : isInlineOpen ? 'border-primary/30' : 'border-white/5 hover:border-white/10'}`}>
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${nicheConf.bg} ${nicheConf.color}`}>
                        {NICHE_ICONS[t.niche] || '✨'} {nicheConf.label}
                      </span>
                      {isFeatured && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">⭐ Featured</span>}
                      {isModified && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">✏️ Modified</span>}
                      {isHidden && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">🚫 Hidden</span>}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{displayName}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{ov.description || t.description}</p>
                  </div>
                </div>

                {/* Stats row — updates live while inline editor is open */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`rounded-lg p-2 transition-colors ${isInlineOpen ? 'bg-amber-500/10 ring-1 ring-amber-500/20' : 'bg-white/3'}`}>
                    <p className="text-sm font-bold text-amber-400">{typeof rating === 'number' ? rating.toFixed(rating % 1 !== 0 ? 1 : 0) : rating}</p>
                    <p className="text-[9px] text-gray-500">Rating</p>
                  </div>
                  <div className={`rounded-lg p-2 transition-colors ${isInlineOpen ? 'bg-blue-500/10 ring-1 ring-blue-500/20' : 'bg-white/3'}`}>
                    <p className="text-sm font-bold text-blue-400">{campaignUsage}+</p>
                    <p className="text-[9px] text-gray-500">Campaigns</p>
                  </div>
                  <div className={`rounded-lg p-2 transition-colors ${isInlineOpen ? 'bg-green-500/10 ring-1 ring-green-500/20' : 'bg-white/3'}`}>
                    <p className="text-sm font-bold text-green-400">{downloads}</p>
                    <p className="text-[9px] text-gray-500">Downloads</p>
                  </div>
                </div>

                {/* Inline stat manual editor */}
                {isInlineOpen && (
                  <div className="bg-[#0B0F19] border border-primary/20 rounded-xl p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="text-[10px] font-bold text-primary/80 uppercase tracking-wider flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" /> Manual Stat Override
                    </p>
                    {([
                      { key: 'rating' as const, label: 'Rating', min: 0, max: 5, step: 0.1, color: 'text-amber-400' },
                      { key: 'campaignUsage' as const, label: 'Campaigns', min: 0, max: 99999, step: 10, color: 'text-blue-400' },
                      { key: 'downloads' as const, label: 'Downloads', min: 0, max: 99999, step: 10, color: 'text-green-400' },
                    ]).map(field => (
                      <div key={field.key} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 w-20 font-semibold">{field.label}</span>
                        <button
                          onClick={() => adjustStat(field.key, -field.step)}
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          value={inlineForm[field.key] ?? 0}
                          onChange={e => setInlineForm(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                          className={`flex-1 text-center text-sm font-bold ${field.color} bg-[#111827] border border-white/10 rounded-lg py-1 focus:outline-none focus:border-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                        <button
                          onClick={() => adjustStat(field.key, field.step)}
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setInlineEditId(null)}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveInlineStats(t.id)}
                        disabled={saving}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-primary/20 text-primary border border-primary/25 hover:bg-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <Save className="w-3 h-3" /> Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview URL */}
                <div className="flex items-center gap-2 bg-white/3 rounded-lg px-3 py-1.5">
                  <Globe className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-[10px] text-gray-400 font-mono truncate">{displayUrl}</span>
                  <a href={displayUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary hover:text-primary/70">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button onClick={() => toggleFeatured(t)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${isFeatured ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-amber-400'}`}>
                    {isFeatured ? <Star className="w-3 h-3" /> : <StarOff className="w-3 h-3" />}
                    {isFeatured ? 'Unfeature' : 'Feature'}
                  </button>

                  <button onClick={() => toggleHide(t)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${isHidden ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-red-400'}`}>
                    {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {isHidden ? 'Show' : 'Hide'}
                  </button>

                  <button onClick={() => openEdit(t)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 text-gray-400 border border-white/10 hover:text-primary transition-all">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>

                  {/* Manual stats toggle */}
                  <button
                    onClick={() => openInlineEdit(t)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${isInlineOpen ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-primary'}`}
                  >
                    <SlidersHorizontal className="w-3 h-3" /> Stats
                  </button>

                  {isModified && (
                    <button onClick={() => resetTemplate(t.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 text-gray-500 border border-white/10 hover:text-white transition-all ml-auto">
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden templates section */}
        {hiddenTemplates.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> Hidden Templates ({hiddenTemplates.length})
            </h2>
            <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-3">
              {hiddenTemplates.map(t => (
                <div key={t.id} className="bg-[#111827] border border-red-500/20 rounded-xl p-4 flex items-center justify-between gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{overrides[t.id]?.name || t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.niche}</p>
                  </div>
                  <button onClick={() => toggleHide(t)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all whitespace-nowrap">
                    <Eye className="w-3 h-3" /> Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl my-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-primary" /> Edit Template
                </h2>
                <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Category / Niche selector */}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Category / Niche</label>
                  <div className="relative">
                    <select
                      value={(editForm as any).niche ?? ''}
                      onChange={e => setEditForm(prev => ({ ...prev, niche: e.target.value }))}
                      className="w-full appearance-none px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 pr-8 cursor-pointer"
                    >
                      <option value="">— Select category —</option>
                      {Object.entries(NICHE_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {NICHE_ICONS[key] || '📄'} {cfg.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Text / number fields */}
                {[
                  { key: 'name', label: 'Template Name', type: 'text' },
                  { key: 'previewUrl', label: 'Preview URL', type: 'url' },
                  { key: 'demoClientName', label: 'Demo Client Name', type: 'text' },
                  { key: 'bestFor', label: 'Best For (pitch text)', type: 'text' },
                  { key: 'rating', label: 'Rating (0–5)', type: 'number' },
                  { key: 'campaignUsage', label: 'Campaign Usage Count', type: 'number' },
                  { key: 'downloads', label: 'Download Count', type: 'number' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={(editForm as any)[field.key] ?? ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    value={editForm.description ?? ''}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Global Template Modal */}
        {addingNew && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl my-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Add Global Template
                </h2>
                <button onClick={() => setAddingNew(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-amber-400/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                Templates added here will be completely public and immediately available to ALL platform users.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'name', label: 'Template Name', type: 'text' },
                  { key: 'previewUrl', label: 'Preview URL', type: 'url' },
                  { key: 'demoClientName', label: 'Demo Client Name', type: 'text', placeholder: 'e.g., Summit Fitness' },
                  { key: 'niche', label: 'Category', type: 'select', options: Object.keys(NICHE_CONFIG) },
                  { key: 'bestFor', label: 'Best For (pitch text)', type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={(editForm as any)[field.key] ?? Object.keys(NICHE_CONFIG)[0]}
                        onChange={e => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>
                            {NICHE_ICONS[opt] || '📄'} {NICHE_CONFIG[opt as keyof typeof NICHE_CONFIG]?.label || opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={(field as any).placeholder}
                        value={(editForm as any)[field.key] ?? ''}
                        onChange={e => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40"
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    value={editForm.description ?? ''}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/40 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setAddingNew(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={async () => {
                  if (!editForm.name || !editForm.previewUrl) return toast.error('Name and URL required');
                  const newId = 'custom-' + editForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
                  await doSave(newId, { ...editForm, isCustomGlobal: true });
                  setAddingNew(false);
                }} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
