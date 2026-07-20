import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import { CLASSIFICATION_PROMPT } from './constants';

function extractEmail(text: string | null): string | null {
  if (!text) return null;
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function cleanPhone(rawPhone: string | null): string | null {
  if (!rawPhone) return null;
  const stripped = rawPhone.replace(/[^\d+]/g, '');
  const digitsOnly = stripped.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;
  if (/^(\d)\1+$/.test(digitsOnly)) return null;
  if (digitsOnly === '1234567890' || digitsOnly === '0123456789') return null;
  return stripped;
}

function generateMessageDraft(): string {
  return `Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo`;
}

interface ClassifiedAd {
  ad_index: number;
  is_lead: boolean;
  confidence: string;
  business_name: string;
  phone: string | null;
  city: string | null;
  has_website: boolean;
  rejection_reason: string | null;
}

async function classifyBatch(ads: any[], niche: string): Promise<ClassifiedAd[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set in environment variables');

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const adsJson = ads.map((ad: any, idx: number) => ({
    ad_index: idx,
    page_name: ad.page_name,
    ad_text: ad.ad_text?.substring(0, 500),
    cta_link: ad.cta_link,
    cta_type: ad.cta_type,
    city: ad.city,
  }));

  const prompt = CLASSIFICATION_PROMPT
    .replace(/\{\{niche\}\}/g, niche)
    .replace('{{ads_json}}', JSON.stringify(adsJson, null, 2));

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let parsed: ClassifiedAd[];
      try {
        parsed = JSON.parse(responseText);
      } catch {
        const match = responseText.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse JSON from response');
        }
      }

      if (!Array.isArray(parsed)) {
        throw new Error('Response is not a JSON array');
      }

      return parsed;
    } catch (err: any) {
      console.warn(`Gemini attempt ${attempt + 1}/3 failed: ${err.message}`);
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Failed to classify batch');
}

function localFallbackClassify(ads: any[], _niche: string): ClassifiedAd[] {
  console.log(`Running local heuristic classifier for ${ads.length} ads.`);
  return ads.map((ad: any, idx: number) => {
    const adText = ad.ad_text || '';
    const ctaLink = ad.cta_link || '';
    const phoneMatch = adText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91\s?\d{10}|\b[789]\d{9}\b/);
    let phone = phoneMatch ? cleanPhone(phoneMatch[0]) : null;

    if (!phone && ctaLink) {
      const waMatch = ctaLink.match(/(?:wa\.me|phone|send\?phone=)[/=]?(\d{10,15})/);
      if (waMatch) {
        phone = cleanPhone('+' + waMatch[1]);
      }
    }

    const hasWebsite = !!(
      ctaLink &&
      ctaLink.startsWith('http') &&
      !ctaLink.includes('wa.me') &&
      !ctaLink.includes('facebook.com') &&
      !ctaLink.includes('fb.com') &&
      !ctaLink.includes('instagram.com') &&
      !ctaLink.includes('bit.ly') &&
      !ctaLink.includes('m.me') &&
      !ctaLink.includes('linktr.ee') &&
      !ctaLink.includes('campsite.bio')
    );

    const isLead = !hasWebsite;
    const confidence = isLead ? (phone ? 'high' : 'medium') : 'low';

    return {
      ad_index: idx,
      is_lead: isLead,
      confidence,
      business_name: ad.page_name || 'Business ' + (idx + 1),
      phone,
      city: ad.city || null,
      has_website: hasWebsite,
      rejection_reason: isLead ? null : 'Already has a website.'
    };
  });
}

export async function classifyAds(niche: string, batchSize = 10) {
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }

  const { data: rawAds, error: fetchError } = await (supabase
    .from('raw_ads') as any)
    .select('*')
    .eq('niche', niche)
    .order('created_at', { ascending: true });

  if (fetchError) throw new Error(`Failed to fetch raw_ads: ${fetchError.message}`);

  const { data: existingLeads } = await (supabase
    .from('leads') as any)
    .select('raw_ad_id')
    .eq('niche', niche);

  const classifiedIds = new Set((existingLeads || []).map((l: any) => l.raw_ad_id));
  const unclassified = rawAds.filter((ad: any) => !classifiedIds.has(ad.id));

  console.log(`Classifying ${unclassified.length} unclassified ads for niche="${niche}"`);

  if (unclassified.length === 0) {
    return { total: 0, leads: 0, rejected: 0, lowConfidence: 0 };
  }

  let totalLeads = 0;
  let totalRejected = 0;
  let totalLowConfidence = 0;

  for (let i = 0; i < unclassified.length; i += batchSize) {
    const batch = unclassified.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(unclassified.length / batchSize);

    console.log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} ads)`);

    try {
      let results: ClassifiedAd[];
      try {
        results = await classifyBatch(batch, niche);
      } catch (err: any) {
        console.warn(`Batch ${batchNum} AI failed: ${err.message}. Running fallback.`);
        results = localFallbackClassify(batch, niche);
      }

      for (const result of results) {
        const ad = batch[result.ad_index];
        if (!ad) {
          console.warn(`Invalid ad_index: ${result.ad_index}`);
          continue;
        }

        const businessName = result.business_name || ad.page_name;
        const validPhone = cleanPhone(result.phone);
        const email = extractEmail(ad.ad_text);
        const isLead = result.is_lead || false;

        const leadRow = {
          raw_ad_id: ad.id,
          niche,
          business_name: businessName,
          phone: validPhone,
          city: result.city || ad.city || null,
          has_website: result.has_website || false,
          cta_link: ad.cta_link,
          ad_text: ad.ad_text,
          is_lead: isLead,
          confidence: result.confidence || 'low',
          rejection_reason: result.rejection_reason || null,
          message_draft: isLead ? generateMessageDraft() : null,
        };

        const { error: insertError } = await (supabase.from('leads') as any).insert(leadRow);

        if (insertError) {
          console.error(`Error inserting lead: ${insertError.message}`);
          continue;
        }

        if (result.is_lead) {
          totalLeads++;
          if (result.confidence === 'low') totalLowConfidence++;
        } else {
          totalRejected++;
        }
      }
    } catch (err) {
      console.error(`Batch ${batchNum} failed:`, err);
    }

    if (i + batchSize < unclassified.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return { total: unclassified.length, leads: totalLeads, rejected: totalRejected, lowConfidence: totalLowConfidence };
}
