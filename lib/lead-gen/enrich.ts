import { supabase } from './supabase';
import { NICHES } from './constants';

export function slugify(name: string | null): string {
  return (name || 'business')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export function cleanPhone(phone: string | null): string | null {
  if (!phone) return null;

  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }

  if (/^\d{10}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }

  if (!/^\d{10,15}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function generateDemoLinks(slug: string, nicheConfig: any): string[] {
  return nicheConfig.templateBases.map(
    (base: string) => `https://${base}.${nicheConfig.templateDomain}/${slug}`
  );
}

export function generateMessageDraft(lead: any, demoLinks: string[], nicheConfig: any): string {
  let message = nicheConfig.messageTemplate;
  message = message.replace(/\{\{business_name\}\}/g, lead.business_name || 'there');

  demoLinks.forEach((link, i) => {
    message = message.replace(`{{demo_link_${i + 1}}}`, link);
  });

  message = message.replace(/\{\{demo_link_\d+\}\}/g, '');
  return message.trim();
}

export async function enrichLead(lead: any, niche: string) {
  const nicheConfig = (NICHES as any)[niche];
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
    phone: cleanedPhone || lead.phone,
    message_draft: messageDraft,
  };

  const { error } = await (supabase
    .from('leads') as any)
    .update(updates)
    .eq('id', lead.id);

  if (error) {
    throw new Error(`Failed to update lead ${lead.id}: ${error.message}`);
  }

  return { ...lead, ...updates };
}

export async function enrichAllLeads(niche: string) {
  if (!supabase) {
    throw new Error('Supabase not configured. Add credentials to .env.local');
  }

  const { data: leads, error: fetchError } = await (supabase
    .from('leads') as any)
    .select('*')
    .eq('niche', niche)
    .eq('is_lead', true)
    .neq('confidence', 'low')
    .is('slug', null);

  if (fetchError) throw new Error(`Failed to fetch leads: ${fetchError.message}`);

  console.log(`Enriching ${leads.length} leads for niche="${niche}"`);

  if (leads.length === 0) {
    return { total: 0, enriched: 0, errors: 0 };
  }

  let enriched = 0;
  let errors = 0;

  for (const lead of leads) {
    try {
      await enrichLead(lead, niche);
      enriched++;
    } catch (err: any) {
      console.error(`Error enriching lead "${lead.business_name}": ${err.message}`);
      errors++;
    }
  }

  return { total: leads.length, enriched, errors };
}
