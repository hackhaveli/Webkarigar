import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase.js';
import { CLASSIFICATION_PROMPT } from './constants.js';

/**
 * Extract an email address from ad text.
 */
function extractEmail(text) {
  if (!text) return null;
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

/**
 * Validate and clean a phone number string.
 * Returns cleaned phone or null if it looks fake/invalid (too short, all same digits, etc.)
 */
function cleanPhone(rawPhone) {
  if (!rawPhone) return null;
  // Strip everything except digits and leading +
  const stripped = rawPhone.replace(/[^\d+]/g, '');
  const digitsOnly = stripped.replace(/\D/g, '');

  // Must have at least 7 digits and no more than 15
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;

  // Reject all-same-digit numbers (e.g. 0000000000)
  if (/^(\d)\1+$/.test(digitsOnly)) return null;

  // Reject common non-phone patterns (sequential like 1234567890)
  if (digitsOnly === '1234567890' || digitsOnly === '0123456789') return null;

  return stripped;
}

/**
 * Generate a WhatsApp message draft — hardcoded pitch message (no AI credits used).
 */
function generateMessageDraft() {
  return `Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo`;
}

const getGeminiKey = () => process.env.GEMINI_API_KEY;

/**
 * Classify a batch of ads using Gemini AI.
 * @param {object[]} ads - Array of raw_ads objects
 * @param {string} niche - Niche identifier
 * @returns {Promise<object[]>} Array of classification results
 */
async function classifyBatch(ads, niche) {
  const key = getGeminiKey();
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  // Prepare ads JSON for the prompt
  const adsJson = ads.map((ad, idx) => ({
    ad_index: idx,
    page_name: ad.page_name,
    ad_text: ad.ad_text?.substring(0, 500), // Truncate long texts
    cta_link: ad.cta_link,
    cta_type: ad.cta_type,
    city: ad.city,
  }));

  const prompt = CLASSIFICATION_PROMPT
    .replace(/\{\{niche\}\}/g, niche)
    .replace('{{ads_json}}', JSON.stringify(adsJson, null, 2));

  // Retry up to 2 times on malformed JSON
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON response
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        // Try extracting JSON from markdown code blocks
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
    } catch (err) {
      console.warn(`⚠️  Gemini attempt ${attempt + 1}/3 failed: ${err.message}`);
      if (attempt === 2) throw err;
      // Small delay before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

/**
 * Local heuristic fallback classification in case Gemini API is blocked/rate-limited.
 */
function localFallbackClassify(ads, niche) {
  console.log(`⚠️ Gemini API quota exceeded or error occurred. Running local heuristic classifier for ${ads.length} ads.`);
  return ads.map((ad, idx) => {
    const adText = ad.ad_text || '';
    const ctaLink = ad.cta_link || '';

    // Search for simple Indian/General 10-digit phone patterns
    const phoneMatch = adText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91\s?\d{10}|\b[789]\d{9}\b/);
    let phone = phoneMatch ? cleanPhone(phoneMatch[0]) : null;

    // Check if phone can be extracted from WhatsApp CTA Link
    if (!phone && ctaLink) {
      const waMatch = ctaLink.match(/(?:wa\.me|phone|send\?phone=)[/=]?(\d{10,15})/);
      if (waMatch) {
        phone = cleanPhone('+' + waMatch[1]);
      }
    }

    // Check if they have a website (not wa.me, fb, instagram, bit.ly, linktr.ee, etc.)
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

    // If they don't have a website, they are a lead!
    const isLead = !hasWebsite;
    const confidence = isLead ? (phone ? 'high' : 'medium') : 'low';

    return {
      ad_index: idx,
      is_lead: isLead,
      confidence: confidence,
      business_name: ad.page_name || 'Business ' + (idx + 1),
      phone: phone,
      city: ad.city || null,
      has_website: hasWebsite,
      rejection_reason: isLead ? null : 'Already has a website.'
    };
  });
}

/**
 * Classify all unclassified ads for a given niche.
 * @param {string} niche - Niche identifier
 * @param {number} batchSize - Number of ads per Gemini call (default: 10)
 * @returns {Promise<{total: number, leads: number, rejected: number, lowConfidence: number}>}
 */
export async function classifyAds(niche, batchSize = 10) {
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }
  // Fetch raw_ads that don't have a corresponding leads entry
  const { data: rawAds, error: fetchError } = await supabase
    .from('raw_ads')
    .select('*')
    .eq('niche', niche)
    .order('created_at', { ascending: true });

  if (fetchError) throw new Error(`Failed to fetch raw_ads: ${fetchError.message}`);

  // Get existing lead raw_ad_ids to skip already classified
  const { data: existingLeads } = await supabase
    .from('leads')
    .select('raw_ad_id')
    .eq('niche', niche);

  const classifiedIds = new Set((existingLeads || []).map((l) => l.raw_ad_id));
  const unclassified = rawAds.filter((ad) => !classifiedIds.has(ad.id));

  console.log(`🤖 Classifying ${unclassified.length} unclassified ads for niche="${niche}"`);

  if (unclassified.length === 0) {
    console.log('✅ No unclassified ads found');
    return { total: 0, leads: 0, rejected: 0, lowConfidence: 0 };
  }

  let totalLeads = 0;
  let totalRejected = 0;
  let totalLowConfidence = 0;

  // Process in batches
  for (let i = 0; i < unclassified.length; i += batchSize) {
    const batch = unclassified.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(unclassified.length / batchSize);

    console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} ads)`);

    try {
      let results;
      try {
        results = await classifyBatch(batch, niche);
      } catch (err) {
        console.warn(`⚠️ Batch ${batchNum} AI classification failed: ${err.message}. Running fallback local classifier.`);
        results = localFallbackClassify(batch, niche);
      }

      // Insert all results into leads table
      for (const result of results) {
        const ad = batch[result.ad_index];
        if (!ad) {
          console.warn(`⚠️  Invalid ad_index: ${result.ad_index}`);
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

        const { error: insertError } = await supabase.from('leads').insert(leadRow);

        if (insertError) {
          console.error(`❌ Error inserting lead: ${insertError.message}`);
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
      console.error(`❌ Batch ${batchNum} failed: ${err.message}`);
    }

    // Small delay between batches to respect rate limits
    if (i + batchSize < unclassified.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const stats = {
    total: unclassified.length,
    leads: totalLeads,
    rejected: totalRejected,
    lowConfidence: totalLowConfidence,
  };

  console.log(`📊 Classification complete:`, stats);
  return stats;
}
