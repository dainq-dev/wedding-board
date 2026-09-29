"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { barScale, type LetterboxRatio } from "./letterbox-ratio";

export type LetterboxHandle = {
  setRatio: (r: LetterboxRatio) => void;
  getBars: () => { top: HTMLDivElement; bottom: HTMLDivElement } | null;
};

// 2 dải letterbox `fixed` trên/dưới, cao 50svh, chỉ animate scaleY (spec §2).
// Tự đổi tỉ lệ theo section: section nào mang `data-lb="21:9" | "16:9" | "open"`.
export const Letterbox = forwardRef<LetterboxHandle>(
  function Letterbox(_props, ref) {
    const top = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const current = useRef<LetterboxRatio>("open");
    const reduced = useReducedMotion();

    const apply = (r: LetterboxRatio) => {
      if (!top.current || !bottom.current) return;
      current.current = r;
      const y = barScale(window.innerWidth, window.innerHeight, r);
      if (reduced) {
        gsap.set([top.current, bottom.current], { scaleY: y });
        return;
      }
      gsap.to([top.current, bottom.current], {
        scaleY: y,
        duration: 0.5,
        ease: "power4.inOut",
      });
    };

    useImperativeHandle(ref, () => ({
      setRatio: apply,
      getBars: () =>
        top.current && bottom.current
          ? { top: top.current, bottom: bottom.current }
          : null,
    }));

    useGSAP(
      () => {
        const nodes = gsap.utils
          .toArray<HTMLElement>("[data-lb]")
          .filter((el) => el.dataset.lb);
        nodes.forEach((el, i) => {
          const r = (el.dataset.lb ?? "open") as LetterboxRatio;
          const prev = (nodes[i - 1]?.dataset.lb ?? "open") as LetterboxRatio;
          ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            onEnter: () => apply(r),
            onEnterBack: () => apply(r),
            onLeaveBack: () => apply(prev),
          });
        });
        const onResize = () => apply(current.current);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      },
      { dependencies: [reduced] },
    );

    return (
      <div aria-hidden className="contents">
        <div
          ref={top}
          className="fixed inset-x-0 top-0 z-20 h-[50svh] origin-top scale-y-0 bg-[#0D0D0D]"
        />
        <div
          ref={bottom}
          className="fixed inset-x-0 bottom-0 z-20 h-[50svh] origin-bottom scale-y-0 bg-[#0D0D0D]"
        />
      </div>
    );
  },
);
