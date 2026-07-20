'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Eye, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NICHE_CONFIG, Niche } from '@/lib/marketplace-templates';

export default function DemoPage() {
  const [businessName, setBusinessName] = useState('Apex Dental Care');
  const [selectedNiche, setSelectedNiche] = useState<Niche>('gym');
  const [previewGenerated, setPreviewGenerated] = useState(false);

  const niches = Object.keys(NICHE_CONFIG) as Niche[];

  const generatedSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const previewUrl = `/preview?template=${selectedNiche}&clientName=${encodeURIComponent(businessName)}&slug=${generatedSlug}`;

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive SEO Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Generate a <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Live Personalized Website</span> in 3 Seconds
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Type any business name below to test WebKarigar&apos;s instant website preview generator. This is the exact personalized preview your prospects see when opening your cold emails.
          </p>
        </div>

        {/* Live Personalization Sandbox */}
        <div className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prospect Business Name</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. FitZone Gym & Spa"
                className="bg-[#07090e] border-white/15 text-white h-12 text-base font-semibold focus-visible:ring-violet-500"
              />
            </div>

            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry / Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.map((niche) => {
                  const conf = NICHE_CONFIG[niche];
                  return (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedNiche === niche
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {conf.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Preview URL: <span className="font-mono text-violet-300">webkarigar.com/preview?client={generatedSlug}</span>
            </div>

            <Button
              onClick={() => setPreviewGenerated(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold h-11 px-8 rounded-full shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" /> Launch Live Interactive Preview
            </Button>
          </div>

          {/* Rendered Preview Wireframe */}
          {previewGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-violet-500/30 rounded-2xl bg-[#070a14] p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400 font-mono ml-2">Viewing live demo as: <strong>{businessName}</strong></span>
                </div>
                <Link
                  href={previewUrl}
                  target="_blank"
                  className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1"
                >
                  Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-8 text-center bg-gradient-to-br from-violet-950/20 via-slate-900 to-indigo-950/20 rounded-xl border border-white/5 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {NICHE_CONFIG[selectedNiche].label} Website Preview
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome to {businessName || 'Your Business'}
                </h2>
                <p className="text-slate-300 text-sm max-w-xl mx-auto">
                  Premium custom web design generated dynamically for {businessName || 'prospect'}. Ready to launch in 1-click.
                </p>
                <div className="pt-2">
                  <Button asChild size="sm" className="bg-emerald-500 text-black font-bold hover:bg-emerald-400 rounded-full">
                    <Link href="/signup">Claim This Site Demo & Send Outreach</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Niche Ecosystem Shortcuts */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-white mb-6">Explore Niche-Specific Interactive Demos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {niches.map((niche) => (
              <Link
                key={niche}
                href={`/demo/${niche}`}
                className="p-3.5 rounded-2xl bg-[#0c1020] border border-white/10 hover:border-violet-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all text-center block"
              >
                {NICHE_CONFIG[niche].label} Demo →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
