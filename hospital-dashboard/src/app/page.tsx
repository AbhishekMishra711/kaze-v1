'use client';

import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:4000';

/* ─── Types ──────────────────────────────────────────────────────── */
interface HospitalData {
  id: string;
  name: string;
  admin_id: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  is_active: boolean;
  last_reported_at?: string;
  capacity?: Array<{
    category: string;
    total: string | number;
    free: string | number;
    occupied?: string | number;
    maintenance?: string | number;
  }>;
}

interface Reservation {
  id: string;
  incident_id: string;
  unit_id?: string;
  hospital_id: string;
  ambulance_id: string | null;
  status: 'HELD' | 'CONFIRMED' | 'ARRIVED' | 'HANDED_OVER' | 'REJECTED';
  hold_expires_at: string;
  triage_level: string;
  description_raw: string;
  inc_lat: number;
  inc_lng: number;
  unit_category?: string;
  unit_label?: string;
  vehicle_number: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  created_at: string;
  reservation_ids?: string[];
  units?: Array<{
    reservation_id: string;
    unit_id: string;
    category: string;
    unit_label: string;
    status: string;
  }>;
}

interface ResourceUnit {
  id: string;
  category: string;
  unit_label: string;
  status: 'FREE' | 'OCCUPIED' | 'MAINTENANCE' | 'HELD';
  is_movable: boolean;
  updated_at: string;
}

/* ─── SVG Icons ──────────────────────────────────────────────────── */
function IconCross({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
    </svg>
  );
}

