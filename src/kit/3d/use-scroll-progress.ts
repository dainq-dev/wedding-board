"use client";

import { type RefObject, useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/kit/gsap";

// Progress 0..1 của `trigger` theo cuộn. Trả REF (không phải state) để useFrame đọc mà không re-render.
export function useScrollProgress(trigger: RefObject<HTMLElement | null>) {
  const progress = useRef(0);
  useGSAP(() => {
    if (!trigger.current) return;
    ScrollTrigger.create({
      trigger: trigger.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        progress.current = s.progress;
      },
    });
  });
  return progress;
}
