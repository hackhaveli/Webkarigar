import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, Mail, Link as LinkIcon, ArrowRight, Zap, Target } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Free Web Design & Outreach SEO Tools | WebKarigar',
  description:
    'Free interactive tools for web design freelancers and cold outreach agencies: Cold Email Subject Generator, Business URL Slug Generator, and High-Converting CTA Generator.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Web Design & Cold Email Tools | WebKarigar',
    description:
      'Supercharge your cold outreach with WebKarigar’s free interactive tools.',
  },
};

const freeTools = [
  {
    slug: 'cold-email-subject-generator',
    title: 'Cold Email Subject Line Generator',
    description: 'Generate high-open-rate subject lines optimized for personalized website outreach.',
    icon: Mail,
    color: 'from-violet-500 to-indigo-600',
    badge: 'High Open Rate',
  },
  {
    slug: 'business-slug-generator',
    title: 'Business URL Slug Formatter',
    description: 'Instantly format raw business prospect names into clean, URL-safe website preview slugs.',
    icon: LinkIcon,
    color: 'from-cyan-500 to-blue-600',
    badge: 'URL Optimizer',
  },
  {
    slug: 'cta-generator',
    title: 'Outreach Call-to-Action (CTA) Generator',
    description: 'Craft low-friction calls to action that encourage business owners to view their live site preview.',
    icon: Target,
    color: 'from-pink-500 to-rose-600',
    badge: 'Conversion Booster',
  },
];

export default function ToolsHubPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: 'Tools', url: 'https://webkarigar.vercel.app/tools' },
        ]}
      />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Free Interactive Tools
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Free Tools for <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Agency Growth & Outreach</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Boost your cold email open rates, streamline lead slug formatting, and generate conversion-focused CTAs.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freeTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-[#0b0f1d] border border-white/10 hover:border-violet-500/40 rounded-3xl p-6 space-y-4 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white shadow-lg`}>
                  <tool.icon className="w-6 h-6" />
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 inline-block">
                  {tool.badge}
                </span>

                <h2 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  {tool.title}
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-violet-400 pt-4 border-t border-white/5 group-hover:translate-x-1 transition-transform">
                Launch Free Tool <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
