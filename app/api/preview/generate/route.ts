import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const lead = await prisma.lead.findUnique({ where: { id } });
  
  if (!lead || !lead.businessName) {
    return NextResponse.json({ error: 'Lead must have a business name to generate a preview' }, { status: 400 });
  }

  const slug = encodeURIComponent(lead.businessName.toLowerCase().replace(/\s+/g, '-'));
  const previewUrl = `/preview/${slug}`;

  const updated = await prisma.lead.update({
    where: { id },
    data: { previewUrl },
  });

  return NextResponse.json({ previewUrl: updated.previewUrl });
}
