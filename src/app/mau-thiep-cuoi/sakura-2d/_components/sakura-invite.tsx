"use client";

import { MapEmbed } from "@/components/map-embed";
import { GiftButton } from "@/kit/gift";
import { MusicToggle, useMusic } from "@/kit/music";
import { useWedding } from "@/wedding/wedding-data-provider";

export function SakuraInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const music = useMusic();

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-20 text-center font-serif text-rose-900">
      <MusicToggle music={music} />
      <p className="tracking-[0.3em] text-sm uppercase">Trân trọng kính mời</p>
      <h1 className="mt-6 font-(family-name:--font-script) text-5xl sm:text-7xl">
        {groom.name} <span className="text-rose-400">&</span> {bride.name}
      </h1>

      <section className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((src) => (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            key={src}
            src={src}
            alt=""
            className="aspect-3/4 w-full rounded-lg object-cover"
          />
        ))}
      </section>

      <section className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xl">Nhà trai</h2>
          <p>{groom.address}</p>
        </div>
        <div>
          <h2 className="text-xl">Nhà gái</h2>
          <p>{bride.address}</p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-4 text-xl">{venue.name ?? "Địa điểm tổ chức"}</h2>
        <MapEmbed venue={venue} className="h-72 w-full rounded-lg" />
      </section>

      <GiftButton className="mt-12 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#B4475F] py-2 pr-6 pl-2 text-white transition-[filter] hover:brightness-110" />
    </main>
  );
}
