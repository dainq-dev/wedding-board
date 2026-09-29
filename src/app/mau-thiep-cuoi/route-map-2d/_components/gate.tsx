"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { t } from "./tokens";

// C1 · Cuộn bản đồ buộc dây đỏ; bấm "Mở bản đồ" để tháo dây, trải cuộn, phát nhạc.
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
      gsap.from("[data-scroll]", {
        scaleX: 0.3,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
      });
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.6,
        delay: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      });
    },
    { scope, dependencies: [reduced] },
  );

  const unroll = () => {
    if (reduced) return;
    const s = scope.current;
    gsap.to(s?.querySelector("[data-tie]") ?? [], {
      scaleX: 0,
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(s?.querySelector("[data-paper]") ?? [], {
      scaleY: 1.6,
      duration: 0.8,
      ease: "power2.inOut",
    });
  };

  return (
    <OpenGate onOpen={onOpen} className="bg-[#F3EAD7]">
      <div
        ref={scope}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-10 px-5 ${t.map}`}
      >
        <div
          data-scroll
          className="relative flex w-[min(92vw,520px)] items-stretch"
        >
          <span
            aria-hidden="true"
            className="w-6 rounded-full bg-[linear-gradient(90deg,#6E4A2A,#A67B52,#6E4A2A)] shadow-[2px_0_4px_rgba(0,0,0,0.3)]"
          />
          <div
            data-paper
            className="flex-1 bg-[#FBF6EA] px-6 py-10 text-center shadow-[inset_0_0_30px_rgba(139,94,40,0.18)]"
          >
            <p className={t.label}>Bản đồ hành trình</p>
            <p
              className={`${t.display} ${t.navy} mt-4 text-[30px] leading-[1.1] font-bold italic text-balance break-words sm:text-[40px]`}
            >
              {couple}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="w-6 rounded-full bg-[linear-gradient(90deg,#6E4A2A,#A67B52,#6E4A2A)] shadow-[-2px_0_4px_rgba(0,0,0,0.3)]"
          />
          <span
            data-tie
            aria-hidden="true"
            className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 bg-[#C0392B]"
          >
            <span className="absolute top-1/2 left-1/2 size-5 -translate-1/2 rotate-45 bg-[#C0392B]" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button data-gate-in type="button" onClick={unroll} className={t.btn}>
            Mở bản đồ
          </button>
          <p data-gate-in className={`text-[14px] ${t.soft}`}>
            Chạm để tháo dây và lên đường
          </p>
        </div>
      </div>
    </OpenGate>
  );
}
