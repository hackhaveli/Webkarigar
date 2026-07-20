'use client';

import { MessageSquare, Globe, Zap, Users, TrendingUp } from 'lucide-react';

export function TrustBooster() {
  return (
    <div className="space-y-4">
      {/* WHY THIS WORKS */}
      <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] border border-primary/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Why this works
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Personalized websites increase response</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Clients see their own name &amp; business — it's not a cold pitch.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Visual proof &gt; text pitch</p>
              <p className="text-[11px] text-gray-500 mt-0.5">A live website link converts 3–5× better than a portfolio link.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Clients see value instantly</p>
              <p className="text-[11px] text-gray-500 mt-0.5">No calls needed. They click, they see, they reply.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4">
        <div className="flex -space-x-2 flex-shrink-0">
          {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500'].map((color, i) => (
            <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-[#111827] flex items-center justify-center text-[9px] font-bold text-white`}>
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white">Used by 50+ developers</p>
          <p className="text-[10px] text-gray-500">Helping agencies reach 1,000+ businesses</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-1 justify-end">
            {[1,2,3,4,5].map(s => (
              <span key={s} className="text-amber-400 text-[10px]">★</span>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">4.9 / 5</p>
        </div>
      </div>
    </div>
  );
}
