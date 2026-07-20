import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../lib/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CLASSIFICATION_PROMPT } from '../lib/constants.js';

async function main() {
  const { data: rawAds } = await supabase
    .from('raw_ads')
    .select('*')
    .eq('niche', 'gym')
    .limit(3);

  console.log('Fetched raw ads:', rawAds.length);
  if (rawAds.length === 0) return;

  const key = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  // Let's use gemini-2.5-flash
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const adsJson = rawAds.map((ad, idx) => ({
    ad_index: idx,
    page_name: ad.page_name,
    ad_text: ad.ad_text?.substring(0, 500),
    cta_link: ad.cta_link,
    cta_type: ad.cta_type,
    city: ad.city,
  }));

  const prompt = CLASSIFICATION_PROMPT
    .replace(/\{\{niche\}\}/g, 'gym')
    .replace('{{ads_json}}', JSON.stringify(adsJson, null, 2));

  try {
    const result = await model.generateContent(prompt);
    console.log('Gemini Classification Response:', result.response.text());
  } catch (err) {
    console.error('Classification failed:', err);
  }
}

main().catch(console.error);
