'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  BarChart,
  LogOut,
  Store,
  Shield,
  Zap,
  CreditCard,
  Search,
  List,
  Settings,
  Download,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_EMAILS = ['coderrohit2927@gmail.com'];

const sidebarSections = [
  {
    label: 'YOUR SETUP',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', exact: true, desc: 'Overview & progress' },
      { label: 'SMTP Accounts', icon: Settings, href: '/dashboard/smtp', desc: 'Connect your email to send' },
      { label: 'Website Templates', icon: Store, href: '/dashboard/templates', desc: 'Pick a design to promote' },
      { label: 'Email Templates', icon: FileText, href: '/dashboard/email-templates', desc: 'Customize your pitch' },
    ],
  },
  {
    label: 'LEADS',
    items: [
      { label: 'Import Leads', icon: Download, href: '/dashboard/leads', desc: 'Upload CSV or Excel' },
      { label: 'AI Lead Finder', icon: Search, href: '/dashboard/lead-generation', desc: 'Scrape Meta Ads automatically' },
      { label: 'Found Leads', icon: List, href: '/dashboard/lead-generation/leads', desc: 'View AI-discovered leads' },
    ],
  },
  {
    label: 'OUTREACH',
    items: [
      { label: 'Campaigns', icon: Mail, href: '/dashboard/campaigns', desc: 'Send & track email campaigns' },
      { label: 'Analytics', icon: BarChart, href: '/dashboard/analytics', desc: 'See what works' },
    ],
  },
  {
    label: 'BILLING',
    items: [
      { label: 'Buy Credits', icon: Zap, href: '/dashboard/pricing', desc: '1 credit = 1 email sent' },
      { label: 'Billing History', icon: CreditCard, href: '/dashboard/billing', desc: 'Payments & usage' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="space-y-4 py-6 flex flex-col h-full bg-[#07090e] text-slate-200 border-r border-white/[0.08] shadow-2xl overflow-y-auto relative">
      {/* Subtle gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-500/[0.03] to-transparent pointer-events-none" />

      <div className="px-4 py-2 flex-1 relative z-10">
        <Link href="/dashboard" className="flex items-center pl-2 mb-8 group cursor-pointer">
          <div className="relative w-7 h-7 mr-2.5 group-hover:scale-110 transition-transform duration-300">
             <Image src="/webkarigar-white.png" alt="WebKarigar Logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors duration-200">WebKarigar</h1>
        </Link>

        {sidebarSections.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="px-3 mb-2.5">
              <span className="text-[10px] font-bold text-violet-400/80 uppercase tracking-[0.18em]">{section.label}</span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((route) => {
                const active = route.exact ? pathname === route.href : pathname.startsWith(route.href);
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative cursor-pointer ${
                      active
                        ? 'bg-violet-500/[0.12] text-white border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.08)]'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-400 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                    )}
                    <route.icon className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${active ? 'text-violet-400' : 'text-slate-500 group-hover:text-violet-400'}`} />
                    <div className="flex flex-col min-w-0 z-10">
                      <span className={`text-[13px] font-semibold leading-tight ${active ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {route.label}
                      </span>
                      {!active && (
                        <span className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate font-normal">{route.desc}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Help link */}
        <div className="mt-6 px-3">
          <a
            href="/templates/guide"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-all duration-200 text-xs font-medium cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
            How to use WebKarigar
          </a>
        </div>
      </div>

      {/* Admin shortcut */}
      {session?.user?.email && ADMIN_EMAILS.includes(session.user.email) && (
        <div className="px-4 mb-2">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200 text-xs font-bold cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5" />
            Admin Panel
          </Link>
        </div>
      )}

      <div className="mt-auto px-4 py-3.5 mx-4 flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl justify-between backdrop-blur-sm">
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate text-white">{session?.user?.name || 'User'}</p>
          <p className="text-[11px] text-slate-500 truncate">{session?.user?.email}</p>
        </div>
        <Button variant="ghost" size="icon" className="hover:bg-red-500/15 hover:text-red-400 text-slate-500 h-8 w-8 shrink-0 cursor-pointer transition-colors duration-200" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
