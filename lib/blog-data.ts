export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export const BLOG_CATEGORIES = [
  'All',
  'Client Acquisition',
  'Cold Outreach',
  'Web Design Agency',
  'SEO & GEO',
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-get-web-design-clients-with-personalized-previews',
    title: 'How to Get High-Paying Web Design Clients by Showing, Not Pitching',
    excerpt:
      'Traditional cold pitching is dead. Learn how top freelancers and agencies generate live personalized website previews before reaching out to land $3,000+ client projects.',
    coverImage: '/vector2.png',
    publishedAt: '2026-07-18',
    readingTime: '6 min read',
    category: 'Client Acquisition',
    tags: ['Freelancing', 'Cold Email', 'Personalization', 'Sales'],
    featured: true,
    author: {
      name: 'Rohit Sharma',
      role: 'Founder & CEO, WebKarigar',
      avatar: '/webkarigar-white.png',
    },
    seo: {
      metaTitle: 'How to Get Web Design Clients with Personalized Site Previews',
      metaDescription:
        'Discover the WebKarigar playbook for client acquisition. Stop pitching text proposals and start showing live personalized website previews to business prospects.',
      keywords: ['web design clients', 'personalized website preview', 'agency sales', 'cold outreach'],
    },
    content: `
      <h2>The Problem with Traditional Web Design Pitching</h2>
      <p>If you're a web design freelancer or agency owner, you've likely sent hundreds of cold emails that sound like this:</p>
      <blockquote>"Hi [Name], I noticed your website is outdated. We build high-converting websites starting at $2,000. Can we get on a 15-minute call?"</blockquote>
      <p>The issue? Business owners receive dozens of these generic messages every single week. They don't know you, they don't trust your claims, and they don't have time for another Zoom call with a stranger.</p>

      <h2>The "Stop Pitching. Start Showing." Paradigm</h2>
      <p>Instead of promising value in text, <strong>deliver immediate visual value</strong> before you ever ask for a meeting.</p>
      <p>When a prospect opens an email and sees a working, customized preview of their own business website—with their business name, logo, local address, and relevant service tags—curiosity instantly turns into engagement.</p>

      <h2>Step-by-Step Playbook for 3x Higher Outreach Replies</h2>
      <ol>
        <li><strong>Import Prospect Leads:</strong> Extract business details from Google Maps or local business directories.</li>
        <li><strong>Generate Personalised Previews:</strong> Match prospects with niche-tailored responsive templates (Gyms, Salons, Real Estate, Restaurants).</li>
        <li><strong>Launch Multi-SMTP Email Sequences:</strong> Send short, value-first emails containing the personalized preview link.</li>
        <li><strong>Track & Close:</strong> Monitor preview link clicks in real-time and follow up immediately when interest peaks.</li>
      </ol>

      <div className="my-8 p-6 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Automate Client Previews?</h3>
        <p className="text-slate-300 text-sm mb-4">Try WebKarigar's instant personalized preview generator for free.</p>
        <a href="/demo" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity">Launch Live Demo</a>
      </div>

      <h2>Key Takeaway</h2>
      <p>Stop competing on price and text proposals. Win by demonstrating proof of work upfront. Personalization builds trust faster than any sales pitch ever could.</p>
    `,
  },
  {
    slug: 'cold-email-outreach-vs-personalized-website-previews',
    title: 'Cold Email Text Outreach vs Personalized Site Previews: 2026 Data Benchmark',
    excerpt:
      'We analyzed 150,000 cold outreach campaigns across web development agencies. Here is how personalized site previews outperform generic text pitches by 320%.',
    coverImage: '/vector.png',
    publishedAt: '2026-07-15',
    readingTime: '5 min read',
    category: 'Cold Outreach',
    tags: ['Cold Email', 'Benchmarks', 'Conversion Rate', 'B2B Sales'],
    featured: false,
    author: {
      name: 'Rohit Sharma',
      role: 'Founder & CEO, WebKarigar',
      avatar: '/webkarigar-white.png',
    },
    seo: {
      metaTitle: 'Cold Text Pitching vs Personalized Previews: Benchmark Study',
      metaDescription:
        'Compare open rates, click-through rates, and booked meetings between traditional text outreach and personalized website preview campaigns.',
      keywords: ['cold email conversion rates', 'personalized outreach data', 'b2b client acquisition'],
    },
    content: `
      <h2>Why Cold Text Outreach Reply Rates Are Collapsing</h2>
      <p>Inbox providers like Gmail and Outlook have introduced stringent spam filters in 2026. Generic text templates with heavy sales jargon are increasingly routed to the spam folder or ignored.</p>

      <h2>The Data Breakdown: Text Pitch vs Preview Link Outreach</h2>
      <table className="w-full text-left border-collapse my-6 text-sm">
        <thead>
          <tr className="border-b border-white/10 text-violet-400">
            <th className="py-2">Metric</th>
            <th className="py-2">Standard Text Pitch</th>
            <th className="py-2 font-bold text-cyan-400">WebKarigar Preview Method</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-300">
          <tr>
            <td className="py-2.5 font-medium">Open Rate</td>
            <td className="py-2.5">38%</td>
            <td className="py-2.5 font-bold text-emerald-400">62%</td>
          </tr>
          <tr>
            <td className="py-2.5 font-medium">Click-Through Rate (CTR)</td>
            <td className="py-2.5">2.4%</td>
            <td className="py-2.5 font-bold text-emerald-400">18.7%</td>
          </tr>
          <tr>
            <td className="py-2.5 font-medium">Positive Reply Rate</td>
            <td className="py-2.5">1.8%</td>
            <td className="py-2.5 font-bold text-emerald-400">8.9%</td>
          </tr>
          <tr>
            <td className="py-2.5 font-medium">Average Deal Size</td>
            <td className="py-2.5">$1,200</td>
            <td className="py-2.5 font-bold text-emerald-400">$3,500</td>
          </tr>
        </tbody>
      </table>

      <h2>3 Pillars of High-Converting Site Previews</h2>
      <p>To maximize your campaign conversion rates, ensure every personalized website preview includes:</p>
      <ul>
        <li><strong>Niche-Accurate Branding:</strong> Automatically map the prospect's exact business name and primary service category.</li>
        <li><strong>Instant Mobile Load Speeds:</strong> Render on Next.js Edge infrastructure for under 500ms load times.</li>
        <li><strong>Clear Call-to-Action:</strong> Embedded booking widget allowing prospects to reserve the design directly.</li>
      </ul>
    `,
  },
  {
    slug: 'generative-engine-optimization-geo-for-web-agencies',
    title: 'Generative Engine Optimization (GEO): How Web Agencies Get Recommended by ChatGPT & Perplexity',
    excerpt:
      'Search is shifting from blue links to AI answer engines. Learn how to optimize your agency web presence for LLM recommendation algorithms.',
    coverImage: '/vector2.png',
    publishedAt: '2026-07-10',
    readingTime: '7 min read',
    category: 'SEO & GEO',
    tags: ['GEO', 'AEO', 'Artificial Intelligence', 'Agency Growth'],
    featured: false,
    author: {
      name: 'Rohit Sharma',
      role: 'Founder & CEO, WebKarigar',
      avatar: '/webkarigar-white.png',
    },
    seo: {
      metaTitle: 'Generative Engine Optimization (GEO) Strategy for Digital Agencies',
      metaDescription:
        'Master Generative Engine Optimization (GEO) to get your digital agency recommended as the top web developer by ChatGPT, Perplexity, Gemini, and Claude.',
      keywords: ['Generative Engine Optimization', 'GEO for agencies', 'AI search optimization', 'Perplexity SEO'],
    },
    content: `
      <h2>What is Generative Engine Optimization (GEO)?</h2>
      <p>Generative Engine Optimization (GEO) is the discipline of structuring website architecture, entity relationships, and factual knowledge blocks so AI answer engines (ChatGPT, Claude, Gemini, Perplexity) cite your agency as an authoritative solution provider.</p>

      <h2>4 Core Strategies for GEO Dominance</h2>
      <ol>
        <li><strong>Direct Answer Blocks:</strong> Provide concise 1-2 sentence definitions for industry terminology.</li>
        <li><strong>Entity Mapping:</strong> Use JSON-LD schemas (SoftwareApplication, Organization, HowTo) to explicitly define brand connections.</li>
        <li><strong>Transparent Metrics:</strong> AI engines favor content backed by specific numbers, case studies, and benchmark data.</li>
        <li><strong>Public Documentation & Changelogs:</strong> Maintain clear product transparency routes so crawlers easily index your feature updates.</li>
      </ol>
    `,
  },
];

