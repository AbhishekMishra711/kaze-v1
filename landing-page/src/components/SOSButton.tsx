"use client";

import { useState, useEffect, useRef } from "react";

/* ── Icons ─────────────────────────────────────────────────────── */
function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6
        19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
        12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27
        a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
  // 16 occupied, 5 available, 3 reserved/scanning
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

/* ── Main Component ──────────────────────────────────────────────── */
export default function SOSButton() {
  const [triggered, setTriggered] = useState(false);
  const elapsed = useElapsedTime(triggered);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {/* Pulse-ring + button */}
      <div className="sos-btn-wrap">
        <div className="sos-ring" aria-hidden="true" />
        <div className="sos-ring" aria-hidden="true" />
        <div className="sos-ring" aria-hidden="true" />

        <button
          id="sos-trigger-btn"
          className="sos-btn"
          onClick={() => setTriggered(true)}
          aria-pressed={triggered}
          aria-label="Initiate SOS — contact emergency responders"
          type="button"
        >
          <CrossIcon />
          {triggered ? "SOS Active" : "Initiate SOS"}
        </button>
      </div>

      {/* Status card — appears after trigger */}
      {triggered && (
        <div className="status-card" role="status" aria-live="polite" aria-label="SOS system status">

          {/* Header */}
          <div className="status-header">
            <div className="status-indicator" aria-hidden="true" />
            <span className="status-title">Emergency Response Active</span>
            <span className="status-time" aria-label={`Elapsed time: ${elapsed}`}>{elapsed}</span>
          </div>

          {/* Row 1 — Ambulance Dispatch */}
          <div className="status-row">
            <div className="status-row-icon green" aria-hidden="true">🚑</div>
            <div className="status-row-body">
              <div className="status-row-label">Ambulance Dispatch</div>
              <div className="status-row-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Unit AMB-07 &amp; AMB-12
                <span className="status-badge dispatched">Dispatched</span>
              </div>
            </div>
          </div>

          {/* Row 2 — Route Calculation */}
          <div className="status-row">
            <div className="status-row-icon blue" aria-hidden="true">🗺</div>
            <div className="status-row-body">
              <div className="status-row-label">Nearest Route — Live Traffic</div>
              <div className="status-row-value" style={{ marginBottom: 6 }}>
                Koramangala → NIMHANS
                <span className="status-badge routing" style={{ marginLeft: 8 }}>Routing</span>
              </div>
              <div className="route-bar-wrap">
                <div className="route-bar-bg">
                  <div className="route-bar-fill" aria-label="Route calculation 78% complete" />
                </div>
                <span className="route-bar-pct">ETA 4 min</span>
              </div>
            </div>
          </div>

          {/* Row 3 — Hospital Bed Scan */}
          <div className="status-row">
            <div className="status-row-icon amber" aria-hidden="true">🏥</div>
            <div className="status-row-body">
              <div className="status-row-label">Nearest Hospital Bed Availability</div>
              <BedGrid />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="status-row-value">
                  NIMHANS — <span style={{ color: "var(--color-success)" }}>6 ICU beds free</span>
                </span>
                <span className="status-badge scanning">Scanning</span>
              </div>
            </div>
          </div>

          {/* Dismiss */}
          <div style={{ marginTop: 14, textAlign: "right" }}>
            <button
              type="button"
              id="sos-dismiss-btn"
              onClick={() => setTriggered(false)}
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
