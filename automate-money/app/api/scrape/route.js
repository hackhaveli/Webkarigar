import { NextResponse } from 'next/server';
import { scrapeAndStore } from '../../../lib/apify.js';
import { NICHES } from '../../../lib/constants.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { niche, keywords, country = 'IN', maxItems = 200 } = body;

    if (!niche || !NICHES[niche]) {
      return NextResponse.json(
        { error: `Invalid niche. Available: ${Object.keys(NICHES).join(', ')}` },
        { status: 400 }
      );
    }

    // Use niche defaults if no keywords provided
    const searchKeywords = keywords || NICHES[niche].searchKeywords;

    const stats = await scrapeAndStore(niche, searchKeywords, country, { maxItems });

    return NextResponse.json({
      success: true,
      niche,
      stats,
    });
  } catch (err) {
    console.error('Scrape API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