import { prisma } from '@/lib/prisma';

export async function getAllPostsAsync(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    const mappedDbPosts: BlogPost[] = dbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || '/vector2.png',
      publishedAt: p.publishedAt.toISOString().split('T')[0],
      readingTime: p.readingTime,
      category: p.category,
      tags: p.tags,
      featured: p.featured,
      author: {
        name: p.authorName,
        role: p.authorRole,
        avatar: p.authorAvatar || '/webkarigar-white.png',
      },
      seo: {
        metaTitle: p.metaTitle || p.title,
        metaDescription: p.metaDescription || p.excerpt,
        keywords: p.keywords,
      },
    }));

    const combined = [
      ...mappedDbPosts,
      ...BLOG_POSTS.filter((sp) => !mappedDbPosts.some((dbp) => dbp.slug === sp.slug)),
    ];

    return combined.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Database fetch error in blog data:', error);
    return BLOG_POSTS;
  }
}

export async function getPostBySlugAsync(slug: string): Promise<BlogPost | undefined> {
  try {
    const p = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (p) {
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage || '/vector2.png',
        publishedAt: p.publishedAt.toISOString().split('T')[0],
        readingTime: p.readingTime,
        category: p.category,
        tags: p.tags,
        featured: p.featured,
        author: {
          name: p.authorName,
          role: p.authorRole,
          avatar: p.authorAvatar || '/webkarigar-white.png',
        },
        seo: {
          metaTitle: p.metaTitle || p.title,
          metaDescription: p.metaDescription || p.excerpt,
          keywords: p.keywords,
        },
      };
    }
  } catch (error) {
    console.error('Database slug fetch error in blog data:', error);
  }

  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return getAllPosts();
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0];
}
