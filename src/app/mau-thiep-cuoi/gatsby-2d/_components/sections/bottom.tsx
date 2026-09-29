"use client";

import { useEffect, useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import { useGSAP } from "@/kit/gsap";
import { fadeUp, particles } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { Fan } from "../decor";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const RUN = [
  {
    time: "19:00",
    title: "Đón khách",
    note: "Champagne và jazz sống tại sảnh lớn",
  },
  {
    time: "20:00",
    title: "Nghi thức",
    note: "Lễ thành hôn dưới ánh nến vàng kim",
  },
  {
    time: "21:00",
    title: "Khiêu vũ",
    note: "Ban nhạc bắt đầu, sàn nhảy mở toang",
  },
] as const;

// C5 + C6 + C7 + C12 · Đêm hội: giờ giấc, lịch trình, bản đồ (spec §5).
export function WhenSection({
  date,
  venue,
}: {
  date: Date;
  venue: WeddingData["venue"];
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => fadeUp(".gw-item", { stagger: 0.14 }));
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Đêm hội và địa điểm"
      className="relative flex min-h-dvh items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.frame} gw-item px-6 py-10 text-center`}>
          <p className={t.label}>Đêm hội mừng cưới</p>
          <p className={`${t.big} mt-3`}>{formatDate(date)}</p>
          <p className={`${t.soft} mt-2`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-8 justify-center" />
        </div>

        <div className={`${t.frame} gw-item px-6 py-8`}>
          <h2 className={`${t.title} text-center`}>Chương trình đêm hội</h2>
          <Fan aria-hidden className="mx-auto mt-3 w-24 text-[#D4AF37]" />
          <ol className="mt-5 flex flex-col gap-4">
            {RUN.map((r) => (
              <li
                key={r.time}
                className="flex items-baseline gap-4 border-b border-[#D4AF37]/25 pb-3 last:border-none last:pb-0"
              >
                <span className={`${t.big} !text-[26px] w-16 shrink-0`}>
                  {r.time}
                </span>
                <span>
                  <span className="block font-semibold tracking-[0.06em] uppercase">
                    {r.title}
                  </span>
                  <span className={`${t.soft} block text-[15px]`}>
                    {r.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${t.frame} gw-item px-6 py-8`}>
          <h2 className={`${t.title} text-center`}>Đại tiệc tại</h2>
          <MapEmbed
            venue={venue}
            className="mt-4 h-72 w-full border border-[#D4AF37]/50"
          />
          {venue.name ? (
            <p className="mt-3 text-center tracking-[0.08em] uppercase">
              {venue.name}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// C8 + C14 + C10 · Khoảnh khắc, quà champagne và lời kết (spec §5).
export function AlbumSection({ images }: { images: string[] }) {
  const host = useRef<HTMLDivElement>(null);
  const bubbles = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      onceEnter(host.current, () => fadeUp(".ga-item", { stagger: 0.12 }));
    },
    { scope: host },
  );

  useEffect(() => {
    const el = bubbles.current;
    if (reduced || !el) return;
    const fx = particles({
      parent: el,
      count: 22,
      colors: ["#D4AF37", "#F5E6B8"],
      size: [4, 9],
      fall: false,
    });
    return () => fx.kill();
  }, [reduced]);

  return (
    <div ref={host}>
      <section aria-label="Album khoảnh khắc" className="relative px-3 py-24">
        <div className={t.col}>
          <h2 className={`${t.title} text-center`}>Những khoảnh khắc</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={500}
                alt={`Ảnh cưới ${i + 1}`}
                className={`ga-item aspect-4/5 w-full ${t.frame} p-1.5`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Lời kết"
        className="relative flex min-h-[70svh] items-center justify-center overflow-hidden px-3 py-24"
      >
        <div
          ref={bubbles}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
        <div
          className={`${t.col} ${t.frame} ga-item relative px-6 py-12 text-center`}
        >
          <Fan aria-hidden className="mx-auto w-28 text-[#D4AF37]" />
          <h2 className={`${t.title} mt-3`}>Hẹn gặp bạn đêm hội</h2>
          <p className={`${t.soft} mt-3`}>
            Một chiếc váy đẹp, một ly champagne lạnh, và bạn.
          </p>
          <GiftButton className={`${t.btn} mt-8`} label="Gửi champagne mừng" />
        </div>
      </section>
    </div>
  );
}
