import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const templates = await prisma.template.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { name, subject, content } = await req.json();
  if (!name || !subject || !content) {
    return NextResponse.json({ error: 'name, subject, content required' }, { status: 400 });
  }

  const template = await prisma.template.create({
    data: { userId: user.id, name, subject, content },
  });

  return NextResponse.json(template, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { id } = await req.json();
  await prisma.template.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
