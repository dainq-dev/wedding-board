"use client";

import { useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { useGSAP } from "@/kit/gsap";
import { fadeUp } from "@/kit/presets";
import type { WeddingData } from "@/wedding/types";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
const MONTHS = [
  "tháng một",
  "tháng hai",
  "tháng ba",
  "tháng tư",
  "tháng năm",
  "tháng sáu",
  "tháng bảy",
  "tháng tám",
  "tháng chín",
  "tháng mười",
  "tháng mười một",
  "tháng mười hai",
] as const;

// Lịch dương theo giờ Việt Nam, tuần bắt đầu Thứ Hai. UTC để không lệch máy chạy.
function monthCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lead = (firstDow + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
}

const FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function vnParts(d: Date) {
  const parts = FORMAT.formatToParts(d);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

// C12: hành trình ngày cưới viết như thực đơn picnic.
const MENU = [
  { course: "Khai vị", time: "09:00", title: "Đón khách" },
  { course: "Món chính", time: "10:30", title: "Lễ thành hôn" },
  { course: "Tráng miệng", time: "18:00", title: "Khai tiệc" },
] as const;

// C5 + C11 + C12 + C7 · Ngày cưới, đếm ngược, lịch tháng, thực đơn lịch
// trình và bản đồ nhà hàng (spec §5).
export function WhenSection({
  date,
  venue,
}: {
  date: Date;
  venue: WeddingData["venue"];
}) {
  const section = useRef<HTMLElement>(null);
  const { year, month, day } = vnParts(date);

  useGSAP(
    () => {
      onceEnter(section.current, () => fadeUp(".wk-card", { stagger: 0.14 }));
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Ngày cưới, lịch trình và địa điểm"
      className="relative flex min-h-[100svh] items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-6`}>
        <div className={`${t.card} wk-card text-center`}>
          <p className={t.label}>Hẹn gặp nhau ngày</p>
          <p className={`${t.big} mt-2`}>{formatDate(date)}</p>
          <p className={`${t.soft} mt-1`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-7 justify-center" />
        </div>

        <div className={`${t.card} wk-card`}>
          <p className={`${t.label} text-center`}>
            {MONTHS[month - 1]} {year}
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[13px]">
            {WEEKDAYS.map((d) => (
              <span key={d} className={`${t.soft} py-1`}>
                {d}
              </span>
            ))}
            {monthCells(year, month).map((c, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: ô lịch là lưới cố định theo vị trí, không đổi thứ tự
                key={`cell${i}`}
                className={
                  c === day
                    ? "flex aspect-square items-center justify-center rounded-full bg-[#D62828] font-bold text-white"
                    : "flex aspect-square items-center justify-center"
                }
              >
                {c ?? ""}
              </span>
            ))}
          </div>
        </div>

        <div className={`${t.card} wk-card`}>
          <p className={`${t.title} text-center`}>Thực đơn hôm nay</p>
          <ol className="mt-5 flex flex-col gap-4">
            {MENU.map((m) => (
              <li
                key={m.course}
                className="flex items-center justify-between gap-4 border-b border-dashed border-[#EAD9CC] pb-3 last:border-none last:pb-0"
              >
                <span>
                  <span className={t.label}>{m.course}</span>
                  <span className="block font-bold">{m.title}</span>
                </span>
                <span className={`${t.title} shrink-0 !text-[24px]`}>
                  {m.time}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${t.card} wk-card`}>
          <p className={`${t.label} text-center`}>Địa điểm tổ chức</p>
          <MapEmbed
            venue={venue}
            className="mt-4 h-72 w-full rounded-xl outline outline-1 outline-[#D62828]/25"
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
            className={`${t.btn} mx-auto mt-5`}
          >
            Chỉ đường
          </a>
        </div>
      </div>
    </section>
  );
}