function IconPulse({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconBed({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 4v16M2 8h20a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function IconLung({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.081 20C6.786 19.178 8 17 8 14v-3H4a2 2 0 0 0-2 2v3c0 2.21 1.79 4 4 4z" />
      <path d="M17.919 20C17.214 19.178 16 17 16 14v-3h4a2 2 0 0 1 2 2v3c0 2.21-1.79 4-4 4z" />
      <path d="M12 2v13" />
      <path d="M8 11V9a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

function IconAlert({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconWind({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

function IconChild({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 8H9l-2 8h10L15 8z" />
      <path d="M12 16v6" />
    </svg>
  );
}

function IconHospital({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 10h6M12 7v6" />
    </svg>
  );
}

function IconSatellite({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 7l4 4-9 9-4-4 9-9z" />
      <path d="M19 11l2-2a3 3 0 0 0-4.24-4.24L15 7" />
      <path d="M5 13l-2 2a3 3 0 0 0 4.24 4.24L9 17" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function IconLogout({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconPlus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─── Resource category config ───────────────────────────────────── */
const RESOURCE_CATS = [
  { key: 'ICU_BED',      label: 'ICU Beds',         desc: 'Critical care monitoring',     Icon: IconBed },
  { key: 'VENTILATOR',   label: 'Ventilators',       desc: 'Invasive / non-invasive',      Icon: IconLung },
  { key: 'TRAUMA_BAY',   label: 'Trauma Bays',       desc: 'High-acuity resuscitation',    Icon: IconAlert },
  { key: 'OXYGEN_BED',   label: 'Oxygen Beds',       desc: 'High-flow O2 support',          Icon: IconWind },
  { key: 'PEDIATRIC_ICU', label: 'Pediatric ICU',    desc: 'Neonatal & child intensive',   Icon: IconChild },
  { key: 'GENERAL_BED',  label: 'General Ward',      desc: 'Acute clinical observation',   Icon: IconHospital },
];

const DEMO_ACCOUNTS = [
  { name: 'Dr. D.Y. Patil Medical', admin_id: 'dy_patil@admin', pass: 'password123' },
  { name: 'Aditya Birla Memorial',  admin_id: 'aditya_birla@admin', pass: 'password123' },
  { name: 'YCM Hospital',           admin_id: 'ycm@admin', pass: 'password123' },
  { name: 'Manipal Baner',          admin_id: 'manipal@admin', pass: 'password123' },
  { name: 'Ruby Hall Clinic',       admin_id: 'ruby_hall@admin', pass: 'password123' },
  { name: 'Sassoon General',        admin_id: 'sassoon@admin', pass: 'password123' },
];

/* ─── Main component ─────────────────────────────────────────────── */
export default function HospitalDashboard() {
  const [hospital, setHospital] = useState<HospitalData | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form
  const [loginAdminId, setLoginAdminId] = useState('dy_patil@admin');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form
  const [regName, setRegName] = useState('');
  const [regAdminId, setRegAdminId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLat, setRegLat] = useState('18.6253');
  const [regLng, setRegLng] = useState('73.8166');
  const [regPhone, setRegPhone] = useState('020-27805100');

  // Tab
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'RESOURCES' | 'HANDOVER'>('REQUESTS');

  // Data
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resourceUnits, setResourceUnits] = useState<ResourceUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Add resource modal
  const [showAddResource, setShowAddResource] = useState(false);
  const [newCategory, setNewCategory] = useState('ICU_BED');
  const [newCount, setNewCount] = useState(2);
  const [newIsMovable, setNewIsMovable] = useState(false);

  // Session restore
  useEffect(() => {
    const saved = localStorage.getItem('kaze_hospital_session');
    if (saved) {
      try { setHospital(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 5000);
  };

  /* ── Auth ── */
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/hospital/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: loginAdminId, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.hospital) {
        setHospital(data.hospital);
        localStorage.setItem('kaze_hospital_session', JSON.stringify(data.hospital));
        showToast(`Welcome back, ${data.hospital.name}`, 'success');
      } else {
        showToast(data.error || 'Login failed. Check credentials.', 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regAdminId || !regPassword) {
      showToast('Fill all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/hospital/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName, admin_id: regAdminId, password: regPassword,
          latitude: parseFloat(regLat), longitude: parseFloat(regLng),
          contact_phone: regPhone,
        }),
      });
      const data = await res.json();
      if (data.success && data.hospital) {
        setHospital(data.hospital);
        localStorage.setItem('kaze_hospital_session', JSON.stringify(data.hospital));
        showToast(`"${data.hospital.name}" registered — 24 units initialized.`, 'success');
      } else {
        showToast(data.error || 'Registration failed.', 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kaze_hospital_session');
    setHospital(null);
  };

  /* ── Data polling ── */
  const fetchHospitalData = async () => {
    if (!hospital?.id) return;
    try {
      const [hRes, rRes, uRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}`),
        fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/reservations`),
        fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/resources`),
      ]);
      if (hRes.ok) {
        const hJson = await hRes.json();
        if (hJson.success && hJson.hospital) setHospital(prev => ({ ...prev!, ...hJson.hospital }));
      }
      if (rRes.ok) {
        const rJson = await rRes.json();
        if (rJson.success) setReservations(rJson.reservations || []);
      }
      if (uRes.ok) {
        const uJson = await uRes.json();
        if (uJson.success) setResourceUnits(uJson.resources || []);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (!hospital?.id) return;
    fetchHospitalData();
    const interval = setInterval(fetchHospitalData, 3500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospital?.id]);

  /* ── Actions ── */
  const toggleHospitalStatus = async () => {
    if (!hospital?.id) return;
    const newStatus = !hospital.is_active;
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus, reason: newStatus ? 'ER_REOPENED' : 'TEMPORARY_ER_DIVERSION' }),
      });
      const data = await res.json();
      if (data.success) {
        setHospital(prev => prev ? { ...prev, is_active: newStatus } : null);
        showToast(
          newStatus
            ? 'Hospital is now OPEN and accepting emergency patients.'
            : 'ER temporarily diverted. Inbound ambulances dynamically rerouted.',
          newStatus ? 'success' : 'error'
        );
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const triggerHeartbeat = async () => {
    if (!hospital?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/heartbeat`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Heartbeat transmitted. Telemetry freshness 100%.', 'success');
        fetchHospitalData();
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const acceptIncident = async (incidentId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/incidents/${incidentId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalId: hospital?.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Patient accepted. Resources confirmed. Inbound ambulance notified.', 'success');
        fetchHospitalData();
      } else {
        showToast(data.error || 'Could not confirm patient.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const rejectIncident = async (incidentId: string) => {
    const reason = window.prompt('Reason for declining:', 'ER_CAPACITY_OVERLOAD') || 'ER_CAPACITY_OVERLOAD';
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/incidents/${incidentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, hospitalId: hospital?.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Patient declined. Replanning rerouted ambulance to next best hospital.', 'info');
        fetchHospitalData();
      } else {
        showToast(data.error || 'Could not decline patient.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const completeIncidentHandover = async (incidentId: string, vehicleNum?: string | null) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/incidents/${incidentId}/handover`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Patient admitted. Ambulance ${vehicleNum || ''} freed and back in service.`, 'success');
        fetchHospitalData();
      } else {
        showToast(data.error || 'Could not complete handover.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const adjustCapacity = async (category: string, delta: number) => {
    if (!hospital?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/resources/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, delta }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${category} adjusted by ${delta > 0 ? '+' : ''}${delta}`, 'success');
        fetchHospitalData();
      } else {
        showToast(data.error || 'Failed to adjust.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/hospitals/${hospital.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory, count: newCount, isMovable: newIsMovable }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Added ${newCount} unit(s) of ${newCategory}.`, 'success');
        setShowAddResource(false);
        fetchHospitalData();
      } else {
        showToast(data.error || 'Could not add resources.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  /* ── Derived ── */
  const heldRequests = reservations.filter(r => r.status === 'HELD');
  const confirmedCases = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'ARRIVED');

  /* ── Triage level styling ── */
  const triageCls = (level: string) => {
    if (level === 'RESUSCITATION') return 'RESUSCITATION';
    if (level === 'EMERGENT') return 'EMERGENT';
    return 'URGENT';
  };

  /* ═══════════════════════════════════════════════════
      AUTH SCREEN
  ═══════════════════════════════════════════════════ */
  if (!hospital) {
    return (
      <div className="kaze-auth-wrap">
        <div className="kaze-auth-glow" aria-hidden="true" />

        {actionMsg && (
          <div
            style={{ position: 'fixed', top: 20, right: 20, zIndex: 300, maxWidth: 380 }}
            className={`kaze-toast ${actionMsg.type}`}
            role="alert"
          >
            <span>{actionMsg.text}</span>
            <button className="kaze-toast-close" onClick={() => setActionMsg(null)} aria-label="Dismiss">
              <IconX size={14} />
            </button>
          </div>
        )}

        <div className="kaze-auth-box">
          {/* Logo */}
          <div className="kaze-auth-logo">
            <div className="kaze-brand-mark">
              <IconCross size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>KAZE</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>HLTH-02 Core Gateway</div>
            </div>
          </div>

          <h1 className="kaze-auth-title">Hospital ER Terminal</h1>
          <p className="kaze-auth-sub">
            Real-time resource allocation, patient triage management, and ambulance handover coordination.
          </p>

          {/* Auth tabs */}
          <div className="kaze-auth-tabs" role="tablist">
            <button
              className={`kaze-auth-tab ${authMode === 'LOGIN' ? 'active' : ''}`}
              onClick={() => setAuthMode('LOGIN')}
              role="tab"
              aria-selected={authMode === 'LOGIN'}
            >
              Sign In
            </button>
            <button
              className={`kaze-auth-tab ${authMode === 'REGISTER' ? 'active' : ''}`}
              onClick={() => setAuthMode('REGISTER')}
              role="tab"
              aria-selected={authMode === 'REGISTER'}
            >
              Register Hospital
            </button>
          </div>

          {authMode === 'LOGIN' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginAdminId">Hospital Admin ID</label>
                <input
                  id="loginAdminId"
                  type="text"
                  required
                  value={loginAdminId}
                  onChange={e => setLoginAdminId(e.target.value)}
                  placeholder="e.g. dy_patil@admin"
                  className="form-input"
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <input
                  id="loginPassword"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-accent"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                id="login-submit-btn"
              >
                {loading ? 'Authenticating...' : 'Sign In to ER Terminal'}
              </button>

              <hr className="section-divider" />
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Quick demo — Pune network
                </span>
              </div>
              <div className="demo-grid">
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    className="demo-btn"
                    onClick={() => { setLoginAdminId(acc.admin_id); setLoginPassword(acc.pass); }}
                    title={acc.name}
                  >
                    <span className="demo-btn-name">{acc.name}</span>
                    <span className="demo-btn-id">{acc.admin_id}</span>
                  </button>
                ))}
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label" htmlFor="regName">Hospital Full Name *</label>
                <input
                  id="regName" type="text" required value={regName}
                  onChange={e => {
                    setRegName(e.target.value);
                    if (!regAdminId) {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
                      setRegAdminId(`${slug}@admin`);
                    }
                  }}
                  placeholder="e.g. Sahyadri Speciality Hospital"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="regAdminId">Admin ID * (hospital_name@admin)</label>
                <input
                  id="regAdminId" type="text" required value={regAdminId}
                  onChange={e => setRegAdminId(e.target.value)}
                  placeholder="sahyadri@admin"
                  className="form-input"
                  style={{ fontFamily: 'ui-monospace, monospace' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">Password *</label>
                <input
                  id="regPassword" type="password" required value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="regLat">Latitude</label>
                  <input
                    id="regLat" type="number" step="0.0001" required value={regLat}
                    onChange={e => setRegLat(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="regLng">Longitude</label>
                  <input
                    id="regLng" type="number" step="0.0001" required value={regLng}
                    onChange={e => setRegLng(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="regPhone">Contact Phone</label>
                <input
                  id="regPhone" type="text" value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="020-XXXXXXXX"
                  className="form-input"
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Registration provisions 24 default emergency units: 4 ICU beds, 3 ventilators, 2 trauma bays, 6 oxygen beds, 1 pediatric ICU, 8 general beds.
              </p>
              <button
                type="submit" disabled={loading}
                className="btn btn-accent"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                id="register-submit-btn"
              >
                {loading ? 'Registering...' : 'Register Hospital & Launch'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════
      MAIN DASHBOARD
  ═══════════════════════════════════════════════════ */
  return (
    <div className="kaze-app">
      {/* ── Header ── */}
      <header className="kaze-header" role="banner">
        <div className="kaze-header-inner">
          <div className="kaze-header-row">
            {/* Brand + hospital identity */}
            <div className="kaze-brand">
              <div className="kaze-brand-mark" aria-hidden="true">
                <IconCross size={18} />
              </div>
              <div className="kaze-brand-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="kaze-brand-name">{hospital.name}</span>
                  <span className={`kaze-status-pill ${hospital.is_active ? 'open' : 'closed'}`}>
                    <span className={`kaze-status-dot ${hospital.is_active ? 'pulse' : ''}`} aria-hidden="true" />
                    {hospital.is_active ? 'Open / Receiving' : 'Diverted'}
                  </span>
                </div>
                <div className="kaze-header-meta">
                  <span>{hospital.admin_id}</span>
                  <span className="kaze-meta-sep">|</span>
                  <span>GPS {hospital.latitude.toFixed(4)}, {hospital.longitude.toFixed(4)}</span>
                  <span className="kaze-meta-sep">|</span>
                  <span>{hospital.contact_phone || '—'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="kaze-header-actions">
              <button
                type="button"
                onClick={toggleHospitalStatus}
                className={`btn ${hospital.is_active ? 'btn-danger' : 'btn-accent'}`}
                title="Toggle hospital status"
                id="toggle-status-btn"
              >
                {hospital.is_active ? 'Divert ER' : 'Re-open ER'}
              </button>
              <button
                type="button"
                onClick={triggerHeartbeat}
                className="btn btn-ghost"
                title="Refresh telemetry heartbeat"
                id="heartbeat-btn"
              >
                <IconSatellite size={14} />
                Heartbeat
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost"
                title="Sign out"
                id="logout-btn"
              >
                <IconLogout size={14} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <nav className="kaze-tabs" aria-label="Dashboard sections">
            <button
              className={`kaze-tab ${activeTab === 'REQUESTS' ? 'active' : ''}`}
              onClick={() => setActiveTab('REQUESTS')}
              aria-current={activeTab === 'REQUESTS' ? 'page' : undefined}
              id="tab-requests"
            >
              <IconPulse size={14} />
              Incoming Requests
              {heldRequests.length > 0 && (
                <span className="kaze-badge" aria-label={`${heldRequests.length} pending`}>{heldRequests.length}</span>
              )}
            </button>
            <button
              className={`kaze-tab ${activeTab === 'RESOURCES' ? 'active' : ''}`}
              onClick={() => setActiveTab('RESOURCES')}
              aria-current={activeTab === 'RESOURCES' ? 'page' : undefined}
              id="tab-resources"
            >
              <IconBed size={14} />
              Resource Inventory
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                ({resourceUnits.filter(u => u.status === 'FREE').length} free)
              </span>
            </button>
            <button
              className={`kaze-tab ${activeTab === 'HANDOVER' ? 'active' : ''}`}
              onClick={() => setActiveTab('HANDOVER')}
              aria-current={activeTab === 'HANDOVER' ? 'page' : undefined}
              id="tab-handover"
            >
              <IconHospital size={14} />
              Patient Arrival & Handover
              {confirmedCases.length > 0 && (
                <span className="kaze-badge amber">{confirmedCases.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Toast */}
      {actionMsg && (
        <div className="kaze-toast-wrap" role="alert" aria-live="polite">
          <div className={`kaze-toast ${actionMsg.type}`}>
            <span>{actionMsg.text}</span>
            <button className="kaze-toast-close" onClick={() => setActionMsg(null)} aria-label="Dismiss notification">
              <IconX size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="kaze-main" id="main-content">

        {/* ═══ TAB 1: INCOMING REQUESTS ═══ */}
        {activeTab === 'REQUESTS' && (
          <section aria-labelledby="requests-heading">
            <div className="kaze-section-header">
              <div>
                <h2 className="kaze-section-title" id="requests-heading">Emergency Dispatch Requests</h2>
                <p className="kaze-section-sub">
                  Review and accept or decline real-time resource reservation holds.
                </p>
              </div>
              <span style={{
                fontSize: '0.68rem', fontFamily: 'ui-monospace, monospace',
                color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 10px',
              }}>
                Auto-refreshing every 3.5 s
              </span>
            </div>

            {heldRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconCheck size={22} />
                </div>
                <h3 className="empty-title">No Pending Emergency Requests</h3>
                <p className="empty-sub">
                  When a dispatcher or citizen triggers an SOS requiring your hospital's resources, it will appear here instantly.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {heldRequests.map(req => {
                  const expires = new Date(req.hold_expires_at).toLocaleTimeString();
                  return (
                    <article key={req.id} className="request-card" aria-label={`Incoming request triage: ${req.triage_level}`}>
                      {/* Card header */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className={`triage-badge ${triageCls(req.triage_level)}`}>
                            {req.triage_level}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                            INC #{req.incident_id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.72rem', fontWeight: 700, color: '#f87171',
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)',
                          borderRadius: 'var(--r-sm)', padding: '4px 10px',
                        }}>
                          Hold expires {expires}
                        </div>
                      </div>

                      {/* Info cells */}
                      <div className="info-grid-3">
                        <div className="info-cell">
                          <span className="info-cell-label">
                            Requested Units ({req.units?.length || 1})
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                            {req.units && req.units.length > 0 ? (
                              req.units.map((u, ui) => (
                                <span key={ui} className="unit-pill">
                                  {u.category.replace(/_/g, ' ')} — {u.unit_label}
                                </span>
                              ))
                            ) : (
                              <span className="unit-pill">
                                {req.unit_category?.replace(/_/g, ' ')} ({req.unit_label})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="info-cell">
                          <span className="info-cell-label">Inbound Transport</span>
                          <span className="info-cell-value">{req.vehicle_number || '108 Auto-Fleet'}</span>
                          {req.driver_phone && (
                            <span className="info-cell-sub">{req.driver_phone}</span>
                          )}
                        </div>
                        <div className="info-cell">
                          <span className="info-cell-label">Patient Coordinates</span>
                          <span className="info-cell-value" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem' }}>
                            {req.inc_lat?.toFixed(4)}, {req.inc_lng?.toFixed(4)}
                          </span>
                          <span className="info-cell-sub">Est. transit ~7-12 min</span>
                        </div>
                      </div>

                      {/* Triage description */}
                      <div className="triage-desc">
                        <strong>Clinical Triage: </strong>
                        &ldquo;{req.description_raw || 'Emergency SOS — no description provided.'}&rdquo;
                      </div>

                      {/* Actions */}
                      <div className="action-row">
                        <button
                          type="button"
                          onClick={() => rejectIncident(req.incident_id)}
                          className="btn btn-danger"
                          id={`reject-btn-${req.incident_id.slice(0, 8)}`}
                        >
                          <IconX size={13} />
                          Decline & Replan
                        </button>
                        <button
                          type="button"
                          onClick={() => acceptIncident(req.incident_id)}
                          className="btn btn-accent"
                          id={`accept-btn-${req.incident_id.slice(0, 8)}`}
                        >
                          <IconCheck size={13} />
                          Accept Patient ({req.units?.length || 1} resource{(req.units?.length || 1) !== 1 ? 's' : ''})
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══ TAB 2: RESOURCE INVENTORY ═══ */}
        {activeTab === 'RESOURCES' && (
          <section aria-labelledby="resources-heading">
            <div className="kaze-section-header">
              <div>
                <h2 className="kaze-section-title" id="resources-heading">Hospital Resource Inventory</h2>
                <p className="kaze-section-sub">
                  Live availability, capacity adjustment, and discrete unit provisioning.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddResource(true)}
                className="btn btn-accent"
                id="add-resource-btn"
              >
                <IconPlus size={13} />
                Add Equipment
              </button>
            </div>

            {/* Aggregated capacity cards */}
            <div className="resource-grid" style={{ marginBottom: 24 }}>
              {RESOURCE_CATS.map(cat => {
                const units = resourceUnits.filter(u => u.category === cat.key);
                const freeCount = units.filter(u => u.status === 'FREE').length;
                const totalCount = units.length;
                const occupiedCount = units.filter(u => u.status === 'OCCUPIED' || u.status === 'HELD').length;
                const pct = totalCount > 0 ? (freeCount / totalCount) * 100 : 0;
                const CatIcon = cat.Icon;

                return (
                  <div key={cat.key} className="resource-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div className="resource-icon-wrap">
                        <CatIcon size={18} />
                      </div>
                      <span style={{
                        fontSize: '0.6rem', fontFamily: 'ui-monospace, monospace', fontWeight: 700,
                        color: 'var(--text-dim)', letterSpacing: '0.06em',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-sm)', padding: '2px 6px',
                      }}>
                        {cat.key}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {cat.label}
                      </h3>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
                      <div>
                        <span className="resource-count">{freeCount}</span>
                        <span className="resource-count-sub">/ {totalCount} free</span>
                      </div>
                      <span className="resource-occupied">{occupiedCount} occupied</span>
                    </div>

                    <div className="cap-bar-track">
                      <div className="cap-bar-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="adj-row">
                      <span className="adj-label">Quick adjust</span>
                      <div className="adj-controls">
                        <button
                          type="button"
                          className="adj-btn"
                          onClick={() => adjustCapacity(cat.key, -1)}
                          disabled={freeCount <= 0}
                          aria-label={`Decrease ${cat.label}`}
                          title="Mark one unit as in maintenance"
                        >
                          −
                        </button>
                        <span className="adj-count">{freeCount}</span>
                        <button
                          type="button"
                          className="adj-btn"
                          onClick={() => adjustCapacity(cat.key, 1)}
                          aria-label={`Increase ${cat.label}`}
                          title="Free up or add one unit"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discrete unit table */}
            <div className="kaze-table-wrap">
              <div className="kaze-table-header">
                <span className="kaze-table-title">Discrete Physical Units ({resourceUnits.length})</span>
                <span className="kaze-table-hint">Atomic resource state tracking</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="kaze-table" aria-label="Resource units inventory">
                  <thead>
                    <tr>
                      <th scope="col">Unit Label</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Movable</th>
                      <th scope="col">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceUnits.map(unit => (
                      <tr key={unit.id}>
                        <td className="mono">{unit.unit_label}</td>
                        <td>{unit.category.replace(/_/g, ' ')}</td>
                        <td>
                          <span className={`chip ${unit.status}`}>{unit.status}</span>
                        </td>
                        <td style={{ color: unit.is_movable ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {unit.is_movable ? 'Movable' : 'Fixed'}
                        </td>
                        <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(unit.updated_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Resource Modal */}
            {showAddResource && (
              <div className="kaze-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="kaze-modal">
                  <h3 className="kaze-modal-title" id="modal-title">Add Equipment to Hospital</h3>
                  <p className="kaze-modal-sub">
                    Creates discrete physical tracking identifiers for new hospital assets.
                  </p>
                  <form onSubmit={handleAddResource}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-category">Category</label>
                      <select
                        id="modal-category"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="ICU_BED">ICU Bed</option>
                        <option value="VENTILATOR">Ventilator</option>
                        <option value="TRAUMA_BAY">Trauma Bay</option>
                        <option value="OXYGEN_BED">Oxygen Bed</option>
                        <option value="PEDIATRIC_ICU">Pediatric ICU</option>
                        <option value="GENERAL_BED">General Ward Bed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-count">Quantity to Add</label>
                      <input
                        id="modal-count"
                        type="number"
                        min="1" max="20"
                        value={newCount}
                        onChange={e => setNewCount(parseInt(e.target.value, 10) || 1)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-checkbox-row" style={{ marginBottom: 16 }}>
                      <input
                        type="checkbox"
                        id="modal-movable"
                        checked={newIsMovable}
                        onChange={e => setNewIsMovable(e.target.checked)}
                      />
                      <label htmlFor="modal-movable" className="form-checkbox-label">
                        Movable equipment (e.g. portable ventilator)
                      </label>
                    </div>
                    <div className="kaze-modal-footer">
                      <button
                        type="button"
                        onClick={() => setShowAddResource(false)}
                        className="btn btn-ghost"
                        id="modal-cancel-btn"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-accent" id="modal-confirm-btn">
                        Confirm & Provision
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══ TAB 3: PATIENT ARRIVAL & HANDOVER ═══ */}
        {activeTab === 'HANDOVER' && (
          <section aria-labelledby="handover-heading">
            <div className="kaze-section-header">
              <div>
                <h2 className="kaze-section-title" id="handover-heading">Patient Arrival & Handover Station</h2>
                <p className="kaze-section-sub">
                  When an ambulance arrives, complete the handover to admit the patient and release the vehicle for new dispatches.
                </p>
              </div>
            </div>

            {confirmedCases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconHospital size={22} />
                </div>
                <h3 className="empty-title">No In-Transit Ambulances</h3>
                <p className="empty-sub">
                  Accepted reservations and active inbound patients will appear here awaiting ER admission.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {confirmedCases.map(c => (
                  <article key={c.id} className="handover-card" aria-label={`Inbound patient case ${c.incident_id.slice(0, 8)}`}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className={`status-tag ${c.status}`}>{c.status}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: 'var(--text-primary)' }}>
                          {c.vehicle_number || '108 EM UNIT'}
                        </span>
                        {c.driver_phone && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>
                            {c.driver_phone}
                          </span>
                        )}
                        <span className="live-dot" aria-label="Live tracking" />
                      </div>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Incident #{c.incident_id.slice(0, 8).toUpperCase()}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                        {c.units && c.units.length > 0 ? (
                          c.units.map((u, ui) => (
                            <span key={ui} className="unit-pill">
                              {u.category.replace(/_/g, ' ')} — {u.unit_label}
                            </span>
                          ))
                        ) : (
                          <span className="unit-pill">
                            {c.unit_category?.replace(/_/g, ' ') || 'Reserved Resource'} ({c.unit_label || 'Unit'})
                          </span>
                        )}
                      </div>

                      {c.description_raw && (
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                          &ldquo;{c.description_raw}&rdquo;
                        </p>
                      )}
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => completeIncidentHandover(c.incident_id, c.vehicle_number)}
                        className="btn btn-accent"
                        id={`handover-btn-${c.incident_id.slice(0, 8)}`}
                      >
                        <IconCheck size={14} />
                        Patient Arrived — Free Ambulance
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
