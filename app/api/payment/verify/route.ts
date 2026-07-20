import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { PLANS } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Check if this order was already verified (idempotency)
    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (existingPayment && existingPayment.status === 'paid') {
      return NextResponse.json({
        success: true,
        credits: existingPayment.creditsAwarded,
        plan: 'pro',
        message: 'Payment already processed. Credits are active.',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Determine plan: intro ₹1 if never paid before, else pro ₹99
    const priorPaidPayment = await prisma.payment.findFirst({
      where: { userId: user.id, status: 'paid' },
    });
    const plan = priorPaidPayment ? PLANS.pro : PLANS.intro;

    // Calculate plan expiry
    const now = new Date();
    const planExpiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    // Update user credits + plan in a transaction
    await prisma.$transaction([
      // Add credits to user
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: plan.credits },
          plan: 'pro',
          planExpiresAt,
        },
      }),
      // Record payment
      prisma.payment.create({
        data: {
          userId: user.id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: plan.price,
          currency: plan.currency,
          status: 'paid',
          plan: plan.id,
          creditsAwarded: plan.credits,
          paidAt: now,
        },
      }),
      // Log credit history
      prisma.creditHistory.create({
        data: {
          userId: user.id,
          action: 'purchase',
          amount: plan.credits,
          reason: `Purchased ${plan.name} — ${plan.label}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      credits: plan.credits,
      plan: 'pro',
      expiresAt: planExpiresAt.toISOString(),
      message: `✅ Payment verified! ${plan.credits} credits added to your account.`,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification' },
      { status: 500 }
    );
  }
}
