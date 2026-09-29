"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { grind } from "./grind";
import { t } from "./tokens";

// C1 · Bình phong bốn tấm then đen; bấm "Mài tranh" để lộ lớp vàng lá, mở thiệp và phát nhạc.
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
      gsap.set("[data-gold]", { autoAlpha: 0 });
      if (reduced) return;
      gsap.from("[data-leaf]", {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.8,
        delay: 1.1,
        ease: "power3.out",
      });
      // Vệt bóng của lớp sơn lướt qua bình phong mỗi 5 giây.
      gsap.fromTo(
        "[data-gloss]",
        { xPercent: -120 },
        {
          xPercent: 220,
          duration: 1.4,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 3.6,
          delay: 1.5,
        },
      );
    },
    { scope, dependencies: [reduced] },
  );

  const reveal = () => {
    const gold = scope.current?.querySelectorAll("[data-gold]") ?? [];
    gsap.set(gold, { autoAlpha: 1 });
    if (reduced) return;
    grind(gold, { duration: 0.8, stagger: 0.08 });
  };

  const leaves = [{ text: "" }, { text: groom }, { text: bride }, { text: "" }];

  return (
    <OpenGate onOpen={onOpen} className="bg-[#120A07]">
      <div
        ref={scope}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-10 px-4 ${t.bg}`}
      >
        <div className="relative grid w-[min(94vw,720px)] grid-cols-4 gap-1 overflow-hidden [perspective:1200px]">
          {leaves.map((l, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: bốn tấm bình phong cố định
              key={i}
              data-leaf
              className={`relative flex h-[min(62svh,440px)] items-center justify-center overflow-hidden rounded-[3px] bg-[#0D0705] ring-1 ring-[#C9A24A]/50 ${i % 2 ? "[transform:rotateY(-6deg)]" : "[transform:rotateY(6deg)]"}`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-2 rounded-[2px] ring-1 ring-[#C9A24A]/25"
              />
              {/* lớp vàng lá bên dưới lớp sơn, lộ ra khi mài */}
              <span
                data-gold
                aria-hidden="true"
                className="absolute inset-3 rounded-[2px] bg-[radial-gradient(ellipse_at_50%_30%,rgba(241,212,138,0.28),transparent_60%),linear-gradient(160deg,rgba(201,162,74,0.18),transparent_50%,rgba(164,22,26,0.18))]"
              >
                <span
                  className={`absolute inset-x-3 top-4 h-3 ${t.eggshell}`}
                />
                <span
                  className={`absolute inset-x-3 bottom-4 h-3 ${t.eggshell}`}
                />
              </span>
              {l.text && (
                <p
                  className={`${t.display} relative px-1 text-center text-[18px] leading-[1.3] break-words sm:text-[28px] ${t.gold}`}
                >
                  {l.text}
                </p>
              )}
            </div>
          ))}
          <span
            data-gloss
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
          />
        </div>
        <div data-gate-in className="flex flex-col items-center gap-3">
          <button type="button" onClick={reveal} className={t.btn}>
            Mài tranh
          </button>
          <p className={`text-[14px] italic ${t.soft}`}>Chạm để mở thiệp mời</p>
        </div>
      </div>
    </OpenGate>
  );
}
