import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Sparkles, Eye, Download, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MARKETPLACE_TEMPLATES, NICHE_CONFIG, Niche } from '@/lib/marketplace-templates';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Public Website Template Gallery | High-Converting Outreach Designs',
  description:
    'Browse WebKarigar’s curated gallery of high-converting website templates for Gyms, Salons, Real Estate, Restaurants, and Coaching businesses.',
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Public Website Template Gallery | WebKarigar',
    description:
      'Explore ready-to-personalize website templates designed to boost cold email reply rates for freelancers and web design agencies.',
  },
};

export default function TemplatesGalleryPage() {
  const niches = Object.keys(NICHE_CONFIG) as Niche[];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: 'Templates', url: 'https://webkarigar.com/templates' },
        ]}
      />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Public Template Gallery
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            High-Converting <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Outreach Website Templates</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Choose from industry-specific website templates optimized for speed, mobile responsiveness, and client conversion.
          </p>

          {/* Niche Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {niches.map((niche) => (
              <Link
                key={niche}
                href={`/templates/${niche}`}
                className="px-4 py-2 rounded-xl bg-[#0c1020] border border-white/10 hover:border-violet-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                {NICHE_CONFIG[niche].label} Templates →
              </Link>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETPLACE_TEMPLATES.map((tmpl) => {
            const nicheConf = NICHE_CONFIG[tmpl.niche];
            return (
              <div
                key={tmpl.id}
                className="bg-[#0b0f1d] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-violet-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-slate-950 border-b border-white/10">
                    <Image
                      src={tmpl.previewImage}
                      alt={tmpl.name}
                      fill
                      className="object-cover object-top"
                    />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${nicheConf.bg} ${nicheConf.color} border border-current`}>
                      {nicheConf.label}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-white">{tmpl.name}</h3>
                      <div className="flex items-center text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {tmpl.rating}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-white/5 mt-4">
                  <Button asChild variant="outline" size="sm" className="w-full rounded-xl border-white/10 text-xs font-bold hover:bg-white/5">
                    <Link href={`/preview?template=${tmpl.niche}&clientName=${encodeURIComponent(tmpl.demoClientName)}`} target="_blank">
                      <Eye className="w-3.5 h-3.5 mr-1 text-violet-400" /> Live Demo
                    </Link>
                  </Button>

                  <Button asChild size="sm" className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white">
                    <Link href={`/templates/${tmpl.niche}`}>
                      Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
