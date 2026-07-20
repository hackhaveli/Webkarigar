import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action } = await req.json();
  const campaignId = params.id;

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

  switch (action) {
    case 'stop': {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'complete' },
      });
      return NextResponse.json({ message: `Campaign "${campaign.name}" force stopped` });
    }

    case 'delete': {
      await prisma.campaign.delete({ where: { id: campaignId } });
      return NextResponse.json({ message: `Campaign "${campaign.name}" deleted` });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
