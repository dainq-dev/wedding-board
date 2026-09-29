"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Phin } from "../art";
import { t } from "../tokens";

// C1 · Phin nhỏ giọt: chạm bất kỳ đâu để mở thiệp và phát nhạc.
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
      gsap.from("[data-gate-in]", {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power1.inOut",
      });
      if (reduced) return;
      // Giọt cà phê rơi mỗi 1.4s, mực ly dâng dần (tối đa 20 đơn vị).
      const drip = gsap
        .timeline({ repeat: -1, repeatDelay: 0.8, delay: 1.2 })
        .fromTo(
          ".cafe-drop",
          { y: 0, scaleY: 1, autoAlpha: 1, transformOrigin: "50% 0%" },
          { y: 110, scaleY: 1.4, duration: 0.6, ease: "power2.in" },
        )
        .set(".cafe-drop", { autoAlpha: 0 })
        .fromTo(
          ".cafe-ripple",
          { scale: 0.2, autoAlpha: 1, transformOrigin: "50% 50%" },
          { scale: 1, autoAlpha: 0, duration: 0.5, ease: "power1.out" },
          "<",
        )
        .to(".cafe-level", { y: "-=1", duration: 0.2 }, "<");
      const steam = gsap.fromTo(
        ".cafe-steam",
        { y: 6, autoAlpha: 0 },
        {
          y: -10,
          autoAlpha: 1,
          duration: 2.4,
          stagger: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      );
      const pause = () => {
        const hidden = document.visibilityState === "hidden";
        drip.paused(hidden);
        steam.paused(hidden);
      };
      document.addEventListener("visibilitychange", pause);
      return () => document.removeEventListener("visibilitychange", pause);
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <OpenGate onOpen={onOpen} className="bg-[#2B1D14]">
      <div
        ref={scope}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#2B1D14] px-6 text-center ${t.wood}`}
      >
        <p
          data-gate-in
          className={`${t.chalk} max-w-[18ch] text-[26px] leading-snug text-balance sm:text-[32px]`}
        >
          <span className={t.chalkY}>{groom}</span> &amp;{" "}
          <span className={t.chalkY}>{bride}</span> mời bạn một ly cà phê
        </p>
        <button
          data-gate-in
          type="button"
          aria-label="Mở thiệp mời"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#E9C46A]"
        >
          <Phin />
        </button>
        <p data-gate-in className={`text-[14px] ${t.muted}`}>
          Chạm vào phin để mở thiệp
        </p>
      </div>
    </OpenGate>
  );
}
