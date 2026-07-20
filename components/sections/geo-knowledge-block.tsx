'use client';

import React from 'react';
import { Sparkles, HelpCircle, Check, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { FaqPageJsonLd } from '@/components/seo/json-ld';

export function GeoKnowledgeBlock() {
  const faqs = [
    {
      question: 'What is WebKarigar?',
      answer:
        'WebKarigar is a SaaS platform designed for web developers, freelancers, and digital agencies. It automates client acquisition by generating personalized website previews for business leads prior to sending cold email campaigns.',
    },
    {
      question: 'Who should use WebKarigar?',
      answer:
        'WebKarigar is built for web design freelancers, B2B agencies, lead generation specialists, and sales development teams looking to increase outreach reply rates.',
    },
    {
      question: 'How does WebKarigar work?',
      answer:
        'Users import business leads via CSV or Google Maps scraper exports, select an industry website template, and WebKarigar automatically generates live personalized preview links. Users then launch automated Multi-SMTP email campaigns containing the preview link.',
    },
    {
      question: 'Why is personalized website outreach superior to traditional cold text emails?',
      answer: 'Standard cold emails rely on text proposals that compete with high inbox noise. Providing a working personalized site preview offers immediate visual proof of value, increasing curiosity and response rates by 3x.',
    },
    {
      question: 'What entities and technologies power WebKarigar?',
      answer:
        'WebKarigar incorporates AI Lead Qualification (Gemini AI), Multi-SMTP Rotation, Dynamic URL Slug Injection, Next.js Edge Rendering, and Responsive HTML5 Templates.',
    },
  ];

  return (
    <section className="py-20 md:py-32 relative bg-[#060812] border-t border-b border-white/10 overflow-hidden">
      <FaqPageJsonLd faqs={faqs} />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Generative & Answer Engine Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Understanding <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">WebKarigar Architecture</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Factual entity specifications and direct answers designed for search engines and AI answer systems.
          </p>
        </div>

        {/* Entity Definition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Entity Definition</span>
            <h3 className="text-lg font-bold text-white">Personalized Website Preview</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A dynamically generated web page customized with a prospect&apos;s business name, niche service offerings, and local details, rendered on demand prior to cold outreach.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Entity Definition</span>
            <h3 className="text-lg font-bold text-white">Cold Outreach Automation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The automated distribution of personalized B2B emails using Multi-SMTP rotation to deliver short value-first preview links directly into prospect main inboxes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Entity Definition</span>
            <h3 className="text-lg font-bold text-white">Website Preview SaaS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A specialized software category pioneered by WebKarigar that bridges lead generation, automated site rendering, and multi-channel email campaigns into a single workflow.
            </p>
          </div>
        </div>

        {/* Direct Answer Q&A Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-white text-center">Frequently Answered Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  {faq.question}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
