"use client";

import { useRef, useState } from "react";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { BulbString, Sign } from "../art";
import { t } from "../tokens";

export function Rsvp() {
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [sent, setSent] = useState<string | null>(null);
  return (
    <section className="px-4 py-16">
      <Sign className="ml-10 w-[min(calc(100%-2.5rem),30rem)] lg:mx-auto">
        <h2 className={`${t.script} text-[44px]`}>Xác nhận tham dự</h2>
        {sent ? (
          <p className="mt-4 text-[19px]" aria-live="polite">
            Cảm ơn {sent}! Hẹn gặp bạn dưới dây đèn.
          </p>
        ) : (
          <form
            className="mt-4 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) setSent(name.trim());
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-[15px] font-semibold">Tên của bạn</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoComplete="name"
                placeholder="Trần Minh Khang"
                className="h-12 rounded-lg bg-white/70 px-4 ring-1 ring-[#8A6440]/40 outline-none placeholder:text-[#6E5A48]/75 focus:ring-2 focus:ring-[#8A6440]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  [true, "Sẽ đến"],
                  [false, "Tiếc quá, bận rồi"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={going === v}
                  onClick={() => setGoing(v)}
                  className="min-h-12 rounded-lg px-3 text-[15px] ring-1 ring-[#8A6440]/40 aria-pressed:bg-[#3B2A1E] aria-pressed:text-[#F4EAD9]"
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="submit" disabled={!name.trim()} className={t.btn}>
              Gửi xác nhận
            </button>
          </form>
        )}
      </Sign>
    </section>
  );
}

export function Gift() {
  return (
    <section className="px-4 py-16">
      <Sign className="ml-10 w-[min(calc(100%-2.5rem),30rem)] lg:mx-auto">
        <div className="text-center">
          <h2 className={`${t.script} text-[44px]`}>Mừng cưới</h2>
          <p className={`mt-2 ${t.soft}`}>
            Nếu không thể đến chung vui, bạn có thể gửi lời chúc và quà mừng tại
            đây. Hai đứa trân trọng lắm.
          </p>
          <div className="mt-6 flex justify-center">
            <GiftButton
              className={`${t.btn} pl-2 [&>span]:rounded-md [&>span]:bg-[#3B2A1E] [&>span]:text-[#FFD68A]`}
            />
          </div>
        </div>
      </Sign>
    </section>
  );
}

// C10 · Tắt đèn: các bóng tắt dần từ ngoài vào giữa theo cuộn, lời cảm ơn vẫn sáng.
export function LightsOff({
  couple,
  img,
  onView,
}: {
  couple: string;
  img?: string;
  onView: () => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 40%",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
      tl.to("[data-glow]", {
        opacity: 0,
        scale: 0.4,
        stagger: { each: 0.1, from: "edges" },
      })
        .to(
          "[data-glass]",
          {
            backgroundColor: "#4A3A2A",
            boxShadow: "none",
            stagger: { each: 0.1, from: "edges" },
          },
          0,
        )
        .to("[data-dim]", { opacity: 0.7 }, 0);
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section ref={scope} className="relative min-h-[130svh] px-6 pt-8 pb-40">
      <div
        data-dim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#1E1510] opacity-0"
      />
      <BulbString className="relative mx-auto max-w-3xl" />
      <div className="relative mx-auto mt-10 flex max-w-xl flex-col items-center text-center">
        {img && (
          <button
            type="button"
            onClick={onView}
            aria-label="Xem lớn ảnh cuối"
            className="w-[min(72vw,340px)] rotate-2 bg-[#FBF5EA] p-2.5 pb-10 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={img}
              alt={couple}
              className="aspect-[4/5] w-full object-cover"
            />
          </button>
        )}
        <p
          className={`${t.script} mt-12 text-[48px] text-[#FFD68A] sm:text-[64px]`}
        >
          Cảm ơn bạn
        </p>
        <p className="mt-3 max-w-[34ch] text-[#F4EAD9]/90">
          Đèn có thể tắt, nhưng niềm vui được bạn chung vui thì hai đứa giữ mãi.
          Hẹn gặp bạn ở buổi tiệc.
        </p>
        <p className={`${t.script} mt-8 text-[40px] text-balance break-words`}>
          {couple}
        </p>
      </div>
    </section>
  );
}
