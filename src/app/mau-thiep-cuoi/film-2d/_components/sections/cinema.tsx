"use client";

import { useRef } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useGSAP } from "@/kit/gsap";
import { fadeUp } from "@/kit/presets";
import type { WeddingData } from "@/wedding/types";
import { onceEnter } from "../reveal";
import { Clapper } from "../svg/clapper";
import { t } from "../tokens";

// C7 · Rạp chiếu: tên nhà hàng + bản đồ (filter xám trên wrapper) + nút chỉ đường.
export function Cinema({ venue }: { venue: WeddingData["venue"] }) {
  const sec = useRef<HTMLElement>(null);

  useGSAP(() => onceEnter(sec.current, () => fadeUp(".cn-item")), {
    scope: sec,
  });

  return (
    <section
      ref={sec}
      data-lb="open"
      className="flex min-h-[100svh] items-center"
    >
      <div className="mx-auto w-[min(90vw,560px)]">
        <p className={`cn-item ${t.scene} flex items-center gap-2`}>
          <Clapper /> Cảnh 06 · Địa điểm
        </p>
        <h2
          className={`cn-item ${t.display} mt-3 text-[28px] leading-tight text-[#F5F5F0] break-words`}
        >
          {venue.name ?? "Nhà hàng tiệc cưới"}
        </h2>
        <div className={`cn-item mt-5 p-1 grayscale-[0.6] ${t.frame}`}>
          <MapEmbed venue={venue} className="aspect-4/3 w-full" />
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`cn-item mt-5 w-full ${t.btn}`}
        >
          Chỉ đường tới rạp
        </a>
      </div>
    </section>
  );
}
