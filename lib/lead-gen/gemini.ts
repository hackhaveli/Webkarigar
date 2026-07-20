import { prisma } from '../prisma';
import { supabase } from './supabase';

const SYSTEM_INSTRUCTION = `You are an AI Lead Classifier. Your task is to evaluate Facebook/Instagram ad creative text for local businesses and determine if the business ALREADY HAS a functional website, or if it is a potential lead that NEEDS a website.

RULES FOR CLASSIFICATION:
1. "is_lead": set to TRUE if the ad belongs to a real local business that DOES NOT link to an official domain website (e.g. only links to WhatsApp, Instagram profile, Facebook page, Google Form, or phone number).
2. "is_lead": set to FALSE if the ad links to a full commercial website domain (e.g. contains .com, .in, .org, or explicit website URLs).
3. "confidence": "high" if business name & contact info are clearly identified; "medium" if probable; "low" if uncertain.
4. Extract the clean business name, phone number, email address (if present), and city name.

Respond ONLY with valid JSON array containing objects matching this schema:
[
  {
    "raw_ad_id": "string",
    "business_name": "string",
    "phone": "string or null",
    "email": "string or null",
    "city": "string or null",
    "is_lead": true/false,
    "confidence": "high/medium/low",
    "rejection_reason": "string or null"
  }
]`;

export async function classifyAds(niche: string, batchSize = 10) {
  // 1. Fetch raw_ads for this specific niche from Prisma PostgreSQL
  const rawAds = await prisma.rawAd.findMany({
    where: { niche },
    orderBy: { createdAt: 'asc' },
  });

  // 2. Fetch existing classified leads for this niche
  const existingLeads = await prisma.aILead.findMany({
    where: { niche },
    select: { rawAdId: true },
  });

  const classifiedIds = new Set(existingLeads.map((l) => l.rawAdId).filter(Boolean));
  const unclassified = rawAds.filter((ad) => !classifiedIds.has(ad.id));

  console.log(`Classifying ${unclassified.length} unclassified ads for niche="${niche}"`);

  if (unclassified.length === 0) {
    const nicheLeadsCount = await prisma.aILead.count({ where: { niche, isLead: true } });
    const nicheRejectedCount = await prisma.aILead.count({ where: { niche, isLead: false } });
    return { total: rawAds.length, leads: nicheLeadsCount, rejected: nicheRejectedCount, lowConfidence: 0 };
  }

  let totalLeads = 0;
  let totalRejected = 0;
  let totalLowConfidence = 0;

  for (let i = 0; i < unclassified.length; i += batchSize) {
    const batch = unclassified.slice(i, i + batchSize);

    for (const ad of batch) {
      const pageName = ad.pageName || 'Local Business';
      const adText = ad.adText || '';
      const ctaLink = ad.ctaLink || '';

      const hasDomainLink =
        ctaLink.includes('.com') ||
        ctaLink.includes('.in') ||
        ctaLink.includes('.co') ||
        ctaLink.includes('.org') ||
        ctaLink.includes('.net');

      const isWhatsAppLink = ctaLink.includes('wa.me') || ctaLink.includes('api.whatsapp');

      const phoneMatch = adText.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/);
      const phone = phoneMatch ? phoneMatch[0] : null;

      const emailMatch = adText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : null;

      const isLead = !hasDomainLink || isWhatsAppLink;
      const confidence = phone || email ? 'high' : 'medium';

      if (isLead) totalLeads++;
      else totalRejected++;

      const leadRow = {
        rawAdId: ad.id,
        niche,
        businessName: pageName,
        phone,
        email,
        city: ad.country === 'IN' ? 'India' : ad.country,
        hasWebsite: !isLead,
        ctaLink: ctaLink || null,
        adText: adText || null,
        isLead,
        confidence,
        rejectionReason: isLead ? null : 'Already has a website link.',
        status: 'pending',
      };

      // Save to Prisma PostgreSQL
      await prisma.aILead.create({
        data: leadRow,
      });

      // Optionally sync to Supabase if client is active
      try {
        if (supabase && (supabase as any).from) {
          await (supabase.from('leads') as any).insert({
            raw_ad_id: ad.id,
            niche,
            business_name: pageName,
            phone,
            email,
            city: leadRow.city,
            has_website: !isLead,
            cta_link: ctaLink || null,
            ad_text: adText || null,
            is_lead: isLead,
            confidence,
            rejection_reason: leadRow.rejectionReason,
            status: 'pending',
          });
        }
      } catch (e) {
        // ignore Supabase fallback error
      }
    }
  }

  const finalLeads = await prisma.aILead.count({ where: { niche, isLead: true } });
  const finalRejected = await prisma.aILead.count({ where: { niche, isLead: false } });

  return {
    total: rawAds.length,
    leads: finalLeads,
    rejected: finalRejected,
    lowConfidence: totalLowConfidence,
  };
}
