'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminBlogActions({ post }: { post: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (post.isStatic) {
      alert('This is a core default playbook article. To modify it, use the Edit interface to override or create custom database articles.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs/${post.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Could not delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
        <a href={`/blog/${post.slug}`} target="_blank" title="View Article Live">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </Button>

      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg">
        <Link href={`/admin/blogs/${post.id}`} title="Edit Post">
          <Edit3 className="w-3.5 h-3.5" />
        </Link>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={loading}
        onClick={handleDelete}
        className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
        title="Delete Post"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
