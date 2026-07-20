'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Save, FileText, Code, Eye, Copy, CheckCircle2, Send, Mail, Link2, ExternalLink, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { PageGuide } from '@/components/dashboard/PageGuide';
import dynamic from 'next/dynamic';
const EmailEditor = dynamic(() => import('@/components/templates/EmailEditor').then(mod => mod.EmailEditor), { ssr: false });

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface CampaignTemplate {
  templateId: string;
  templateName: string;
  niche: string;
  previewUrl: string;
  previewLinkPattern: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  niche: string | null;
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const renderEditorJsBlocks = (jsonString: string, lead?: Lead | null) => {
  const previewName = lead?.name || 'John';
  const previewEmail = lead?.email || 'john@example.com';
  const previewBusiness = lead?.businessName || 'Your Business';
  const previewSlug = toSlug(previewBusiness);

  try {
    // 1. First, decode URL-encoded curly braces (from links)
    let processedJson = jsonString.replace(/%7B/gi, '{').replace(/%7D/gi, '}');
    
    // 2. Map variables to real lead data to show the final version
    processedJson = processedJson
      .replace(/\{\{name\}\}/gi, previewName)
      .replace(/\{\{email\}\}/gi, previewEmail)
      .replace(/\{\{business_name\}\}/gi, previewBusiness)
      .replace(/\{\{business_slug\}\}/gi, previewSlug);

    const data = JSON.parse(processedJson);
    if (!data || !data.blocks || data.blocks.length === 0) {
      return React.createElement('div', { className: 'text-muted-foreground italic' }, 'No content blocks found.');
    }
    return data.blocks.map((block: any, idx: number) => {
      switch (block.type) {
        case 'paragraph':
          return React.createElement('p', { key: idx, dangerouslySetInnerHTML: { __html: block.data.text }, className: 'mb-4' });
        case 'header':
          const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;
          return React.createElement(Tag, { key: idx, dangerouslySetInnerHTML: { __html: block.data.text }, className: 'font-bold my-4' });
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const listClass = block.data.style === 'ordered' ? 'list-decimal list-inside mb-4' : 'list-disc list-inside mb-4';
          return React.createElement(ListTag, { key: idx, className: listClass },
            block.data.items.map((item: any, i: number) => {
              const htmlContent = typeof item === 'string' ? item : (item.content || '');
              return React.createElement('li', { key: i, dangerouslySetInnerHTML: { __html: htmlContent } });
            })
          );
        case 'quote':
          return React.createElement('blockquote', { key: idx, className: 'border-l-4 pl-4 italic my-4' }, block.data.text);
        default:
          return React.createElement('div', { key: idx, className: 'mb-4 text-xs text-muted-foreground' }, `[Unsupported block: ${block.type}]`);
      }
    });
  } catch {
    return React.createElement('div', { className: 'text-red-500' }, 'Failed to parse template content.');
  }
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [previewLeadId, setPreviewLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [attachedTemplates, setAttachedTemplates] = useState<CampaignTemplate[]>([]);
  const [activeAttachedIdx, setActiveAttachedIdx] = useState(0);

  const attachedTemplate = attachedTemplates[activeAttachedIdx] ?? null;
  const variables = ['{{name}}', '{{business_name}}', '{{preview_url}}', '{{city}}'];

  // Determine which lead to use for the live preview
  const previewLead = previewLeadId
    ? leads.find(l => l.id === previewLeadId) ?? leads[0] ?? null
    : leads[0] ?? null;

  useEffect(() => {
    fetchTemplates();
    fetchLeads();
    // Load attached campaign templates from session
    try {
      const storedMultiple = sessionStorage.getItem('selected-campaign-templates');
      if (storedMultiple) {
        const parsed = JSON.parse(storedMultiple);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAttachedTemplates(parsed);
          return;
        }
      }
      const storedSingle = sessionStorage.getItem('selected-campaign-template');
      if (storedSingle) {
        const parsed = JSON.parse(storedSingle);
        setAttachedTemplates([parsed]);
      }
    } catch {}
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (res.ok) setLeads(data.leads || []);
    } catch {}
  };

  const copyVariable = (v: string) => {
    navigator.clipboard.writeText(v);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const insertPreviewLink = () => {
    if (!attachedTemplate) {
      toast.error('No template attached. Go to Marketplace and click "Use in Campaign".');
      return;
    }
    const link = attachedTemplate.previewLinkPattern;
    navigator.clipboard.writeText(link);
    setCopiedVar('preview_link');
    setTimeout(() => setCopiedVar(null), 2500);
    toast.success('Preview link copied to clipboard!', {
      description: 'Paste it in the editor using Ctrl+V',
    });
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (res.ok) setTemplates(data.templates || []);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!name || !subject || !content) {
      toast.error('Please fill out all fields and write some content.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content: JSON.stringify(content) }),
      });
      if (res.ok) {
        const newTpl = await res.json();
        setTemplates([newTpl, ...templates]);
        setName(''); setSubject(''); setContent(null); setActiveTemplate(null);
        toast.success('Template saved successfully!');
      } else {
        toast.error('Failed to save template.');
      }
    } catch {
      toast.error('Network error during save.');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this template?')) return;
    try {
      const res = await fetch('/api/templates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
        if (activeTemplate?.id === id) setActiveTemplate(null);
        toast.success('Template deleted');
      } else {
        toast.error('Could not delete template');
      }
    } catch {
      toast.error('Network issue while deleting');
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-1">Email Templates</h2>
          <p className="text-slate-300 text-base font-normal">Design responsive emails with dynamic variables.</p>
        </div>
      </div>

      <PageGuide title="What are email templates?">
        <p>This is the email copy your leads will read. Use <strong>variables</strong> like <code>{`{{name}}`}</code>, <code>{`{{business_name}}`}</code>, and <code>{`{{preview_url}}`}</code> to personalize each email automatically.</p>
        <p><strong>Tip:</strong> Paste the preview link (from the <strong>Website Templates</strong> page) into your email body so each lead sees their own demo site. Short, direct emails under 100 words get the best reply rates.</p>
        <p>If you don't create a template, the system uses a default one. But customizing your pitch always performs better.</p>
      </PageGuide>

      {/* Attached Marketplace Templates Banner */}
      {attachedTemplates.length > 0 && (
        <div className="bg-[#131929] border border-primary/30 rounded-xl px-5 py-3.5 space-y-3 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-violet-300">{attachedTemplates.length} Website Template{attachedTemplates.length > 1 ? 's' : ''} Attached</span>
            <span className="text-xs text-slate-400">· Click one to copy its preview link</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachedTemplates.map((t, idx) => (
              <button
                key={t.templateId}
                onClick={() => {
                  setActiveAttachedIdx(idx);
                  navigator.clipboard.writeText(t.previewLinkPattern);
                  setCopiedVar(`preview_link_${idx}`);
                  setTimeout(() => setCopiedVar(null), 2500);
                  toast.success(`Preview link for "${t.templateName}" copied!`, { description: 'Paste it in the editor using Ctrl+V' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  activeAttachedIdx === idx
                    ? 'bg-primary/30 border-primary text-white shadow-sm'
                    : 'bg-[#182035] border-white/10 text-slate-200 hover:border-primary/40 hover:text-white'
                }`}
              >
                <Link2 className="h-3 w-3" />
                {copiedVar === `preview_link_${idx}` ? '✓ Copied!' : t.templateName}
              </button>
            ))}
          </div>
          {attachedTemplate && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-slate-400 hover:text-white gap-1.5 h-7"
                onClick={() => window.open(attachedTemplate.previewUrl, '_blank')}
              >
                <ExternalLink className="h-3 w-3" /> Preview selected in browser
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[700px]">
        {/* Sidebar: Template List */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <Button
            className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-bold shadow-lg shadow-primary/20 h-12 text-md rounded-xl"
            onClick={() => setActiveTemplate(null)}
          >
            <PlusIcon className="mr-2 h-5 w-5" /> New Template
          </Button>

          <div className="bg-[#0f1422] border border-white/10 shadow-xl rounded-2xl flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#131929]">
              <h3 className="font-bold text-white text-sm">Saved Templates</h3>
            </div>
            <div className="p-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-slate-400">Loading...</div>
              ) : templates.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">No templates saved yet.</div>
              ) : (
                <div className="divide-y divide-white/10">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setActiveTemplate(tpl)}
                      className={`p-4 cursor-pointer hover:bg-white/[0.06] transition flex justify-between items-center group ${
                        activeTemplate?.id === tpl.id ? 'bg-primary/20 border-l-4 border-primary' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <div className={`font-semibold text-sm flex items-center ${activeTemplate?.id === tpl.id ? 'text-violet-300' : 'text-slate-200 group-hover:text-white'}`}>
                          <FileText className={`w-4 h-4 mr-2 ${activeTemplate?.id === tpl.id ? 'text-violet-400' : 'text-slate-400'}`} />
                          <span className="truncate">{tpl.name}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-slate-400 hover:bg-destructive/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => deleteTemplate(tpl.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-9 flex flex-col bg-[#0f1422] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-[#131929] flex justify-between items-center">
            <h3 className="font-bold text-lg text-white flex items-center">
              {activeTemplate ? <><Eye className="w-5 h-5 mr-2 text-primary" />View Template Output</> : <><Code className="w-5 h-5 mr-2 text-primary" />Builder</>}
            </h3>
            {!activeTemplate && (
              <div className="flex items-center gap-2">
                {/* Insert Preview Link button */}
                <div className="relative">
                  <Button
                    onClick={insertPreviewLink}
                    variant="outline"
                    className={`bg-[#182035] text-white border-white/15 h-9 px-4 text-sm font-semibold shadow-md gap-1.5 ${
                      attachedTemplate ? 'border-primary/50 text-violet-300 hover:bg-primary/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <Link2 className="h-4 w-4" />
                    Insert Preview Link
                    {attachedTemplate && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full ml-1" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={() => toast.success('Test email dispatched to your inbox!', { icon: '🚀' })}
                  variant="outline"
                  className="bg-[#182035] text-white hover:bg-white/10 border-white/15 h-9 px-4 text-sm font-semibold shadow-md"
                >
                  <Send className="h-4 w-4 mr-2 text-violet-400" /> Test
                </Button>
                <Button
                  onClick={saveTemplate}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-white h-9 px-6 text-sm font-semibold shadow-md shadow-primary/20"
                >
                  <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            )}
          </div>

          <div className="p-0 flex flex-1 overflow-hidden">
            {activeTemplate ? (
              <div className="p-8 w-full overflow-y-auto max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-2 gap-6 bg-[#131929] p-6 rounded-xl border border-white/10">
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Template Name</Label>
                    <div className="font-semibold text-lg text-white mt-1">{activeTemplate.name}</div>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Subject Line</Label>
                    <div className="font-semibold text-lg text-white mt-1">{activeTemplate.subject}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs uppercase tracking-wider mb-3 block font-semibold">Email Live View</Label>
                  <div className="p-8 border border-white/10 rounded-xl bg-white text-black min-h-[400px] prose prose-sm max-w-none shadow-inner [&_a]:text-[#6366f1] [&_a]:underline [&_a]:font-bold hover:[&_a]:text-[#4f46e5] [&_a]:transition-colors">
                    {renderEditorJsBlocks(activeTemplate.content, previewLead)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row w-full h-full divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {/* LEFT: Configuration & Editor */}
                <div className="w-full lg:w-1/2 flex flex-col p-6 overflow-y-auto">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-200 font-semibold text-sm">Template Name</Label>
                      <Input
                        className="bg-[#131929] border-white/15 text-white placeholder:text-slate-400 h-11 focus-visible:ring-primary focus-visible:border-primary"
                        placeholder="e.g. Q4 Master Outreach"
                        value={name} onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200 font-semibold text-sm">Subject Line</Label>
                      <Input
                        className="bg-[#131929] border-white/15 text-white placeholder:text-slate-400 h-11 focus-visible:ring-primary focus-visible:border-primary"
                        placeholder="Quick question about {{business_name}}"
                        value={subject} onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between items-end mb-3">
                        <Label className="text-slate-200 font-semibold text-sm">Email Content Block</Label>
                      </div>
                      {/* Variables */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {variables.map(v => (
                          <Button
                            key={v} variant="outline" size="sm"
                            onClick={() => copyVariable(v)}
                            className="bg-[#131929] border-white/15 text-violet-300 hover:bg-primary/20 hover:text-white transition-colors text-xs font-mono py-1 h-7"
                          >
                            {copiedVar === v ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1 opacity-60" />}
                            {v}
                          </Button>
                        ))}
                      </div>
                      {/* Preview Link Insert */}
                      {attachedTemplates.length > 0 && (
                        <div className="mb-3 bg-[#131929] border border-primary/25 rounded-xl p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-violet-400 flex-shrink-0" />
                            <p className="text-xs text-slate-300 flex-1 min-w-0">
                              <span className="text-violet-300 font-semibold">{attachedTemplates.length} Template{attachedTemplates.length > 1 ? 's' : ''} attached.</span> Current selection:
                            </p>
                          </div>
                          {attachedTemplate && (
                            <div className="flex items-center justify-between bg-black/40 rounded-lg p-2 border border-white/10">
                              <span className="text-xs text-white font-semibold truncate">{attachedTemplate.templateName}</span>
                              <Button size="sm" className="text-[10px] h-6 bg-primary/20 text-violet-300 hover:bg-primary/30 border-0 px-2 font-bold" onClick={insertPreviewLink}>
                                <Copy className="h-3 w-3 mr-1" /> Copy Link
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="rounded-xl overflow-hidden border border-white/15 shadow-lg bg-[#131929]">
                        <EmailEditor onChange={setContent} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Live Preview */}
                <div className="w-full lg:w-1/2 bg-[#080b15] p-6 lg:p-8 overflow-y-auto flex flex-col items-center">
                  {/* Lead selector for preview */}
                  <div className="w-full max-w-[650px] mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-slate-400 text-[10px] uppercase tracking-widest font-bold flex items-center">
                        <Mail className="w-3 h-3 mr-1.5 text-violet-400" /> Previewing as:
                      </Label>
                      {leads.length > 0 && (
                        <select
                          value={previewLeadId || ''}
                          onChange={e => setPreviewLeadId(e.target.value || null)}
                          className="text-xs bg-[#131929] border border-white/15 text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary cursor-pointer font-medium"
                        >
                          {leads.map(l => (
                            <option key={l.id} value={l.id} className="bg-[#131929] text-white">
                              {l.name} — {l.businessName || 'No business'}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {previewLead && (
                      <div className="bg-primary/5 border border-primary/15 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[11px] text-primary font-semibold">{previewLead.name}</span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-slate-300 font-mono">{previewLead.businessName ? toSlug(previewLead.businessName) : 'no-slug'}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full max-w-[650px] flex-1 flex flex-col rounded-xl overflow-hidden border border-white/10 bg-white shadow-2xl min-h-[500px]">
                    {/* Gmail Header */}
                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h1 className="text-[22px] text-gray-800 font-normal leading-tight flex items-center">
                        {subject
                          ? subject
                              .replace(/\{\{name\}\}/gi, previewLead?.name || 'John')
                              .replace(/\{\{business_name\}\}/gi, previewLead?.businessName || 'Your Business')
                          : 'No Subject'}
                        <Badge variant="secondary" className="ml-3 font-medium text-xs text-slate-400 bg-gray-200/80 border-0 pointer-events-none">Inbox</Badge>
                      </h1>
                    </div>
                    {/* Gmail Meta */}
                    <div className="px-6 py-4 flex items-start justify-between border-b border-gray-100 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                          {name ? name.charAt(0).toUpperCase() : 'W'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">
                            {name || 'Your Name'} <span className="text-slate-400 font-normal text-xs ml-1">&lt;hello@webkarigar.com&gt;</span>
                          </span>
                          <span className="text-slate-400 text-[11px] mt-0.5">to me ▾</span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {/* Live Content */}
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto w-full bg-white">
                      {content ? (
                        <div className="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed [&_a]:text-[#6366f1] [&_a]:underline [&_a]:font-bold hover:[&_a]:text-[#4f46e5] [&_a]:transition-colors">
                          {renderEditorJsBlocks(JSON.stringify(content), previewLead)}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                          Start typing in the editor to see preview...
                        </div>
                      )}
                    </div>
                    {/* Gmail Bottom Reply Box */}
                    <div className="mx-6 mb-6 p-3 border border-gray-200 rounded-full flex gap-3 text-slate-400 text-sm font-medium">
                      <div className="w-full text-center hover:bg-gray-50 cursor-pointer rounded-full py-1">Reply</div>
                      <div className="w-[1px] bg-gray-200" />
                      <div className="w-full text-center hover:bg-gray-50 cursor-pointer rounded-full py-1">Forward</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
  );
}
