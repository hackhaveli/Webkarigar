import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Coins, ArrowUpRight, ArrowDownRight, Zap, Calendar, CreditCard } from 'lucide-react';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  let user: { credits: number; plan: string | null; planExpiresAt: Date | null } | null = null;
  let payments: Awaited<ReturnType<typeof prisma.payment.findMany>> = [];
  let creditHistory: Awaited<ReturnType<typeof prisma.creditHistory.findMany>> = [];

  try {
    [user, [payments, creditHistory]] = await Promise.all([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: { credits: true, plan: true, planExpiresAt: true },
      }),
      Promise.all([
        prisma.payment.findMany({
          where: { user: { email: session.user.email } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        prisma.creditHistory.findMany({
          where: { user: { email: session.user.email } },
          orderBy: { createdAt: 'desc' },
          take: 15,
        }),
      ]),
    ]);
  } catch (err) {
    console.error('[BillingPage] DB unreachable:', err);
    redirect('/dashboard?error=db_unavailable');
  }

  if (!user) redirect('/login');

  const isProActive = user.plan === 'pro' && user.planExpiresAt && new Date(user.planExpiresAt) > new Date();
  const daysLeft = user.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.planExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="animate-slide-up space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Dashboard › Billing</p>
          <h1 className="text-3xl font-extrabold text-white">Credits & Billing</h1>
          <p className="text-slate-300 text-sm mt-1">Manage your credits and payment history</p>
        </div>
        <Link href="/dashboard/pricing"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/30">
          <Zap className="w-4 h-4" fill="currentColor" /> Buy More Credits
        </Link>
      </div>

      {/* Plan status cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-6 border ${isProActive ? 'bg-primary/5 border-primary/20' : 'bg-[#0f1422] border-white/[0.08]'}`}>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Current Plan</p>
          <p className={`text-2xl font-extrabold ${isProActive ? 'text-primary' : 'text-slate-300'}`}>
            {isProActive ? '⚡ Pro' : '🔵 Free'}
          </p>
          {isProActive && (
            <p className="text-xs text-slate-300 mt-1">{daysLeft} days remaining</p>
          )}
        </div>
        <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Credits Balance</p>
          <p className="text-2xl font-extrabold text-amber-400">{user.credits.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">1 credit = 1 email sent</p>
        </div>
        <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Plan Expires</p>
          <p className="text-sm font-bold text-white">
            {user.planExpiresAt
              ? new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—'}
          </p>
          {isProActive && (
            <Link href="/dashboard/pricing" className="text-xs text-primary mt-1 hover:underline block">Renew →</Link>
          )}
        </div>
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-blue-400" /> Payment History
          </h2>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/[0.08]">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${p.status === 'paid' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  <CreditCard className={`w-4 h-4 ${p.status === 'paid' ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Pro Monthly — 2,000 Credits</p>
                  <p className="text-xs text-slate-400 font-mono truncate">{p.razorpayPaymentId || p.razorpayOrderId}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">₹{p.amount / 100}</p>
                  <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex-shrink-0
                  ${p.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit history */}
      <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Coins className="w-4 h-4 text-amber-400" /> Credit History
        </h2>
        {creditHistory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">No credit activity yet.</p>
            <Link href="/dashboard/pricing" className="text-primary text-sm hover:underline mt-2 block">
              Buy your first credits →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {creditHistory.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/[0.08]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${h.action === 'add' || h.action === 'purchase' ? 'bg-green-500/10' :
                    h.action === 'deduct' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  {h.action === 'add' || h.action === 'purchase'
                    ? <ArrowUpRight className="w-4 h-4 text-green-400" />
                    : h.action === 'deduct'
                    ? <ArrowDownRight className="w-4 h-4 text-red-400" />
                    : <Zap className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white capitalize">{h.action.replace('_', ' ')}</p>
                  <p className="text-[10px] text-slate-400 truncate">{h.reason || '—'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold
                    ${h.action === 'add' || h.action === 'purchase' ? 'text-green-400' :
                      h.action === 'deduct' ? 'text-red-400' : 'text-amber-400'}`}>
                    {h.action === 'deduct' ? '-' : '+'}{h.amount}
                  </p>
                  <p className="text-[10px] text-slate-400">{new Date(h.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
