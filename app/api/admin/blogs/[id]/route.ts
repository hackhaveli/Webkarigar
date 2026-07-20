import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      readingTime,
      tags,
      featured,
      metaTitle,
      metaDescription,
      keywords,
      authorName,
      authorRole,
    } = body;

    const cleanSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : 'article';
    const tagArray = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];
    const keywordArray = Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map((k) => k.trim()) : [];

    if (!(prisma as any).blogPost) {
      return NextResponse.json(
        { error: 'Prisma Client needs to be reloaded. Please restart your dev server (Ctrl+C then npm run dev).' },
        { status: 500 }
      );
    }

    let updatedPost;

    if (id.startsWith('static-')) {
      // Upsert by slug so static fallback articles can be saved into DB
      updatedPost = await (prisma as any).blogPost.upsert({
        where: { slug: cleanSlug },
        update: {
          title,
          excerpt,
          content,
          coverImage,
          category,
          readingTime,
          tags: tagArray,
          featured: Boolean(featured),
          metaTitle,
          metaDescription,
          keywords: keywordArray,
          authorName: authorName || 'Rohit Sharma',
          authorRole: authorRole || 'Founder & CEO, WebKarigar',
        },
        create: {
          title,
          slug: cleanSlug,
          excerpt,
          content,
          coverImage: coverImage || '/vector2.png',
          category: category || 'Client Acquisition',
          readingTime: readingTime || '5 min read',
          tags: tagArray,
          featured: Boolean(featured),
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || excerpt,
          keywords: keywordArray,
          authorName: authorName || 'Rohit Sharma',
          authorRole: authorRole || 'Founder & CEO, WebKarigar',
        },
      });
    } else {
      updatedPost = await (prisma as any).blogPost.update({
        where: { id },
        data: {
          title,
          slug: cleanSlug,
          excerpt,
          content,
          coverImage,
          category,
          readingTime,
          tags: tagArray,
          featured: Boolean(featured),
          metaTitle,
          metaDescription,
          keywords: keywordArray,
          authorName: authorName || 'Rohit Sharma',
          authorRole: authorRole || 'Founder & CEO, WebKarigar',
        },
      });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    if (!id.startsWith('static-')) {
      await prisma.blogPost.delete({
        where: { id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
