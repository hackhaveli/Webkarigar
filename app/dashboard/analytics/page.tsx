'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Activity, Mail, XCircle, CheckCircle2 } from 'lucide-react';
import { PageGuide } from '@/components/dashboard/PageGuide';

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });

  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then(res => {
      if (res.campaigns) {
        let sent = 0, failed = 0;
        const chartData = res.campaigns.reverse().map((c: any) => {
          sent += c.sent;
          failed += c.failed;
          return {
            name: c.name.substring(0, 15) + (c.name.length > 15 ? '...' : ''),
            sent: c.sent,
            failed: c.failed,
            total: c.total
          };
        });
        
        setData(chartData);
        setStats({ total: res.campaigns.length, sent, failed });
      }
    });
  }, []);

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-2">Measure the performance of your campaigns.</p>
      </div>

      <PageGuide title="What do these numbers mean?">
        <p><strong>Total Sent</strong> = emails successfully delivered. If this is low, your SMTP may have issues — run "Test Connections" on the SMTP page.</p>
        <p><strong>Bounced/Failed</strong> = emails that didn't deliver (invalid address or SMTP rejection). A &lt;10% failure rate is normal.</p>
        <p><strong>Delivery Rate</strong> = sent / (sent + failed). Aim for 90%+. If lower, verify your SMTP accounts and lead email quality.</p>
        <p>Actual replies come from leads responding to your email — check your inbox for replies, not the analytics page.</p>
      </PageGuide>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{stats.sent}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered emails</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounced/Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed delivery attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.sent + stats.failed > 0 ? Math.round((stats.sent / (stats.sent + stats.failed)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall delivery success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {data.length === 0 ? (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">Not enough data to display chart. run a campaign first!</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sent" fill="#10b981" radius={[4, 4, 0, 0]} name="Successful" />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
