"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Glass, Tape } from "../art";
import { t } from "../tokens";

// C10 · Hẹn gặp lại: ly cạn dần theo cuộn, khép lại hành trình bắt đầu từ phin ở màn mở.
export function SeeYou({
  couple,
  img,
  onView,
}: {
  couple: string;
  img?: string;
  onView: () => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const coffee = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !coffee.current) return;
      gsap.to(coffee.current, {
        scaleY: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 60%",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      ref={scope}
      className="mx-auto flex w-[min(92vw,720px)] flex-col items-center pt-16 pb-36 text-center"
    >
      {img && (
        <button
          data-rise
          type="button"
          onClick={onView}
          aria-label="Xem lớn ảnh cuối"
          className="relative w-[min(84vw,460px)] -rotate-1 bg-[#F5ECD9] p-2.5 pb-10 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.85)]"
        >
          <Tape />
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={img}
            alt={couple}
            className="aspect-[4/3] w-full object-cover"
          />
        </button>
      )}
      <p
        data-rise
        className={`${t.chalkY} mt-14 text-[34px] leading-tight sm:text-[44px]`}
      >
        Cảm ơn bạn đã ghé quán
      </p>
      <p data-rise className={`mt-4 max-w-[34ch] text-[17px] ${t.muted}`}>
        Hẹn gặp bạn ở tiệc cưới của{" "}
        <span className="text-[#F2EEE3]">{couple}</span>. Sự có mặt của bạn là
        ly cà phê ngon nhất của ngày hôm ấy.
      </p>
      <Glass
        layers={[{ color: "#6F4A2F", h: 70 }]}
        layerRef={() => (el) => {
          coffee.current = el;
        }}
        className="mt-14 h-40 w-28"
      />
    </section>
  );
}
