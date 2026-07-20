/**
 * CLI Script: Prune spam ads and re-classify remaining ads
 * Usage: node scripts/reclassify.js
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';
import { classifyAds } from '../lib/gemini.js';

async function main() {
  if (!supabase) {
    console.error('❌ Supabase client not configured in env.');
    process.exit(1);
  }

  console.log('🧹 Starting database maintenance and re-classification...');

  // 1. Fetch all raw ads
  const { data: rawAds, error: fetchError } = await supabase
    .from('raw_ads')
    .select('id, page_name, ad_text, cta_link, niche');

  if (fetchError) {
    console.error('❌ Failed to fetch raw ads:', fetchError.message);
    process.exit(1);
  }

  // 2. Identify spam
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

  console.log(`🧹 Found ${spamIds.length} spam ads (romance stories, werewolf/short drama apps).`);

  // 3. Delete spam raw ads
  if (spamIds.length > 0) {
    console.log(`🧹 Pruning ${spamIds.length} spam raw ads...`);
    const { error: deleteError } = await supabase
      .from('raw_ads')
      .delete()
      .in('id', spamIds);

    if (deleteError) {
      console.error('❌ Failed to delete spam raw ads:', deleteError.message);
      process.exit(1);
    }
    console.log('✅ Spam raw ads deleted successfully!');
  }

  // 4. Delete all pending leads
  console.log('🧹 Deleting all pending leads to allow re-classification...');
  const { error: deleteLeadsError } = await supabase
    .from('leads')
    .delete()
    .eq('status', 'pending');

  if (deleteLeadsError) {
    console.error('❌ Failed to delete pending leads:', deleteLeadsError.message);
    process.exit(1);
  }
  console.log('✅ Pending leads cleared!');

  // 5. Fetch remaining raw ads that don't have lead entries
  const { data: remainingRawAds } = await supabase
    .from('raw_ads')
    .select('id, niche');

  const { data: existingLeads } = await supabase
    .from('leads')
    .select('raw_ad_id');

  const leadIdsSet = new Set((existingLeads || []).map((l) => l.raw_ad_id));
  const unclassifiedAds = (remainingRawAds || []).filter((ad) => !leadIdsSet.has(ad.id));

  console.log(`🤖 Remaining unclassified raw ads: ${unclassifiedAds.length}`);

  if (unclassifiedAds.length === 0) {
    console.log('✅ No ads left to classify.');
    process.exit(0);
  }

  // 6. Group by niche and classify
  const nichesToClassify = [...new Set(unclassifiedAds.map((ad) => ad.niche))];
  let totalClassified = 0;

  for (const niche of nichesToClassify) {
    console.log(`🤖 Running Gemini 2.5 classification for niche="${niche}"...`);
    try {
      const stats = await classifyAds(niche, 15);
      totalClassified += stats.total;
      console.log(`   └ Niche "${niche}" stats: Total: ${stats.total}, Leads: ${stats.leads}, Rejected: ${stats.rejected}`);
    } catch (err) {
      console.error(`   └ Niche "${niche}" failed:`, err.message);
    }
  }

  console.log(`\n✅ Database maintenance and re-classification complete!`);
  console.log(`   Pruned spam:      ${spamIds.length}`);
  console.log(`   Re-classified:   ${totalClassified}`);
}

main().catch(err => {
  console.error('❌ Maintenance failed:', err);
  process.exit(1);
});
