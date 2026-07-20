import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaqPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

interface FeaturePageProps {
  params: Promise<{ feature: string }>;
}

const featureData: Record<
  string,
  { title: string; subtitle: string; desc: string; bullets: string[]; faqs: { question: string; answer: string }[] }
> = {
  'personalized-websites': {
    title: 'AI Website Personalization Engine',
    subtitle: 'Generate live, customized website previews for business leads in 3 seconds.',
    desc: 'WebKarigar replaces generic proposals with live interactive website previews. Automatically inject client names, niches, and service offerings into responsive mobile-ready templates.',
    bullets: [
      'Zero manual coding or design required',
      'Supports Gym, Salon, Real Estate, Restaurant & Coaching niches',
      'Dynamic URL slug generation for email tracking',
    ],
    faqs: [
      {
        question: 'How does website personalization increase cold email reply rates?',
        answer: 'Showing a working website preview demonstrates immediate value and capability, making prospects 3x more likely to reply than standard text emails.',
      },
    ],
  },
  'email-campaigns': {
    title: 'Automated Cold Email Outreach Engine',
    subtitle: 'Multi-SMTP mailbox rotation for 98%+ inbox deliverability.',
    desc: 'Connect your Gmail, Outlook, or custom SMTP servers. Rotate sending mailboxes automatically and embed short personalized site preview links directly in your email copy.',
    bullets: [
      'Multi-SMTP mailbox rotation to bypass spam filters',
      'Automated follow-up sequence scheduling',
      'Real-time open, click, and reply tracking',
    ],
    faqs: [
      {
        question: 'Can I connect multiple email accounts?',
        answer: 'Yes. WebKarigar supports unlimited custom SMTP connections with automatic load balancing.',
      },
    ],
  },
  'lead-generation': {
    title: 'AI Lead Generation & Scraping Suite',
    subtitle: 'Extract verified local business leads running Meta Ads.',
    desc: 'Identify active businesses investing in digital advertising. Gemini AI scores lead quality and extracts verified owner contact details for high-ticket web design outreach.',
    bullets: [
      'Meta Ads library lead extraction',
      'AI lead quality scoring & niche classification',
      'Native drag-and-drop CSV export compatibility',
    ],
    faqs: [
      {
        question: 'Where does WebKarigar source business leads?',
        answer: 'WebKarigar scans active Meta Ads running in local niches to find businesses with active advertising budgets.',
      },
    ],
  },
};

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { feature } = await params;
  const feat = featureData[feature];
  if (!feat) return { title: 'Feature Not Found' };

  return {
    title: `${feat.title} | WebKarigar Features`,
    description: feat.desc,
    alternates: {
      canonical: `/features/${feature}`,
    },
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { feature } = await params;
  const feat = featureData[feature];
  if (!feat) notFound();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FaqPageJsonLd faqs={feat.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: feat.title, url: `https://webkarigar.vercel.app/features/${feature}` },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 inline-block">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {feat.title}
          </h1>
          <p className="text-slate-400 text-base">{feat.desc}</p>
        </div>

        <div className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white">Core Capabilities</h2>
          <ul className="space-y-3">
            {feat.bullets.map((b, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-white/10 flex justify-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">
              <Link href="/demo">Test Live Demo Engine →</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
