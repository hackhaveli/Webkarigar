'use client';

import { useState } from 'react';
import { X, Plus, Globe, Github, Tag, Loader2, CheckCircle2, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Niche, NICHE_CONFIG, MarketplaceTemplate } from '@/lib/marketplace-templates';
import { toast } from 'sonner';

interface ImportTemplateModalProps {
  onClose: () => void;
  onImport: () => void;
}

const NICHE_OPTIONS: { value: Niche; label: string }[] = [
  { value: 'gym', label: '🏋️ Gym & Fitness' },
  { value: 'salon', label: '💅 Salon & Beauty' },
  { value: 'real-estate', label: '🏠 Real Estate' },
  { value: 'coaching', label: '🎯 Coaching' },
  { value: 'restaurant', label: '🍽️ Restaurant' },
  { value: 'ecommerce', label: '🛒 E-Commerce' },
];

export function ImportTemplateModal({ onClose, onImport }: ImportTemplateModalProps) {
  const [githubUrl, setGithubUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<Niche | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [imported, setImported] = useState(false);

  const isValid = githubUrl.trim() && previewUrl.trim() && name.trim() && selectedNiche;

  const handleImport = async () => {
    if (!isValid) {
      toast.error('Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate processing

    const customTemplate: MarketplaceTemplate = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      niche: selectedNiche as Niche,
      description: description.trim() || `Custom ${name.trim()} template`,
      previewUrl: previewUrl.trim(),
      githubUrl: githubUrl.trim(),
      previewImage: '',
      features: ['Custom template', 'Slug personalization'],
      tags: ['custom', selectedNiche as string],
      rating: 5.0,
      downloads: 0,
      bestFor: `Custom ${name.trim()} clients`,
      conversionTag: { emoji: '⭐', label: 'Custom Template', color: 'text-primary bg-primary/10 border-primary/20' },
      campaignUsage: 0,
      trustBadges: ['Custom design'],
      demoClientName: name.trim(),
    };

    // Save to localStorage for persistence
    const existing = JSON.parse(localStorage.getItem('custom-templates') || '[]');
    existing.unshift(customTemplate);
    localStorage.setItem('custom-templates', JSON.stringify(existing));

    setIsLoading(false);
    setImported(true);

    setTimeout(() => {
      onImport();
      onClose();
      toast.success('Custom template imported successfully!');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#111827]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <FolderGit2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import Your Template</h2>
              <p className="text-xs text-gray-500">Add a custom template from GitHub</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Template Name */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm font-medium">Template Name <span className="text-red-400">*</span></Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Gym Landing Page"
              className="bg-[#111827] border-white/10 text-white h-11 focus-visible:ring-primary focus-visible:ring-1"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" />
              GitHub Repository URL <span className="text-red-400">*</span>
            </Label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="bg-[#111827] border-white/10 text-white h-11 focus-visible:ring-primary focus-visible:ring-1 font-mono text-sm"
            />
          </div>

          {/* Preview URL */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Live Preview URL <span className="text-red-400">*</span>
            </Label>
            <Input
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="https://your-template.vercel.app"
              className="bg-[#111827] border-white/10 text-white h-11 focus-visible:ring-primary focus-visible:ring-1 font-mono text-sm"
            />
          </div>

          {/* Niche */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Niche <span className="text-red-400">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {NICHE_OPTIONS.map(({ value, label }) => {
                const config = NICHE_CONFIG[value];
                const isSelected = selectedNiche === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedNiche(value)}
                    className={`text-xs px-3 py-2.5 rounded-xl border transition-all duration-150 font-medium text-center
                      ${isSelected
                        ? `${config.bg} ${config.color} border-current`
                        : 'bg-[#111827] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description (optional) */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm font-medium">Description <span className="text-gray-500 font-normal">(optional)</span></Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what this template is for..."
              rows={2}
              className="w-full bg-[#111827] border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-600"
            />
          </div>

          {/* Info note */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
            <strong className="text-primary/80">💡 Personalization tip:</strong> Your template should accept{' '}
            <code className="text-primary font-mono">?name=</code> and{' '}
            <code className="text-primary font-mono">?business=</code> query params from the URL for personalization.{' '}
            <button className="text-primary/70 underline underline-offset-2" onClick={() => window.open('/templates/guide', '_blank')}>
              View guide →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!isValid || isLoading || imported}
            className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 hover:opacity-90 min-w-[140px] shadow-lg shadow-primary/20"
          >
            {imported ? (
              <><CheckCircle2 className="h-4 w-4 mr-2 text-green-400" /> Imported!</>
            ) : isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing...</>
            ) : (
              <><Plus className="h-4 w-4 mr-2" /> Import Template</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
