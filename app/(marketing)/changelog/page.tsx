import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, GitCommit, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'WebKarigar Changelog & Product Release Updates',
  description:
    'Stay up to date with new feature releases, performance improvements, and template additions to WebKarigar.',
  alternates: {
    canonical: '/changelog',
  },
};

const releases = [
  {
    version: 'v1.4.0',
    date: 'July 20, 2026',
    title: 'Interactive SEO Engine & Dynamic OpenGraph Generator',
    features: [
      'Introduced indexable live demo builder at /demo and /demo/[niche].',
      'Added dynamic OpenGraph social image generation via Edge Runtime.',
      'Implemented native RSS 2.0 feed endpoint at /feed.xml.',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'July 15, 2026',
    title: 'Multi-SMTP Mailbox Rotation & AI Lead Qualifier',
    features: [
      'Added automated Multi-SMTP rotation for high deliverability.',
      'Integrated Gemini AI lead scoring and meta ad qualifier.',
      'Added 6 new industry template designs to the Marketplace.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: 'Changelog', url: 'https://webkarigar.vercel.app/changelog' },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <GitCommit className="w-3.5 h-3.5 text-amber-400" /> Product Transparency
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            WebKarigar <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Changelog</span>
          </h1>
          <p className="text-slate-400 text-base">
            Recent updates, new features, and technical enhancements shipped to WebKarigar.
          </p>
        </div>

        <div className="space-y-8">
          {releases.map((rel, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-600 text-white">
                    {rel.version}
                  </span>
                  <h2 className="text-lg font-bold text-white">{rel.title}</h2>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {rel.date}
                </div>
              </div>

              <ul className="space-y-2 pt-2">
                {rel.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
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
