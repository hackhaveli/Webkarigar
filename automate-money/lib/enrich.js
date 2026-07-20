import { supabase } from './supabase.js';
import { NICHES } from './constants.js';

/**
 * Slugify a business name for use in demo URLs.
 * @param {string} name - Business name
 * @returns {string} URL-safe slug
 */
export function slugify(name) {
  return (name || 'business')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special chars
    .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')         // Collapse multiple hyphens
    .replace(/^-|-$/g, '')       // Trim leading/trailing hyphens
    .substring(0, 50);           // Limit length
}

/**
 * Clean phone number to a WhatsApp-friendly format.
 * Strips spaces, dashes, parentheses. Ensures starts with country code.
 * @param {string} phone - Raw phone number
 * @returns {string|null} Cleaned phone or null
 */
export function cleanPhone(phone) {
  if (!phone) return null;

  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Remove leading + for processing
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0, assume India (+91)
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }

  // If 10 digits (no country code), assume India
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }

  // Validate: should be digits only, 10-15 chars
  if (!/^\d{10,15}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Generate demo links for a lead.
 * @param {string} slug - Business slug
 * @param {object} nicheConfig - Niche config from constants
 * @returns {string[]} Array of demo link URLs
 */
export function generateDemoLinks(slug, nicheConfig) {
  return nicheConfig.templateBases.map(
    (base) => `https://${base}.${nicheConfig.templateDomain}/${slug}`
  );
}

/**
 * Generate a WhatsApp message draft from template.
 * @param {object} lead - Lead data
 * @param {string[]} demoLinks - Demo link URLs
 * @param {object} nicheConfig - Niche config from constants
 * @returns {string} Message draft
 */
export function generateMessageDraft(lead, demoLinks, nicheConfig) {
  let message = nicheConfig.messageTemplate;

  message = message.replace(/\{\{business_name\}\}/g, lead.business_name || 'there');

  demoLinks.forEach((link, i) => {
    message = message.replace(`{{demo_link_${i + 1}}}`, link);
  });

  // Clean up any unreplaced placeholders
  message = message.replace(/\{\{demo_link_\d+\}\}/g, '');

  return message.trim();
}

/**
 * Enrich a single lead: slugify, generate demo links, clean phone, generate message.
 * @param {object} lead - Lead row from Supabase
 * @param {string} niche - Niche identifier
 * @returns {Promise<object>} Updated lead data
 */
export async function enrichLead(lead, niche) {
  const nicheConfig = NICHES[niche];
  if (!nicheConfig) {
    throw new Error(`Unknown niche: ${niche}`);
  }

  const slug = slugify(lead.business_name);
  const demoLinks = generateDemoLinks(slug, nicheConfig);
  const cleanedPhone = cleanPhone(lead.phone);
  const messageDraft = generateMessageDraft(lead, demoLinks, nicheConfig);

  const updates = {
    slug,
    demo_links: demoLinks,
    phone: cleanedPhone || lead.phone, // Keep original if cleaning fails
    message_draft: messageDraft,
  };

  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', lead.id);

  if (error) {
    throw new Error(`Failed to update lead ${lead.id}: ${error.message}`);
  }

  return { ...lead, ...updates };
}

/**
 * Enrich all unenriched leads for a given niche.
 * @param {string} niche - Niche identifier
 * @returns {Promise<{total: number, enriched: number, errors: number}>}
 */
export async function enrichAllLeads(niche) {
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }
  // Fetch leads that need enrichment: is_lead=true, confidence != 'low', slug IS NULL
  const { data: leads, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('niche', niche)
    .eq('is_lead', true)
    .neq('confidence', 'low')
    .is('slug', null);

  if (fetchError) throw new Error(`Failed to fetch leads: ${fetchError.message}`);

  console.log(`✨ Enriching ${leads.length} leads for niche="${niche}"`);

  if (leads.length === 0) {
    console.log('✅ No leads to enrich');
    return { total: 0, enriched: 0, errors: 0 };
  }

  let enriched = 0;
  let errors = 0;

  for (const lead of leads) {
    try {
      await enrichLead(lead, niche);
      enriched++;
    } catch (err) {
      console.error(`❌ Error enriching lead "${lead.business_name}": ${err.message}`);
      errors++;
    }
  }

  const stats = { total: leads.length, enriched, errors };
  console.log(`📊 Enrichment complete:`, stats);
  return stats;
}
