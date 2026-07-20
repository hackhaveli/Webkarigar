import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) return null;
  return session;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await verifyAdmin(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, amount, reason } = await req.json();
  const userId = params.id;

  // Verify user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const adminEmail = session.user?.email ?? 'admin';

  switch (action) {
    case 'add_credits': {
      const addAmount = Math.abs(Number(amount) || 0);
      if (addAmount === 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: addAmount } },
        }),
        prisma.creditHistory.create({
          data: {
            userId,
            action: 'add',
            amount: addAmount,
            reason: reason || `Admin added ${addAmount} credits`,
            adminId: adminEmail,
          },
        }),
      ]);
      return NextResponse.json({ message: `Added ${addAmount} credits to ${user.email}` });
    }

    case 'deduct_credits': {
      const deductAmount = Math.abs(Number(amount) || 0);
      if (deductAmount === 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      const newCredits = Math.max(0, user.credits - deductAmount);
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: newCredits },
        }),
        prisma.creditHistory.create({
          data: {
            userId,
            action: 'deduct',
            amount: deductAmount,
            reason: reason || `Admin deducted ${deductAmount} credits`,
            adminId: adminEmail,
          },
        }),
      ]);
      return NextResponse.json({ message: `Deducted ${deductAmount} credits from ${user.email}` });
    }

    case 'reset_credits': {
      await prisma.$transaction([
        prisma.user.update({ where: { id: userId }, data: { credits: 10 } }),
        prisma.creditHistory.create({
          data: {
            userId,
            action: 'reset',
            amount: 10,
            reason: reason || 'Admin reset credits to 10',
            adminId: adminEmail,
          },
        }),
      ]);
      return NextResponse.json({ message: `Credits reset to 10 for ${user.email}` });
    }

    case 'block': {
      await prisma.user.update({ where: { id: userId }, data: { status: 'blocked' } });
      return NextResponse.json({ message: `User ${user.email} blocked` });
    }

    case 'unblock': {
      await prisma.user.update({ where: { id: userId }, data: { status: 'active' } });
      return NextResponse.json({ message: `User ${user.email} unblocked` });
    }

    case 'delete': {
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ message: `User ${user.email} deleted permanently` });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
