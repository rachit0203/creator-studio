"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate a brief network delay — replace with real API call if needed
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setSubmitting(false);
    setEmail("");
  };

  return (
    <footer
      aria-label="Site footer"
      className="border-t border-white/5 bg-[var(--color-bg)]"
    >
      <div className="container-x py-[var(--footer-padding-y)]">
        <div className="grid gap-16 border-b border-white/5 pb-16 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-[1.125rem] font-medium tracking-[-0.01em]">
              Studio
            </p>
            <p className="mt-5 max-w-[400px] text-[0.875rem] leading-[1.5] text-[var(--color-fg-secondary)]">
              Stay plugged in — subscribe for updates on new work, experiments,
              and releases.
            </p>
            {submitted ? (
              <p
                aria-live="polite"
                className="mt-6 inline-flex items-center gap-2 text-[0.875rem] text-[var(--color-accent)]"
              >
                <span aria-hidden>✓</span> You&apos;re on the list. Thanks!
              </p>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full max-w-xs rounded-[2px] border border-white/10 bg-white/5 px-4 text-[0.875rem] text-white placeholder:text-[var(--color-fg-tertiary)] focus:border-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring h-11 rounded-[2px] bg-[var(--color-accent)] px-5 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[#e63300] disabled:opacity-60"
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            )}
            <p aria-live="polite" className="sr-only" id="newsletter-status" />
          </div>
          <nav className="flex flex-col gap-4" aria-label="Footer navigation">
            {/* Footer nav links can be added here */}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
            © Studio {new Date().getFullYear()} — all rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
