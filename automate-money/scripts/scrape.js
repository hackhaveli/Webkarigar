/**
 * CLI Script: Scrape Meta Ads Library
 * Usage: node scripts/scrape.js <niche> [city1,city2,...] [country]
 *
 * Example: node scripts/scrape.js gym Mumbai,Delhi IN
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { scrapeAndStore } from '../lib/apify.js';
import { NICHES } from '../lib/constants.js';

const [, , niche, citiesArg, country = 'IN'] = process.argv;

if (!niche || !NICHES[niche]) {
  console.error(`❌ Usage: node scripts/scrape.js <niche> [cities] [country]`);
  console.error(`   Available niches: ${Object.keys(NICHES).join(', ')}`);
  process.exit(1);
}

const nicheConfig = NICHES[niche];
const keywords = nicheConfig.searchKeywords;

// If cities provided, append to keywords
if (citiesArg) {
  const cities = citiesArg.split(',').map((c) => c.trim());
  const expandedKeywords = [];
  for (const kw of keywords) {
    for (const city of cities) {
      expandedKeywords.push(`${kw} ${city}`);
    }
  }
  keywords.push(...expandedKeywords);
}

console.log(`🚀 Scraping niche="${niche}", country="${country}"`);
console.log(`🔑 Keywords: ${keywords.join(', ')}`);

try {
  const stats = await scrapeAndStore(niche, keywords, country);
  console.log(`\n✅ Scrape complete!`);
  console.log(`   Total scraped: ${stats.total}`);
  console.log(`   New ads:       ${stats.new}`);
  console.log(`   Duplicates:    ${stats.duplicates}`);
} catch (err) {
  console.error(`\n❌ Scrape failed: ${err.message}`);
  process.exit(1);
}
