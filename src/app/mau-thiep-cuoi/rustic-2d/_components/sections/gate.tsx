"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { BulbString } from "../art";
import { t } from "../tokens";

// C1 · Kho thóc tối, dây đèn chưa sáng; bấm công tắc để bật đèn, mở thiệp và phát nhạc.
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
      gsap.set("[data-glow]", { opacity: 0, scale: 0.3 });
      gsap.set("[data-glass]", {
        backgroundColor: "#4A3A2A",
        boxShadow: "none",
      });
      if (reduced) return;
      gsap
        .timeline()
        .from("[data-wire]", {
          drawSVG: "0%",
          duration: 1.2,
          ease: "sine.inOut",
        })
        .from(
          "[data-bulb]",
          {
            y: -16,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "sine.out",
          },
          "-=0.8",
        )
        .from(
          "[data-gate-in]",
          {
            autoAlpha: 0,
            y: 16,
            stagger: 0.2,
            duration: 0.8,
            ease: "sine.out",
          },
          "-=0.2",
        );
      // Vài bóng chập chờn ngẫu nhiên, gợi ý "sắp sáng".
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.2, delay: 2 })
        .to("[data-glass]", {
          opacity: 0.5,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          stagger: { each: 0.9, from: "random" },
        });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <OpenGate onOpen={onOpen} className="bg-[#1E1510]">
      <div
        ref={scope}
        className="absolute inset-0 flex flex-col items-center bg-[#1E1510] px-6 text-center"
      >
        <BulbString className="mt-10 max-w-3xl" />
        <p
          data-gate-in
          className={`${t.script} mt-[8svh] max-w-[14ch] text-[48px] text-[#F4EAD9]/65 text-balance sm:text-[72px]`}
        >
          {couple}
        </p>
        <p data-gate-in className="mt-4 text-[15px] text-[#F4EAD9]/70 italic">
          Bật đèn để mở thiệp
        </p>
        <button
          data-gate-in
          type="button"
          // Bật đèn ngay trong cú bấm (OpenGate mờ đi 0.8s sau đó, đủ để thấy đèn sáng từ giữa ra).
          onClick={() => {
            gsap.killTweensOf("[data-glass]");
            gsap.to(scope.current?.querySelectorAll("[data-glass]") ?? [], {
              backgroundColor: "#FFD68A",
              boxShadow: "0 0 18px 4px rgba(255,214,138,0.55)",
              opacity: 1,
              duration: 0.2,
              stagger: { each: reduced ? 0 : 0.08, from: "center" },
            });
            gsap.to(scope.current?.querySelectorAll("[data-glow]") ?? [], {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: { each: reduced ? 0 : 0.08, from: "center" },
            });
          }}
          aria-label="Bật đèn và mở thiệp mời"
          className="group mt-10 flex h-36 w-24 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#E9DFCC,#CFC2A8)] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_#fff] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#FFD68A]"
        >
          <span className="flex h-20 w-10 items-start justify-center rounded-md bg-[#B7A98E] p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
            <span className="h-8 w-7 rounded-sm bg-[linear-gradient(180deg,#FFFFFF,#E2D7C2)] shadow-[0_3px_4px_rgba(0,0,0,0.3)] transition-transform duration-150 group-active:translate-y-9" />
          </span>
        </button>
      </div>
    </OpenGate>
  );
}
