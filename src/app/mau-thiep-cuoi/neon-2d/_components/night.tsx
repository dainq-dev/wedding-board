"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

const DROPS = 32;

/** Lớp nền cố định: trời đêm, dãy nhà silhouette, mưa chéo. Nằm ngoài vùng cuộn. */
export function Night({ lit }: { lit: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const h = window.innerHeight;
      for (const d of gsap.utils.toArray<HTMLElement>("[data-drop]")) {
        const dur = gsap.utils.random(0.7, 1.3);
        gsap.fromTo(
          d,
          { y: -80, x: 0 },
          {
            y: h + 80,
            x: -((h + 160) * Math.tan((10 * Math.PI) / 180)),
            duration: dur,
            ease: "none",
            repeat: -1,
            delay: -gsap.utils.random(0, dur),
          },
        );
      }
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0A0612_0%,#140A26_55%,#1C0F2E_100%)]" />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(255,60,172,0.28),transparent_60%),radial-gradient(ellipse_at_85%_20%,rgba(43,210,255,0.12),transparent_45%)] transition-opacity duration-1000 ${lit ? "opacity-100" : "opacity-30"}`}
      />
      {/* dãy nhà silhouette hai bên hẻm */}
      <div className="absolute inset-x-0 bottom-0 h-[38svh] bg-[linear-gradient(90deg,#07040D_0_9%,transparent_9%_14%,#07040D_14%_22%,transparent_22%_78%,#07040D_78%_86%,transparent_86%_90%,#07040D_90%)] opacity-80 [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
      {Array.from({ length: DROPS }, (_, i) => i).map((i) => (
        <span
          key={i}
          data-drop
          className={`absolute top-0 h-[60px] w-px rotate-[10deg] bg-[linear-gradient(to_bottom,transparent,rgba(184,176,214,0.45))] ${i % 4 === 3 ? "max-sm:hidden" : ""}`}
          style={{ left: `${(i * 97) % 110}%` }}
        />
      ))}
    </div>
  );
}
