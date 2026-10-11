'use client';
import React, { useState, useEffect } from 'react';
import SatelliteTrackingMap from './components/SatelliteTrackingMap';

const API_BASE = 'http://localhost:4000';

/* ─── Types ──────────────────────────────────────────────────────── */
interface UserSession { role: string; username: string; name: string; }

interface Incident {
  id: string;
  idempotency_key?: string;
  latitude: number;
  longitude: number;
  address_text?: string;
  description_raw?: string;
  triage_level: string;
  status: string;
  created_at: string;
  requirements?: Array<{ category: string; quantity_needed: number; justification?: string }>;
}

interface HospitalCandidate {
  hospitalId: string;
  name: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  travelMinutes: number;
  freePrimaryCount: number;
  primaryCategory: string;
  pAvailable: number;
  pAvailablePercent: number;
  isStale: boolean;
  minutesSinceReport: number;
  stalenessPenalty: number;
  compositeScore: number;
  capacitySummary?: Array<{ category: string; total: string | number; free: string | number }>;
}

interface Ambulance {
  id: string;
  vehicle_number: string;
  driver_name?: string;
  driver_phone?: string;
  current_lat: number;
  current_lng: number;
  status: string;
}

/* ─── SVG Icons ──────────────────────────────────────────────────── */
function IconAmbulance({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 10H6M8 8v4M19 17h1a1 1 0 0 0 1-1v-3.5a1.5 1.5 0 0 0-.44-1.06L17.5 8.38A2 2 0 0 0 16.09 8H14V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h1" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function IconAlertTriangle({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconMap({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function IconSignal({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6c0 0 4-2 11-2s11 2 11 2" />
      <path d="M4 11c0 0 3-2 8-2s8 2 8 2" />
      <path d="M7 16c0 0 2-1 5-1s5 1 5 1" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconLogout({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconHeart({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconZap({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconCross({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function AmbulanceAdminDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loginId, setLoginId] = useState('admin');
  const [loginPass, setLoginPass] = useState('admin');
  const [authError, setAuthError] = useState('');

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [candidates, setCandidates] = useState<HospitalCandidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any>(null);

  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'FLEET' | 'MAP'>('DISPATCH');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Session restore
  useEffect(() => {
    const saved = localStorage.getItem('kaze_ambulance_admin_session');
    if (saved) { try { setSession(JSON.parse(saved)); } catch (_) {} }
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 5000);
  };

  /* ── Auth ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/ambulance/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: loginId, password: loginPass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSession(data.user);
        localStorage.setItem('kaze_ambulance_admin_session', JSON.stringify(data.user));
        showToast('Authenticated as Central Ambulance Administrator.', 'success');
      } else {
        setAuthError(data.error || 'Invalid credentials. Use admin / admin.');
      }
    } catch (err: any) {
      setAuthError(`Connection error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kaze_ambulance_admin_session');
    setSession(null);
  };

  /* ── Data polling ── */
  const fetchData = async () => {
    if (!session) return;
    try {
      const [incRes, ambRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/dispatcher/active-incidents`),
        fetch(`${API_BASE}/api/v1/dispatcher/ambulances`),
      ]);

      if (incRes.ok) {
        const incData = await incRes.json();
        if (incData.success) {
          const list: Incident[] = incData.incidents || [];
          setIncidents(list);
          if (selectedIncident) {
            const updated = list.find(i => i.id === selectedIncident.id);
            if (updated) setSelectedIncident(updated);
          }
        }
      }

      if (ambRes.ok) {
        const ambData = await ambRes.json();
        if (ambData.success) {
          const fleet: Ambulance[] = ambData.ambulances || [];
          setAmbulances(fleet);
          if (!selectedAmbulanceId && fleet.length > 0) {
            const firstAvail = fleet.find(a => a.status === 'AVAILABLE') || fleet[0];
            setSelectedAmbulanceId(firstAvail.id);
          }
        }
      }

      if (selectedIncident) {
        const detailRes = await fetch(`${API_BASE}/api/v1/incidents/${selectedIncident.id}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          setActiveReservation(detailData.success && detailData.activeReservation ? detailData.activeReservation : null);
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (!session) return;
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedIncident?.id]);

  /* ── Incident actions ── */
  const handleSelectIncident = async (inc: Incident) => {
    setSelectedIncident(inc);
    setLoadingCandidates(true);
    setCandidates([]);
    try {
      const res = await fetch(`${API_BASE}/api/v1/dispatcher/incidents/${inc.id}/recommendations`);
      const data = await res.json();
      if (data.success && data.recommendations) {
        setCandidates(data.recommendations);
      } else {
        showToast('Could not fetch hospital candidates.', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleRequestHospital = async (cand: HospitalCandidate) => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/dispatcher/incidents/${selectedIncident.id}/request-hospital`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalId: cand.hospitalId, ambulanceId: selectedAmbulanceId || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request sent to ${cand.name}. Awaiting ER acceptance...`, 'success');
        fetchData();
      } else {
        showToast(data.error || 'Failed to request hospital.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const handleConfirmDispatch = async () => {
    if (!selectedIncident) return;
    const chosenAmb = ambulances.find(a => a.id === selectedAmbulanceId) || ambulances[0];
    try {
      const res = await fetch(`${API_BASE}/api/v1/dispatcher/incidents/${selectedIncident.id}/dispatch-ambulance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambulanceId: chosenAmb?.id, driverName: chosenAmb?.driver_name, driverPhone: chosenAmb?.driver_phone }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Ambulance ${chosenAmb?.vehicle_number || ''} dispatched. Tracking transmitted to patient app.`, 'success');
        fetchData();
      } else {
        showToast(data.error || 'Failed to dispatch ambulance.', 'error');
      }
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const handleSimulateSOS = async (triageType: 'TRAUMA' | 'CARDIAC' | 'GENERAL') => {
    const descMap = {
      TRAUMA:  'High-speed motorcycle collision near Akurdi station, rider unconscious with severe head bleeding.',
      CARDIAC: '62-year-old male with acute crushing chest pain, diaphoresis, and severe breathlessness.',
      GENERAL: 'Worker fallen from scaffolding with severe lower limb fracture and acute pain.',
    };
    try {
      const res = await fetch(`${API_BASE}/api/v1/incidents/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: 18.6253, longitude: 73.8166,
          description: descMap[triageType], addressText: 'Akurdi Railway Station Chowk, Pune',
        }),
      });
      const data = await res.json();
      if (data.success && data.incident) {
        showToast(`New SOS alert received (${triageType}). Auto-routed for triage.`, 'info');
        fetchData();
        handleSelectIncident(data.incident);
      }
    } catch (err: any) { showToast(`Simulation error: ${err.message}`, 'error'); }
  };

  /* ── Derived ── */
  const triageCls = (level: string) => {
    if (level === 'RESUSCITATION') return 'RESUSCITATION';
    if (level === 'EMERGENT') return 'EMERGENT';
    return 'URGENT';
  };

  /* ═══════════════════════════════════════════════════
      AUTH SCREEN
  ═══════════════════════════════════════════════════ */
  if (!session) {
    return (
      <div className="kaze-auth-wrap">
        <div className="kaze-auth-glow" aria-hidden="true" />
        <div className="kaze-auth-box">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div className="kaze-brand-mark" aria-hidden="true">
              <IconAmbulance size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>KAZE</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>Emergency Command Grid</div>
            </div>
          </div>

          <h1 className="kaze-auth-title">Ambulance Admin Console</h1>
          <p className="kaze-auth-sub">
            Central dispatch, intelligent nearest hospital matching, and fleet control for Pune metro emergency services.
          </p>

          {authError && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)',
              borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '0.8rem',
              color: '#fca5a5', marginBottom: 16,
            }} role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginId">Admin User ID</label>
              <input
                id="loginId" type="text" required value={loginId}
                onChange={e => setLoginId(e.target.value)}
                placeholder="admin"
                className="form-input"
                style={{ fontFamily: 'ui-monospace, monospace' }}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="loginPass">Password</label>
              <input
                id="loginPass" type="password" required value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="admin"
                className="form-input"
                style={{ fontFamily: 'ui-monospace, monospace' }}
                autoComplete="current-password"
              />
            </div>
            <div className="hint-box">
              Credentials pre-filled: ID <strong>admin</strong> / Password <strong>admin</strong>
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              id="ambulance-login-btn"
            >
              Sign In to Central Dispatch
            </button>
          </form>
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
            {/* Brand */}
            <div className="kaze-brand">
              <div className="kaze-brand-mark" aria-hidden="true">
                <IconAmbulance size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="kaze-brand-name">Central Ambulance Dispatch</span>
                  <span className="kaze-status-pill online">
                    <span className="kaze-status-dot pulse" aria-hidden="true" />
                    Online Grid
                  </span>
                </div>
                <div className="kaze-header-meta">
                  <span>Operator: {session.name}</span>
                  <span className="kaze-meta-sep">|</span>
                  <span>{ambulances.filter(a => a.status === 'AVAILABLE').length} available / {ambulances.length} total fleet</span>
                  <span className="kaze-meta-sep">|</span>
                  <span>{incidents.length} active SOS</span>
                </div>
              </div>
            </div>

            {/* SOS Simulator + Actions */}
            <div className="kaze-header-actions">
              <div className="sos-sim-bar" aria-label="Simulate SOS events">
                <span className="sos-sim-label">Test SOS</span>
                <button
                  type="button"
                  className="sos-sim-btn trauma"
                  onClick={() => handleSimulateSOS('TRAUMA')}
                  title="Simulate trauma SOS"
                  id="sim-trauma-btn"
                >
                  Trauma
                </button>
                <button
                  type="button"
                  className="sos-sim-btn cardiac"
                  onClick={() => handleSimulateSOS('CARDIAC')}
                  title="Simulate cardiac SOS"
                  id="sim-cardiac-btn"
                >
                  Cardiac
                </button>
              </div>
              <button type="button" onClick={handleLogout} className="btn btn-ghost" id="logout-btn">
                <IconLogout size={14} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <nav className="kaze-tabs" aria-label="Dashboard sections">
            <button
              className={`kaze-tab ${activeTab === 'DISPATCH' ? 'active' : ''}`}
              onClick={() => setActiveTab('DISPATCH')}
              aria-current={activeTab === 'DISPATCH' ? 'page' : undefined}
              id="tab-dispatch"
            >
              <IconAlertTriangle size={14} />
              Live SOS & Hospital Matching
              {incidents.length > 0 && (
                <span className="kaze-badge" aria-label={`${incidents.length} active`}>{incidents.length}</span>
              )}
            </button>
            <button
              className={`kaze-tab ${activeTab === 'FLEET' ? 'active' : ''}`}
              onClick={() => setActiveTab('FLEET')}
              aria-current={activeTab === 'FLEET' ? 'page' : undefined}
              id="tab-fleet"
            >
              <IconAmbulance size={14} />
              108 Fleet Status
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                ({ambulances.length} vehicles)
              </span>
            </button>
            <button
              className={`kaze-tab ${activeTab === 'MAP' ? 'active' : ''}`}
              onClick={() => setActiveTab('MAP')}
              aria-current={activeTab === 'MAP' ? 'page' : undefined}
              id="tab-map"
            >
              <IconMap size={14} />
              Satellite Tracking Radar
              <span className="kaze-badge live">Live</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Toast */}
      {actionMsg && (
        <div className="kaze-toast-wrap" role="alert" aria-live="polite">
          <div className={`kaze-toast ${actionMsg.type}`}>
            <span>{actionMsg.text}</span>
            <button className="kaze-toast-close" onClick={() => setActionMsg(null)} aria-label="Dismiss">
              <IconX size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="kaze-main" id="main-content">

        {/* ═══ TAB 1: DISPATCH ═══ */}
        {activeTab === 'DISPATCH' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>

            {/* Left: SOS Incident list */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="kaze-section-title" style={{ fontSize: '0.9rem' }}>
                  Incoming SOS Alerts ({incidents.length})
                </span>
                <span style={{ fontSize: '0.65rem', fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                  Auto-refresh 3 s
                </span>
              </div>

              {incidents.length === 0 ? (
                <div className="empty-state" style={{ padding: 32 }}>
                  <div className="empty-icon">
                    <IconCheck size={20} />
                  </div>
                  <h3 className="empty-title">No Active SOS Incidents</h3>
                  <p className="empty-sub">
                    Emergency alerts from citizens will appear here in real time.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSimulateSOS('TRAUMA')}
                    className="btn btn-ghost"
                    style={{ marginTop: 16, fontSize: '0.72rem' }}
                    id="trigger-sim-btn"
                  >
                    <IconZap size={12} />
                    Trigger Simulated SOS
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {incidents.map(inc => {
                    const isSelected = selectedIncident?.id === inc.id;
                    return (
                      <button
                        key={inc.id}
                        onClick={() => handleSelectIncident(inc)}
                        className={`incident-item ${isSelected ? 'selected' : ''}`}
                        style={{ textAlign: 'left', width: '100%', cursor: 'pointer', background: 'none', border: 'none' }}
                        id={`incident-${inc.id.slice(0, 8)}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span className={`triage-badge ${triageCls(inc.triage_level)}`}>{inc.triage_level}</span>
                          <span style={{ fontSize: '0.62rem', fontFamily: 'ui-monospace, monospace', color: 'var(--text-muted)' }}>
                            #{inc.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          &ldquo;{inc.description_raw || 'Emergency SOS trigger'}&rdquo;
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                          <span style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>
                            {inc.status}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>{new Date(inc.created_at).toLocaleTimeString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Selected incident detail + hospital matching */}
            <div>
              {!selectedIncident ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <IconMap size={22} />
                  </div>
                  <h3 className="empty-title">Select an SOS Request</h3>
                  <p className="empty-sub">
                    Click any incoming incident from the left panel to trigger automated nearest hospital calculation, availability forecasting, and dispatch coordination.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Incident detail card */}
                  <div className="kaze-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span className={`triage-badge ${triageCls(selectedIncident.triage_level)}`}>
                            {selectedIncident.triage_level}
                          </span>
                          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace' }}>
                            #{selectedIncident.id.slice(0, 8).toUpperCase()}
                          </h3>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {selectedIncident.latitude.toFixed(4)}, {selectedIncident.longitude.toFixed(4)}{' '}
                          &mdash; {selectedIncident.address_text || 'Pune Metro Area'}
                        </p>
                      </div>
                      <span style={{
                        fontSize: '0.65rem', fontFamily: 'ui-monospace, monospace', fontWeight: 700,
                        color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 8px',
                      }}>
                        {selectedIncident.status}
                      </span>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                      borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '0.78rem',
                      color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14,
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 2, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Reported Condition
                      </span>
                      &ldquo;{selectedIncident.description_raw || 'Emergency SOS trigger'}&rdquo;
                    </div>

                    {/* Ambulance selector + dispatch button */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
                          htmlFor="amb-select">
                          Assign 108 Unit:
                        </label>
                        <select
                          id="amb-select"
                          value={selectedAmbulanceId}
                          onChange={e => setSelectedAmbulanceId(e.target.value)}
                          className="form-select"
                          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.75rem', fontFamily: 'ui-monospace, monospace' }}
                        >
                          {ambulances.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.vehicle_number} — {a.driver_name || 'Driver'} ({a.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      {activeReservation?.status === 'CONFIRMED' && selectedIncident.status !== 'EN_ROUTE' && (
                        <button
                          type="button"
                          onClick={handleConfirmDispatch}
                          className="btn btn-success"
                          style={{ animation: 'dotPulse 1.5s ease-in-out infinite' }}
                          id="confirm-dispatch-btn"
                        >
                          <IconAmbulance size={14} />
                          Confirm Ambulance Dispatched
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reservation status banner */}
                  {activeReservation && (
                    <div className={`reservation-banner ${activeReservation.status === 'CONFIRMED' ? 'confirmed' : 'held'}`}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span className="live-dot" aria-hidden="true" />
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: activeReservation.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)' }}>
                            {activeReservation.status === 'CONFIRMED' ? 'Request Accepted by Hospital' : 'Pending Hospital ER Acceptance'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {activeReservation.hospital_name || 'Designated Facility'}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {activeReservation.vehicle_number || '108 Fleet'} &mdash; {activeReservation.driver_name || 'Paramedic'} ({activeReservation.driver_phone || 'Available'})
                        </p>
                      </div>
                      {activeReservation.status === 'CONFIRMED' && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '6px 12px', background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--r-md)',
                          fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)',
                        }}>
                          <IconCheck size={12} />
                          Bed Confirmed at ER
                        </span>
                      )}
                    </div>
                  )}

                  {/* Satellite map */}
                  <div className="map-container">
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IconSignal size={13} />
                        Live Satellite Route Radar — Pune Metro
                      </span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>
                        Esri Optical Imagery
                      </span>
                    </div>
                    <SatelliteTrackingMap
                      patientLocation={{
                        lat: selectedIncident.latitude,
                        lng: selectedIncident.longitude,
                        label: selectedIncident.address_text || 'Emergency Location',
                      }}
                      ambulance={
                        ambulances.find(a => a.id === selectedAmbulanceId) ||
                        ambulances[0] || {
                          vehicle_number: 'MH-12-EM-1081',
                          driver_name: 'Santosh Pawar',
                          driver_phone: '+91 98230 10801',
                          current_lat: 18.635,
                          current_lng: 73.795,
                        }
                      }
                      hospitalLocation={
                        activeReservation
                          ? { lat: activeReservation.hospital_lat || 18.6253, lng: activeReservation.hospital_lng || 73.8166, label: activeReservation.hospital_name || 'Designated Hospital' }
                          : null
                      }
                      isDispatched={Boolean(activeReservation?.status === 'CONFIRMED' || selectedIncident.status === 'EN_ROUTE')}
                    />
                  </div>

                  {/* Hospital matching */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          Automated Hospital Availability Matcher
                        </h3>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          Ranked by ML-calibrated arrival availability P(available@ETA), travel time, and data freshness.
                        </p>
                      </div>
                      {loadingCandidates && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, animation: 'dotPulse 1s ease-in-out infinite' }}>
                          Evaluating network...
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {candidates.map((cand, idx) => {
                        const isTop = idx === 0;
                        return (
                          <article key={cand.hospitalId} className={`candidate-card ${isTop ? 'top-match' : ''}`}
                            aria-label={`Hospital candidate: ${cand.name}`}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  {isTop && (
                                    <span style={{
                                      padding: '2px 7px', background: 'var(--accent)', color: '#fff',
                                      borderRadius: 'var(--r-sm)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                                    }}>
                                      #1 Match
                                    </span>
                                  )}
                                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cand.name}</h4>
                                </div>
                                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                  {cand.contactPhone} &mdash; {cand.latitude.toFixed(4)}, {cand.longitude.toFixed(4)}
                                </p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.72rem', fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                                  Score: {cand.compositeScore}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>
                                  P(avail): {cand.pAvailablePercent}%
                                </span>
                              </div>
                            </div>

                            <div className="metric-cell-grid">
                              <div className="metric-cell">
                                <span className="metric-cell-label">Est. Travel</span>
                                <span className="metric-cell-value">{cand.travelMinutes} min ({cand.distanceKm} km)</span>
                              </div>
                              <div className="metric-cell">
                                <span className="metric-cell-label">Free Units</span>
                                <span className="metric-cell-value" style={{ color: 'var(--success)' }}>{cand.freePrimaryCount} available</span>
                              </div>
                              <div className="metric-cell">
                                <span className="metric-cell-label">ML Availability</span>
                                <span className="metric-cell-value" style={{ color: 'var(--accent)' }}>{cand.pAvailablePercent}% confidence</span>
                              </div>
                              <div className="metric-cell">
                                <span className="metric-cell-label">Data Freshness</span>
                                <span className="metric-cell-value" style={{ color: cand.isStale ? 'var(--warning)' : 'var(--success)' }}>
                                  {cand.isStale ? `Stale (${cand.minutesSinceReport}m)` : 'Live / Verified'}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                              <button
                                type="button"
                                onClick={() => handleRequestHospital(cand)}
                                className="btn btn-accent"
                                style={{ fontSize: '0.74rem' }}
                                id={`request-hosp-${cand.hospitalId.slice(0, 8)}`}
                              >
                                Send Request to {cand.name.split(' ')[0]} ER
                                <IconArrowRight size={12} />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB 2: FLEET STATUS ═══ */}
        {activeTab === 'FLEET' && (
          <section aria-labelledby="fleet-heading">
            <div className="kaze-section-header">
              <div>
                <h2 className="kaze-section-title" id="fleet-heading">Pune 108 Emergency Fleet</h2>
                <p className="kaze-section-sub">
                  Real-time telemetry, driver contacts, and trip statuses for active emergency vehicles.
                </p>
              </div>
              <span style={{
                fontSize: '0.72rem', fontFamily: 'ui-monospace, monospace',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '5px 12px', color: 'var(--text-muted)',
              }}>
                {ambulances.filter(a => a.status === 'AVAILABLE').length} Available / {ambulances.length} Total
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {ambulances.map(amb => (
                <article key={amb.id} className="fleet-card" aria-label={`Ambulance ${amb.vehicle_number}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'ui-monospace, monospace', color: 'var(--text-primary)' }}>
                      {amb.vehicle_number}
                    </span>
                    <span className={`fleet-chip ${amb.status}`}>{amb.status}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 52 }}>Driver</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{amb.driver_name || 'Emergency Responder'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 52 }}>Contact</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>{amb.driver_phone || '+91 98XXXXXXXXX'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 52 }}>GPS</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>
                        {amb.current_lat.toFixed(4)}, {amb.current_lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ═══ TAB 3: SATELLITE TRACKING MAP ═══ */}
        {activeTab === 'MAP' && (
          <section aria-labelledby="map-heading">
            <div className="kaze-section-header">
              <div>
                <h2 className="kaze-section-title" id="map-heading">Pune Metro Satellite Tracking Grid</h2>
                <p className="kaze-section-sub">
                  Live optical Earth imagery with real-time ambulance transit tracking. Bounded to Pune metropolitan coordinates.
                </p>
              </div>
              <span style={{
                fontSize: '0.65rem', fontFamily: 'ui-monospace, monospace',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '4px 10px', color: 'var(--text-muted)',
              }}>
                Bounds: 18.35°N–18.82°N, 73.65°E–74.15°E
              </span>
            </div>

            {/* Incident picker */}
            {incidents.length > 0 && (
              <div className="kaze-card" style={{ marginBottom: 16, padding: '12px 16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Track Incident:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {incidents.map(inc => (
                      <button
                        key={inc.id}
                        onClick={() => handleSelectIncident(inc)}
                        className={`btn ${selectedIncident?.id === inc.id ? 'btn-accent' : 'btn-ghost'}`}
                        style={{ fontSize: '0.7rem', padding: '5px 10px', fontFamily: 'ui-monospace, monospace' }}
                        id={`map-track-${inc.id.slice(0, 8)}`}
                      >
                        #{inc.id.slice(0, 8)} ({inc.triage_level})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="map-container">
              <SatelliteTrackingMap
                patientLocation={{
                  lat: selectedIncident?.latitude || 18.6253,
                  lng: selectedIncident?.longitude || 73.8166,
                  label: selectedIncident?.address_text || 'Akurdi Railway Station Chowk, Pune',
                }}
                ambulance={
                  ambulances.find(a => a.id === selectedAmbulanceId) ||
                  ambulances[0] || {
                    vehicle_number: 'MH-12-EM-1081',
                    driver_name: 'Santosh Pawar',
                    driver_phone: '+91 98230 10801',
                    current_lat: 18.638,
                    current_lng: 73.792,
                  }
                }
                hospitalLocation={
                  activeReservation
                    ? { lat: activeReservation.hospital_lat || 18.6253, lng: activeReservation.hospital_lng || 73.8166, label: activeReservation.hospital_name || 'Designated Hospital' }
                    : { lat: 18.6253, lng: 73.8166, label: 'Dr. D.Y. Patil Medical College & Hospital' }
                }
                isDispatched={true}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
