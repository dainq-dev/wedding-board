"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Sun, WaveBand } from "../decor";
import { t } from "../tokens";

// C1 · Màn hoàng hôn: mặt trời lơ lửng, hai lớp sóng trôi; bấm để mở thiệp.
export function Gate({
  onOpen,
  groom,
  bride,
}: {
  onOpen: () => void;
  groom: string;
  bride: string;
}) {
  const waves = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".tr-wave-back", { xPercent: -50, duration: 9, ease: "none" }, 0);
      tl.to(".tr-wave-front", { xPercent: -50, duration: 6, ease: "none" }, 0);
      return () => {
        tl.kill();
      };
    },
    { scope: waves, dependencies: [reduced] },
  );

  return (
    <OpenGate
      onOpen={onOpen}
      className="bg-[linear-gradient(180deg,#FF9E5E_0%,#FFD9A0_46%,#BDF1E6_100%)]"
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <Sun className="absolute top-14 size-40 opacity-90" />
        <div
          ref={waves}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 overflow-hidden"
        >
          <WaveBand className="tr-wave-back absolute bottom-6 left-0 h-24 w-[200%]" />
          <WaveBand className="tr-wave-front absolute -bottom-2 left-0 h-28 w-[200%]" />
        </div>
        <p className={`${t.label} text-[#1E3A4C]`}>Beach wedding của</p>
        <p
          className={`${t.script} mt-2 text-[38px] text-[#1E3A4C] break-words lg:text-[54px]`}
        >
          {groom} &amp; {bride}
        </p>
        <button type="button" className={`${t.btnTeal} mt-8`}>
          Mở thiệp
        </button>
        <p className="mt-3 text-[13px] font-medium text-[#1E3A4C]/70">
          Chạm để mở thiệp và bật nhạc
        </p>
      </div>
    </OpenGate>
  );
}
