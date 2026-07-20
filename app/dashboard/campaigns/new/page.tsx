'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, AlertCircle, CheckCircle2, User, Mail, Link as LinkIcon, Settings, ChevronRight, ChevronLeft, Flag, Users, Play, FileText, Store, ExternalLink, Link2, PartyPopper, TrendingUp, MessageSquare, Zap, Rocket, Reply, Copy, Star, Globe, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface MarketplaceTemplateRef {
  templateId: string;
  templateName: string;
  niche: string;
  previewUrl: string;
  previewLinkPattern: string;
}

// ─── ResultModal ───────────────────────────────────────────────────────────
interface ResultModalProps {
  stats: { sent: number; failed: number; total: number };
  isDemoMode: boolean;
  onClose: () => void;
  onFollowUp: () => void;
  onViewCampaigns: () => void;
}

function ResultModal({ stats, isDemoMode, onClose, onFollowUp, onViewCampaigns }: ResultModalProps) {
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const isFirstCampaign = stats.sent >= 5; // milestone trigger
  const replyLow = Math.round(stats.sent * 0.05);
  const replyHigh = Math.round(stats.sent * 0.15);

  const followUpTemplate = `Hey [Name],

Just checking if you saw the website I created for your business:
[link]

Let me know if you'd like this live within 24hrs.

— Rohit`;

  const copyFollowUp = () => {
    navigator.clipboard.writeText(followUpTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-slide-up fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8 text-center">
          {/* First success milestone banner */}
          {isFirstCampaign && (
            <div className="mb-5 bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <StarIcon className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-amber-300 text-left">
                🏆 You just reached {stats.sent}+ potential clients — your first outreach milestone!
              </p>
            </div>
          )}

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <PartyPopper className="h-10 w-10 text-green-400" />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1">
            🎉 Campaign {isDemoMode ? 'Demo ' : ''}Completed!
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            {isDemoMode ? "Simulation done. Here's what a real campaign looks like." : 'Your personalized websites are live in inboxes.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
              <div className="text-2xl font-bold text-white">{stats.sent}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Businesses<br/>Reached</div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-400">{replyLow}–{replyHigh}</div>
              <div className="text-[10px] text-green-600 uppercase tracking-wider mt-0.5">Estimated<br/>Replies</div>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Bounced /<br/>Failed</div>
            </div>
          </div>

          {/* Reply projection note */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-5 text-left">
            <p className="text-xs text-primary/80 font-semibold">📬 Reply Forecast</p>
            <p className="text-xs text-slate-300 mt-1">
              Based on 5–15% industry reply rate for personalized website outreach, you may receive <span className="text-white font-semibold">{replyLow}–{replyHigh} replies</span> in the next 48 hrs.
            </p>
          </div>

          {/* Follow-up section */}
          {showFollowUp ? (
            <div className="bg-[#0f1422] border border-white/[0.08] rounded-xl p-4 mb-5 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Follow-up Template</p>
                <button
                  onClick={copyFollowUp}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-lg p-3 border border-white/[0.08]">
                {followUpTemplate}
              </pre>
              <p className="text-[10px] text-slate-400 mt-2">Send this 3–5 days after your first email for best results.</p>
            </div>
          ) : null}

          {/* Next Steps */}
          <div className="bg-[#0f1422] border border-white/[0.08] rounded-xl p-4 mb-5 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">→ Next Steps</p>
            <div className="space-y-2">
              <button
                onClick={() => setShowFollowUp(v => !v)}
                className="w-full flex items-center gap-3 text-sm text-slate-200 hover:text-white bg-white/3 hover:bg-white/8 border border-white/[0.08] hover:border-primary/20 rounded-xl px-4 py-3 transition-all text-left font-medium group"
              >
                <Reply className="h-4 w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                {showFollowUp ? 'Hide Follow-up Template' : 'Send Follow-up Emails'}
                <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Recommended</span>
              </button>
              <button
                onClick={onViewCampaigns}
                className="w-full flex items-center gap-3 text-sm text-slate-200 hover:text-white bg-white/3 hover:bg-white/8 border border-white/[0.08] rounded-xl px-4 py-3 transition-all text-left font-medium"
              >
                <MessageSquare className="h-4 w-4 text-blue-400 flex-shrink-0" />
                Check replies in Campaigns
              </button>
              <button
                onClick={onFollowUp}
                className="w-full flex items-center gap-3 text-sm text-slate-200 hover:text-white bg-white/3 hover:bg-white/8 border border-white/[0.08] rounded-xl px-4 py-3 transition-all text-left font-medium"
              >
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0" />
                Launch another campaign
              </button>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-blue-600 text-white border-0 hover:opacity-90 font-semibold"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// small inline icon workaround (lucide Star)
function StarIcon({ className }: { className?: string }) {
  return <Star className={className} />;
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function NewCampaignPage() {
  const router = useRouter();
  
  // Data
  const [leads, setLeads] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [name, setName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [delay, setDelay] = useState(0.1);
  const [useGreeting, setUseGreeting] = useState(false);
  const [marketplaceTemplate, setMarketplaceTemplate] = useState<MarketplaceTemplateRef | null>(null);

  // Wizard State
  const [step, setStep] = useState(1);

  // Execution State
  const [sending, setSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<Array<{status: string, message: string}>>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const nextStep = () => {
    if (step === 1 && selectedLeads.length === 0) return toast.error('Please select at least one lead.');
    if (step === 2 && selectedAccounts.length === 0) return toast.error('Please select at least one SMTP account.');
    if (step === 3 && (!name || !selectedTemplateId)) return toast.error('Please provide a campaign name and select a template.');
    setStep(s => Math.min(4, s + 1));
  };
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selected-campaign-template');
      if (stored) setMarketplaceTemplate(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(r => r.json()),
      fetch('/api/smtp').then(r => r.json()),
      fetch('/api/templates').then(r => r.json())
    ]).then(([leadsData, smtpData, tplData]) => {
      setLeads(leadsData.leads || []);
      setAccounts(smtpData.accounts || []);
      setTemplates(tplData.templates || []);
      setLoading(false);
    });
  }, []);

  const toggleLead = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  // Demo Campaign — simulates sending without real SMTP
  const runDemoCampaign = async () => {
    setIsDemoMode(true);
    const demoLeads = 8;
    setSending(true);
    setFinished(false);
    setShowResultModal(false);
    setProgress(0);
    setStats({ sent: 0, failed: 0, total: demoLeads });
    setLogs([{ status: 'info', message: '🎬 Demo mode — simulating campaign engine...' }]);
    setStep(4);

    const demoNames = ['Raj Fitness Club', 'Elite Gym', 'Power Zone', 'Iron Body', 'Flex Studio', 'Peak Performance', 'Body Craft', 'Muscle Hub'];
    for (let i = 0; i < demoNames.length; i++) {
      await new Promise(r => setTimeout(r, 900));
      const isSuccess = Math.random() > 0.15;
      const sent = isSuccess ? i + 1 : i;
      const failed = isSuccess ? 0 : 1;
      setStats({ sent: i + (isSuccess ? 1 : 0), failed: i + (isSuccess ? 0 : 1) - i, total: demoLeads });
      setProgress(Math.round(((i + 1) / demoLeads) * 100));
      setLogs(prev => [...prev, {
        status: isSuccess ? 'success' : 'error',
        message: isSuccess
          ? `✓ Email sent to ${demoNames[i]} — preview link personalised`
          : `✗ Simulated bounce for demo purposes`,
      }]);
    }
    setStats({ sent: 7, failed: 1, total: demoLeads });
    setProgress(100);
    setFinished(true);
    setSending(false);
    setLogs(prev => [...prev, { status: 'info', message: '🎉 Demo complete! 7 businesses reached.' }]);
    setTimeout(() => setShowResultModal(true), 800);
  };

  // Stream reader for processing send events
  const processStream = async (res: Response) => {
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        lines.forEach(line => {
          try {
            const data = JSON.parse(line);
            
            if (data.status === 'success') {
              setStats(prev => ({...prev, sent: data.sent, failed: data.failed, total: data.total}));
              setProgress(((data.sent + data.failed) / data.total) * 100);
              setLogs(prev => [...prev, { status: 'success', message: `Sent to ${data.email} via ${data.senderEmail}` }]);
            } else if (data.status === 'error') {
              setStats(prev => ({...prev, sent: data.sent, failed: data.failed, total: data.total}));
              setProgress(((data.sent + data.failed) / data.total) * 100);
              setLogs(prev => [...prev, { status: 'error', message: `Failed sending to ${data.email}: ${data.error}` }]);
            } else if (data.status === 'complete') {
              setProgress(100);
              setFinished(true);
              setSending(false);
              setLogs(prev => [...prev, { status: 'info', message: `Campaign completed. Sent: ${data.sent}, Failed: ${data.failed}` }]);
              setTimeout(() => setShowResultModal(true), 800);
            }
          } catch (err) {}
        });
      }
    }
  };

  const startCampaign = async () => {
    if (!name || selectedAccounts.length === 0 || selectedLeads.length === 0 || !selectedTemplateId) {
      toast.error('Fill all requirements');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    setSending(true);
    setLogs([{ status: 'info', message: 'Starting campaign initialization...' }]);
    setStats({ sent: 0, failed: 0, total: selectedLeads.length });
    setProgress(0);
    setFinished(false);

    try {
      // 1. Create campaign record
      const campRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject: template.subject })
      });
      const campaign = await campRes.json();

      // Store campaign context for resume
      sessionStorage.setItem('active-campaign', JSON.stringify({
        campaignId: campaign.id,
        templateId: selectedTemplateId,
        selectedLeads,
        selectedAccounts: selectedAccounts,
        subject: template.subject,
        html: template.content,
        delay,
        useGreeting,
      }));

      const targetedLeads = leads.filter(l => selectedLeads.includes(l.id));
      const targetedAccounts = accounts.filter(a => selectedAccounts.includes(a.id));

      // 2. Start sending stream
      const res = await fetch('/api/campaign/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          senders: targetedAccounts,
          recipients: targetedLeads.map(l => ({
            name: l.name, email: l.email, business_name: l.businessName, preview_url: l.previewUrl
          })),
          subject: template.subject,
          html: template.content,
          delay,
          useGreeting
        })
      });

      if (!res.ok) {
        const error = await res.json();
        setLogs(prev => [...prev, { status: 'error', message: `Initialization failed: ${error.error}` }]);
        setSending(false);
        return;
      }

      await processStream(res);
    } catch (error) {
      setLogs(prev => [...prev, { status: 'error', message: `Connection lost: ${String(error)}. Use Resume to continue.` }]);
      setSending(false);
    }
  };

  // Resume a stuck/timed-out campaign from where it left off
  const resumeCampaign = async () => {
    const stored = sessionStorage.getItem('active-campaign');
    if (!stored) { toast.error('No campaign to resume'); return; }
    const ctx = JSON.parse(stored);

    // Get how many were already sent from DB
    const campRes = await fetch(`/api/campaigns`);
    const campData = await campRes.json();
    const campaign = (campData.campaigns || []).find((c: any) => c.id === ctx.campaignId);
    const alreadySent = campaign?.sent || 0;
    const alreadyFailed = campaign?.failed || 0;
    const alreadyProcessed = alreadySent + alreadyFailed;

    const targetedLeads = leads.filter(l => ctx.selectedLeads.includes(l.id));
    const remainingLeads = targetedLeads.slice(alreadyProcessed);

    if (remainingLeads.length === 0) {
      toast.success('Campaign already completed!');
      return;
    }

    const targetedAccounts = accounts.filter(a => ctx.selectedAccounts.includes(a.id));

    setSending(true);
    setFinished(false);
    setStats({ sent: alreadySent, failed: alreadyFailed, total: targetedLeads.length });
    setProgress((alreadyProcessed / targetedLeads.length) * 100);
    setLogs(prev => [...prev, { status: 'info', message: `Resuming campaign — skipping ${alreadyProcessed} already processed, ${remainingLeads.length} remaining...` }]);
    setStep(4);

    try {
      const res = await fetch('/api/campaign/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: ctx.campaignId,
          senders: targetedAccounts,
          recipients: remainingLeads.map((l: any) => ({
            name: l.name, email: l.email, business_name: l.businessName, preview_url: l.previewUrl
          })),
          subject: ctx.subject,
          html: ctx.html,
          delay: ctx.delay,
          useGreeting: ctx.useGreeting,
          resumeOffset: alreadyProcessed,
        })
      });

      if (!res.ok) {
        const error = await res.json();
        setLogs(prev => [...prev, { status: 'error', message: `Resume failed: ${error.error}` }]);
        setSending(false);
        return;
      }

      await processStream(res);
    } catch (error) {
      setLogs(prev => [...prev, { status: 'error', message: `Connection lost again: ${String(error)}. Try Resume again.` }]);
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center text-slate-400">Loading wizard...</div>;

  const stepsList = ['Select Leads', 'Select SMTP', 'Template & Info', 'Review & Launch'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2 mt-4">
        <h2 className="text-4xl font-extrabold tracking-tight text-white">Get Clients by Showing Their Website First</h2>
        <p className="text-slate-300">Personalized outreach that lands in inboxes and gets replies — not spam folders.</p>
      </div>

      {/* Modern Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
        <div className="relative z-10 flex justify-between">
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isPast = step > stepNum;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 bg-[#07090e] ${
                  isActive ? 'border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 
                  isPast ? 'border-primary bg-primary text-white' : 'border-white/20 text-slate-400'
                }`}>
                  {isPast ? <CheckCircle2 className="w-5 h-5 text-white" /> : stepNum}
                </div>
                <span className={`text-xs mt-3 font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0f1422] border border-white/[0.08] rounded-2xl shadow-2xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden transition-all">
        
        {/* STEP 1: LEADS */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white flex items-center mb-2"><Users className="w-5 h-5 mr-3 text-primary" /> Target Audience</h3>
            <p className="text-slate-300 text-sm mb-6">Select the leads you want to enroll in this campaign.</p>
            
            <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-5 mb-6 flex justify-between items-center shadow-inner">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Audience Size</span>
                <span className="text-3xl font-extrabold text-white">{selectedLeads.length} <span className="text-lg text-slate-300 font-normal">leads selected</span></span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 border-white/10 bg-[#0f1422] text-white hover:bg-white/[0.06] shadow-md hover:scale-105 transition-transform" onClick={() => setSelectedLeads(leads.map(l => l.id))}>Select All ({leads.length})</Button>
                <Button variant="ghost" size="sm" className="h-9 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors" onClick={() => setSelectedLeads([])}>Clear</Button>
              </div>
            </div>
            <div className="space-y-2 flex-1 max-h-[300px] overflow-y-auto border border-white/[0.08] rounded-xl p-3 bg-background/50">
              {leads.length === 0 ? <p className="text-center text-sm text-slate-400 mt-4">No leads found. Please upload them in the Leads Manager first.</p> : null}
              {leads.map(lead => (
                <div key={lead.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors border border-transparent hover:border-white/[0.08] ${selectedLeads.includes(lead.id) ? 'bg-primary/5 border-primary/20' : 'hover:bg-white/[0.06]'}`}>
                  <Checkbox className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-white" id={`lead-${lead.id}`} checked={selectedLeads.includes(lead.id)} onCheckedChange={() => toggleLead(lead.id)} />
                  <label htmlFor={`lead-${lead.id}`} className="text-sm cursor-pointer flex-1 flex justify-between items-center text-slate-200">
                    <span className="font-medium text-white flex items-center gap-2">
                      {lead.name}
                      <span className="text-slate-400 font-normal">{lead.email}</span>
                      {lead.isMetaAdLead && (
                        <Badge className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5">
                          Meta Ad Lead
                        </Badge>
                      )}
                    </span>
                    {lead.previewUrl && <LinkIcon className="h-3 w-3 text-primary" />}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SMTP */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white flex items-center mb-2"><Settings className="w-5 h-5 mr-3 text-primary" /> Sender Accounts</h3>
            <p className="text-slate-300 text-sm mb-6">Select SMTP Accounts to process the emails via Round-Robin.</p>
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-5 mb-6 flex justify-between items-center shadow-inner">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-1">SMTP Health</span>
                <span className="text-3xl font-extrabold text-white">{selectedAccounts.length} <span className="text-lg text-slate-300 font-normal">accounts active</span></span>
                <span className="text-xs text-emerald-500 mt-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Safe to send {selectedAccounts.length * 100} emails/day</span>
              </div>
            </div>
            <div className="space-y-4 flex-1 max-h-[300px] overflow-y-auto w-full">
              {accounts.length === 0 && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">No SMTP accounts added yet. Please add them in SMTP Manager.</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map(acc => {
                  const isSelected = selectedAccounts.includes(acc.id);
                  return (
                    <div key={acc.id} onClick={() => toggleAccount(acc.id)} className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.15)]' : 'border-white/10 bg-[#07090e] hover:border-white/30'}`}>
                      <Checkbox className="mr-4 pointer-events-none data-[state=checked]:bg-primary" checked={isSelected} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{acc.email}</span>
                        <Badge variant="outline" className="w-fit mt-1 text-[10px] bg-white/[0.04] border-white/10 text-slate-300 uppercase tracking-widest">{acc.provider}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 border-t border-white/[0.08] pt-6 grid grid-cols-2 gap-6 items-end">
              <div className="space-y-3">
                <Label className="text-white">Delay between emails</Label>
                <div className="flex items-center">
                  <Input type="number" min="1" className="bg-[#07090e] border-white/10 text-white w-24 mr-3" value={delay} onChange={e => setDelay(parseInt(e.target.value))} />
                  <span className="text-sm text-slate-400">Seconds</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/[0.04] p-4 rounded-lg border border-white/10">
                <Checkbox id="useGreeting" className="data-[state=checked]:bg-primary" checked={useGreeting} onCheckedChange={(c) => setUseGreeting(c as boolean)} />
                <label htmlFor="useGreeting" className="text-sm font-medium leading-none text-white cursor-pointer">Auto-Prepend "Dear [Name],"</label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TEMPLATE */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center"><FileText className="w-5 h-5 mr-3 text-primary" /> Template & Details</h3>
            <div className="space-y-6">
              {/* Marketplace Template Attachment */}
              {marketplaceTemplate ? (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Marketplace Template Attached</p>
                    <p className="text-sm font-semibold text-white truncate">{marketplaceTemplate.templateName}</p>
                    <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{marketplaceTemplate.previewLinkPattern}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs text-slate-300 hover:text-white gap-1" onClick={() => window.open(marketplaceTemplate.previewUrl, '_blank')}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Badge className="capitalize text-[10px] bg-white/[0.04] text-slate-300 border border-white/10">{marketplaceTemplate.niche}</Badge>
                  </div>
                </div>
              ) : (
                <div className="bg-[#07090e] border border-dashed border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <Store className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <p className="text-sm text-slate-400 flex-1">No marketplace template attached yet.</p>
                  <Button size="sm" variant="outline" className="text-xs border-white/10 text-slate-200 hover:bg-white/[0.06] gap-1.5" onClick={() => window.open('/dashboard/templates', '_blank')}>
                    <Store className="h-3.5 w-3.5" />
                    Browse Marketplace
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-slate-300">Internal Campaign Name</Label>
                <Input className="bg-[#07090e] border-white/10 text-white h-12 text-lg focus-visible:ring-primary" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q4 Master Outreach" />
              </div>
              
              <div className="space-y-3 mb-4">
                <Label className="text-slate-300 mb-1 block">Select Template Design</Label>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                  {templates.length === 0 && <p className="text-sm text-slate-400">No templates available. Create one first.</p>}
                  {templates.map(t => {
                    const isSelected = selectedTemplateId === t.id;
                    return (
                      <div key={t.id} onClick={() => setSelectedTemplateId(t.id)} className={`p-5 rounded-xl cursor-pointer border transition-all duration-200 flex flex-col items-center justify-center text-center ${isSelected ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.15)] scale-105' : 'border-white/10 bg-[#07090e] hover:border-white/30 text-slate-300 hover:text-white hover:scale-105'}`}>
                        <FileText className={`h-8 w-8 mb-3 transition-colors ${isSelected ? 'text-primary' : 'opacity-50'}`} />
                        <span className="font-semibold text-sm truncate w-full">{t.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {selectedTemplateId && (
                <div className="mt-6 pt-6 border-t border-white/[0.08] animate-in fade-in duration-500">
                  <Label className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Live Preview Data Match</Label>
                  <div className="bg-[#07090e] border border-white/10 rounded-xl p-4 shadow-inner">
                    <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                      "Subject: {templates.find(t=>t.id===selectedTemplateId)?.subject.replace('{{business_name}}', leads.find(l=>selectedLeads.includes(l.id))?.businessName || 'Apple Inc.')}"<br/><br/>
                      Previewing with Lead: <span className="text-white not-italic">{leads.find(l=>selectedLeads.includes(l.id))?.name || 'John Doe'}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & LAUNCH */}
        {step === 4 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 w-full h-full">
            {!sending && !finished && (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="bg-gradient-to-br from-[#111827] to-[#0B0F19] border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center shadow-2xl w-full max-w-lg mb-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  
                  <Mail className="h-20 w-20 text-primary mb-6 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                  <h4 className="text-4xl font-extrabold text-white mb-2 tracking-tight">System Ready</h4>
                  <p className="text-slate-300 mb-2 font-medium text-lg">Launching to <span className="text-white font-bold">{selectedLeads.length}</span> verified leads.</p>
                  <p className="text-sm text-green-400 font-semibold mb-6">📬 Estimated replies: {Math.round(selectedLeads.length * 0.05)}–{Math.round(selectedLeads.length * 0.15)} businesses may respond</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-background/50 border border-white/[0.08] rounded-xl p-4">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Time</span>
                      <p className="text-xl font-bold text-white mt-1">~{Math.ceil((selectedLeads.length * delay) / 60)} min</p>
                    </div>
                    <div className="bg-background/50 border border-white/[0.08] rounded-xl p-4">
                      <span className="text-xs text-amber-500/80 uppercase font-bold tracking-wider">Credits Reqd</span>
                      <p className="text-xl font-bold text-amber-400 mt-1">{selectedLeads.length}</p>
                    </div>
                  </div>

                  <Button size="lg" className="h-14 px-12 border-0 text-lg font-bold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80 text-white shadow-[0_0_40px_rgba(var(--primary),0.4)] transition-all transform hover:scale-110 duration-300 w-full rounded-xl" onClick={startCampaign}>
                    <Rocket className="mr-3 h-6 w-6" /> Reach New Clients Now
                  </Button>
                </div>

                {/* Demo Campaign */}
                <div className="w-full max-w-lg bg-white/3 border border-dashed border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-xs text-slate-400 mb-3">Don't have SMTP set up? Try a simulated run first.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-2 font-semibold"
                    onClick={runDemoCampaign}
                  >
                    <Zap className="h-4 w-4" /> Try Demo Campaign (No SMTP needed)
                  </Button>
                </div>
              </div>
            )}

            {(sending || finished) && (
              <div className="flex-1 flex flex-col md:flex-row gap-6 w-full h-full min-h-[400px]">
                {/* LEFT PANE: Progress */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="bg-[#07090e] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <h4 className="text-xl font-bold text-white mb-6">Live Progress</h4>
                    
                    <div className="flex items-center justify-center mb-8 relative">
                      <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                        <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                        <path className="text-primary drop-shadow-[0_0_5px_rgba(var(--primary),1)] transition-all duration-1000" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progress}, 100`} />
                      </svg>
                      <div className="absolute flex items-center justify-center flex-col">
                        <span className="text-3xl font-extrabold text-white">{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-center bg-white/[0.04] p-3 rounded-lg border border-white/[0.08]">
                        <span className="text-sm font-medium text-emerald-400">Successfully Sent</span>
                        <span className="font-bold text-white text-lg">{stats.sent}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/[0.04] p-3 rounded-lg border border-white/[0.08]">
                        <span className="text-sm font-medium text-red-400">Failed / Bounced</span>
                        <span className="font-bold text-white text-lg">{stats.failed}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/[0.04] p-3 rounded-lg border border-white/[0.08]">
                        <span className="text-sm font-medium text-slate-300">Remaining Queue</span>
                        <span className="font-bold text-slate-100 text-lg">{stats.total - (stats.sent + stats.failed)}</span>
                      </div>
                    </div>

                    {!finished && (
                      <div className="mt-auto pt-4 flex gap-2">
                        <Button variant="outline" className={`flex-1 border-white/10 hover:bg-white/[0.06] ${isPaused ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20' : 'bg-[#0f1422] text-white'}`} onClick={() => setIsPaused(!isPaused)}>
                          {isPaused ? <><Play className="w-4 h-4 mr-2" /> Resume</> : <><div className="w-3 h-3 border-l-2 border-r-2 border-white mr-2" /> Pause</>}
                        </Button>
                      </div>
                    )}
                    {!sending && !finished && (
                      <div className="mt-2">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:opacity-90 font-semibold gap-2" onClick={resumeCampaign}>
                          <Play className="w-4 h-4" /> Resume Stuck Campaign
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT PANE: Live Terminal */}
                <div className="w-full md:w-2/3 bg-[#090C15] border border-white/[0.08] rounded-2xl shadow-xl flex flex-col overflow-hidden relative group">
                  <div className="bg-[#0f1422] p-3 border-b border-white/[0.08] flex items-center gap-2">
                    <div className="flex gap-1.5 ml-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-slate-300 font-mono ml-4 font-semibold">~/server/logs/stdout</span>
                  </div>
                  
                  <div className="p-5 font-mono text-xs overflow-y-auto space-y-3 leading-relaxed h-[420px]">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex items-start transition-opacity duration-300 ${log.status === 'error' ? 'text-red-400' : log.status === 'success' ? 'text-emerald-400' : 'text-cyan-300'}`}>
                        <span className="mr-3 opacity-50 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
                        <span className="break-all font-medium tracking-wide">
                          <span className="opacity-50 mr-2">{log.status === 'error' ? '[ERR]' : log.status === 'success' ? '[OK]' : '[SYS]'}</span>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    {sending && !isPaused && (
                      <div className="flex items-center text-slate-400 mt-4 animate-pulse">
                        <span className="mr-3 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <div className="h-3 w-2 bg-primary/70 animate-bounce" />
                      </div>
                    )}
                    {isPaused && (
                      <div className="flex items-center text-amber-500 mt-4 font-bold">
                        <span className="mr-3 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span>[WARN] Engine paused by user...</span>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer */}
        <div className="mt-8 border-t border-white/[0.08] pt-6 flex justify-between">
          <Button variant="ghost" className={`${step === 1 || sending || finished ? 'opacity-0 pointer-events-none' : 'opacity-100'} text-slate-300 hover:text-white transition-opacity`} onClick={prevStep}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < 4 && (
            <Button className="bg-white text-black hover:bg-slate-200 px-8 font-semibold" onClick={nextStep}>
              Next Step <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* ✅ POST-CAMPAIGN RESULT MODAL — Enhanced */}
      {showResultModal && (
        <ResultModal
          stats={stats}
          isDemoMode={isDemoMode}
          onClose={() => setShowResultModal(false)}
          onFollowUp={() => { setShowResultModal(false); router.push('/dashboard/campaigns/new'); }}
          onViewCampaigns={() => { setShowResultModal(false); router.push('/dashboard/campaigns'); }}
        />
      )}
    </div>
  );
}
