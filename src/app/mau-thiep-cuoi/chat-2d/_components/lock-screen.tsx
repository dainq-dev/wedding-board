"use client";

import { ChatCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { useReducedMotion } from "@/kit/use-reduced-motion";

const clock = () =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
const today = () =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

// C1 · Màn hình khoá: thông báo "1 tin nhắn mới" từ cô dâu; chạm để mở và phát nhạc.
export function LockScreen({
  bride,
  cover,
  onOpen,
}: {
  bride: string;
  cover?: string;
  onOpen: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [now, setNow] = useState<{ time: string; day: string } | null>(null);

  useEffect(() => {
    const tick = () => setNow({ time: clock(), day: today() });
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (reduced) return;
      gsap
        .timeline()
        .from("[data-clock]", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
        })
        .from(
          "[data-note]",
          { y: -40, autoAlpha: 0, duration: 0.5, ease: "back.out(1.5)" },
          "+=0.2",
        )
        .to("[data-note]", {
          x: 3,
          duration: 0.05,
          repeat: 7,
          yoyo: true,
          ease: "none",
        })
        .from("[data-hint]", { autoAlpha: 0, duration: 0.5 });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <OpenGate onOpen={onOpen} className="bg-[#0B1020]">
      <div
        ref={scope}
        className="absolute inset-0 overflow-hidden bg-[#0B1020] text-white"
      >
        {cover && (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            src={cover}
            alt=""
            className="absolute inset-0 size-full scale-110 object-cover opacity-55 blur-2xl"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,32,0.35),rgba(11,16,32,0.75))]" />
        <div className="relative mx-auto flex h-full max-w-md flex-col items-center px-5 pt-[14svh]">
          <div data-clock className="text-center">
            <p className="text-[76px] leading-none font-light tracking-[-0.04em] tabular-nums">
              {now?.time ?? " "}
            </p>
            <p className="mt-2 text-[16px] font-medium text-white/85 capitalize">
              {now?.day ?? " "}
            </p>
          </div>
          <button
            data-note
            type="button"
            aria-label="Mở thiệp mời"
            className="mt-[10svh] w-full rounded-[22px] bg-white/75 p-4 text-left text-[#0F172A] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform active:scale-[0.97]"
          >
            <span className="flex items-center gap-2 text-[12px] font-bold tracking-[0.06em] text-[#475569] uppercase">
              <span className="flex size-5 items-center justify-center rounded-md bg-[#D93A6A] text-white">
                <ChatCircleIcon weight="fill" className="size-3.5" />
              </span>
              Thương
              <span className="ml-auto font-medium normal-case tracking-normal">
                bây giờ
              </span>
            </span>
            <span className="mt-2 block truncate text-[15px] font-bold">
              {bride}
            </span>
            <span className="block text-[15px] text-[#334155]">
              Anh ơi, mình cưới nhé? Thiệp mời đây.
            </span>
          </button>
          <p data-hint className="mt-auto mb-[6svh] text-[13px] text-white/80">
            Chạm vào thông báo để mở
          </p>
          <span
            aria-hidden="true"
            className="mb-3 h-1.5 w-32 rounded-full bg-white/70"
          />
        </div>
      </div>
    </OpenGate>
  );
}
