"use client";

import { useEffect, useState } from "react";

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

export function remaining(target: Date, now = Date.now()): Remaining {
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  };
}

// null trong lần render đầu (tránh lệch hydration), sau đó cập nhật mỗi giây.
export function useCountdown(target: Date) {
  const [r, setR] = useState<Remaining | null>(null);
  const t = target.getTime();
  useEffect(() => {
    const tick = () => setR(remaining(new Date(t)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [t]);
  return r;
}
