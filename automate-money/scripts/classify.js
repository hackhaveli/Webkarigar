/**
 * CLI Script: Classify raw ads using Gemini AI
 * Usage: node scripts/classify.js <niche> [batchSize]
 *
 * Example: node scripts/classify.js gym 15
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { classifyAds } from '../lib/gemini.js';
import { NICHES } from '../lib/constants.js';

const [, , niche, batchSizeArg] = process.argv;
const batchSize = parseInt(batchSizeArg) || 10;

if (!niche || !NICHES[niche]) {
  console.error(`❌ Usage: node scripts/classify.js <niche> [batchSize]`);
  console.error(`   Available niches: ${Object.keys(NICHES).join(', ')}`);
  process.exit(1);
}

console.log(`🤖 Classifying ads for niche="${niche}", batch size=${batchSize}`);

try {
  const stats = await classifyAds(niche, batchSize);
  console.log(`\n✅ Classification complete!`);
  console.log(`   Total processed:  ${stats.total}`);
  console.log(`   Leads found:      ${stats.leads}`);
  console.log(`   Rejected:         ${stats.rejected}`);
  console.log(`   Low confidence:   ${stats.lowConfidence}`);
} catch (err) {
  console.error(`\n❌ Classification failed: ${err.message}`);
  process.exit(1);
}
