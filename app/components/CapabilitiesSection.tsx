"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const capabilities = [
  {
    title: "Websites & Features",
    href: "/showcase?category=Websites%20%26%20Features",
    description:
      "From pre-launch landing pages to complete website redesigns, we create next-generation digital experiences that capture attention and inspire action.",
    services: ["Product Strategy", "UX/UI Design", "Engineering", "3D & Motion Design"],
  },
  {
    title: "Visual Branding",
    href: "/showcase?category=Visual%20Branding",
    description:
      "From lean identities for early startups to comprehensive brand platforms for industry leaders, we craft scalable brand systems that are impossible to ignore.",
    services: ["Visual Identity", "Branding Systems"],
  },
  {
    title: "IRL Experience Design",
    href: "/showcase?category=IRL%20Experience%20Design",
    description:
      "From annual summits to local meetups, we design unforgettable in-real-life events, creating moments that engage audiences and build brand love.",
    services: ["Visual Identity", "Space Design", "Keynote Design", "Digital & Interactive"],
  },
  {
    title: "Marketing Execution",
    href: "/showcase?category=Marketing%20Execution",
    description:
      "From brand to product marketing, we collaborate with marketing teams to create assets that drive awareness, demand, and conversions.",
    services: ["Omni-channel Campaign Content", "Growth Experiments", "Sales Materials"],
  },
];

export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-capability-item]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-y container-x">
      <div className="mb-16">
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[var(--color-fg-secondary)]">
          Capabilities
        </p>
        <h3 className="mt-4 text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.015em]">
          We're here to create the extraordinary.
        </h3>
        <p className="mt-3 max-w-[480px] text-base font-light leading-[1.65] text-[var(--color-fg-secondary)]">
          No shortcuts, just bold, precision-engineered work that elevates the
          game & leaves a mark.
        </p>
      </div>
      <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
        {capabilities.map((capability) => (
          <div
            key={capability.title}
            data-capability-item
            className="flex flex-col gap-5 border-t border-white/10 pt-8 transition-colors duration-300 hover:border-white/20"
          >
            <Link
              href={capability.href}
              className="text-[1.125rem] font-medium tracking-[-0.01em] transition-colors duration-200 hover:text-[var(--color-accent)]"
            >
              {capability.title}
            </Link>
            <p className="text-base font-light leading-[1.65] text-[var(--color-fg-secondary)]">
              {capability.description}
            </p>
            <div className="flex flex-col gap-2">
              {capability.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 text-[0.875rem] text-[var(--color-fg-tertiary)]"
                >
                  <span className="h-1 w-1 rounded-full bg-[var(--color-fg-tertiary)]" />
                  {service}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
