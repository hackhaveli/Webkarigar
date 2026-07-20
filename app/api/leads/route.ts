import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5000');
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({ leads, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { name, email, businessName, niche } = await req.json();
  if (!name || !email) return NextResponse.json({ error: 'name and email required' }, { status: 400 });

  const lead = await prisma.lead.create({
    data: { userId: user.id, name, email, businessName, niche },
  });

  return NextResponse.json(lead, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { id, ids } = await req.json();
  if (ids && Array.isArray(ids)) {
    await prisma.lead.deleteMany({ where: { id: { in: ids }, userId: user.id } });
  } else if (id) {
    await prisma.lead.deleteMany({ where: { id, userId: user.id } });
  } else {
    return NextResponse.json({ error: 'Missing id or ids' }, { status: 400 });
  }
  
  return NextResponse.json({ ok: true });
}
