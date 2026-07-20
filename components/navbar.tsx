"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, User, Sparkles, Mail, List } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn, smoothScrollTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-[60px] pt-3">
      <div
        className={cn(
          "w-full max-w-[1240px] mx-auto transition-all duration-500 rounded-2xl px-5 py-2.5 flex items-center justify-between border",
          scrolled
            ? "bg-[#080b14]/90 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]"
            : "bg-[#080b14]/70 backdrop-blur-lg border-white/[0.08]"
        )}
      >
        {/* Logo — Image only */}
        <Link href="/" className="flex items-center group cursor-pointer">
          <Image
            src="/webkarigar-white.png"
            alt="WebKarigar Logo"
            width={140}
            height={36}
            style={{ height: '32px', width: 'auto' }}
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]">
          <NavLinks />
        </nav>

        {/* Action Buttons & User Profile State */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              {/* Dashboard Direct Button */}
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs h-9 px-4 shadow-[0_0_20px_rgba(139,92,246,0.3)] cursor-pointer transition-all duration-300"
              >
                <Link href="/dashboard" className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>

              {/* User Dropdown Avatar Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-white/10 transition-all duration-200 cursor-pointer outline-none">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-xs font-black text-white shadow-inner">
                      {userInitial}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 max-w-[110px] truncate hidden xl:inline-block">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0d1222] border-white/10 text-white shadow-2xl rounded-2xl p-1.5">
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold text-white truncate">{session.user?.name || 'Account'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/10 text-xs py-2">
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2 text-violet-400" /> Dashboard Overview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/10 text-xs py-2">
                    <Link href="/dashboard/campaigns">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" /> Campaigns
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/10 text-xs py-2">
                    <Link href="/dashboard/lead-generation">
                      <List className="w-4 h-4 mr-2 text-cyan-400" /> AI Lead Finder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-xl cursor-pointer hover:bg-rose-500/15 text-rose-400 focus:bg-rose-500/20 text-xs py-2 font-bold"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer h-9 px-4"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs h-9 px-5 shadow-[0_0_25px_rgba(139,92,246,0.3)] cursor-pointer transition-all duration-300"
              >
                <Link href="/signup">Start Free</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full cursor-pointer h-9 w-9"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[1240px] mx-auto mt-2 bg-[#0a0d18]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl md:hidden"
          >
            <div className="flex flex-col space-y-3">
              <NavLinks mobile onClose={() => setIsOpen(false)} />

              <div className="pt-3 border-t border-white/10 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2.5 px-2 py-1 mb-2">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-xs">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{session?.user?.name || 'User'}</p>
                        <p className="text-[11px] text-slate-400 truncate">{session?.user?.email}</p>
                      </div>
                    </div>
                    <Button asChild className="w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs cursor-pointer h-10">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full gap-2 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer font-bold text-xs h-10"
                      onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button asChild variant="outline" className="w-full rounded-xl border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer text-xs font-bold h-10">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button asChild className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0 cursor-pointer text-xs font-bold h-10">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Start Free
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLinks({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const links = [
    { href: "#features", id: "features", label: "Features" },
    { href: "#how-it-works", id: "how-it-works", label: "How It Works" },
    { href: "/templates", id: "", label: "Templates" },
    { href: "/blog", id: "", label: "Blog" },
    { href: "/tools", id: "", label: "Tools" },
    { href: "#faq", id: "faq", label: "FAQ" },
  ];

  return (
    <>
      {links.map((link) => {
        if (link.href.startsWith('/')) {
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer",
                mobile && "px-3 py-2.5 text-sm block font-medium rounded-xl hover:bg-white/5 text-slate-200"
              )}
              onClick={() => { if (onClose) onClose(); }}
            >
              {link.label}
            </Link>
          );
        }
        return (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer",
              mobile && "px-3 py-2.5 text-sm block font-medium rounded-xl hover:bg-white/5 text-slate-200"
            )}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(link.id);
              if (onClose) onClose();
            }}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
}