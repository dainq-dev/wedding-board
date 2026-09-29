"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Crescent } from "./night";
import { t } from "./tokens";

// C1 · Trăng lưỡi liềm giữa trời; chạm vào trăng để ánh trăng nở ra mở thiệp, phát nhạc.
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
      gsap.from("[data-gate-moon]", {
        scale: 0.6,
        autoAlpha: 0,
        duration: 1.4,
        ease: "sine.inOut",
      });
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 14,
        duration: 1,
        delay: 0.8,
        stagger: 0.2,
        ease: "sine.inOut",
      });
      gsap.to("[data-halo]", {
        scale: 1.15,
        opacity: 0.6,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope, dependencies: [reduced] },
  );

  const bloom = () => {
    if (reduced) return;
    gsap.to(scope.current?.querySelector("[data-bloom]") ?? [], {
      scale: 40,
      opacity: 0.9,
      duration: 1,
      ease: "sine.in",
    });
  };

  return (
    <OpenGate
      onOpen={onOpen}
      className="bg-[radial-gradient(ellipse_at_50%_40%,#15254F_0%,#0B1532_70%)]"
    >
      <div
        ref={scope}
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <button
          type="button"
          onClick={bloom}
          aria-label="Chạm vào mặt trăng để mở thiệp mời"
          className="relative size-36 rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#FFE59A]"
        >
          <span
            data-halo
            className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,229,154,0.45),transparent_65%)]"
          />
          <span data-gate-moon className="absolute inset-0">
            <Crescent id="moon-gate" />
          </span>
          <span
            data-bloom
            className="absolute inset-[35%] rounded-full bg-[#FFE59A] opacity-0"
          />
        </button>
        <p
          data-gate-in
          className={`${t.display} ${t.moon} mt-14 text-[40px] leading-tight text-balance break-words sm:text-[56px]`}
        >
          {couple}
        </p>
        <p data-gate-in className={`mt-3 ${t.soft}`}>
          Chạm vào mặt trăng để mở thiệp
        </p>
      </div>
    </OpenGate>
  );
}
