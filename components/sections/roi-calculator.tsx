'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Sparkles, Zap, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RoiCalculatorSection() {
  const [leads, setLeads] = useState(150);
  const [pricePerSite, setPricePerSite] = useState(12000); // INR ₹12,000 average per client website

  const emailsDelivered = Math.round(leads * 0.95);
  const liveClicks = Math.round(emailsDelivered * 0.70);
  const replyLow = Math.round(emailsDelivered * 0.06);
  const replyHigh = Math.round(emailsDelivered * 0.14);
  const averageReplies = Math.round((replyLow + replyHigh) / 2);
  const closedClients = Math.max(1, Math.round(averageReplies * 0.35));
  const estimatedRevenue = closedClients * pricePerSite;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#070912]">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold mb-4">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" /> Interactive Agency Revenue Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Calculate Your <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Monthly Client Revenue</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            See how many website clients you can close each month by sending automated interactive website previews.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="bg-gradient-to-br from-[#0c1022] via-[#080b18] to-[#04060d] border border-cyan-500/20 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    Monthly Outreach Leads Target
                  </label>
                  <span className="px-3.5 py-1 rounded-full text-sm font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {leads} Businesses / month
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={leads}
                  onChange={(e) => setLeads(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2">
                  <span>20 Leads (Starter)</span>
                  <span>500 Leads</span>
                  <span>1,000 Leads (Agency)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    Average Price You Charge Per Website
                  </label>
                  <span className="px-3.5 py-1 rounded-full text-sm font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ₹{pricePerSite.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="2500"
                  value={pricePerSite}
                  onChange={(e) => setPricePerSite(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2">
                  <span>₹5,000 (Basic Site)</span>
                  <span>₹25,000 (Pro Site)</span>
                  <span>₹50,000 (Custom Build)</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[11px] text-slate-400 font-semibold">Demo Clicks</p>
                  <p className="text-lg font-bold text-white mt-0.5">{liveClicks}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[11px] text-slate-400 font-semibold">Client Replies</p>
                  <p className="text-lg font-bold text-cyan-300 mt-0.5">{replyLow}–{replyHigh}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-slate-400 font-semibold">Closed Deals</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">~{closedClients} Clients</p>
                </div>
              </div>
            </div>

            {/* Results Card (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0e172e] to-[#070c1a] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-center flex flex-col justify-between h-full shadow-2xl relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Projected Revenue
                </span>
                <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 mb-2">
                  ₹{estimatedRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-400 font-medium">Estimated gross monthly earnings from {closedClients} closed website client{closedClients > 1 ? 's' : ''}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm h-12 shadow-lg shadow-cyan-500/25 cursor-pointer" asChild>
                  <Link href="/login">
                    Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
