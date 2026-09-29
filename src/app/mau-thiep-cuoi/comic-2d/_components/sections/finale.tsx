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

const EPISODE = [
  { time: "09:00", title: "Đón khách", place: "Nhà gái" },
  { time: "10:00", title: "Lễ thành hôn", place: "Nhà trai" },
  { time: "18:00", title: "Tiệc cưới", place: "Nhà hàng" },
] as const;

// C5 + C12 + C6 + C7 · "Tập cuối trọn đời": ngày, đếm ngược, ba cảnh chính,
// bản đồ (spec §5).
export function ComicShow({
  date,
  venue,
}: {
  date: Date;
  venue: WeddingData["venue"];
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => fadeUp(".cs-item", { stagger: 0.14 }));
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Ngày giờ và địa điểm"
      className="relative flex min-h-dvh items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.panel} cs-item p-6 text-center`}>
          <p className={t.label}>Tập cuối · Trọn đời</p>
          <p className={`${t.big} mt-2`}>{formatDate(date)}</p>
          <p className={`${t.soft} mt-1 font-bold`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-7 justify-center" />
        </div>

        <div className={`${t.panel} cs-item p-6`}>
          <p className={`${t.title} text-center`}>Ba cảnh không thể bỏ lỡ</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {EPISODE.map((e) => (
              <div key={e.time} className="text-center">
                <p className={`${t.name} !text-[30px]`}>{e.time}</p>
                <p className="font-extrabold">{e.title}</p>
                <p className={`${t.soft} text-[14px]`}>{e.place}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${t.panel} cs-item p-6`}>
          <p className={`${t.label} text-center`}>Bối cảnh tập cuối</p>
          <MapEmbed
            venue={venue}
            className="mt-4 h-72 w-full border-[3px] border-[#111]"
          />
          {venue.name ? (
            <p className="mt-3 text-center font-extrabold break-words">
              {venue.name}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// C8 + C14 + C10 · Thư viện ảnh + trang cuối "Hết tập 1".
export function ComicEnd({ images }: { images: string[] }) {
  const host = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      onceEnter(host.current, () => fadeUp(".ce-item", { stagger: 0.1 }));
    },
    { scope: host },
  );

  return (
    <div ref={host}>
      <section aria-label="Thư viện ảnh" className="px-3 py-24">
        <div className={t.col}>
          <p className={`${t.title} text-center`}>Thư viện minh họa</p>
          <div className={`${t.halftone} mt-6 rounded-lg p-3`}>
            <div className="grid grid-cols-2 gap-4">
              {images.map((src, i) => (
                // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                <img
                  key={src}
                  src={src}
                  width={400}
                  height={500}
                  alt={`Trang minh họa thứ ${i + 1}`}
                  className={`ce-item aspect-4/5 w-full border-[3px] border-[#111] bg-white object-cover ${
                    i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.8deg]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Lời kết"
        className="flex min-h-[70svh] items-center justify-center px-3 py-24"
      >
        <div
          className={`${t.col} ${t.panel} ce-item -rotate-1 p-8 text-center`}
        >
          <p className={t.label}>Hết tập 1</p>
          <h2 className={`${t.name} mt-2 !text-[36px] lg:!text-[52px]`}>
            Cảm ơn bạn đã đọc cùng
          </h2>
          <p className={`${t.soft} mt-3 font-bold`}>
            Phần thưởng hạnh phúc vẫn còn tiếp diễn…
          </p>
          <GiftButton className={`${t.btn} mt-7`} label="Tặng quà mừng" />
        </div>
      </section>
    </div>
  );
}
