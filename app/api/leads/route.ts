import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/lead-gen/supabase';

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5000');
  const skip = (page - 1) * limit;

  const [dbLeads, totalDb] = await Promise.all([
    prisma.lead.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where: { userId: user.id } }),
  ]);

  let metaAdLeads: any[] = [];
  try {
    if (supabase) {
      const { data, error } = await (supabase.from('leads') as any)
        .select('*')
        .not('email', 'is', null)
        .limit(1000);

      if (!error && Array.isArray(data)) {
        metaAdLeads = data
          .map((m) => {
            const email = m.email || (Array.isArray(m.emails) && m.emails[0]) || null;
            if (!email) return null;
            const businessName = m.business_name || 'Business Lead';
            const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
              id: `meta-${m.id}`,
              name: businessName,
              email: email.toLowerCase().trim(),
              businessName: businessName,
              niche: m.niche || 'Meta Ad Lead',
              previewUrl: `https://webkarigar.com/preview/${slug}`,
              isMetaAdLead: true,
              createdAt: m.created_at || new Date().toISOString(),
            };
          })
          .filter(Boolean);
      }
    }
  } catch (err) {
    console.error('Failed to fetch Meta Ad leads for campaign view:', err);
  }

  // Deduplicate by email
  const existingEmails = new Set(dbLeads.map((l) => l.email.toLowerCase().trim()));
  const uniqueMetaLeads = metaAdLeads.filter(
    (ml) => !existingEmails.has(ml.email.toLowerCase().trim())
  );

  const combinedLeads = [...dbLeads, ...uniqueMetaLeads];

  return NextResponse.json({
    leads: combinedLeads,
    total: totalDb + uniqueMetaLeads.length,
    page,
    limit,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { name, email, businessName, niche } = await req.json();
  if (!name || !email) return NextResponse.json({ error: 'name and email required' }, { status: 400 });

  const slug = (businessName || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const previewUrl = `https://webkarigar.com/preview/${slug}`;

  const lead = await prisma.lead.create({
    data: {
      userId: user.id,
      name,
      email: email.toLowerCase().trim(),
      businessName: businessName || name,
      niche,
      previewUrl,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { id, ids } = await req.json();
  if (ids && Array.isArray(ids)) {
    const dbIds = ids.filter((i: string) => !i.startsWith('meta-'));
    if (dbIds.length > 0) {
      await prisma.lead.deleteMany({ where: { id: { in: dbIds }, userId: user.id } });
    }
  } else if (id && !id.startsWith('meta-')) {
    await prisma.lead.deleteMany({ where: { id, userId: user.id } });
  }

  return NextResponse.json({ ok: true });
}
