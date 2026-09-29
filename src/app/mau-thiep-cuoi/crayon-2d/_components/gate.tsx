"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { House, Sun } from "./draw";
import { t } from "./tokens";

// C1 · Ngôi nhà + mặt trời vẽ ra trước mắt; chạm vào mặt trời để mở thiệp và phát nhạc.
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
      gsap.from("[data-draw]", {
        drawSVG: "0%",
        duration: 0.6,
        stagger: 0.06,
        ease: "power1.inOut",
      });
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        delay: 1.2,
        stagger: 0.15,
        ease: "back.out(2)",
      });
      gsap.to("[data-sun]", {
        rotation: 12,
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.5,
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <OpenGate onOpen={onOpen} className="bg-[#FFFDF8]">
      <div
        ref={scope}
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${t.paper}`}
      >
        <button
          type="button"
          aria-label="Chạm vào mặt trời để mở thiệp mời"
          className="absolute top-[9svh] right-[10vw] size-28 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F6FA8] sm:size-36"
        >
          <span data-sun className="block size-full">
            <Sun className="size-full" />
          </span>
        </button>
        <House className="mt-10 w-[min(62vw,280px)]" />
        <p
          data-gate-in
          className={`${t.display} ${t.pink} mt-6 -rotate-2 text-[32px] leading-tight text-balance break-words sm:text-[44px]`}
        >
          {couple}
        </p>
        <p data-gate-in className={`mt-3 text-[18px] ${t.soft}`}>
          Chạm vào ông mặt trời để mở thiệp nhé
        </p>
      </div>
    </OpenGate>
  );
}
