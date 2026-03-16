import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/SvPage.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const Profile = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
    hospitalPreference: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', ok: true });

  useEffect(() => {
    api.get('/profile')
      .then(r => {
        if (r.data) {
          setForm({
            bloodGroup:        r.data.bloodGroup || '',
            allergies:         Array.isArray(r.data.allergies) ? r.data.allergies.join(', ') : (r.data.allergies || ''),
            medicalConditions: Array.isArray(r.data.medicalConditions) ? r.data.medicalConditions.join(', ') : (r.data.medicalConditions || ''),
            hospitalPreference: r.data.hospitalPreference || '',
            additionalNotes:   r.data.additionalNotes || '',
          });
        }
      })
      .catch(() => {}) // no profile yet – that's fine
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        bloodGroup:         form.bloodGroup,
        hospitalPreference: form.hospitalPreference,
        additionalNotes:    form.additionalNotes,
        allergies:          form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        medicalConditions:  form.medicalConditions ? form.medicalConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      await api.put('/profile', payload);
      showToast('Profile saved successfully!', true);
    } catch (err) {
      console.error('Profile save error:', err);
      showToast(err.response?.data?.message || 'Failed to save profile', false);
    } finally {
      setSaving(false);
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  if (loading) {
    return (
      <div className="sv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="sv-spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem', borderTopColor: '#2a7fff' }}></div>
          <p style={{ color: '#7ea8cc', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sv-page">

      {/* Header */}
      <div className="sv-page-header">
        <div className="sv-page-title">
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg,#1a6cf0,#2a7fff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.2rem', color: '#fff',
            border: '2px solid rgba(42,127,255,0.35)',
            boxShadow: '0 0 14px rgba(42,127,255,0.3)',
            flexShrink: 0,
          }}>
            {userInitials}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 700, color: '#e8f0fe' }}>Emergency Profile</h1>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#7ea8cc' }}>Critical medical info for first responders</p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`sv-toast ${toast.ok ? 'sv-toast-success' : 'sv-toast-error'}`} style={{ marginBottom: '1.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={toast.ok ? '#10b981' : '#f43f5e'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {toast.ok
              ? <polyline points="20 6 9 17 4 12"/>
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            }
          </svg>
          <p>{toast.msg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* ── Left Column ── */}
          <div>
            {/* Blood Group */}
            <p className="sv-section-lbl">Blood Type</p>
            <div className="sv-card" style={{ marginBottom: '1.5rem' }}>
              <div className="sv-blood-grid">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg} type="button"
                    className={`sv-blood-btn ${form.bloodGroup === bg ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  >{bg}</button>
                ))}
              </div>
              {form.bloodGroup
                ? <p style={{ marginTop: '1rem', textAlign: 'center', color: '#f43f5e', fontFamily: "'Space Mono',monospace", fontSize: '0.8rem' }}>
                    Selected: <strong>{form.bloodGroup}</strong>
                  </p>
                : <p style={{ marginTop: '1rem', textAlign: 'center', color: '#3a6080', fontFamily: "'Space Mono',monospace", fontSize: '0.78rem' }}>
                    No blood group selected
                  </p>
              }
            </div>

            {/* Hospital */}
            <p className="sv-section-lbl">Hospital Preference</p>
            <div className="sv-card">
              <div className="sv-form-group" style={{ marginBottom: 0 }}>
                <label className="sv-form-label">Preferred Hospital / Clinic</label>
                <input
                  className="sv-form-input"
                  name="hospitalPreference"
                  value={form.hospitalPreference}
                  onChange={handleChange}
                  placeholder="e.g. Apollo Hospital, City Center"
                />
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div>
            <p className="sv-section-lbl">Medical Details</p>
            <div className="sv-card">
              <div className="sv-form-group">
                <label className="sv-form-label">Known Allergies <span style={{ color: '#3a6080' }}>(comma separated)</span></label>
                <textarea
                  className="sv-form-textarea"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Penicillin, Peanuts, Dust, Latex"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Pre-existing Conditions <span style={{ color: '#3a6080' }}>(comma separated)</span></label>
                <textarea
                  className="sv-form-textarea"
                  name="medicalConditions"
                  value={form.medicalConditions}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Asthma, Diabetes Type 2, Hypertension"
                />
              </div>

              <div className="sv-form-group" style={{ marginBottom: 0 }}>
                <label className="sv-form-label">Additional Notes for Responders</label>
                <textarea
                  className="sv-form-textarea"
                  name="additionalNotes"
                  value={form.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g. Organ donor, advance directives, implanted devices, do-not-resuscitate instructions…"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="sv-btn sv-btn-primary" disabled={saving} style={{ padding: '0.7rem 2rem', fontSize: '0.95rem' }}>
            {saving ? <span className="sv-spinner"></span> : <SaveIcon />}
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default Profile;
