import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/SvPage.css';

/* ── Inline SVG icons ─────────────────────────────────────── */
const Ic = ({ d, size = 20, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const ICONS = {
  file:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  plus:     ['M12 5v14','M5 12h14'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:    ['M3 6h18','M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6','M10 11v6','M14 11v6','M9 6V4h6v2'],
  search:   ['M21 21l-4.35-4.35','M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0'],
  calendar: ['M3 4h18v18H3z','M16 2v4','M8 2v4','M3 10h18'],
  card:     ['M2 7h20v14H2z','M2 11h20'],
  close:    ['M18 6L6 18','M6 6l12 12'],
  check:    'M20 6L9 17l-5-5',
};

/* ── Type colour map ──────────────────────────────────────── */
const TYPE_COLOR = {
  Aadhaar:          '#3b82f6',
  PAN:              '#f59e0b',
  Passport:         '#8b5cf6',
  'Driving License':'#10b981',
  'Voter ID':       '#ec4899',
  Insurance:        '#06b6d4',
  Other:            '#64748b',
};

const DOC_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 'Insurance', 'Other'];

/* ── Expiry badge helper ──────────────────────────────────── */
const expiryStatus = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / 86400000);
  if (days < 0)   return { label: 'Expired',      color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)' };
  if (days < 90)  return { label: `${days}d left`, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' };
  return { label: new Date(dateStr).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
           color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' };
};

/* ═══ MAIN COMPONENT ══════════════════════════════════════════ */
const Documents = () => {
  const [documents, setDocuments]   = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [current, setCurrent]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm] = useState({
    type: 'Aadhaar', documentNumber: '', issuer: '', expiryDate: '', notes: ''
  });

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try { const r = await api.get('/documents'); setDocuments(r.data); }
    catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const openModal = (doc = null) => {
    if (doc) {
      setCurrent(doc);
      setForm({
        type: doc.type,
        documentNumber: doc.documentNumber,
        issuer: doc.issuer || '',
        expiryDate: doc.expiryDate ? doc.expiryDate.split('T')[0] : '',
        notes: doc.notes || '',
      });
    } else {
      setCurrent(null);
      setForm({ type: 'Aadhaar', documentNumber: '', issuer: '', expiryDate: '', notes: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!payload.expiryDate) delete payload.expiryDate;
    try {
      if (current) {
        const r = await api.put(`/documents/${current._id}`, payload);
        setDocuments(documents.map(d => d._id === current._id ? r.data : d));
      } else {
        const r = await api.post('/documents', payload);
        setDocuments([r.data, ...documents]);
      }
      setShowModal(false);
    } catch (e) { console.error(e); alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document record?')) return;
    try { await api.delete(`/documents/${id}`); setDocuments(documents.filter(d => d._id !== id)); }
    catch (e) { console.error(e); }
  };

  const filtered = documents.filter(d =>
    d.type.toLowerCase().includes(search.toLowerCase()) ||
    d.documentNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sv-page">

      {/* ── Header ── */}
      <div className="sv-page-header">
        <div className="sv-page-title">
          <div className="sv-page-title-icon" style={{ background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.25)' }}>
            <Ic d={ICONS.file} size={22} style={{ color:'#34d399' }}/>
          </div>
          <div>
            <h1>Identity Documents</h1>
            <p>
              {documents.length > 0 ? `${documents.length} document${documents.length > 1 ? 's' : ''} stored` : 'Store your critical identity documents'}
            </p>
          </div>
        </div>
        <button className="sv-btn sv-btn-primary" onClick={() => openModal()}>
          <Ic d={ICONS.plus} size={16}/> Add Document
        </button>
      </div>

      {/* ── Search ── */}
      <div className="sv-search-wrap">
        <span className="sv-search-icon"><Ic d={ICONS.search} size={16}/></span>
        <input className="sv-search" type="text" placeholder="Search by type or document number…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="sv-loading">
          <div className="sv-spinner"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sv-empty">
          <div className="sv-empty-icon"><Ic d={ICONS.file} size={32}/></div>
          <h3>{search ? 'No results found' : 'No documents yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Add your Aadhaar, PAN, Passport and other identity documents.'}</p>
          {!search && (
            <button className="sv-btn-primary" style={{ marginTop:'1rem' }} onClick={() => openModal()}>
              <Ic d={ICONS.plus} size={16}/> Add Document
            </button>
          )}
        </div>
      ) : (
        <div className="sv-items-grid">
          {filtered.map((doc, idx) => {
            const color  = TYPE_COLOR[doc.type] || '#60a5fa';
            const expiry = expiryStatus(doc.expiryDate);
            return (
              <div key={doc._id} className="sv-item-card" style={{ borderLeft: `3px solid ${color}`, animationDelay: `${idx * 50}ms` }}>

                {/* action buttons */}
                <div className="sv-item-actions">
                  <button className="sv-action-btn" title="Edit" onClick={() => openModal(doc)}>
                    <Ic d={ICONS.edit} size={14}/>
                  </button>
                  <button className="sv-action-btn sv-action-delete" title="Delete" onClick={() => handleDelete(doc._id)}>
                    <Ic d={ICONS.trash} size={14}/>
                  </button>
                </div>

                {/* Type badge */}
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.1rem' }}>
                  <span style={{
                    fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase',
                    fontFamily:"'Space Mono',monospace",
                    color, background:`${color}15`, border:`1px solid ${color}30`,
                    padding:'0.2rem 0.6rem', borderRadius:'6px',
                  }}>{doc.type}</span>
                  {expiry && (
                    <span style={{
                      fontSize:'0.68rem', fontWeight:700, fontFamily:"'Space Mono',monospace",
                      color: expiry.color, background: expiry.bg, border:`1px solid ${expiry.border}`,
                      padding:'0.2rem 0.55rem', borderRadius:'6px',
                    }}>{expiry.label}</span>
                  )}
                </div>

                {/* Doc number */}
                <div style={{ marginBottom:'1rem' }}>
                  <p style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'1px', color:'var(--muted)', marginBottom:'0.3rem' }}>
                    Document Number
                  </p>
                  <p style={{
                    fontFamily:"'Space Mono',monospace", fontSize:'1.05rem', fontWeight:700,
                    letterSpacing:'2px', color:'var(--text)', wordBreak:'break-all',
                  }}>{doc.documentNumber}</p>
                </div>

                {/* Issuer / Expiry row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  {doc.issuer && (
                    <div>
                      <p style={{ fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'1px', color:'var(--subtle)', marginBottom:'0.25rem', display:'flex', alignItems:'center', gap:'4px' }}>
                        <Ic d={ICONS.card} size={11}/> Issuer
                      </p>
                      <p style={{ fontSize:'0.84rem', color:'var(--muted)', fontWeight:500 }}>{doc.issuer}</p>
                    </div>
                  )}
                  {doc.expiryDate && (
                    <div>
                      <p style={{ fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'1px', color:'var(--subtle)', marginBottom:'0.25rem', display:'flex', alignItems:'center', gap:'4px' }}>
                        <Ic d={ICONS.calendar} size={11}/> Expires
                      </p>
                      <p style={{ fontSize:'0.84rem', color:'var(--muted)', fontWeight:500 }}>
                        {new Date(doc.expiryDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {doc.notes && (
                  <div style={{ marginTop:'0.9rem', paddingTop:'0.9rem', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:'0.82rem', color:'var(--muted)', fontStyle:'italic', lineHeight:1.5 }}>
                      "{doc.notes}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="sv-modal-backdrop" onClick={() => !saving && setShowModal(false)}>
          <div className="sv-modal" onClick={e => e.stopPropagation()}>
            <div className="sv-modal-header">
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Ic d={ICONS.file} size={18} style={{ color:'#34d399' }}/>
                </div>
                <div>
                  <h3 className="sv-modal-title">{current ? 'Edit Document' : 'Add Document'}</h3>
                  <p style={{ fontSize:'0.75rem', color:'var(--muted)' }}>Fill in your document details</p>
                </div>
              </div>
              <button className="sv-modal-close" onClick={() => setShowModal(false)}>
                <Ic d={ICONS.close} size={16}/>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sv-modal-body">

                {/* Document Type */}
                <div className="sv-form-group">
                  <label className="sv-form-label">Document Type *</label>
                  <select className="sv-form-select" value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Doc Number */}
                <div className="sv-form-group">
                  <label className="sv-form-label">Document Number *</label>
                  <input className="sv-form-input" type="text" required
                    placeholder="e.g. ABCDE1234F"
                    value={form.documentNumber}
                    onChange={e => setForm({...form, documentNumber: e.target.value.toUpperCase()})}
                    style={{ fontFamily:"'Space Mono',monospace", letterSpacing:'2px' }}
                  />
                </div>

                {/* Issuer + Expiry */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Issuing Authority</label>
                    <input className="sv-form-input" type="text" placeholder="e.g. Govt of India"
                      value={form.issuer}
                      onChange={e => setForm({...form, issuer: e.target.value})}
                    />
                  </div>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Expiry Date</label>
                    <input className="sv-form-input" type="date"
                      value={form.expiryDate}
                      onChange={e => setForm({...form, expiryDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="sv-form-group">
                  <label className="sv-form-label">Notes (optional)</label>
                  <textarea className="sv-form-textarea" rows={2} placeholder="Any additional notes…"
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    style={{ resize:'vertical' }}
                  />
                </div>

              </div>

              <div className="sv-modal-footer">
                <button type="button" className="sv-btn sv-btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="sv-btn sv-btn-primary" disabled={saving}
                  style={{ background: saving ? 'rgba(52,211,153,0.5)' : undefined }}>
                  {saving ? (
                    <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div className="sv-spinner" style={{ width:14, height:14, borderWidth:2 }}/> Saving…
                    </span>
                  ) : (
                    <><Ic d={current ? ICONS.check : ICONS.plus} size={15}/> {current ? 'Update' : 'Save'} Document</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
