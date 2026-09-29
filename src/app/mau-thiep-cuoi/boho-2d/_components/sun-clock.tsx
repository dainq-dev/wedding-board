"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Sun } from "./boho-art";
import { sunPosition } from "./sun-path";

export function SunClock({ root }: { readonly root: React.RefObject<HTMLElement | null> }) {
  const sun = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current || !sun.current) return;
      return ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const point = sunPosition(self.progress);
          gsap.set(sun.current, { x: `${point.x}vw`, y: `${point.y}svh` });
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div
      ref={sun}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2 text-[#C0673E] motion-reduce:translate-x-[8vw] motion-reduce:translate-y-[70svh]"
    >
      <Sun className="size-20 drop-shadow-[0_10px_14px_rgba(156,79,44,0.18)] sm:size-32" />
    </div>
  );
}
