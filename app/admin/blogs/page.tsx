import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Newspaper, Plus, Sparkles, Eye, Edit3, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { AdminBlogActions } from '@/components/admin/AdminBlogActions';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  // Fetch posts from database
  let dbPosts: any[] = [];
  try {
    if ((prisma as any).blogPost) {
      dbPosts = await (prisma as any).blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
      });
    }
  } catch (err) {
    console.error('Error fetching DB blog posts:', err);
  }

  // Combine DB posts with fallback default static posts
  const allPosts = [
    ...dbPosts,
    ...BLOG_POSTS.filter((sp) => !dbPosts.some((dbp) => dbp.slug === sp.slug)).map((sp, idx) => ({
      id: `static-${idx}`,
      title: sp.title,
      slug: sp.slug,
      excerpt: sp.excerpt,
      content: sp.content,
      coverImage: sp.coverImage,
      category: sp.category,
      readingTime: sp.readingTime,
      tags: sp.tags,
      featured: sp.featured || false,
      metaTitle: sp.seo?.metaTitle || sp.title,
      metaDescription: sp.seo?.metaDescription || sp.excerpt,
      keywords: sp.seo?.keywords || sp.tags,
      authorName: sp.author.name,
      authorRole: sp.author.role,
      authorAvatar: sp.author.avatar,
      publishedAt: new Date(sp.publishedAt),
      createdAt: new Date(sp.publishedAt),
      updatedAt: new Date(sp.publishedAt),
      isStatic: true,
    })),
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-2">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" /> Admin Content Management
          </div>
          <h1 className="text-3xl font-extrabold text-white">Blog Posts & SEO Playbooks</h1>
          <p className="text-xs text-gray-400 mt-1">
            Create, edit, feature, and optimize articles for traditional search engines and AI answer engines.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Create New Blog Post
        </Link>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1222] border border-white/5 space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Articles</p>
          <p className="text-2xl font-black text-white">{allPosts.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0d1222] border border-white/5 space-y-1">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Featured Posts</p>
          <p className="text-2xl font-black text-violet-300">
            {allPosts.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0d1222] border border-white/5 space-y-1">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Categories Active</p>
          <p className="text-2xl font-black text-cyan-300">4</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-[#0d1222] border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">All Published Articles</h2>
          <span className="text-xs text-gray-400">Live on /blog</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Published Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {allPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-bold text-white max-w-md line-clamp-1">{post.title}</p>
                      <p className="text-[11px] font-mono text-violet-400">/blog/{post.slug}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[11px] font-semibold">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-200">{post.authorName}</p>
                    <p className="text-[10px] text-gray-500">{post.authorRole}</p>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-4">
                    {post.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                        <Sparkles className="w-3 h-3" /> Featured Spotlight
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <AdminBlogActions post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
