import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { TrendingUp, BarChart3, Star, Mail, Zap } from 'lucide-react';
import { MARKETPLACE_TEMPLATES } from '@/lib/marketplace-templates';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  // Last 30 days daily signups
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [recentCampaigns, campaignAgg, userGrowth, topNiches, smtpStats] = await Promise.all([
    prisma.campaign.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, sent: true, failed: true, total: true, status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.campaign.aggregate({ _sum: { sent: true, failed: true, total: true } }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.lead.groupBy({ by: ['niche'], _count: true, orderBy: { _count: { niche: 'desc' } }, take: 6 }),
    prisma.smtpAccount.groupBy({ by: ['provider'], _count: true }),
  ]);

  const totalSent = campaignAgg._sum.sent ?? 0;
  const totalFailed = campaignAgg._sum.failed ?? 0;
  const totalVolume = campaignAgg._sum.total ?? 0;
  const deliveryRate = totalVolume > 0 ? ((totalSent / totalVolume) * 100).toFixed(1) : '0';

  // Group campaigns by day (last 30 days)
  const dailyCampaignMap: Record<string, { campaigns: number; sent: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0];
    dailyCampaignMap[key] = { campaigns: 0, sent: 0 };
  }
  recentCampaigns.forEach(c => {
    const key = new Date(c.createdAt).toISOString().split('T')[0];
    if (dailyCampaignMap[key]) {
      dailyCampaignMap[key].campaigns += 1;
      dailyCampaignMap[key].sent += c.sent;
    }
  });

  // Group users by day
  const dailyUserMap: Record<string, number> = {};
  Object.keys(dailyCampaignMap).forEach(k => { dailyUserMap[k] = 0; });
  userGrowth.forEach(u => {
    const key = new Date(u.createdAt).toISOString().split('T')[0];
    if (dailyUserMap[key] !== undefined) dailyUserMap[key] += 1;
  });

  const chartData = Object.entries(dailyCampaignMap).map(([date, val]) => ({
    date, ...val, users: dailyUserMap[date] || 0,
  }));

  const maxSent = Math.max(...chartData.map(d => d.sent), 1);
  const maxUsers = Math.max(...chartData.map(d => d.users), 1);

  // Top marketplace templates by campaign usage
  const topTemplates = [...MARKETPLACE_TEMPLATES]
    .sort((a, b) => b.campaignUsage - a.campaignUsage)
    .slice(0, 5);

  const nicheIcons: Record<string, string> = {
    gym: '🏋️', salon: '💅', 'real-estate': '🏠',
    coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒',
  };
  const maxNiche = topNiches[0]?._count || 1;

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Analytics</p>
        <h1 className="text-3xl font-extrabold text-white">Platform Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">30-day performance overview</p>
      </div>

      {/* Platform health summary */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Delivery Rate', value: `${deliveryRate}%`, icon: Mail, color: 'text-green-400', border: 'border-green-500/20' },
          { label: 'Total Sent (all time)', value: totalSent.toLocaleString(), icon: Zap, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'Est. Replies (5–15%)', value: `${Math.round(totalSent * 0.05)}–${Math.round(totalSent * 0.15)}`, icon: TrendingUp, color: 'text-amber-400', border: 'border-amber-500/20' },
          { label: 'Failed Emails', value: totalFailed.toLocaleString(), icon: BarChart3, color: totalFailed > 50 ? 'text-red-400' : 'text-gray-400', border: totalFailed > 50 ? 'border-red-500/20' : 'border-white/5' },
        ].map(s => (
          <div key={s.label} className={`bg-[#111827] border ${s.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</p>
            </div>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Email Sent — 30d Chart */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-400" /> Emails Sent — Last 30 Days
        </h2>
        <div className="relative h-40 flex items-end gap-1 pr-2">
          {chartData.map((d, i) => {
            const h = maxSent > 0 ? Math.round((d.sent / maxSent) * 100) : 0;
            const isToday = i === chartData.length - 1;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full rounded-t-sm transition-all duration-300 min-h-[2px]"
                  style={{
                    height: `${Math.max(h, d.sent > 0 ? 4 : 0)}%`,
                    background: isToday ? 'linear-gradient(to top, #6366f1, #818cf8)' : 'rgba(99,102,241,0.3)'
                  }} />
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1.5 text-center whitespace-nowrap shadow-xl">
                  <p className="text-[10px] text-gray-400">{d.date.slice(5)}</p>
                  <p className="text-xs font-bold text-white">{d.sent} sent</p>
                  <p className="text-[10px] text-blue-400">{d.campaigns} campaigns</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-600">
          <span>{chartData[0]?.date.slice(5)}</span>
          <span>{chartData[chartData.length - 1]?.date.slice(5)} (today)</span>
        </div>
      </div>

      {/* User Signups — 30d Chart */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" /> New User Signups — Last 30 Days
        </h2>
        <div className="relative h-32 flex items-end gap-1">
          {chartData.map((d, i) => {
            const h = maxUsers > 0 ? Math.round((d.users / maxUsers) * 100) : 0;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full rounded-t-sm transition-all"
                  style={{ height: `${Math.max(h, d.users > 0 ? 8 : 0)}%`, background: 'rgba(139,92,246,0.4)' }} />
                {d.users > 0 && (
                  <div className="absolute bottom-full mb-1.5 hidden group-hover:block z-10 bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1 text-center whitespace-nowrap shadow-xl">
                    <p className="text-[10px] text-gray-400">{d.date.slice(5)}</p>
                    <p className="text-xs font-bold text-violet-400">+{d.users} users</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-600">
          <span>{chartData[0]?.date.slice(5)}</span>
          <span>Today</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {userGrowth.length} new users in last 30 days
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Templates */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Star className="w-4 h-4 text-amber-400" /> Top Performing Templates
          </h2>
          <div className="space-y-3">
            {topTemplates.map((t, idx) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <span className="text-[11px] font-bold text-gray-500 w-5">#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{t.niche}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">{t.campaignUsage}+</p>
                  <p className="text-[10px] text-amber-400">⭐ {t.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMTP Provider distribution + Niche trends */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4">SMTP Provider Distribution</h2>
            <div className="space-y-2">
              {smtpStats.map(s => (
                <div key={s.provider} className="flex items-center gap-3">
                  <span className="text-sm capitalize text-gray-300 flex-1">{s.provider || 'other'}</span>
                  <span className="text-sm font-bold text-white">{s._count}</span>
                </div>
              ))}
              {smtpStats.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No SMTP accounts</p>}
            </div>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4">Lead Niche Trend</h2>
            <div className="space-y-2">
              {topNiches.map(n => {
                const pct = Math.round((n._count / maxNiche) * 100);
                return (
                  <div key={n.niche}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-300 capitalize flex items-center gap-1.5">
                        <span>{nicheIcons[n.niche as string] || '📄'}</span> {n.niche || 'unknown'}
                      </span>
                      <span className="text-xs font-bold text-white">{n._count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {topNiches.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No leads yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
