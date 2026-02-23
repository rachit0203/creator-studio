import CapabilitiesSection from "./components/CapabilitiesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import Navigation from "./components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <a
        className="focus-ring fixed left-4 top-4 z-[9999] -translate-y-20 bg-[var(--color-accent)] px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-transform duration-200 focus:translate-y-0"
        href="#main"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main">
        <HeroSection />
        <MarqueeSection />
        <CapabilitiesSection />
        <section className="section-y container-x border-t border-white/5">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
                Cloudinary
              </p>
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium tracking-[-0.02em]">
                Asset pipeline built for uploads and delivery.
              </h2>
              <p className="mt-3 max-w-[520px] text-base leading-[1.65] text-[var(--color-fg-secondary)]">
                Use the protected dashboard to upload images, get optimized CDN
                URLs, and preview transformations (resize, crop, format, and
                quality) without leaving the studio workflow.
              </p>
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
              <h3 className="text-[1.125rem] font-medium tracking-[-0.01em]">
                Open the upload console
              </h3>
              <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
                You'll be asked to sign in before accessing the Cloudinary
                tools.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="focus-ring inline-flex items-center justify-center rounded-[2px] bg-[var(--color-accent)] px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[#e63300]"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/sign-in"
                  className="focus-ring inline-flex items-center justify-center rounded-[2px] border border-white/15 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
