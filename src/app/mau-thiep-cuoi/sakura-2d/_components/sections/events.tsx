"use client";

import { MapEmbed } from "@/components/map-embed";
import type { WeddingData } from "@/wedding/types";
import { t } from "../tokens";

// C6 + C7 · Lễ gia tiên, lễ thành hôn, tiệc cưới và bản đồ nhà hàng (spec §5).
export function EventsSection({
  groomAddress,
  brideAddress,
  venue,
}: {
  groomAddress: string;
  brideAddress: string;
  venue: WeddingData["venue"];
}) {
  const events = [
    {
      time: "09:00",
      title: "Lễ gia tiên",
      where: "Tư gia nhà trai",
      address: groomAddress,
    },
    {
      time: "15:00",
      title: "Lễ thành hôn",
      where: "Tư gia nhà gái",
      address: brideAddress,
    },
    {
      time: "18:00",
      title: "Tiệc cưới",
      where: venue.name ?? "Nhà hàng",
      address: "Kính mời quý khách đến chung vui",
    },
  ];

  return (
    <section
      aria-label="Sự kiện và địa điểm"
      className="relative flex min-h-[100svh] items-center justify-center py-24"
    >
      <div className={t.col}>
        <h2 className={`${t.heading} text-center`}>Lễ và tiệc</h2>

        <div className="mt-10 flex flex-col gap-4">
          {events.map((e) => (
            <div key={e.title} className={`${t.card} flex gap-4 p-5`}>
              <p className={`${t.big} text-[26px] text-[#D9667F]`}>{e.time}</p>
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className={t.soft}>{e.where}</p>
                <p className={`mt-1 text-[15px] ${t.soft}`}>{e.address}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className={`${t.heading} text-center`}>Địa điểm tổ chức</h3>
          <MapEmbed
            venue={venue}
            className={`mt-4 h-72 w-full ${t.arch} rounded-b-2xl`}
          />
        </div>
      </div>
    </section>
  );
}
