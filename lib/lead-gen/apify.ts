import crypto from 'crypto';
import { prisma } from '../prisma';
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

        // 1. Check existing in Prisma PostgreSQL
        const existingPrisma = await prisma.rawAd.findUnique({
          where: { hash },
        });

        if (existingPrisma) {
          dupCount++;
          continue;
        }

        if (ctaLink && !ctaLink.startsWith('http')) {
          ctaLink = `https://${ctaLink}`;
        }

        const adRow = {
          niche,
          keyword,
          country,
          hash,
          pageId,
          pageName,
          adText,
          ctaLink,
          publisherPlatforms: item.publisher_platforms || [],
          adCreationTime: item.ad_creation_time ? new Date(item.ad_creation_time) : null,
          rawJson: item,
        };

        // Save to Prisma PostgreSQL
        await prisma.rawAd.create({
          data: adRow,
        });

        // Optionally save to Supabase if valid client exists
        try {
          if (supabase && (supabase as any).from) {
            await (supabase.from('raw_ads') as any).insert({
              niche,
              keyword,
              country,
              hash,
              page_id: pageId,
              page_name: pageName,
              ad_text: adText,
              cta_link: ctaLink,
              publisher_platforms: item.publisher_platforms || [],
              ad_creation_time: item.ad_creation_time,
              raw_json: item,
            });
          }
        } catch (sbErr) {
          // Ignore Supabase error if not set
        }

        newCount++;
      }
    } catch (err: any) {
      console.error(`Fetch error for keyword "${keyword}":`, err.message);
    }
  }

  // Get total count for THIS NICHE only
  const nicheTotalCount = await prisma.rawAd.count({
    where: { niche },
  });

  return {
    scraped: totalScraped,
    newCount,
    dupCount,
    totalCount: nicheTotalCount,
  };
}
