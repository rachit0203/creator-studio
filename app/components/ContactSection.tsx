"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@studio.com";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Contact Section"
      className="section-y container-x flex flex-col gap-6 border-t border-white/5"
    >
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
        Contact
      </p>
      <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.015em]">
        Let&apos;s make an impact together.
      </h3>
      <a
        className="group w-fit text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em]"
        href={`mailto:${contactEmail}`}
      >
        {contactEmail}
        <span className="block h-0.5 origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
      </a>
    </section>
  );
}
