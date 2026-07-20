'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Rocket, Download, Star, Users, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MarketplaceTemplate, NICHE_CONFIG } from '@/lib/marketplace-templates';

interface TemplateCardProps {
  template: MarketplaceTemplate;
  onPreview: (template: MarketplaceTemplate) => void;
  onUseInCampaign: (template: MarketplaceTemplate) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string, selected: boolean) => void;
}

export function TemplateCard({ template, onPreview, onUseInCampaign, isSelected, onToggleSelect }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const nicheConfig = NICHE_CONFIG[template.niche as keyof typeof NICHE_CONFIG] || {
    label: template.niche || 'Other',
    bg: 'bg-gray-500/10',
    color: 'text-gray-400',
    gradient: 'from-gray-500 to-slate-600',
  };

  const gradientMap: Record<string, string> = {
    gym: 'from-orange-900/60 via-red-900/40 to-[#0B0F19]',
    salon: 'from-pink-900/60 via-rose-900/40 to-[#0B0F19]',
    'real-estate': 'from-blue-900/60 via-indigo-900/40 to-[#0B0F19]',
    coaching: 'from-violet-900/60 via-purple-900/40 to-[#0B0F19]',
    restaurant: 'from-yellow-900/60 via-amber-900/40 to-[#0B0F19]',
    ecommerce: 'from-teal-900/60 via-cyan-900/40 to-[#0B0F19]',
  };

  const iconMap: Record<string, string> = {
    gym: '🏋️', salon: '💅', 'real-estate': '🏠',
    coaching: '🎯', restaurant: '🍽️', ecommerce: '🛒',
  };

  const handleUseAndStart = () => {
    // Save template to session & redirect to campaign wizard
    const stored = {
      templateId: template.id,
      templateName: template.name,
      niche: template.niche,
      previewUrl: template.previewUrl,
      previewLinkPattern: `${template.previewUrl}/{{business_slug}}`,
      attachedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('selected-campaign-template', JSON.stringify(stored));
    router.push('/dashboard/campaigns/new');
  };

  return (
    <div
      className={`relative group bg-[#111827] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col
        ${isSelected 
          ? 'border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/10' 
          : isHovered
            ? 'border-primary/40 shadow-2xl shadow-primary/10 -translate-y-1'
            : 'border-white/5 shadow-lg'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {template.isFeatured && (
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full shadow-lg">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Checkbox for multi-select */}
      {onToggleSelect && (
        <div 
          className={`absolute top-3 right-3 z-30 transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onToggleSelect(template.id, !!checked)}
            className="w-5 h-5 bg-black/40 border-white/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary backdrop-blur-sm"
          />
        </div>
      )}

      {/* Preview Thumbnail */}
      <div className={`relative h-40 w-full bg-gradient-to-br ${gradientMap[template.niche] || 'from-gray-800 via-slate-800 to-[#0B0F19]'} overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20 select-none">{iconMap[template.niche] || '✨'}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111827]/90" />
        {/* Fake site skeleton */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1.5 opacity-50">
          <div className="h-2 bg-white/30 rounded-full w-3/4" />
          <div className="h-1.5 bg-white/15 rounded-full w-1/2" />
          <div className="h-1.5 bg-white/15 rounded-full w-2/3" />
        </div>
        {/* Hover: Client View CTA */}
        <div className={`absolute inset-0 bg-black/65 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs gap-1.5"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-3.5 w-3.5" />
            See How This Looks For a Client
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {/* Row 1: Niche + Rating */}
        <div className="flex items-center justify-between">
          <Badge className={`text-[9px] font-bold tracking-wider uppercase border ${nicheConfig.bg} ${nicheConfig.color} px-2 py-0.5`}>
            {nicheConfig.label}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-300">{template.rating}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-white text-sm leading-tight">{template.name}</h3>

        {/* Conversion Tag */}
        {template.conversionTag && (
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg border w-fit ${template.conversionTag?.color || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            <span>{template.conversionTag?.emoji || '✨'}</span>
            {template.conversionTag?.label || 'Optimized'}
          </div>
        )}

        {/* Best For */}
        <div className="bg-white/3 border border-white/5 rounded-lg px-2.5 py-1.5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Best for</p>
          <p className="text-xs text-gray-300 leading-snug">{template.bestFor}</p>
        </div>

        {/* Usage Stats */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <Users className="h-3 w-3" />
          <span className="text-[10px]">Used in <span className="text-gray-300 font-semibold">{template.campaignUsage}+</span> campaigns</span>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-1">
          {(template.trustBadges || []).slice(0, 2).map(badge => (
            <span key={badge} className="flex items-center gap-1 text-[9px] text-green-400/80 bg-green-500/5 border border-green-500/10 px-1.5 py-0.5 rounded-full">
              <ShieldCheck className="h-2.5 w-2.5" /> {badge}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1 mt-auto">
          {/* Primary CTA */}
          <Button
            size="sm"
            className={`w-full text-xs h-9 bg-gradient-to-r ${nicheConfig.gradient} text-white border-0 hover:opacity-90 shadow-lg font-semibold gap-1.5`}
            onClick={handleUseAndStart}
          >
            <Rocket className="h-3.5 w-3.5" />
            🚀 Use &amp; Start Campaign
          </Button>
          {/* Secondary row */}
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => onPreview(template)}
            >
              <Eye className="h-3 w-3 mr-1" /> Client View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => onUseInCampaign(template)}
            >
              <Zap className="h-3 w-3 mr-1" /> Quick Use
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
