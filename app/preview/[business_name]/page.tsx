import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PreviewPage({ params }: { params: Promise<{ business_name: string }> }) {
  const { business_name } = await params;
  const slug = decodeURIComponent(business_name);
  
  // Find lead by business name slug
  // For security we might want an id, but for this demo businessName works
  const lead = await prisma.lead.findFirst({
    where: { businessName: { contains: slug } },
  });

  const businessName = lead?.businessName || slug;
  const niche = lead?.niche || 'Software Solutions';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Demo App Bar */}
      <div className="bg-indigo-600 text-white p-2 text-center text-sm font-medium flex justify-center items-center gap-2">
        <Zap className="h-4 w-4" /> 
        This is a demo website generated specifically for {businessName}.
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold tracking-tight text-indigo-600">{businessName}</div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-indigo-600">Services</a>
          <a href="#features" className="hover:text-indigo-600">Why Us</a>
          <a href="#testimonials" className="hover:text-indigo-600">Testimonials</a>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Get a Quote</Button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block border border-indigo-100 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Premium {niche} Services
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{niche}</span> with {businessName}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We deliver industry-leading solutions tailored to your unique needs. Join hundreds of satisfied clients who trust {businessName}.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8">
              Start Your Journey <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 shadow-sm">
              View Our Work
            </Button>
          </div>
        </section>

        {/* Features / Services */}
        <section id="services" className="bg-white py-24 px-6 border-y">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything you need to succeed</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Premium Service {i}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Industry leading strategies dynamically crafted for the {niche} sector. We ensure top quality results.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 text-white py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to transform your business?</h2>
            <p className="text-xl text-slate-400">Contact {businessName} today and let's build something great together.</p>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 h-14">
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-12 px-6 text-center border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
