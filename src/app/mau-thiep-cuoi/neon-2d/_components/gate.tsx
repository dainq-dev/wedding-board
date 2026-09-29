"use client";

import { PowerIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { t } from "./tokens";

// C1 · Biển "Đang mở cửa" chưa sáng giữa đêm mưa; bấm "Bật đèn" để biển chập chờn rồi sáng hẳn.
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
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 16,
        stagger: 0.25,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
      // Chữ "Mở" thỉnh thoảng loé mờ, gợi ý biển sắp sáng.
      gsap.to("[data-hint-flicker]", {
        keyframes: { opacity: [0, 0.35, 0, 0.25, 0] },
        duration: 0.5,
        ease: "steps(1)",
        repeat: -1,
        repeatDelay: 2.4,
      });
    },
    { scope, dependencies: [reduced] },
  );

  const light = () => {
    gsap.killTweensOf("[data-hint-flicker]");
    const lit = scope.current?.querySelectorAll("[data-lit]") ?? [];
    if (reduced) {
      gsap.to(lit, { opacity: 1, duration: 0.3 });
      return;
    }
    gsap.to(lit, {
      keyframes: { opacity: [0, 1, 0.2, 1, 0, 1] },
      duration: 0.7,
      ease: "steps(1)",
    });
  };

  return (
    <OpenGate onOpen={onOpen} className="bg-[transparent]">
      <div
        ref={scope}
        className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-[#0A0612]/70 px-6 text-center"
      >
        <div
          data-gate-in
          className="relative rounded-2xl px-8 py-7 ring-2 ring-[#3A2A4A]"
        >
          <div
            data-lit
            className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 ${t.tubeCyan}`}
          />
          <p
            className={`${t.display} relative text-[28px] leading-[1.2] font-medium tracking-[0.08em] text-[#3A2A4A] uppercase sm:text-[40px]`}
          >
            Đang{" "}
            <span className="relative">
              mở
              <span
                data-hint-flicker
                aria-hidden="true"
                className={`absolute inset-0 opacity-0 ${t.pink}`}
              >
                mở
              </span>
            </span>{" "}
            cửa
            <span
              data-lit
              aria-hidden="true"
              className={`absolute inset-0 opacity-0 ${t.pink}`}
            >
              Đang mở cửa
            </span>
          </p>
          <div className="relative mx-auto my-4 h-0.5 w-full bg-[#3A2A4A]">
            <span
              data-lit
              className="absolute inset-0 bg-[#2BD2FF] opacity-0 shadow-[0_0_10px_#2BD2FF]"
            />
          </div>
          <p
            className={`${t.display} relative max-w-[18ch] text-[16px] leading-[1.3] text-[#3A2A4A] text-balance sm:text-[19px]`}
          >
            {couple}
            <span
              data-lit
              aria-hidden="true"
              className={`absolute inset-0 opacity-0 ${t.cyan}`}
            >
              {couple}
            </span>
          </p>
        </div>
        <button
          data-gate-in
          type="button"
          onClick={light}
          className={`inline-flex min-h-13 items-center gap-2.5 rounded-full px-7 ${t.display} text-[14px] tracking-[0.12em] text-[#E2FAFF] uppercase ring-2 ring-[#2BD2FF] shadow-[0_0_18px_rgba(43,210,255,0.5)] transition-transform active:scale-95`}
        >
          <PowerIcon weight="bold" className="size-5" />
          Bật đèn
        </button>
        <p data-gate-in className={`text-[14px] ${t.soft}`}>
          Chạm để bật biển và mở thiệp mời
        </p>
      </div>
    </OpenGate>
  );
}
