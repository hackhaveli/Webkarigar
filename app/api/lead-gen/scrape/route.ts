import { NextResponse } from 'next/server';
import { scrapeAndStore } from '@/lib/lead-gen/apify';
import { NICHES } from '@/lib/lead-gen/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { niche, keywords, country = 'IN', maxItems = 200 } = body;

    if (!niche || !(NICHES as any)[niche]) {
      const available = Object.keys(NICHES).join(', ');
      return NextResponse.json(
        { error: `Invalid niche. Available: ${available}` },
        { status: 400 }
      );
    }

    const searchKeywords = keywords || (NICHES as any)[niche].searchKeywords;
    const stats = await scrapeAndStore(niche, searchKeywords, country, { maxItems });

    return NextResponse.json({ success: true, niche, stats });
  } catch (err: any) {
    console.error('Scrape API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
