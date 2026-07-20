import crypto from 'crypto';
import { supabase } from './supabase';
import { getSystemSettings } from '../system-settings';

const DEFAULT_META_TOKEN =
  'EAAOq9OGZCu9EBSEbYITNZC7Yw8yBJhVMutPXWGwTJHbg9rXdieVBN8WWJXpZBUQqt3ZBAIGO3mO2P3N2IORHDc5r1cIdk0RenlWBjmZCKKMNxah9Bjx3CWwXH22KCdFsZCmzMo3MgR5vQDC228rZAdYqv5f98u8uPxzCkr9BLy5rc1f39y3Q7lYVgjtRNFZAR7SzTjMvivzuMxOaovgDuEKVXcA6wQZB5iKHdZCyTgihdFNfqfhKKb8jt9qOGkXbHnAORwJB0oQjdL194DDYsBtm0vlcyw10UZAWZCRK2gZDZD';

async function getMetaAccessToken(): Promise<string> {
  try {
    const settings = await getSystemSettings();
    if (settings.metaAdsApiKey && settings.metaAdsApiKey.trim().length > 10) {
      return settings.metaAdsApiKey.trim();
    }
  } catch (err) {
    console.error('Failed to read system settings for Meta token:', err);
  }

  const envToken =
    process.env.META_ACCESS_TOKEN ||
    process.env.META_ADS_API_KEY ||
    process.env.FACEBOOK_ACCESS_TOKEN;
  if (envToken && envToken.trim().length > 10) {
    return envToken.trim();
  }

  return DEFAULT_META_TOKEN;
}

function createAdHash(pageId: string, adText: string) {
  const str = `${pageId || ''}|${adText || ''}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

export async function scrapeAndStore(
  niche: string,
  keywords: string[],
  country = 'IN',
  options: { maxItems?: number } = {}
) {
  const token = await getMetaAccessToken();
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }

  let totalScraped = 0;
  let newCount = 0;
  let dupCount = 0;

  console.log(`Starting Meta Graph API fetch for niche="${niche}", keywords=${keywords.join(', ')}, country=${country}`);

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
        console.error(`Meta API Error for keyword "${keyword}": ${resData.error.message}`);
        continue;
      }

      const items = resData.data || [];
      totalScraped += items.length;

      for (const item of items) {
        if (item.error) continue;

        const pageId = item.page_id || '';
        const adText = item.ad_creative_bodies?.[0] || '';
        const pageName = item.page_name || '';
        let ctaLink = item.ad_creative_link_captions?.[0] || '';

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

        if (isSpam) continue;

        const hash = createAdHash(pageId, adText);

        const { data: existing } = await (supabase
          .from('raw_ads') as any)
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
          country,
          city: '',
          platform: (item.publisher_platforms || []).join(','),
          impressions: '',
          spend: '',
          hash,
          raw_json: item,
        };

        const { error } = await (supabase.from('raw_ads') as any).insert(row);
        if (error) {
          if (error.code === '23505') {
            dupCount++;
          } else {
            console.error(`Error inserting ad: ${error.message}`);
          }
        } else {
          newCount++;
        }
      }
    } catch (err) {
      console.error(`Fetch failed for keyword "${keyword}":`, err);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const stats = { total: totalScraped, new: newCount, duplicates: dupCount };
  console.log(`Meta API Results:`, stats);
  return stats;
}

export async function triggerScrape(
  niche: string,
  keywords: string[] = [],
  country = 'IN',
  options: { maxItems?: number } = {}
) {
  const stats = await scrapeAndStore(niche, keywords, country, options);
  return { runId: 'meta_api_run', datasetId: 'meta_api_dataset', stats };
}

export async function fetchAndStoreResults(_datasetId: string, _niche: string) {
  return { total: 0, new: 0, duplicates: 0 };
}
