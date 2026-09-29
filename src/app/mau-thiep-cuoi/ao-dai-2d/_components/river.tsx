"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

const RIVER_PATH = "M78 0 C18 85 92 155 40 250 S92 375 42 475 S95 625 37 745 S88 885 45 1000";

export function River() {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const path = root.current.querySelector<SVGPathElement>(".ao-river");
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      return gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current.parentElement,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 0.7,
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <svg ref={root} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-0 h-full w-full overflow-visible">
      <path d={RIVER_PATH} className="ao-river" vectorEffect="non-scaling-stroke" fill="none" stroke="#5B2A86" strokeWidth="2" />
      <path d={RIVER_PATH} vectorEffect="non-scaling-stroke" fill="none" stroke="#C9A0DC" strokeWidth="1" transform="translate(6 0)" opacity=".9" />
    </svg>
  );
}
