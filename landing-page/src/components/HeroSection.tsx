export default function HeroSection() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between w-full h-full overflow-hidden text-black pointer-events-none">

      {/* ── Navigation Header ── */}
      <header className="flex items-center justify-center w-full px-12 py-[43px] absolute top-0 left-0 right-0 z-20 pointer-events-auto backdrop-blur-md bg-white/30 border-b border-white/20">
        {/* Logo */}
        <div className="text-4xl font-black tracking-tighter lowercase absolute left-12 pl-24">kaze.</div>

        {/* Nav Links */}
        <nav className="flex gap-6 items-center" aria-label="Main navigation">
          {/* Hospital ER Portal */}
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-hospital-link"
            className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 pointer-events-auto transition-opacity"
          >
            Hospital
          </a>

          {/* Ambulance Grid Portal */}
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-ambulance-link"
            className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 pointer-events-auto transition-opacity"
          >
            Ambulance
          </a>

          {/* Scroll anchors */}
          <a
            href="#architecture"
            id="nav-technology-link"
            className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 pointer-events-auto"
          >
            Technology
          </a>
          <a
            href="#dispatch"
            id="nav-about-link"
            className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 pointer-events-auto"
          >
            About
          </a>
        </nav>
      </header>

      {/* ── Main Tagline — Absolute Middle Left ── */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 flex items-center max-w-lg z-20 pointer-events-auto">
        {/* Vertical accent line */}
        <div className="h-72 w-0 border-l-8 border-black mr-8" aria-hidden="true" />

        {/* Tagline */}
        <div className="text-7xl lg:text-8xl font-extrabold lowercase leading-[0.85] tracking-tight text-black">
          every<br />
          second<br />
          counts.
        </div>
      </div>

      {/* ── Bottom-left subtext & Quick Launch ── */}
      <div className="absolute bottom-16 left-12 max-w-sm z-20 pointer-events-auto flex flex-col gap-3">
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          Real-time emergency resource allocation. Frictionless SOS routing directly to response teams — dispatched in under 200 ms.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="#dispatch"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-all"
            id="hero-sos-trigger-link"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Simulate SOS Call</span>
          </a>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/80 hover:bg-white text-gray-900 border border-gray-300 text-xs font-semibold rounded-full shadow-sm backdrop-blur transition-all"
          >
            <span>ER Console</span>
          </a>
        </div>
      </div>

      {/* ── Social links — Middle Right ── */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 pointer-events-auto" aria-label="Social links">
        {/* Twitter / X */}
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Twitter"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Instagram"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="LinkedIn"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="#"
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="GitHub"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
