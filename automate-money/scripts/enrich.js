/**
 * CLI Script: Enrich qualified leads
 * Usage: node scripts/enrich.js <niche>
 *
 * Example: node scripts/enrich.js gym
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { enrichAllLeads } from '../lib/enrich.js';
import { NICHES } from '../lib/constants.js';

const [, , niche] = process.argv;

if (!niche || !NICHES[niche]) {
  console.error(`❌ Usage: node scripts/enrich.js <niche>`);
  console.error(`   Available niches: ${Object.keys(NICHES).join(', ')}`);
  process.exit(1);
}

console.log(`✨ Enriching leads for niche="${niche}"`);

try {
  const stats = await enrichAllLeads(niche);
  console.log(`\n✅ Enrichment complete!`);
  console.log(`   Total processed: ${stats.total}`);
  console.log(`   Enriched:        ${stats.enriched}`);
  console.log(`   Errors:          ${stats.errors}`);
} catch (err) {
  console.error(`\n❌ Enrichment failed: ${err.message}`);
  process.exit(1);
}
