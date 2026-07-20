import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import {
  Users, Mail, Megaphone, Database, TrendingUp,
  AlertTriangle, Activity, Zap, Globe, ShieldCheck,
  ArrowUpRight, ArrowDownRight, Coins
} from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers, activeUsers, totalLeads, totalCampaigns,
    totalTemplates, totalSmtp, campaignStats,
    recentUsers, topCampaigns, blockedUsers,
    nicheDist, recentCreditHistory,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count(),
    prisma.campaign.count(),
    prisma.template.count(),
    prisma.smtpAccount.count(),
    prisma.campaign.aggregate({ _sum: { sent: true, failed: true, total: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 8,
      select: { id: true, email: true, name: true, credits: true, status: true,
        createdAt: true, plan: true, _count: { select: { campaigns: true, leads: true } } },
    }),
    prisma.campaign.findMany({
      orderBy: { sent: 'desc' }, take: 5,
      select: { id: true, name: true, sent: true, failed: true, total: true,
        status: true, createdAt: true, user: { select: { email: true } } },
    }),
    prisma.user.count({ where: { status: 'blocked' } }),
    prisma.lead.groupBy({ by: ['niche'], _count: true, orderBy: { _count: { niche: 'desc' } }, take: 6 }),
    prisma.creditHistory.findMany({
      orderBy: { createdAt: 'desc' }, take: 6,
      select: { action: true, amount: true, reason: true, createdAt: true,
        user: { select: { email: true, name: true } } },
    }),
  ]);

  const totalSent = campaignStats._sum.sent ?? 0;
  const totalFailed = campaignStats._sum.failed ?? 0;
  const totalVolume = campaignStats._sum.total ?? 0;
  const deliveryRate = totalVolume > 0 ? Math.round((totalSent / totalVolume) * 100) : 0;
  const replyLow = Math.round(totalSent * 0.05);
  const replyHigh = Math.round(totalSent * 0.15);
  const failRate = totalVolume > 0 ? Math.round((totalFailed / totalVolume) * 100) : 0;

  const kpis = [
    { label: 'Total Users', value: totalUsers, sub: `${blockedUsers} blocked`, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', href: '/admin/users' },
    { label: 'Active (7d)', value: activeUsers, sub: `${totalUsers > 0 ? Math.round((activeUsers/totalUsers)*100) : 0}% of users`, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', href: '/admin/users' },
    { label: 'Campaigns', value: totalCampaigns, sub: `Avg ${totalUsers > 0 ? (totalCampaigns/totalUsers).toFixed(1) : 0}/user`, icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/admin/campaigns' },
    { label: 'Emails Sent', value: totalSent.toLocaleString(), sub: `${deliveryRate}% delivery rate`, icon: Mail, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', href: '/admin/campaigns' },
    { label: 'Est. Replies', value: `${replyLow}–${replyHigh}`, sub: '5–15% open estimate', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', href: '/admin/campaigns' },
    { label: 'Total Leads', value: totalLeads.toLocaleString(), sub: `${totalSmtp} SMTP accounts`, icon: Database, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', href: '/admin/leads' },
  ];

  const nicheIcons: Record<string, string> = {
    gym: '🏋️', salon: '💅', 'real-estate': '🏠',
    coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Full visibility and control over WebKarigar SaaS</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-400">System Online</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(stat => (
          <Link key={stat.label} href={stat.href}
            className={`bg-card border ${stat.border} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden`}>
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] font-bold text-white mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{stat.sub}</p>
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Performance Row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Delivery Rate</p>
          <p className="text-4xl font-extrabold text-green-400">{deliveryRate}%</p>
          <p className="text-xs text-gray-600 mt-1">{totalSent.toLocaleString()} sent · {totalFailed} failed</p>
          <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" style={{ width: `${deliveryRate}%` }} />
          </div>
        </div>
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Failure Rate</p>
          <p className={`text-4xl font-extrabold ${failRate > 20 ? 'text-red-400' : failRate > 10 ? 'text-amber-400' : 'text-green-400'}`}>{failRate}%</p>
          <p className="text-xs text-gray-600 mt-1">{totalFailed} failed of {totalVolume.toLocaleString()} total</p>
          <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${failRate > 20 ? 'bg-red-500' : failRate > 10 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${failRate}%` }} />
          </div>
          {failRate > 15 && (
            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1">
              <AlertTriangle className="w-3 h-3" /> High failure rate detected
            </div>
          )}
        </div>
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Niche Distribution</p>
          <div className="mt-2 space-y-2">
            {nicheDist.slice(0, 4).map(n => (
              <div key={n.niche} className="flex items-center gap-2">
                <span className="text-sm">{nicheIcons[n.niche as string] || '📄'}</span>
                <span className="text-xs text-gray-300 flex-1 capitalize">{n.niche || 'unknown'}</span>
                <span className="text-xs font-bold text-white">{typeof n._count === 'number' ? n._count : (n._count as any).niche ?? 0}</span>
              </div>
            ))}
            {nicheDist.length === 0 && <p className="text-xs text-gray-500">No leads yet</p>}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" /> Recent Users
            </h2>
            <Link href="/admin/users" className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentUsers.map(u => (
              <Link key={u.id} href={`/admin/users/${u.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {(u.name || u.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{u.name || 'No name'}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <span className={`block text-[10px] px-2 py-0.5 rounded-full font-bold
                    ${u.status === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {u.status}
                  </span>
                  <span className="block text-[10px] text-amber-400">{u.credits} cr</span>
                </div>
              </Link>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No users yet</p>}
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-400" /> Top Campaigns
            </h2>
            <Link href="/admin/campaigns" className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topCampaigns.map((c, idx) => {
              const rate = c.total > 0 ? Math.round((c.sent / c.total) * 100) : 0;
              return (
                <div key={c.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-500 w-5">#{idx + 1}</span>
                    <p className="text-sm font-semibold text-white flex-1 truncate">{c.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                      ${c.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                        c.status === 'running' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                        c.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-500/10 text-gray-400'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">{c.user.email}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs text-white font-semibold">{c.sent}/{c.total}</span>
                    <span className="text-[10px] text-green-400">~{Math.round(c.sent * 0.05)}–{Math.round(c.sent * 0.15)} replies</span>
                  </div>
                </div>
              );
            })}
            {topCampaigns.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No campaigns yet</p>}
          </div>
        </div>
      </div>

      {/* Credit History */}
      <div className="bg-card border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Coins className="w-4 h-4 text-amber-400" /> Recent Credit Activity
        </h2>
        {recentCreditHistory.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No credit activity yet. Use the Users page to add/deduct credits.</p>
        ) : (
          <div className="space-y-2">
            {recentCreditHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${h.action === 'add' ? 'bg-green-500/10' : h.action === 'deduct' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  {h.action === 'add' ? <ArrowUpRight className="w-4 h-4 text-green-400" /> :
                   h.action === 'deduct' ? <ArrowDownRight className="w-4 h-4 text-red-400" /> :
                   <Zap className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{h.user.name || h.user.email}</p>
                  <p className="text-[10px] text-gray-500">{h.reason || 'No reason given'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${h.action === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                    {h.action === 'add' ? '+' : '-'}{h.amount} cr
                  </p>
                  <p className="text-[10px] text-gray-600">{new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DB Health */}
      <div className="bg-card border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Supabase PostgreSQL — Connected</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalUsers} users · {totalLeads} leads · {totalCampaigns} campaigns · {totalSmtp} SMTP accounts
          </p>
        </div>
        <ShieldCheck className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" />
      </div>
    </div>
  );
}
