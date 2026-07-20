'use client';

import { useState } from 'react';
import { Square, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCampaignActions({ campaignId, currentStatus }: { campaignId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const call = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) { toast.success(data.message || 'Done'); window.location.reload(); }
      else toast.error(data.error || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {currentStatus === 'running' && (
        <button onClick={() => call('stop')} disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-[11px] font-bold transition-all">
          <Square className="w-3 h-3" /> Force Stop
        </button>
      )}
      <button onClick={() => { if (confirm('Delete this campaign?')) call('delete'); }} disabled={loading}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[11px] font-bold transition-all">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
