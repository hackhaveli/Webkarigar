import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/lead-gen/supabase';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const { leadIds, importAllWithEmail } = await req.json();

    let metaLeadsToImport: any[] = [];

    if (supabase) {
      if (importAllWithEmail) {
        const { data, error } = await (supabase.from('leads') as any)
          .select('*')
          .not('email', 'is', null)
          .limit(1000);
        if (!error && data) {
          metaLeadsToImport = data;
        }
      } else if (Array.isArray(leadIds) && leadIds.length > 0) {
        const { data, error } = await (supabase.from('leads') as any)
          .select('*')
          .in('id', leadIds);
        if (!error && data) {
          metaLeadsToImport = data;
        }
      }
    }

    if (metaLeadsToImport.length === 0) {
      return NextResponse.json(
        { error: 'No qualified Meta Ad leads with emails were found to import.' },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let duplicateCount = 0;

    for (const item of metaLeadsToImport) {
      const email = item.email || (Array.isArray(item.emails) && item.emails[0]) || null;
      if (!email) continue;

      const businessName = item.business_name || 'Business Partner';
      const niche = item.niche || 'general';
      const previewUrl = `https://webkarigar.com/preview/${encodeURIComponent(
        businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      )}`;

      // Check if lead already exists for this user
      const existing = await prisma.lead.findFirst({
        where: {
          userId: user.id,
          email: email.toLowerCase().trim(),
        },
      });

      if (existing) {
        duplicateCount++;
        continue;
      }

      await prisma.lead.create({
        data: {
          userId: user.id,
          name: businessName,
          email: email.toLowerCase().trim(),
          businessName: businessName,
          niche: niche,
          previewUrl: previewUrl,
        },
      });

      createdCount++;
    }

    return NextResponse.json({
      success: true,
      imported: createdCount,
      duplicates: duplicateCount,
      totalProcessed: metaLeadsToImport.length,
    });
  } catch (error: any) {
    console.error('Error importing Meta Ad leads to main outreach:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import Meta Ad leads' },
      { status: 500 }
    );
  }
}
