import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, Eye, Check, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MARKETPLACE_TEMPLATES, NICHE_CONFIG, Niche } from '@/lib/marketplace-templates';
import { FaqPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

interface NicheTemplatePageProps {
  params: Promise<{ niche: string }>;
}

export async function generateMetadata({ params }: NicheTemplatePageProps): Promise<Metadata> {
  const { niche } = await params;
  const config = NICHE_CONFIG[niche as Niche];
  if (!config) return { title: 'Template Niche Not Found' };

  return {
    title: `High-Converting ${config.label} Website Templates for Outreach`,
    description: `Browse curated ${config.label} website templates. Instantly generate personalized website previews for ${config.label.toLowerCase()} leads to close cold outreach clients.`,
    alternates: {
      canonical: `/templates/${niche}`,
    },
    openGraph: {
      title: `${config.label} Website Templates | WebKarigar`,
      description: `High-converting ${config.label} website templates designed for client acquisition and cold email personalization.`,
    },
  };
}

export default async function NicheTemplatePage({ params }: NicheTemplatePageProps) {
  const { niche } = await params;
  const config = NICHE_CONFIG[niche as Niche];
  if (!config) notFound();

  const nicheTemplates = MARKETPLACE_TEMPLATES.filter((t) => t.niche === (niche as Niche));
  const otherNiches = (Object.keys(NICHE_CONFIG) as Niche[]).filter((n) => n !== niche);

  const faqs = [
    {
      question: `Why do ${config.label} businesses need modern website previews?`,
      answer: `Most local ${config.label.toLowerCase()} businesses lose up to 60% of potential leads due to outdated or non-responsive mobile sites. Showing a sleek personalized preview proves immediate ROI.`,
    },
    {
      question: `Can I customize the color palette and business details for ${config.label} clients?`,
      answer: `Yes. WebKarigar automatically injects the client's business name, phone number, and service highlights into the ${config.label} template with zero manual editing.`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FaqPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: 'Templates', url: 'https://webkarigar.com/templates' },
          { name: config.label, url: `https://webkarigar.com/templates/${niche}` },
        ]}
      />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border border-current inline-block`}>
            {config.label} Templates
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Personalized <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{config.label} Website</span> Templates
          </h1>
          <p className="text-slate-400 text-base">
            High-converting template designs custom-built for web design agencies & freelancers targeting local {config.label.toLowerCase()} businesses.
          </p>
        </div>

        {/* Niche Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nicheTemplates.map((tmpl) => (
            <div key={tmpl.id} className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <Image src={tmpl.previewImage} alt={tmpl.name} fill className="object-cover object-top" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{tmpl.name}</h3>
                  <span className="text-xs font-bold text-amber-400 flex items-center">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" /> {tmpl.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{tmpl.description}</p>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Features:</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
                    {tmpl.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="w-full rounded-xl border-white/10 text-xs font-bold hover:bg-white/5">
                  <Link href={`/preview?template=${niche}&clientName=${encodeURIComponent(tmpl.demoClientName)}`} target="_blank">
                    <Eye className="w-4 h-4 mr-2 text-violet-400" /> Interactive Live Preview
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white">
                  <Link href="/signup">Use in Outreach Campaign</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-white text-center">Niche Conversion FAQs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0b0f1d] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-violet-300">{faq.question}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Niches Navigation */}
        <div className="text-center pt-8">
          <h3 className="text-sm font-bold text-slate-400 mb-4">Explore Other Industry Templates:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {otherNiches.map((n) => (
              <Link
                key={n}
                href={`/templates/${n}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#0b0f1d] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-violet-500/40 transition-all"
              >
                {NICHE_CONFIG[n].label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
