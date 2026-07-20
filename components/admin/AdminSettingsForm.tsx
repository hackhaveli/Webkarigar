'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, Key, Database, Sliders, ShieldCheck } from 'lucide-react';

export function AdminSettingsForm() {
  const [settings, setSettings] = useState({
    defaultCredits: 10,
    creditsPerEmail: 1,
    freePlanLimit: 10,
    metaAdsApiKey: '',
    metaAdsPixelId: '',
    metaAdsAccountId: '',
    leadgenSupabaseUrl: '',
    leadgenSupabaseServiceKey: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setSettings((prev) => ({
            ...prev,
            ...d.settings,
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load settings', err);
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
      if (res.ok) {
        toast.success('Platform API keys and settings updated successfully!');
      } else {
        toast.error('Failed to update platform settings');
      }
    } catch {
      toast.error('Network error while updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-400 animate-pulse p-4">Loading system settings...</div>;
  }

  return (
    <div className="space-y-8 text-sm">
      {/* 1. Meta Ads API & Marketing Integration */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" /> Meta Ads API & Marketing Integration
        </h2>
        <p className="text-xs text-gray-400">
          Configure Meta Graph API tokens, Facebook Pixel ID, and Ad Account ID for automated ad sync and conversion tracking.
        </p>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-300">Meta Ads API Key / Access Token</label>
            <Input
              type="password"
              disabled={saving}
              value={settings.metaAdsApiKey}
              onChange={(e) => setSettings({ ...settings, metaAdsApiKey: e.target.value })}
              placeholder="EAAG... (Meta Access Token)"
              className="bg-[#080B14] border-white/10 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Meta Pixel ID</label>
            <Input
              type="text"
              disabled={saving}
              value={settings.metaAdsPixelId}
              onChange={(e) => setSettings({ ...settings, metaAdsPixelId: e.target.value })}
              placeholder="e.g. 1234567890"
              className="bg-[#080B14] border-white/10 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Meta Ad Account ID (act_...)</label>
            <Input
              type="text"
              disabled={saving}
              value={settings.metaAdsAccountId}
              onChange={(e) => setSettings({ ...settings, metaAdsAccountId: e.target.value })}
              placeholder="e.g. act_1015849..."
              className="bg-[#080B14] border-white/10 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Supabase Lead Generation Database */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> AI Lead Finder Database Keys
        </h2>
        <p className="text-xs text-gray-400">
          Supabase credentials for the AI lead qualification pipeline and lead management.
        </p>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-300">Supabase Project URL</label>
            <Input
              type="text"
              disabled={saving}
              value={settings.leadgenSupabaseUrl}
              onChange={(e) => setSettings({ ...settings, leadgenSupabaseUrl: e.target.value })}
              placeholder="https://xyz.supabase.co"
              className="bg-[#080B14] border-white/10 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-300">Supabase Service Role Key</label>
            <Input
              type="password"
              disabled={saving}
              value={settings.leadgenSupabaseServiceKey}
              onChange={(e) => setSettings({ ...settings, leadgenSupabaseServiceKey: e.target.value })}
              placeholder="eyJh... (Service Role Secret)"
              className="bg-[#080B14] border-white/10 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Credit & System Limits */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-400" /> Platform Credits & Usage Limits
        </h2>
        <p className="text-xs text-gray-400">
          Values apply dynamically to new user signups and campaign email executions.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-2">
            <label className="text-xs font-bold text-gray-300">Default Credits (New User)</label>
            <Input
              type="number"
              disabled={saving}
              value={settings.defaultCredits}
              onChange={(e) =>
                setSettings({ ...settings, defaultCredits: parseInt(e.target.value) || 0 })
              }
              className="bg-[#080B14] border-white/10 text-right font-bold text-white text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-2">
            <label className="text-xs font-bold text-gray-300">Credits Per Email Sent</label>
            <Input
              type="number"
              disabled={saving}
              value={settings.creditsPerEmail}
              onChange={(e) =>
                setSettings({ ...settings, creditsPerEmail: parseInt(e.target.value) || 0 })
              }
              className="bg-[#080B14] border-white/10 text-right font-bold text-white text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-2">
            <label className="text-xs font-bold text-gray-300">Free Plan Daily Limit</label>
            <Input
              type="number"
              disabled={saving}
              value={settings.freePlanLimit}
              onChange={(e) =>
                setSettings({ ...settings, freePlanLimit: parseInt(e.target.value) || 0 })
              }
              className="bg-[#080B14] border-white/10 text-right font-bold text-white text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-violet-600/30"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save System Configuration
        </Button>
      </div>
    </div>
  );
}
