"use client";

import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
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

// Lịch dương theo giờ Việt Nam, tuần bắt đầu Thứ Hai (C11). Tính bằng UTC để ổn định.
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

const STEPS = [
  { time: "09:00", title: "Đón khách", note: "Gia đình hai bên tiếp khách" },
  { time: "10:00", title: "Cử hành lễ", note: "Lễ thành hôn tại nhà trai" },
  { time: "18:00", title: "Khai tiệc", note: "Tiệc cưới tại nhà hàng" },
] as const;

// C5 + C11 + C12 · Ngày cưới, đếm ngược, lịch tháng và trình tự ngày cưới (spec §4).
export function WhenSection({ date }: { date: Date }) {
  const { year, month, day } = vnParts(date);
  const cells = monthCells(year, month);

  return (
    <section
      aria-label="Ngày cưới và trình tự"
      className="relative flex min-h-[100svh] items-center justify-center py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.card} px-6 py-10 text-center`}>
          <p className={t.label}>Ngày chung đôi</p>
          <p className={`${t.big} mt-4`}>{formatDate(date)}</p>
          <p className={`${t.soft} italic mt-2`}>
            {formatWeekday(date)} · {formatTime(date)}
          </p>
          <Countdown date={date} flip className="mt-8 justify-center" />
        </div>

        <div className={`${t.card} px-6 py-8`}>
          <p className={`${t.label} text-center`}>
            {MONTHS[month - 1]} {year}
          </p>
          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[13px]">
            {WEEKDAYS.map((d) => (
              <span key={d} className={`${t.soft} py-1`}>
                {d}
              </span>
            ))}
            {cells.map((c, i) => (
              <span
                key={`c${i}-${c ?? "x"}`}
                className={
                  c === day
                    ? "flex aspect-square items-center justify-center rounded-full bg-[#9B1B1E] font-semibold text-[#F1D08A]"
                    : "flex aspect-square items-center justify-center"
                }
              >
                {c ?? ""}
              </span>
            ))}
          </div>
          <p className={`${t.soft} mt-4 text-center text-[13px]`}>
            Ngày cưới được khoanh đỏ, âm lịch sẽ bổ sung sau.
          </p>
        </div>

        <div className={`${t.card} px-6 py-8`}>
          <p className={`${t.label} text-center`}>Trình tự ngày cưới</p>
          <ol className="mt-6 flex flex-col gap-5">
            {STEPS.map((s) => (
              <li key={s.title} className="flex gap-4">
                <span
                  className={`${t.big} w-[86px] shrink-0 text-[28px] lg:text-[34px]`}
                >
                  {s.time}
                </span>
                <span className="border-l border-[#D4A24C]/60 pl-4">
                  <span className="block font-semibold">{s.title}</span>
                  <span className={`${t.soft} block text-[15px]`}>
                    {s.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
