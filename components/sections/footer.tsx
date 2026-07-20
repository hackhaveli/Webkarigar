import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 section-divider-top">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-8 pointer-events-none" />
      <div className="absolute top-0 left-[30%] w-[400px] h-[200px] bg-violet-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/webkarigar.png"
                  alt="WebKarigar Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto block dark:hidden"
                />
                <Image
                  src="/webkarigar-white.png"
                  alt="WebKarigar Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto hidden dark:block"
                />
              </Link>
            </div>
            <p className="text-white/30 mb-6 max-w-md text-sm leading-relaxed">
              Professional website solutions for your business. Design, develop, and deploy websites
              with our powerful tools and services.
            </p>
            <div className="flex space-x-2">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "GitHub" },
                { icon: ExternalLink, label: "Gumroad" },
              ].map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] text-white/40 hover:text-white/70 transition-all duration-300 cursor-pointer"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4 text-white/70">Product</h3>
            <ul className="space-y-2.5">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#pricing", label: "Pricing" },
                { href: "#demo", label: "Demo" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/30 hover:text-white/60 transition-colors duration-200 text-sm cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4 text-white/70">Support</h3>
            <ul className="space-y-2.5">
              {[
                { href: "#faq", label: "FAQ" },
                { href: "#", label: "Documentation" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/30 hover:text-white/60 transition-colors duration-200 text-sm cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated gradient separator */}
        <div className="mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/20 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} WebKarigar. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Terms", "Privacy", "Contact"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm text-white/20 hover:text-white/50 transition-colors duration-200 cursor-pointer"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}