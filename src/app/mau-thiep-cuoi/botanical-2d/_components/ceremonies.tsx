"use client";

import type { WeddingData } from "@/wedding/types";

export function Ceremonies({
  data,
  dateLabel,
}: {
  data: WeddingData;
  dateLabel: string;
}) {
  const venue = data.venue.name ?? "Nhà hàng tiệc cưới";
  return (
    <section className="relative -mt-[14svh] min-h-[100svh] rounded-t-full bg-[#5F7A5A] px-6 pt-[24svh] pb-20 text-white">
      <div className="mx-auto w-[min(88vw,460px)] text-center">
        <p className="text-sm tracking-[0.22em] uppercase">
          Ngày vui của chúng tôi
        </p>
        <div className="mt-12 border-y border-white/25 py-9">
          <h2 className="text-2xl tracking-[0.16em] uppercase">Lễ vu quy</h2>
          <p className="mt-3 text-xl">08:00 · {dateLabel}</p>
          <p className="mt-2 text-lg italic text-white/80">Tư gia nhà gái</p>
          <p className="mt-1 break-words text-white/75">{data.bride.address}</p>
        </div>
        <div className="pt-9">
          <h2 className="text-2xl tracking-[0.16em] uppercase">Lễ thành hôn</h2>
          <p className="mt-3 text-xl">18:00 · {dateLabel}</p>
          <p className="mt-2 text-lg italic text-white/80">{venue}</p>
          <p className="mt-1 break-words text-white/75">{data.groom.address}</p>
        </div>
      </div>
    </section>
  );
}
