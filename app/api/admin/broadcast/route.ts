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

  const { title, message, type } = await req.json();
  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'title and message required' }, { status: 400 });
  }

  // Count users who will receive the broadcast
  const userCount = await prisma.user.count({ where: { status: 'active' } });

  // In a real system, this would push to a notifications table or send emails.
  // Here we log to console and return success — extend with actual notification logic.
  console.log(`[BROADCAST] type=${type} title="${title}" message="${message}" → ${userCount} users`);

  // TODO: Optionally store in a Notification model for in-app display
  // await prisma.notification.createMany({ data: users.map(u => ({ userId: u.id, title, message, type })) })

  return NextResponse.json({
    message: `Broadcast queued for ${userCount} active users`,
    count: userCount,
    broadcast: { title, message, type, sentAt: new Date().toISOString() },
  });
}
