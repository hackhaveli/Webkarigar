'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Zap, Play, ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PipelineHeroIllustration,
  SmtpBadgeIllustration,
  LeadMagnetIllustration,
  TemplateDesignIllustration,
  LaunchRocketIllustration,
} from './illustrations/DashboardIllustrations';

interface Step {
  label: string;
  sublabel: string;
  done: boolean;
  href: string;
  Illustration: React.ComponentType<{ className?: string }>;
}

interface VisualWorkflowBannerProps {
  smtpCount: number;
  leadsCount: number;
  templatesCount: number;
  campaignsCount: number;
}

export function VisualWorkflowBanner({
  smtpCount,
  leadsCount,
  templatesCount,
  campaignsCount,
}: VisualWorkflowBannerProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'pipeline'>('visual');

  const steps: Step[] = [
    {
      label: '1. Connect SMTP',
      sublabel: 'Link your Gmail or custom domain mail server',
      done: smtpCount > 0,
      href: '/dashboard/smtp',
      Illustration: SmtpBadgeIllustration,
    },
    {
      label: '2. Import Leads',
      sublabel: 'Upload CSV or use AI Lead Finder',
      done: leadsCount > 0,
      href: '/dashboard/leads',
      Illustration: LeadMagnetIllustration,
    },
    {
      label: '3. Website Design',
      sublabel: 'Select live interactive demo template',
      done: templatesCount > 0,
      href: '/dashboard/templates',
      Illustration: TemplateDesignIllustration,
    },
    {
      label: '4. Launch Outreach',
      sublabel: 'Send personalized site previews & get replies',
      done: campaignsCount > 0,
      href: '/dashboard/campaigns/new',
      Illustration: LaunchRocketIllustration,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="bg-gradient-to-br from-[#0c1022] via-[#070a14] to-[#030611] border border-violet-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar: Title + View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Automated Outreach Workflow
            </span>
            <span className="text-xs text-slate-400 font-semibold">{completedCount} of 4 Completed</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Your Outreach Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Complete the 4 visual steps to send interactive personalized website demos directly to business owners.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-[#12182b] p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'visual'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Step Cards
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Pipeline Flow
          </button>
        </div>
      </div>

      {/* Overall Progress Meter */}
      <div className="mb-8 relative z-10 bg-[#0e1426] p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center text-xs font-bold mb-2">
          <span className="text-slate-300">Outreach Readiness Score</span>
          <span className="text-violet-400 font-extrabold">{Math.round(progress)}% Ready</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-slate-800" />
      </div>

      {/* Main Tab Views */}
      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] ${
                step.done
                  ? 'bg-[#0f172a]/90 border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.08)]'
                  : 'bg-[#0c1222]/90 border-violet-500/20 hover:border-violet-500/50 shadow-xl'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <step.Illustration className="w-12 h-12" />
                  {step.done ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors mb-1">
                  {step.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">{step.sublabel}</p>
              </div>

              <Button
                size="sm"
                className={`w-full font-bold text-xs h-9 transition-all duration-200 cursor-pointer ${
                  step.done
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20'
                }`}
                asChild
              >
                <Link href={step.href}>
                  {step.done ? 'Manage' : 'Setup Now'} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 bg-[#070b17] p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
          <PipelineHeroIllustration className="w-full max-w-3xl h-52 mb-4" />
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs" asChild>
              <Link href="/dashboard/campaigns/new">
                <Play className="w-3.5 h-3.5 mr-1.5" /> Start Outreach Campaign
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
