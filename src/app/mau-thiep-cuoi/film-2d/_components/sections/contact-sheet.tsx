"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

// C8 · Contact sheet: lưới 3 cột ảnh xám, ô 5 được khoanh vàng; bấm → lightbox màu gốc.
export function ContactSheet({ images }: { images: (string | undefined)[] }) {
  const sec = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  useScrollLock(open !== null);

  useGSAP(
    () => {
      gsap.set(".cs-flash", { opacity: 0.8 });
      onceEnter(sec.current, () =>
        gsap.to(".cs-flash", { opacity: 0, stagger: 0.06, duration: 0.6 }),
      );
    },
    { scope: sec },
  );

  const shots = images.filter((s): s is string => !!s);

  return (
    <section
      ref={sec}
      data-lb="open"
      className="flex min-h-[140svh] items-center"
    >
      <div className="mx-auto w-[min(90vw,560px)]">
        <p className={t.scene}>Contact sheet · Cuộn 01</p>
        <div className="mt-5 grid grid-cols-3 gap-2 bg-[#1A1A1A] p-2">
          {shots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(src)}
              aria-label={`Xem ảnh ${i + 1}`}
              className="relative cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#C9A227]"
            >
              {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
              <img
                src={src}
                alt=""
                className={`aspect-3/2 w-full ${t.photo}`}
              />
              <span
                aria-hidden
                className="cs-flash absolute inset-0 bg-white"
              />
              {i === 4 && (
                <span
                  aria-hidden
                  className="absolute -inset-1 rounded-[50%] border-2 border-[#C9A227]"
                />
              )}
              <span className="mt-1 block text-[10px] text-[#A3A39C]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(null)}
          aria-label="Đóng ảnh"
          className="fixed inset-0 z-40 flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={open}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </button>
      )}
    </section>
  );
}
