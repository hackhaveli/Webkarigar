'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ScrapePage() {
  const [niches, setNiches] = useState([]);
  const [niche, setNiche] = useState('gym');
  const [country, setCountry] = useState('IN');
  const [maxItems, setMaxItems] = useState(200);
  const [batchSize, setBatchSize] = useState(10);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      const res = await fetch('/api/niches');
      const data = await res.json();
      if (data.niches && data.niches.length > 0) {
        setNiches(data.niches);
        setNiche(data.niches[0].value);
      }
    } catch (e) {
      console.error('Failed to load niches in UI:', e);
    }
  };

  const [scrapeResult, setScrapeResult] = useState(null);
  const [classifyResult, setClassifyResult] = useState(null);
  const [enrichResult, setEnrichResult] = useState(null);

  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [classifyLoading, setClassifyLoading] = useState(false);
  const [enrichLoading, setEnrichLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const runScrape = async () => {
    setScrapeLoading(true);
    setScrapeResult(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, country, maxItems }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScrapeResult({ success: true, stats: data.stats });
      showToast(`Scraped ${data.stats.new} new ads!`);
    } catch (err) {
      setScrapeResult({ success: false, error: err.message });
      showToast(`Scrape failed: ${err.message}`, 'error');
    } finally {
      setScrapeLoading(false);
    }
  };

  const runClassify = async () => {
    setClassifyLoading(true);
    setClassifyResult(null);
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, batchSize }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClassifyResult({ success: true, stats: data.stats });
      showToast(`Classified ${data.stats.total} ads — ${data.stats.leads} leads found!`);
    } catch (err) {
      setClassifyResult({ success: false, error: err.message });
      showToast(`Classification failed: ${err.message}`, 'error');
    } finally {
      setClassifyLoading(false);
    }
  };

  const runEnrich = async () => {
    setEnrichLoading(true);
    setEnrichResult(null);
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEnrichResult({ success: true, stats: data.stats });
      showToast(`Enriched ${data.stats.enriched} leads!`);
    } catch (err) {
      setEnrichResult({ success: false, error: err.message });
      showToast(`Enrichment failed: ${err.message}`, 'error');
    } finally {
      setEnrichLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title text-gradient">Automation Pipeline</h1>
        <p className="page-subtitle">
          Trigger the multi-stage pipeline using the official Meta Graph API and AI classifiers.
        </p>
      </div>

      {/* Global Settings */}
      <div className="card glass-panel" style={{ marginBottom: 32, padding: 24 }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
          <h2 className="card-title">⚙️ Pipeline Parameters</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div className="form-group" style={{ minWidth: 180 }}>
            <label className="form-label">Niche Target</label>
            <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
              {niches.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 120 }}>
            <label className="form-label">Country</label>
            <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AE">UAE</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 120 }}>
            <label className="form-label">Max Ads</label>
            <input
              type="number"
              className="input"
              value={maxItems}
              onChange={(e) => setMaxItems(parseInt(e.target.value) || 200)}
              min={10}
              max={1000}
            />
          </div>
          <div className="form-group" style={{ minWidth: 120 }}>
            <label className="form-label">AI Batch Size</label>
            <input
              type="number"
              className="input"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 10)}
              min={1}
              max={25}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="pipeline-grid" style={{ gap: 24 }}>
        {/* Step 1: Scrape */}
        <div className="pipeline-card glass-panel card-glow-emerald" style={{ padding: 24, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <div className="pipeline-step-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="pipeline-step" style={{ margin: 0, width: 36, height: 36, fontSize: '1rem', fontWeight: 800 }}>1</div>
            <h3 className="pipeline-title" style={{ margin: 0, fontSize: '1.15rem' }}>🔍 Meta Ads Scrape</h3>
          </div>
          <p className="pipeline-desc" style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Query Meta's Ads Archive directly using your developer Access Token.
            Downloads active ads, hashes duplicates, and saves raw copy.
          </p>
          <button
            className={`btn btn-primary ${scrapeLoading ? 'btn-loading' : ''}`}
            onClick={runScrape}
            disabled={scrapeLoading}
            style={{ width: '100%', py: 12 }}
          >
            {scrapeLoading ? 'Querying Meta API...' : 'Run Scrape'}
          </button>
          {scrapeResult && (
            <div className={`pipeline-result ${scrapeResult.success ? 'success' : 'error'}`} style={{ marginTop: 16 }}>
              {scrapeResult.success ? (
                <>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>✅ Scrape Completed</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    New: {scrapeResult.stats.new} | Total: {scrapeResult.stats.total} | Skip: {scrapeResult.stats.duplicates}
                  </div>
                </>
              ) : (
                <div style={{ fontWeight: 600 }}>❌ {scrapeResult.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Classify */}
        <div className="pipeline-card glass-panel card-glow-amber" style={{ padding: 24, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <div className="pipeline-step-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="pipeline-step" style={{ margin: 0, width: 36, height: 36, fontSize: '1rem', fontWeight: 800 }}>2</div>
            <h3 className="pipeline-title" style={{ margin: 0, fontSize: '1.15rem' }}>🤖 AI Classification</h3>
          </div>
          <p className="pipeline-desc" style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Evaluate raw ads using Gemini AI. Identifies local businesses that lack professional websites, extracts phone numbers, and flags leads.
          </p>
          <button
            className={`btn btn-primary ${classifyLoading ? 'btn-loading' : ''}`}
            onClick={runClassify}
            disabled={classifyLoading}
            style={{ width: '100%', py: 12 }}
          >
            {classifyLoading ? 'AI Processing...' : 'Run Classification'}
          </button>
          {classifyResult && (
            <div className={`pipeline-result ${classifyResult.success ? 'success' : 'error'}`} style={{ marginTop: 16 }}>
              {classifyResult.success ? (
                <>
                  <div style={{ fontWeight: 600 }}>✅ Classification Completed</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Leads: {classifyResult.stats.leads} | Rejected: {classifyResult.stats.rejected} | Total: {classifyResult.stats.total}
                  </div>
                </>
              ) : (
                <div style={{ fontWeight: 600 }}>❌ {classifyResult.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Enrich */}
        <div className="pipeline-card glass-panel card-glow-green" style={{ padding: 24, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <div className="pipeline-step-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="pipeline-step" style={{ margin: 0, width: 36, height: 36, fontSize: '1rem', fontWeight: 800 }}>3</div>
            <h3 className="pipeline-title" style={{ margin: 0, fontSize: '1.15rem' }}>✨ Lead Enrichment</h3>
          </div>
          <p className="pipeline-desc" style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Generate personalized message templates, mobile app bundles, and customizable ₹5000 website design deals for WhatsApp outreach.
          </p>
          <button
            className={`btn btn-primary ${enrichLoading ? 'btn-loading' : ''}`}
            onClick={runEnrich}
            disabled={enrichLoading}
            style={{ width: '100%', py: 12 }}
          >
            {enrichLoading ? 'Drafting Offers...' : 'Run Enrichment'}
          </button>
          {enrichResult && (
            <div className={`pipeline-result ${enrichResult.success ? 'success' : 'error'}`} style={{ marginTop: 16 }}>
              {enrichResult.success ? (
                <>
                  <div style={{ fontWeight: 600 }}>✅ Enrichment Completed</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Enriched: {enrichResult.stats.enriched} | Errors: {enrichResult.stats.errors}
                  </div>
                </>
              ) : (
                <div style={{ fontWeight: 600 }}>❌ {enrichResult.error}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick link */}
      <div className="card glass-panel" style={{ marginTop: 32, padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBreak: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Pipeline finished? Go to reviews:
          </span>
          <Link href="/leads" className="btn btn-success btn-sm" style={{ padding: '8px 20px', background: 'var(--confidence-high)', color: 'black', fontWeight: 700 }}>
            👥 View Leads Dashboard →
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}
