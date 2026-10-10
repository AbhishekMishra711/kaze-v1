"use client";

import { useRef } from "react";

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function WaitlistForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission here
    const email = inputRef.current?.value;
    if (email) {
      alert(`Thanks! We'll reach out to ${email} when Kaze launches.`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Waitlist signup form"
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <label htmlFor="cta-email" className="label" style={{ textAlign: "left" }}>
        Your email
      </label>
      <input
        id="cta-email"
        ref={inputRef}
        type="email"
        placeholder="you@example.com"
        required
        style={{
          padding: "14px 20px",
          borderRadius: "var(--radius-pill)",
          border: "1.5px solid var(--color-border)",
          background: "rgba(248,246,241,0.8)",
          fontSize: "0.95rem",
          color: "var(--color-text-primary)",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color var(--transition-fast)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-accent)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border)")
        }
      />
      <button
        type="submit"
        className="btn-primary"
        id="cta-submit-btn"
        style={{ justifyContent: "center" }}
      >
        Join the waitlist <ArrowRightIcon />
      </button>
    </form>
  );
}
