import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const accounts = await prisma.smtpAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, provider: true, createdAt: true }, // never return password
  });

  return NextResponse.json({ accounts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { email, password, provider } = await req.json();
  if (!email || !password || !provider) {
    return NextResponse.json({ error: 'email, password, provider required' }, { status: 400 });
  }

  // NOTE: Storing SMTP app passwords in plaintext string format 
  // so nodemailer can authenticate. In a production environment, 
  // you would encrypt this using AES-256 and decrypt when needed.
  const account = await prisma.smtpAccount.create({
    data: { userId: user.id, email, password, provider },
    select: { id: true, email: true, provider: true, createdAt: true },
  });

  return NextResponse.json(account, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { id } = await req.json();
  await prisma.smtpAccount.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
