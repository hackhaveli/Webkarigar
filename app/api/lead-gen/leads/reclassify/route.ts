import { NextResponse } from 'next/server';
import { supabase } from '@/lib/lead-gen/supabase';
import { classifyAds } from '@/lib/lead-gen/gemini';

export async function POST() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
  }

  try {
    const { data: rawAds, error: fetchError } = await (supabase
      .from('raw_ads') as any)
      .select('id, page_name, ad_text, cta_link, niche');

    if (fetchError) throw fetchError;

    const spamIds: string[] = [];
    (rawAds || []).forEach((ad: any) => {
      const pageName = (ad.page_name || '').toLowerCase();
      const adText = (ad.ad_text || '').toLowerCase();
      const ctaLink = (ad.cta_link || '').toLowerCase();

      const isSpam =
        pageName.includes('dramabox') || pageName.includes('drama') ||
        pageName.includes('novel') || pageName.includes('story') ||
        pageName.includes('channel') || pageName.startsWith('ns-') ||
        adText.includes('werewolf') || adText.includes('mating bond') ||
        adText.includes('alpha mate') || adText.includes('suger mommy') ||
        adText.includes('sugermommy') || adText.includes('luna') ||
        adText.includes('chapters') ||
        ctaLink.includes('h5short.com') || ctaLink.includes('netshort.com') ||
        ctaLink.includes('argbook.com') || ctaLink.includes('moboreader.com') ||
        ctaLink.includes('goodnovel.com');

      if (isSpam) spamIds.push(ad.id);
    });

    let prunedCount = 0;
    if (spamIds.length > 0) {
      const { error: deleteError } = await (supabase
        .from('raw_ads') as any)
        .delete()
        .in('id', spamIds);
      if (deleteError) throw deleteError;
      prunedCount = spamIds.length;
    }

    const { error: deleteLeadsError } = await (supabase
      .from('leads') as any)
      .delete()
      .eq('status', 'pending');
    if (deleteLeadsError) throw deleteLeadsError;

    const { data: remainingRawAds } = await (supabase
      .from('raw_ads') as any)
      .select('id, niche');

    const { data: existingLeads } = await (supabase
      .from('leads') as any)
      .select('raw_ad_id');

    const leadIdsSet = new Set((existingLeads || []).map((l: any) => l.raw_ad_id));
    const unclassifiedAds = (remainingRawAds || []).filter((ad: any) => !leadIdsSet.has(ad.id));

    const nicheSet = new Set(unclassifiedAds.map((ad: any) => ad.niche));
    const nichesToClassify = Array.from(nicheSet) as string[];
    let classifiedCount = 0;

    for (const niche of nichesToClassify) {
      const stats = await classifyAds(niche, 15);
      classifiedCount += stats.total;
    }

    return NextResponse.json({
      success: true,
      pruned: prunedCount,
      classified: classifiedCount,
    });
  } catch (err: any) {
    console.error('Reclassify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
