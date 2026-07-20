import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';

async function main() {
  const { data: rawAds } = await supabase
    .from('raw_ads')
    .select('niche, page_name, ad_text, cta_link, country')
    .limit(10);

  console.log('Sample of raw ads:', JSON.stringify(rawAds, null, 2));
}

main().catch(console.error);
