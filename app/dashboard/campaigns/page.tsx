'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Activity, CheckCircle2, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageGuide } from '@/components/dashboard/PageGuide';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'running' | 'complete' | 'failed';
  total: number;
  sent: number;
  failed: number;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (res.ok) setCampaigns(data.campaigns || []);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <Badge className="bg-blue-500 hover:bg-blue-600"><Activity className="h-3 w-3 mr-1 animate-pulse" /> Running</Badge>;
      case 'complete': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Complete</Badge>;
      case 'failed': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default: return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground mt-2">Create and track your email marketing outreach.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="h-4 w-4 mr-2" /> New Campaign
          </Link>
        </Button>
      </div>

      <PageGuide title="What are campaigns?">
        <p>Campaigns are email outreach sequences. You select leads, pick a website template and email template, choose your sending SMTP accounts, and launch. Each lead gets a personalized email with a preview of their potential website.</p>
        <p><strong>Workflow:</strong> Add SMTP → Import/Find leads → Pick website template → Create email template → Launch campaign. Check back in 24–48 hours for replies.</p>
        <p>Start with a small test campaign (10–20 leads) to gauge response rates before scaling up.</p>
      </PageGuide>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>A history of all your sent and drafted campaigns.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg flex flex-col items-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-1">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start reaching out to your leads today.</p>
              <Button asChild>
                <Link href="/dashboard/campaigns/new">Create First Campaign</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Sent / Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell className="font-medium">{camp.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{camp.subject}</TableCell>
                    <TableCell>{getStatusBadge(camp.status)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-secondary rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${camp.status === 'failed' ? 'bg-destructive' : 'bg-primary'}`} 
                          style={{ width: `${camp.total > 0 ? ((camp.sent + camp.failed) / camp.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span className="text-green-500 font-medium">{camp.sent}</span>
                      {camp.failed > 0 && <span className="text-destructive ml-1">({camp.failed} failed)</span>}
                      {' '} / {camp.total}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/campaigns/${camp.id}`} title="View Campaign">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
