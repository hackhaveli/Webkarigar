import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Title, slug, excerpt, and content are required' }, { status: 400 });
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug: slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        excerpt,
        content,
        coverImage: coverImage || '/vector2.png',
        category: category || 'Client Acquisition',
        readingTime: readingTime || '5 min read',
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [],
        featured: Boolean(featured),
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : [],
        authorName: authorName || 'Sahil Sharma',
        authorRole: authorRole || 'Founder & CEO, WebKarigar',
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
