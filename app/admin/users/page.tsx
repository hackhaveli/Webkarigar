import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Search, ArrowUpRight, Download, Filter } from 'lucide-react';
import { AdminUserActions } from '@/components/admin/AdminUserActions';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminUsersPage({ searchParams }: { searchParams: { q?: string; status?: string; plan?: string; page?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;
  const q = searchParams.q || '';
  const statusFilter = searchParams.status || '';
  const planFilter = searchParams.plan || '';

  const where: any = {};
  if (q) { where.OR = [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }]; }
  if (statusFilter) where.status = statusFilter;
  if (planFilter) where.plan = planFilter;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, credits: true, role: true,
        status: true, plan: true, createdAt: true, lastActiveAt: true,
        _count: { select: { campaigns: true, leads: true, smtpAccounts: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Users</p>
          <h1 className="text-3xl font-extrabold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">{totalCount} total users</p>
        </div>
      </div>

      {/* Filter bar */}
      <form method="GET" className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            name="q" defaultValue={q} placeholder="Search email or name..."
            className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40"
          />
        </div>
        <select name="status" defaultValue={statusFilter}
          className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select name="plan" defaultValue={planFilter}
          className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/40">
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button type="submit"
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/80 transition-colors">
          <Filter className="w-4 h-4 inline mr-1" /> Filter
        </button>
      </form>

      {/* Table */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/3 border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Campaigns</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {(u.name || u.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/users/${u.id}`} className="text-white font-semibold hover:text-primary transition-colors truncate block">
                          {u.name || '—'}
                        </Link>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                      {u.role === 'admin' && (
                        <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase">Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold border
                      ${u.plan === 'pro' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                        u.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-amber-400 font-bold">{u.credits}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{u._count.campaigns}</td>
                  <td className="px-4 py-4 text-gray-300">{u._count.leads}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold
                      ${u.status === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/users/${u.id}`}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1">
                        View <ArrowUpRight className="w-3 h-3" />
                      </Link>
                      <AdminUserActions userId={u.id} currentStatus={u.status} currentCredits={u.credits} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-gray-500">Page {page} of {totalPages} · {totalCount} users</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/users?page=${page - 1}&q=${q}&status=${statusFilter}&plan=${planFilter}`}
                  className="px-3 py-1.5 text-xs bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors">←</Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/users?page=${page + 1}&q=${q}&status=${statusFilter}&plan=${planFilter}`}
                  className="px-3 py-1.5 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors">→</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
