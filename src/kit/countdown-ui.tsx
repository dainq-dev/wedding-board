"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { type Remaining, useCountdown } from "./countdown";

const UNITS = [
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
] as const;

// Ngày có thể 3 số nên chỉ pad tối thiểu 2, không cắt.
const pad = (n: number) => String(n).padStart(2, "0");

// A7: ô số lật rotateX 0→90→0 khi giá trị đổi (khi flip=true).
// Logic đếm lấy từ countdown.ts, giữ nguyên zero khi đã tới ngày.
export function Countdown({
  date,
  className = "",
  flip = false,
}: {
  date: Date;
  className?: string;
  flip?: boolean;
}) {
  const r = useCountdown(date);
  const reduced = useReducedMotion();
  const cells = useRef<Record<string, HTMLDivElement | null>>({});
  const prev = useRef<Remaining | null>(null);

  useEffect(() => {
    if (!r) return;
    if (prev.current && flip && !reduced) {
      for (const u of UNITS) {
        const el = cells.current[u.key];
        if (el && r[u.key] !== prev.current[u.key]) {
          gsap.to(el, {
            transformPerspective: 600,
            rotateX: 90,
            duration: 0.15,
            ease: "power1.inOut",
            yoyo: true,
            repeat: 1,
          });
        }
      }
    }
    prev.current = r;
  }, [r, flip, reduced]);

  return (
    <div
      className={`flex items-end gap-3 ${className}`}
      role="timer"
      aria-label="Thời gian còn lại tới ngày cưới"
    >
      {UNITS.map((u) => (
        <div key={u.key} className="flex flex-col items-center gap-1">
          <div
            ref={(el) => {
              cells.current[u.key] = el;
            }}
            className="flex min-w-[3.5rem] items-center justify-center rounded-lg bg-white/10 px-2 py-3 text-[1.8rem] tabular-nums"
          >
            {r ? pad(r[u.key]) : ""}
          </div>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase opacity-70">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
