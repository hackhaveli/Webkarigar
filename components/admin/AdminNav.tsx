'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Megaphone, FileCode2,
  Database, BarChart3, Settings, ChevronRight, CreditCard,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/admin/templates', label: 'Marketplace Templates', icon: FileCode2 },
  { href: '/admin/leads', label: 'Lead Insights', icon: Database },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
];


export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${isActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
            <span className="flex-1">{label}</span>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
            {!isActive && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" />}
          </Link>
        );
      })}
    </nav>
  );
}
