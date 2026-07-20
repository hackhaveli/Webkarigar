"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain, Paintbrush, Laptop, Mail, Globe, Rocket, Zap, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Smart Scraping",
    description: "AI-powered data extraction that identifies key business information automatically.",
    gradient: "from-violet-500 to-indigo-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Paintbrush,
    title: "Multiple Template Designs",
    description: "Generate various design options to choose from for each business.",
    gradient: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    glowColor: "rgba(236, 72, 153, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Mail,
    title: "Email Outreach Built-In",
    description: "Automated email templates to contact businesses with your proposals. Multi-SMTP rotation built in.",
    gradient: "from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    icon: Globe,
    title: "FTP Deployment Support",
    description: "Deploy finished websites directly to hosting with built-in FTP tools.",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Zap,
    title: "One-Click Generation",
    description: "Create complete websites with a single click after configuration.",
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Rocket,
    title: "Fast & Lightweight",
    description: "Optimized performance for quick template generation without lag.",
    gradient: "from-violet-500 to-fuchsia-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "All data is processed locally with no external uploads for maximum privacy.",
    gradient: "from-emerald-500 to-cyan-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.12)",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Laptop,
    title: "Works Offline",
    description: "Download and run the tool locally without needing constant internet connection.",
    gradient: "from-slate-400 to-zinc-500",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    glowColor: "rgba(148, 163, 184, 0.08)",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px 0px" });

  return (
    <section id="features" ref={sectionRef} className="py-20 md:py-32 relative section-divider-top">
      {/* Background accents — Enhanced with dot grid */}
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[150px] -z-10" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.02] rounded-full blur-[200px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <Zap className="h-3 w-3 text-cyan-400" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Built for Speed</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
              Powerful{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-shift">Features</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-white/40">
              Everything you need to automate your website creation workflow
            </p>
          </motion.div>
        </div>

        {/* Bento Grid — Enhanced with hover glow effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
              className={feature.span}
            >
              <div
                className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 group transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1] cursor-default relative overflow-hidden"
                style={{
                  boxShadow: `0 4px 20px -8px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px -10px ${feature.glowColor}`,
                  }}
                />

                {/* Top gradient line on hover */}
                <div className="absolute top-0 left-[15%] right-[15%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={cn("w-full h-full bg-gradient-to-r", feature.gradient, "opacity-40")} />
                </div>

                <div className="flex flex-col h-full relative z-10">
                  {/* Icon — Enhanced with hover scale + glow */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                    feature.iconBg
                  )}
                  style={{
                    boxShadow: `0 0 0 rgba(0,0,0,0)`,
                  }}
                  >
                    <feature.icon className={cn("h-6 w-6 transition-all duration-300", feature.iconColor)} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed flex-grow group-hover:text-white/50 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}