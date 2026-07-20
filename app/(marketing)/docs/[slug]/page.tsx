import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BookOpen, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/json-ld';

interface DocSlugPageProps {
  params: Promise<{ slug: string }>;
}

const docContent: Record<string, { title: string; desc: string; steps: string[]; body: string }> = {
  'slug-personalization-engine': {
    title: 'URL Slug Personalization Engine Guide',
    desc: 'How WebKarigar dynamically maps lead names and niches onto pre-rendered personalized site previews.',
    steps: [
      'Import prospect leads via CSV or Google Maps extractor.',
      'WebKarigar generates a unique slug (e.g., apex-dental-care).',
      'The preview endpoint injects client details directly into the responsive template preview.',
    ],
    body: 'WebKarigar uses runtime URL parameter injection and edge template rendering to display custom branding, logo placeholders, and localized headline copy for every prospect automatically.',
  },
  'lead-import-formats': {
    title: 'Lead Import Formats & CSV Standards',
    desc: 'Supported column headers and CSV formatting standards for importing prospect databases.',
    steps: [
      'Ensure your spreadsheet contains columns for Email and Name.',
      'Optional columns: Business Name, Phone, Niche, City.',
      'Drag and drop your .csv file into the Leads Dashboard.',
    ],
    body: 'Native support is built in for Chrome extension scrapers (Growman IG Extractor, MapsLeads) as well as custom exported Excel sheets.',
  },
  'multi-smtp-rotation': {
    title: 'Multi-SMTP Rotation & Inbox Deliverability Guide',
    desc: 'Configuring multiple email sender profiles to maintain 98%+ primary inbox placement.',
    steps: [
      'Navigate to Dashboard → SMTP Settings.',
      'Add custom SMTP credentials (Gmail App Passwords, SendGrid, Resend, Mailgun).',
      'Enable automated mailbox rotation during campaign execution.',
    ],
    body: 'Distributing cold email volume across multiple authenticated mailboxes prevents domain flag triggers and maximizes email deliverability.',
  },
  'credits-and-billing': {
    title: 'Credit System & Usage Policy',
    desc: 'Understanding website preview generation credits and billing cycles.',
    steps: [
      'Each lead generation or template preview claim consumes 1 credit.',
      'Free trial tier includes 10 complimentary credits.',
      'Top up credits anytime from the Billing tab.',
    ],
    body: 'Credits never expire while your account subscription remains active.',
  },
};

export async function generateMetadata({ params }: DocSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docContent[slug];
  if (!doc) return { title: 'Doc Article Not Found' };

  return {
    title: `${doc.title} | WebKarigar Docs`,
    description: doc.desc,
    alternates: {
      canonical: `/docs/${slug}`,
    },
  };
}

export default async function DocSlugPage({ params }: DocSlugPageProps) {
  const { slug } = await params;
  const doc = docContent[slug];
  if (!doc) notFound();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: 'Documentation', url: 'https://webkarigar.vercel.app/docs' },
          { name: doc.title, url: `https://webkarigar.vercel.app/docs/${slug}` },
        ]}
      />
      <HowToJsonLd
        name={doc.title}
        description={doc.desc}
        steps={doc.steps.map((step, idx) => ({ name: `Step ${idx + 1}`, text: step }))}
      />

      <article className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link href="/docs" className="inline-flex items-center text-xs font-bold text-violet-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Documentation Index
        </Link>

        <div className="space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 inline-block">
            Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-slate-400 text-base leading-relaxed">{doc.desc}</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">Execution Steps</h2>
          <ol className="space-y-4">
            {doc.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-200 font-medium">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          <div className="pt-6 border-t border-white/10 text-sm text-slate-300 leading-relaxed space-y-2">
            <h3 className="font-bold text-white">Technical Overview:</h3>
            <p>{doc.body}</p>
          </div>
        </div>
      </article>
    </main>
  );
}
