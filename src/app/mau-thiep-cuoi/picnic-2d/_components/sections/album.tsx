"use client";

import { useRef } from "react";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

// C8 + C14 + C10 · Lưới ảnh dán trên khăn, QR mừng cưới, lời cảm ơn (spec §5).
export function AlbumSection({ images }: { images: string[] }) {
  const host = useRef<HTMLDivElement>(null);
  const album = useRef<HTMLElement>(null);
  const thanks = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(album.current, () => {
        const tl = gsap.timeline();
        album.current?.querySelectorAll(".al-img").forEach((el, i) => {
          tl.add(clipReveal(el), i * 0.1);
        });
      });
      onceEnter(thanks.current, () => fadeUp(".th-line", { stagger: 0.12 }));
    },
    { scope: host },
  );

  return (
    <div ref={host}>
      <section
        ref={album}
        aria-label="Album ảnh của hai đứa"
        className={`${t.checker} relative px-3 py-24`}
      >
        <div className={t.col}>
          <p className={`${t.label} text-center`}>Khách quý tự nhiên</p>
          <p className={`${t.title} mt-1 text-center`}>Ảnh hai đứa mình</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={400}
                alt={`Ảnh cưới ${i + 1} của hai đứa`}
                className={`al-img aspect-square w-full rounded-lg bg-white object-cover p-1.5 shadow-[0_14px_30px_-14px_rgba(43,45,66,0.45)] ${
                  i % 2 ? "rotate-1" : "-rotate-1"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={thanks}
        aria-label="Lời cảm ơn"
        className="relative flex min-h-[70svh] items-center justify-center px-3 py-24"
      >
        <div className={`${t.col} ${t.card} text-center`}>
          <p className="th-line text-[15px] tracking-[0.18em] text-[#B3261E] uppercase">
            Thành thật cảm ơn
          </p>
          <h2 className="th-line mt-3 font-(family-name:--font-display) text-[30px] text-[#D62828] lg:text-[40px]">
            Bạn đã đến chung vui
          </h2>
          <p className="th-line mt-3">
            Sự có mặt của bạn là món quà ngon nhất trên chiếc khăn picnic hôm
            nay.
          </p>
          <GiftButton className={`${t.btn} th-line mt-7`} />
        </div>
      </section>
    </div>
  );
}
