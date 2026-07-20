import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Zap, Shield, LogOut } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';

const SUPREME_ADMIN = 'coderrohit2927@gmail.com';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (session.user.email !== SUPREME_ADMIN) redirect('/dashboard');


  return (
    <div className="min-h-screen bg-[#080B14] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-background flex flex-col sticky top-0 h-screen">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">WebKarigar</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Supreme Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active-link nav (client component) */}
        <AdminNav />

        {/* Bottom: signed-in user + back link */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {session.user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{session.user.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
