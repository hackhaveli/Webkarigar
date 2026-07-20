'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle2, XCircle, ArrowLeft, RotateCw, Play, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [resumeLogs, setResumeLogs] = useState<string[]>([]);
  const [isStalled, setIsStalled] = useState(false);
  const lastSentRef = useRef<number>(0);
  const stallCheckRef = useRef<any>(null);

  const fetchCampaign = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (res.ok) {
        const found = data.campaigns?.find((c: any) => c.id === id);
        setCampaign(found || null);

        // Stall detection: if status is "running" but sent count hasn't changed in 30s
        if (found && found.status === 'running') {
          const currentSent = (found.sent || 0) + (found.failed || 0);
          if (currentSent === lastSentRef.current) {
            setIsStalled(true);
          } else {
            setIsStalled(false);
            lastSentRef.current = currentSent;
          }
        } else {
          setIsStalled(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchCampaign, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleResume = async () => {
    setResuming(true);
    setResumeLogs(['Starting resume...']);
    setIsStalled(false);
    
    try {
      const res = await fetch('/api/campaign/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: id }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Resume failed');
        setResumeLogs(prev => [...prev, `Error: ${err.error}`]);
        setResuming(false);
        return;
      }

      // If it's a JSON response (already complete)
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await res.json();
        toast.success(data.message || 'Campaign completed');
        setResuming(false);
        fetchCampaign();
        return;
      }

      // Stream response
      if (!res.body) { setResuming(false); return; }
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
                setResumeLogs(prev => [...prev.slice(-50), `✓ Sent to ${data.email}`]);
                setCampaign((prev: any) => prev ? { ...prev, sent: data.sent, failed: data.failed } : prev);
              } else if (data.status === 'error') {
                setResumeLogs(prev => [...prev.slice(-50), `✗ Failed: ${data.email} — ${data.error}`]);
                setCampaign((prev: any) => prev ? { ...prev, sent: data.sent, failed: data.failed } : prev);
              } else if (data.status === 'complete') {
                setResumeLogs(prev => [...prev, `🎉 Campaign completed! Sent: ${data.sent}, Failed: ${data.failed}`]);
                setCampaign((prev: any) => prev ? { ...prev, sent: data.sent, failed: data.failed, status: 'complete' } : prev);
                setResuming(false);
                toast.success('Campaign resumed and completed!');
              }
            } catch (err) {}
          });
        }
      }
      
      setResuming(false);
      fetchCampaign();
    } catch (error) {
      toast.error('Connection lost — press Resume again to continue');
      setResumeLogs(prev => [...prev, `Connection lost: ${String(error)}. Press Resume again.`]);
      setResuming(false);
    }
  };

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!campaign) return <div className="p-8">Campaign not found.</div>;

  const progress = campaign.total > 0 ? ((campaign.sent + campaign.failed) / campaign.total) * 100 : 0;
  const remaining = campaign.total - (campaign.sent + campaign.failed);
  const showResume = (campaign.status === 'running' && !resuming) || isStalled;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/campaigns"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{campaign.name}</h2>
          <p className="text-muted-foreground mt-1">Subject: {campaign.subject}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Campaign Status</CardTitle>
            <div className="flex items-center gap-2">
              {campaign.status === 'running' && !isStalled && (
                <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse">
                  <Activity className="h-3 w-3 mr-1" /> Running
                </Badge>
              )}
              {isStalled && (
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Stalled
                </Badge>
              )}
              {campaign.status === 'complete' && (
                <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Complete</Badge>
              )}
              {campaign.status === 'failed' && (
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
              )}
              {campaign.status === 'draft' && (
                <Badge variant="secondary">Draft</Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {campaign.status === 'running' && !isStalled && "This campaign is currently executing in the background. Stats will automatically refresh."}
            {isStalled && "Campaign appears stalled — the server may have timed out. Click Resume to continue from where it stopped."}
            {campaign.status === 'complete' && "Execution completed."}
            {campaign.status === 'failed' && "Campaign failed. You can try resuming to retry remaining leads."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6 text-center divide-x border rounded-lg py-6 bg-muted/10">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Leads</p>
              <p className="text-3xl font-semibold">{campaign.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1 text-green-500">Successful</p>
              <p className="text-3xl font-semibold text-green-500">{campaign.sent}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1 text-red-500">Failed</p>
              <p className="text-3xl font-semibold text-red-500">{campaign.failed}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">Overall Progress</span>
              <span className="font-bold">{Math.round(progress)}% ({remaining} remaining)</span>
            </div>
            <Progress value={progress} indicatorClassName={campaign.status === 'failed' ? 'bg-destructive' : 'bg-primary'} />
          </div>

          {/* Resume Button — shows when stalled/stuck or campaign status allows it */}
          {showResume && (
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Campaign stalled at {campaign.sent + campaign.failed}/{campaign.total}. {remaining} emails remaining.</span>
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:opacity-90 font-bold gap-2 shadow-lg px-8"
                onClick={handleResume}
                disabled={resuming}
              >
                {resuming ? (
                  <><RotateCw className="h-4 w-4 animate-spin" /> Resuming...</>
                ) : (
                  <><Play className="h-4 w-4" /> Resume Campaign ({remaining} remaining)</>
                )}
              </Button>
            </div>
          )}

          {/* Resume progress when actively resuming */}
          {resuming && (
            <div className="flex justify-center pt-2">
              <span className="text-sm flex items-center text-primary">
                <RotateCw className="h-3 w-3 mr-2 animate-spin" /> Sending remaining emails...
              </span>
            </div>
          )}

          {/* Resume Live Logs */}
          {resumeLogs.length > 0 && (
            <div className="bg-[#090C15] border border-white/5 rounded-xl p-4 max-h-64 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resume Log</p>
              <div className="font-mono text-xs space-y-1">
                {resumeLogs.map((log, i) => (
                  <div key={i} className={`${log.startsWith('✓') ? 'text-emerald-400' : log.startsWith('✗') ? 'text-red-400' : log.startsWith('🎉') ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {campaign.status === 'running' && !showResume && !resuming && (
             <div className="flex justify-center pt-4">
               <span className="text-sm flex items-center text-muted-foreground">
                 <RotateCw className="h-3 w-3 mr-2 animate-spin" /> Fetching live updates from server...
               </span>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
