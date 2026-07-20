'use client';

import { ReactNode, useState } from 'react';
import { Info, X, ChevronDown, ChevronUp } from 'lucide-react';

interface PageGuideProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function PageGuide({ title, children, defaultOpen = true }: PageGuideProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      open ? 'bg-indigo-950/40 border-indigo-500/30 shadow-md' : 'bg-[#131929] border-white/10 hover:bg-[#182035]'
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full p-3.5 text-left cursor-pointer"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          open ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'
        }`}>
          <Info className="h-3.5 w-3.5" />
        </div>
        <span className={`text-xs font-bold transition-colors ${
          open ? 'text-indigo-300' : 'text-slate-300'
        }`}>
          {title}
        </span>
        <span className="ml-auto text-slate-400">
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3.5 pt-0 text-xs text-slate-300 leading-relaxed space-y-1.5 font-normal border-t border-indigo-500/10 mt-1">
          {children}
        </div>
      )}
    </div>
  );
}
