import { useState } from 'react';

export default function InviteModal({ title, placeholder, onInvite, onClose, onInvited }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    setInfo('');
    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
      };
      const res = await onInvite(payload);
      if (!res.ok) throw new Error(res.error || 'Request failed');
      onInvited(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = {
    width: '100%', padding: '0.7rem 1rem', borderRadius: '0.625rem',
    border: '1px solid var(--modal-field-border)', background: 'var(--modal-field-bg)',
    color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem',
    display: 'block',
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} style={{
        width: '100%', maxWidth: '480px', background: 'var(--surface-card)',
        borderRadius: '1rem', border: '1px solid var(--border-light)',
        boxShadow: 'var(--modal-shadow)', padding: '1.75rem',
        display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)',
      }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          We'll email an invite link. They'll be able to set their own password.
        </p>

        {error && <div style={{
          background: 'rgba(239,68,68,0.12)', color: '#ef4444',
          padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem',
        }}>{error}</div>}
        {info && <div style={{
          background: 'rgba(45,212,191,0.10)', color: '#0f766e',
          padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem',
        }}>{info}</div>}

        <div>
          <label style={labelStyle}>Email *</label>
          <input style={fieldStyle} type="email" value={form.email} onChange={set('email')} placeholder={placeholder} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input style={fieldStyle} value={form.firstName} onChange={set('firstName')} placeholder="First name" />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input style={fieldStyle} value={form.lastName} onChange={set('lastName')} placeholder="Last name" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} style={{
            padding: '0.65rem 1.25rem', borderRadius: '999px',
            border: '1px solid var(--modal-cancel-border)', background: 'var(--modal-cancel-bg)',
            color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600,
          }}>Cancel</button>
          <button type="submit" disabled={saving} style={{
            padding: '0.65rem 1.5rem', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#fff', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Sending…' : 'Send Invite'}</button>
        </div>
      </form>
    </div>
  );
}
