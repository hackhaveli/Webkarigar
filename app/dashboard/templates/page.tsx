'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, BookOpen, Sparkles, LayoutGrid, List, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageGuide } from '@/components/dashboard/PageGuide';
import {
  MARKETPLACE_TEMPLATES as STATIC_TEMPLATES,
  MarketplaceTemplate,
  Niche,
  NICHE_CONFIG,
} from '@/lib/marketplace-templates';
import { applyOverrides, TemplateOverride } from '@/lib/marketplace-overrides';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { UseInCampaignModal } from '@/components/templates/UseInCampaignModal';
import { ImportTemplateModal } from '@/components/templates/ImportTemplateModal';

type FilterNiche = Niche | 'all';

const FILTER_OPTIONS: { value: FilterNiche; label: string; icon: string }[] = [
  { value: 'all', label: 'All Templates', icon: '✨' },
  { value: 'gym', label: 'Gym & Fitness', icon: '🏋️' },
  { value: 'salon', label: 'Salon & Beauty', icon: '💅' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { value: 'coaching', label: 'Coaching', icon: '🎯' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
];

import { TemplateHeroGraphic } from '@/components/dashboard/illustrations/SubsectionIllustrations';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterNiche>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [campaignTemplate, setCampaignTemplate] = useState<MarketplaceTemplate | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<MarketplaceTemplate[]>([]);
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<MarketplaceTemplate[]>(STATIC_TEMPLATES);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Load custom templates from localStorage
  const loadCustomTemplates = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('custom-templates') || '[]');
      setCustomTemplates(stored);
    } catch {}
  };

  useEffect(() => {
    loadCustomTemplates();
    fetch('/api/marketplace/overrides')
      .then(r => r.json())
      .then(d => {
        if (d.overrides) {
          setMarketplaceTemplates(applyOverrides(STATIC_TEMPLATES, d.overrides) as MarketplaceTemplate[]);
        }
      })
      .catch(console.error);
  }, []);

  const allTemplates = useMemo(() => [...customTemplates, ...marketplaceTemplates], [customTemplates, marketplaceTemplates]);

  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    if (activeFilter !== 'all') {
      result = result.filter(t => t.niche === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.includes(q)) ||
        (NICHE_CONFIG[t.niche as keyof typeof NICHE_CONFIG]?.label || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [allTemplates, activeFilter, searchQuery]);

  const featuredTemplates = useMemo(() =>
    marketplaceTemplates.filter(t => t.isFeatured),
  [marketplaceTemplates]);

  const handleImport = () => {
    loadCustomTemplates();
  };

  const handleToggleSelect = (id: string, selected: boolean) => {
    const next = new Set(selectedTemplateIds);
    if (selected) next.add(id);
    else next.delete(id);
    setSelectedTemplateIds(next);
  };

  const nicheCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allTemplates.length };
    allTemplates.forEach(t => {
      counts[t.niche] = (counts[t.niche] || 0) + 1;
    });
    return counts;
  }, [allTemplates]);

  return (
    <div className="space-y-8 pb-12 animate-slide-up">
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-br from-[#0c1022] via-[#070a14] to-[#030611] border border-violet-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive Website Designs
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Website Template Marketplace
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
              Ready-to-use landing page templates tailored for Gyms, Salons, Real Estate, Restaurants, and Agencies. Personalized automatically with prospect business names.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white gap-2 font-bold text-xs h-10 cursor-pointer"
                onClick={() => setShowImport(true)}
              >
                <Upload className="h-4 w-4 text-violet-400" />
                Import Custom Template
              </Button>
              <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs h-10 shadow-lg shadow-violet-600/30 cursor-pointer">
                <Link href="/templates/guide">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Template Guide
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <TemplateHeroGraphic className="w-full h-44" />
          </div>
        </div>
      </div>

      <PageGuide title="What are website templates?">
        <p>Website templates are pre-built landing pages you send to leads. Each template looks like a real website for the lead's business — personalized with their business name and niche.</p>
        <p><strong>How it works:</strong> Pick a template → it gets attached to your campaign → each lead sees a custom preview link (e.g. <em>yourtemplate.com/gold's-gym</em>) in their email.</p>
        <p>You can also <strong>import your own templates</strong> from any publicly hosted website. Start with the marketplace templates — they're proven to convert.</p>
      </PageGuide>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Templates', value: allTemplates.length, icon: '🗂️' },
          { label: 'Niches Covered', value: 6, icon: '🎯' },
          { label: 'Custom Imported', value: customTemplates.length, icon: '⬆️' },
          { label: 'Featured Picks', value: featuredTemplates.length, icon: '⭐' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f1422] border border-white/[0.08] rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by niche, keyword, feature..."
            className="pl-10 bg-[#0f1422] border-white/10 text-white h-11 focus-visible:ring-primary focus-visible:ring-1 placeholder:text-slate-400"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#0f1422] border border-white/[0.08] rounded-xl p-1 h-11">
          <button
            onClick={() => setViewMode('grid')}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Niche Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ value, label, icon }) => {
          const isActive = activeFilter === value;
          const count = nicheCounts[value] || 0;
          return (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${isActive
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/10'
                  : 'bg-[#0f1422] border-white/[0.08] text-slate-300 hover:border-white/15 hover:text-slate-100'
                }`}
            >
              <span>{icon}</span>
              {label}
              <Badge
                className={`text-[10px] px-1.5 py-0 min-w-[1.2rem] text-center border-0 ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-slate-400'}`}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Featured Section (only when "all" or when featured exist in filter) */}
      {(activeFilter === 'all' || featuredTemplates.some(t => t.niche === activeFilter)) && !searchQuery && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>⭐</span> Featured Templates
            </h2>
            <button
              className="text-xs text-primary/70 hover:text-primary flex items-center gap-1"
              onClick={() => {}}
            >
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTemplates
              .filter(t => activeFilter === 'all' || t.niche === activeFilter)
              .map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={setPreviewTemplate}
                  onUseInCampaign={setCampaignTemplate}
                  isSelected={selectedTemplateIds.has(template.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))
            }
          </div>
        </div>
      )}

      {/* All Templates Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : activeFilter === 'all'
                ? 'All Templates'
                : `${NICHE_CONFIG[activeFilter as Niche]?.label} Templates`}
            <span className="text-slate-400 font-normal text-sm ml-2">({filteredTemplates.length})</span>
          </h2>
          {customTemplates.length > 0 && (
            <Badge className="text-xs bg-primary/10 text-primary border border-primary/20 font-medium">
              {customTemplates.length} custom imported
            </Badge>
          )}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400 text-sm mb-6">Try a different search term or niche filter.</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" className="border-white/10 text-slate-200" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
                Clear Filters
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-blue-600 text-white border-0"
                onClick={() => setShowImport(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Import Template
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={setPreviewTemplate}
                onUseInCampaign={setCampaignTemplate}
                isSelected={selectedTemplateIds.has(template.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Import CTA Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-blue-600/10 to-violet-600/10 border border-primary/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">Have your own template?</h3>
          <p className="text-slate-300 text-sm">Import any website template from GitHub and use it in your campaigns instantly.</p>
        </div>
        <div className="relative flex-shrink-0 flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/10 text-slate-200 hover:bg-white/[0.06]"
            asChild
          >
            <Link href="/templates/guide">Read Guide</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 gap-2 shadow-lg"
            onClick={() => setShowImport(true)}
          >
            <Upload className="h-4 w-4" />
            Import Template
          </Button>
        </div>
      </div>

      {/* Modals */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseInCampaign={(t) => { setCampaignTemplate(t); setPreviewTemplate(null); }}
        />
      )}

      {campaignTemplate && (
        <UseInCampaignModal
          template={campaignTemplate}
          onClose={() => setCampaignTemplate(null)}
        />
      )}

      {showImport && (
        <ImportTemplateModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {/* Floating Action Bar for Selected Templates */}
      <AnimatePresence>
        {selectedTemplateIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0f1422] border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-full px-5 py-3 flex items-center gap-4 sm:gap-6 w-[90%] sm:w-auto overflow-x-auto"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {selectedTemplateIds.size}
              </span>
              <span className="text-white font-medium text-sm">Templates Selected</span>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" className="text-slate-300 hover:text-white h-9 px-2 sm:px-4" onClick={() => setSelectedTemplateIds(new Set())}>
                Clear
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white h-9 gap-1.5 whitespace-nowrap"
                onClick={() => {
                  const selectedTemplates = allTemplates.filter(t => selectedTemplateIds.has(t.id));
                  const storedData = selectedTemplates.map(t => ({
                    templateId: t.id,
                    templateName: t.name,
                    niche: t.niche,
                    previewUrl: t.previewUrl,
                    previewLinkPattern: `${t.previewUrl}/{{business_slug}}`,
                    attachedAt: new Date().toISOString(),
                  }));
                  sessionStorage.setItem('selected-campaign-templates', JSON.stringify(storedData));
                  router.push('/dashboard/campaigns/new');
                }}
              >
                Create Campaign <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
