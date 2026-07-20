import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { runCampaign } from '@/lib/email/sendEngine';
import { withRetry } from '@/lib/prismaRetry';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const {
    senders,
    recipients,
    subject,
    html,
    delay = 0.1,
    useGreeting = false,
    campaignId,
    resumeOffset = 0,
  } = body;

  if (!senders?.length || !recipients?.length || !subject || !html) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch actual DB senders to get plaintext passwords securely Server-Side
  const senderIds = senders.map((s: any) => s.id);
  const dbSenders = await prisma.smtpAccount.findMany({
    where: {
      userId: user.id,
      id: { in: senderIds },
    },
  });

  if (dbSenders.length === 0) {
    return NextResponse.json({ error: 'No valid SMTP accounts provided' }, { status: 400 });
  }

  // Credits check
  if (user.credits < recipients.length) {
    return NextResponse.json(
      { error: `Insufficient credits. You have ${user.credits}, need ${recipients.length}.` },
      { status: 402 }
    );
  }

  // Update campaign status to running + store email HTML for resume
  if (campaignId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'running', total: recipients.length },
    });
    // Store email HTML in campaign row so resume can use it (column added dynamically)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "htmlContent" TEXT`);
      await prisma.$executeRawUnsafe(`UPDATE "Campaign" SET "htmlContent" = $1 WHERE "id" = $2`, html, campaignId);
    } catch (e) { /* column may already exist */ }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let totalSent = 0;
      let totalFailed = 0;

      try {
        await runCampaign({
          senders: dbSenders as any,
          recipients,
          subject,
          htmlTemplate: html,
          delay,
          useGreeting,
          onProgress: async (event) => {
            if (event.status === 'success') {
              totalSent = event.sent;
              try {
                if (campaignId) {
                  await withRetry(() => prisma.$transaction([
                    prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } }),
                    prisma.campaign.update({ where: { id: campaignId }, data: { sent: totalSent } }),
                  ]), { label: 'credit-decrement+campaign-update' });
                } else {
                  await withRetry(() => prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } }),
                    { label: 'credit-decrement' });
                }
              } catch (dbErr) {
                console.error('[send/onProgress] DB update failed after retries:', dbErr);
                // Don't crash the stream — email was still sent
              }
            } else if (event.status === 'error') {
              totalFailed = event.failed;
              if (campaignId) {
                try {
                  await withRetry(() => prisma.campaign.update({ where: { id: campaignId }, data: { failed: totalFailed } }),
                    { label: 'campaign-failed-update' });
                } catch (dbErr) {
                  console.error('[send/onProgress] Failed to update campaign failed count:', dbErr);
                }
              }
            } else if (event.status === 'complete') {
              // Finalize campaign in DB
              if (campaignId) {
                try {
                  await withRetry(() => prisma.campaign.update({
                    where: { id: campaignId },
                    data: {
                      status: totalFailed === recipients.length ? 'failed' : 'complete',
                      sent: event.sent,
                      failed: event.failed,
                    },
                  }), { label: 'campaign-finalize' });
                } catch (dbErr) {
                  console.error('[send/onProgress] Failed to finalize campaign:', dbErr);
                }
              }
            }
            try {
              controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
            } catch (err) {}
          },
        });
      } catch (err) {
        try {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ status: 'error', error: (err as Error).message, sent: totalSent, failed: totalFailed, total: recipients.length }) + '\n'
            )
          );
        } catch (e) {}
      } finally {
        try {
          controller.close();
        } catch (e) {}
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
