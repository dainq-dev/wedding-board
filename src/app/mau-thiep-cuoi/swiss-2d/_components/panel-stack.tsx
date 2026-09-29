"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";

export function PanelStack({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState(2);
  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>("[data-swiss-panel]");
    return () => panels.forEach((panel, index) => {
      if (index === panels.length - 1) return;
      const next = panels[index + 1];
      gsap.to(panel, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
      });
    });
  });
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-swiss-panel]"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.swissPanel));
    }), { threshold: 0.55 });
    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);
  return <><aside aria-label="Tiến trình thiệp" className="pointer-events-none fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-black px-3 py-2 font-(family-name:--font-swiss-mono) text-[11px] font-bold tracking-[0.16em] text-white lg:top-1/2 lg:bottom-auto lg:flex-col lg:bg-transparent lg:text-black"><span>{String(current).padStart(2, "0")}/10</span><span className="h-px w-12 bg-[#ff3b30] lg:h-16 lg:w-1" /></aside>{children}</>;
}
