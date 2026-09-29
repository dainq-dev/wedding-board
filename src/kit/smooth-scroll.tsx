"use client";

import type { ReactNode } from "react";
import { ScrollSmoother, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

// ScrollSmoother bắt buộc nội dung nằm trong #smooth-wrapper > #smooth-content.
// reduced-motion: trả children nguyên vẹn (cuộn native, không wrapper).
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // StrictMode remount 2 lần → dùng lại instance nếu đã có.
      ScrollSmoother.get() ??
        ScrollSmoother.create({ smooth: 1.2, effects: true });
    },
    { dependencies: [reduced] },
  );

  if (reduced) return children;
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
