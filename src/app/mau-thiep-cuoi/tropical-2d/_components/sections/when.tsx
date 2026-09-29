"use client";

import { useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { useGSAP } from "@/kit/gsap";
import { fadeUp } from "@/kit/presets";
import { useWedding } from "@/wedding/wedding-data-provider";
import { onceEnter } from "../reveal";
import { beachSchedule } from "../schedule";
import { t } from "../tokens";

const SLOT_LABEL: Record<string, string> = {
  welcome: "Đón khách, nước dừa mát lạnh",
  ceremony: "Lễ cưới trên cát",
  dinner: "Tiệc tối bên bờ biển",
  party: "Tiệc lửa trại dưới sao",
};

// C5 + C6 + C7 + C12 · Ngày cưới, đếm ngược, lịch trình bốn mốc tính từ giờ
// tiệc và bản đồ resort (spec §5, dùng logic thuần đã test ở schedule.test.ts).
export function WhenSection({ date }: { date: Date }) {
  const { data } = useWedding();
  const venue = data.venue;
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => fadeUp(".wh-item", { stagger: 0.14 }));
    },
    { scope: section },
  );

  const slots = beachSchedule(date);

  return (
    <section
      ref={section}
      aria-label="Ngày cưới, lịch trình và địa điểm"
      className="relative flex min-h-[100svh] items-center justify-center px-3 py-24"
    >
      <div className="mx-auto flex w-[min(92vw,540px)] flex-col gap-6">
        <div className={`${t.island} wh-item px-6 py-10 text-center`}>
          <p className={`${t.label} ${t.soft}`}>Hẹn nhau ngày</p>
          <p
            className={`${t.script} mt-2 text-[44px] text-[#1F7F74] leading-none lg:text-[64px]`}
          >
            {formatDate(date)}
          </p>
          <p className={`${t.soft} mt-2`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-8 justify-center" />
        </div>

        <div className={`${t.island} wh-item px-6 py-8`}>
          <p className={`${t.script} text-center text-[24px] text-[#1F7F74]`}>
            Lịch trình trong ngày
          </p>
          <ol className="mt-5 flex flex-col gap-4">
            {slots.map((s) => (
              <li key={s.key} className="flex items-baseline gap-4">
                <span
                  className={`${t.script} w-[86px] shrink-0 text-[22px] text-[#C4502A]`}
                >
                  {s.time}
                </span>
                <span className={`border-l-2 border-[#2BB3A3]/40 pl-4`}>
                  {SLOT_LABEL[s.key] ?? s.key}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${t.island} wh-item px-6 py-8`}>
          <p className={`${t.label} ${t.soft} text-center`}>Địa điểm</p>
          <MapEmbed
            venue={venue}
            className="mt-4 aspect-16/10 w-full rounded-xl outline outline-1 outline-[#1F7F74]/25"
          />
          {venue.name ? (
            <p className="mt-3 text-center font-bold break-words">
              {venue.name}
            </p>
          ) : null}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noreferrer"
            className={`${t.btnTeal} mx-auto mt-5`}
          >
            Chỉ đường
          </a>
        </div>
      </div>
    </section>
  );
}
