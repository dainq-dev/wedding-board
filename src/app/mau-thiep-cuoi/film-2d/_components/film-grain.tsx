"use client";

import { type RefObject, useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

// SVG noise (feTurbulence) dạng data-URI — không canvas, không file CSS (spec §2).
const GRAIN_BG =
  "bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22200%22%20height=%22200%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%222%22/%3E%3C/filter%3E%3Crect%20width=%22200%22%20height=%22200%22%20filter=%22url(%23n)%22%20opacity=%220.7%22/%3E%3C/svg%3E')]";

// Lớp film grain phủ toàn trang + 2 vệt xước dọc nhảy vị trí mỗi 1.2s.
// opacityRef cho timeline C1 pulse opacity khi "bấm máy" (0.08 → 0.3 → 0.08).
export function FilmGrain({
  opacityRef,
}: {
  opacityRef?: RefObject<HTMLDivElement | null>;
}) {
  const grain = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLSpanElement>(null);
  const s2 = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const root = opacityRef ?? grain;

  useGSAP(
    () => {
      if (reduced) return;
      // ease steps(1) + repeatRefresh → vệt "nhảy" sang vị trí ngẫu nhiên mỗi vòng.
      const scratch = (el: HTMLSpanElement | null, span: number) => {
        if (!el) return;
        gsap.to(el, {
          x: () => (Math.random() - 0.5) * window.innerWidth * span,
          opacity: () => 0.25 + Math.random() * 0.75,
          duration: 1.2,
          ease: "steps(1)",
          repeat: -1,
          repeatRefresh: true,
        });
      };
      scratch(s1.current, 0.9);
      scratch(s2.current, 0.6);
    },
    { dependencies: [reduced] },
  );

  return (
    <div aria-hidden>
      <div
        ref={root}
        className={`fixed inset-0 z-30 pointer-events-none opacity-[0.08] mix-blend-overlay ${GRAIN_BG}`}
      />
      {!reduced && (
        <>
          <span
            ref={s1}
            className="pointer-events-none fixed inset-y-[10%] left-1/2 z-30 w-px bg-white/10"
          />
          <span
            ref={s2}
            className="pointer-events-none fixed inset-y-[30%] left-1/2 z-30 w-px bg-white/10"
          />
        </>
      )}
    </div>
  );
}
