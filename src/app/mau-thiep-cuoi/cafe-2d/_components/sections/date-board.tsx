"use client";

import { useCountdown } from "@/kit/countdown";
import { Countdown } from "@/kit/countdown-ui";
import { formatWeekday } from "@/kit/dates";
import { Tape } from "../art";
import { dayParts, monthCells, orderNo, scheduleFrom } from "../cafe-time";
import { t } from "../tokens";

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C5 + C11 · Tờ lịch dán lên bảng phấn, lịch tháng khoanh ngày cưới, đếm ngược.
// C12 · Phiếu order kẹp gỗ: lịch trình buổi tiệc.
export function DateBoard({ date }: { date: Date }) {
  const { day, month, year } = dayParts(date);
  const cells = monthCells(date);
  const past = useCountdown(date)?.done ?? false;

  return (
    <section className="mx-auto grid w-[min(94vw,1080px)] gap-14 py-20 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-12">
      <div data-rise className={`${t.board} px-6 py-10 sm:px-10`}>
        <h2 className={`${t.chalk} text-[30px] sm:text-[38px]`}>
          Hẹn nhau ngày
        </h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-center">
          <div
            className={`${t.latte} relative mx-auto w-44 -rotate-3 px-4 pt-5 pb-4 text-center`}
          >
            <Tape />
            <p className={`${t.label} ${t.soft}`}>Tháng {month}</p>
            <p className="font-(family-name:--font-display) text-[84px] leading-none tabular-nums">
              {day}
            </p>
            <p className={`${t.label} ${t.soft} capitalize`}>
              {formatWeekday(date)}
            </p>
          </div>
          <div>
            <p className={`${t.chalkY} text-[20px]`}>
              Tháng {month}, {year}
            </p>
            <div
              className={`${t.chalk} mt-3 grid grid-cols-7 gap-y-1.5 text-center text-[17px]`}
            >
              {WEEK.map((w) => (
                <span key={w} className="text-[14px] text-[#F2EEE3]/60">
                  {w}
                </span>
              ))}
              {cells.map((c, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
                  key={i}
                  className={`relative flex h-9 items-center justify-center tabular-nums ${c === day ? "text-[#E9C46A]" : ""}`}
                >
                  {c ?? ""}
                  {c === day && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 40 40"
                      className="absolute inset-0 m-auto size-10"
                    >
                      <path
                        data-draw
                        d="M20 4 C 32 3 37 12 36 21 C 35 31 27 37 19 36 C 9 35 3 28 4 18 C 5 10 12 5 23 6"
                        fill="none"
                        stroke="#E9C46A"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-dashed border-[#F2EEE3]/20 pt-8">
          {past ? (
            <p className={`${t.chalkY} text-[24px]`}>
              Tụi mình đã về chung nhà rồi.
            </p>
          ) : (
            <>
              <p className={`${t.chalk} text-[20px]`}>Còn lại</p>
              <Countdown
                date={date}
                className="mt-3 font-(family-name:--font-display) text-[#E9C46A]"
              />
            </>
          )}
        </div>
      </div>

      <div
        data-rise
        className="relative mx-auto w-[min(88vw,380px)] rotate-1 lg:mt-24"
      >
        {/* kẹp gỗ */}
        <span
          aria-hidden
          className="absolute -top-5 left-1/2 z-10 h-10 w-16 -translate-x-1/2 rounded-md bg-[linear-gradient(180deg,#A67B52,#7C5634)] shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
        />
        <div
          className={`${t.latte} px-6 pt-10 pb-7 [mask-image:radial-gradient(circle_at_8px_100%,transparent_7px,#000_7.5px)] [mask-position:0_0] [mask-size:16px_100%]`}
        >
          <div className="flex items-baseline justify-between">
            <h2 className="font-(family-name:--font-display) text-[26px]">
              Order #{orderNo(date)}
            </h2>
            <span className={`${t.label} ${t.soft}`}>Bàn thân</span>
          </div>
          <ul className="mt-5 divide-y divide-dashed divide-[#2B1D14]/15">
            {scheduleFrom(date).map((s) => (
              <li key={s.label} className="flex items-center gap-4 py-3">
                <span className="w-14 font-medium tabular-nums">{s.time}</span>
                <span className="flex-1">{s.label}</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
                  <path
                    data-draw
                    d="M3 11 L8 15 L17 4"
                    fill="none"
                    stroke="#6F4A2F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-(family-name:--font-display) text-[18px] text-[#6F4A2F]">
            Ghi chú: ít đá, nhiều yêu thương.
          </p>
        </div>
      </div>
    </section>
  );
}
