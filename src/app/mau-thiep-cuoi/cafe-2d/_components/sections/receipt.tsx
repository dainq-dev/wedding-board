"use client";

import { useRef, useState } from "react";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { orderNo } from "../cafe-time";
import { t } from "../tokens";

const EDGE =
  "[mask-image:radial-gradient(circle_at_8px_0,transparent_7px,#000_7.5px),radial-gradient(circle_at_8px_100%,transparent_7px,#000_7.5px)] [mask-composite:intersect] [mask-size:16px_100%]";

// C14 + C15 · Hoá đơn: gọi món = xác nhận tham dự (không gửi đi đâu), thanh toán = gửi lời chúc.
export function Receipt({ date }: { date: Date }) {
  const scope = useRef<HTMLElement>(null);
  const printed = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [going, setGoing] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [done, setDone] = useState<string | null>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-paper]",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope, dependencies: [reduced] },
  );

  useGSAP(
    () => {
      if (!done || !printed.current || reduced) return;
      gsap.from(printed.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.9,
        ease: "steps(24)",
      });
    },
    { dependencies: [done, reduced] },
  );

  const line = (a: string, b: string) => (
    <div className="flex items-baseline gap-2">
      <span>{a}</span>
      <span
        aria-hidden
        className="flex-1 border-b border-dotted border-[#2B1D14]/30"
      />
      <span className="font-medium tabular-nums">{b}</span>
    </div>
  );

  return (
    <section ref={scope} className="mx-auto w-[min(92vw,440px)] py-20">
      <div
        data-paper
        className={`${t.latte} ${EDGE} rounded-none px-6 py-10 sm:px-8`}
      >
        <p className="text-center font-(family-name:--font-display) text-[30px] leading-tight">
          Cà phê Hạnh Phúc
        </p>
        <p className={`mt-1 text-center ${t.label} ${t.soft}`}>
          Hoá đơn #{orderNo(date)}
        </p>
        <hr className="my-6 border-dashed border-[#2B1D14]/25" />

        {done ? (
          <div aria-live="polite">
            <p
              ref={printed}
              className="font-(family-name:--font-display) text-[20px] leading-snug"
            >
              {going === "yes"
                ? `${guests} ly hạnh phúc cho ${done}. Hẹn gặp ở tiệc cưới!`
                : `Cảm ơn ${done}, quán giữ phần cho bạn dịp khác.`}
            </p>
            <button
              type="button"
              onClick={() => setDone(null)}
              className={`mt-3 min-h-11 text-[14px] underline underline-offset-4 ${t.soft}`}
            >
              Sửa lại
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) setDone(name.trim());
            }}
            className="grid gap-4"
          >
            <label className="grid gap-1.5">
              <span className="text-[14px] font-medium">Tên khách</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoComplete="name"
                placeholder="Nguyễn Hoài Thương"
                className="h-12 rounded-xl bg-white/70 px-4 ring-1 ring-[#2B1D14]/15 outline-none placeholder:text-[#6A5646]/70 focus:ring-2 focus:ring-[#6F4A2F]"
              />
            </label>
            <fieldset className="grid gap-2">
              <legend className="mb-1.5 text-[14px] font-medium">
                Bạn sẽ ghé chứ?
              </legend>
              {(
                [
                  ["yes", "Sẽ ghé quán"],
                  ["no", "Hẹn dịp khác"],
                ] as const
              ).map(([v, label]) => (
                <label
                  key={v}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 ring-1 ring-[#2B1D14]/12 has-checked:bg-[#6F4A2F] has-checked:text-[#F5ECD9]"
                >
                  <input
                    type="radio"
                    name="going"
                    value={v}
                    checked={going === v}
                    onChange={() => setGoing(v)}
                    className="accent-[#E9C46A]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {going === "yes" && (
              <label className="flex items-center justify-between gap-4">
                <span className="text-[14px] font-medium">Số người</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-11 rounded-xl bg-white/70 px-3 ring-1 ring-[#2B1D14]/15"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button
              type="submit"
              disabled={!name.trim()}
              className={`${t.btn} mt-1 w-full`}
            >
              Gọi món
            </button>
          </form>
        )}

        <hr className="my-6 border-dashed border-[#2B1D14]/25" />
        <div className="grid gap-2 text-[15px]">
          {line("Tạm tính", "0 đ")}
          {line("Lời chúc", "vô giá")}
        </div>
        <p className={`mt-5 text-center text-[14px] ${t.soft}`}>
          Quán không tính tiền, chỉ nhận lời chúc.
        </p>
        <div className="mt-5 flex justify-center">
          <GiftButton className="inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-[#2B1D14] py-2 pr-6 pl-2 text-[15px] font-medium text-[#F5ECD9] shadow-[0_14px_30px_-14px_rgba(43,29,20,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6F4A2F] [&>span]:rounded-lg [&>span]:bg-[#C58B4E] [&>span]:text-[#2B1D14]" />
        </div>
      </div>
    </section>
  );
}
