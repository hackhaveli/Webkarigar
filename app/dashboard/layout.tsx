import { Sidebar } from '@/components/dashboard/Sidebar';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Zap, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let credits = 0;
  if (session?.user?.email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { credits: true },
      });
      if (user) credits = user.credits;
    } catch (err) {
      console.error('[Dashboard] Could not reach database:', err);
      // Gracefully fall back — credits stays 0, UI still loads
    }
  }

  return (
    <div className="h-full relative flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>

      <main className="md:pl-72 flex-1 w-full flex flex-col bg-[#020617] text-slate-100 min-h-screen scroll-smooth">
        {/* Header with gradient glow bottom border */}
        <header className="h-16 px-6 flex items-center border-b border-white/[0.08] sticky top-0 z-50 justify-between bg-[#07090e]/80 backdrop-blur-xl">
          {/* Gradient glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r border-white/10 bg-[#07090e] w-72">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Image src="/webkarigar-white.png" alt="Logo" width={24} height={24} className="object-contain" />
              <span className="font-bold text-lg text-white hidden sm:inline-block">WebKarigar</span>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Badge variant="outline" className="px-3.5 py-1.5 bg-amber-500/10 text-amber-300 border-amber-500/25 font-bold tracking-wide shadow-sm cursor-pointer hover:bg-amber-500/20 transition-colors">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-400" fill="currentColor" />
              {credits} Credits
            </Badge>
          </div>
        </header>

        {/* Content with fade-in animation */}
        <div className="flex-1 space-y-4 p-8 pt-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
