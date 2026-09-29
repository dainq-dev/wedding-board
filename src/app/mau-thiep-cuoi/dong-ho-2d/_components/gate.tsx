"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Motif } from "./print";
import { t } from "./tokens";

// C1 · Tờ tranh "Tin vui" với băng hoạ tiết chạy ngang; gõ trống để mở thiệp và phát nhạc.
export function Gate({
  couple,
  onOpen,
}: {
  couple: string;
  onOpen: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-gate-sheet]", {
        yPercent: 12,
        autoAlpha: 0,
        duration: 0.6,
        ease: "steps(6)",
      });
      gsap.to("[data-strip]", {
        xPercent: -50,
        duration: 14,
        ease: "steps(140)",
        repeat: -1,
      });
      gsap.to("[data-drum]", {
        scaleY: 0.94,
        duration: 0.6,
        ease: "steps(2)",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });
    },
    { scope, dependencies: [reduced] },
  );

  const beat = () => {
    if (reduced) return;
    gsap.killTweensOf("[data-drum]");
    gsap.fromTo(
      scope.current?.querySelector("[data-drum]") ?? [],
      { scale: 1 },
      { scale: 1.15, duration: 0.3, ease: "steps(3)", yoyo: true, repeat: 1 },
    );
    gsap.fromTo(
      scope.current?.querySelectorAll("[data-tung]") ?? [],
      { scale: 0, autoAlpha: 1 },
      { scale: 1, autoAlpha: 0, duration: 0.6, ease: "steps(4)" },
    );
  };

  return (
    <OpenGate onOpen={onOpen} className="bg-[#EFE1C6]">
      <div
        ref={scope}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-8 px-5 ${t.paper}`}
      >
        <div
          data-gate-sheet
          className={`${t.sheet} w-[min(92vw,460px)] overflow-hidden p-3`}
        >
          <div className="pointer-events-none absolute inset-3 ring-[6px] ring-[#B5382A]" />
          <div className="relative px-5 pt-6 pb-10 text-center">
            <p className={t.band}>Tin vui</p>
            <div className="mt-8 overflow-hidden">
              <div data-strip className="flex w-max gap-6">
                {[0, 1].map((k) => (
                  <Motif key={k} className="w-[28rem] justify-between" />
                ))}
              </div>
            </div>
            <p
              className={`${t.display} mt-8 text-[34px] leading-[1.15] font-bold text-balance break-words ${t.red} sm:text-[42px]`}
            >
              {couple}
            </p>
            <p className={`mt-3 ${t.soft}`}>sắp nên duyên vợ chồng</p>
          </div>
        </div>
        <div className="relative flex flex-col items-center gap-3">
          <button
            data-drum
            type="button"
            onClick={beat}
            aria-label="Gõ trống mở thiệp mời"
            className="relative flex size-24 items-center justify-center rounded-full bg-[#B5382A] shadow-[4px_5px_0_#2B1D12] ring-[3px] ring-[#2B1D12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F5D50]"
          >
            <span className="size-16 rounded-full ring-[3px] ring-[#D9A628]" />
            <span className="absolute size-8 rounded-full bg-[#D9A628] ring-[3px] ring-[#2B1D12]" />
            {[-60, -20, 20, 60].map((deg) => (
              <span
                key={deg}
                data-tung
                aria-hidden="true"
                className={`${t.display} absolute -top-8 text-[18px] font-extrabold opacity-0 ${t.red}`}
                style={{ transform: `rotate(${deg}deg) translateY(-24px)` }}
              >
                Tùng
              </span>
            ))}
          </button>
          <p className={`text-[15px] font-semibold ${t.soft}`}>
            Gõ trống để mở thiệp
          </p>
        </div>
      </div>
    </OpenGate>
  );
}
