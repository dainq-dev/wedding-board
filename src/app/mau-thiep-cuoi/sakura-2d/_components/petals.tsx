"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { densityCount } from "./density";

const MAX = 30;

// A8 · Cánh hoa rơi toàn trang, mật độ tăng dần theo tiến độ cuộn (spec §5).
// Reduced-motion: không dựng hạt nào.
export function Petals() {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = host.current;
    if (reduced || !el) return;

    const petals = Array.from({ length: MAX }, () => {
      const p = document.createElement("span");
      p.className =
        "absolute top-0 block size-3 rounded-[60%_40%_60%_40%] bg-[#F4B6C2] will-change-transform";
      el.append(p);
      return p;
    });

    const rnd = (min: number, max: number) => () => gsap.utils.random(min, max);
    gsap.set(petals, { left: rnd(0, 100), y: -30, autoAlpha: 0 });

    const tweens = petals.map((p) =>
      gsap.to(p, {
        y: () => window.innerHeight + 40,
        x: rnd(-90, 90),
        rotation: rnd(180, 540),
        duration: rnd(7, 13),
        delay: rnd(0, 12)() * -1,
        repeat: -1,
        ease: "none",
        onRepeat: () => gsap.set(p, { left: `${gsap.utils.random(0, 100)}%` }),
      }),
    );

    const apply = (progress: number) => {
      const want = densityCount(progress);
      petals.forEach((p, i) => {
        gsap.set(p, { autoAlpha: i < want ? 0.7 : 0, overwrite: "auto" });
      });
    };
    apply(0);

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => apply(self.progress),
    });

    return () => {
      st.kill();
      for (const t of tweens) t.kill();
      for (const p of petals) p.remove();
    };
  }, [reduced]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    />
  );
}
