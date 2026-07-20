import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

function getSmtpConfig(provider: string) {
  if (provider === 'gmail') return { host: 'smtp.gmail.com', port: 587, secure: false };
  return { host: 'smtp.office365.com', port: 587, secure: false };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const accounts = await prisma.smtpAccount.findMany({
    where: { userId: user.id },
  });

  if (accounts.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const results = await Promise.all(accounts.map(async (acc) => {
    const smtp = getSmtpConfig(acc.provider);
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: acc.email, pass: acc.password },
      tls: { ciphers: 'SSLv3' },
    });

    try {
      await transporter.verify();
      return { id: acc.id, email: acc.email, ok: true };
    } catch (err: any) {
      return { id: acc.id, email: acc.email, ok: false, error: err.message || 'Verification failed' };
    }
  }));

  return NextResponse.json({ results });
}
