import { Sidebar } from '@/components/dashboard/Sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export default async function TemplateGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let credits = 0;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) credits = user.credits;
  }

  return (
    <div className="h-full relative flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>

      <main className="md:pl-72 flex-1 w-full flex flex-col bg-muted/20">
        <header className="h-16 px-6 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 justify-between">
          <div className="flex md:hidden">
            <span className="font-bold text-lg">WebKarigar</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Badge variant="outline" className="px-3 py-1 bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium tracking-wide">
              <Zap className="h-3.5 w-3.5 mr-1" fill="currentColor" />
              {credits} Credits
            </Badge>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
