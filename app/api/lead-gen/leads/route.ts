import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LEADS_PER_PAGE } from '@/lib/lead-gen/constants';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get('niche');
    const isLead = searchParams.get('is_lead');
    const confidence = searchParams.get('confidence');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(LEADS_PER_PAGE));

    const where: any = {};
    if (niche) where.niche = niche;
    if (isLead !== null && isLead !== '') where.isLead = isLead === 'true';
    if (confidence) where.confidence = confidence;
    if (status) where.status = status;
    if (search) where.businessName = { contains: search, mode: 'insensitive' };

    const skip = (page - 1) * limit;

    const [leads, count] = await Promise.all([
      prisma.aILead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          rawAd: true,
        },
      }),
      prisma.aILead.count({ where }),
    ]);

    const formattedLeads = leads.map((lead) => {
      const emails = new Set<string>();
      if (lead.email) emails.add(lead.email.toLowerCase());
      if (Array.isArray(lead.emails)) {
        lead.emails.forEach((e) => emails.add(e.toLowerCase()));
      }
      if (lead.adText) {
        const matches = lead.adText.match(EMAIL_REGEX);
        if (matches) matches.forEach((e) => emails.add(e.toLowerCase()));
      }
      const emailList = Array.from(emails);

      return {
        id: lead.id,
        niche: lead.niche,
        business_name: lead.businessName,
        phone: lead.phone,
        city: lead.city,
        has_website: lead.hasWebsite,
        cta_link: lead.ctaLink,
        ad_text: lead.adText,
        is_lead: lead.isLead,
        confidence: lead.confidence,
        rejection_reason: lead.rejectionReason,
        slug: lead.slug,
        demo_links: lead.demoLinks,
        message_draft: lead.messageDraft,
        status: lead.status,
        email: emailList[0] || null,
        emails: emailList,
        raw_ads: lead.rawAd
          ? {
              page_id: lead.rawAd.pageId,
              page_name: lead.rawAd.pageName,
              raw_json: lead.rawAd.rawJson,
            }
          : null,
        created_at: lead.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      leads: formattedLeads,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err: any) {
    console.error('Leads GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.phone !== undefined) data.phone = updates.phone;
    if (updates.business_name !== undefined) data.businessName = updates.business_name;
    if (updates.message_draft !== undefined) data.messageDraft = updates.message_draft;

    const updated = await prisma.aILead.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    console.error('Leads PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, ids } = body;

    if (ids && Array.isArray(ids)) {
      await prisma.aILead.deleteMany({ where: { id: { in: ids } } });
    } else if (id) {
      await prisma.aILead.deleteMany({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Leads DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
