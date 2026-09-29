"use client";

import { useRef } from "react";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { t } from "../tokens";

// C10 · The End: ảnh cuối xám → màu theo scrub, credits cuộn lên.
export function TheEnd({ data }: { data: WeddingData }) {
  const sec = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const last = data.images[7];

  useGSAP(
    () => {
      if (reduced || !sec.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.4,
        },
      });
      tl.fromTo(".te-color", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
      tl.from(".te-title", { opacity: 0, y: 30, duration: 0.3 }, 0);
      tl.fromTo(
        ".te-credits",
        { yPercent: 40 },
        { yPercent: -20, duration: 0.7, ease: "none" },
        0.3,
      );
    },
    { scope: sec, dependencies: [reduced] },
  );

  const credits = [
    ["Đạo diễn", "Tình yêu"],
    ["Chú rể", data.groom.name],
    ["Cô dâu", data.bride.name],
    ["Khách mời", "Bạn"],
  ];

  return (
    <section
      ref={sec}
      data-lb="open"
      className="flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center"
    >
      {last && (
        <div className="relative w-[min(60vw,280px)]">
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img src={last} alt="" className={`aspect-4/5 w-full ${t.photo}`} />
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={last}
            alt={`${data.groom.name} và ${data.bride.name}`}
            className={`te-color absolute inset-0 aspect-4/5 w-full object-cover ${reduced ? "" : "opacity-0"}`}
          />
        </div>
      )}
      <h2
        className={`te-title ${t.display} mt-8 text-[56px] leading-none text-[#F5F5F0] lg:text-[80px]`}
      >
        The End
      </h2>
      <p className={`te-title ${t.soft} mt-2`}>…hay chỉ mới bắt đầu.</p>
      <dl className="te-credits mt-10 grid w-[min(90vw,420px)] grid-cols-2 gap-x-6 gap-y-3 border-t border-dashed border-[#262626] pt-6 text-left">
        {credits.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className={t.label}>{k}</dt>
            <dd className="break-words text-[#F5F5F0]">{v}</dd>
          </div>
        ))}
        <dd className={`${t.label} col-span-2 mt-6 text-center ${t.gold}`}>
          Cảm ơn đã xem
        </dd>
      </dl>
      <GiftButton className={`${t.btn} mt-10 gap-2.5 pl-2`} />
    </section>
  );
}
