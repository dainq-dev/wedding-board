"use client";

import { useEffect, useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { GiftButton } from "@/kit/gift";
import { gsap } from "@/kit/gsap";
import { particles } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { Cloud, CornerOrnament } from "../decor";
import { t } from "../tokens";

// C7 + C8 + C14 + C10 · Bản đồ khung mây, lưới ảnh khung vàng, QR mừng cưới,
// lời cảm ơn kèm pháo giấy đỏ (spec §4).
export function FinaleSection({
  venue,
  images,
}: {
  venue: WeddingData["venue"];
  images: string[];
}) {
  const section = useRef<HTMLElement>(null);
  const confetti = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = confetti.current;
    if (reduced || !host) return;
    const fx = particles({
      parent: host,
      count: 26,
      colors: ["#D4A24C", "#F1D08A", "#9B1B1E"],
      size: [5, 10],
      fall: true,
    });
    return () => fx.kill();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".sh-photo", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: section.current, start: "top 72%" },
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      aria-label="Địa điểm, album và lời cảm ơn"
      className="relative flex min-h-[100svh] flex-col items-center justify-center py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.card} relative px-6 py-10`}>
          <Cloud className="absolute -top-6 left-6 w-20 text-[#D4A24C]/50" />
          <p className={`${t.title} text-center !text-[20px] lg:!text-[26px]`}>
            Địa điểm tổ chức
          </p>
          <MapEmbed
            venue={venue}
            className="mt-5 h-72 w-full rounded-lg border border-[#D4A24C]/60"
          />
          <p className={`${t.soft} mt-4 text-center text-[15px]`}>
            {venue.name ?? "Nhà hàng tiệc cưới"}
          </p>
        </div>

        <div className={`${t.card} px-6 py-10`}>
          <p className={`${t.title} text-center !text-[20px] lg:!text-[26px]`}>
            Khoảnh khắc
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={500}
                alt={`Ảnh cưới ${i + 1}`}
                className="sh-photo aspect-4/5 w-full rounded border border-[#D4A24C]/70 object-cover"
              />
            ))}
          </div>
        </div>

        <div
          className={`${t.card} relative overflow-hidden px-6 py-12 text-center`}
        >
          <div
            ref={confetti}
            className="pointer-events-none absolute inset-0"
          />
          <CornerOrnament className="absolute top-4 left-4 size-8 text-[#D4A24C]" />
          <CornerOrnament className="absolute right-4 bottom-4 size-8 -scale-100 text-[#D4A24C]" />
          <p className={`${t.title} !text-[22px] lg:!text-[28px]`}>Lời cảm ơn</p>
          <p className={`${t.soft} mt-4`}>
            Cảm ơn quý khách đã đến chung vui cùng gia đình chúng tôi.
          </p>
          <GiftButton className={`${t.btn} mt-8`} label="Gửi lời chúc mừng" />
        </div>
      </div>
    </section>
  );
}
