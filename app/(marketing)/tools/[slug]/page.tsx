'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Copy, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const [slugParam, setSlugParam] = useState<string>('');
  const [inputVal, setInputVal] = useState('Dental');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  React.useEffect(() => {
    params.then((res) => setSlugParam(res.slug));
  }, [params]);

  if (
    slugParam &&
    !['cold-email-subject-generator', 'business-slug-generator', 'cta-generator'].includes(slugParam)
  ) {
    notFound();
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getToolData = () => {
    if (slugParam === 'business-slug-generator') {
      const cleanSlug = inputVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        title: 'Business URL Slug Generator',
        desc: 'Convert any business prospect name into a clean, URL-friendly slug for personalized website preview links.',
        label: 'Enter Prospect Business Name:',
        placeholder: 'e.g. Acme Dental & Orthodontics',
        results: [
          `webkarigar.vercel.app/preview?client=${cleanSlug || 'prospect'}`,
          `webkarigar.vercel.app/demo/gym?clientName=${encodeURIComponent(inputVal || 'Prospect')}`,
          `https://client-preview.com/${cleanSlug || 'prospect'}`,
        ],
      };
    }

    if (slugParam === 'cta-generator') {
      return {
        title: 'Outreach Call-to-Action (CTA) Generator',
        desc: 'Generate low-friction CTAs that invite prospects to inspect their pre-built personalized site preview.',
        label: 'Enter Prospect Industry / Niche:',
        placeholder: 'e.g. Salon, Gym, Real Estate',
        results: [
          `Would you be open to taking a 30-second look at the live ${inputVal || 'business'} site mockup I built for you?`,
          `I put together a quick interactive preview of a modern ${inputVal || 'business'} website. Mind if I share the 1-click link?`,
          `No pitch attached — just wanted to share the live website demo I put together for ${inputVal || 'your business'}. Take a look?`,
        ],
      };
    }

    // Default: Subject Line Generator
    return {
      title: 'Cold Email Subject Line Generator',
      desc: 'High-converting subject lines tailored for sending personalized website previews to local business leads.',
      label: 'Enter Prospect Niche or Name:',
      placeholder: 'e.g. Apex Gym / Local Restaurant',
      results: [
        `Created a live website preview for ${inputVal || 'your business'} [30 sec look?]`,
        `Quick site mockup for ${inputVal || 'your team'} (Live Demo Link)`,
        `Idea for ${inputVal || 'your business'} website + live preview`,
        `Made a personalized website preview for ${inputVal || 'you'} (no strings)`,
      ],
    };
  };

  const tool = getToolData();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Free Interactive Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {tool.title}
          </h1>
          <p className="text-slate-400 text-sm">{tool.desc}</p>
        </div>

        {/* Tool Sandbox */}
        <div className="bg-[#0b0f1d] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{tool.label}</label>
            <Input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={tool.placeholder}
              className="bg-[#07090e] border-white/15 text-white h-12 text-base font-semibold focus-visible:ring-violet-500"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Results:</h3>
            <div className="space-y-3">
              {tool.results.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#07090e] border border-white/10 flex items-center justify-between gap-4 font-mono text-xs text-slate-200"
                >
                  <span className="truncate">{res}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(res, idx)}
                    className="shrink-0 text-violet-400 hover:text-white hover:bg-white/10 h-8 px-3 rounded-lg cursor-pointer"
                  >
                    {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold">
            <Link href="/demo">Try WebKarigar&apos;s Full Website Personalization Engine →</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
