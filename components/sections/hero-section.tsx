"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { smoothScrollTo } from "@/lib/utils";

function FloatingParticle({ className, delay = 0, duration = 6 }: { className?: string; delay?: number; duration?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        y: [0, -20, -5, -25, 0],
        x: [0, 5, -5, 3, 0],
        opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="w-full bg-[#07090e] overflow-visible relative">
      {/* Animated dot grid background */}
      <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

      {/* Floating particles */}
      <FloatingParticle className="w-1.5 h-1.5 bg-violet-500/30 top-[20%] left-[15%]" delay={0} duration={7} />
      <FloatingParticle className="w-1 h-1 bg-blue-400/25 top-[40%] left-[8%]" delay={1.5} duration={8} />
      <FloatingParticle className="w-2 h-2 bg-indigo-400/20 top-[60%] left-[25%]" delay={0.5} duration={6} />
      <FloatingParticle className="w-1 h-1 bg-pink-400/25 top-[30%] right-[20%]" delay={2} duration={9} />
      <FloatingParticle className="w-1.5 h-1.5 bg-cyan-400/20 top-[70%] right-[30%]" delay={1} duration={7} />

      {/* Hero Section Container */}
      <section className="hero relative w-full flex items-center justify-center pt-20 pb-4 md:pt-24 md:pb-6 lg:pt-[90px] lg:pb-8 overflow-visible">

        {/* Ambient background glows - Enhanced with more depth */}
        <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none select-none">
          {/* Subtle Vignette layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#07090e_100%)] opacity-80" />

          {/* Ambient Left Soft Blue Glow - bigger & softer */}
          <div className="absolute top-[-8%] left-[-8%] w-[50%] h-[50%] bg-[#3B82F6]/[0.06] rounded-full blur-[120px] opacity-80" />

          {/* Ambient Right Soft Purple Glow behind the illustration - richer */}
          <div className="absolute top-[5%] right-[5%] w-[60%] h-[60%] bg-[#8B5CF6]/[0.1] rounded-full blur-[140px] opacity-80" />

          {/* Additional center glow for depth */}
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-[#6366F1]/[0.04] rounded-full blur-[100px]" />
        </div>

        {/* Core Width Container */}
        <div className="w-full max-w-[1365px] mx-auto px-8 min-h-[466px] md:min-h-[520px] lg:min-h-[466px] flex items-center justify-center overflow-visible">
          <div className="w-full grid grid-cols-1 md:grid-cols-[45%_55%] gap-6 items-center overflow-visible">

            {/* Left Column: text, badge, buttons, helper text */}
            <div className="hero-left flex flex-col items-start justify-center text-left z-10 w-full overflow-visible">

              {/* Value Pill Tag — Enhanced with gradient border and icon */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#13121c] text-[#7c7c85] text-[13px] px-5 py-2.5 rounded-full mb-6 font-medium tracking-wide border border-white/[0.06] shadow-[0_0_20px_rgba(99,102,241,0.08)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-400/70" />
                Show value before you pitch.
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[69px] font-semibold tracking-tight text-[#EFEFF0] mb-1 leading-[1.08] w-full"
              >
                Stop pitching.
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-[75px] font-semibold tracking-tight mb-5 leading-[1.08] w-full"
              >
                <span className="text-[#EAEAEB]">Start </span>
                <span className="bg-gradient-to-r from-[#8B7DC8] via-[#7C6BB5] to-[#6B5CA3] bg-clip-text text-transparent">showing.</span>
              </motion.h1>

              {/* Description - slightly brighter text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#6e6e75] text-[15px] leading-[24px] mb-7 max-w-[472px] w-full font-normal"
              >
                WebKarigar empowers freelancers and agencies to close clients by instantly generating personalized websites for businesses before reaching out. Show value first, then pitch.
              </motion.p>

              {/* CTAs — Enhanced with better glow & shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                {isLoggedIn ? (
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-white/90 font-medium px-10 h-[49px] text-base shadow-[0_0_30px_rgba(99,102,241,0.4),0_0_60px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5),0_0_80px_rgba(139,92,246,0.2)] hover:opacity-95 transition-all duration-300 hover:scale-[1.02] shimmer-btn cursor-pointer"
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="rounded-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-white/90 font-medium px-10 h-[49px] text-base shadow-[0_0_30px_rgba(99,102,241,0.4),0_0_60px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5),0_0_80px_rgba(139,92,246,0.2)] hover:opacity-95 transition-all duration-300 hover:scale-[1.02] shimmer-btn cursor-pointer"
                    >
                      <Link href="/signup">
                        Start Free
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => smoothScrollTo('demo')}
                      className="rounded-full border border-[#2A2932] bg-[#1E1D28]/80 backdrop-blur-sm text-[#A7A7AB] hover:bg-[#252433] hover:border-[#45444f] px-8 h-[49px] text-base font-normal flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-[#A7A7AB] text-[#A7A7AB]" />
                      Watch Demo
                    </Button>
                  </>
                )}
              </motion.div>

              {/* Subtext with decorative pointer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative mt-5 flex items-center gap-2"
              >
                {/* Hand-drawn style arrow */}
                <svg className="w-5 h-5 text-[#46454B] transform -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-[15px] font-normal text-[#46454B]">Try free.</span>
                <span className="text-[13px] font-normal text-[#46454B]">No card required!</span>
              </motion.div>
            </div>

            {/* Right Column: Illustration */}
            <div className="hero-right w-full h-full flex items-center justify-center overflow-visible z-10 relative">
              {/* Layered radial glows directly behind the illustration - Enhanced */}
              <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                <div className="w-[90%] h-[90%] bg-purple-900/[0.18] blur-[100px] rounded-full" />
                <div className="w-[65%] h-[65%] bg-[#3B82F6]/[0.1] blur-[80px] rounded-full absolute" />
                <div className="w-[40%] h-[40%] bg-[#6366F1]/[0.06] blur-[60px] rounded-full absolute" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-[115%] sm:w-[110%] md:w-[115%] lg:w-[120%] aspect-[16/9] relative flex-shrink-0 select-none overflow-visible filter drop-shadow-[0_8px_32px_rgba(139,92,246,0.18)] -left-[5%] sm:-left-[2%] md:-left-[5%] lg:-left-[8%] -top-4 md:-top-6 lg:-top-8"
              >
                <Image
                  src="/vector2.png"
                  alt="WebKarigar Platform Illustration"
                  fill
                  className="object-contain object-right pointer-events-none select-none"
                  priority
                  sizes="(max-width: 768px) 150vw, 100vw"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Logo Cloud Section — Enhanced with marquee animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full bg-[#07090e] pb-12 overflow-hidden"
      >
        <div className="max-w-[1225px] mx-auto px-8">
          <div className="bg-[#111020] border border-white/[0.05] rounded-xl py-4 px-6 sm:px-12 overflow-hidden relative">
            {/* Subtle gradient overlay on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#111020] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#111020] to-transparent z-10 pointer-events-none" />

            {/* Marquee scroll container */}
            <div className="flex items-center gap-12 sm:gap-16 animate-[marquee_25s_linear_infinite] w-max">
              {/* First set */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-12 sm:gap-16 shrink-0">
                  {/* Google */}
                  <div className="flex items-center gap-2 opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <svg className="h-5 w-auto fill-[#5a5a60]" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.376 0-6.108-2.732-6.108-6.109s2.732-6.108 6.108-6.108c1.584 0 3.024.612 4.116 1.704l3.024-3.024C19.296 2.688 15.96 1.2 12.24 1.2 6.132 1.2 1.2 6.132 1.2 12.24s4.932 11.04 11.04 11.04c6.384 0 11.04-4.488 11.04-11.04 0-.744-.084-1.464-.24-2.16H12.24z" />
                    </svg>
                    <span className="text-[#5a5a60] font-normal text-lg tracking-tight">Google</span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <span className="text-[#535258] font-normal text-lg tracking-tight">∞ Meta</span>
                  </div>

                  {/* Y Combinator */}
                  <div className="flex items-center gap-2 opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <div className="w-5.5 h-5.5 bg-[#6e6e70] border border-[#4a4a4e] flex items-center justify-center font-normal text-[#2e2e32] text-[13px] rounded-sm">Y</div>
                    <span className="text-[#4e4e53] font-normal text-sm tracking-wide">Combinator</span>
                  </div>

                  {/* Stripe */}
                  <div className="flex items-center opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <span className="text-[#5e5e63] font-bold text-[18px] tracking-tight">stripe</span>
                  </div>

                  {/* Vercel */}
                  <div className="flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <svg className="h-4 w-auto fill-[#5a5a60]" viewBox="0 0 24 24">
                      <path d="M12 1L24 22H0L12 1z" />
                    </svg>
                    <span className="text-[#5a5a60] font-normal text-lg tracking-tight">Vercel</span>
                  </div>

                  {/* Notion */}
                  <div className="flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-opacity duration-300">
                    <span className="text-[#535258] font-medium text-lg tracking-tight">Notion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}