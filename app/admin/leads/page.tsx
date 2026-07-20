import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Database, Users, ArrowUpRight } from 'lucide-react';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

const nicheIcons: Record<string, string> = {
  gym: '🏋️', salon: '💅', 'real-estate': '🏠',
  coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒',
};

const nicheColors: Record<string, string> = {
  gym: 'from-orange-500 to-red-500',
  salon: 'from-pink-500 to-rose-500',
  'real-estate': 'from-blue-500 to-indigo-500',
  coaching: 'from-violet-500 to-purple-500',
  restaurant: 'from-yellow-500 to-amber-500',
  ecommerce: 'from-teal-500 to-cyan-500',
};

export default async function AdminLeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  // Fetch data using aggregation-safe Prisma queries
  const [totalLeads, nicheDist, duplicateRaw] = await Promise.all([
    prisma.lead.count(),
    // Group by niche with count
    prisma.lead.groupBy({
      by: ['niche'],
      _count: { niche: true },
      orderBy: { _count: { niche: 'desc' } },
    }),
    // Find emails with more than 1 occurrence
    prisma.lead.groupBy({
      by: ['email'],
      _count: { email: true },
      having: { email: { _count: { gt: 1 } } },
      orderBy: { _count: { email: 'desc' } },
      take: 5,
    }),
  ]);

  // Leads per user — use findMany with aggregation counts
  const leadsPerUserRaw = await prisma.lead.groupBy({
    by: ['userId'],
    _count: { userId: true },
    orderBy: { _count: { userId: 'desc' } },
    take: 10,
  });

  const userIds = leadsPerUserRaw.map(l => l.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const leadsPerUser = leadsPerUserRaw.map(row => ({
    userId: row.userId,
    count: row._count.userId,
  }));

  const duplicateEmails = duplicateRaw.map(d => ({
    email: d.email,
    count: d._count.email,
  }));

  const maxLeads = leadsPerUser[0]?.count || 1;
  const maxNiche = nicheDist[0]?._count.niche || 1;

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Lead Insights</p>
        <h1 className="text-3xl font-extrabold text-white">Lead Insights</h1>
        <p className="text-gray-400 text-sm mt-1">{totalLeads.toLocaleString()} total leads across all users</p>
      </div>

      {/* Top stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-pink-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Leads</p>
          <p className="text-4xl font-extrabold text-pink-400">{totalLeads.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">uploaded across all accounts</p>
        </div>
        <div className="bg-[#111827] border border-violet-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Niches Covered</p>
          <p className="text-4xl font-extrabold text-violet-400">{nicheDist.filter(n => n.niche).length}</p>
          <p className="text-xs text-gray-600 mt-1">different business niches</p>
        </div>
        <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-6">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Duplicate Emails</p>
          <p className={`text-4xl font-extrabold ${duplicateEmails.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {duplicateEmails.length}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {duplicateEmails.length > 0 ? 'potential spam leads detected' : 'clean — no duplicates found'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Niche Distribution */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Database className="w-4 h-4 text-pink-400" /> Niche Distribution
          </h2>
          <div className="space-y-3">
            {nicheDist.map(n => {
              const count = n._count.niche;
              const pct = Math.round((count / maxNiche) * 100);
              const niche = n.niche || 'unknown';
              return (
                <div key={niche}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{nicheIcons[niche] || '📄'}</span>
                      <span className="text-sm text-white font-medium capitalize">{niche}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${nicheColors[niche] || 'from-gray-500 to-gray-600'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {nicheDist.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No leads uploaded yet</p>}
          </div>
        </div>

        {/* Leads Per User */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-violet-400" /> Top Users by Leads
          </h2>
          <div className="space-y-3">
            {leadsPerUser.map((row, idx) => {
              const user = userMap[row.userId];
              const pct = Math.round((row.count / maxLeads) * 100);
              return (
                <div key={row.userId}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-bold text-gray-500 w-5">#{idx + 1}</span>
                    <Link href={`/admin/users/${row.userId}`}
                      className="text-sm text-white font-medium hover:text-primary transition-colors flex items-center gap-1 flex-1 truncate">
                      {user?.name || user?.email || row.userId}
                      <ArrowUpRight className="w-3 h-3 opacity-40 flex-shrink-0" />
                    </Link>
                    <span className="text-sm font-bold text-white">{row.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ml-8">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {leadsPerUser.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No leads data</p>}
          </div>
        </div>
      </div>

      {/* Duplicate Detection */}
      {duplicateEmails.length > 0 && (
        <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            ⚠️ Duplicate Emails Detected
          </h2>
          <div className="space-y-2">
            {duplicateEmails.map(d => (
              <div key={d.email} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <span className="text-sm text-gray-300 flex-1 font-mono truncate">{d.email}</span>
                <span className="text-xs text-red-400 font-bold">{d.count} occurrences</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
