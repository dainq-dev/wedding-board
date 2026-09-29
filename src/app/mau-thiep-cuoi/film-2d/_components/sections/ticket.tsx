"use client";

import { useRef, useState } from "react";
import { useCountdown } from "@/kit/countdown";
import { formatTime, formatWeekday, weddingDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import type { WeddingData } from "@/wedding/types";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const pad = (n: number) => String(n).padStart(2, "0");

// C5 + C6 · Vé công chiếu: ngày, giờ lễ/tiệc, đếm ngược; bấm cuống vé để "xé".
export function Ticket({ data }: { data: WeddingData }) {
  const sec = useRef<HTMLElement>(null);
  const ticket = useRef<HTMLDivElement>(null);
  const [torn, setTorn] = useState(false);
  const date = weddingDate(data);
  const left = useCountdown(date);

  useGSAP(
    () => {
      const el = ticket.current;
      if (!el) return;
      gsap.set(el, { yPercent: 100, autoAlpha: 0 });
      onceEnter(sec.current, () => {
        gsap.to(el, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power4.out",
        });
        gsap.from(".tk-line", {
          yPercent: 100,
          opacity: 0,
          stagger: 0.08,
          delay: 0.3,
          ease: "expo.out",
        });
      });
    },
    { scope: sec },
  );

  const day = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", " . ");

  return (
    <section
      ref={sec}
      data-lb="open"
      className="flex min-h-[140svh] flex-col items-center justify-center px-4"
    >
      <h2 className={`${t.heading} text-center`}>Công chiếu</h2>
      <div className="mt-8 overflow-hidden">
        <div
          ref={ticket}
          className="flex w-[min(90vw,520px)] border border-[#C9A227] bg-[#1A1A1A]"
        >
          <div className="min-w-0 flex-1 p-5">
            <p className={`tk-line ${t.label}`}>Admit one</p>
            <p className={`tk-line ${t.label} mt-3 !text-[#F5F5F0]`}>
              {formatWeekday(date)}
            </p>
            <p
              className={`tk-line ${t.display} text-[32px] leading-tight ${t.gold} lg:text-[40px]`}
            >
              {day}
            </p>
            <hr className="tk-line my-4 border-[#262626]" />
            <p className="tk-line">
              <span className={t.gold}>10:00</span> Lễ cưới
            </p>
            <p className={`tk-line ${t.soft} line-clamp-2 text-xs`}>
              {data.groom.address}
            </p>
            <p className="tk-line mt-2">
              <span className={t.gold}>{formatTime(date)}</span> Tiệc cưới
            </p>
            <p className={`tk-line ${t.soft} line-clamp-2 text-xs`}>
              {data.venue.name ?? "Nhà hàng tiệc cưới"}
            </p>
            <p className={`tk-line ${t.label} mt-4 tabular-nums`} role="timer">
              {left?.done
                ? "Đã công chiếu · Cảm ơn khán giả"
                : left
                  ? `Còn ${pad(left.days)}:${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}`
                  : " "}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTorn((v) => !v)}
            aria-label={torn ? "Gắn lại cuống vé" : "Xé cuống vé"}
            aria-pressed={torn}
            className={`flex w-14 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 border-l border-dashed border-[#C9A227]/60 font-(family-name:--font-display) text-sm text-[#C9A227] transition-transform duration-300 ${torn ? "translate-x-3 rotate-[8deg]" : ""}`}
          >
            {"ADMIT1".split("").map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: chuỗi tĩnh
              <span key={i}>{c}</span>
            ))}
          </button>
        </div>
      </div>
    </section>
  );
}
