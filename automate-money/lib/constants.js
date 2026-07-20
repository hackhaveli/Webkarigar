/**
 * Niche configuration map
 * Each niche has template bases, message templates, and search keywords.
 * Add new niches here to expand the pipeline.
 */

import { getNiches } from './niches.js';

export const NICHES = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    return getNiches()[prop];
  },
  ownKeys(target) {
    return Reflect.ownKeys(getNiches());
  },
  getOwnPropertyDescriptor(target, prop) {
    return {
      enumerable: true,
      configurable: true,
      value: getNiches()[prop]
    };
  }
});

/**
 * Classification prompt template for Gemini.
 * Variables: {{niche}}, {{ads_json}}
 */
export const CLASSIFICATION_PROMPT = `You are an expert lead classifier for a web design agency. Your job is to analyze Facebook/Meta ads and determine which advertisers are potential leads for website design services.

**Niche**: {{niche}}

**Classification Rules**:
1. **is_lead = true** if the business:
   - Is a local/small business running ads (not a large chain, franchise, or digital platform)
   - Appears to NOT have a professional website (CTA goes to Facebook page, Instagram, WhatsApp, or a basic landing page)
   - Is in the {{niche}} niche or closely related
   - Note: A phone number is NOT strictly required to be a lead. If they don't have a website but no phone is in the copy, still set is_lead = true (set confidence = medium or low).

2. **is_lead = false** if:
   - The ad links to a professional, well-designed website
   - It's a large brand/chain/franchise
   - It's not relevant to the {{niche}} niche
   - It's a digital app, software, game, or online service (specifically reject short drama apps, romance story apps, web novel apps, e.g. DramaBox, MoboReader, GoodNovel, Love Channel, etc.)
   - It's a scam, spam, or irrelevant ad

3. **Confidence levels**:
   - **high**: Clear local business, no website, phone number is visible in text or CTA, perfect niche match
   - **medium**: Local business, no website, but no phone number visible in the text (we can still message them)
   - **low**: Possible lead but significant uncertainty

4. **Extract these fields** from the ad text and CTA:
   - business_name: The business name (from page name or ad text)
   - phone: Phone number if visible (any format)
   - city: City/location if mentioned
   - has_website: true if the CTA links to a real website (not facebook.com, instagram.com, wa.me, bit.ly, or app store links)

**Analyze the following ads and return a JSON array**:

{{ads_json}}

**Return format** (strict JSON array, no markdown):
[
  {
    "ad_index": 0,
    "is_lead": true,
    "confidence": "high",
    "business_name": "Example Gym",
    "phone": "+1234567890",
    "city": "Mumbai",
    "has_website": false,
    "rejection_reason": null
  }
]

Return ONLY the JSON array, no explanation or markdown.`;

/**
 * Pagination defaults
 */
export const LEADS_PER_PAGE = 25;

/**
 * Status options for leads
 */
export const LEAD_STATUSES = ['pending', 'sent', 'replied', 'closed'];

/**
 * Confidence levels
 */
export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'];
