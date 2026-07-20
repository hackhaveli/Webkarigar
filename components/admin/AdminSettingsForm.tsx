'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2 } from 'lucide-react';

export function AdminSettingsForm() {
  const [settings, setSettings] = useState({
    defaultCredits: 10,
    creditsPerEmail: 1,
    freePlanLimit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) setSettings(d.settings);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success('Settings updated successfully!');
      else toast.error('Failed to update settings');
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500 animate-pulse">Loading config...</div>;

  return (
    <div className="space-y-4 text-sm mt-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Default Credits (new user)', key: 'defaultCredits' as keyof typeof settings },
          { label: 'Credits per email sent', key: 'creditsPerEmail' as keyof typeof settings },
          { label: 'Free plan limit', key: 'freePlanLimit' as keyof typeof settings },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
            <span className="text-gray-400">{r.label}</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                disabled={saving}
                value={settings[r.key]}
                onChange={e => setSettings(prev => ({ ...prev, [r.key]: parseInt(e.target.value) || 0 }))}
                className="w-24 bg-[#080B14] border-white/10 text-right font-bold text-white h-8"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
