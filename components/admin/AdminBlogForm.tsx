'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOG_CATEGORIES } from '@/lib/blog-data';

interface AdminBlogFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage?: string | null;
    readingTime: string;
    tags: string[];
    featured: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords: string[];
    authorName: string;
    authorRole: string;
  };
  isEditing?: boolean;
}

export function AdminBlogForm({ initialData, isEditing = false }: AdminBlogFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || 'Client Acquisition',
    coverImage: initialData?.coverImage || '/vector2.png',
    readingTime: initialData?.readingTime || '5 min read',
    tags: initialData?.tags?.join(', ') || 'Freelancing, Sales, Cold Email',
    featured: initialData?.featured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords?.join(', ') || '',
    authorName: initialData?.authorName || 'Rohit Sharma',
    authorRole: initialData?.authorRole || 'Founder & CEO, WebKarigar',
  });

  // Auto-generate slug from title if not custom-edited
  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && isEditing ? prev.slug : autoSlug,
      metaTitle: prev.metaTitle || val,
    }));
  };

  const insertSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + '\n' + snippet + '\n',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = isEditing ? `/api/admin/blogs/${initialData?.id}` : '/api/admin/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post');

      setSuccess(isEditing ? 'Blog post updated successfully!' : 'Blog post published successfully!');
      setTimeout(() => {
        router.push('/admin/blogs');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog List
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            {isEditing ? 'Edit Blog Post' : 'Create SEO-Optimized Blog Post'}
          </h1>
          <p className="text-xs text-gray-400">
            Write structured, keyword-rich articles with instant styling, headers, and callout blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
            className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            {activeTab === 'write' ? 'Live Preview' : 'Edit Mode'}
          </Button>

          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-600/30"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Blog'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col - Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-white/5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 7 Proven Cold Outreach Playbooks for Web Designers"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">SEO URL Slug *</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-gray-400">
                <span>webkarigar.com/blog/</span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 bg-transparent text-violet-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Excerpt / Meta Summary *</label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary that appears in search engine results and article cards..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-300">Article Content (HTML / Markdown Formatting) *</label>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => insertSnippet('<h2>Heading 2 Title</h2>')}
                  className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Insert H2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<h3>Heading 3 Subtitle</h3>')}
                  className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Insert H3"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<strong>Bold text</strong>')}
                  className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<blockquote>Key quote or takeaway goes here</blockquote>')}
                  className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="Quote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<ul>\n  <li>Bullet point 1</li>\n  <li>Bullet point 2</li>\n</ul>')}
                  className="p-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded"
                  title="List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      '<div className="my-6 p-6 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-center">\n  <h3 className="text-xl font-bold text-white mb-2">Try WebKarigar Free</h3>\n  <a href="/demo" className="inline-block px-6 py-2 rounded-full bg-violet-600 text-white font-bold text-xs">Launch Demo</a>\n</div>'
                    )
                  }
                  className="p-1.5 text-xs text-violet-400 hover:text-violet-300 hover:bg-white/10 rounded flex items-center gap-1 font-bold"
                  title="Insert CTA Box"
                >
                  <Sparkles className="w-3.5 h-3.5" /> CTA Box
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                required
                rows={16}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article in HTML format (<h2>, <p>, <ul>, <blockquote>)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 leading-relaxed"
              />
            ) : (
              <div
                className="p-6 rounded-xl bg-black/40 border border-white/10 min-h-[350px] prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: formData.content || '<p className="text-gray-500">Nothing to preview yet...</p>' }}
              />
            )}
          </div>
        </div>

        {/* Right Col - Settings & SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata & Classification */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> Categorization
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {BLOG_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0d1222] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Estimated Reading Time</label>
              <input
                type="text"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                placeholder="e.g. 5 min read"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Freelancing, Cold Email, Sales"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-white">Feature on Blog Hero Spotlight</span>
              </label>
            </div>
          </div>

          {/* Author Details */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white">Author Profile</h3>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Author Name</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Author Role</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Custom Meta Settings */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white">SEO & Search Settings</h3>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Custom Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Defaults to article title..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">SEO Target Keywords (Comma Separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. web design clients, website preview, cold email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
