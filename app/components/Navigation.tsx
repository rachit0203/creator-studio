"use client";

import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[1000] h-[var(--nav-height)] transition-[background,backdrop-filter] duration-300 ${scrolled
          ? "border-b border-white/5 bg-[rgba(10,10,10,0.85)] backdrop-blur-[12px]"
          : "bg-transparent"
        }`}
    >
      <div className="container-x flex h-full items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity duration-200 hover:opacity-70"
        >
          basement.studio
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-[0.875rem] text-[var(--color-fg-secondary)] md:flex"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative transition-colors duration-200 hover:text-white ${isActive ? "text-white" : ""
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-accent)]" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <SignedIn>
            <SignOutButton>
              <button
                type="button"
                className="focus-ring rounded-[2px] border border-white/15 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
              >
                Logout
              </button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="focus-ring rounded-[2px] border border-white/15 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
            >
              Sign In
            </Link>
          </SignedOut>
          <Link
            href="/contact"
            className="focus-ring rounded-[2px] border border-white/15 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]"
          >
            Contact Us
          </Link>
        </div>
        <button
          type="button"
          className="focus-ring text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-secondary)] md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[1001] bg-[rgba(0,0,0,0.6)]"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-y-0 right-0 w-full max-w-sm bg-[var(--color-bg)] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="focus-ring absolute right-6 top-6 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-secondary)]"
              onClick={() => setOpen(false)}
            >
              Close [ESC]
            </button>
            <div className="mt-16 flex flex-col gap-6 text-[clamp(1.5rem,3vw,2.25rem)] font-medium">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`transition-colors duration-200 hover:text-[var(--color-accent)] ${isActive ? "text-[var(--color-accent)]" : ""
                      }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <SignedIn>
                <SignOutButton>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-left transition-colors duration-200 hover:text-[var(--color-accent)]"
                  >
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  Sign In
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
