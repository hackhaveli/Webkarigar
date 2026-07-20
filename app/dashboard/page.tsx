import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AlertTriangle, ChevronRight, Play, Globe, TrendingUp, MessageSquare, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageGuide } from '@/components/dashboard/PageGuide';
import { VisualWorkflowBanner } from '@/components/dashboard/VisualWorkflowBanner';
import { VisualQuickActionGrid } from '@/components/dashboard/VisualQuickActionGrid';
import { VisualAnalyticsCard } from '@/components/dashboard/VisualAnalyticsCard';
import { EmptyCampaignGraphic } from '@/components/dashboard/illustrations/DashboardIllustrations';

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  let user: (Awaited<ReturnType<typeof prisma.user.findUnique>> & { _count: { leads: number; smtpAccounts: number; templates: number; campaigns: number }, campaigns: any[] }) | null = null;
  let dbError = false;

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        planExpiresAt: true,
        _count: {
          select: { leads: true, smtpAccounts: true, templates: true, campaigns: true },
        },
        campaigns: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        }
      },
    }) as any;
  } catch (err) {
    console.error('[DashboardOverview] DB unreachable:', err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 p-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Database temporarily unavailable</h2>
        <p className="text-slate-300 max-w-md">Supabase is experiencing connectivity issues. Your data is safe — please refresh in a moment.</p>
        <a href="/dashboard" className="px-6 py-2.5 rounded-lg bg-white text-black font-bold hover:bg-slate-200 transition-colors cursor-pointer">Retry</a>
      </div>
    );
  }

  if (!user) return null;

  const isProActive = Boolean(user.plan === 'pro' && user.planExpiresAt && new Date(user.planExpiresAt) > new Date());
  const planExpiresOn = user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;

  const totalSent = user.campaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalAttempted = user.campaigns.reduce((acc, c) => acc + c.sent + c.failed, 0);
  const successRate = totalAttempted > 0 ? Math.round((totalSent / totalAttempted) * 100) : 0;
  const creditsLow = user.credits <= 10;

  return (
    <div className="space-y-8 flex flex-col h-full max-w-7xl mx-auto pb-16 animate-slide-up">
      <PageGuide title="Welcome to your WebKarigar dashboard" defaultOpen={false}>
        <p>This is your command center for running personalized website outreach campaigns. Here&apos;s the workflow:</p>
        <p><strong>1.</strong> Connect SMTP → <strong>2.</strong> Get leads (import CSV or use AI Lead Finder) → <strong>3.</strong> Pick a website template → <strong>4.</strong> Create email template → <strong>5.</strong> Launch campaign</p>
        <p>Follow the visual guide below to complete your setup easily.</p>
      </PageGuide>

      {/* ⚠ Urgency Banner — Credits Low */}
      {creditsLow && (
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/20 border border-amber-500/30 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-300">Only {user.credits} credits left — reach more clients before running out</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Each credit sends one personalized website to a potential client.</p>
          </div>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold flex-shrink-0 cursor-pointer" asChild>
            <Link href="/dashboard/pricing">Get 2,000 Credits — ₹1</Link>
          </Button>
        </div>
      )}

      {/* 1. Visual Workflow Banner (21dev / UI-UX Pro Max Style) */}
      <VisualWorkflowBanner
        smtpCount={user._count.smtpAccounts}
        leadsCount={user._count.leads}
        templatesCount={user._count.templates}
        campaignsCount={user._count.campaigns}
      />

      {/* 2. Visual Analytics Metric Cards */}
      <VisualAnalyticsCard
        leadsCount={user._count.leads}
        totalSent={totalSent}
        successRate={successRate}
        credits={user.credits}
        isProActive={isProActive}
        planExpiresOn={planExpiresOn}
      />

      {/* 3. Quick Actions & Visual Shortcuts */}
      <VisualQuickActionGrid />

      {/* 4. Two-column layout: Recent Activity + Conversion Insights */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Campaigns — 2/3 width */}
        <div className="lg:col-span-2 bg-[#0d1222] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Recent Outreach Activity
              </h3>
              <p className="text-xs text-slate-400 mt-1">Live status of your active and past campaigns</p>
            </div>
            <Button variant="link" className="text-violet-400 hover:text-violet-300 p-0 font-semibold cursor-pointer text-xs" asChild>
              <Link href="/dashboard/campaigns">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          <div className="w-full">
            {user.campaigns.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-center p-10 border border-dashed border-violet-500/20 rounded-2xl bg-[#090d19]">
                <EmptyCampaignGraphic className="w-40 h-40 mb-2" />
                <h4 className="text-lg font-bold text-white mb-1">No outreach campaigns yet</h4>
                <p className="text-slate-400 text-xs max-w-sm mb-6 font-medium">
                  Launch your first automated campaign to show live website previews to local business owners.
                </p>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 cursor-pointer" asChild>
                  <Link href="/dashboard/campaigns/new">Launch First Campaign →</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 w-full">
                {user.campaigns.map(camp => (
                  <Link key={camp.id} href={`/dashboard/campaigns/${camp.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-white/10 bg-[#090d19] hover:bg-[#12192e] transition-all duration-200 group hover:border-violet-500/40 cursor-pointer">
                    <div className="flex flex-col mb-4 sm:mb-0">
                      <span className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">{camp.name}</span>
                      <span className="text-xs text-slate-400 truncate max-w-md mt-1">{camp.subject}</span>
                      {camp.sent > 0 && (
                        <span className="text-xs text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">
                          📬 ~{Math.round(camp.sent * 0.05)}–{Math.round(camp.sent * 0.15)} replies estimated
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-40">
                        <div className="flex justify-between w-full text-xs mb-1 font-semibold">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{camp.sent} / {camp.total}</span>
                        </div>
                        <Progress value={camp.total > 0 ? (camp.sent / camp.total) * 100 : 0} className="h-1.5 bg-slate-800 w-full" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`px-3 py-1 text-xs border-none font-bold ${
                          camp.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                          camp.status === 'complete' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {camp.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />}
                          {camp.status.toUpperCase()}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Why Visual Outreach Works + Email Copy Template */}
        <div className="space-y-6">

          {/* WHY VISUAL PITCHING WORKS */}
          <div className="bg-gradient-to-br from-[#121124] to-[#080814] border border-violet-500/25 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-violet-600/10 rounded-full blur-3xl" />
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Why Visual Outreach Converts 3-5x
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Live Personalized Previews</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Prospects see their business name on a working site instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Zero-Friction Conversion</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">No sales calls or PDF proposals required to spark interest.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">High Open & Reply Rates</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Short email copy bypasses spam filters and gets read.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDED HIGH-REPLY EMAIL TEMPLATE */}
          <div className="bg-[#0d1222] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <p className="text-[11px] font-extrabold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Recommended High-Reply Copy
            </p>
            <div className="bg-[#070912] rounded-2xl p-4 border border-white/10 shadow-inner">
              <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">{`Hey [Name],

I made a quick personalized website for your business:
[demo_link]

Let me know if you'd like me to host this live for you.

— Rohit`}</pre>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">Under 45 words. Gets immediate responses on mobile.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
