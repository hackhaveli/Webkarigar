import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';

async function main() {
  const { count: rawCount, error: rawErr } = await supabase
    .from('raw_ads')
    .select('*', { count: 'exact', head: true });
  
  const { count: leadsCount, error: leadsErr } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  const { data: leadsSample, error: sampleErr } = await supabase
    .from('leads')
    .select('id, niche, business_name, phone, has_website, is_lead, confidence, rejection_reason')
    .limit(10);

  console.log('Raw Ads Count:', rawCount, rawErr);
  console.log('Leads Count:', leadsCount, leadsErr);
  console.log('Leads Sample:', JSON.stringify(leadsSample, null, 2), sampleErr);
}

main().catch(console.error);
