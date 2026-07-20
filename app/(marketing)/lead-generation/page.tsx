'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Brain, MessageSquare, Zap, Target, Globe, Shield, ChevronRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function LeadGenerationPage() {
  return (
    <main className="min-h-screen bg-[#0c0f1a]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-[77px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1226px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Lead Generation
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Find & Close{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  High-Quality Leads
                </span>{' '}
                on Autopilot
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                Scrape Meta (Facebook) Ads Library to discover local businesses running ads without a website. 
                Our AI classifies them and generates personalized outreach messages automatically.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard/lead-generation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 transition-all"
                >
                  View Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Search className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Step 1: Scrape</div>
                      <div className="text-gray-500 text-xs">Meta Ads Library Scan</div>
                    </div>
                    <div className="text-emerald-400 text-xs font-medium">200+ ads found</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Step 2: Classify</div>
                      <div className="text-gray-500 text-xs">Gemini AI Classification</div>
                    </div>
                    <div className="text-amber-400 text-xs font-medium">42 qualified</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Step 3: Enrich</div>
                      <div className="text-gray-500 text-xs">WhatsApp Draft + Demo Links</div>
                    </div>
                    <div className="text-blue-400 text-xs font-medium">Ready to send</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-[77px] border-t border-white/5">
        <div className="max-w-[1226px] mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A three-step pipeline that turns Facebook ads into qualified leads ready for outreach.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Scrape Meta Ads',
                color: 'from-emerald-500 to-teal-500',
                description: 'Query Meta Ads Archive with niche-specific keywords. Our engine fetches active ads, filters spam, and deduplicates results automatically.',
                features: ['Meta Graph API v20.0', 'Smart spam filtering', 'Hash-based dedup', 'Configurable by niche'],
              },
              {
                step: '02',
                icon: Brain,
                title: 'AI Classification',
                color: 'from-amber-500 to-orange-500',
                description: 'Gemini 2.5 Flash AI evaluates each ad to identify local businesses without websites. Extracts phone numbers and assigns confidence scores.',
                features: ['Gemini 2.5 Flash AI', 'Confidence scoring', 'Phone extraction', 'Website detection'],
              },
              {
                step: '03',
                icon: MessageSquare,
                title: 'Enrich & Outreach',
                color: 'from-blue-500 to-cyan-500',
                description: 'Generate personalized message drafts, demo website links, and cleaned WhatsApp numbers. Ready for one-click outreach.',
                features: ['WhatsApp message drafts', 'Demo link generation', 'Phone number cleaning', 'Bulk enrichment'],
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-6 text-white font-bold text-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-[77px] border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-[1226px] mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Supported Niches
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              12+ business niches with pre-configured search keywords and message templates.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Gym / Fitness', icon: '🏋️', count: '2.3K' },
              { name: 'Salon / Beauty', icon: '💅', count: '1.8K' },
              { name: 'Coaching', icon: '🎯', count: '1.5K' },
              { name: 'Dentist', icon: '🦷', count: '1.2K' },
              { name: 'Chiropractor', icon: '💆', count: '890' },
              { name: 'Restaurant', icon: '🍽️', count: '3.1K' },
              { name: 'Real Estate', icon: '🏠', count: '2.7K' },
              { name: 'Plumbing', icon: '🔧', count: '950' },
              { name: 'Electrician', icon: '⚡', count: '870' },
              { name: 'Cleaning', icon: '🧹', count: '1.1K' },
              { name: 'Bakery', icon: '🥐', count: '720' },
              { name: 'Photography', icon: '📸', count: '640' },
              { name: 'Lawyer', icon: '⚖️', count: '1.4K' },
              { name: 'E-Commerce', icon: '🛒', count: '4.2K' },
            ].map((niche, i) => (
              <motion.div
                key={niche.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-white/5 rounded-xl p-4 text-center hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
              >
                <div className="text-2xl mb-2">{niche.icon}</div>
                <div className="text-white text-sm font-semibold">{niche.name}</div>
                <div className="text-gray-600 text-xs mt-1">{niche.count} leads</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-[77px] border-t border-white/5">
        <div className="max-w-[1226px] mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From discovery to outreach — all in one dashboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: '1-Click Pipeline', desc: 'Run the full scrape-classify-enrich pipeline with a single click. No manual work needed.' },
              { icon: Target, title: 'Niche Targeting', desc: 'Target specific business niches with custom search keywords and message templates.' },
              { icon: Shield, title: 'Spam Protection', desc: 'Built-in spam filter removes drama apps, romance stories, and irrelevant ads automatically.' },
              { icon: MessageSquare, title: 'WhatsApp Ready', desc: 'Generate clean phone numbers and personalized WhatsApp message drafts for each lead.' },
              { icon: Search, title: 'Live Preview', desc: 'Preview each lead\'s data including business name, phone, ad copy, and demo links.' },
              { icon: Zap, title: 'Bulk Operations', desc: 'Select all matching leads, bulk delete, CSV export, and mass status updates.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-[77px] border-t border-white/5">
        <div className="max-w-[1226px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 via-purple-800/10 to-pink-600/20 border border-purple-500/20 p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start Generating Leads Today
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8">
                No credit card required. Just connect your Meta access token and start discovering high-quality leads for your web design business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-[77px] border-t border-white/5">
        <div className="max-w-[1226px] mx-auto text-center text-sm text-gray-600">
          WebKarigar — AI-Powered Lead Generation for Web Design Agencies
        </div>
      </footer>
    </main>
  );
}
