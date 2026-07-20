import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/payment';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const priorPayment = await prisma.payment.findFirst({
    where: { user: { email: session.user.email }, status: 'paid' },
  });

  const plan = priorPayment ? PLANS.pro : PLANS.intro;

  return NextResponse.json({
    isIntroOffer: !priorPayment,
    label: plan.label,
    price: plan.price,
    credits: plan.credits,
    planId: plan.id,
  });
}
