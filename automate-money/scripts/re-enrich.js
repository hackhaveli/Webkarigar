import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabase } from '../lib/supabase.js';
import { enrichLead } from '../lib/enrich.js';

async function main() {
  console.log('🔄 Fetching leads to re-enrich...');
  const { data: leads, error } = await supabase.from('leads').select('*');
  if (error) {
    console.error('❌ Failed to fetch leads:', error.message);
    process.exit(1);
  }

  console.log(`✨ Re-enriching ${leads.length} leads...`);
  for (const lead of leads) {
    try {
      await enrichLead(lead, lead.niche);
      console.log(`✅ Re-enriched: ${lead.business_name}`);
    } catch (err) {
      console.error(`❌ Failed to enrich ${lead.business_name}:`, err.message);
    }
  }

  console.log('🎉 Done re-enriching!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
