import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Settings, Shield, Database, Bell, Users } from 'lucide-react';
import { AdminBroadcastForm } from '@/components/admin/AdminBroadcastForm';
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  if (!ADMIN_EMAILS.includes(session.user.email)) redirect('/dashboard');

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-xs text-primary/70 font-bold uppercase tracking-widest mb-1">Admin › Settings</p>
        <h1 className="text-3xl font-extrabold text-white">Platform Settings</h1>
        <p className="text-gray-400 text-sm mt-1">System configuration and admin controls</p>
      </div>

      {/* Admin Access */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-red-400" /> Admin Access Control
        </h2>
        <p className="text-sm text-gray-400 mb-4">The following emails have full admin panel access:</p>
        <div className="space-y-2">
          {ADMIN_EMAILS.map(email => (
            <div key={email} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-sm text-white font-mono">{email}</p>
              {email === session.user?.email && (
                <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">YOU</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4">To add/remove admins, update the ADMIN_EMAILS array in middleware.ts and admin pages.</p>
      </div>

      {/* DB Info */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Database className="w-4 h-4 text-blue-400" /> Database Configuration
        </h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Database', value: 'Supabase PostgreSQL' },
            { label: 'Connection', value: 'Connection Pooler (PgBouncer)' },
            { label: 'ORM', value: 'Prisma 5.x' },
            { label: 'Models', value: 'User, Lead, Campaign, Template, SmtpAccount, CreditHistory' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">{r.label}</span>
              <span className="text-white font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Notifications */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-amber-400" /> Broadcast Notification
        </h2>
        <p className="text-xs text-gray-500 mb-5">Send a message or announcement to all users on the platform.</p>
        <AdminBroadcastForm />
      </div>

      {/* Role System Info */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-violet-400" /> Role System
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { role: 'user', desc: 'Standard platform access. Can create campaigns, manage leads, send emails.', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
            { role: 'admin', desc: 'Full admin panel access. Can manage users, credits, campaigns, templates.', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
            { role: 'super-admin', desc: 'Future role: billing access, system config, multi-tenant management.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          ].map(r => (
            <div key={r.role} className={`${r.bg} border ${r.border} rounded-xl p-4`}>
              <p className={`text-sm font-bold mb-2 ${r.color} uppercase tracking-wide`}>{r.role}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credit System */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-1">Credit System Config</h2>
        <p className="text-xs text-gray-500 mb-4">Values apply dynamically to new signups and campaign executions.</p>
        <AdminSettingsForm />
      </div>
    </div>
  );
}
