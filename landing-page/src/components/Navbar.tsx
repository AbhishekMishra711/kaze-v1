"use client";

import { useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "#dispatch",     label: "Dispatch" },
  { href: "#routing",      label: "Routing" },
  { href: "#resources",    label: "Resources" },
  { href: "#architecture", label: "Architecture" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav ref={navRef} className="navbar" aria-label="Main navigation">
      {/* Logo */}
      <a href="#" className="navbar-logo" aria-label="KAZE home">
        <div className="navbar-logo-mark" aria-hidden="true">K</div>
        KAZE
      </a>

      {/* Links */}
      <ul className="navbar-links" role="list">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#sos-hero"
        id="nav-sos-btn"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 20px",
          background: "var(--color-sos)",
          color: "#fff",
          fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em",
          textDecoration: "none", textTransform: "uppercase",
          borderRadius: "var(--radius-pill)",
          boxShadow: "0 2px 12px var(--color-sos-glow)",
          transition: "transform 150ms, box-shadow 150ms, background 150ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px var(--color-sos-glow)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px var(--color-sos-glow)";
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.7)", flexShrink: 0 }} aria-hidden="true" />
        Live System
      </a>
    </nav>
  );
}
