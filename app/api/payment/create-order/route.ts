import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';
import { PLANS } from '@/lib/payment';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Check if user has made any prior paid purchase
    const priorPayment = await prisma.payment.findFirst({
      where: { user: { email: session.user.email }, status: 'paid' },
    });

    // First-time buyer pays ₹1; returning buyers pay ₹99
    const plan = priorPayment ? PLANS.pro : PLANS.intro;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: plan.price,
      currency: plan.currency,
      receipt: `wk_${Date.now()}`,
      notes: {
        userId: (session.user as any).id || '',
        plan: plan.id,
        credits: String(plan.credits),
        isIntro: String(!priorPayment),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: plan.price,
      currency: plan.currency,
      plan,
      isIntroOffer: !priorPayment,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('Razorpay order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}


