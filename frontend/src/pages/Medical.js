import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/SvPage.css';

const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const SearchIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const HeartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const PillIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 2.5l3 3-10.5 10.5-3-3z"/><path d="M10.5 6.5l-8 8a2 2 0 0 0 3 3l8-8"/></svg>;
const DoctorIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const HospitalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;

// ── Modal ─────────────────────────────────────────────────────────────────────
const MedModal = ({ open, onClose, onSubmit, current, submitting }) => {
  const blank = { condition: '', medication: '', doctor: '', hospital: '', notes: '' };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(current ? {
      condition: current.condition, medication: current.medication || '',
      doctor: current.doctor || '', hospital: current.hospital || '', notes: current.notes || '',
    } : blank);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, open]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  if (!open) return null;

  return (
    <div className="sv-modal-overlay" onClick={e => e.target === e.currentTarget && !submitting && onClose()}>
      <div className="sv-modal">
        <div className="sv-modal-header">
          <span className="sv-modal-title">{current ? 'Edit Medical Record' : 'Log New Condition'}</span>
          <button className="sv-modal-close" onClick={onClose} disabled={submitting}><XIcon /></button>
        </div>
        <div className="sv-modal-body">
          <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
            <div className="sv-form-group">
              <label className="sv-form-label">Condition / Diagnosis *</label>
              <input className="sv-form-input" name="condition" required value={form.condition} onChange={handle}
                placeholder="e.g. Asthma, High Blood Pressure" style={{ borderColor: 'rgba(244,63,94,0.3)' }} />
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Current Medication &amp; Dosage</label>
              <textarea className="sv-form-textarea" name="medication" value={form.medication} onChange={handle}
                placeholder="e.g. Salbutamol inhaler twice daily" rows={2} />
            </div>
            <div className="sv-form-grid2">
              <div className="sv-form-group">
                <label className="sv-form-label">Treating Doctor</label>
                <input className="sv-form-input" name="doctor" value={form.doctor} onChange={handle} placeholder="Dr. Smith" />
              </div>
              <div className="sv-form-group">
                <label className="sv-form-label">Hospital</label>
                <input className="sv-form-input" name="hospital" value={form.hospital} onChange={handle} placeholder="City General" />
              </div>
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Notes</label>
              <textarea className="sv-form-textarea" name="notes" value={form.notes} onChange={handle}
                placeholder="Any additional context or instructions…" rows={2} />
            </div>
            <div className="sv-modal-footer">
              <button type="button" className="sv-btn sv-btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="sv-btn sv-btn-primary" disabled={submitting}
                style={{ background: 'linear-gradient(135deg,#f43f5e,#dc2626)', boxShadow: '0 4px 14px rgba(244,63,94,0.3)' }}>
                {submitting ? <span className="sv-spinner"></span> : <PlusIcon />}
                {current ? 'Update' : 'Save'} Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Medical = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchRecs(); }, []);

  const fetchRecs = async () => {
    try { const r = await api.get('/medical'); setRecords(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd  = () => { setCurrent(null); setModalOpen(true); };
  const openEdit = (r) => { setCurrent(r); setModalOpen(true); };
  const close    = () => !submitting && setModalOpen(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (current) {
        const r = await api.put(`/medical/${current._id}`, form);
        setRecords(prev => prev.map(rec => rec._id === current._id ? r.data : rec));
      } else {
        const r = await api.post('/medical', form);
        setRecords(prev => [r.data, ...prev]);
      }
      setModalOpen(false);
    } catch { alert('Failed to save medical record'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medical record?')) return;
    try { await api.delete(`/medical/${id}`); setRecords(prev => prev.filter(r => r._id !== id)); }
    catch { alert('Delete failed'); }
  };

  const filtered = records.filter(r => r.condition.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sv-page">
      {/* Header */}
      <div className="sv-page-header">
        <div className="sv-page-title">
          <div className="sv-page-title-icon" style={{ background: 'rgba(244,63,94,0.12)', border: '0.5px solid rgba(244,63,94,0.3)' }}>
            <HeartIcon />
          </div>
          <div>
            <h1>Medical History</h1>
            <p>Ongoing conditions, treatments &amp; doctors — {records.length} records</p>
          </div>
        </div>
        <button className="sv-btn sv-btn-primary" onClick={openAdd}
          style={{ background: 'linear-gradient(135deg,#f43f5e,#dc2626)', boxShadow: '0 4px 14px rgba(244,63,94,0.3)' }}>
          <PlusIcon /> Add Condition
        </button>
      </div>

      {/* Search */}
      <div className="sv-search-wrap">
        <span className="sv-search-icon" style={{ color: '#3a6080' }}><SearchIcon /></span>
        <input className="sv-search-input" placeholder="Search by condition name…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div className="sv-spinner" style={{ width: '36px', height: '36px', borderTopColor: '#f43f5e' }}></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sv-empty">
          <div className="sv-empty-icon" style={{ background: 'rgba(244,63,94,0.1)', border: '0.5px solid rgba(244,63,94,0.3)' }}>
            <HeartIcon />
          </div>
          <h3>{search ? 'No records found' : 'No medical records'}</h3>
          <p>{search ? 'Try a different search' : 'Log your conditions, medications and doctors for critical care'}</p>
          {!search && (
            <button className="sv-btn sv-btn-primary" onClick={openAdd}
              style={{ background: 'linear-gradient(135deg,#f43f5e,#dc2626)' }}>
              <PlusIcon /> Add First Record
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((rec, i) => (
            <div className="sv-item-card" key={rec._id} style={{ animationDelay: `${i * 60}ms`, display: 'flex', gap: '0' }}>
              {/* Left stripe */}
              <div style={{
                width: '220px', flexShrink: 0, padding: '1.2rem 1.4rem',
                borderRight: '0.5px solid rgba(66,153,225,0.12)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div>
                  <span className="sv-badge sv-badge-rose" style={{ marginBottom: '0.6rem', display: 'inline-flex' }}>Condition</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8f0fe', margin: '0.3rem 0 0', lineHeight: 1.3 }}>
                    {rec.condition}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
                  <button className="sv-action-btn sv-action-edit" onClick={() => openEdit(rec)} title="Edit" style={{ width: 'auto', padding: '0 10px', gap: '4px', fontSize: '0.8rem' }}>
                    <EditIcon /> Edit
                  </button>
                  <button className="sv-action-btn sv-action-del" onClick={() => handleDelete(rec._id)} title="Delete" style={{ width: 'auto', padding: '0 10px', gap: '4px', fontSize: '0.8rem' }}>
                    <TrashIcon /> Del
                  </button>
                </div>
              </div>

              {/* Right details */}
              <div style={{ flex: 1, padding: '1.2rem 1.4rem', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', alignContent: 'start' }}>
                {rec.medication && (
                  <div>
                    <p style={{ fontSize: '0.68rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', color: '#3a6080', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PillIcon /> Medication
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#e8f0fe', fontWeight: 500 }}>{rec.medication}</p>
                  </div>
                )}
                {rec.doctor && (
                  <div>
                    <p style={{ fontSize: '0.68rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', color: '#3a6080', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DoctorIcon /> Doctor
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#e8f0fe', fontWeight: 500 }}>{rec.doctor}</p>
                  </div>
                )}
                {rec.hospital && (
                  <div>
                    <p style={{ fontSize: '0.68rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', color: '#3a6080', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HospitalIcon /> Hospital
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#e8f0fe', fontWeight: 500 }}>{rec.hospital}</p>
                  </div>
                )}
                {rec.notes && (
                  <div style={{ gridColumn: '1 / -1', borderTop: '0.5px solid rgba(66,153,225,0.1)', paddingTop: '0.7rem' }}>
                    <p style={{ fontSize: '0.82rem', color: '#7ea8cc', fontStyle: 'italic' }}>"{rec.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <MedModal open={modalOpen} onClose={close} onSubmit={handleSubmit} current={current} submitting={submitting} />
    </div>
  );
};

export default Medical;
