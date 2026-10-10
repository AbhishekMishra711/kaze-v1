export default function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-4 md:px-8 lg:px-16 relative z-50 pointer-events-auto">
      <div className="max-w-[1200px] mx-auto">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 items-start text-center">
          
          {/* Column 1 - ABOUT */}
          <div className="min-w-0 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
              About
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed break-words">
              <span className="text-red-500 font-semibold">KAZE</span> is a real-time emergency resource allocator coordinating hospital bed availability and ambulance routing.
            </p>
          </div>

          {/* Column 2 - FEATURES */}
          <div className="min-w-0 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#dispatch" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  Instant Dispatch
                </a>
              </li>
              <li>
                <a href="#routing" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  Intelligent Routing
                </a>
              </li>
              <li>
                <a href="#resources" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  Resource Matching
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - INFORMATION */}
          <div className="min-w-0 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  🏥 Hospital ER Portal
                </a>
              </li>
              <li>
                <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  🚑 Ambulance Live Console
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">
                  Privacy Policy & Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - CONNECT WITH US */}
          <div className="min-w-0 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex gap-3">
              {/* Twitter */}
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 flex-shrink-0 text-gray-400"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 flex-shrink-0 text-gray-400"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* RSS */}
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 flex-shrink-0 text-gray-400"
                aria-label="RSS Feed"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3a18 18 0 0 1 18 18h-3a15 15 0 0 0-15-15V3zm0 6a12 12 0 0 1 12 12h-3a9 9 0 0 0-9-9V9zm0 6a6 6 0 0 1 6 6H9a3 3 0 0 0-3-3v-3z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 flex-shrink-0 text-gray-400"
                aria-label="Email"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="pt-8 pb-4 border-t border-white/10">
          <p className="text-sm text-gray-500 text-center">
            Copyright © 2026 KAZE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
