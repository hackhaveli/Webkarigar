import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { AdminBlogForm } from '@/components/admin/AdminBlogForm';
import { BLOG_POSTS } from '@/lib/blog-data';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function EditAdminBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  const { id } = await params;

  let post: any = null;

  if (id.startsWith('static-')) {
    const idx = parseInt(id.replace('static-', ''), 10);
    const sp = BLOG_POSTS[idx];
    if (sp) {
      post = {
        id,
        title: sp.title,
        slug: sp.slug,
        excerpt: sp.excerpt,
        content: sp.content,
        category: sp.category,
        coverImage: sp.coverImage,
        readingTime: sp.readingTime,
        tags: sp.tags,
        featured: sp.featured || false,
        metaTitle: sp.seo?.metaTitle || sp.title,
        metaDescription: sp.seo?.metaDescription || sp.excerpt,
        keywords: sp.seo?.keywords || sp.tags,
        authorName: sp.author.name,
        authorRole: sp.author.role,
      };
    }
  } else {
    try {
      if ((prisma as any).blogPost) {
        post = await (prisma as any).blogPost.findUnique({
          where: { id },
        });
      }
    } catch (err) {
      console.error('Error fetching blog post by id:', err);
    }
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <AdminBlogForm initialData={post} isEditing={true} />
    </div>
  );
}
