"use client";

import { useState, useEffect, useRef } from "react";

/* ── Crisp SVG Icons (Strictly No Emojis) ────────────────────────── */
function CrossIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6
        19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
        12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27
        a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function AmbulanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 10H6M8 8v4M19 17h1a1 1 0 0 0 1-1v-3.5a1.5 1.5 0 0 0-.44-1.06L17.5 8.38A2 2 0 0 0 16.09 8H14V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h1" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function NavigationIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function HospitalIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 10h6M12 7v6" />
    </svg>
  );
}

function SpinnerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="animate-spin" aria-hidden="true">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function ArrowUpRightIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function useElapsedTime(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      setSeconds(0);
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
      ref.current = null;
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/* ── BedGrid ─────────────────────────────────────────────────────── */
const BED_COUNT = 24;
function BedGrid() {
  const cells = Array.from({ length: BED_COUNT }, (_, i) => {
    if (i < 2)  return "scanning";
    if (i < 8)  return "available";
    if (i < 21) return "occupied";
    return "reserved";
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5, marginBottom: 12 }}>
      {cells.map((state, i) => (
        <div
          key={i}
          className={`bed-cell ${state}`}
          title={state}
          style={{ aspectRatio: "1", borderRadius: 4, border: "1.5px solid" }}
        />
      ))}
    </div>
  );
}

const API_BASE = "http://localhost:4000";

