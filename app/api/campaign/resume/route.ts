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

  const { campaignId } = await req.json();
  if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });

  // Fetch the campaign
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });

  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

  // Fetch stored email HTML from the dynamically-added column
  let storedHtml = '<p>Follow up email</p>';
  try {
    const rows = await prisma.$queryRawUnsafe<{htmlContent: string}[]>(
      `SELECT "htmlContent" FROM "Campaign" WHERE "id" = $1 LIMIT 1`, campaignId
    );
    if (rows?.[0]?.htmlContent) {
      storedHtml = rows[0].htmlContent;
    }
  } catch (e) { /* column may not exist for old campaigns */ }

  const alreadyProcessed = (campaign.sent || 0) + (campaign.failed || 0);
  const totalLeads = campaign.total || 0;

  if (alreadyProcessed >= totalLeads) {
    // Mark as complete if all processed
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'complete' },
    });
    return NextResponse.json({ message: 'Campaign already completed', sent: campaign.sent, failed: campaign.failed });
  }

  // Get all leads for this user, skip the ones already processed
  const allLeads = await prisma.lead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  // We need to figure out which leads were targeted. 
  // Since we don't store per-lead status, we skip by count (same order as original send)
  const remainingLeads = allLeads.slice(alreadyProcessed);

  if (remainingLeads.length === 0) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'complete' },
    });
    return NextResponse.json({ message: 'No remaining leads to process' });
  }

  // Get SMTP accounts
  const smtpAccounts = await prisma.smtpAccount.findMany({
    where: { userId: user.id },
  });

  if (smtpAccounts.length === 0) {
    return NextResponse.json({ error: 'No SMTP accounts configured' }, { status: 400 });
  }

  // Credits check for remaining
  if (user.credits < remainingLeads.length) {
    return NextResponse.json(
      { error: `Insufficient credits. You have ${user.credits}, need ${remainingLeads.length}.` },
      { status: 402 }
    );
  }

  // Update campaign status back to running
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'running' },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let totalSent = campaign.sent || 0;
      let totalFailed = campaign.failed || 0;

      try {
        await runCampaign({
          senders: smtpAccounts as any,
          recipients: remainingLeads.map(l => ({
            name: l.name,
            email: l.email,
            business_name: l.businessName || undefined,
          })),
          subject: campaign.subject || 'Follow up',
          htmlTemplate: storedHtml,
          delay: 0.1,
          onProgress: async (event) => {
            if (event.status === 'success') {
              totalSent++;
              try {
                await withRetry(() => prisma.$transaction([
                  prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } }),
                  prisma.campaign.update({ where: { id: campaignId }, data: { sent: totalSent } }),
                ]), { label: 'resume-credit-decrement' });
              } catch (dbErr) {
                console.error('[resume/onProgress] DB update failed after retries:', dbErr);
                // Don't crash the stream — email was still sent
              }
            } else if (event.status === 'error') {
              totalFailed++;
              try {
                await withRetry(() => prisma.campaign.update({ where: { id: campaignId }, data: { failed: totalFailed } }),
                  { label: 'resume-failed-update' });
              } catch (dbErr) {
                console.error('[resume/onProgress] Failed to update failed count:', dbErr);
              }
            } else if (event.status === 'complete') {
              try {
                await withRetry(() => prisma.campaign.update({
                  where: { id: campaignId },
                  data: {
                    status: totalFailed === remainingLeads.length ? 'failed' : 'complete',
                    sent: totalSent,
                    failed: totalFailed,
                  },
                }), { label: 'resume-finalize' });
              } catch (dbErr) {
                console.error('[resume/onProgress] Failed to finalize campaign:', dbErr);
              }
            }

            // Send progress with absolute counts (including previously sent)
            const progressEvent = {
              ...event,
              sent: totalSent,
              failed: totalFailed,
              total: totalLeads,
            };

            try {
              controller.enqueue(encoder.encode(JSON.stringify(progressEvent) + '\n'));
            } catch (err) {}
          },
        });
      } catch (err) {
        // On timeout/crash, update status so it can be resumed again
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { sent: totalSent, failed: totalFailed, status: 'running' },
        });
        try {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ status: 'error', error: 'Server timeout — click Resume to continue', sent: totalSent, failed: totalFailed, total: totalLeads }) + '\n'
            )
          );
        } catch (e) {}
      } finally {
        try { controller.close(); } catch (e) {}
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
