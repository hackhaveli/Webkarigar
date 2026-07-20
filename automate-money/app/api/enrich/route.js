import { NextResponse } from 'next/server';
import { enrichAllLeads } from '../../../lib/enrich.js';
import { NICHES } from '../../../lib/constants.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { niche } = body;

    if (!niche || !NICHES[niche]) {
      return NextResponse.json(
        { error: `Invalid niche. Available: ${Object.keys(NICHES).join(', ')}` },
        { status: 400 }
      );
    }

    const stats = await enrichAllLeads(niche);

    return NextResponse.json({
      success: true,
      niche,
      stats,
    });
  } catch (err) {
    console.error('Enrich API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
