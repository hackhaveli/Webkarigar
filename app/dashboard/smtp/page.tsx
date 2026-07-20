'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Trash2, Mail, Server, Info, Search, Key, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageGuide } from '@/components/dashboard/PageGuide';

interface SmtpAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook';
  createdAt: string;
}

import { SmtpHealthGraphic } from '@/components/dashboard/illustrations/SubsectionIllustrations';

export default function SmtpPage() {
  const [accounts, setAccounts] = useState<SmtpAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState<'gmail' | 'outlook'>('gmail');
  const [adding, setAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Test functionality
  const [testingAll, setTestingAll] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; error?: string }>>({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/smtp');
      const data = await res.json();
      if (res.ok) setAccounts(data.accounts || []);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAdding(true);
    try {
      const res = await fetch('/api/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider }),
      });
      if (res.ok) {
        setAccounts([...accounts, await res.json()]);
        setEmail('');
        setPassword('');
        setIsModalOpen(false);
        toast.success('SMTP Account added successfully!');
      } else {
        toast.error('Failed to add account');
      }
    } catch {
      toast.error('Network error during connection test');
    } finally {
      setAdding(false);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      const res = await fetch('/api/smtp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAccounts(accounts.filter((a) => a.id !== id));
        toast.success('SMTP account removed.');
      } else {
        toast.error('Failed to delete account');
      }
    } catch {
        toast.error('Network error');
    }
  };

  const testAllAccounts = async () => {
    if (accounts.length === 0) return;
    setTestingAll(true);
    setTestResults({});
    toast.info('Testing all SMTP connections...');
    try {
      const res = await fetch('/api/smtp/test', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.results) {
        const newResults: Record<string, { ok: boolean; error?: string }> = {};
        let successCount = 0;
        let failCount = 0;
        data.results.forEach((r: any) => {
          newResults[r.id] = { ok: r.ok, error: r.error };
          if (r.ok) successCount++;
          else failCount++;
        });
        setTestResults(newResults);
        if (failCount === 0) {
          toast.success(`All ${successCount} accounts connected successfully!`);
        } else {
          toast.warning(`${successCount} passed, ${failCount} failed.`);
        }
      } else {
        toast.error('Failed to run tests');
      }
    } catch {
      toast.error('Network error running tests');
    } finally {
      setTestingAll(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-slide-up">
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-br from-[#0c1022] via-[#070a14] to-[#030611] border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> Mail Server Infrastructure
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              SMTP Accounts & Relay
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
              Connect your Gmail, Outlook, or private domain mailboxes. WebKarigar sends personalized outreach emails using your connected mail servers for maximum deliverability.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs h-10 px-5 shadow-lg shadow-indigo-600/30 cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" /> Add SMTP Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#0f1422] border-white/[0.08] text-white font-sans">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center"><Server className="w-5 h-5 mr-3 text-primary" /> New Connection</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Connect an external mailbox to start dispatching sequence emails natively.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addAccount} className="space-y-5 py-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200 font-semibold text-sm">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-[#131929] border-white/[0.08] text-white placeholder:text-slate-500 focus-visible:ring-violet-500 h-10" required placeholder="you@domain.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-slate-200 font-semibold text-sm">App Password</Label>
                        <a href={provider === 'outlook' ? "https://support.microsoft.com/account-billing/manage-app-passwords-for-two-step-verification-d6dc8c6d-4bf7-4851-ad95-6d07799387e9" : "https://support.google.com/accounts/answer/185833"} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">How to generate?</a>
                      </div>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-[#131929] border-white/[0.08] text-white placeholder:text-slate-500 focus-visible:ring-violet-500 h-10" required placeholder="••••••••••••" />
                      </div>
                      <p className="text-xs text-amber-500/80 mt-1 flex items-start bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        <AlertCircle className="h-4 w-4 mr-1.5 shrink-0 mt-0.5" /> Google/Microsoft require an "App Password" instead of your raw account login.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200 font-semibold text-sm">Mail Provider</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          onClick={() => setProvider('gmail')} 
                          className={`cursor-pointer border rounded-lg p-3 text-center transition-all duration-200 font-semibold ${provider === 'gmail' ? 'border-violet-500/40 bg-violet-500/15 text-white shadow-[0_0_12px_rgba(139,92,246,0.1)]' : 'border-white/[0.08] bg-[#131929] hover:border-white/20 text-slate-300'}`}
                        >
                          Google Workspace
                        </div>
                        <div 
                          onClick={() => setProvider('outlook')} 
                          className={`cursor-pointer border rounded-lg p-3 text-center transition-all duration-200 font-semibold ${provider === 'outlook' ? 'border-violet-500/40 bg-violet-500/15 text-white shadow-[0_0_12px_rgba(139,92,246,0.1)]' : 'border-white/[0.08] bg-[#131929] hover:border-white/20 text-slate-300'}`}
                        >
                          Outlook / O365
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 mt-2 border-t border-white/10">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.04] mt-2 sm:mt-0 cursor-pointer">Cancel</Button>
                      <Button type="submit" disabled={adding} className="bg-primary hover:bg-primary/90 text-white">
                        {adding ? 'Connecting...' : 'Test & Connect'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {accounts.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={testAllAccounts} 
                  disabled={testingAll}
                  className="border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white font-bold text-xs h-10 cursor-pointer"
                >
                  {testingAll ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2 text-emerald-400" />}
                  Test All Connections
                </Button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <SmtpHealthGraphic className="w-full h-44" />
          </div>
        </div>
      </div>

      <PageGuide title="Why do I need SMTP?">
        <p>SMTP accounts are your email "senders" — Gmail or Outlook accounts that deliver your campaign emails. Without at least one connected account, you cannot send outreach.</p>
        <p><strong>Recommendation:</strong> Create a dedicated Gmail account (e.g. <em>yourbusiness@gmail.com</em>) and generate an <strong>App Password</strong> from Google's security settings. Add it below. Each account can safely send ~100 cold emails/day.</p>
        <p>To scale to thousands of leads, add multiple SMTP accounts — the system automatically rotates between them to protect deliverability.</p>
      </PageGuide>

      <div className="flex-1">
        {loading ? (
          <div className="p-12 text-center text-slate-500 italic animate-fade-in">Fetching connected identities...</div>
        ) : accounts.length === 0 ? (
          <div className="border border-dashed border-white/[0.1] rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-[#0f1422]/50 mt-4 animate-fade-in">
            <div className="bg-blue-500/10 p-6 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <Server className="h-12 w-12 text-blue-400 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No SMTP Accounts Connected</h3>
            <p className="text-slate-300 max-w-md mb-8">You need to connect at least one external email account (Gmail or Outlook) down into the WebKarigar engine before you can launch any outreach.</p>
            <Button size="lg" className="bg-white text-black hover:bg-slate-200 font-bold cursor-pointer" onClick={() => setIsModalOpen(true)}>
              Connect First Account
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4 mb-6 shadow-inner animate-in fade-in">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-500 font-bold mb-1">Gmail / Outlook Sending Limits</h4>
                <p className="text-amber-500/80 text-sm leading-relaxed">
                  Avoid sending more than <strong className="text-amber-400">100-150 cold emails per day</strong> per account. Our engine supports adding unlimited SMTP accounts. To scale safely, add multiple accounts and the system will automatically round-robin between them to protect your spam reputation.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-[#0f1422] border border-white/[0.08] rounded-2xl p-6 relative group hover:border-violet-500/30 transition-all duration-300 shadow-lg overflow-hidden flex flex-col justify-between h-[180px] card-glow cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#131929] border border-white/[0.08] flex items-center justify-center relative">
                      <Mail className="h-5 w-5 text-slate-400" />
                      {testResults[acc.id] && (
                        <div className="absolute -top-1 -right-1 bg-[#07090e] rounded-full">
                          {testResults[acc.id].ok ? 
                            <CheckCircle className="h-4 w-4 text-emerald-500 bg-[#07090e] rounded-full" /> : 
                            <XCircle className="h-4 w-4 text-red-500 bg-[#07090e] rounded-full" />
                          }
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-md truncate w-40">{acc.email}</h4>
                      <Badge variant="outline" className="mt-1 text-[10px] bg-white/[0.04] text-slate-400 border-white/[0.08] font-mono tracking-wider">{acc.provider}</Badge>
                    </div>
                  </div>
                  {testResults[acc.id] && !testResults[acc.id].ok ? (
                    <Badge variant="secondary" className="bg-red-500/10 text-red-400 border border-red-500/20 shrink-0 h-7 px-3 text-xs cursor-help" title={testResults[acc.id].error}>
                      ❌ Failed
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none shrink-0 h-7 px-3 text-xs">
                      ✅ Connected
                    </Badge>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-emerald-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[0%]" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">0 / 100 sent today</span>
                </div>

                <div className="border-t border-white/[0.06] pt-4 mt-6 flex justify-between items-center z-10">
                  <span className="text-xs text-slate-500 font-medium">Added {new Date(acc.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-white/[0.06] text-slate-400 hover:text-white cursor-pointer transition-colors duration-200"
                      onClick={() => toast.info(`Account: ${acc.email}`, { description: `Provider: ${acc.provider}. System routing is active for this identity.` })}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors duration-200 cursor-pointer" onClick={() => deleteAccount(acc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
