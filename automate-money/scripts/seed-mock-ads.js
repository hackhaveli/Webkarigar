/**
 * CLI Script: Seed Mock Ads
 * Seeds the database with realistic raw ads for testing the pipeline when scraping is blocked.
 * Usage: node scripts/seed-mock-ads.js
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';

const MOCK_ADS = [
  // Gym Niche
  {
    niche: 'gym',
    page_name: 'Iron & Steel Fitness Club',
    ad_text: 'Get fit for summer! 🏋️‍♂️ Join Iron & Steel Fitness Club today and get 50% off your first 3 months. Fully equipped gym, personal trainers, and group classes available. Message us on WhatsApp at +919876543210 or visit our page to sign up!',
    cta_link: 'https://wa.me/919876543210',
    cta_type: 'SEND_WHATSAPP_MESSAGE',
    city: 'Mumbai',
    country: 'IN',
    platform: 'facebook,instagram',
  },
  {
    niche: 'gym',
    page_name: 'FitLife Yoga & Pilates Studio',
    ad_text: 'Find your balance. 🧘‍♀️ Unlimited yoga and pilates classes for just ₹1999/month. Direct message us on Instagram @fitlifeyoga to book your first free trial session!',
    cta_link: 'https://instagram.com/fitlifeyoga',
    cta_type: 'SEND_MESSAGE',
    city: 'Delhi',
    country: 'IN',
    platform: 'instagram',
  },
  {
    niche: 'gym',
    page_name: 'Gold Star Gym',
    ad_text: 'Gold Star Gym premium membership: modern machines, spa, sauna, and dietitian support. Check out our website to read more and find a branch near you: https://www.goldstargyms.com',
    cta_link: 'https://www.goldstargyms.com',
    cta_type: 'LEARN_MORE',
    city: 'Bangalore',
    country: 'IN',
    platform: 'facebook',
  },

  // Salon Niche
  {
    niche: 'salon',
    page_name: 'Glow & Glamour Beauty Salon',
    ad_text: 'Transform your look! ✨ Get a premium haircut, facial, and mani-pedi combo for only ₹1499. Limited slots available. Call or WhatsApp us at +919812345678 to reserve your slot now.',
    cta_link: 'https://wa.me/919812345678',
    cta_type: 'BOOK_NOW',
    city: 'Delhi',
    country: 'IN',
    platform: 'facebook,instagram',
  },
  {
    niche: 'salon',
    page_name: 'The Crown Hair Studio',
    ad_text: 'Specializing in balayage, keratin treatments, and hair extensions. Check out our portfolio on our Facebook page and message us to get a free consultation!',
    cta_link: 'https://facebook.com/crownhairmumbai',
    cta_type: 'SEND_MESSAGE',
    city: 'Mumbai',
    country: 'IN',
    platform: 'facebook',
  },

  // Coaching Niche
  {
    niche: 'coaching',
    page_name: 'Abhishek Roy Business Coaching',
    ad_text: 'Are you struggling to scale your agency to ₹10 Lakhs/month? 🚀 Sign up for my exclusive 1-on-1 business scaling mentorship program. DM me to book a discovery call or text +919900990099.',
    cta_link: 'https://wa.me/919900990099',
    cta_type: 'CONTACT_US',
    city: 'Kolkata',
    country: 'IN',
    platform: 'facebook,instagram',
  },
  {
    niche: 'coaching',
    page_name: 'Mind Shift Life Coaching',
    ad_text: 'Achieve clarity, focus, and peak performance. Learn the daily habits of high achievers. Visit our site to download your free guide: https://www.mindshiftcoaching.com/free-guide',
    cta_link: 'https://www.mindshiftcoaching.com/free-guide',
    cta_type: 'DOWNLOAD',
    city: 'Pune',
    country: 'IN',
    platform: 'facebook',
  }
];

function createAdHash(pageName, adText) {
  const str = `${pageName || ''}|${adText || ''}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

async function seed() {
  if (!supabase) {
    console.error('❌ Supabase client is not configured. Check your env variables.');
    process.exit(1);
  }

  console.log('🌱 Seeding mock raw ads into Supabase...');

  let inserted = 0;
  let skipped = 0;

  for (const ad of MOCK_ADS) {
    const hash = createAdHash(ad.page_name, ad.ad_text);
    
    // Check if duplicate
    const { data: existing } = await supabase
      .from('raw_ads')
      .select('id')
      .eq('hash', hash)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const row = {
      niche: ad.niche,
      page_id: 'mock_' + Math.random().toString(36).substr(2, 9),
      page_name: ad.page_name,
      ad_text: ad.ad_text,
      cta_link: ad.cta_link,
      cta_type: ad.cta_type,
      ad_start_date: new Date().toISOString().slice(0, 10),
      ad_snapshot_url: 'https://www.facebook.com/ads/library/?id=' + Math.floor(Math.random() * 10000000),
      country: ad.country,
      city: ad.city,
      platform: ad.platform,
      impressions: '1K-5K',
      spend: '< ₹1000',
      hash,
      raw_json: ad,
    };

    const { error } = await supabase.from('raw_ads').insert(row);
    if (error) {
      console.error(`❌ Error inserting mock ad: ${error.message}`);
    } else {
      inserted++;
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped (already exist): ${skipped}`);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
