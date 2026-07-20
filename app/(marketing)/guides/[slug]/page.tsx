import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaqPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

interface GuideSlugPageProps {
  params: Promise<{ slug: string }>;
}

const guideData: Record<
  string,
  { title: string; desc: string; takeaways: string[]; content: string }
> = {
  'how-to-get-web-design-clients': {
    title: 'How to Get Web Design Clients in 2026 (Without Pitching)',
    desc: 'The complete playbook for web developers and agencies to close local business prospects using personalized site previews.',
    takeaways: [
      'Stop sending text-heavy proposals that get ignored in overcrowded inboxes.',
      'Build a 1-click personalized site preview for each lead before reaching out.',
      'Include a short 2-sentence cold email pointing to their customized live demo.',
    ],
    content: 'Traditional cold emailing is dead for web designers. Local business owners receive dozens of emails promising "better SEO" and "modern redesigns." By generating a live, working website preview before sending outreach, you prove capability instantly and eliminate sales friction.',
  },
  'cold-email-personalized-websites': {
    title: 'Why Personalized Website Outreach Outperforms Text Cold Emails',
    desc: 'Analyzing the psychology of visual proof: how personalized website links double cold email open-to-reply conversion rates.',
    takeaways: [
      'Visual proof triggers instant curiosity and trust.',
      'WebKarigar automates dynamic slug generation for every lead in your campaign.',
      'Prospects can view their site preview on both desktop and mobile devices.',
    ],
    content: 'When a business owner sees their own brand name and industry services rendered inside a high-converting website design, the conversation shifts from "Are you selling something?" to "How much does this cost?"',
  },
};

export async function generateMetadata({ params }: GuideSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideData[slug];
  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: `${guide.title} | WebKarigar Playbook`,
    description: guide.desc,
    alternates: {
      canonical: `/guides/${slug}`,
    },
  };
}

export default async function GuideSlugPage({ params }: GuideSlugPageProps) {
  const { slug } = await params;
  const guide = guideData[slug];
  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.vercel.app' },
          { name: 'Guides', url: 'https://webkarigar.vercel.app/guides' },
          { name: guide.title, url: `https://webkarigar.vercel.app/guides/${slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 inline-block">
            Outreach Playbook
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{guide.title}</h1>
          <p className="text-slate-400 text-base">{guide.desc}</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white">Key Takeaways</h2>
          <ul className="space-y-3">
            {guide.takeaways.map((t, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-white/10 text-slate-300 text-sm leading-relaxed space-y-4">
            <h3 className="text-base font-bold text-white">Guide Deep Dive:</h3>
            <p>{guide.content}</p>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white">
              <Link href="/demo">Test Live Website Personalization Engine →</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  );
}
