import { NextResponse } from 'next/server';
import { enrichLeads } from '@/lib/lead-gen/enrich';
import { NICHES } from '@/lib/lead-gen/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { niche } = body;

    if (!niche || !(NICHES as any)[niche]) {
      const available = Object.keys(NICHES).join(', ');
      return NextResponse.json(
        { error: `Invalid niche. Available: ${available}` },
        { status: 400 }
      );
    }

    const stats = await enrichLeads(niche);

    return NextResponse.json({ success: true, niche, stats });
  } catch (err: any) {
    console.error('Enrich API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
