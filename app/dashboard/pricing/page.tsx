import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { BuyCreditsButton } from '@/components/payment/BuyCreditsButton';
import { CheckCircle2, Zap, Calendar, Star, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PLANS } from '@/lib/payment';

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  let user: { id: string; credits: number; plan: string | null; planExpiresAt: Date | null; name: string | null; email: string } | null = null;
  let priorPayment: { id: string } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true, plan: true, planExpiresAt: true, name: true, email: true },
    });
    if (!user) redirect('/login');

    priorPayment = await prisma.payment.findFirst({
      where: { userId: user.id, status: 'paid' },
    });
  } catch (err) {
    console.error('[PricingPage] DB unreachable:', err);
    redirect('/dashboard?error=db_unavailable');
  }

  if (!user) redirect('/login');

  const plan = priorPayment ? PLANS.pro : PLANS.intro;
  const isIntro = !priorPayment;
  const isProActive = user.plan === 'pro' && user.planExpiresAt && new Date(user.planExpiresAt) > new Date();
  const expiresOn = user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const features = [
    '2,000 email credits',
    '1 month full access',
    'All marketplace templates',
    'Live website previews for clients',
    'Unlimited lead uploads',
    'All niche templates included',
    'Priority campaign execution',
  ];

  return (
    <div className="animate-slide-up min-h-screen bg-[#080B14] flex flex-col items-center justify-center px-4 py-16">
      {/* Back */}
      <div className="w-full max-w-4xl mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        {isIntro && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
            <Zap className="w-3 h-3" fill="currentColor" /> Special Launch Offer
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">2,000 Credits</span>
          <br />for just <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{plan.label}</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          One month of unlimited outreach. Reach 2,000 potential clients with personalized website previews.
        </p>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">

        {/* Pricing Card */}
        <div className="relative">
          {/* Popular badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Most Popular
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#111827] to-[#0d1422] border-2 border-primary/40 rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              {/* Plan name */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" fill="currentColor" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Pro Monthly</p>
                  <p className="text-xs text-slate-300">1 month · 2,000 credits</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-extrabold text-white">{plan.label}</span>
                  {isIntro && (
                    <div className="mb-2">
                      <span className="text-slate-400 line-through text-lg">₹999</span>
                      <p className="text-xs text-green-400 font-bold">99.9% off launch price</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">One-time payment · No auto-renewal</p>
              </div>

              {/* Active plan status */}
              {isProActive && (
                <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-green-400">Pro Active</p>
                    <p className="text-[10px] text-slate-400">Expires {expiresOn}</p>
                  </div>
                </div>
              )}

              {/* Current credits */}
              <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Your current credits</span>
                  <span className="text-lg font-bold text-amber-400">{user.credits.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-300">After purchase</span>
                  <span className="text-lg font-bold text-green-400">+2,000 = {(user.credits + 2000).toLocaleString()}</span>
                </div>
              </div>

              {/* CTA Button */}
              <BuyCreditsButton userEmail={user.email} userName={user.name || undefined} />

              <div className="flex items-center gap-2 justify-center mt-4">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-400">Secured by Razorpay · UPI, Cards, Net Banking accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features + What you get */}
        <div className="space-y-6">
          {/* Features list */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> What's included
            </p>
            <ul className="space-y-2.5">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* How credits work */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> How credits work
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1 credit</span>
                <span>= 1 personalized cold email sent</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2,000 credits</span>
                <span>= reach up to 2,000 potential clients</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 font-bold">Est. 100–300</span>
                <span>replies from 2,000 outreach emails</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">No expiry</span>
                <span>on unused credits after plan ends</span>
              </div>
            </div>
          </div>

          {/* Plan expiry info */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Plan timeline
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Duration</span>
                <span className="text-white font-semibold">30 days from purchase</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Credits granted</span>
                <span className="text-amber-400 font-bold">+2,000 instantly</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Auto-renewal</span>
                <span className="text-green-400 font-semibold">None — one-time</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Payment</span>
                <span className="text-white font-semibold">Razorpay (UPI, Card, NetBanking)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-400" /> 256-bit SSL</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> RBI-compliant</span>
        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-400" /> Instant credits</span>
        <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-primary" /> Razorpay secured</span>
      </div>
    </div>
  );
}
