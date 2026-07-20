'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Plus, Trash2, Search, Link as LinkIcon, Filter, MoreHorizontal, UserCheck, Tag, Sparkles, ChevronDown, ChevronUp, ExternalLink, Rocket, Zap, Loader2, Info } from 'lucide-react';
import { PageGuide } from '@/components/dashboard/PageGuide';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { MARKETPLACE_TEMPLATES, NICHE_CONFIG, Niche, MarketplaceTemplate } from '@/lib/marketplace-templates';

interface Lead {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  niche: string | null;
  previewUrl: string | null;
  createdAt: string;
}

// All niches from the marketplace config (always shown regardless of leads)
const ALL_NICHE_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: 'all', label: 'All Niches', icon: '✨' },
  { value: 'gym', label: 'Gym & Fitness', icon: '🏋️' },
  { value: 'salon', label: 'Salon & Beauty', icon: '💅' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { value: 'coaching', label: 'Coaching', icon: '🎯' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLeadTips, setShowLeadTips] = useState(true);
  const [search, setSearch] = useState('');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [templateBaseUrl, setTemplateBaseUrl] = useState('');
  const [customTemplates, setCustomTemplates] = useState<MarketplaceTemplate[]>([]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateDropRef = useRef<HTMLDivElement>(null);

  const toSlug = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Load custom templates from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('custom-templates') || '[]');
      setCustomTemplates(stored);
    } catch {}
  }, []);

  // All templates available (marketplace + custom)
  const allTemplates = useMemo<MarketplaceTemplate[]>(
    () => [...customTemplates, ...MARKETPLACE_TEMPLATES],
    [customTemplates]
  );

  // Set default template on mount
  useEffect(() => {
    if (allTemplates.length > 0 && !templateBaseUrl) {
      setTemplateBaseUrl(allTemplates[0].previewUrl.replace(/\/$/, ''));
    }
  }, [allTemplates]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templateDropRef.current && !templateDropRef.current.contains(e.target as Node)) {
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const processFile = async (file: File) => {
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/leads/bulk', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully imported ${data.imported} leads!`);
        fetchLeads();
      } else {
        toast.error(data.error || 'Import failed');
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    setIsDeletingId(id);
    try {
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setLeads(leads.filter((l) => l.id !== id));
        setTotal(prev => prev - 1);
        toast.success('Lead deleted');
      } else {
        toast.error('Failed to delete lead');
      }
    } catch {
      toast.error('Network error while deleting');
    } finally {
      setIsDeletingId(null);
    }
  };

  const deleteSelectedLeads = async () => {
    if (!confirm(`Delete ${selectedLeads.length} leads?`)) return;
    setIsDeletingBulk(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads }),
      });
      if (res.ok) {
        setLeads(leads.filter((l) => !selectedLeads.includes(l.id)));
        setTotal(prev => prev - selectedLeads.length);
        setSelectedLeads([]);
        toast.success(`Deleted ${selectedLeads.length} leads`);
      } else {
         toast.error('Failed to bulk delete leads');
      }
    } catch (e) {
      toast.error('Error deleting leads');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const toggleLead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.email.toLowerCase().includes(search.toLowerCase()) || 
                          l.name.toLowerCase().includes(search.toLowerCase()) ||
                          (l.businessName && l.businessName.toLowerCase().includes(search.toLowerCase()));
    const matchesNiche = nicheFilter === 'all' || l.niche === nicheFilter;
    return matchesSearch && matchesNiche;
  });

  // Count leads per niche
  const nicheCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach(l => {
      if (l.niche) counts[l.niche] = (counts[l.niche] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const selectedTemplateName = allTemplates.find(
    t => t.previewUrl.replace(/\/$/, '') === templateBaseUrl
  )?.name ?? 'Select Template';

  return (
    <div 
      className="space-y-6 relative" 
      onDragOver={onDragOver} 
      onDragLeave={onDragLeave} 
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 rounded-2xl border-2 border-dashed border-primary z-50 flex items-center justify-center pointer-events-none backdrop-blur-sm transition-all duration-200">
          <div className="bg-[#07090e] p-6 rounded-xl shadow-lg text-center">
            <Upload className="h-10 w-10 text-primary mx-auto mb-2 animate-bounce" />
            <h3 className="font-bold text-lg">Drop your file here</h3>
            <p className="text-muted-foreground text-sm mt-1">Supports .csv, .xlsx, .xls</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end flex-wrap gap-4 pb-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-1">Leads Manager</h2>
          <p className="text-slate-300 text-lg">Manage your contacts and dynamic previews.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/[0.06] h-10 w-10 shrink-0" title="Import Guide">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#07090e] text-white border-white/10 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Successful Lead Imports</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-slate-300 pt-2">
                <p>
                  To ensure a perfect import via CSV or Excel, your file must contain column headers. Our system automatically scans for flexible header names.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-200">
                  <li><strong className="text-white">Email Address:</strong> Required.<br/><span className="text-xs text-slate-400">Looks for "Email", "Emails", or "Public Email". We detect comma-separated lists and cleanly discard pending/invalid emails.</span></li>
                  <li><strong className="text-white">Name / Business:</strong> Required.<br/><span className="text-xs text-slate-400">Looks for "Name", "Full Name", or "Business". If no contact name exists, it intelligently defaults to "Business Owner".</span></li>
                  <li><strong className="text-white">Category / Niche:</strong> Recommended.<br/><span className="text-xs text-slate-400">Looks for "Category", "Niche", or "Industry" to automatically organize your prospects.</span></li>
                </ul>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mt-4">
                  <p className="text-[11px] leading-relaxed text-primary/90 flex gap-2">
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <span><strong>Pro Tip: Google Maps Extractor files are fully supported natively.</strong> You can drag-and-drop their exported CSVs directly without modifying a single column!</span>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <Button variant="outline" className="border-white/10 bg-[#0f1422] text-white hover:bg-white/[0.06] h-10" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? 'Importing...' : <><Upload className="h-4 w-4 mr-2 text-primary" /> Import CSV / XLSX</>}
          </Button>
          <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-transform duration-200 h-10">
            <Plus className="h-4 w-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      <PageGuide title="How to add leads for your campaigns">
        <p>Leads are the businesses you want to reach. Upload a CSV/Excel file with columns for <strong>Email</strong>, <strong>Name</strong>, and optionally <strong>Business Name</strong> / <strong>Niche</strong>.</p>
        <p><strong>Best sources:</strong> Use a Google Maps scraper Chrome extension to extract business data (name, email, niche) from Google Maps — these exports work directly with drag-and-drop.</p>
        <p>Already have leads? Use the <strong>AI Lead Finder</strong> in the sidebar to scrape and qualify new leads automatically from Meta Ads.</p>
      </PageGuide>

      {/* ── How to Get Leads Banner ── */}
      {showLeadTips && (
        <div className="bg-gradient-to-br from-[#0d1117] to-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">How to Get Leads</h3>
                <p className="text-[11px] text-slate-400">Our tool works best with these lead sources</p>
              </div>
            </div>
            <button onClick={() => setShowLeadTips(false)} className="text-slate-400 hover:text-white transition-colors">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tool 1: Growman IG Extractor */}
            <a
              href="https://chromewebstore.google.com/detail/growman-ig-email-extracto/hndnabgpcmhdmaejoapophbidipmgnpb"
              target="_blank"
              rel="noreferrer"
              className="group flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <Image src="/leads.png" alt="Growman IG Email Extractor" fill className="object-cover object-top" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-white">Growman: IG Email Extractor</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">⭐ 4.2 · 100K users</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">Scrape emails from Instagram profiles & hashtags. Great for targeting local businesses.</p>
                <div className="flex items-center gap-1 mt-2 text-primary text-[11px] font-medium group-hover:underline">
                  <ExternalLink className="h-3 w-3" /> Add to Chrome
                </div>
              </div>
            </a>

            {/* Tool 2: MapsLeads */}
            <a
              href="https://chromewebstore.google.com/detail/maps-scraper-leads-extrac/ghokiciomljbacchbkfhmnlmflbponlf"
              target="_blank"
              rel="noreferrer"
              className="group flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <Image src="/leads2.png" alt="Maps Scraper & Leads Extractor" fill className="object-cover object-top" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-white">Maps Scraper & Leads Extractor</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">⭐ 4.7 · 992 ratings</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">Extract businesses from Google Maps by niche & location. Download directly as CSV/XLSX.</p>
                <div className="flex items-center gap-1 mt-2 text-primary text-[11px] font-medium group-hover:underline">
                  <ExternalLink className="h-3 w-3" /> Add to Chrome
                </div>
              </div>
            </a>
          </div>

          {/* Our own scraper coming soon */}
          <div className="mx-5 mb-5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Rocket className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400">🚀 Our own scraper is under development!</p>
              <p className="text-[11px] text-slate-400">Soon you'll be able to scrape leads directly from inside WebKarigar — no Chrome extension needed. Stay tuned.</p>
            </div>
            <span className="ml-auto shrink-0 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full font-bold">Coming Soon</span>
          </div>
        </div>
      )}

      {!showLeadTips && (
        <button
          onClick={() => setShowLeadTips(true)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronDown className="h-3.5 w-3.5" /> How to get leads?
        </button>
      )}

      {selectedLeads.length > 0 && (
        <div className="bg-primary/20 border border-primary/30 text-primary-foreground px-6 py-3 rounded-xl flex items-center justify-between mb-4 shadow-[0_0_20px_rgba(var(--primary),0.1)] animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">{selectedLeads.length} leads selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-background/50 border-white/10 text-white hover:bg-white/10 h-8 text-xs">
              <Tag className="w-3 h-3 mr-2 text-blue-400" /> Apply Tag
            </Button>
            <Button variant="destructive" size="sm" className="h-8 text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40" onClick={deleteSelectedLeads} disabled={isDeletingBulk}>
              {isDeletingBulk ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Trash2 className="w-3 h-3 mr-2" />}
              {isDeletingBulk ? 'Deleting...' : 'Bulk Delete'}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background/50">
          <h3 className="font-bold text-lg text-white">All Leads <Badge variant="secondary" className="ml-2 bg-white/10 text-white">{total}</Badge></h3>
          
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Template Picker — Dynamic: shows ALL marketplace + custom templates */}
            <div ref={templateDropRef} className="relative">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-lg px-3 py-1.5 hover:border-primary/30 transition-colors"
              >
                <LinkIcon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">Preview via:</span>
                <span className="text-xs text-primary font-semibold max-w-[120px] truncate">{selectedTemplateName}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showTemplateDropdown && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Group by niche */}
                  {(() => {
                    const grouped: Record<string, MarketplaceTemplate[]> = {};
                    allTemplates.forEach(t => {
                      const key = t.niche || 'other';
                      if (!grouped[key]) grouped[key] = [];
                      grouped[key].push(t);
                    });

                    return Object.entries(grouped).map(([niche, templates]) => {
                      const nicheConf = NICHE_CONFIG[niche as Niche];
                      const nicheIcons: Record<string, string> = {
                        gym: '🏋️', salon: '💅', 'real-estate': '🏠',
                        coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒', other: '📄'
                      };
                      return (
                        <div key={niche}>
                          <div className="px-3 pt-3 pb-1 flex items-center gap-2">
                            <span className="text-sm">{nicheIcons[niche] || '📄'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {nicheConf?.label || 'Other'}
                            </span>
                          </div>
                          {templates.map(t => {
                            const url = t.previewUrl.replace(/\/$/, '');
                            const isSelected = templateBaseUrl === url;
                            return (
                              <button
                                key={t.id}
                                onClick={() => { setTemplateBaseUrl(url); setShowTemplateDropdown(false); }}
                                className={`w-full text-left px-3 py-2 flex items-center justify-between group transition-colors
                                  ${isSelected ? 'bg-primary/10 text-primary' : 'text-slate-200 hover:bg-white/[0.06] hover:text-white'}`}
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-medium truncate">{t.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono truncate">{t.previewUrl.replace('https://', '')}</span>
                                </div>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}

                  <div className="border-t border-white/[0.08] p-2">
                    <Link
                      href="/dashboard/templates"
                      className="flex items-center gap-2 w-full text-[11px] text-primary/70 hover:text-primary px-2 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      Browse & import more templates →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search emails or names..." className="pl-9 bg-[#07090e] border-white/10 text-white focus-visible:ring-primary h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            
            {/* Niche Filter — All niches always shown, with lead counts */}
            <Select value={nicheFilter} onValueChange={setNicheFilter}>
              <SelectTrigger className="w-[200px] bg-[#07090e] border-white/10 text-white h-9">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filter by niche" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-white/10">
                {ALL_NICHE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white focus:bg-white/[0.04] focus:text-white">
                    <div className="flex items-center gap-2 w-full">
                      <span>{opt.icon}</span>
                      <span className="flex-1">{opt.label}</span>
                      {nicheCounts[opt.value] !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-2 font-bold
                          ${nicheFilter === opt.value ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-slate-400'}`}>
                          {opt.value === 'all' ? leads.length : (nicheCounts[opt.value] || 0)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 italic">Fetching leads database...</div>
          ) : leads.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Upload className="h-12 w-12 text-primary relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload your first leads to get started</h3>
              <p className="text-slate-300 max-w-md mb-8">Drag and drop a CSV or Excel file containing your prospects anywhere on this page, or map it manually.</p>
              <Button size="lg" className="bg-white text-black hover:bg-slate-200" onClick={() => fileInputRef.current?.click()}>
                Select Spreadsheet
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.04] border-b border-white/[0.08]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px]"><Checkbox checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} onCheckedChange={toggleSelectAll} className="border-white/20 data-[state=checked]:bg-primary" /></TableHead>
                  <TableHead className="text-slate-300 font-medium h-12">Prospect Info</TableHead>
                  <TableHead className="text-slate-300 font-medium">Business Details</TableHead>
                  <TableHead className="text-slate-300 font-medium">Preview Link</TableHead>
                  <TableHead className="w-[80px] text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const isChecked = selectedLeads.includes(lead.id);
                  const isDeleting = isDeletingId === lead.id || (isDeletingBulk && isChecked);
                  return (
                  <TableRow key={lead.id} className={`border-b border-white/[0.08] transition-all duration-300 cursor-default ${isChecked ? 'bg-primary/5' : 'hover:bg-white/[0.02]'} ${isDeleting ? 'opacity-30 scale-[0.99] pointer-events-none' : ''}`} onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
                    toggleLead(lead.id, e as React.MouseEvent);
                  }}>
                    <TableCell><Checkbox checked={isChecked} onCheckedChange={() => toggleLead(lead.id)} className="border-white/20 data-[state=checked]:bg-primary" /></TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{lead.name}</span>
                        <span className="text-sm text-slate-400">{lead.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.businessName ? (
                        <div className="flex flex-col items-start">
                          <span className="text-white">{lead.businessName}</span>
                          {lead.niche && (
                            <Badge variant="outline" className={`mt-1 text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20`}>
                              {(() => {
                                const icon = ALL_NICHE_OPTIONS.find(n => n.value === lead.niche)?.icon || '';
                                return `${icon} ${lead.niche}`;
                              })()}
                            </Badge>
                          )}
                        </div>
                      ) : <span className="text-slate-400 italic">Unknown</span>}
                    </TableCell>
                    <TableCell>
                      {lead.businessName ? (
                        <div className="flex flex-col gap-1">
                          <a
                            href={`${templateBaseUrl}/${toSlug(lead.businessName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group/link"
                          >
                            <LinkIcon className="h-3 w-3 mr-1.5" /> View Demo Page
                          </a>
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                            /{toSlug(lead.businessName)}
                          </span>
                          {/* Quick template switcher per lead row */}
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {allTemplates.slice(0, 4).map(t => (
                              <a
                                key={t.id}
                                href={`${t.previewUrl.replace(/\/$/, '')}/${toSlug(lead.businessName!)}`}
                                target="_blank"
                                rel="noreferrer"
                                title={`View in ${t.name}`}
                                className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all truncate max-w-[80px]"
                              >
                                {t.name}
                              </a>
                            ))}
                            {allTemplates.length > 4 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400">
                                +{allTemplates.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 bg-gray-900/50 px-2 py-1 rounded-md border border-white/[0.08]">No business name</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} disabled={isDeleting} className="text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors">
                        {isDeletingId === lead.id ? <Loader2 className="h-4 w-4 animate-spin text-red-400" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                )})}
                {filteredLeads.length === 0 && leads.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-400">No leads matched your search or filter.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
