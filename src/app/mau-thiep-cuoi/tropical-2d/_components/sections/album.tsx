"use client";

import { useRef } from "react";
import { GiftButton } from "@/kit/gift";
import { useGSAP } from "@/kit/gsap";
import { fadeUp } from "@/kit/presets";
import { WaveBand } from "../decor";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

// C8 + C14 + C10 · Dải ảnh kỷ niệm, QR mừng cưới và lời cảm ơn bên sóng (spec §5).
export function AlbumSection({ images }: { images: string[] }) {
  const host = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(host.current, () => {
        const tl = fadeUp(".ab-item", { stagger: 0.1 });
        return () => {
          tl.kill();
        };
      });
    },
    { scope: host },
  );

  return (
    <section
      ref={host}
      aria-label="Album ảnh và lời cảm ơn"
      className="relative px-3 py-24"
    >
      <div className="mx-auto flex w-[min(92vw,540px)] flex-col gap-8">
        <div>
          <p className={`${t.script} text-center text-[28px] text-[#1F7F74]`}>
            Những chuyến biển của chúng mình
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={500}
                alt={`Ảnh kỷ niệm ${i + 1}`}
                className={`ab-item aspect-4/5 w-full rounded-2xl bg-white object-cover p-1.5 shadow-[0_14px_30px_-14px_rgba(31,127,116,0.4)] ${
                  i % 2 ? "lg:translate-y-4" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`${t.island} ab-item relative overflow-hidden px-6 py-12 text-center`}
        >
          <WaveBand className="absolute -bottom-2 left-0 h-20 w-[200%] opacity-25" />
          <p className={`${t.label} ${t.soft}`}>Món quà cho hai đứa</p>
          <h2
            className={`${t.script} mt-2 text-[30px] text-[#1F7F74] lg:text-[38px]`}
          >
            Lời cảm ơn
          </h2>
          <p className="mt-3">
            Vinh dự lớn nhất của hai đứa là được đón bạn trên bãi biển ngày hôm
            ấy.
          </p>
          <GiftButton className={`${t.btn} mt-7`} label="Gửi quà mừng" />
        </div>
      </div>
    </section>
  );
}
