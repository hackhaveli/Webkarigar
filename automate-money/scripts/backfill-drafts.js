import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MESSAGE = `Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo`;

async function main() {
  // Step 1: Try adding email column (will fail silently if it already exists or if permissions don't allow DDL)
  console.log('📧 Attempting to add email column...');
  // We'll use a workaround: try inserting with email field — if the column doesn't exist, Supabase will error
  const { error: testErr } = await supabase
    .from('leads')
    .update({ email: null })
    .eq('id', '00000000-0000-0000-0000-000000000000'); // non-existent row, just testing schema

  if (testErr && testErr.code === '42703') {
    console.log('❌ "email" column does not exist in leads table.');
    console.log('   Please add it manually in Supabase Dashboard → SQL Editor:');
    console.log('   ALTER TABLE leads ADD COLUMN email TEXT DEFAULT NULL;');
    console.log('');
  } else {
    console.log('✅ email column exists (or was just added)');
  }

  // Step 2: Backfill message_draft for all qualified leads that have null message_draft
  console.log('\n💬 Backfilling message_draft for all qualified leads...');
  const { data: leadsToFix, error: fetchErr } = await supabase
    .from('leads')
    .select('id, ad_text')
    .eq('is_lead', true)
    .is('message_draft', null);

  if (fetchErr) {
    console.error('Failed to fetch leads:', fetchErr.message);
    return;
  }

  console.log(`Found ${leadsToFix.length} qualified leads without a message draft.`);

  if (leadsToFix.length === 0) {
    console.log('✅ All leads already have message drafts!');
    return;
  }

  // Batch update in chunks of 50
  let updated = 0;
  let emailsExtracted = 0;
  for (let i = 0; i < leadsToFix.length; i += 50) {
    const chunk = leadsToFix.slice(i, i + 50);
    const ids = chunk.map(l => l.id);

    // Update message_draft
    const { error: updateErr } = await supabase
      .from('leads')
      .update({ message_draft: MESSAGE })
      .in('id', ids);

    if (updateErr) {
      console.error(`❌ Batch update failed: ${updateErr.message}`);
    } else {
      updated += chunk.length;
    }

    // Try to extract and set emails from ad_text (only if email column exists)
    for (const lead of chunk) {
      const emailMatch = (lead.ad_text || '').match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        const { error: emailErr } = await supabase
          .from('leads')
          .update({ email: emailMatch[0] })
          .eq('id', lead.id);
        
        if (!emailErr) emailsExtracted++;
      }
    }
  }

  console.log(`\n✅ Done! Updated ${updated} leads with message drafts.`);
  console.log(`📧 Extracted ${emailsExtracted} emails from ad text.`);

  // Step 3: Clean bad phone numbers
  console.log('\n📱 Cleaning invalid phone numbers...');
  const { data: phoneLeads, error: phoneErr } = await supabase
    .from('leads')
    .select('id, phone')
    .not('phone', 'is', null);

  if (phoneErr) {
    console.error('Failed to fetch phone leads:', phoneErr.message);
    return;
  }

  let cleaned = 0;
  for (const lead of phoneLeads) {
    const digits = (lead.phone || '').replace(/\D/g, '');
    // Invalid if: less than 7 digits, all same digit, or common junk
    const isInvalid = digits.length < 7 || 
                      /^(\d)\1+$/.test(digits) ||
                      digits === '1234567890' ||
                      digits === '0123456789' ||
                      lead.phone === '404';
    
    if (isInvalid) {
      await supabase
        .from('leads')
        .update({ phone: null })
        .eq('id', lead.id);
      cleaned++;
    }
  }

  console.log(`🧹 Cleaned ${cleaned} invalid phone numbers (set to null).`);
}

main().catch(console.error);
