import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, templateId, featured } = await req.json();

  switch (action) {
    case 'toggle_featured': {
      // Featured status is stored in localStorage on the client (marketplace-templates.ts is static)
      // For DB templates we just acknowledge; real featured state is in the static config
      return NextResponse.json({
        message: featured ? 'Marked as featured' : 'Removed from featured',
        templateId,
        featured,
      });
    }

    case 'delete': {
      // Only DB templates (user-saved) can be deleted
      const template = await prisma.template.findUnique({ where: { id: templateId } });
      if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      await prisma.template.delete({ where: { id: templateId } });
      return NextResponse.json({ message: 'Template deleted' });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
