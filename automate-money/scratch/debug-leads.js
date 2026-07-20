import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';

async function main() {
  // Get columns for leads table
  const { data: sample } = await supabase
    .from('leads')
    .select('*')
    .eq('is_lead', true)
    .limit(5);

  if (sample && sample.length > 0) {
    console.log('=== COLUMNS ===');
    console.log(Object.keys(sample[0]));
    console.log('\n=== SAMPLE QUALIFIED LEADS ===');
    sample.forEach((l, i) => {
      console.log(`\n--- Lead ${i+1} ---`);
      console.log('  business_name:', l.business_name);
      console.log('  phone:', JSON.stringify(l.phone));
      console.log('  email:', JSON.stringify(l.email));
      console.log('  message_draft:', JSON.stringify(l.message_draft));
      console.log('  niche:', l.niche);
      console.log('  confidence:', l.confidence);
      console.log('  has_website:', l.has_website);
      console.log('  cta_link:', l.cta_link);
    });
  }

  // Count leads with phone numbers
  const { data: withPhone } = await supabase
    .from('leads')
    .select('phone')
    .eq('is_lead', true)
    .not('phone', 'is', null);

  console.log('\n=== PHONE STATS ===');
  console.log('Total with phone:', withPhone?.length);
  if (withPhone) {
    const phones = withPhone.map(l => l.phone).filter(Boolean);
    console.log('Sample phones:', phones.slice(0, 10));
  }

  // Count leads with message_draft
  const { data: withDraft } = await supabase
    .from('leads')
    .select('message_draft')
    .eq('is_lead', true)
    .not('message_draft', 'is', null);

  console.log('\n=== MESSAGE DRAFT STATS ===');
  console.log('Total with message_draft:', withDraft?.length);
}

main().catch(console.error);
