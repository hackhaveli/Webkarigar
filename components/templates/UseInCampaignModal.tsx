'use client';

import { useState } from 'react';
import { X, Package, Link2, Copy, CheckCircle2, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MarketplaceTemplate, NICHE_CONFIG } from '@/lib/marketplace-templates';
import { toast } from 'sonner';

interface UseInCampaignModalProps {
  template: MarketplaceTemplate | null;
  onClose: () => void;
}

export function UseInCampaignModal({ template, onClose }: UseInCampaignModalProps) {
  const [leadName, setLeadName] = useState('{{name}}');
  const [leadBusiness, setLeadBusiness] = useState('{{business_name}}');
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const nicheConfig = NICHE_CONFIG[template.niche as keyof typeof NICHE_CONFIG] || {
    label: template.niche || 'Other',
    bg: 'bg-gray-500/10',
    color: 'text-gray-400',
    gradient: 'from-gray-500 to-slate-600',
  };

  const generatePreviewLink = () => {
    const base = template.previewUrl.replace(/\/$/, '');
    // Only parse business name as a true path variable based on specific instructions
    const businessSegment = leadBusiness !== '{{business_name}}' 
      ? leadBusiness.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : '{{business_slug}}';
      
    return `${base}/${businessSegment}`;
  };

  const previewLink = generatePreviewLink();

  const copyLink = () => {
    navigator.clipboard.writeText(previewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.success('Preview link copied!');
  };

  const saveToSession = () => {
    // Store selected template in session for campaign builder
    const stored = {
      templateId: template.id,
      templateName: template.name,
      niche: template.niche,
      previewUrl: template.previewUrl,
      previewLinkPattern: previewLink,
      attachedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('selected-campaign-template', JSON.stringify(stored));
    toast.success(`"${template.name}" attached to campaign builder!`, {
      description: 'Open the campaign wizard to use this template.',
      action: {
        label: 'Go to Campaigns',
        onClick: () => window.location.href = '/dashboard/campaigns/new',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative px-6 py-5 bg-gradient-to-r ${nicheConfig.gradient} bg-opacity-20 border-b border-white/5`}>
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Use in Campaign</h2>
                <p className="text-xs text-white/70">{template.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Template info pill */}
          <div className="flex items-center gap-3 bg-[#111827] border border-white/5 rounded-xl p-3">
            <Badge className={`text-[10px] font-bold uppercase border ${nicheConfig.bg} ${nicheConfig.color}`}>
              {nicheConfig.label}
            </Badge>
            <span className="text-sm text-gray-300 font-medium">{template.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs text-gray-500 hover:text-gray-300 h-7"
              onClick={() => window.open(template.previewUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Preview
            </Button>
          </div>

          {/* Personalized Link Generator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                <Zap className="h-3 w-3 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-white">Personalized Preview Link Generator</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-xs">Lead Name (or variable)</Label>
                <Input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="{{name}} or John"
                  className="bg-[#111827] border-white/10 text-white h-9 text-sm font-mono focus-visible:ring-primary focus-visible:ring-1"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-400 text-xs">Business Name (or variable)</Label>
                <Input
                  value={leadBusiness}
                  onChange={(e) => setLeadBusiness(e.target.value)}
                  placeholder="{{business_name}} or GymPro"
                  className="bg-[#111827] border-white/10 text-white h-9 text-sm font-mono focus-visible:ring-primary focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Generated Link */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-xs flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                Generated Preview URL
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-3 py-2.5 font-mono text-xs text-primary break-all leading-relaxed">
                  {previewLink}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-auto border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 flex-shrink-0 w-10"
                  onClick={copyLink}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[11px] text-gray-600">
                Use <code className="text-gray-500">{'{{name}}'}</code> and <code className="text-gray-500">{'{{business_slug}}'}</code> as placeholders — they'll be replaced per lead when sending.
              </p>
            </div>
          </div>

          {/* How to use */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">How to use in Email</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                Click <strong className="text-gray-300">"Use in Campaign"</strong> to attach this template
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                In email editor, click <strong className="text-gray-300">"Insert Preview Link"</strong>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                The link auto-personalizes per lead using their name & business
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                Client clicks link and sees their <strong className="text-gray-300">personalized website preview</strong>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={`flex-1 bg-gradient-to-r ${nicheConfig.gradient} text-white border-0 hover:opacity-90 shadow-lg font-semibold`}
            onClick={saveToSession}
          >
            <Package className="h-4 w-4 mr-2" />
            Attach to Campaign Builder
          </Button>
        </div>
      </div>
    </div>
  );
}
