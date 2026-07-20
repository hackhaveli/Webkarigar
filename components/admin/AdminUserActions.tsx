'use client';

import { useState } from 'react';
import { Coins, ShieldOff, ShieldCheck, Trash2, Plus, Minus, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUserActionsProps {
  userId: string;
  currentStatus: string;
  currentCredits: number;
}

export function AdminUserActions({ userId, currentStatus, currentCredits }: AdminUserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creditAmount, setCreditAmount] = useState(10);
  const [reason, setReason] = useState('');

  const call = async (action: string, body: object = {}) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Done');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed');
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold"
      >
        Actions ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#0d1117] border border-white/15 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 border-b border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Credit Actions</p>
            </div>

            {/* Credit amount input */}
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={creditAmount}
                  onChange={e => setCreditAmount(Number(e.target.value))}
                  min={1} max={10000}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/40"
                  placeholder="Credits"
                />
                <span className="text-xs text-gray-500">cr</span>
              </div>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/40"
                placeholder="Reason (optional)"
              />
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => call('add_credits', { amount: creditAmount, reason })}
                  disabled={loading}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-[11px] font-bold transition-all"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
                <button
                  onClick={() => call('deduct_credits', { amount: creditAmount, reason })}
                  disabled={loading}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[11px] font-bold transition-all"
                >
                  <Minus className="w-3 h-3" /> Deduct
                </button>
                <button
                  onClick={() => call('reset_credits', { reason: reason || 'Admin reset' })}
                  disabled={loading}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-[11px] font-bold transition-all"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">User Actions</p>
              <button
                onClick={() => call(currentStatus === 'blocked' ? 'unblock' : 'block')}
                disabled={loading}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${currentStatus === 'blocked'
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}
              >
                {currentStatus === 'blocked' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                {currentStatus === 'blocked' ? 'Unblock User' : 'Block User'}
              </button>
              <button
                onClick={() => { if (confirm('Delete this user and all their data?')) call('delete'); }}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete User
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
