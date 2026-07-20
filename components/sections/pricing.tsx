"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Shield, Package, Zap, Star, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const features = [
    "Unlimited website scraping",
    "Multiple template designs",
    "Email outreach tools",
    "FTP deployment",
    "Offline usage",
    "Free updates for life",
  ];

  return (
    <section id="pricing" ref={sectionRef} className="py-20 md:py-28 overflow-hidden relative section-divider-top">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Lifetime Deal</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-white/40">
              No subscriptions, no hidden fees. Just a one-time purchase.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 bg-amber-500/[0.08] border border-amber-500/20 text-amber-400 text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Early Bird Special — Limited Spots Only!
            </motion.div>
          </motion.div>
        </div>

        {/* Two-column layout: Product screenshot + Pricing card */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left: Real product screenshot — Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 60 }}
            className="relative"
          >
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.06] rounded-2xl blur-2xl -z-10" />

            {/* Browser chrome mockup — Enhanced */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
              {/* Fake browser bar */}
              <div className="bg-[#12162a] px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-3 bg-white/[0.04] rounded-lg px-3 py-1 text-[11px] text-white/25 font-mono">
                  app.webkarigar.com/dashboard
                </div>
              </div>
              {/* Product screenshot */}
              <div className="relative aspect-[16/10]">
                <Image
                  src="/thumbnail.png"
                  alt="WebKarigar Dashboard — Real Product Screenshot"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07090e]/80 to-transparent" />
              </div>
            </div>

            {/* Floating stat badges — Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-[#12162a]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl shadow-black/40 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                <Zap className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-400">100% Delivery</p>
                <p className="text-[10px] text-white/30">Emails hit inbox</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-[#12162a]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl shadow-black/40 flex items-center gap-2"
            >
              <div className="flex -space-x-1 mr-1">
                {["bg-blue-400", "bg-purple-400", "bg-green-400", "bg-amber-400"].map((c, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-2 border-[#12162a] ${c}`} />
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">50+ devs</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Pricing card — Enhanced with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 60 }}
          >
            <div className="relative overflow-hidden border border-amber-500/20 rounded-2xl bg-[#0c1018]/80 backdrop-blur-xl shadow-2xl shadow-amber-500/[0.05]">
              {/* Animated glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/[0.06] to-violet-500/[0.04] rounded-2xl blur-xl -z-10" />
              
              {/* Corner tag — Enhanced */}
              <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-1 text-sm font-bold shadow-lg shadow-amber-500/30">
                Early Bird
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Lifetime Deal</h3>
                    <p className="text-xs text-white/30">Full access, forever</p>
                  </div>
                </div>

                {/* Price — Enhanced */}
                <div className="flex flex-col mb-2">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-6xl font-black text-amber-400 leading-none">₹1</span>
                    <span className="text-white/30 text-sm mb-2">/ one-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/30">
                    <span className="line-through">₹199</span>
                    <span className="text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">99.5% OFF</span>
                  </div>
                </div>
                <p className="text-xs text-white/30 mb-6 pb-6 border-b border-white/[0.05]">
                  Early bird price — get lifetime access for just ₹1 today
                </p>

                {/* Features — Enhanced */}
                <div className="space-y-3 mb-8">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-violet-400" />
                      </div>
                      <span className="text-sm text-white/60">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] h-12 rounded-xl shimmer-btn cursor-pointer transition-all duration-300"
                  size="lg"
                  asChild
                >
                  <Link href="/dashboard">
                    <Rocket className="h-4 w-4 mr-2" />
                    Claim Early Bird — ₹1 Only
                  </Link>
                </Button>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/30">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    <span>30-day guarantee</span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div>100+ downloads</div>
                  <div className="w-px h-3 bg-white/10" />
                  <div>No card needed</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
