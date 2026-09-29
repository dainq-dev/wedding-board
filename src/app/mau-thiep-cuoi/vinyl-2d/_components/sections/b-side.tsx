"use client";

import { useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import { useGSAP } from "@/kit/gsap";
import { fadeUp } from "@/kit/presets";
import type { WeddingData } from "@/wedding/types";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const SHOW = [
  { time: "19:30", title: "Check-in", place: "Sảnh nhà hàng" },
  { time: "20:00", title: "Nghi thức", place: "Sàn diễn chính" },
  { time: "21:00", title: "Encore", place: "Sàn nhảy" },
] as const;

// C5 + C6 + C7 + C12 · "Showtime": ngày diễn, đếm ngược, lịch ba phần, bản đồ.
export function Showtime({
  date,
  venue,
}: {
  date: Date;
  venue: WeddingData["venue"];
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => fadeUp(".vw-item", { stagger: 0.14 }));
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Thời gian và địa điểm"
      className="relative flex min-h-dvh items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.sleeve} vw-item p-6 text-center`}>
          <p className={t.label}>Đêm diễn</p>
          <p className={`${t.big} mt-2`}>{formatDate(date)}</p>
          <p className={`${t.soft} mt-1`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-7 justify-center" />
        </div>

        <div className={`${t.sleeve} vw-item p-6`}>
          <p className={`${t.title} text-center`}>Ba phần của đêm diễn</p>
          <ol className="mt-5 flex flex-col gap-4">
            {SHOW.map((s) => (
              <li key={s.time} className="flex items-baseline gap-4">
                <span className={`${t.title} w-[70px] shrink-0 !text-[22px]`}>
                  {s.time}
                </span>
                <span className="block">
                  <span className="block font-bold">{s.title}</span>
                  <span className={`${t.soft} block text-[14px]`}>
                    {s.place}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${t.sleeve} vw-item p-6`}>
          <p className={`${t.label} text-center`}>Nhà hát của đêm nay</p>
          <MapEmbed
            venue={venue}
            className="mt-4 h-72 w-full rounded ring-2 ring-[#3E2723]/20"
          />
          {venue.name ? (
            <p className="mt-3 text-center font-bold break-words">
              {venue.name}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// C8 + C14 + C10 · "Side B": album discography, quà mừng và lời kết đĩa.
export function SideB({ images }: { images: string[] }) {
  const host = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(host.current, () => fadeUp(".vb-item", { stagger: 0.1 }));
    },
    { scope: host },
  );

  return (
    <section ref={host} aria-label="Album và lời cảm ơn" className="px-3 py-24">
      <div className={`${t.col} flex flex-col gap-10`}>
        <div>
          <p className={`${t.title} text-center`}>Side B · Tuyển tập ảnh</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={400}
                alt={`Ảnh trong tuyển tập thứ ${i + 1}`}
                className="vb-item aspect-square w-full rounded-lg object-cover ring-2 ring-[#3E2723]/15"
              />
            ))}
          </div>
        </div>

        <div className={`${t.sleeve} vb-item p-8 text-center`}>
          <p className={t.label}>The End · Hết băng, còn nhạc</p>
          <h2 className={`${t.title} mt-2`}>Cảm ơn bạn đã đến đêm diễn</h2>
          <p className={`${t.soft} mt-3`}>
            Món quà của bạn sẽ được cất vào hộp đĩa kỷ niệm của hai đứa.
          </p>
          <GiftButton className={`${t.btn} mt-7`} label="Tặng quà mừng" />
        </div>
      </div>
    </section>
  );
}
