import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/SvPage.css';

// Inline SVG helpers
const PhoneIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.55 5.55l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MailIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const StarIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const EditIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const UsersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SearchIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

// ── Inner Modal ───────────────────────────────────────────────────────────────
const ContactModal = ({ open, onClose, onSubmit, current, submitting }) => {
  const blank = { name: '', relation: '', phone: '', email: '', isTrusted: false, notes: '' };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(current
      ? { name: current.name, relation: current.relation || '', phone: current.phone, email: current.email || '', isTrusted: current.isTrusted || false, notes: current.notes || '' }
      : blank
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, open]);

  const handle = e => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: v }));
  };

  if (!open) return null;

  return (
    <div className="sv-modal-overlay" onClick={e => e.target === e.currentTarget && !submitting && onClose()}>
      <div className="sv-modal">
        <div className="sv-modal-header">
          <span className="sv-modal-title">{current ? 'Edit Contact' : 'Add Emergency Contact'}</span>
          <button className="sv-modal-close" onClick={onClose} disabled={submitting}><XIcon /></button>
        </div>
        <div className="sv-modal-body">
          <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
            <div className="sv-form-group">
              <label className="sv-form-label">Contact Name *</label>
              <input className="sv-form-input" name="name" required value={form.name} onChange={handle} placeholder="Jane Doe" />
            </div>
            <div className="sv-form-grid2">
              <div className="sv-form-group">
                <label className="sv-form-label">Relation</label>
                <input className="sv-form-input" name="relation" value={form.relation} onChange={handle} placeholder="e.g. Spouse, Brother" />
              </div>
              <div className="sv-form-group">
                <label className="sv-form-label">Phone *</label>
                <input className="sv-form-input" name="phone" type="tel" required value={form.phone} onChange={handle} placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="sv-form-group">
              <label className="sv-form-label">Email</label>
              <input className="sv-form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="jane@example.com" />
            </div>
            <label className="sv-checkbox-row" style={{ marginBottom: '1rem' }}>
              <input type="checkbox" name="isTrusted" checked={form.isTrusted} onChange={handle} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#e8f0fe', margin: 0 }}>Mark as Primary Trusted Contact</p>
                <p style={{ fontSize: '0.78rem', color: '#7ea8cc', margin: 0 }}>Takes top priority during emergencies</p>
              </div>
            </label>
            <div className="sv-modal-footer">
              <button type="button" className="sv-btn sv-btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="sv-btn sv-btn-primary" disabled={submitting}>
                {submitting ? <span className="sv-spinner"></span> : <PlusIcon />}
                {current ? 'Update' : 'Save'} Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const r = await api.get('/contacts'); setContacts(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd  = () => { setCurrent(null); setModalOpen(true); };
  const openEdit = (c) => { setCurrent(c); setModalOpen(true); };
  const close    = () => !submitting && setModalOpen(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (current) {
        const r = await api.put(`/contacts/${current._id}`, form);
        setContacts(prev => prev.map(c => c._id === current._id ? r.data : c));
      } else {
        const r = await api.post('/contacts', form);
        setContacts(prev => [r.data, ...prev]);
      }
      setModalOpen(false);
    } catch { alert('Failed to save contact'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try { await api.delete(`/contacts/${id}`); setContacts(prev => prev.filter(c => c._id !== id)); }
    catch { alert('Delete failed'); }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.relation || '').toLowerCase().includes(search.toLowerCase())
  );

  const colorFor = (name) => {
    const colors = ['#2a7fff', '#10b981', '#f43f5e', '#f59e0b', '#a78bfa', '#38bdf8'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="sv-page">
      {/* Header */}
      <div className="sv-page-header">
        <div className="sv-page-title">
          <div className="sv-page-title-icon" style={{ background: 'rgba(42,127,255,0.12)', border: '0.5px solid rgba(42,127,255,0.3)' }}>
            <UsersIcon />
          </div>
          <div>
            <h1>Emergency Contacts</h1>
            <p>People to reach during an emergency — {contacts.length} saved</p>
          </div>
        </div>
        <button className="sv-btn sv-btn-primary" onClick={openAdd}>
          <PlusIcon /> Add Contact
        </button>
      </div>

      {/* Search */}
      <div className="sv-search-wrap">
        <span className="sv-search-icon" style={{ color: '#3a6080' }}><SearchIcon /></span>
        <input className="sv-search-input" placeholder="Search by name or relation…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div className="sv-spinner" style={{ width: '36px', height: '36px', borderTopColor: '#2a7fff' }}></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="sv-empty">
          <div className="sv-empty-icon" style={{ background: 'rgba(42,127,255,0.1)', border: '0.5px solid rgba(42,127,255,0.3)' }}>
            <UsersIcon />
          </div>
          <h3>{search ? 'No contacts found' : 'No contacts yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Add your trusted emergency contacts to the vault'}</p>
          {!search && <button className="sv-btn sv-btn-primary" onClick={openAdd}><PlusIcon /> Add First Contact</button>}
        </div>
      ) : (
        <div className="sv-grid-3">
          {filtered.map((c, i) => {
            const col = colorFor(c.name);
            return (
              <div className="sv-item-card" key={c._id} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="sv-item-actions">
                  <button className="sv-action-btn sv-action-edit" onClick={() => openEdit(c)} title="Edit"><EditIcon /></button>
                  <button className="sv-action-btn sv-action-del" onClick={() => handleDelete(c._id)} title="Delete"><TrashIcon /></button>
                </div>

                {/* Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
                  <div className="sv-avatar-sm" style={{ background: `${col}20`, border: `0.5px solid ${col}50`, color: col }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: '#e8f0fe', paddingRight: '3rem' }}>{c.name}</p>
                    <p style={{ fontSize: '0.8rem', color: col, margin: 0, fontWeight: 600 }}>{c.relation || 'Contact'}</p>
                  </div>
                </div>

                <div style={{ borderTop: '0.5px solid rgba(66,153,225,0.12)', paddingTop: '0.85rem' }}>
                  <div className="sv-info-row"><PhoneIcon /><a href={`tel:${c.phone}`}>{c.phone}</a></div>
                  {c.email && <div className="sv-info-row"><MailIcon /><a href={`mailto:${c.email}`}>{c.email}</a></div>}
                </div>

                {c.isTrusted && (
                  <div style={{
                    marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px',
                    color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600,
                    fontFamily: "'Space Mono', monospace"
                  }}>
                    <StarIcon /> PRIMARY TRUSTED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ContactModal
        open={modalOpen} onClose={close}
        onSubmit={handleSubmit} current={current}
        submitting={submitting}
      />
    </div>
  );
};

export default Contacts;
