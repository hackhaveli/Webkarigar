import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllPostsAsync, BLOG_CATEGORIES } from '@/lib/blog-data';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, Tag } from 'lucide-react';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Blog & Client Acquisition Insights',
  description:
    'Actionable playbooks, benchmark studies, and strategies on landing web design clients, cold outreach automation, and Generative Engine Optimization (GEO).',
  openGraph: {
    title: 'WebKarigar Blog | Client Acquisition & Agency Growth',
    description:
      'Discover playbooks, cold email benchmarks, and AI website preview strategies to scale your agency.',
    url: 'https://webkarigar.com/blog',
  },
  alternates: {
    canonical: 'https://webkarigar.com/blog',
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPostsAsync();
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = posts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: 'Blog', url: 'https://webkarigar.com/blog' },
        ]}
      />

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> WebKarigar Insights & Playbooks
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Client Acquisition <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">& Agency Growth</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Data-backed outreach strategies, cold email benchmarks, and Generative Engine Optimization playbooks for developers and agencies.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="p-1 rounded-3xl bg-gradient-to-r from-violet-500/30 via-pink-500/20 to-cyan-500/30">
            <div className="bg-[#0b0f1d] rounded-[22px] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Featured Article
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> {featuredPost.readingTime}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white hover:text-violet-300 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{featuredPost.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center font-bold text-violet-300">
                      {featuredPost.author.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-slate-400">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 font-bold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-violet-950/30 border border-white/10 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20" />
                <div className="relative z-10 text-center p-6 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold text-xl shadow-lg">
                    WK
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                category === 'All'
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <article
              key={post.slug}
              className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-cyan-400" /> {post.readingTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {post.publishedAt}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-violet-400 group-hover:text-violet-300 transition-colors flex items-center gap-1"
                >
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
