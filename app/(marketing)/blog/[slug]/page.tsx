import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlugAsync, getAllPostsAsync } from '@/lib/blog-data';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Sparkles, BookOpen, User } from 'lucide-react';
import { Footer } from '@/components/sections/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);

  if (!post) {
    return {
      title: 'Article Not Found | WebKarigar',
    };
  }

  return {
    title: `${post.title} | WebKarigar Blog`,
    description: post.excerpt,
    keywords: post.seo?.keywords || post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://webkarigar.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://webkarigar.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPostsAsync();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WebKarigar',
      logo: 'https://webkarigar.com/webkarigar-white.png',
    },
    mainEntityOfPage: `https://webkarigar.com/blog/${slug}`,
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://webkarigar.com' },
          { name: 'Blog', url: 'https://webkarigar.com/blog' },
          { name: post.title, url: `https://webkarigar.com/blog/${slug}` },
        ]}
      />

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />

      <article className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog Hub
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> {post.readingTime}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {post.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Bar */}
          <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                {post.author.name[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">{post.author.name}</p>
                <p className="text-[11px] text-slate-400">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden sm:inline">Share:</span>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose prose-invert max-w-none space-y-6 text-slate-300 text-sm md:text-base leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-white/10
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-violet-300
            [&_blockquote]:p-4 [&_blockquote]:rounded-2xl [&_blockquote]:bg-violet-950/20 [&_blockquote]:border-l-4 [&_blockquote]:border-violet-500 [&_blockquote]:italic [&_blockquote]:text-slate-200
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
            [&_strong]:text-white [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white">Related Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div key={rel.slug} className="p-6 rounded-3xl bg-[#0b0f1d] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{rel.category}</span>
                  <h3 className="text-base font-bold text-white hover:text-violet-300 transition-colors">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{rel.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
