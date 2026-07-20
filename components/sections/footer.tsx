import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 bg-[#04060b] border-t border-white/10">
      <div className="absolute inset-0 dot-grid-bg opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/webkarigar-white.png"
                alt="WebKarigar Logo"
                width={140}
                height={36}
                style={{ height: '32px', width: 'auto' }}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Stop pitching. Start showing. WebKarigar helps freelancers and agencies close local business prospects with automated personalized website previews.
            </p>
            <div className="flex space-x-2 pt-2">
              <Button asChild variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
                <a href="https://twitter.com/webkarigar" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
                <a href="https://github.com/hackhaveli/Webkarigar" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
                <a href="/feed.xml" target="_blank" aria-label="RSS Feed">
                  <Rss className="h-4 w-4 text-amber-400" />
                </a>
              </Button>
            </div>
          </div>

          {/* Col 3: Interactive SEO */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Interactive Engine</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/demo" className="text-slate-400 hover:text-white transition-colors">Live Demo Builder</Link></li>
              <li><Link href="/demo/gym" className="text-slate-400 hover:text-white transition-colors">Gym Site Demo</Link></li>
              <li><Link href="/demo/salon" className="text-slate-400 hover:text-white transition-colors">Salon Site Demo</Link></li>
              <li><Link href="/demo/real-estate" className="text-slate-400 hover:text-white transition-colors">Real Estate Demo</Link></li>
              <li><Link href="/templates" className="text-slate-400 hover:text-white transition-colors">Template Gallery</Link></li>
            </ul>
          </div>

          {/* Col 4: Free Tools & Features */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Free Agency Tools</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools" className="text-slate-400 hover:text-white transition-colors">Tools Hub</Link></li>
              <li><Link href="/tools/cold-email-subject-generator" className="text-slate-400 hover:text-white transition-colors">Subject Generator</Link></li>
              <li><Link href="/tools/business-slug-generator" className="text-slate-400 hover:text-white transition-colors">Slug Generator</Link></li>
              <li><Link href="/tools/cta-generator" className="text-slate-400 hover:text-white transition-colors">Outreach CTA Builder</Link></li>
              <li><Link href="/vs/instantly" className="text-slate-400 hover:text-white transition-colors">vs Instantly.ai</Link></li>
            </ul>
          </div>

          {/* Col 5: Authority & Transparency */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Documentation & Transparency</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs/multi-smtp-rotation" className="text-slate-400 hover:text-white transition-colors">SMTP Setup Guide</Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="/roadmap" className="text-slate-400 hover:text-white transition-colors">Product Roadmap</Link></li>
              <li><Link href="/guides/how-to-get-web-design-clients" className="text-slate-400 hover:text-white transition-colors">Client Playbook</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} WebKarigar. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/docs" className="hover:text-slate-300">Docs</Link>
            <Link href="/changelog" className="hover:text-slate-300">Changelog</Link>
            <Link href="/roadmap" className="hover:text-slate-300">Roadmap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}