"use client";

import { useRef } from "react";
import { formatDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { initial } from "./stone";
import { t } from "./tokens";

// C1 · Monogram trong vòm; bấm để vòm nở thành "cửa" lộ ra sảnh (lỗ vòm tạo bằng box-shadow), phát nhạc.
export function Gate({
  groom,
  bride,
  date,
  onOpen,
}: {
  groom: string;
  bride: string;
  date: Date;
  onOpen: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-arch]", {
        scale: 0.92,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      gsap.from("[data-gate-in]", {
        autoAlpha: 0,
        y: 10,
        duration: 1,
        delay: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
      gsap.fromTo(
        "[data-mono]",
        { backgroundPosition: "100% 0" },
        {
          backgroundPosition: "0% 0",
          duration: 2,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 2.5,
        },
      );
    },
    { scope, dependencies: [reduced] },
  );

  const open = () => {
    if (reduced) return;
    const s = scope.current;
    gsap.to(s?.querySelectorAll("[data-fill], [data-gate-in]") ?? [], {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(s?.querySelector("[data-arch]") ?? [], {
      scale: 9,
      duration: 1.4,
      delay: 0.2,
      ease: "power3.inOut",
    });
  };

  const [d, m, y] = formatDate(date).split("/");
  return (
    <OpenGate onOpen={onOpen} className="bg-[transparent]">
      <div
        ref={scope}
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6"
      >
        <button
          type="button"
          onClick={open}
          aria-label="Mở thiệp mời"
          data-arch
          className="relative h-[min(52svh,340px)] w-[min(62vw,240px)] rounded-t-full rounded-b-2xl shadow-[0_0_0_250vmax_#F7F5F2] ring-1 ring-[#B08D57]"
        >
          <span
            data-fill
            className="absolute inset-0 flex flex-col items-center justify-center rounded-t-full rounded-b-2xl bg-white"
          >
            <span className="absolute inset-1.5 rounded-t-full rounded-b-xl ring-1 ring-[#B08D57]/50" />
            <span
              data-mono
              className={`${t.display} ${t.gold} text-[76px] leading-none sm:text-[96px]`}
            >
              {initial(groom)}
              <span className="mx-2 inline-block h-[0.7em] w-px bg-[#B08D57] align-middle" />
              {initial(bride)}
            </span>
            <span className="mt-5 text-[12px] font-semibold tracking-[0.3em] text-[#6E6A64] tabular-nums">
              {d}.{m}.{y?.slice(2)}
            </span>
          </span>
        </button>
        <p
          data-gate-in
          className={`${t.label} relative mt-10 text-center text-balance`}
        >
          {groom} &amp; {bride}
        </p>
        <p
          data-gate-in
          className={`relative mt-3 text-[12px] tracking-[0.25em] uppercase ${t.soft}`}
        >
          Chạm để mở thiệp
        </p>
      </div>
    </OpenGate>
  );
}
