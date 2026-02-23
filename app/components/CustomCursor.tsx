"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let ringScale = 1;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onEnter = () => {
      ringScale = 2;
    };

    const onLeave = () => {
      ringScale = 1;
    };

    const hoverTargets = Array.from(
      document.querySelectorAll("a, button, [data-cursor='hover']")
    );

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let rafId = 0;
    const tick = () => {
      dotX = lerp(dotX, mouseX, 0.2);
      dotY = lerp(dotY, mouseY, 0.2);
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999]">
      <div
        ref={dotRef}
        className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-fg)] opacity-90"
      />
      <div
        ref={ringRef}
        className="h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 opacity-60 mix-blend-difference"
      />
    </div>
  );
}
