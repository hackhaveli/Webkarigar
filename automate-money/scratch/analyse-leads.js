import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';

async function main() {
  // Fetch count of leads with is_lead = false
  const { data: stats } = await supabase
    .from('leads')
    .select('is_lead, confidence, has_website, phone')
    
  let leadTrue = 0;
  let leadFalse = 0;
  let hasPhone = 0;
  let hasWeb = 0;

  stats.forEach(s => {
    if (s.is_lead) leadTrue++;
    else leadFalse++;

    if (s.phone) hasPhone++;
    if (s.has_website) hasWeb++;
  });

  console.log('Total Leads in DB:', stats.length);
  console.log('is_lead = true:', leadTrue);
  console.log('is_lead = false:', leadFalse);
  console.log('has phone:', hasPhone);
  console.log('has website:', hasWeb);

  // Let's see some ads where is_lead is false
  const { data: sampleFalse } = await supabase
    .from('leads')
    .select('id, business_name, phone, has_website, rejection_reason, ad_text, cta_link')
    .eq('is_lead', false)
    .limit(5);

  console.log('Sample of rejected leads:', JSON.stringify(sampleFalse, null, 2));
}

main().catch(console.error);
