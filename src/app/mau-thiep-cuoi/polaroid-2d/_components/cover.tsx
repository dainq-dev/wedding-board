"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { float } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Polaroid } from "./polaroid";
import { Heart, Washi } from "./svg/marks";
import { t } from "./tokens";

// C1: bìa sổ vải + nhãn tên dán lệch. Bấm (điểm nào cũng được — OpenGate)
// → nhạc phát + bìa lật rotateY quanh mép trái (T7) rồi overlay tự ẩn.
export function Cover({ onOpened }: { onOpened: () => void }) {
  const { data } = useWedding();
  const reduced = useReducedMotion();
  const gate = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const heart = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (reduced) {
        gsap.set(book.current, { rotate: -1.5 });
        gsap.set(label.current, { rotate: -3 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "back.out(1.7)" } })
        .fromTo(
          book.current,
          { y: -40, rotate: -4, opacity: 0 },
          { y: 0, rotate: -1.5, opacity: 1, duration: 0.7 },
        )
        .fromTo(
          label.current,
          { scale: 1.2, rotate: -6, opacity: 0 },
          { scale: 1, rotate: -3, opacity: 1, duration: 0.3 },
          0.5,
        )
        .fromTo(
          heart.current,
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(3)" },
          0.8,
        );
      if (btn.current) float(btn.current, { y: 5, rotation: 0, duration: 2 });
    },
    { scope: gate, dependencies: [reduced] },
  );

  const open = contextSafe(() => {
    onOpened();
    if (reduced || !book.current || !cover.current) return;
    // Nén vào 0.8s cho khớp thời gian OpenGate tự fade overlay.
    gsap
      .timeline()
      .to(book.current, { rotate: 0, duration: 0.15, ease: "power2.out" })
      .to(
        cover.current,
        { rotateY: -180, duration: 0.6, ease: "power2.inOut" },
        0.15,
      );
  });

  return (
    <div ref={gate}>
      <OpenGate onOpen={open} className="!bg-[#E7DDCB]">
        <div ref={book} className="relative [perspective:1600px]">
          <div className="relative h-[min(72svh,540px)] w-[min(82vw,400px)]">
            <div
              ref={cover}
              className="absolute inset-0 origin-left [transform-style:preserve-3d]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[0.125rem] bg-[#4F6B5A] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0_6px,transparent_6px_12px)] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.65)] [backface-visibility:hidden]">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-3 bg-[#3B5244]"
                />
                <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
                  <div
                    ref={label}
                    className="max-w-[88%] rounded-[2px] bg-white px-5 py-3 text-center shadow-[0_8px_16px_-8px_rgba(0,0,0,0.45)]"
                  >
                    <p
                      className={`${t.hand} text-[30px] leading-[1.15] break-words text-[#3D405B]`}
                    >
                      {data.groom.name}{" "}
                      <span className="text-[#E07A5F]">&</span>{" "}
                      {data.bride.name}
                    </p>
                  </div>
                  <div ref={heart} className="text-[#E07A5F]">
                    <Heart className="size-10" />
                  </div>
                  <button ref={btn} type="button" className={t.btn}>
                    Mở sổ ra xem ✎
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[0.125rem] bg-[#F4EFE6] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className={`${t.hand} text-center text-[22px]`}>
                  Sổ này của hai đứa mình ♥
                </p>
                <div className="relative">
                  <Washi className="absolute -top-2 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-6" />
                  <Polaroid
                    src={data.images[0]}
                    alt="Ảnh hai đứa mình dán trong trang đầu sổ"
                    caption="Ngày mình bắt đầu"
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </OpenGate>
    </div>
  );
}
