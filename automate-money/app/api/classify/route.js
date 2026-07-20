import { NextResponse } from 'next/server';
import { classifyAds } from '../../../lib/gemini.js';
import { NICHES } from '../../../lib/constants.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { niche, batchSize = 10 } = body;

    if (!niche || !NICHES[niche]) {
      return NextResponse.json(
        { error: `Invalid niche. Available: ${Object.keys(NICHES).join(', ')}` },
        { status: 400 }
      );
    }

    const stats = await classifyAds(niche, batchSize);

    return NextResponse.json({
      success: true,
      niche,
      stats,
    });
  } catch (err) {
    console.error('Classify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
