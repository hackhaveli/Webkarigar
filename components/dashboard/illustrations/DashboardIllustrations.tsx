import React from 'react';

export function PipelineHeroIllustration({ className = "w-full h-48" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" stopOpacity="0.6"/>
          <stop offset="0.5" stopColor="#0f172a" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#020617" stopOpacity="0.95"/>
        </linearGradient>
        <linearGradient id="violet-glow" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8b5cf6"/>
          <stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="cyan-glow" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4"/>
          <stop offset="1" stopColor="#3b82f6"/>
        </linearGradient>
        <linearGradient id="amber-glow" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#10b981"/>
        </linearGradient>
        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Canvas background grid */}
      <rect width="600" height="200" rx="16" fill="url(#bg-grad)" stroke="rgba(255,255,255,0.08)"/>
      <path d="M0 40H600M0 80H600M0 120H600M0 160H600" stroke="white" strokeOpacity="0.03" strokeDasharray="4 4"/>
      <path d="M120 0V200M240 0V200M360 0V200M480 0V200" stroke="white" strokeOpacity="0.03" strokeDasharray="4 4"/>

      {/* Connecting Flow Cable */}
      <path d="M 100 100 C 180 50, 220 150, 300 100 C 380 50, 420 150, 500 100" 
        stroke="url(#violet-glow)" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" opacity="0.8"/>

      {/* Node 1: SMTP Connection */}
      <g transform="translate(80, 70)">
        <circle cx="20" cy="30" r="28" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" filter="url(#glow-filter)"/>
        <rect x="6" y="18" width="28" height="20" rx="4" fill="#312e81" stroke="#818cf8"/>
        <path d="M6 22L20 32L34 22" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="32" cy="18" r="4" fill="#10b981"/>
        <text x="20" y="72" fill="#cbd5e1" fontSize="11" fontWeight="600" textAnchor="middle">1. Connect SMTP</text>
      </g>

      {/* Node 2: Lead Magnet */}
      <g transform="translate(210, 70)">
        <circle cx="20" cy="30" r="28" fill="#032b45" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-filter)"/>
        <path d="M12 22C12 18 16 14 20 14C24 14 28 18 28 22V30H24V22C24 20 22 18 20 18C18 18 16 20 16 22V30H12V22Z" fill="#22d3ee"/>
        <circle cx="20" cy="36" r="3" fill="#38bdf8"/>
        <path d="M8 12L12 16M32 12L28 16" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
        <text x="20" y="72" fill="#cbd5e1" fontSize="11" fontWeight="600" textAnchor="middle">2. Find Leads</text>
      </g>

      {/* Node 3: Live Web Preview */}
      <g transform="translate(340, 70)">
        <circle cx="20" cy="30" r="28" fill="#2e1065" stroke="#a855f7" strokeWidth="2" filter="url(#glow-filter)"/>
        <rect x="8" y="16" width="24" height="24" rx="4" fill="#581c87" stroke="#c084fc"/>
        <line x1="8" y1="23" x2="32" y2="23" stroke="#c084fc"/>
        <circle cx="12" cy="19.5" r="1" fill="#f43f5e"/>
        <circle cx="15" cy="19.5" r="1" fill="#eab308"/>
        <circle cx="18" cy="19.5" r="1" fill="#22c55e"/>
        <rect x="12" y="27" width="16" height="8" rx="2" fill="#e9d5ff"/>
        <text x="20" y="72" fill="#cbd5e1" fontSize="11" fontWeight="600" textAnchor="middle">3. Pick Design</text>
      </g>

      {/* Node 4: Rocket Outreach Launch */}
      <g transform="translate(470, 70)">
        <circle cx="20" cy="30" r="32" fill="#14532d" stroke="#22c55e" strokeWidth="2.5" filter="url(#glow-filter)"/>
        {/* Rocket Icon */}
        <path d="M20 14C24 14 28 18 28 26L20 38L12 26C12 18 16 14 20 14Z" fill="#4ade80"/>
        <path d="M12 28L6 32L10 38L14 36" fill="#15803d"/>
        <path d="M28 28L34 32L30 38L26 36" fill="#15803d"/>
        <circle cx="20" cy="22" r="3" fill="#052e16"/>
        <path d="M17 38C17 38 18.5 44 20 44C21.5 44 23 38 23 38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
        <text x="20" y="76" fill="#4ade80" fontSize="12" fontWeight="700" textAnchor="middle">4. Launch & Get Replies</text>
      </g>
    </svg>
  );
}

export function SmtpBadgeIllustration({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#smtp-bg)"/>
      <path d="M14 18L24 25L34 18" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
      <rect x="12" y="16" width="24" height="16" rx="3" stroke="#6366f1" strokeWidth="2"/>
      <circle cx="34" cy="14" r="4" fill="#10b981"/>
      <defs>
        <linearGradient id="smtp-bg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#312e81"/>
          <stop offset="1" stopColor="#1e1b4b"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LeadMagnetIllustration({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#lead-bg)"/>
      <circle cx="24" cy="24" r="12" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 3"/>
      <circle cx="24" cy="24" r="5" fill="#06b6d4"/>
      <path d="M24 10V14M24 34V38M10 24H14M34 24H38" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="lead-bg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#083344"/>
          <stop offset="1" stopColor="#0c4a6e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TemplateDesignIllustration({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#tpl-bg)"/>
      <rect x="12" y="14" width="24" height="20" rx="3" fill="#581c87" stroke="#c084fc" strokeWidth="1.5"/>
      <line x1="12" y1="20" x2="36" y2="20" stroke="#c084fc" strokeWidth="1.5"/>
      <rect x="16" y="24" width="16" height="6" rx="1.5" fill="#f472b6"/>
      <defs>
        <linearGradient id="tpl-bg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#4c1d95"/>
          <stop offset="1" stopColor="#2e1065"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LaunchRocketIllustration({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="url(#rkt-bg)"/>
      <path d="M24 12C28 12 32 16 32 24L24 36L16 24C16 16 20 12 24 12Z" fill="#4ade80"/>
      <circle cx="24" cy="20" r="3" fill="#052e16"/>
      <path d="M21 36C21 36 22.5 42 24 42C25.5 42 27 36 27 36" stroke="#f59e0b" strokeWidth="2"/>
      <defs>
        <linearGradient id="rkt-bg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#14532d"/>
          <stop offset="1" stopColor="#052e16"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EmptyCampaignGraphic({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="url(#empty-bg)" opacity="0.5"/>
      <circle cx="100" cy="100" r="60" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" opacity="0.6"/>
      <circle cx="100" cy="100" r="40" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
      
      {/* Central Floating Envelope Rocket */}
      <g transform="translate(60, 50)">
        <rect x="10" y="30" width="60" height="40" rx="8" fill="#312e81" stroke="#818cf8" strokeWidth="2"/>
        <path d="M10 35L40 55L70 35" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 20C48 20 54 26 54 35H26C26 26 32 20 40 20Z" fill="#818cf8"/>
        <circle cx="40" cy="27" r="3" fill="#ffffff"/>
      </g>

      {/* Sparkles */}
      <circle cx="45" cy="45" r="3" fill="#38bdf8" className="animate-ping"/>
      <circle cx="155" cy="65" r="4" fill="#f472b6"/>
      <circle cx="160" cy="140" r="3" fill="#4ade80"/>
      <circle cx="40" cy="150" r="4" fill="#fbbf24"/>
      <defs>
        <linearGradient id="empty-bg" x1="0" y1="0" x2="200" y2="200">
          <stop stopColor="#1e1b4b"/>
          <stop offset="1" stopColor="#0f172a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
