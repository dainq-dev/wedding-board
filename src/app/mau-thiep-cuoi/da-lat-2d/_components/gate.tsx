"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { t } from "./tokens";

// C1 · Đồi thông phủ sương; bấm "Mở thiệp mời" để màn sương tách đôi, mở thiệp và phát nhạc.
export function Gate({
  groom,
  bride,
  onOpen,
}: {
  groom: string;
  bride: string;
  onOpen: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-gate-name]",
        { autoAlpha: 0, filter: "blur(8px)" },
        {
          autoAlpha: 0.75,
          filter: "blur(1.5px)",
          duration: 1.4,
          delay: 0.5,
          ease: "sine.inOut",
        },
      );
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 12,
        duration: 1,
        delay: 1.2,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    },
    { scope, dependencies: [reduced] },
  );

  const part = () => {
    const s = scope.current;
    if (!s || reduced) return;
    gsap.to(s.querySelector("[data-half='l']"), {
      xPercent: -110,
      duration: 1.6,
      ease: "sine.inOut",
    });
    gsap.to(s.querySelector("[data-half='r']"), {
      xPercent: 110,
      duration: 1.6,
      ease: "sine.inOut",
    });
    gsap.to(s.querySelector("[data-base]"), {
      opacity: 0,
      duration: 1.2,
      ease: "sine.inOut",
    });
    gsap.to(s.querySelector("[data-gate-name]"), {
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 1,
    });
  };

  return (
    <OpenGate onOpen={onOpen} className="bg-[transparent]">
      <div ref={scope} className="absolute inset-0 overflow-hidden">
        <div data-base className="absolute inset-0 bg-[#EEF1EC]" />
        <div
          data-half="l"
          className="absolute inset-y-0 left-0 w-[60%] bg-[linear-gradient(90deg,#F4F6F3_60%,rgba(244,246,243,0))]"
        />
        <div
          data-half="r"
          className="absolute inset-y-0 right-0 w-[60%] bg-[linear-gradient(270deg,#F4F6F3_60%,rgba(244,246,243,0))]"
        />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p data-gate-in className={t.label}>
            Đà Lạt, mùa cưới
          </p>
          <p
            data-gate-name
            className={`${t.display} mt-6 text-[46px] leading-[1.05] italic text-balance break-words text-[#1F2D25] sm:text-[72px]`}
          >
            {groom}
            <span className="block text-[0.55em] not-italic">&amp;</span>
            {bride}
          </p>
          <button
            data-gate-in
            type="button"
            onClick={part}
            className={`${t.btn} mt-12`}
          >
            Mở thiệp mời
          </button>
          <p data-gate-in className={`mt-3 text-[13px] ${t.soft}`}>
            Chạm để vén màn sương
          </p>
        </div>
      </div>
    </OpenGate>
  );
}
