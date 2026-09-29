"use client";

import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { monthGrid, monthLabelVi, WEEKDAY_HEADERS_VI } from "../calendar";
import { t } from "../tokens";
import { vnDateParts } from "../vn-date";

// C5 + C11 · Ngày cưới, đếm ngược (A7) và lịch tháng khoanh ngày cưới (spec §5).
export function WhenSection({ date }: { date: Date }) {
  const { year, month, day } = vnDateParts(date);

  return (
    <section
      aria-label="Ngày cưới"
      className="relative flex min-h-[100svh] items-center justify-center py-24"
    >
      <div className={`${t.col} text-center`}>
        <h2 className={t.heading}>Ngày chung đôi</h2>
        <p
          className={`${t.big} mt-6 text-[56px] text-[#D9667F] sm:text-[72px] lg:text-[92px]`}
        >
          {formatDate(date)}
        </p>
        <p className={`${t.caption} mt-2`}>
          {formatWeekday(date)} · {formatTime(date)}
        </p>

        <Countdown date={date} flip className="mt-10 justify-center" />

        <div className={`${t.card} mt-12 px-4 py-5`}>
          <p className={t.heading}>{monthLabelVi(year, month)}</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[13px]">
            {WEEKDAY_HEADERS_VI.map((d) => (
              <span key={d} className={`${t.soft} py-1`}>
                {d}
              </span>
            ))}
            {monthGrid(year, month)
              .flat()
              .map((d, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: ô lịch là lưới cố định theo vị trí, không đổi thứ tự
                  key={`cell-${i}`}
                  className={
                    d === day
                      ? "flex aspect-square items-center justify-center rounded-full bg-[#D9667F] font-semibold text-white"
                      : "flex aspect-square items-center justify-center"
                  }
                >
                  {d ?? ""}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
