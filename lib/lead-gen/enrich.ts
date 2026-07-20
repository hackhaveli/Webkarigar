import { prisma } from '../prisma';
import { supabase } from './supabase';

function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateDemoLinks(niche: string, businessName: string): string[] {
  const slug = generateSlug(businessName);
  const baseUrl = 'https://webkarigar.com';

  return [
    `${baseUrl}/preview/${slug}`,
    `${baseUrl}/demo/${niche}`,
    `${baseUrl}/templates/${niche}`,
  ];
}

function generateMessageDraft(niche: string, businessName: string, demoLinks: string[]): string {
  const primaryDemo = demoLinks[0] || 'https://webkarigar.com/demo';

  return `Hey Team ${businessName}! 👋

I noticed your ads on Instagram & Facebook. We created a live customized website preview specifically designed for your ${niche} business:

👉 ${primaryDemo}

Would you be open to launching this live to turn your ad traffic into 3x more booked clients this week?

Best regards,
Rohit Sharma
Founder, WebKarigar`;
}

export async function enrichLeads(niche: string) {
  // 1. Fetch leads for this niche from Prisma PostgreSQL
  const leads = await prisma.aILead.findMany({
    where: { niche, isLead: true },
  });

  if (leads.length === 0) {
    return { total: 0, enriched: 0, errors: 0 };
  }

  let enrichedCount = 0;
  let errorCount = 0;

  for (const lead of leads) {
    try {
      const slug = generateSlug(lead.businessName);
      const demoLinks = generateDemoLinks(lead.niche, lead.businessName);
      const messageDraft = generateMessageDraft(lead.niche, lead.businessName, demoLinks);

      await prisma.aILead.update({
        where: { id: lead.id },
        data: {
          slug,
          demoLinks,
          messageDraft,
        },
      });

      // Sync to Supabase if available
      try {
        if (supabase && (supabase as any).from) {
          await (supabase.from('leads') as any)
            .update({
              slug,
              demo_links: demoLinks,
              message_draft: messageDraft,
            })
            .eq('id', lead.id);
        }
      } catch (e) {
        // ignore
      }

      enrichedCount++;
    } catch (err) {
      console.error(`Enrich error for lead ${lead.id}:`, err);
      errorCount++;
    }
  }

  return {
    total: leads.length,
    enriched: enrichedCount,
    errors: errorCount,
  };
}
