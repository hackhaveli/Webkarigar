import React from 'react';

export function TemplateHeroGraphic({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="160" rx="16" fill="url(#tpl-grad)" stroke="rgba(255,255,255,0.08)" />
      
      {/* Desktop Screen Mockup */}
      <g transform="translate(40, 20)">
        <rect width="240" height="120" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
        <rect x="0" y="0" width="240" height="18" fill="#1e1b4b" rx="8" />
        <circle cx="12" cy="9" r="3" fill="#f43f5e" />
        <circle cx="20" cy="9" r="3" fill="#eab308" />
        <circle cx="28" cy="9" r="3" fill="#22c55e" />
        <rect x="50" y="5" width="140" height="8" rx="4" fill="#312e81" />
        
        {/* Web Content Wireframe */}
        <rect x="12" y="26" width="216" height="40" rx="4" fill="#1e293b" />
        <rect x="20" y="32" width="80" height="8" rx="2" fill="#a855f7" />
        <rect x="20" y="44" width="120" height="6" rx="2" fill="#64748b" />
        <rect x="20" y="54" width="40" height="8" rx="3" fill="#ec4899" />
        
        <rect x="12" y="72" width="65" height="40" rx="4" fill="#1e293b" />
        <rect x="87" y="72" width="65" height="40" rx="4" fill="#1e293b" />
        <rect x="162" y="72" width="65" height="40" rx="4" fill="#1e293b" />
      </g>

      {/* Floating Mobile Phone Mockup */}
      <g transform="translate(320, 15)">
        <rect width="70" height="130" rx="12" fill="#090d16" stroke="#06b6d4" strokeWidth="2" />
        <rect x="20" y="4" width="30" height="4" rx="2" fill="#1e293b" />
        <rect x="6" y="14" width="58" height="102" rx="4" fill="#0f172a" />
        <rect x="10" y="20" width="50" height="24" rx="3" fill="#083344" />
        <rect x="14" y="24" width="30" height="4" fill="#38bdf8" />
        <rect x="10" y="48" width="50" height="16" rx="3" fill="#1e293b" />
        <rect x="10" y="68" width="50" height="16" rx="3" fill="#1e293b" />
        <rect x="10" y="88" width="50" height="16" rx="3" fill="#1e293b" />
      </g>

      {/* Sparkles */}
      <circle cx="430" cy="40" r="4" fill="#ec4899" className="animate-pulse" />
      <circle cx="450" cy="110" r="3" fill="#38bdf8" />
      <circle cx="20" cy="130" r="4" fill="#fbbf24" />

      <defs>
        <linearGradient id="tpl-grad" x1="0" y1="0" x2="500" y2="160">
          <stop stopColor="#1e1b4b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#07090e" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LeadFinderGraphic({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="160" rx="16" fill="url(#lead-grad)" stroke="rgba(255,255,255,0.08)" />

      {/* Radar Target Graphic */}
      <g transform="translate(100, 80)">
        <circle cx="0" cy="0" r="60" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <circle cx="0" cy="0" r="40" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
        <circle cx="0" cy="0" r="20" stroke="#8b5cf6" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#06b6d4" />
        
        <line x1="-65" y1="0" x2="65" y2="0" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="-65" x2="0" y2="65" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

        {/* Target Pins */}
        <circle cx="25" cy="-20" r="4" fill="#22c55e" />
        <circle cx="-30" cy="15" r="4" fill="#f43f5e" />
        <circle cx="15" cy="30" r="4" fill="#eab308" />
      </g>

      {/* AI Classifier Flow */}
      <g transform="translate(250, 30)">
        <rect width="210" height="100" rx="12" fill="#090d16" stroke="#a855f7" strokeWidth="1.5" />
        <text x="15" y="25" fill="#e9d5ff" fontSize="12" fontWeight="700">Meta Ads Scraper + AI</text>
        <rect x="15" y="38" width="180" height="14" rx="4" fill="#1e1b4b" />
        <rect x="20" y="43" width="120" height="4" fill="#a855f7" />
        <rect x="15" y="58" width="180" height="14" rx="4" fill="#062e3b" />
        <rect x="20" y="63" width="90" height="4" fill="#22d3ee" />
        <rect x="15" y="78" width="180" height="14" rx="4" fill="#052e16" />
        <rect x="20" y="83" width="150" height="4" fill="#4ade80" />
      </g>

      <defs>
        <linearGradient id="lead-grad" x1="0" y1="0" x2="500" y2="160">
          <stop stopColor="#082f49" stopOpacity="0.8" />
          <stop offset="1" stopColor="#07090e" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SmtpHealthGraphic({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="160" rx="16" fill="url(#smtp-grad)" stroke="rgba(255,255,255,0.08)" />

      {/* Server Rack Illustration */}
      <g transform="translate(50, 25)">
        <rect width="180" height="110" rx="10" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
        {/* Rack Slot 1 */}
        <rect x="10" y="15" width="160" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <circle cx="25" cy="27" r="4" fill="#10b981" />
        <circle cx="37" cy="27" r="3" fill="#10b981" />
        <rect x="110" y="23" width="50" height="8" rx="2" fill="#312e81" />

        {/* Rack Slot 2 */}
        <rect x="10" y="45" width="160" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <circle cx="25" cy="57" r="4" fill="#10b981" />
        <circle cx="37" cy="57" r="3" fill="#10b981" />
        <rect x="110" y="53" width="50" height="8" rx="2" fill="#312e81" />

        {/* Rack Slot 3 */}
        <rect x="10" y="75" width="160" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <circle cx="25" cy="87" r="4" fill="#10b981" />
        <circle cx="37" cy="87" r="3" fill="#10b981" />
        <rect x="110" y="83" width="50" height="8" rx="2" fill="#312e81" />
      </g>

      {/* SSL Shield Guard */}
      <g transform="translate(300, 30)">
        <path d="M50 10L90 25V60C90 85 50 100 50 100C50 100 10 85 10 60V25L50 10Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
        <path d="M35 50L45 60L65 40" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50" y="118" fill="#a5b4fc" fontSize="11" fontWeight="700" textAnchor="middle">SSL & DKIM Verified</text>
      </g>

      <defs>
        <linearGradient id="smtp-grad" x1="0" y1="0" x2="500" y2="160">
          <stop stopColor="#1e1b4b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#07090e" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
  );
}
