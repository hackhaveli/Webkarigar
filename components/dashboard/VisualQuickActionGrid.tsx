'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Search, Mail, LayoutTemplate, FileText, Send, ArrowRight, Sparkles } from 'lucide-react';

const quickActions = [
  {
    title: 'Upload Leads CSV',
    desc: 'Bulk import business leads with emails & names',
    href: '/dashboard/leads',
    icon: UploadCloud,
    badge: 'Popular',
    gradient: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'text-blue-400',
  },
  {
    title: 'AI Lead Finder',
    desc: 'Scrape active Meta Ads & verify emails with AI',
    href: '/dashboard/lead-generation',
    badge: 'AI Powered',
    icon: Search,
    gradient: 'from-violet-600/20 to-fuchsia-600/10 border-violet-500/30 hover:border-violet-500/60',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Connect SMTP',
    desc: 'Link Gmail, Outlook, or custom SMTP server',
    href: '/dashboard/smtp',
    badge: 'Required',
    icon: Mail,
    gradient: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Website Templates',
    desc: 'Pick interactive designs for your prospects',
    href: '/dashboard/templates',
    badge: 'Visual Demos',
    icon: LayoutTemplate,
    gradient: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Email Pitch Templates',
    desc: 'Customize high-converting short email copy',
    href: '/dashboard/email-templates',
    badge: 'High Reply',
    icon: FileText,
    gradient: 'from-pink-600/20 to-rose-600/10 border-pink-500/30 hover:border-pink-500/60',
    iconColor: 'text-pink-400',
  },
  {
    title: 'Launch Campaign',
    desc: 'Deliver personalized website links to leads',
    href: '/dashboard/campaigns/new',
    badge: 'Outreach',
    icon: Send,
    gradient: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30 hover:border-cyan-500/60',
    iconColor: 'text-cyan-400',
  },
];

export function VisualQuickActionGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Quick Actions & Tools
        </h3>
        <span className="text-xs text-slate-400 font-semibold">1-Click Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className={`p-5 rounded-2xl border bg-gradient-to-br ${action.gradient} backdrop-blur-xl transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${action.iconColor}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                  {action.badge}
                </span>
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors flex items-center justify-between">
                {action.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
