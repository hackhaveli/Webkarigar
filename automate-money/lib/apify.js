import crypto from 'crypto';
import { supabase } from './supabase.js';

function createAdHash(pageId, adText) {
  const str = `${pageId || ''}|${adText || ''}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Perform scraping using official Meta Graph API ads_archive endpoint.
 */
export async function scrapeAndStore(niche, keywords, country = 'IN', options = {}) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    throw new Error('META_ACCESS_TOKEN is not set in environment variables');
  }
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }

  let totalScraped = 0;
  let newCount = 0;
  let dupCount = 0;

  console.log(`🚀 Starting Meta Graph API fetch for niche="${niche}", keywords=${keywords.join(', ')}, country=${country}`);

  for (const keyword of keywords) {
    const url = new URL('https://graph.facebook.com/v20.0/ads_archive');
    url.searchParams.append('access_token', token);
    url.searchParams.append('search_terms', keyword);
    url.searchParams.append('ad_reached_countries', JSON.stringify([country]));
    url.searchParams.append('ad_type', 'ALL');
    url.searchParams.append('ad_active_status', 'ACTIVE');
    url.searchParams.append('limit', String(options.maxItems || 50));
    url.searchParams.append('fields', 'id,ad_creation_time,ad_delivery_start_time,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_snapshot_url,page_id,page_name,publisher_platforms');

    try {
      const response = await fetch(url.toString());
      const resData = await response.json();

      if (resData.error) {
        console.error(`❌ Meta API Error for keyword "${keyword}": ${resData.error.message}`);
        continue;
      }

      const items = resData.data || [];
      totalScraped += items.length;

      for (const item of items) {
        if (item.error) {
          continue;
        }

        const pageId = item.page_id || '';
        const adText = item.ad_creative_bodies?.[0] || '';
        const pageName = item.page_name || '';
        let ctaLink = item.ad_creative_link_captions?.[0] || '';
        
        // Spam filtering (romance apps, werewolf stories, short dramas)
        const lowerPageName = pageName.toLowerCase();
        const lowerAdText = adText.toLowerCase();
        const lowerCtaLink = ctaLink.toLowerCase();

        const isSpam =
          lowerPageName.includes('dramabox') ||
          lowerPageName.includes('drama') ||
          lowerPageName.includes('novel') ||
          lowerPageName.includes('story') ||
          lowerPageName.includes('channel') ||
          lowerPageName.startsWith('ns-') ||
          lowerAdText.includes('werewolf') ||
          lowerAdText.includes('mating bond') ||
          lowerAdText.includes('alpha mate') ||
          lowerAdText.includes('suger mommy') ||
          lowerAdText.includes('sugermommy') ||
          lowerAdText.includes('luna') ||
          lowerAdText.includes('chapters') ||
          lowerCtaLink.includes('h5short.com') ||
          lowerCtaLink.includes('netshort.com') ||
          lowerCtaLink.includes('argbook.com') ||
          lowerCtaLink.includes('moboreader.com') ||
          lowerCtaLink.includes('goodnovel.com');

        if (isSpam) {
          continue;
        }

        const hash = createAdHash(pageId, adText);

        // Check for duplicate
        const { data: existing } = await supabase
          .from('raw_ads')
          .select('id')
          .eq('hash', hash)
          .maybeSingle();

        if (existing) {
          dupCount++;
          continue;
        }

        if (ctaLink && !ctaLink.startsWith('http')) {
          ctaLink = `https://${ctaLink}`;
        }

        const row = {
          niche,
          page_id: pageId,
          page_name: item.page_name || '',
          ad_text: adText,
          cta_link: ctaLink,
          cta_type: item.ad_creative_link_titles?.[0] || '',
          ad_start_date: item.ad_delivery_start_time || null,
          ad_snapshot_url: item.ad_snapshot_url || '',
          country: country,
          city: '',
          platform: (item.publisher_platforms || []).join(','),
          impressions: '',
          spend: '',
          hash,
          raw_json: item,
        };

        const { error } = await supabase.from('raw_ads').insert(row);
        if (error) {
          if (error.code === '23505') {
            dupCount++;
          } else {
            console.error(`❌ Error inserting ad: ${error.message}`);
          }
        } else {
          newCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Fetch failed for keyword "${keyword}":`, err);
    }
    // Add delay between requests to avoid Meta API rate limits/throttling
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const stats = { total: totalScraped, new: newCount, duplicates: dupCount };
  console.log(`📊 Meta API Results: ${stats.total} total, ${stats.new} new, ${stats.duplicates} duplicates`);
  return stats;
}

/**
 * Triggers Meta Ads fetch in a compatible format for frontend/scripts.
 */
export async function triggerScrape(niche, keywords = [], country = 'IN', options = {}) {
  const stats = await scrapeAndStore(niche, keywords, country, options);
  return { runId: 'meta_api_run', datasetId: 'meta_api_dataset', stats };
}

/**
 * Mock result fetch for compatibility with Apify-style two-step process.
 */
export async function fetchAndStoreResults(datasetId, niche) {
  return { total: 0, new: 0, duplicates: 0 };
}
