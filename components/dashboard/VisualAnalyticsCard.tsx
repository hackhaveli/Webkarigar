'use client';

import React from 'react';
import { TrendingUp, Users, Mail, CheckCircle2, MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface VisualAnalyticsCardProps {
  leadsCount: number;
  totalSent: number;
  successRate: number;
  credits: number;
  isProActive: boolean;
  planExpiresOn: string | null;
}

export function VisualAnalyticsCard({
  leadsCount,
  totalSent,
  successRate,
  credits,
  isProActive,
  planExpiresOn,
}: VisualAnalyticsCardProps) {
  const replyLow = Math.round(totalSent * 0.05);
  const replyHigh = Math.round(totalSent * 0.15);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Leads Metric */}
      <div className="bg-gradient-to-br from-[#0e1322] to-[#070a14] border border-violet-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" /> Leads Database
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
            Target Ready
          </span>
        </div>
        <p className="text-4xl font-black text-white mb-1">{leadsCount}</p>
        <p className="text-xs text-slate-400 font-medium">Businesses imported & active</p>
        
        {/* SVG Sparkline graphic */}
        <div className="mt-4 pt-3 stroke-violet-400/40 fill-violet-500/10 border-t border-white/5">
          <svg className="w-full h-8" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0 20 Q 25 5, 50 15 T 100 8 L 100 25 L 0 25 Z" fill="currentColor"/>
            <path d="M0 20 Q 25 5, 50 15 T 100 8" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* 2. Reached Metric */}
      <div className="bg-gradient-to-br from-[#0a1526] to-[#060d1a] border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" /> Demos Delivered
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Outreach
          </span>
        </div>
        <p className="text-4xl font-black text-white mb-1">{totalSent}</p>
        {totalSent > 0 ? (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> ~{replyLow}–{replyHigh} est. client replies
          </p>
        ) : (
          <p className="text-xs text-slate-400 font-medium">Personalized emails delivered</p>
        )}

        {/* SVG Sparkline graphic */}
        <div className="mt-4 pt-3 stroke-blue-400/40 fill-blue-500/10 border-t border-white/5">
          <svg className="w-full h-8" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path d="M0 18 Q 20 22, 40 10 T 100 5 L 100 25 L 0 25 Z" fill="currentColor"/>
            <path d="M0 18 Q 20 22, 40 10 T 100 5" stroke="#3b82f6" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* 3. Delivery Rate Metric */}
      <div className="bg-gradient-to-br from-[#071a15] to-[#040e0c] border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Delivery Health
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Inbox Rate
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black text-white mb-1">{successRate}%</p>
        </div>
        <p className="text-xs text-slate-400 font-medium">Landed directly in main inbox</p>

        {/* Radial meter visual */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${successRate || 100}%` }} />
          </div>
        </div>
      </div>

      {/* 4. Credits & Pro Badge Card */}
      <div className={`bg-gradient-to-br from-[#1c1208] to-[#0c0804] border rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 ${
        credits <= 10 ? 'border-amber-500/40 hover:border-amber-500/70' : 'border-amber-500/20 hover:border-amber-500/50'
      }`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Available Credits
          </span>
          {isProActive && (
            <span className="text-[9px] font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-violet-400" /> PRO
            </span>
          )}
        </div>
        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mb-1">
          {credits}
        </p>
        {isProActive ? (
          <p className="text-xs text-violet-300 font-semibold">Pro active · expires {planExpiresOn}</p>
        ) : credits <= 10 ? (
          <p className="text-xs text-amber-400 font-semibold">
            ⚠ Low credits · <Link href="/dashboard/pricing" className="underline hover:text-white">Get 2,000 for ₹1</Link>
          </p>
        ) : (
          <p className="text-xs text-slate-400 font-medium">1 credit = 1 personalized website pitch</p>
        )}

        <div className="mt-4 pt-3 border-t border-amber-500/10 flex justify-end">
          <Link href="/dashboard/pricing" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
            Top Up Credits →
          </Link>
        </div>
      </div>
    </div>
  );
}
