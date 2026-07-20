'use client';

import { useState, useEffect } from 'react';

const PRESETS = [
  {
    value: 'dentist',
    label: 'Dentist / Dental Clinic',
    searchKeywords: ['dentist', 'dental clinic', 'teeth whitening', 'orthodontist', 'dental care'],
    templateBases: ['webhypedentist-1', 'webhypedentist-2', 'webhypedentist-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi {{business_name}} team! I noticed you are running Meta ads but don\'t have a modern website. I designed 3 custom dental clinic website designs + logo + online booking system demo for you. Special launch deal for ₹5000. Let me know if you want to see the links!',
  },
  {
    value: 'chiropractor',
    label: 'Chiropractor',
    searchKeywords: ['chiropractor', 'chiropractic', 'back pain relief', 'spinal adjustment'],
    templateBases: ['webhypechiro-1', 'webhypechiro-2', 'webhypechiro-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hello! I saw your active ads for chiropractic care. I built 3 custom chiropractor website demos + booking automation for you. Let me know if I can drop the links here!',
  },
  {
    value: 'restaurant',
    label: 'Restaurant / Cafe',
    searchKeywords: ['restaurant', 'cafe', 'bistro', 'diner', 'pizzeria', 'sushi bar'],
    templateBases: ['webhyperestaurant-1', 'webhyperestaurant-2', 'webhyperestaurant-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi {{business_name}}! We love your menu. I designed 3 custom cafe/restaurant site demos + mobile-friendly digital menu system for you in ₹5000. Want to see the demo links?',
  },
  {
    value: 'realestate',
    label: 'Real Estate Agency',
    searchKeywords: ['real estate agent', 'realtor', 'property management', 'homes for sale'],
    templateBases: ['webhyperealestate-1', 'webhyperealestate-2', 'webhyperealestate-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hello! I noticed your property ads. I set up 3 custom real estate landing pages + property listing board demos for you. Can I share the links to see if they fit your brand?',
  },
  {
    value: 'plumbing',
    label: 'Plumbing Services',
    searchKeywords: ['plumber', 'plumbing service', 'leak repair', 'emergency plumber'],
    templateBases: ['webhypeplumbing-1', 'webhypeplumbing-2', 'webhypeplumbing-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi there! I saw you are running plumbing ads in your city. I put together 3 custom plumbing business websites + online service booking form demos for you. Let me know if you want to check them out!',
  },
  {
    value: 'electrician',
    label: 'Electrician',
    searchKeywords: ['electrician', 'electrical contractor', 'electrical repair', 'wiring'],
    templateBases: ['webhypeelectrician-1', 'webhypeelectrician-2', 'webhypeelectrician-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi {{business_name}}! I built 3 professional electrical service site designs + logo + estimate calculator demos for you. All in just ₹5000 deal. Interested in checking them out?',
  },
  {
    value: 'cleaning',
    label: 'Cleaning Services',
    searchKeywords: ['cleaning service', 'house cleaning', 'office cleaning', 'maid service'],
    templateBases: ['webhypecleaning-1', 'webhypecleaning-2', 'webhypecleaning-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hello! I noticed your ads for house/office cleaning. I designed 3 custom cleaning agency websites + booking schedule demos for you. All for only ₹5000. Let me know if you want to see the demos!',
  },
  {
    value: 'bakery',
    label: 'Bakery / Cake Shop',
    searchKeywords: ['bakery', 'cake shop', 'pastry', 'donuts', 'fresh bread'],
    templateBases: ['webhypebakery-1', 'webhypebakery-2', 'webhypebakery-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi! We saw your amazing cakes and breads. I built 3 custom bakery website designs + online pre-order form demos for you. Let me know if you\'d like to see the demo links!',
  },
  {
    value: 'photography',
    label: 'Photography',
    searchKeywords: ['photographer', 'wedding photography', 'portrait studio', 'videographer'],
    templateBases: ['webhypephoto-1', 'webhypephoto-2', 'webhypephoto-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hi {{business_name}}! Love your photos. I designed 3 custom portfolio website designs + client scheduler demos for you for ₹5000. Let me know if I can send you the links to check out!',
  },
  {
    value: 'lawyer',
    label: 'Lawyer / Law Firm',
    searchKeywords: ['lawyer', 'law firm', 'attorney', 'legal services', 'divorce lawyer'],
    templateBases: ['webhypelaw-1', 'webhypelaw-2', 'webhypelaw-3'],
    templateDomain: 'vercel.app',
    messageTemplate: 'Hello! I saw your legal service ads. I put together 3 premium law firm website + free consultation booking form demos for you. Let me know if you\'d like to check them out!',
  }
];

export default function NichesPage() {
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [templateBases, setTemplateBases] = useState('webhype{{niche}}-1, webhype{{niche}}-2, webhype{{niche}}-3');
  const [templateDomain, setTemplateDomain] = useState('vercel.app');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNiches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/niches');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNiches(data.niches || []);
    } catch (err) {
      showToast(`Failed to load niches: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNiches();
  }, []);

  const handlePresetSelect = (preset) => {
    setValue(preset.value);
    setLabel(preset.label);
    setSearchKeywords(preset.searchKeywords.join(', '));
    setMessageTemplate(preset.messageTemplate);
    setTemplateBases(preset.templateBases.join(', '));
    setTemplateDomain(preset.templateDomain);
    setIsEditing(false);
  };

  const resetForm = () => {
    setValue('');
    setLabel('');
    setSearchKeywords('');
    setMessageTemplate('Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo');
    setTemplateBases('webhype{{niche}}-1, webhype{{niche}}-2, webhype{{niche}}-3');
    setTemplateDomain('vercel.app');
    setIsEditing(false);
  };

  const handleEdit = (niche) => {
    setValue(niche.value);
    setLabel(niche.label);
    setSearchKeywords(niche.searchKeywords.join(', '));
    setMessageTemplate(niche.messageTemplate);
    setTemplateBases(niche.templateBases.join(', '));
    setTemplateDomain(niche.templateDomain || 'vercel.app');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || !label || !searchKeywords) {
      showToast('Niche ID, Name, and Keywords are required', 'error');
      return;
    }

    const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const keywordsArr = searchKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const basesArr = templateBases.replace(/\{\{niche\}\}/g, cleanValue).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: cleanValue,
          label,
          searchKeywords: keywordsArr,
          templateBases: basesArr,
          templateDomain,
          messageTemplate,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast(isEditing ? 'Niche updated successfully' : 'Niche created successfully');
      resetForm();
      fetchNiches();
    } catch (err) {
      showToast(`Failed to save niche: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (nicheValue) => {
    if (['gym', 'salon', 'coaching'].includes(nicheValue)) {
      showToast('Core system niches (gym, salon, coaching) cannot be deleted', 'error');
      return;
    }
    if (!confirm('Are you sure you want to delete this niche? All future scrapes for this niche will be disabled.')) return;

    try {
      const res = await fetch('/api/niches', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: nicheValue }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast('Niche deleted successfully');
      fetchNiches();
      if (value === nicheValue) resetForm();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title text-gradient">Niche Manager</h1>
        <p className="page-subtitle">
          Configure pipeline niches, customize keywords for Meta scraping, and edit custom WhatsApp offer drafts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 32, alignItems: 'start' }}>
        
        {/* Left Column: Form & Presets */}
        <div>
          {/* Niche Configuration Form */}
          <div className="card glass-panel" style={{ padding: 24, marginBottom: 32 }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h2 className="card-title">{isEditing ? '📝 Edit Niche' : '➕ Create Custom Niche'}</h2>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 200px' }}>
                  <label className="form-label">Niche ID (alphanumeric only)</label>
                  <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    placeholder="e.g. dentist"
                    disabled={isEditing}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: '1 1 250px' }}>
                  <label className="form-label">Niche Display Name</label>
                  <input
                    type="text"
                    className="input"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Dentist / Dental Clinic"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meta Search Keywords (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder="e.g. dentist, dental clinic, teeth whitening, orthodontist"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 300px' }}>
                  <label className="form-label">Template Subdomains (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={templateBases}
                    onChange={(e) => setTemplateBases(e.target.value)}
                    placeholder="e.g. webhypedentist-1, webhypedentist-2"
                  />
                </div>
                <div className="form-group" style={{ flex: '1 1 150px' }}>
                  <label className="form-label">Template Base Domain</label>
                  <input
                    type="text"
                    className="input"
                    value={templateDomain}
                    onChange={(e) => setTemplateDomain(e.target.value)}
                    placeholder="vercel.app"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Message Template</label>
                <textarea
                  className="textarea"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  rows={4}
                  placeholder="Draft your pitch. Use {{business_name}}, {{demo_link_1}}, {{demo_link_2}} for dynamic tags."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                {(isEditing || value || label || searchKeywords) && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel / Clear
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Niche' : 'Save Niche'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick-Add Niche Templates */}
          <div className="card glass-panel" style={{ padding: 24 }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h2 className="card-title">💡 High-Value Niche Templates</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click template to pre-fill form</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {PRESETS.map((p) => {
                const isExists = niches.some((n) => n.value === p.value);
                return (
                  <div
                    key={p.value}
                    onClick={() => handlePresetSelect(p)}
                    className="table-row-hover"
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isExists ? 0.65 : 1
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {p.label} {isExists && '✓'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6, lineClamp: 2, overflow: 'hidden' }}>
                        Keywords: {p.searchKeywords.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Niches List */}
        <div>
          <div className="card glass-panel" style={{ padding: 24 }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h2 className="card-title">🏷️ Active Pipeline Niches</h2>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : niches.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 12 }}>
                No active niches found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {niches.map((n) => (
                  <div
                    key={n.value}
                    className="card-glow-emerald"
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.98rem' }}>{n.label}</div>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--confidence-high)', marginTop: 2 }}>
                          niche_id: {n.value}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleEdit(n)}
                        >
                          ✏️
                        </button>
                        {!['gym', 'salon', 'coaching'].includes(n.value) && (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--confidence-low)' }}
                            onClick={() => handleDelete(n.value)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 10 }}>
                      <span style={{ fontWeight: 600 }}>Keywords: </span>
                      {n.searchKeywords.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
