'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, Zap, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ComparisonSection() {
  const [activeNiche, setActiveNiche] = useState<'gym' | 'real-estate' | 'salon'>('gym');

  const comparisonData = {
    gym: {
      prospect: "Iron Pulse Fitness",
      oldEmail: "Hey, I am a web developer. Do you need a website for your gym? Let's get on a 30-min call to discuss pricing...",
      newDemo: "Hey Alex, I built a personalized live website preview for Iron Pulse Fitness: webkarigar.com/demo/iron-pulse. Let me know if you'd like this live!",
    },
    'real-estate': {
      prospect: "Apex Luxury Properties",
      oldEmail: "Hi, we build custom real estate websites with lead capture forms. Are you looking to upgrade your digital presence?",
      newDemo: "Hey Sarah, I made a quick interactive listing site for Apex Luxury Properties: webkarigar.com/demo/apex-properties. Check it out here!",
    },
    salon: {
      prospect: "Glow & Co. Salon",
      oldEmail: "Hello, we noticed your salon website is outdated. We offer website redesign packages starting at $500...",
      newDemo: "Hey Maya, I designed a modern booking site for Glow & Co. Salon: webkarigar.com/demo/glow-and-co. Take a look and let me know your thoughts!",
    },
  };

  const current = comparisonData[activeNiche];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#05070d]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> The Conversion Breakthrough
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Why Cold Emails Fail & How <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Showing Value Wins</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Stop sending text pitches that get marked as spam. Send personalized live website demos that force business owners to reply.
          </p>

          {/* Interactive Niche Selector */}
          <div className="flex justify-center items-center gap-2 mt-8 bg-[#0e1322] p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto">
            {(['gym', 'real-estate', 'salon'] as const).map((niche) => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer capitalize ${
                  activeNiche === niche
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {niche.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Traditional Cold Pitch (Red Glow) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#0b0e1a] border border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-rose-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-6 border-b border-rose-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">Traditional Cold Email</h3>
                  <p className="text-xs text-rose-400/80 font-medium">Text Wall Pitch · Low Trust</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                0.5% Reply Rate
              </span>
            </div>

            {/* Email Body Simulation */}
            <div className="bg-[#060812] p-5 rounded-2xl border border-white/5 font-mono text-xs text-slate-400 mb-6 leading-relaxed">
              <p className="text-slate-500 mb-2">Subject: Quick question regarding {current.prospect}...</p>
              <p className="text-slate-300">{current.oldEmail}</p>
            </div>

            {/* Negative Outcomes List */}
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2 text-rose-300/90 font-medium">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> Looks like automated spam to the prospect
              </li>
              <li className="flex items-center gap-2 text-rose-300/90 font-medium">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> Asks for 30 minutes of time before showing value
              </li>
              <li className="flex items-center gap-2 text-rose-300/90 font-medium">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> Gets deleted or sent to Spam folder
              </li>
            </ul>
          </motion.div>

          {/* Card 2: WebKarigar Visual Demo Outreach (Emerald / Violet Glow) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#0e1224] to-[#070b17] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/60 transition-all"
          >
            <div className="flex items-center justify-between mb-6 border-b border-emerald-500/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">WebKarigar Visual Pitch</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Live Site Link · High Conversion</p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                5–15% Reply Rate
              </span>
            </div>

            {/* Email Body Simulation */}
            <div className="bg-[#070a14] p-5 rounded-2xl border border-emerald-500/20 font-mono text-xs text-slate-200 mb-6 leading-relaxed shadow-inner">
              <p className="text-emerald-400 mb-2 font-bold">Subject: Made a site preview for {current.prospect}</p>
              <p className="text-slate-200">{current.newDemo}</p>
            </div>

            {/* Positive Outcomes List */}
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2 font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Prospects click & see their business name live on mobile
              </li>
              <li className="flex items-center gap-2 font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Bypasses email spam filters (under 45 words copy)
              </li>
              <li className="flex items-center gap-2 font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Prospects reply asking "How much to host this for us?"
              </li>
            </ul>

            <div className="mt-8">
              <Button size="lg" className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-sm h-12 shadow-lg shadow-emerald-500/20 cursor-pointer" asChild>
                <Link href="/login">
                  Start Sending Visual Demos <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
