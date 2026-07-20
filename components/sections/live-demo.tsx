"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstallMessage, setShowInstallMessage] = useState(false);
  const [showPreviewMessage, setShowPreviewMessage] = useState(false);
  const [installStep, setInstallStep] = useState(0);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleInstall = () => {
    setShowInstallMessage(true);
    setInstallStep(prev => (prev + 1) % 3);

    setTimeout(() => {
      setShowInstallMessage(false);
    }, 3000);
  };

  const handleTestUI = () => {
    setShowPreviewMessage(true);

    setTimeout(() => {
      setShowPreviewMessage(false);
    }, 3000);
  };

  return (
    <section id="demo" ref={sectionRef} className="py-16 md:py-20 lg:py-28 relative section-divider-top">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <Play className="h-3 w-3 text-violet-400 fill-violet-400" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Live Demo</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
              See the Tool in{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Action</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto px-3 sm:px-0">
              Watch how easily our tool extracts data from websites and
              transforms it into beautiful, customized templates in minutes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40 mx-3 sm:mx-4 md:mx-auto"
        >
          {/* Animated glow behind the container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-60 -z-10 animate-gradient-shift" />

          <div className="aspect-video relative overflow-hidden bg-black">
            {/* Video background */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              src="/product_demo.mp4"
              poster="/thumbnail.png"
              muted
              playsInline
            ></video>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10"></div>

            {/* Interactive Demo Preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-6">
                {/* Play button with pulse ring */}
                <div className="relative">
                  <div
                    className="h-14 w-14 sm:h-18 sm:w-18 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 relative z-10"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-7 w-7 text-white" />
                    ) : (
                      <Play className="h-7 w-7 text-white ml-0.5" />
                    )}
                  </div>
                  {/* Pulse rings */}
                  {!isPlaying && (
                    <>
                      <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-2 rounded-full border border-blue-400/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                    </>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white/90">Interactive Demo Preview</h3>
              </div>
              <p className="absolute bottom-4 sm:bottom-6 text-white/70 bg-black/60 backdrop-blur-sm rounded-full py-1.5 text-xs sm:text-sm text-center px-4 border border-white/[0.06]">
                {isPlaying ? "Click to pause" : "Click to see our full product walkthrough"}
              </p>
            </div>
          </div>

          {/* Interactive UI preview simulation — Enhanced */}
          <div className="bg-[#0a0e18]/95 p-6 border-t border-white/[0.06]">
            {/* Project Card — Enhanced */}
            <div className="mb-8 bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 flex items-center border border-white/[0.05] hover:border-white/[0.08] transition-colors duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                <span className="text-white font-semibold">W</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-semibold">Wallidgardens</h4>
                <p className="text-white/30 text-xs">wallidgardens</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href="/Wallofgardens.rar"
                  download
                  className="bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80 text-xs py-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  Install
                  {showInstallMessage && (
                    <span className="absolute -top-10 left-0 right-0 bg-green-600 text-white text-xs py-1 px-2 rounded">
                      {installStep === 0 && "Template installed successfully!"}
                      {installStep === 1 && "Generating files..."}
                      {installStep === 2 && "Setup complete!"}
                    </span>
                  )}
                </a>
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] text-xs rounded-lg cursor-pointer"
                  >
                    <span className="inline-block w-4 h-4">⋯</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-[#12162a] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 z-20 hidden group-hover:block overflow-hidden">
                    <a
                      href="/wallofgardens/modern/index.html"
                      download
                      className="block px-4 py-2.5 text-xs text-white/50 hover:bg-white/[0.05] hover:text-white/70 transition-colors cursor-pointer"
                    >
                      Download Modern Template
                    </a>
                    <a
                      href="/wallofgardens/elegant/index.html"
                      download
                      className="block px-4 py-2.5 text-xs text-white/50 hover:bg-white/[0.05] hover:text-white/70 transition-colors cursor-pointer"
                    >
                      Download Elegant Template
                    </a>
                    <a
                      href="/wallofgardens/minimalist/index.html"
                      download
                      className="block px-4 py-2.5 text-xs text-white/50 hover:bg-white/[0.05] hover:text-white/70 transition-colors cursor-pointer"
                    >
                      Download Minimalist Template
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Links — Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: "Modern Template", href: "/wallofgardens/modern/index.html" },
                { label: "Elegant Template", href: "/wallofgardens/elegant/index.html" },
                { label: "Minimalist Template", href: "/wallofgardens/minimalist/index.html" },
              ].map((template) => (
                <a
                  key={template.label}
                  href={template.href}
                  className="h-12 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] rounded-xl flex items-center justify-center text-white/70 hover:text-white/90 transition-all duration-300 cursor-pointer group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xs sm:text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">{template.label}</span>
                </a>
              ))}
            </div>

            <div className="flex justify-center relative mb-6">
              <Button
                className="bg-white/[0.05] text-white/70 hover:bg-white/[0.08] hover:text-white/90 border border-white/[0.08] rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                onClick={handleTestUI}
              >
                Test UI Preview
                {showPreviewMessage && (
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-[#12162a] text-white text-xs py-3 px-4 rounded-xl shadow-2xl shadow-black/60 w-60 border border-white/[0.08]">
                    <div className="relative">
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#12162a] rotate-45 border-b border-r border-white/[0.08]"></div>
                      <p className="mb-1 font-semibold text-white/90">Preview Generated!</p>
                      <p className="text-white/40 text-xs">Your template is now ready for viewing</p>
                    </div>
                  </div>
                )}
              </Button>
            </div>

            {/* Feature Highlights Section — Enhanced with gradient accent */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 sm:px-4">
              {[
                { value: "100+", label: "Template Styles", color: "text-blue-400", glow: "rgba(59,130,246,0.1)" },
                { value: "90%", label: "Time Saved", color: "text-emerald-400", glow: "rgba(16,185,129,0.1)" },
                { value: "50K+", label: "Data Points Extracted", color: "text-violet-400", glow: "rgba(139,92,246,0.1)" },
                { value: "15+", label: "Export Formats", color: "text-amber-400", glow: "rgba(245,158,11,0.1)" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                  className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl text-center hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 cursor-default"
                  style={{ boxShadow: `0 0 20px -5px ${stat.glow}` }}
                >
                  <div className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/35">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}