"use client";

import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

type Props = {
  names: string;
  playing: boolean;
  action?: React.ReactNode;
  numRef?: RefObject<HTMLSpanElement | null>;
  needleRef?: RefObject<HTMLDivElement | null>;
};

// C1 · Leader đếm ngược: vòng tròn đồng tâm + kim quét conic-gradient (GSAP var
// --a, không canvas), số 3-2 lặp tới khi bấm; bấm rồi timeline parent đánh số 3-2-1.
export function Leader({
  names,
  playing,
  action,
  numRef: numIn,
  needleRef: needleIn,
}: Props) {
  const ownNum = useRef<HTMLSpanElement>(null);
  const ownNeedle = useRef<HTMLDivElement>(null);
  const num = numIn ?? ownNum;
  const needle = needleIn ?? ownNeedle;
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const n = num.current;
      const nd = needle.current;
      if (!n || !nd) return;
      if (reduced || playing) {
        gsap.set(nd, { "--a": "0deg" });
        return;
      }
      let flip = 3;
      const tl = gsap.timeline({ repeat: -1 });
      tl.call(() => {
        n.textContent = String(flip);
        flip = flip === 3 ? 2 : 3;
      });
      tl.fromTo(
        nd,
        { "--a": "0deg" },
        { "--a": "360deg", duration: 1, ease: "none" },
      );
    },
    { dependencies: [playing, reduced] },
  );

  return (
    <div className="flex flex-col items-center gap-5 px-4 text-center lg:gap-6">
      <div className="relative size-[min(70vw,300px)] lg:size-[320px]">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-white/30"
        />
        <span
          aria-hidden
          className="absolute inset-[12%] rounded-full border border-white/15"
        />
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div
          aria-hidden
          ref={needle}
          className="absolute inset-[5%] rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.18)_var(--a),transparent_0)]"
        />
        <span
          ref={num}
          className="absolute inset-0 flex items-center justify-center font-(family-name:--font-display) italic text-[96px] leading-none text-[#F5F5F0] lg:text-[120px]"
        >
          3
        </span>
      </div>
      <div className="max-w-[min(90vw,560px)]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#F5F5F0] break-words lg:text-xs">
          {names}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#A3A39C] lg:text-xs">
          Present
        </p>
      </div>
      {action}
    </div>
  );
}
