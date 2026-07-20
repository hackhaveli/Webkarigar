import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Zap, Calendar, Download } from 'lucide-react';

export default async function PaymentSuccessPage({ searchParams }: {
  searchParams: { order_id?: string }
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  let user: { credits: number; plan: string | null; planExpiresAt: Date | null; name: string | null } | null = null;
  let payment: Awaited<ReturnType<typeof prisma.payment.findFirst>> = null;

  try {
    [user, payment] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { credits: true, plan: true, planExpiresAt: true, name: true },
      }),
      prisma.payment.findFirst({
        where: { user: { email: session.user.email }, status: 'paid' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  } catch (err) {
    console.error('[PaymentSuccessPage] DB unreachable:', err);
    redirect('/dashboard?error=db_unavailable');
  }

  if (!user) redirect('/login');

  return (
    <div className="animate-slide-up min-h-screen bg-[#080B14] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Success animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <div className="absolute inset-0 rounded-full bg-green-500/5 animate-ping" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Payment Successful! 🎉</h1>
          <p className="text-slate-300">Your credits have been added instantly.</p>
        </div>

        {/* Credits breakdown */}
        <div className="bg-[#111827] border border-green-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Credits Added</span>
            <span className="text-2xl font-extrabold text-green-400">+2,000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Total Credits Now</span>
            <span className="text-2xl font-extrabold text-amber-400">{user.credits.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Plan Expires
            </span>
            <span className="text-sm font-bold text-white">
              {user.planExpiresAt
                ? new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </span>
          </div>
          {payment && (
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Amount Paid</span>
              <span className="text-sm font-bold text-white">₹{payment.amount / 100}</span>
            </div>
          )}
        </div>

        {/* Payment ID */}
        {payment?.razorpayPaymentId && (
          <div className="bg-white/3 border border-white/[0.08] rounded-xl px-4 py-3 text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Payment ID</p>
            <p className="text-xs font-mono text-slate-200">{payment.razorpayPaymentId}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/campaigns/new"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/30">
            <Zap className="w-4 h-4" fill="currentColor" /> Start a Campaign Now
          </Link>
          <Link href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
