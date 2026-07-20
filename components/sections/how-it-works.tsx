"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "1",
    title: "Import Leads",
    description: "Import your lead data from CSV files, Google Maps scraper, or manual entry for instant processing.",
    color: "from-blue-500 to-indigo-500",
    glow: "rgba(59, 130, 246, 0.15)",
    accentColor: "rgba(99, 102, 241, 0.5)",
    illustration: (
      <svg className="w-full h-24 text-indigo-400/80" viewBox="0 0 200 100" fill="none">
        <rect x="20" y="30" width="160" height="60" rx="6" fill="#131725" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="20" y1="50" x2="180" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="60" y1="30" x2="60" y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="120" y1="30" x2="120" y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="3" fill="#6366F1" />
        <circle cx="90" cy="40" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="150" cy="40" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="40" cy="60" r="3" fill="#10B981" />
        <circle cx="90" cy="60" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="150" cy="60" r="3" fill="rgba(255,255,255,0.3)" />
        <g filter="url(#glow-import)">
          <circle cx="150" cy="75" r="16" fill="#6366F1" />
          <path d="M150 67v12M145 74l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <filter id="glow-import" x="124" y="49" width="52" height="52" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    ),
  },
  {
    step: "2",
    title: "Generate Website",
    description: "Our AI builds a personalized website for each business instantly with multiple template options.",
    color: "from-indigo-500 to-purple-500",
    glow: "rgba(139, 92, 246, 0.15)",
    accentColor: "rgba(139, 92, 246, 0.5)",
    illustration: (
      <svg className="w-full h-24 text-purple-400/80" viewBox="0 0 200 100" fill="none">
        <rect x="30" y="20" width="140" height="70" rx="8" fill="#131725" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <path d="M30 20h140v14H30z" fill="#181c2e" />
        <circle cx="42" cy="27" r="2" fill="#EF4444" />
        <circle cx="48" cy="27" r="2" fill="#F59E0B" />
        <circle cx="54" cy="27" r="2" fill="#10B981" />
        <rect x="42" y="44" width="48" height="34" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
        <rect x="100" y="44" width="58" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
        <rect x="100" y="58" width="40" height="6" rx="2" fill="rgba(255,255,255,0.1)" />
        <g filter="url(#glow-magic)">
          <path d="M152 28l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#EC4899" />
          <path d="M55 70l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#8B5CF6" />
        </g>
        <defs>
          <filter id="glow-magic" x="38" y="20" width="130" height="70" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    ),
  },
  {
    step: "3",
    title: "Send Outreach",
    description: "Send personalized outreach with the link to your generated website via built-in email tools.",
    color: "from-purple-500 to-pink-500",
    glow: "rgba(236, 72, 153, 0.15)",
    accentColor: "rgba(236, 72, 153, 0.5)",
    illustration: (
      <svg className="w-full h-24 text-pink-400/80" viewBox="0 0 200 100" fill="none">
        <rect x="35" y="25" width="130" height="65" rx="8" fill="#131725" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <path d="M35 25l65 38 65-38" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <g filter="url(#glow-outreach)">
          <path d="M120 35l40-20-10 45-12-18-18-7z" fill="#EC4899" />
          <path d="M120 35l18 20 12-18" fill="#D946EF" opacity="0.8" />
        </g>
        <path d="M60 70q25-10 50-20" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
        <defs>
          <filter id="glow-outreach" x="100" y="5" width="80" height="70" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    ),
  },
  {
    step: "4",
    title: "Close Client",
    description: "Client loves the preview, you close the deal faster with a professional ready-made site.",
    color: "from-pink-500 to-emerald-500",
    glow: "rgba(16, 185, 129, 0.15)",
    accentColor: "rgba(16, 185, 129, 0.5)",
    illustration: (
      <svg className="w-full h-24 text-emerald-400" viewBox="0 0 200 100" fill="none">
        <circle cx="100" cy="50" r="38" stroke="rgba(255,255,255,0.04)" strokeWidth="2" strokeDasharray="4 4" />
        <g filter="url(#glow-close)">
          <circle cx="100" cy="50" r="28" fill="#10B981" />
          <path d="M88 50l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M65 30l3 3m0-3l-3 3M135 30l3 3m0-3l-3 3M100 15v3M100 82v3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <filter id="glow-close" x="62" y="12" width="76" height="76" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-[#07090e] overflow-hidden relative section-divider-top"
    >
      {/* Subtle background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header — Enhanced */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Simple 4-Step Process</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-white/40"
          >
            Four simple steps to automate your website agency outreach and close deals instantly.
          </motion.p>
        </div>

        {/* Steps Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          
          {/* Connecting line helper on desktop — Enhanced gradient */}
          <div className="absolute top-[22%] left-[8%] right-[8%] h-px hidden lg:block -z-10">
            <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-emerald-500/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-emerald-500/10 blur-sm" />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Container — Enhanced with better glass + hover glow */}
              <div
                className={cn(
                  "relative bg-[#0c1018]/70 backdrop-blur-md border border-white/[0.04] hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-500 flex flex-col justify-between h-full min-h-[340px] cursor-pointer",
                  "hover:bg-[#0e1220]/90"
                )}
                style={{
                  boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5), 0 0 30px 0 ${step.glow}`,
                }}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px -10px ${step.accentColor}`,
                  }}
                />

                {/* Upper part of the card */}
                <div className="relative z-10">
                  {/* Step Badge header — Enhanced with glow */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-gradient-to-r text-white flex items-center justify-center font-bold text-sm shadow-lg transition-transform duration-300 group-hover:scale-110",
                      step.color
                    )}>
                      {step.step}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-white/15" />
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <div className="w-1 h-1 rounded-full bg-white/5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text transition-all duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/35 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Illustration at bottom — Enhanced */}
                <div className="mt-8 flex items-center justify-center h-28 w-full bg-black/20 rounded-xl border border-white/[0.03] overflow-hidden group-hover:bg-black/30 group-hover:border-white/[0.06] transition-all duration-500 relative z-10">
                  {step.illustration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}