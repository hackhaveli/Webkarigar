import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, MapPin, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'WebKarigar Public Product Roadmap',
  description:
    'Explore upcoming features, template expansions, and outreach automation planned for WebKarigar.',
  alternates: {
    canonical: '/roadmap',
  },
};

const roadmapItems = [
  {
    quarter: 'In Progress (Q3 2026)',
    status: 'active',
    items: [
      'Interactive SEO Engine Expansion (/demo/[niche])',
      'Free Interactive Agency Tools Hub (/tools)',
      'Automated RSS 2.0 Feed Integration (/feed.xml)',
    ],
  },
  {
    quarter: 'Planned (Q4 2026)',
    status: 'planned',
    items: [
      'AI Cold Email Reply Classifier & Automated Follow-Up Sequences',
      'Custom Domain Mapping for Personalized Website Previews',
      'Customer Website Showcase (/showcase - Auto-displaying approved client sites)',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: 'Roadmap', url: 'https://webkarigar.com/roadmap' },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> Public Product Roadmap
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What We Are <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Building Next</span>
          </h1>
          <p className="text-slate-400 text-base">
            Transparent view into upcoming releases and product milestones for WebKarigar.
          </p>
        </div>

        <div className="space-y-8">
          {roadmapItems.map((sec, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${sec.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                  {sec.quarter}
                </span>
              </div>

              <ul className="space-y-3 pt-2">
                {sec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${sec.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
