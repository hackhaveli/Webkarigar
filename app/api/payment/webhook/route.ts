import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { PLAN } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not defined');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    // Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const body = JSON.parse(rawBody);

    // Only process order.paid events
    if (body.event === 'order.paid') {
      const order = body.payload.order.entity;
      const razorpayOrderId = order.id;
      
      // Wait, order.paid doesn't usually contain the user id unless we passed it in notes
      // Let's rely on the Payment record created during /api/payment/create-order OR notes
      const userId = order.notes?.userId;
      
      // Look up our internal payment record to ensure we don't double-credit
      const paymentRecord = await prisma.payment.findUnique({
        where: { razorpayOrderId },
      });

      if (!paymentRecord) {
        // If it doesn't exist, it means create-order never saved it or DB was slow.
        // We can create it if userId exists in notes.
        if (userId) {
          await processPayment(userId, razorpayOrderId, body.payload.payment?.entity?.id || 'webhook_payment', PLAN);
        }
        return NextResponse.json({ status: 'processed via fallback' });
      }

      // If it's already marked paid, ignore to prevent double credits
      if (paymentRecord.status === 'paid') {
        return NextResponse.json({ status: 'already_paid' });
      }

      // Otherwise, process it
      await processPayment(paymentRecord.userId, razorpayOrderId, body.payload.payment?.entity?.id || 'webhook_payment', PLAN);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Reusable function to credit the user safely
async function processPayment(userId: string, orderId: string, paymentId: string, planConfig: typeof PLAN) {
  const now = new Date();
  const planExpiresAt = new Date(now.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: planConfig.credits },
        plan: 'pro',
        planExpiresAt,
      },
    }),
    prisma.payment.upsert({
      where: { razorpayOrderId: orderId },
      update: {
        status: 'paid',
        razorpayPaymentId: paymentId,
        paidAt: now,
      },
      create: {
        userId,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: planConfig.price,
        currency: planConfig.currency,
        status: 'paid',
        plan: planConfig.id,
        creditsAwarded: planConfig.credits,
        paidAt: now,
      }
    }),
    prisma.creditHistory.create({
      data: {
        userId,
        action: 'purchase',
        amount: planConfig.credits,
        reason: `Purchased Pro Monthly plan (Webhook Fallback) — ₹${planConfig.price / 100}`,
      },
    }),
  ]);
}
