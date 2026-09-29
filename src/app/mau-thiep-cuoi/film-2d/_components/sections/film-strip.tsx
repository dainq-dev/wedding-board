"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { horizontalTrack } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { t } from "../tokens";

const FRAMES = [
  { label: "Chuyện tình · 5 khung hình", caption: "Cuộn 01 — 35mm", year: "" },
  {
    label: "Lần đầu gặp",
    caption: "Một quán cà phê, một cái cúi nhầm bàn",
    year: "2019",
  },
  {
    label: "Buổi hẹn đầu tiên",
    caption: "Đi hết một vòng hồ lúc nửa đêm",
    year: "2021",
  },
  {
    label: "Lời cầu hôn",
    caption: "Cùng một chiếc bàn, hai câu trả lời",
    year: "2023",
  },
  {
    label: "Và phần tiếp theo…",
    caption: "Chương cuối của bộ phim này",
    year: "2026",
  },
];

const SPROCKETS =
  "h-6 shrink-0 bg-[#1A1A1A] bg-[radial-gradient(circle_at_16px_50%,#0D0D0D_0_5px,transparent_6px)] bg-repeat-x [background-size:32px_100%]";

// C4 · Dải film 35mm ngang (T5/A5) — kit horizontalTrack, lỗ răng cưa chạy 1.1×.
export function FilmStrip({ data }: { data: WeddingData }) {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const blocks = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sec.current || !track.current || reduced) return;
      const tween = horizontalTrack(track.current, { trigger: sec.current });
      const st = tween.scrollTrigger;
      if (!st) return;
      st.vars.onUpdate = (s: ScrollTrigger) => {
        const dist = track.current
          ? track.current.scrollWidth - window.innerWidth
          : 0;
        const x = -dist * s.progress;
        // Lỗ răng cưa trượt nhanh hơn 1.1× — cảm giác cuộn phim (spec §5 C4).
        const bg = `${x * 1.1}px 50%`;
        if (top.current) top.current.style.backgroundPosition = bg;
        if (bottom.current) bottom.current.style.backgroundPosition = bg;
        const idx = Math.min(
          FRAMES.length - 1,
          Math.round(s.progress * (FRAMES.length - 1)),
        );
        if (counter.current)
          counter.current.textContent = `${idx + 1}/${FRAMES.length}`;
        blocks.current.forEach((b, i) =>
          b.classList.toggle("bg-[#C9A227]", i <= idx),
        );
      };
    },
    { dependencies: [reduced] },
  );

  const cell = (f: (typeof FRAMES)[number], i: number) => {
    const img = i === 0 ? undefined : data.images[2 + i];
    return (
      <div key={f.label} className="flex w-[min(80vw,520px)] shrink-0 flex-col">
        {i === 0 ? (
          <div
            className={`flex aspect-4/3 items-center justify-center p-6 text-center ${t.frame}`}
          >
            <p className={`${t.heading} text-[20px] lg:text-[28px]`}>
              {f.label}
            </p>
          </div>
        ) : img ? (
          <div className={t.frame}>
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={img}
              alt={`Chuyện tình: ${f.label}`}
              className={`aspect-4/3 w-full ${t.photo}`}
            />
          </div>
        ) : (
          <div className={`aspect-4/3 ${t.frame}`} aria-hidden />
        )}
        <p className={`${t.label} mt-2`}>
          0{i + 3}A{f.year ? ` · ${f.year}` : ""} · {f.label}
          <span className="block text-[#A3A39C]/80 normal-case tracking-normal">
            {f.caption}
          </span>
        </p>
      </div>
    );
  };

  if (reduced) {
    // Reduced: bỏ pin, các khung xếp dọc, ảnh 4:3 tràn ngang (spec §5 C4).
    return (
      <section ref={sec} data-lb="open" className="py-16">
        <div className={`mx-auto w-[min(90vw,560px)]`}>
          <div className={SPROCKETS} aria-hidden />
          <div className="mt-4 flex flex-col gap-8">
            {FRAMES.map((f, i) => (
              <div key={f.label}>{cell(f, i)}</div>
            ))}
          </div>
          <div className={`mt-4 ${SPROCKETS}`} aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sec}
      data-lb="open"
      className="relative flex h-[100svh] flex-col justify-center overflow-hidden bg-[#0D0D0D]"
    >
      <div ref={top} className={SPROCKETS} aria-hidden />
      <div className="relative overflow-hidden py-4">
        <div
          ref={track}
          className="flex w-max gap-6 px-6 will-change-transform"
        >
          {FRAMES.map((f, i) => cell(f, i))}
        </div>
      </div>
      <div ref={bottom} className={SPROCKETS} aria-hidden />
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="flex gap-1" aria-hidden>
          {FRAMES.map((f, i) => (
            <span
              key={f.label}
              ref={(el) => {
                if (el) blocks.current[i] = el;
              }}
              className="h-1.5 w-6 bg-[#262626]"
            />
          ))}
        </span>
        <span ref={counter} className={`${t.label} !text-[#F5F5F0]`}>
          1/5
        </span>
      </div>
    </section>
  );
}
