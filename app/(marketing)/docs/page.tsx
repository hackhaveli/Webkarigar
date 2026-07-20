import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, BookOpen, Key, Users, Mail, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'WebKarigar Documentation & Help Knowledge Base',
  description:
    'Complete technical guide to WebKarigar: lead importing, URL slug personalization, Multi-SMTP email setup, template overrides, and analytics.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'WebKarigar Documentation & Technical Setup',
    description:
      'Learn how to set up WebKarigar for personalized website outreach and automated client acquisition.',
  },
};

const docArticles = [
  {
    slug: 'slug-personalization-engine',
    title: 'URL Slug Personalization Engine',
    desc: 'How WebKarigar dynamically injects client names, niches, and photos onto live template preview URLs.',
    icon: Sliders,
  },
  {
    slug: 'lead-import-formats',
    title: 'Lead Import & CSV Formatting',
    desc: 'Instructions for uploading Google Maps scraper exports, Instagram leads, and custom CSV spreadsheets.',
    icon: Users,
  },
  {
    slug: 'multi-smtp-rotation',
    title: 'Multi-SMTP Rotation & Inbox Deliverability',
    desc: 'Connecting Gmail, Outlook, and custom SMTP servers with automated mailbox rotation to bypass spam filters.',
    icon: Mail,
  },
  {
    slug: 'credits-and-billing',
    title: 'Credit Usage & Account Limits',
    desc: 'How website generation credits work and instructions for topping up or upgrading subscription tiers.',
    icon: Key,
  },
];

export default function DocsIndexPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: 'Documentation', url: 'https://webkarigar.vercel.app/docs' },
        ]}
      />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Authority Documentation Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            WebKarigar <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Documentation Center</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Technical guides, setup tutorials, and best practices for automated personalized website outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/docs/${art.slug}`}
              className="group p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 hover:border-violet-500/40 space-y-3 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <art.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">{art.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{art.desc}</p>
              <div className="flex items-center text-xs font-bold text-violet-400 pt-2 group-hover:translate-x-1 transition-transform">
                Read Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
