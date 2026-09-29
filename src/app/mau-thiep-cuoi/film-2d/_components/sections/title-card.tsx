"use client";

import { useRef } from "react";
import { weddingDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { splitReveal } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { t } from "../tokens";

// C2 · Title card "A film by…" — ghim 150svh, T2 cắt cảnh cuối (spec §9.4).
export function TitleCard({ data }: { data: WeddingData }) {
  const sec = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const names = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sec.current || !bg.current || !names.current) return;
      if (reduced) {
        gsap.from(sec.current, {
          autoAlpha: 0,
          duration: 0.3,
          scrollTrigger: { trigger: sec.current, start: "top 80%" },
        });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: "top top",
          end: "+=50%",
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
        },
      });
      // 0–30%: tên A2 theo dòng; 30–80% Ken Burns; 80–100% cắt cảnh (autoAlpha).
      tl.add(splitReveal(names.current, { by: "lines", stagger: 0.12 }), 0);
      tl.fromTo(
        bg.current,
        { scale: 1.15 },
        { scale: 1, ease: "none", duration: 0.5 },
        0.3,
      );
      tl.to(sec.current, { autoAlpha: 0, duration: 0.15 }, 1.45);
    },
    { dependencies: [reduced] },
  );

  const date = weddingDate(data);
  const d = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return (
    <section
      ref={sec}
      data-lb="21:9"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {data.images[0] && (
        <div ref={bg} className="absolute inset-0 origin-center">
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img src={data.images[0]} alt="" className={`size-full ${t.photo}`} />
          <div aria-hidden className="absolute inset-0 bg-black/55" />
        </div>
      )}
      <div className="relative z-10 mx-auto w-[min(90vw,560px)] py-[16svh] text-center">
        <p className={`${t.label} tracking-[0.3em]`}>A film by two hearts</p>
        <h1
          ref={names}
          className={`${t.display} mt-6 text-[44px] leading-[1.1] text-[#F5F5F0] break-words lg:text-[88px]`}
        >
          {data.groom.name}
          <br />
          <span className="text-[0.6em] not-italic">&amp;</span>
          <br />
          {data.bride.name}
        </h1>
        <hr className="mx-auto mt-6 w-40 border-[#262626]" />
        <p className={`${t.display} mt-6 text-lg text-[#C9A227] lg:text-2xl`}>
          Công chiếu {d}
        </p>
      </div>
    </section>
  );
}
