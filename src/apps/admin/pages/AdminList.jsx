import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const PAGE_SIZE = 8;

function formatDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// ── Invite modal ─────────────────────────────────────────────────────────────
function InviteModal({ onClose, onInvited }) {
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
      const res = await adminApi.invite(payload);
      if (!res.ok) throw new Error(res.error || 'Request failed');
      onInvited();
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
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>Add Admin</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          We'll email an invite link. They'll be able to log in and set their own password.
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
          <input style={fieldStyle} type="email" value={form.email} onChange={set('email')} placeholder="admin@example.com" />
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

// ── Remove confirm ───────────────────────────────────────────────────────────
function RemoveConfirm({ admin, onClose, onConfirmed }) {
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const handleRemove = async () => {
    setRemoving(true);
    setError('');
    try {
      const res = await adminApi.remove(admin.id);
      if (!res.ok) throw new Error(res.error || 'Request failed');
      onConfirmed();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoving(false);
    }
  };
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '400px', background: 'var(--surface-card)',
        borderRadius: '1rem', border: '1px solid var(--border-light)',
        boxShadow: 'var(--modal-shadow)', padding: '1.75rem',
        textAlign: 'center', color: 'var(--text-main)',
      }}>
        <div style={{
          width: '3rem', height: '3rem', borderRadius: '50%',
          background: 'rgba(239,68,68,0.14)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>Remove Admin?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
          <strong>{admin.email}</strong> will lose admin access.
        </p>
        {error && <div style={{
          background: 'rgba(239,68,68,0.12)', color: '#ef4444',
          padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem',
        }}>{error}</div>}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onClose} style={{
            padding: '0.65rem 1.25rem', borderRadius: '999px',
            border: '1px solid var(--modal-cancel-border)', background: 'var(--modal-cancel-bg)',
            color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600,
          }}>Cancel</button>
          <button onClick={handleRemove} disabled={removing} style={{
            padding: '0.65rem 1.5rem', borderRadius: '999px', border: 'none',
            background: '#ef4444', color: '#fff', fontWeight: 600,
            cursor: removing ? 'not-allowed' : 'pointer', opacity: removing ? 0.7 : 1,
          }}>{removing ? 'Removing…' : 'Remove'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminList() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.list();
      if (res.ok) setAdmins(res.admins);
      else setError(res.error || 'Failed to load');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = admins.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return a.email.toLowerCase().includes(q)
      || (a.firstName || '').toLowerCase().includes(q)
      || (a.lastName || '').toLowerCase().includes(q);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageAdmins = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, admins.length]);

  const onInvited = () => { setShowInvite(false); load(); };
  const onRemoved = () => { setRemoveTarget(null); load(); };

  return (
    <section>
      {/* Header */}
      <div className="card mb-6" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.75rem',
      }}>
        <div>
          <h3 style={{ marginBottom: '0.25rem' }}>Admins</h3>
          <p className="text-muted" style={{ margin: 0 }}>Manage who has admin access to this workspace.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            style={{
              minWidth: '220px', padding: '0.75rem 1rem', borderRadius: '999px',
              border: '1px solid var(--border-light)', background: 'var(--surface)',
              color: 'var(--text-main)', outline: 'none',
            }} />
          {!loading && (
            <span style={{
              background: 'rgba(16,185,129,0.12)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px',
              padding: '0.2rem 0.75rem', fontWeight: 600, fontSize: '0.8rem',
            }}>Total: {filtered.length}</span>
          )}
          <button onClick={() => setShowInvite(true)} style={{
            padding: '0.65rem 1.25rem', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#fff', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Admin
          </button>
          {error && <span style={{ fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>{error}</span>}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: '1rem' }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ height: '3.25rem', borderRadius: '0.625rem', background: 'var(--surface-hover)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />
            ))}
          </div>
        ) : pageAdmins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.35, display: 'block', margin: '0 auto 0.75rem' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            No admins found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {['Sr.No.', 'Name', 'Email', 'Status', 'Invited', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageAdmins.map((a, idx) => {
                  const displayName = [a.firstName, a.lastName].filter(Boolean).join(' ') || '—';
                  const isSelf = user?.id === a.id;
                  return (
                    <tr key={a.id}
                      style={{ borderBottom: idx < pageAdmins.length - 1 ? '1px solid var(--border-light)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{(page-1)*PAGE_SIZE + idx + 1}</td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, color: '#fff' }}>
                            {(a.firstName?.[0] || a.email?.[0] || '?').toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{displayName}{isSelf ? ' (You)' : ''}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{a.email}</td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: '999px',
                          background: a.passwordSet ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color: a.passwordSet ? '#10b981' : '#f59e0b',
                          border: `1px solid ${a.passwordSet ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        }}>
                          {a.passwordSet ? 'Active' : 'Invite Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.createdAt ? formatDate(a.createdAt) : '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <button title="Remove" disabled={isSelf} onClick={() => setRemoveTarget(a)} style={{
                          width: '2rem', height: '2rem', borderRadius: '0.5rem',
                          border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
                          color: '#ef4444', cursor: isSelf ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                          opacity: isSelf ? 0.4 : 1,
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0.75rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing {pageAdmins.length} of {filtered.length} admins
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" onClick={() => setPage((p) => Math.max(p-1, 1))} disabled={page === 1}
            style={{ borderRadius: '999px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', padding: '0.6rem 1rem', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            Previous
          </button>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{page} / {pageCount}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(p+1, pageCount))} disabled={page === pageCount}
            style={{ borderRadius: '999px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', padding: '0.6rem 1rem', cursor: page === pageCount ? 'not-allowed' : 'pointer' }}>
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={onInvited} />}
      {removeTarget && <RemoveConfirm admin={removeTarget} onClose={() => setRemoveTarget(null)} onConfirmed={onRemoved} />}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </section>
  );
}
