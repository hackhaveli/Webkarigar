import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AdminCampaignActions } from '@/components/admin/AdminCampaignActions';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminCampaignsPage({ searchParams }: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const limit = 25;
  const skip = (page - 1) * limit;
  const q = resolvedParams.q || '';
  const statusFilter = resolvedParams.status || '';

  const where: any = {};
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { user: { email: { contains: q, mode: 'insensitive' } } },
  ];
  if (statusFilter) where.status = statusFilter;

  const [campaigns, totalCount, aggStats, failingCampaigns] = await Promise.all([
    prisma.campaign.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, status: true, sent: true, failed: true,
        total: true, subject: true, createdAt: true,
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.campaign.count({ where }),
    prisma.campaign.aggregate({ _sum: { sent: true, failed: true, total: true } }),
    // Campaigns with high failure rates
    prisma.campaign.findMany({
      where: { failed: { gt: 5 }, total: { gt: 0 } },
      orderBy: { failed: 'desc' }, take: 3,
      select: { id: true, name: true, sent: true, failed: true, total: true, user: { select: { email: true } } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const totalSent = aggStats._sum.sent ?? 0;
  const totalFailed = aggStats._sum.failed ?? 0;
  const totalVolume = aggStats._sum.total ?? 0;

  const statusCounts = await Promise.all(
    ['draft', 'running', 'complete', 'failed'].map(s =>
      prisma.campaign.count({ where: { status: s } }).then(c => ({ status: s, count: c }))
    )
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Campaigns</p>
          <h1 className="text-3xl font-extrabold text-white">Campaign Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">{totalCount} campaigns · {totalSent.toLocaleString()} emails sent</p>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-3">
        {[{ status: '', label: 'All', color: 'bg-white/5 text-gray-300 border-white/10' },
          ...statusCounts.map(s => ({
            status: s.status, label: `${s.status} (${s.count})`,
            color: s.status === 'running' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              s.status === 'complete' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              s.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-gray-500/10 text-gray-400 border-gray-500/20'
          }))
        ].map(opt => (
          <Link key={opt.status} href={`/admin/campaigns?status=${opt.status}&q=${q}`}
            className={`px-4 py-2 rounded-full text-xs font-bold border capitalize transition-all
              ${statusFilter === opt.status ? 'ring-2 ring-primary/40 ' : ''}${opt.color}`}>
            {opt.status === 'running' && <span className="mr-1.5 text-[8px]">●</span>}
            {opt.label}
          </Link>
        ))}
      </div>

      {/* High failure warning */}
      {failingCampaigns.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-400">High Failure Campaigns Detected</p>
          </div>
          <div className="space-y-2">
            {failingCampaigns.map(c => (
              <div key={c.id} className="flex items-center gap-3 text-xs bg-amber-500/5 rounded-xl p-3 border border-amber-500/10">
                <span className="text-white font-semibold flex-1 truncate">{c.name}</span>
                <span className="text-gray-400">{c.user.email}</span>
                <span className="text-red-400 font-bold">{c.failed} failed / {c.total} total</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <form method="GET" className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input name="q" defaultValue={q} placeholder="Search campaign or user email..."
            className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40" />
        </div>
        <input type="hidden" name="status" value={statusFilter} />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/80 transition-colors">
          <Filter className="w-4 h-4 inline mr-1" /> Search
        </button>
      </form>

      {/* Campaign Table */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/3 border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Est. Replies</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map(c => {
                const rate = c.total > 0 ? Math.round((c.sent / c.total) * 100) : 0;
                const failRate = c.total > 0 ? Math.round((c.failed / c.total) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold truncate max-w-[180px]">{c.name}</p>
                      {c.subject && <p className="text-xs text-gray-500 truncate max-w-[180px]">{c.subject}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/users/${c.user.id}`} className="text-xs text-primary/80 hover:text-primary transition-colors truncate max-w-[120px] block">
                        {c.user.email}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold
                        ${c.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                          c.status === 'running' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                          c.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                          'bg-gray-500/10 text-gray-400'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs text-white">{c.sent}/{c.total}</span>
                        </div>
                        {failRate > 0 && (
                          <p className="text-[10px] text-red-400">{c.failed} failed ({failRate}%)</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-green-400">
                      ~{Math.round(c.sent * 0.05)}–{Math.round(c.sent * 0.15)}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <AdminCampaignActions campaignId={c.id} currentStatus={c.status} />
                    </td>
                  </tr>
                );
              })}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-500">No campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-gray-500">Page {page} of {totalPages} · {totalCount} campaigns</p>
            <div className="flex gap-2">
              {page > 1 && <Link href={`/admin/campaigns?page=${page - 1}&q=${q}&status=${statusFilter}`}
                className="px-3 py-1.5 text-xs bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg">←</Link>}
              {page < totalPages && <Link href={`/admin/campaigns?page=${page + 1}&q=${q}&status=${statusFilter}`}
                className="px-3 py-1.5 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded-lg">→</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
