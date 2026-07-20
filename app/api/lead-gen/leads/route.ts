import { NextResponse } from 'next/server';
import { supabase } from '@/lib/lead-gen/supabase';
import { LEADS_PER_PAGE } from '@/lib/lead-gen/constants';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', leads: [], total: 0, page: 1, totalPages: 0 },
      { status: 503 }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get('niche');
    const isLead = searchParams.get('is_lead');
    const confidence = searchParams.get('confidence');
    const status = searchParams.get('status');
    const hasWebsite = searchParams.get('has_website');
    const search = searchParams.get('search');
    const contactType = searchParams.get('contact_type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(LEADS_PER_PAGE));

    let query = supabase
      .from('leads')
      .select('*, raw_ads(page_id, page_name, raw_json)', { count: 'exact' })
      .order('created_at', { ascending: false }) as any;

    if (niche) query = query.eq('niche', niche);
    if (isLead !== null && isLead !== '') query = query.eq('is_lead', isLead === 'true');
    if (confidence) query = query.eq('confidence', confidence);
    if (status) query = query.eq('status', status);
    if (hasWebsite !== null && hasWebsite !== '') query = query.eq('has_website', hasWebsite === 'true');
    if (search) query = query.ilike('business_name', `%${search}%`);

    if (contactType === 'phone') {
      query = query.not('phone', 'is', null).neq('phone', '');
    } else if (contactType === 'email') {
      query = query.like('ad_text', '%@%');
    } else if (contactType === 'both') {
      query = query.not('phone', 'is', null).neq('phone', '').like('ad_text', '%@%');
    } else if (contactType === 'either') {
      query = query.or('phone.not.is.null,ad_text.like.%@%');
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const leadsWithEmails = (data || []).map((lead: any) => {
      const emails = new Set<string>();
      if (lead.ad_text) {
        const matches = lead.ad_text.match(EMAIL_REGEX);
        if (matches) matches.forEach((e: string) => emails.add(e.toLowerCase()));
      }
      if (lead.raw_ads?.raw_json) {
        try {
          const raw = lead.raw_ads.raw_json;
          const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
          const matches = str.match(EMAIL_REGEX);
          if (matches) matches.forEach((e: string) => emails.add(e.toLowerCase()));
        } catch (_) {}
      }
      const emailList = Array.from(emails);
      return { ...lead, email: emailList[0] || null, emails: emailList };
    });

    return NextResponse.json({
      leads: leadsWithEmails,
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
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const allowedFields = ['message_draft', 'status', 'phone', 'business_name', 'slug', 'demo_links'];
    const safeUpdates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key];
      }
    }

    const { data, error } = await (supabase
      .from('leads') as any)
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, lead: data });
  } catch (err: any) {
    console.error('Leads PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { id, ids, selectAllMatching, filters } = body;

    if (!id && (!ids || ids.length === 0) && !selectAllMatching) {
      return NextResponse.json({ error: 'Lead ID or list of IDs or filter is required' }, { status: 400 });
    }

    let query = supabase.from('leads').delete() as any;

    if (selectAllMatching) {
      const { niche, is_lead, confidence, status, has_website, search } = filters || {};
      let hasFilter = false;
      if (niche) { query = query.eq('niche', niche); hasFilter = true; }
      if (is_lead !== null && is_lead !== undefined && is_lead !== '') {
        query = query.eq('is_lead', is_lead === 'true' || is_lead === true);
        hasFilter = true;
      }
      if (confidence) { query = query.eq('confidence', confidence); hasFilter = true; }
      if (status) { query = query.eq('status', status); hasFilter = true; }
      if (has_website !== null && has_website !== undefined && has_website !== '') {
        query = query.eq('has_website', has_website === 'true' || has_website === true);
        hasFilter = true;
      }
      if (search) { query = query.ilike('business_name', `%${search}%`); hasFilter = true; }
      if (!hasFilter) {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }
    } else if (ids && ids.length > 0) {
      query = query.in('id', ids);
    } else {
      query = query.eq('id', id);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Leads DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
