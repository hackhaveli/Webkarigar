import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';

async function main() {
  const { data: rawAds } = await supabase
    .from('raw_ads')
    .select('niche, page_name, ad_text, cta_link')
    .neq('page_name', 'Iron & Steel Fitness Club')
    .neq('page_name', 'FitLife Yoga & Pilates Studio')
    .neq('page_name', 'Gold Star Gym')
    .neq('page_name', 'Glow & Glamour Beauty Salon')
    .neq('page_name', 'The Crown Hair Studio')
    .neq('page_name', 'Abhishek Roy Business Coaching')
    .neq('page_name', 'Mind Shift Life Coaching');

  console.log('Total non-mock raw ads:', rawAds.length);

  const pageNames = new Map();
  rawAds.forEach(ad => {
    pageNames.set(ad.page_name, (pageNames.get(ad.page_name) || 0) + 1);
  });

  const sortedPages = Array.from(pageNames.entries()).sort((a, b) => b[1] - a[1]);
  console.log('Top 15 page names in raw_ads:', sortedPages.slice(0, 15));

  // Let's print 5 ads that have some actual gym-like content if any
  const gymAds = rawAds.filter(ad => {
    const text = (ad.ad_text || '').toLowerCase();
    return text.includes('gym') || text.includes('fitness') || text.includes('trainer') || text.includes('workout');
  });
  console.log('Number of raw ads matching gym/fitness keywords in text:', gymAds.length);
  if (gymAds.length > 0) {
    console.log('Sample gym raw ad:', JSON.stringify(gymAds[0], null, 2));
  }
}

main().catch(console.error);
