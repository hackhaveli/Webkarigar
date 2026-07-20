import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, Check, X, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaqPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

interface CompetitorPageProps {
  params: Promise<{ competitor: string }>;
}

const competitorData: Record<
  string,
  { name: string; tag: string; desc: string; matrix: { feature: string; webkarigar: boolean; competitor: boolean }[]; faqs: { question: string; answer: string }[] }
> = {
  instantly: {
    name: 'Instantly.ai',
    tag: 'Cold Email vs Personalized Website Outreach',
    desc: 'While Instantly focuses on mass text cold emails, WebKarigar generates personalized website previews before sending outreach to skyrocket reply rates.',
    matrix: [
      { feature: 'Personalized Website Previews', webkarigar: true, competitor: false },
      { feature: 'Live Interactive Demo Links', webkarigar: true, competitor: false },
      { feature: 'Multi-SMTP Rotation', webkarigar: true, competitor: true },
      { feature: 'Industry Template Marketplace', webkarigar: true, competitor: false },
      { feature: 'Visual Value-First Pitching', webkarigar: true, competitor: false },
    ],
    faqs: [
      {
        question: 'Why does WebKarigar convert better than Instantly for web designers?',
        answer: 'Instantly sends text proposals that compete with hundreds of generic emails. WebKarigar sends working personalized website previews that prove skill instantly.',
      },
    ],
  },
  mailchimp: {
    name: 'Mailchimp',
    tag: 'Newsletter Tool vs Cold Client Acquisition Engine',
    desc: 'Mailchimp is built for opt-in newsletters. WebKarigar is built specifically for cold client acquisition, personalized site generation, and B2B outreach.',
    matrix: [
      { feature: 'Cold Outreach Deliverability', webkarigar: true, competitor: false },
      { feature: 'Dynamic Website Generation', webkarigar: true, competitor: false },
      { feature: 'Lead Scraper & Enricher', webkarigar: true, competitor: false },
      { feature: 'Newsletter Campaigns', webkarigar: false, competitor: true },
    ],
    faqs: [
      {
        question: 'Can I use Mailchimp for cold outreach?',
        answer: 'No. Mailchimp bans cold email lists. WebKarigar is specifically built for cold B2B client acquisition with dedicated SMTP support.',
      },
    ],
  },
  lemlist: {
    name: 'Lemlist',
    tag: 'Image Personalization vs Full Website Personalization',
    desc: 'Lemlist personalizes static images inside emails. WebKarigar generates full, responsive interactive websites that prospects can open and test live.',
    matrix: [
      { feature: 'Full Interactive Website Generation', webkarigar: true, competitor: false },
      { feature: 'Static Image Overlay', webkarigar: true, competitor: true },
      { feature: 'Niche Template Marketplace', webkarigar: true, competitor: false },
      { feature: 'Client Acquisition Dashboard', webkarigar: true, competitor: true },
    ],
    faqs: [
      {
        question: 'What is the difference between Lemlist image overlays and WebKarigar?',
        answer: 'Lemlist embeds flat images. WebKarigar generates full, working websites with custom branding and interactive desktop/mobile views.',
      },
    ],
  },
};

export async function generateMetadata({ params }: CompetitorPageProps): Promise<Metadata> {
  const { competitor } = await params;
  const comp = competitorData[competitor];
  if (!comp) return { title: 'Comparison Not Found' };

  return {
    title: `WebKarigar vs ${comp.name} | Head-to-Head Outreach Comparison`,
    description: comp.desc,
    alternates: {
      canonical: `/vs/${competitor}`,
    },
  };
}

export default async function CompetitorPage({ params }: CompetitorPageProps) {
  const { competitor } = await params;
  const comp = competitorData[competitor];
  if (!comp) notFound();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FaqPageJsonLd faqs={comp.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: `WebKarigar vs ${comp.name}`, url: `https://webkarigar.com/vs/${competitor}` },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 inline-block">
            {comp.tag}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            WebKarigar vs <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{comp.name}</span>
          </h1>
          <p className="text-slate-400 text-base">{comp.desc}</p>
        </div>

        {/* Feature Matrix */}
        <div className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Feature Breakdown</h2>
          <div className="divide-y divide-white/10">
            {comp.matrix.map((row, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-slate-200">{row.feature}</span>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1 text-violet-400">
                    <span className="hidden sm:inline text-slate-400">WebKarigar:</span>
                    {row.webkarigar ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="hidden sm:inline">{comp.name}:</span>
                    {row.competitor ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold">
            <Link href="/demo">Switch to Personalized Website Outreach →</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
