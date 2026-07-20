'use client';

import { useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface AdminTemplateActionsProps {
  templateId: string;
  isFeatured: boolean;
  isSystem: boolean;
  dbTemplate?: boolean;
}

export function AdminTemplateActions({ templateId, isFeatured: initialFeatured, isSystem, dbTemplate }: AdminTemplateActionsProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  const toggleFeatured = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_featured', templateId, featured: !featured }),
      });
      if (res.ok) {
        setFeatured(!featured);
        toast.success(featured ? 'Removed from featured' : 'Marked as featured');
      }
    } finally { setLoading(false); }
  };

  const deleteDbTemplate = async () => {
    if (!confirm('Delete this template?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', templateId }),
      });
      if (res.ok) { toast.success('Template deleted'); window.location.reload(); }
      else toast.error('Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {isSystem && (
        <button onClick={toggleFeatured} disabled={loading}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all
            ${featured
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
          <Star className={`w-3 h-3 ${featured ? 'fill-amber-400' : ''}`} />
          {featured ? 'Featured' : 'Feature'}
        </button>
      )}
      {dbTemplate && (
        <button onClick={deleteDbTemplate} disabled={loading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[11px] font-bold transition-all">
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
