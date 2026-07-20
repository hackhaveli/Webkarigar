'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X, ExternalLink, Rocket, Star, Check, Globe, Eye, ToggleLeft, ToggleRight,
  ShieldCheck, ChevronDown, Users, ArrowRight, Search, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MarketplaceTemplate, NICHE_CONFIG, MARKETPLACE_TEMPLATES } from '@/lib/marketplace-templates';

interface Lead {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  niche: string | null;
}

interface TemplatePreviewModalProps {
  template: MarketplaceTemplate | null;
  onClose: () => void;
  onUseInCampaign: (template: MarketplaceTemplate) => void;
  /** Optional: pre-select a lead when opened from leads page */
  initialLead?: Lead | null;
}

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function TemplatePreviewModal({
  template, onClose, onUseInCampaign, initialLead
}: TemplatePreviewModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [clientView, setClientView] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLead ?? null);
  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(true);
  // Cross-template browsing
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<MarketplaceTemplate[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch real leads from API
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => {
        const fetchedLeads: Lead[] = (data.leads || []).filter((l: Lead) => l.businessName);
        setLeads(fetchedLeads);
        // Auto-select first lead if none pre-selected
        if (!selectedLead && fetchedLeads.length > 0) {
          setSelectedLead(fetchedLeads[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLeads(false));

    // Load custom templates from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('custom-templates') || '[]');
      setCustomTemplates(stored);
    } catch {}
  }, []);

  if (!template) return null;
  const nicheConfig = NICHE_CONFIG[template.niche as keyof typeof NICHE_CONFIG] || {
    label: template.niche || 'Other',
    bg: 'bg-gray-500/10',
    color: 'text-gray-400',
    gradient: 'from-gray-500 to-slate-600',
  };
  const allTemplates = [...customTemplates, ...MARKETPLACE_TEMPLATES];

  // Determine what to show in the preview
  const displayName = selectedLead?.businessName ?? template.demoClientName;
  const displaySlug = toSlug(displayName);
  const previewSrc = clientView
    ? `${template.previewUrl.replace(/\/$/, '')}/${displaySlug}`
    : template.previewUrl;

  // Filtered leads for picker
  const filteredLeads = leads.filter(l =>
    !leadSearch || 
    l.businessName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.name.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const handleUseAndStart = () => {
    const stored = {
      templateId: template.id,
      templateName: template.name,
      niche: template.niche,
      previewUrl: template.previewUrl,
      previewLinkPattern: `${template.previewUrl}/{{business_slug}}`,
      attachedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('selected-campaign-template', JSON.stringify(stored));
    onClose();
    router.push('/dashboard/campaigns/new');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 bg-[#111827]">
          <div className="flex items-center gap-3">
            <Badge className={`text-[9px] font-bold tracking-wider uppercase border ${nicheConfig.bg} ${nicheConfig.color}`}>
              {nicheConfig.label}
            </Badge>
            <h2 className="text-sm font-bold text-white">{template.name}</h2>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-300 font-medium">{template.rating}</span>
            </div>
            {template.conversionTag && typeof template.conversionTag !== 'string' && (
              <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${template.conversionTag.color}`}>
                {template.conversionTag.emoji} {template.conversionTag.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 gap-1.5"
              onClick={() => window.open(template.previewUrl, '_blank')}>
              <Globe className="h-3.5 w-3.5" /> Full Preview <ExternalLink className="h-3 w-3 opacity-50" />
            </Button>
            <Button size="sm"
              className={`text-xs bg-gradient-to-r ${nicheConfig.gradient} text-white border-0 hover:opacity-90 shadow-lg gap-1.5 font-semibold`}
              onClick={handleUseAndStart}>
              <Rocket className="h-3.5 w-3.5" /> 🚀 Use &amp; Start Campaign
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── LEAD PICKER BANNER ── */}
        <div className={`bg-gradient-to-r ${nicheConfig.gradient} bg-opacity-10 border-b border-white/5`}>
          <div className="px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Viewing-as info + lead picker */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  Viewing as:&nbsp;
                  <span className="font-bold">
                    {selectedLead ? selectedLead.businessName : template.demoClientName}
                  </span>
                </span>
              </div>
              {/* Lead picker button */}
              <div className="relative">
                <button
                  onClick={() => setShowLeadPicker(!showLeadPicker)}
                  className="flex items-center gap-1.5 text-[10px] font-bold bg-black/30 border border-white/15 text-white/80 hover:text-white hover:border-white/30 px-2.5 py-1 rounded-lg transition-all"
                >
                  <Users className="h-3 w-3" />
                  {selectedLead ? 'Change lead' : 'Pick a lead'}
                  <ChevronDown className={`h-3 w-3 transition-transform ${showLeadPicker ? 'rotate-180' : ''}`} />
                </button>

                {showLeadPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-[#0d1117] border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-white/5">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3 w-3 text-gray-500" />
                        <Input
                          value={leadSearch}
                          onChange={e => setLeadSearch(e.target.value)}
                          placeholder="Search business or name..."
                          className="pl-7 h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Use demo (no real lead) */}
                    <button
                      onClick={() => { setSelectedLead(null); setShowLeadPicker(false); setIframeLoaded(false); setIframeError(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors text-xs
                        ${!selectedLead ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <Building2 className="h-3 w-3 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">Use demo brand</span>
                        <span className="text-[10px] opacity-60">{template.demoClientName}</span>
                      </div>
                      {!selectedLead && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto flex-shrink-0" />}
                    </button>

                    <div className="max-h-52 overflow-y-auto">
                      {loadingLeads ? (
                        <div className="px-3 py-4 text-center text-xs text-gray-500">Loading leads...</div>
                      ) : filteredLeads.length === 0 ? (
                        <div className="px-3 py-4 text-center text-xs text-gray-500">
                          {leads.length === 0 ? 'No leads with business names found.' : 'No match.'}
                        </div>
                      ) : (
                        filteredLeads.map(lead => (
                          <button
                            key={lead.id}
                            onClick={() => { setSelectedLead(lead); setShowLeadPicker(false); setIframeLoaded(false); setIframeError(false); }}
                            className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors
                              ${selectedLead?.id === lead.id ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-blue-600/30 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                              {lead.businessName?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-medium truncate">{lead.businessName}</span>
                              <span className="text-[10px] opacity-50 truncate">{lead.email}</span>
                            </div>
                            {selectedLead?.id === lead.id && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto flex-shrink-0" />}
                          </button>
                        ))
                      )}
                    </div>

                    {leads.length > 0 && (
                      <div className="p-2 border-t border-white/5 text-[10px] text-gray-600 text-center">
                        {leads.length} leads with business names available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedLead && (
                <span className="text-[10px] text-white/60 hidden sm:block">· Personalized preview for {selectedLead.businessName}</span>
              )}
            </div>

            {/* Right: Client View Toggle + View Lead Across Templates */}
            <div className="flex items-center gap-3">
              {selectedLead && (
                <button
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all
                    ${showAllTemplates
                      ? 'bg-primary/20 border-primary/40 text-primary'
                      : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:border-white/30'
                    }`}
                >
                  <Eye className="h-3 w-3" />
                  See across all templates
                </button>
              )}
              <button
                onClick={() => { setClientView(!clientView); setIframeLoaded(false); setIframeError(false); }}
                className="flex items-center gap-2 text-[10px] font-bold text-white/80 hover:text-white transition-colors"
              >
                {clientView ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4 text-gray-500" />}
                Client View {clientView ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* ── Cross-template panel for selected lead ── */}
          {showAllTemplates && selectedLead && (
            <div className="px-4 pb-3 pt-1 border-t border-white/5 bg-black/20">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                View "{selectedLead.businessName}" across all templates
              </p>
              <div className="flex flex-wrap gap-2">
                {allTemplates.map(t => (
                  <a
                    key={t.id}
                    href={`${t.previewUrl.replace(/\/$/, '')}/${toSlug(selectedLead.businessName!)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border transition-all font-medium
                      ${t.id === template.id
                        ? 'bg-primary/20 border-primary/30 text-primary'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10'
                      }`}
                  >
                    {t.id === template.id && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    {t.name}
                    <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {!clientView && (
          <div className="bg-[#1a1f2e] px-6 py-2 flex items-center justify-between border-b border-white/5">
            <span className="text-xs text-gray-500">Viewing generic version (no personalization)</span>
            <button
              onClick={() => { setClientView(true); setIframeLoaded(false); setIframeError(false); }}
              className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
            >
              <ToggleLeft className="h-4 w-4" /> Client View OFF — click to enable
            </button>
          </div>
        )}

        {/* ── Split Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-white/5 bg-[#111827] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Best For */}
              <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Best For</p>
                <p className="text-xs text-gray-300 leading-relaxed">{template.bestFor}</p>
              </div>

              {/* Features */}
              {(template.features || []).length > 0 && (
                <div>
                  <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Features Included</h3>
                  <ul className="space-y-1.5">
                    {(template.features || []).map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trust Badges */}
              {(template.trustBadges || []).length > 0 && (
                <div>
                  <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Trust Signals</h3>
                  <div className="space-y-1.5">
                    {(template.trustBadges || []).map(badge => (
                      <div key={badge} className="flex items-center gap-1.5 text-[10px] text-green-400/80 bg-green-500/5 border border-green-500/10 px-2 py-1 rounded-lg">
                        <ShieldCheck className="h-3 w-3 flex-shrink-0" />{badge}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{template.campaignUsage}+</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">Campaigns</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-bold text-amber-400">{template.rating}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">Rating</div>
                </div>
              </div>

              {/* Personalization Note */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                <p className="text-[9px] font-bold text-primary/80 uppercase tracking-wider mb-1">🔗 Personalization</p>
                <code className="text-[10px] bg-[#0B0F19] text-primary px-2 py-1 rounded-lg block font-mono break-all mt-1">
                  /{'{business_slug}'}
                </code>
                <p className="text-[10px] text-gray-600 mt-1.5">Business name is appended as a URL path for each lead</p>
              </div>

              {/* 📬 Inbox Preview Mode */}
              <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-3">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">📬 How this looks in email</p>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                    <div className="text-[10px] font-bold text-gray-800 truncate">
                      I built a website for {displayName} 🚀
                    </div>
                    <div className="text-[9px] text-gray-400 truncate mt-0.5">
                      Just checking if you got a chance to look...
                    </div>
                  </div>
                  <div className="px-3 py-2 space-y-1.5">
                    <p className="text-[10px] text-gray-700">Hey {displayName.split(' ')[0]},</p>
                    <p className="text-[10px] text-gray-600">I made a quick website for your business:</p>
                    <a
                      href={previewSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-600 underline font-semibold block truncate hover:text-blue-800 transition-colors"
                    >
                      🔗 {previewSrc?.slice(0, 38)}...
                    </a>
                    <p className="text-[10px] text-gray-600">Let me know if you'd like this live.</p>
                    <p className="text-[10px] text-gray-500 pt-1">— Rohit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: iframe */}
          <div className="flex-1 bg-[#080B14] overflow-hidden relative flex flex-col">
            {/* Browser Chrome */}
            <div className="bg-[#1a1f2e] border-b border-white/5 px-4 py-2 flex items-center gap-3 flex-shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-1 flex items-center gap-2 min-w-0">
                <Globe className="h-3 w-3 text-gray-500 flex-shrink-0" />
                <span className="text-xs text-gray-400 font-mono truncate">{previewSrc}</span>
                {clientView && <span className="text-[9px] text-green-400 font-bold ml-auto flex-shrink-0">● PERSONALIZED</span>}
              </div>
            </div>

            {/* iFrame */}
            <div className="flex-1 relative">
              {!iframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#080B14]">
                  <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Loading client view...</p>
                </div>
              )}
              {iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#080B14]">
                  <Globe className="h-12 w-12 text-gray-600" />
                  <div className="text-center">
                    <p className="text-sm text-gray-400 font-medium">Preview blocked by browser</p>
                    <p className="text-xs text-gray-600 mt-1">Some sites restrict iframe embedding.</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5"
                    onClick={() => window.open(previewSrc, '_blank')}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open in New Tab
                  </Button>
                </div>
              )}
              {!iframeError && (
                <iframe
                  key={previewSrc}
                  src={previewSrc}
                  className="w-full h-full border-0"
                  title={`Client View — ${displayName}`}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeError(true)}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
