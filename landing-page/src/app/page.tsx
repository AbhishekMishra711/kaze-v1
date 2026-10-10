import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import {
  VideoScroller,
  ScrollProgressBar,
  SOSButton,
} from "@/components/ClientComponents";

/* ─────────────────────────────────────────────────────────────────
   Inline SVG icon components (server-safe, no state)
───────────────────────────────────────────────────────────────── */

function ZapIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function MapIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function DatabaseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function LockIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CpuIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /> <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /> <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /> <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /> <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

function ShieldIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ActivityIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function GitBranchIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" /> <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* Fixed video backdrop */}
      <VideoScroller />

      {/* Scroll progress */}
      <ScrollProgressBar />

      {/* Hero Section Overlay */}
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════════
          SCROLLABLE CONTENT (Narrative only)
      ═══════════════════════════════════════════════════════════ */}
      <div id="main-content" className="scroll-container">

        {/* ╔═══════════════════════════════════════════════════════╗
            ║  SCROLLYTELLING — Prompt 3                           ║
            ╚═══════════════════════════════════════════════════════╝ */}

        {/* Block 1 — Instant Dispatch (LEFT) */}
        <section
          id="dispatch"
          className="narrative-section align-left pointer-events-auto"
          aria-labelledby="dispatch-heading"
        >
          <AnimatedSection animation="slide-right">
            <div className="narrative-glass">
              <p className="narrative-number">01 — Instant Dispatch</p>
              <div className="narrative-icon-wrap"
                style={{ background: "rgba(224,38,26,0.10)" }}>
                <ZapIcon size={26} />
              </div>
              <h2 className="narrative-heading" id="dispatch-heading">
                Frictionless SOS routing<br />to the field.
              </h2>
              <p className="narrative-body">
                A single trigger instantly fans out to all available emergency
                response units. KAZE evaluates proximity, unit status, and
                real-time availability in parallel — routing the dispatch
                decision in <strong>&lt;200 ms</strong>, before a human
                dispatcher could lift a radio.
              </p>

              {/* Mini route visual */}
              <div className="mini-route" aria-label="Route diagram: Incident to Ambulance to Hospital">
                <div className="route-node sos-node" aria-label="Incident location">SOS</div>
                <div className="route-line">
                  <div className="route-line-fill blue" />
                </div>
                <div className="route-node amb-node" aria-label="Ambulance unit">AMB</div>
                <div className="route-line">
                  <div className="route-line-fill green" />
                </div>
                <div className="route-node hosp-node" aria-label="Hospital">HSP</div>
              </div>

              <div className="metric-row">
                <div className="metric-item">
                  <div className="metric-value red">&lt;200ms</div>
                  <div className="metric-label">Dispatch latency</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">24 / 7</div>
                  <div className="metric-label">Availability</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Block 2 — Intelligent Routing (RIGHT) */}
        <section
          id="routing"
          className="narrative-section align-right pointer-events-auto"
          aria-labelledby="routing-heading"
        >
          <AnimatedSection animation="slide-left">
            <div className="narrative-glass">
              <p className="narrative-number">02 — Intelligent Routing</p>
              <div className="narrative-icon-wrap"
                style={{ background: "rgba(10,132,255,0.10)", color: "var(--color-info)" }}>
                <MapIcon size={26} />
              </div>
              <h2 className="narrative-heading" id="routing-heading">
                Live-traffic coordination,<br />zero guesswork.
              </h2>
              <p className="narrative-body">
                The frontend mapping layer ingests real-time traffic feeds,
                road closures, and congestion heat-maps. Ambulance units
                are assigned optimised routes dynamically — updated every
                30 seconds if conditions shift. Dispatchers see a live
                animated overlay of every unit's ETA on the command dashboard.
              </p>

              {/* Spec chips */}
              <div className="spec-list">
                {[
                  { dot: "#0a84ff", label: "Dijkstra + A* hybrid" },
                  { dot: "#34c759", label: "GTFS live feed" },
                  { dot: "#ff9f0a", label: "30 s re-route window" },
                  { dot: "#0a84ff", label: "WebSocket updates" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              {/* Live Routing Map */}
              <div className="bg-gray-50 border border-gray-200 rounded-md overflow-hidden h-64 flex items-center justify-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                  Live Routing Map
                </p>
              </div>

              <div className="metric-row">
                <div className="metric-item">
                  <div className="metric-value blue">30s</div>
                  <div className="metric-label">Route refresh</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">99.4%</div>
                  <div className="metric-label">Routing accuracy</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Block 3 — Resource Matching (LEFT) */}
        <section
          id="resources"
          className="narrative-section align-left pointer-events-auto"
          aria-labelledby="resources-heading"
        >
          <AnimatedSection animation="slide-right">
            <div className="narrative-glass">
              <p className="narrative-number">03 — Resource Matching</p>
              <div className="narrative-icon-wrap"
                style={{ background: "rgba(52,199,89,0.10)", color: "var(--color-success)" }}>
                <DatabaseIcon size={26} />
              </div>
              <h2 className="narrative-heading" id="resources-heading">
                Beds, equipment, staff —<br />matched before arrival.
              </h2>
              <p className="narrative-body">
                KAZE continuously polls a federated network of hospital
                inventory systems. The moment a unit is dispatched, the
                system queries real-time ICU bed count, ventilator stock,
                and specialist availability — soft-reserving the best match
                with an optimistic lock to prevent double-booking.
              </p>

              {/* Bed grid visual */}
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>
                Live bed map — NIMHANS ICU (24 beds)
              </p>
              <div className="bed-grid" role="img" aria-label="Hospital bed availability grid: 2 scanning, 6 available, 13 occupied, 3 reserved">
                {Array.from({ length: 24 }, (_, i) => {
                  const state = i < 2 ? "scanning" : i < 8 ? "available" : i < 21 ? "occupied" : "reserved";
                  return <div key={i} className={`bed-cell ${state}`} />;
                })}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                {[
                  { cls: "scanning",  label: "Scanning (2)" },
                  { cls: "available", label: "Available (6)" },
                  { cls: "occupied",  label: "Occupied (13)" },
                  { cls: "reserved",  label: "Reserved (3)" },
                ].map((b) => (
                  <span key={b.cls} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                    <span className={`bed-cell ${b.cls}`} style={{ width: 12, height: 12, display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                    {b.label}
                  </span>
                ))}
              </div>

              <div className="metric-row">
                <div className="metric-item">
                  <div className="metric-value green">6</div>
                  <div className="metric-label">ICU beds free</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">12</div>
                  <div className="metric-label">Hospitals polled</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

      </div>{/* /scroll-container */}

      {/* ╔═══════════════════════════════════════════════════════╗
          ║  TECHNICAL ARCHITECTURE — Prompt 4                  ║
          ║  Solid white section — breaks out of video scroll   ║
          ╚═══════════════════════════════════════════════════════╝ */}
      <section
        id="architecture"
        className="tech-section pointer-events-auto"
        aria-labelledby="tech-headline"
      >
        {/* Eyebrow */}
        <div className="tech-eyebrow">
          <AnimatedSection animation="fade-up">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span className="tech-eyebrow-tag">System Architecture</span>
              <h2 className="tech-headline" id="tech-headline">
                Built for <span>zero-failure</span><br />at peak load.
              </h2>
              <p className="tech-sub">
                Every millisecond of delay in an emergency costs lives.
                KAZE is engineered for &lt;200 ms end-to-end latency,
                bulletproof concurrency, and hospital-grade reliability.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Grid */}
        <div className="tech-grid">

          {/* Card 1 — High-Speed Matching Algorithm */}
          <AnimatedSection animation="fade-up" delay={0.0}>
            <article className="tech-card featured" aria-labelledby="card-algo-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(224,38,26,0.08)", color: "var(--color-sos)" }}>
                <CpuIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(224,38,26,0.10)", color: "var(--color-sos)", border: "1px solid rgba(224,38,26,0.20)" }}>
                Matching Engine
              </span>
              <h3 className="tech-card-title" id="card-algo-title">
                High-Speed Resource Matching Algorithm
              </h3>
              <p className="tech-card-body">
                KAZE uses a weighted bipartite matching algorithm
                (Kuhn–Munkres / Hungarian Method) to simultaneously score
                every available ambulance and hospital against the incoming
                SOS request. Scoring factors include GPS proximity, unit
                load, road ETA, hospital specialisation, and current ICU
                capacity — evaluated in a single <code style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.85em" }}>O(n³)</code> pass
                across the resource graph. Results are memoised per 500 ms
                window to handle burst SOS events without re-computing
                from scratch.
              </p>

              <div className="spec-list">
                {[
                  { dot: "var(--color-sos)",     label: "Hungarian algorithm" },
                  { dot: "var(--color-info)",    label: "Weighted graph scoring" },
                  { dot: "var(--color-success)", label: "500 ms memo window" },
                  { dot: "var(--color-warning)", label: "Burst-safe queue" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-sos)" }}>&lt;200ms</div>
                  <div className="card-stat-label">End-to-end latency</div>
                </div>
                <div>
                  <div className="card-stat-value">10k+</div>
                  <div className="card-stat-label">Requests / min</div>
                </div>
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-success)" }}>99.97%</div>
                  <div className="card-stat-label">Match accuracy</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 2 — Concurrency Control */}
          <AnimatedSection animation="fade-up" delay={0.1}>
            <article className="tech-card" aria-labelledby="card-concur-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(10,132,255,0.08)", color: "var(--color-info)" }}>
                <LockIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(10,132,255,0.10)", color: "var(--color-info)", border: "1px solid rgba(10,132,255,0.20)" }}>
                Concurrency Control
              </span>
              <h3 className="tech-card-title" id="card-concur-title">
                Zero Double-Booking of Critical Resources
              </h3>
              <p className="tech-card-body">
                When multiple simultaneous SOS events race to claim the same
                hospital bed or ambulance, KAZE uses distributed optimistic
                locking with a versioned reservation token. If two requests
                attempt to commit the same resource, the second receives a
                CAS (compare-and-swap) failure and is immediately re-routed
                to the next best match — no bed is ever double-booked,
                no ambulance double-dispatched.
              </p>

              {/* Live concurrency demo */}
              <div className="concurrency-demo" role="table" aria-label="Concurrency lock state table">
                <div className="concur-row" role="row">
                  <span className="concur-label" role="cell">ICU Bed #7 — NIMHANS</span>
                  <span className="concur-lock locked" role="cell">🔒 Locked</span>
                </div>
                <div className="concur-row" role="row">
                  <span className="concur-label" role="cell">ICU Bed #7 — Request #2</span>
                  <span className="concur-lock pending" role="cell">⏳ Re-routing</span>
                </div>
                <div className="concur-row" role="row">
                  <span className="concur-label" role="cell">ICU Bed #11 — Assigned</span>
                  <span className="concur-lock locked" role="cell">🔒 Locked</span>
                </div>
                <div className="concur-row" role="row">
                  <span className="concur-label" role="cell">AMB-07 — Bowring Hospital</span>
                  <span className="concur-lock released" role="cell">✓ Released</span>
                </div>
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-info)" }}>0</div>
                  <div className="card-stat-label">Double-books</div>
                </div>
                <div>
                  <div className="card-stat-value">&lt;5ms</div>
                  <div className="card-stat-label">Lock acquire</div>
                </div>
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-success)" }}>CAS</div>
                  <div className="card-stat-label">Conflict strategy</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 3 — System Reliability */}
          <AnimatedSection animation="fade-up" delay={0.2}>
            <article className="tech-card" aria-labelledby="card-reliability-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(52,199,89,0.08)", color: "var(--color-success)" }}>
                <ShieldIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(52,199,89,0.10)", color: "#1a8c38", border: "1px solid rgba(52,199,89,0.25)" }}>
                Reliability
              </span>
              <h3 className="tech-card-title" id="card-reliability-title">
                Hospital-Grade Uptime & Fault Tolerance
              </h3>
              <p className="tech-card-body">
                KAZE deploys across three availability zones with
                active-active replication. All dispatch state is
                event-sourced — even a mid-flight node failure replays
                from the event log within 200 ms. Circuit breakers isolate
                degraded hospital API endpoints without affecting the
                rest of the network.
              </p>

              <div className="spec-list">
                {[
                  { dot: "var(--color-success)", label: "Active-active HA" },
                  { dot: "var(--color-info)",    label: "Event sourcing" },
                  { dot: "var(--color-warning)", label: "Circuit breakers" },
                  { dot: "var(--color-sos)",     label: "3-AZ failover" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-success)" }}>99.99%</div>
                  <div className="card-stat-label">Uptime SLA</div>
                </div>
                <div>
                  <div className="card-stat-value">3-AZ</div>
                  <div className="card-stat-label">Replication</div>
                </div>
                <div>
                  <div className="card-stat-value">&lt;200ms</div>
                  <div className="card-stat-label">Failover time</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 4 — Live Telemetry */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <article className="tech-card" aria-labelledby="card-telemetry-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(255,159,10,0.08)", color: "var(--color-warning)" }}>
                <ActivityIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(255,159,10,0.10)", color: "#c47800", border: "1px solid rgba(255,159,10,0.25)" }}>
                Observability
              </span>
              <h3 className="tech-card-title" id="card-telemetry-title">
                Real-Time Telemetry & Command Dashboard
              </h3>
              <p className="tech-card-body">
                Dispatchers see a live dashboard with unit positions, ETA
                countdowns, bed availability, and alert queues — all
                streamed via WebSocket. Every event is traced end-to-end
                with OpenTelemetry spans, giving ops teams
                sub-millisecond visibility into the full dispatch pipeline.
              </p>

              <div className="spec-list">
                {[
                  { dot: "var(--color-warning)", label: "WebSocket stream" },
                  { dot: "var(--color-info)",    label: "OpenTelemetry" },
                  { dot: "var(--color-success)", label: "P95 &lt;40 ms" },
                  { dot: "var(--color-sos)",     label: "Live unit map" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-warning)" }}>&lt;40ms</div>
                  <div className="card-stat-label">Dashboard P95</div>
                </div>
                <div>
                  <div className="card-stat-value">100%</div>
                  <div className="card-stat-label">Trace coverage</div>
                </div>
                <div>
                  <div className="card-stat-value">WS</div>
                  <div className="card-stat-label">Live protocol</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 5 — API Design */}
          <AnimatedSection animation="fade-up" delay={0.35}>
            <article className="tech-card" aria-labelledby="card-api-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(10,132,255,0.08)", color: "var(--color-info)" }}>
                <GitBranchIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(10,132,255,0.10)", color: "var(--color-info)", border: "1px solid rgba(10,132,255,0.20)" }}>
                Integration
              </span>
              <h3 className="tech-card-title" id="card-api-title">
                Federated Hospital API Gateway
              </h3>
              <p className="tech-card-body">
                A schema-validated REST + GraphQL gateway federates dozens
                of heterogeneous hospital inventory systems. Each partner
                hospital exposes a standardised resource manifest —
                KAZE polls them on a 15-second heartbeat, caches results in
                Redis with TTL, and falls back to the last-known-good state
                on timeout.
              </p>

              <div className="spec-list">
                {[
                  { dot: "var(--color-info)",    label: "REST + GraphQL" },
                  { dot: "var(--color-success)", label: "Redis TTL cache" },
                  { dot: "var(--color-warning)", label: "15 s heartbeat" },
                  { dot: "var(--color-sos)",     label: "Graceful degradation" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value">12+</div>
                  <div className="card-stat-label">Hospital APIs</div>
                </div>
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-info)" }}>15s</div>
                  <div className="card-stat-label">Poll interval</div>
                </div>
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-success)" }}>100%</div>
                  <div className="card-stat-label">Schema validated</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 6 — Security */}
          <AnimatedSection animation="fade-up" delay={0.4}>
            <article className="tech-card" aria-labelledby="card-security-title">
              <div className="tech-card-icon"
                style={{ background: "rgba(224,38,26,0.08)", color: "var(--color-sos)" }}>
                <ShieldIcon size={28} />
              </div>
              <span className="tech-card-tag"
                style={{ background: "rgba(224,38,26,0.10)", color: "var(--color-sos)", border: "1px solid rgba(224,38,26,0.20)" }}>
                Security
              </span>
              <h3 className="tech-card-title" id="card-security-title">
                End-to-End Encrypted Dispatch Pipeline
              </h3>
              <p className="tech-card-body">
                All patient data, location payloads, and resource locks
                transit over mTLS-encrypted channels. Role-based access
                control (RBAC) ensures paramedics, dispatchers, and
                hospital staff see only the data scoped to their
                clearance level. All PII is anonymised in logs.
              </p>

              <div className="spec-list">
                {[
                  { dot: "var(--color-sos)",     label: "mTLS everywhere" },
                  { dot: "var(--color-info)",    label: "RBAC + JWT" },
                  { dot: "var(--color-success)", label: "PII anonymisation" },
                  { dot: "var(--color-warning)", label: "Audit log" },
                ].map((c) => (
                  <span key={c.label} className="spec-chip">
                    <span className="spec-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="card-stat-strip">
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-sos)" }}>E2E</div>
                  <div className="card-stat-label">Encryption</div>
                </div>
                <div>
                  <div className="card-stat-value">RBAC</div>
                  <div className="card-stat-label">Access control</div>
                </div>
                <div>
                  <div className="card-stat-value" style={{ color: "var(--color-success)" }}>HIPAA</div>
                  <div className="card-stat-label">Compliant</div>
                </div>
              </div>
            </article>
          </AnimatedSection>

        </div>{/* /tech-grid */}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER - Outside scroll-container
      ═══════════════════════════════════════════════════════════ */}
      <Footer />
    </>
  );
}
