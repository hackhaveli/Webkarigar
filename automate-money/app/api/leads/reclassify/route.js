import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase.js';
import { classifyAds } from '../../../../lib/gemini.js';

export async function POST() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
  }

  try {
    console.log('🧹 Reclassify API triggered. Starting database prune and re-classification.');

    // 1. Fetch all raw ads
    const { data: rawAds, error: fetchError } = await supabase
      .from('raw_ads')
      .select('id, page_name, ad_text, cta_link, niche');

    if (fetchError) throw fetchError;

    // 2. Identify spam ads
    const spamIds = [];
    rawAds.forEach((ad) => {
      const pageName = (ad.page_name || '').toLowerCase();
      const adText = (ad.ad_text || '').toLowerCase();
      const ctaLink = (ad.cta_link || '').toLowerCase();

      const isSpam =
        pageName.includes('dramabox') ||
        pageName.includes('drama') ||
        pageName.includes('novel') ||
        pageName.includes('story') ||
        pageName.includes('channel') ||
        pageName.startsWith('ns-') ||
        adText.includes('werewolf') ||
        adText.includes('mating bond') ||
        adText.includes('alpha mate') ||
        adText.includes('suger mommy') ||
        adText.includes('sugermommy') ||
        adText.includes('luna') ||
        adText.includes('chapters') ||
        ctaLink.includes('h5short.com') ||
        ctaLink.includes('netshort.com') ||
        ctaLink.includes('argbook.com') ||
        ctaLink.includes('moboreader.com') ||
        ctaLink.includes('goodnovel.com');

      if (isSpam) {
        spamIds.push(ad.id);
      }
    });

    console.log(`🧹 Found ${spamIds.length} spam ads to prune.`);

    // 3. Delete spam raw ads (cascades to delete leads)
    let prunedCount = 0;
    if (spamIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('raw_ads')
        .delete()
        .in('id', spamIds);

      if (deleteError) throw deleteError;
      prunedCount = spamIds.length;
    }

    // 4. Delete all pending leads to allow re-classification
    const { error: deleteLeadsError } = await supabase
      .from('leads')
      .delete()
      .eq('status', 'pending');

    if (deleteLeadsError) throw deleteLeadsError;

    // 5. Fetch remaining raw ads that don't have lead entries
    const { data: remainingRawAds } = await supabase
      .from('raw_ads')
      .select('id, niche');

    const { data: existingLeads } = await supabase
      .from('leads')
      .select('raw_ad_id');

    const leadIdsSet = new Set((existingLeads || []).map((l) => l.raw_ad_id));
    const unclassifiedAds = (remainingRawAds || []).filter((ad) => !leadIdsSet.has(ad.id));

    console.log(`🤖 Remaining unclassified ads to process: ${unclassifiedAds.length}`);

    // 6. Group by niche and classify
    const nichesToClassify = [...new Set(unclassifiedAds.map((ad) => ad.niche))];
    let classifiedCount = 0;

    for (const niche of nichesToClassify) {
      console.log(`🤖 Running Gemini 2.5 classification for niche "${niche}"...`);
      const stats = await classifyAds(niche, 15);
      classifiedCount += stats.total;
    }

    return NextResponse.json({
      success: true,
      pruned: prunedCount,
      classified: classifiedCount,
    });
  } catch (err) {
    console.error('Reclassify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
