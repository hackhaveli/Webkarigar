'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Brain, MessageSquare, ExternalLink, Users, ChevronRight, Sparkles, List } from 'lucide-react';
import { toast } from 'sonner';
import { PageGuide } from '@/components/dashboard/PageGuide';

interface Niche {
  value: string;
  label: string;
}

interface ScrapeStats {
  total: number;
  new: number;
  duplicates: number;
}

interface ClassifyStats {
  total: number;
  leads: number;
  rejected: number;
  lowConfidence: number;
}

interface EnrichStats {
  total: number;
  enriched: number;
  errors: number;
}

import { LeadFinderGraphic } from '@/components/dashboard/illustrations/SubsectionIllustrations';

export default function LeadGenerationPipelinePage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [niche, setNiche] = useState('gym');
  const [country, setCountry] = useState('IN');
  const [maxItems, setMaxItems] = useState(200);
  const [batchSize, setBatchSize] = useState(10);

  const [scrapeResult, setScrapeResult] = useState<{ success: boolean; stats?: ScrapeStats; error?: string } | null>(null);
  const [classifyResult, setClassifyResult] = useState<{ success: boolean; stats?: ClassifyStats; error?: string } | null>(null);
  const [enrichResult, setEnrichResult] = useState<{ success: boolean; stats?: EnrichStats; error?: string } | null>(null);

  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [classifyLoading, setClassifyLoading] = useState(false);
  const [enrichLoading, setEnrichLoading] = useState(false);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      const res = await fetch('/api/lead-gen/niches');
      const data = await res.json();
      if (data.niches && data.niches.length > 0) {
        setNiches(data.niches);
        setNiche(data.niches[0].value);
      }
    } catch (e) {
      console.error('Failed to load niches:', e);
    }
  };

  const runScrape = async () => {
    setScrapeLoading(true);
    setScrapeResult(null);
    try {
      const res = await fetch('/api/lead-gen/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, country, maxItems }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScrapeResult({
        success: true,
        stats: {
          total: data.stats.totalCount !== undefined ? data.stats.totalCount : data.stats.scraped,
          new: data.stats.newCount !== undefined ? data.stats.newCount : data.stats.new,
          duplicates: data.stats.dupCount !== undefined ? data.stats.dupCount : data.stats.duplicates,
        },
      });
      toast.success(`Scraped ${data.stats.newCount ?? data.stats.new ?? 0} new ads for ${niche}!`);
    } catch (err: any) {
      setScrapeResult({ success: false, error: err.message });
      toast.error(`Scrape failed: ${err.message}`);
    } finally {
      setScrapeLoading(false);
    }
  };

  const runClassify = async () => {
    setClassifyLoading(true);
    setClassifyResult(null);
    try {
      const res = await fetch('/api/lead-gen/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, batchSize }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClassifyResult({ success: true, stats: data.stats });
      toast.success(`Classified ${data.stats.total} ads — ${data.stats.leads} leads found!`);
    } catch (err: any) {
      setClassifyResult({ success: false, error: err.message });
      toast.error(`Classification failed: ${err.message}`);
    } finally {
      setClassifyLoading(false);
    }
  };

  const runEnrich = async () => {
    setEnrichLoading(true);
    setEnrichResult(null);
    try {
      const res = await fetch('/api/lead-gen/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEnrichResult({ success: true, stats: data.stats });
      toast.success(`Enriched ${data.stats.enriched} leads!`);
    } catch (err: any) {
      setEnrichResult({ success: false, error: err.message });
      toast.error(`Enrichment failed: ${err.message}`);
    } finally {
      setEnrichLoading(false);
    }
  };

  const countries = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AE', label: 'UAE' },
    { value: 'AU', label: 'Australia' },
    { value: 'CA', label: 'Canada' },
  ];

  return (
    <div className="animate-slide-up space-y-6">
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-br from-[#0c1022] via-[#070a14] to-[#030611] border border-cyan-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" /> Meta Ads Scraper + Gemini AI
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              AI Lead Finder Pipeline
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
              Automatically discover businesses actively spending money on Meta Ads. Classify prospects with Gemini AI and extract verified contact emails for instant outreach.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white font-bold text-xs h-10 cursor-pointer" asChild>
                <Link href="/dashboard/lead-generation/leads">
                  <List className="h-4 w-4 mr-2 text-cyan-400" /> View Discovered Leads
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <LeadFinderGraphic className="w-full h-44" />
          </div>
        </div>
      </div>

      <PageGuide title="How the AI Lead Finder works">
        <p>This pipeline finds local businesses that don't have a website — your ideal clients.</p>
        <p><strong>Step 1 — Scrape:</strong> Queries Meta Ads Archive for active ads in your chosen niche/country.</p>
        <p><strong>Step 2 — Classify:</strong> AI (Gemini) evaluates each ad to identify businesses without websites, extracts phone numbers.</p>
        <p><strong>Step 3 — Enrich:</strong> Generates personalized demo links and WhatsApp message drafts for each qualified lead.</p>
        <p>Run the steps in order. After enrichment, review your leads in <strong>Found Leads</strong> (sidebar).</p>
      </PageGuide>

      {/* Pipeline Parameters */}
      <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl">
        <CardHeader className="border-b border-white/[0.08] pb-4">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Pipeline Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Niche Target</label>
              <select
                className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              >
                {niches.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Country</label>
              <select
                className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Max Ads</label>
              <input
                type="number"
                className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={maxItems}
                onChange={(e) => setMaxItems(parseInt(e.target.value) || 200)}
                min={10}
                max={1000}
              />
            </div>
            <div className="space-y-2 min-w-[120px]">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AI Batch Size</label>
              <input
                type="number"
                className="w-full bg-[#07090e] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
                min={1}
                max={25}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Steps */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Step 1: Scrape */}
        <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl hover:border-emerald-500/30 transition-all flex flex-col">
          <CardContent className="pt-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">1</div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                Meta Ads Scrape
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
              Query Meta Ads Archive using your access token. Downloads active ads, hashes duplicates, and saves raw data.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              onClick={runScrape}
              disabled={scrapeLoading}
            >
              {scrapeLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Querying Meta API...</> : 'Run Scrape'}
            </Button>
            {scrapeResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${scrapeResult.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {scrapeResult.success ? (
                  <>
                    <div className="font-semibold mb-1">Scrape Completed</div>
                    <div className="text-xs text-slate-300">
                      New: <span className="text-emerald-400 font-medium">{scrapeResult.stats?.new}</span> |
                      Total: <span className="text-white font-medium">{scrapeResult.stats?.total}</span> |
                      Duplicates: <span className="text-amber-400 font-medium">{scrapeResult.stats?.duplicates}</span>
                    </div>
                  </>
                ) : (
                  <div className="font-semibold">Failed: {scrapeResult.error}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Classify */}
        <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl hover:border-amber-500/30 transition-all flex flex-col">
          <CardContent className="pt-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">2</div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                AI Classification
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
              Gemini 2.5 Flash AI evaluates raw ads to identify local businesses without websites. Extracts phone numbers and flags qualified leads.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
              onClick={runClassify}
              disabled={classifyLoading}
            >
              {classifyLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI Processing...</> : 'Run Classification'}
            </Button>
            {classifyResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${classifyResult.success ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {classifyResult.success ? (
                  <>
                    <div className="font-semibold mb-1">Classification Complete</div>
                    <div className="text-xs text-slate-300">
                      Leads: <span className="text-emerald-400 font-medium">{classifyResult.stats?.leads}</span> |
                      Rejected: <span className="text-slate-300 font-medium">{classifyResult.stats?.rejected}</span> |
                      Total: <span className="text-white font-medium">{classifyResult.stats?.total}</span>
                    </div>
                  </>
                ) : (
                  <div className="font-semibold">Failed: {classifyResult.error}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Enrich */}
        <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl hover:border-blue-500/30 transition-all flex flex-col">
          <CardContent className="pt-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">3</div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Lead Enrichment
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
              Generate personalized WhatsApp message drafts, demo website links, and cleaned phone numbers for each qualified lead.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
              onClick={runEnrich}
              disabled={enrichLoading}
            >
              {enrichLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Drafting Offers...</> : 'Run Enrichment'}
            </Button>
            {enrichResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${enrichResult.success ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {enrichResult.success ? (
                  <>
                    <div className="font-semibold mb-1">Enrichment Complete</div>
                    <div className="text-xs text-slate-300">
                      Enriched: <span className="text-emerald-400 font-medium">{enrichResult.stats?.enriched}</span> |
                      Errors: <span className="text-red-400 font-medium">{enrichResult.stats?.errors}</span>
                    </div>
                  </>
                ) : (
                  <div className="font-semibold">Failed: {enrichResult.error}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card className="bg-[#0f1422] border-white/[0.08] shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Pipeline finished?</p>
                <p className="text-slate-400 text-xs">Review, export, and manage your generated leads</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/10 bg-[#07090e] text-white hover:bg-white/[0.06]" asChild>
                <Link href="/dashboard/lead-generation/leads">
                  <List className="w-4 h-4 mr-2" />
                  View Generated Leads
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" asChild>
                <Link href="/dashboard/templates">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Templates
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
