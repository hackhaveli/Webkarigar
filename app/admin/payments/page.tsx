import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CreditCard, TrendingUp, CheckCircle2, XCircle, IndianRupee } from 'lucide-react';

const SUPREME_ADMIN = 'coderrohit2927@gmail.com';

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== SUPREME_ADMIN) redirect('/dashboard');

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
    take: 100,
  });

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').length;
  const totalFailed = payments.filter(p => p.status === 'failed').length;
  const totalCreditsAwarded = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.creditsAwarded, 0);

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-xs text-amber-400/80 font-bold uppercase tracking-widest mb-1">Supreme Admin › Payments</p>
        <h1 className="text-3xl font-extrabold text-white">Payment History</h1>
        <p className="text-gray-400 text-sm mt-1">All Razorpay transactions across all users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 100).toFixed(0)}`, icon: IndianRupee, color: 'text-green-400' },
          { label: 'Paid Orders', value: totalPaid, icon: CheckCircle2, color: 'text-blue-400' },
          { label: 'Failed Orders', value: totalFailed, icon: XCircle, color: 'text-red-400' },
          { label: 'Credits Awarded', value: totalCreditsAwarded.toLocaleString(), icon: TrendingUp, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.color} bg-white/5 flex items-center justify-center`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/3 border-b border-white/5">
            <tr>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <p className="text-white font-semibold text-xs">{p.user.name || '—'}</p>
                  <p className="text-[11px] text-gray-500">{p.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-primary font-mono">{p.plan}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-bold text-xs">₹{(p.amount / 100).toFixed(0)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-amber-400 font-semibold text-xs">+{p.creditsAwarded.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    p.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {p.status === 'paid' ? '✓' : '✗'} {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-mono text-gray-500 truncate block max-w-[160px]">{p.razorpayPaymentId || p.razorpayOrderId}</span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500 italic">No payments yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
