"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroCanvas from "./HeroCanvas";

const headline =
  "A digital studio & branding powerhouse making cool shit that performs.";

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.06,
          delay: 0.2,
        }
      );

      if (subtextRef.current) {
        gsap.fromTo(
          subtextRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.8 }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative grid min-h-screen grid-rows-[1fr_auto] overflow-hidden pb-20 pt-[calc(var(--nav-height)+80px)]"
    >
      <HeroCanvas />
      <div className="container-x relative z-10 max-w-[900px]">
        <h1 className="text-[clamp(2.75rem,7vw,6rem)] font-medium leading-none tracking-[-0.03em]">
          {headline.split(" ").map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="hero-word mr-2 inline-block overflow-hidden"
            >
              <span className="block">{word}</span>
            </span>
          ))}
        </h1>
        <p
          ref={subtextRef}
          className="mt-8 max-w-[560px] text-base leading-[1.65] text-[var(--color-fg-secondary)]"
        >
          We partner with the world's most ambitious startups, scale-ups and
          brands to unlock their true potential and growth through the
          convergence of creativity, design, and technology.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
    </section>
  );
}