interface LiveIncidentData {
  id?: string;
  triageLevel?: string;
  status?: string;
  hospitalName?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  isBackendConnected: boolean;
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function SOSButton() {
  const [triggered, setTriggered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveData, setLiveData] = useState<LiveIncidentData>({
    isBackendConnected: false,
    triageLevel: "RESUSCITATION",
    status: "DISPATCHED",
    hospitalName: "NIMHANS Emergency Center",
    vehicleNumber: "AMB-07",
    driverName: "Suresh Patil",
    driverPhone: "+91 98230 44102",
  });

  const elapsed = useElapsedTime(triggered);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trigger SOS API
  const handleTriggerSOS = async () => {
    setTriggered(true);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/incidents/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 18.5204,
          longitude: 73.8567,
          description: "Critical cardiac emergency triggered via KAZE Portal",
          addressText: "FC Road, Shivajinagar, Pune",
          callerId: "citizen-web-portal",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.incident) {
          const inc = data.incident;
          setLiveData((prev) => ({
            ...prev,
            id: inc.id,
            triageLevel: inc.triage_level || "RESUSCITATION",
            status: inc.status || "ALLOCATING",
            isBackendConnected: true,
          }));

          // Start polling incident status
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = setInterval(async () => {
            try {
              const checkRes = await fetch(`${API_BASE}/api/v1/incidents/${inc.id}`);
              if (checkRes.ok) {
                const checkData = await checkRes.json();
                if (checkData.activeReservation) {
                  const r = checkData.activeReservation;
                  setLiveData((prev) => ({
                    ...prev,
                    status: r.status || checkData.incident?.status || prev.status,
                    hospitalName: r.hospital_name || prev.hospitalName,
                    vehicleNumber: r.vehicle_number || prev.vehicleNumber,
                    driverName: r.driver_name || prev.driverName,
                    driverPhone: r.driver_phone || prev.driverPhone,
                  }));
                }
              }
            } catch {
              // Ignore polling errors gracefully
            }
          }, 3000);
        }
      } else {
        // Fallback gracefully to demo telemetry
        setLiveData((prev) => ({ ...prev, isBackendConnected: false }));
      }
    } catch {
      // Backend not running — fallback smoothly
      setLiveData((prev) => ({ ...prev, isBackendConnected: false }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setTriggered(false);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%" }}>
      {/* Pulse-ring + button */}
      <div className="sos-btn-wrap">
        <div className="sos-ring" aria-hidden="true" />
        <div className="sos-ring" aria-hidden="true" />
        <div className="sos-ring" aria-hidden="true" />

        <button
          id="sos-trigger-btn"
          className="sos-btn"
          onClick={handleTriggerSOS}
          disabled={submitting}
          aria-pressed={triggered}
          aria-label="Initiate SOS — contact emergency responders"
          type="button"
        >
          {submitting ? <SpinnerIcon size={18} /> : <CrossIcon size={18} />}
          {submitting ? "Transmitting..." : triggered ? "SOS Active" : "Initiate SOS"}
        </button>
      </div>

      {/* Status card — appears after trigger */}
      {triggered && (
        <div className="status-card" role="status" aria-live="polite" aria-label="SOS system status">

          {/* Header */}
          <div className="status-header">
            <div className="status-indicator" aria-hidden="true" />
            <span className="status-title">Emergency Response Active</span>
            {liveData.id && (
              <span
                style={{
                  fontSize: "0.68rem",
                  fontFamily: "ui-monospace, monospace",
                  background: "rgba(0,0,0,0.06)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                #{liveData.id.slice(0, 8)}
              </span>
            )}
            <span className="status-time" aria-label={`Elapsed time: ${elapsed}`}>{elapsed}</span>
          </div>

          {/* Connection status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 8px",
              background: liveData.isBackendConnected ? "rgba(52,199,89,0.08)" : "rgba(10,132,255,0.08)",
              borderRadius: 6,
              marginBottom: 10,
              fontSize: "0.72rem",
            }}
          >
            <span style={{ fontWeight: 600, color: liveData.isBackendConnected ? "#1a8c38" : "#0056cc" }}>
              {liveData.isBackendConnected ? "Backend Core: Connected (Port 4000)" : "Simulation Mode: Autonomous Telemetry"}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: liveData.triageLevel === "RESUSCITATION" ? "#e0261a" : "#c47800",
              }}
            >
              Triage: {liveData.triageLevel}
            </span>
          </div>

          {/* Row 1 — Ambulance Dispatch */}
          <div className="status-row">
            <div className="status-row-icon green" aria-hidden="true">
              <AmbulanceIcon size={18} />
            </div>
            <div className="status-row-body">
              <div className="status-row-label">Ambulance Dispatch</div>
              <div className="status-row-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Unit {liveData.vehicleNumber}
                <span className="status-badge dispatched">{liveData.status}</span>
              </div>
              {liveData.driverName && (
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: 2 }}>
                  Driver: {liveData.driverName} {liveData.driverPhone && `(${liveData.driverPhone})`}
                </div>
              )}
            </div>
          </div>

          {/* Row 2 — Route Calculation */}
          <div className="status-row">
            <div className="status-row-icon blue" aria-hidden="true">
              <NavigationIcon size={18} />
            </div>
            <div className="status-row-body">
              <div className="status-row-label">Nearest Route — Live Traffic</div>
              <div className="status-row-value" style={{ marginBottom: 6 }}>
                Shivajinagar → {liveData.hospitalName}
                <span className="status-badge routing" style={{ marginLeft: 8 }}>Routing</span>
              </div>
              <div className="route-bar-wrap">
                <div className="route-bar-bg">
                  <div className="route-bar-fill" aria-label="Route calculation 82% complete" style={{ width: "82%" }} />
                </div>
                <span className="route-bar-pct">ETA 3.8 min</span>
              </div>
            </div>
          </div>

          {/* Row 3 — Hospital Bed Scan */}
          <div className="status-row">
            <div className="status-row-icon amber" aria-hidden="true">
              <HospitalIcon size={18} />
            </div>
            <div className="status-row-body">
              <div className="status-row-label">Hospital Bed Allocation</div>
              <BedGrid />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="status-row-value">
                  {liveData.hospitalName} — <span style={{ color: "var(--color-success)" }}>Lock Reserved</span>
                </span>
                <span className="status-badge scanning">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Dashboard Links for Evaluators */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginTop: 12,
              paddingTop: 10,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                background: "#0f172a",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <span>Hospital ER Console</span>
              <ArrowUpRightIcon size={12} />
            </a>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                background: "#0284c7",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <span>Ambulance Grid</span>
              <ArrowUpRightIcon size={12} />
            </a>
          </div>

          {/* Dismiss */}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <button
              type="button"
              id="sos-dismiss-btn"
              onClick={handleDismiss}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.78rem", color: "var(--color-text-muted)",
                fontFamily: "inherit", fontWeight: 600,
                textDecoration: "underline", padding: 0,
              }}
              aria-label="Dismiss SOS status panel"
            >
              Dismiss panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
