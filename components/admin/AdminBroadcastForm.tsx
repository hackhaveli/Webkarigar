'use client';

import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function AdminBroadcastForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning'>('info');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) { toast.error('Title and message required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Broadcast sent to ${data.count} users`);
        setSent(true);
        setTitle('');
        setMessage('');
      } else {
        toast.error(data.error || 'Failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        {(['info', 'success', 'warning'] as const).map(t => (
          <button key={t} type="button" onClick={() => setType(t)}
            className={`py-2.5 rounded-xl border text-sm font-bold capitalize transition-all
              ${type === t
                ? t === 'info' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : t === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}>
            {t === 'info' ? 'ℹ️' : t === 'success' ? '✅' : '⚠️'} {t}
          </button>
        ))}
      </div>
      <input
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Notification title (e.g. New templates added!)"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40"
      />
      <textarea
        value={message} onChange={e => setMessage(e.target.value)}
        placeholder="Write your message to all users..."
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/40 resize-none"
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><Send className="w-4 h-4" /> Send Broadcast</>
          )}
        </button>
        {sent && <p className="text-xs text-green-400 flex items-center gap-1"><Bell className="w-3 h-3" /> Last broadcast sent!</p>}
      </div>
    </form>
  );
}
