import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, ArrowRight, Check, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NICHE_CONFIG, Niche } from '@/lib/marketplace-templates';
import { FaqPageJsonLd, SoftwareApplicationJsonLd } from '@/components/seo/json-ld';

interface NicheDemoPageProps {
  params: Promise<{ niche: string }>;
}

export async function generateMetadata({ params }: NicheDemoPageProps): Promise<Metadata> {
  const { niche } = await params;
  const config = NICHE_CONFIG[niche as Niche];
  if (!config) return { title: 'Niche Demo Not Found' };

  return {
    title: `Live ${config.label} Website Personalization Demo`,
    description: `Test WebKarigar's instant ${config.label} website generator. See how personalized site previews double cold outreach reply rates for web design agencies.`,
    alternates: {
      canonical: `/demo/${niche}`,
    },
    openGraph: {
      title: `Live ${config.label} Website Personalization Demo | WebKarigar`,
      description: `Generate a personalized ${config.label} website preview in seconds. Stop pitching text proposals and start showing live value.`,
    },
  };
}

export default async function NicheDemoPage({ params }: NicheDemoPageProps) {
  const { niche } = await params;
  const config = NICHE_CONFIG[niche as Niche];
  if (!config) notFound();

  const faqs = [
    {
      question: `How does WebKarigar generate ${config.label} website previews?`,
      answer: `WebKarigar dynamically injects prospect business names, niche service highlights, and localized branding onto pre-built high-converting ${config.label} templates.`,
    },
    {
      question: `Why do personalized website previews increase reply rates for ${config.label} outreach?`,
      answer: `Business owners receive dozens of text-only pitch emails daily. Sending a working personalized website preview immediately proves capability and captures attention.`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FaqPageJsonLd faqs={faqs} />
      <SoftwareApplicationJsonLd name={`WebKarigar ${config.label} Demo Engine`} />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border border-current inline-block`}>
            Interactive SEO Engine · {config.label}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Live Personalized <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{config.label} Website</span> Demo
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Experience how WebKarigar automates client acquisition for web designers targeting {config.label.toLowerCase()} prospects.
          </p>
        </div>

        {/* Demo Box */}
        <div className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Want to see how your {config.label} prospect views your proposal?
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Click below to generate a live, interactive site preview using our pre-built high-converting {config.label} template.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">
              <Link href={`/preview?template=${niche}&clientName=Sample%20${encodeURIComponent(config.label)}&slug=sample-${niche}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" /> Launch {config.label} Live Demo
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/10 text-slate-300 hover:bg-white/5">
              <Link href="/templates">Browse All Templates</Link>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0b0f1d] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-violet-300">{faq.question}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
