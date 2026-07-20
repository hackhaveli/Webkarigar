-- =============================================
-- Lead Automation Pipeline — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Raw ads scraped from Meta Ads Library
CREATE TABLE IF NOT EXISTS raw_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  niche TEXT NOT NULL,
  page_id TEXT,
  page_name TEXT,
  ad_text TEXT,
  cta_link TEXT,
  cta_type TEXT,
  ad_start_date DATE,
  ad_snapshot_url TEXT,
  country TEXT,
  city TEXT,
  platform TEXT,
  impressions TEXT,
  spend TEXT,
  hash TEXT UNIQUE, -- md5(page_id + ad_text) for dedup
  raw_json JSONB,   -- full Apify result for reference
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classified leads (output of AI classification + enrichment)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_ad_id UUID REFERENCES raw_ads(id) ON DELETE CASCADE,
  niche TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  city TEXT,
  has_website BOOLEAN DEFAULT FALSE,
  cta_link TEXT,
  ad_text TEXT,
  is_lead BOOLEAN DEFAULT FALSE,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  rejection_reason TEXT,
  slug TEXT,
  demo_links JSONB,       -- array of demo link URLs
  message_draft TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_raw_ads_niche ON raw_ads(niche);
CREATE INDEX IF NOT EXISTS idx_raw_ads_hash ON raw_ads(hash);
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads(niche);
CREATE INDEX IF NOT EXISTS idx_leads_is_lead ON leads(is_lead);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_confidence ON leads(confidence);

-- Updated_at trigger for leads
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
