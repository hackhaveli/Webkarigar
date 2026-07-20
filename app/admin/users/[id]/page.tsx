import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Megaphone, Database, Wifi,
  Coins, Calendar, ShieldCheck, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { AdminUserActions } from '@/components/admin/AdminUserActions';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      campaigns: { orderBy: { createdAt: 'desc' }, take: 10 },
      leads: { orderBy: { createdAt: 'desc' }, take: 10 },
      smtpAccounts: true,
      creditHistory: { orderBy: { createdAt: 'desc' }, take: 15 },
    },
  });

  if (!user) notFound();

  const totalSent = user.campaigns.reduce((a, c) => a + c.sent, 0);
  const totalFailed = user.campaigns.reduce((a, c) => a + c.failed, 0);

  const nicheDist: Record<string, number> = {};
  user.leads.forEach(l => { if (l.niche) nicheDist[l.niche] = (nicheDist[l.niche] || 0) + 1; });

  return (
    <div className="p-8 space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/users"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all mt-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Users
        </Link>
        <div className="flex-1">
          <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Users › Detail</p>
          <h1 className="text-3xl font-extrabold text-white">{user.name || 'Unnamed User'}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
        </div>
        <AdminUserActions userId={user.id} currentStatus={user.status} currentCredits={user.credits} />
      </div>

      {/* Profile Card + Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Profile */}
        <div className="md:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/40 to-blue-600/40 flex items-center justify-center text-2xl font-bold text-white">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name || '—'}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex gap-2 mt-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                  ${user.status === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                  {user.status}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border
                  ${user.plan === 'pro' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                  {user.plan}
                </span>
                {user.role === 'admin' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400">Admin</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Joined</span>
              <span className="text-white">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Last Active</span>
              <span className="text-white">{user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'Never'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">User ID</span>
              <span className="text-xs text-gray-400 font-mono">{user.id}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        {[
          { label: 'Credits', value: user.credits, icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Campaigns', value: user.campaigns.length, icon: Megaphone, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Leads', value: user.leads.length, icon: Database, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
          { label: 'SMTP Accounts', value: user.smtpAccounts.length, icon: Wifi, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        ].map(s => (
          <div key={s.label} className={`bg-[#111827] border ${s.border} rounded-2xl p-5`}>
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Campaign History + Credit History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campaign History */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-blue-400" /> Campaign History
            <span className="text-xs text-gray-500 font-normal ml-auto">{totalSent} sent · {totalFailed} failed</span>
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {user.campaigns.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No campaigns yet</p>
            ) : user.campaigns.map(c => {
              const rate = c.total > 0 ? Math.round((c.sent / c.total) * 100) : 0;
              return (
                <div key={c.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-white flex-1 truncate">{c.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                      ${c.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                        c.status === 'running' ? 'bg-blue-500/10 text-blue-400' :
                        c.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-500/10 text-gray-400'}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs text-white">{c.sent}/{c.total}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credit History */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Coins className="w-4 h-4 text-amber-400" /> Credit History
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {user.creditHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No credit changes yet</p>
            ) : user.creditHistory.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                  ${h.action === 'add' ? 'bg-green-500/10' : h.action === 'deduct' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  {h.action === 'add' ? <ArrowUpRight className="w-3.5 h-3.5 text-green-400" /> :
                   h.action === 'deduct' ? <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> :
                   <Zap className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white capitalize">{h.action.replace('_', ' ')}</p>
                  <p className="text-[10px] text-gray-500 truncate">{h.reason || 'No reason'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${h.action === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                    {h.action === 'add' ? '+' : '-'}{h.amount}
                  </p>
                  <p className="text-[10px] text-gray-600">{new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-pink-400" /> Recent Leads
          <span className="text-xs text-gray-500 font-normal ml-auto">Showing {Math.min(user.leads.length, 10)} of {user.leads.length}</span>
        </h2>
        {user.leads.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No leads uploaded</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {user.leads.map(l => (
              <div key={l.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                <p className="text-sm font-semibold text-white truncate">{l.businessName || l.name}</p>
                <p className="text-xs text-gray-500 truncate">{l.email}</p>
                {l.niche && (
                  <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    {l.niche}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SMTP Accounts */}
      {user.smtpAccounts.length > 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Wifi className="w-4 h-4 text-green-400" /> SMTP Accounts
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {user.smtpAccounts.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{s.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{s.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
