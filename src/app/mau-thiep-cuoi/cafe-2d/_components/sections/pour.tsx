"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Wave } from "../art";
import { t } from "../tokens";

/** Rót đầy toàn màn hình một lần ngay sau khi mở thiệp, rồi tự gỡ. */
export function PourOnce({ play }: { play: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!play || !el.current) return;
      if (reduced) {
        setDone(true);
        return;
      }
      gsap
        .timeline({
          defaults: { ease: "power1.inOut" },
          onComplete: () => setDone(true),
        })
        .fromTo(el.current, { yPercent: 110 }, { yPercent: 0, duration: 0.75 })
        .to("[data-pour-latte]", { opacity: 1, duration: 0.25 })
        .to(el.current, { yPercent: -115, duration: 0.6 }, "+=0.05");
      gsap.to("[data-pour-wave]", {
        x: "-50%",
        duration: 2.4,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: el, dependencies: [play, reduced] },
  );

  if (!play || done) return null;
  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 translate-y-[110%] bg-[#6F4A2F]"
    >
      <div
        data-pour-wave
        className="absolute inset-x-0 bottom-full h-12 w-[200%]"
      >
        <Wave fill="#6F4A2F" />
      </div>
      <div
        data-pour-latte
        className="absolute inset-0 bg-[#C9A27E] opacity-0"
      />
    </div>
  );
}

/** Chuyển chương: lớp cà phê/sữa dâng theo cuộn, tên chương viết phấn nổi trên. */
export function Chapter({
  title,
  line,
  tone,
}: {
  title: string;
  line: string;
  tone: "coffee" | "latte";
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fill = tone === "coffee" ? "#6F4A2F" : "#E7D5B8";

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-liquid]",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            end: "center 45%",
            scrub: 0.6,
          },
        },
      );
      gsap.to("[data-wave]", {
        x: "-50%",
        duration: 4,
        ease: "none",
        repeat: -1,
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden px-6"
    >
      <div
        data-liquid
        aria-hidden
        className="absolute inset-x-0 top-[18%] bottom-0"
        style={{ backgroundColor: fill }}
      >
        <div data-wave className="absolute inset-x-0 bottom-full h-10 w-[200%]">
          <Wave fill={fill} />
        </div>
      </div>
      <div className="relative text-center">
        <h2
          className={`${tone === "coffee" ? t.chalk : "font-(family-name:--font-display) text-[#2B1D14]"} text-[40px] leading-tight sm:text-[56px]`}
        >
          {title}
        </h2>
        <p
          className={`mt-2 text-[15px] ${tone === "coffee" ? "text-[#F2EEE3]/85" : "text-[#4A3526]"}`}
        >
          {line}
        </p>
      </div>
    </section>
  );
}
