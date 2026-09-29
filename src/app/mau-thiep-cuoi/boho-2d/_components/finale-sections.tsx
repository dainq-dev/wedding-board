"use client";

import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import type { WeddingData } from "@/wedding/types";
import { Arch, ArchImage } from "./arch";
import { Sun } from "./art";

const DRESS_TONES = [
  ["Kem", "#FFFAF3"],
  ["Be", "#E8D8BF"],
  ["Đất nung", "#C0673E"],
  ["Olive", "#8A9A5B"],
  ["Nâu", "#4A3426"],
] as const;

export function Venue({ data }: { readonly data: WeddingData }) {
  const destination = `https://www.google.com/maps/dir/?api=1&destination=${data.venue.lat},${data.venue.lng}`;
  return (
    <section className="flex min-h-[120svh] items-center justify-center px-5 py-24">
      <Arch className="w-[min(90vw,590px)] px-5 pt-20 pb-7 text-center sm:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#9C4F2C] uppercase">
          Đường tới tiệc
        </p>
        <h2 className="mt-4 font-(family-name:--font-boho-display) text-4xl text-[#9C4F2C]">
          {data.venue.name || "Tiệc cưới"}
        </h2>
        <MapEmbed
          venue={data.venue}
          className="mt-7 aspect-[4/5] w-full rounded-t-[120px] border border-[#E8D8BF]"
        />
        <a
          href={destination}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#9C4F2C] px-7 text-sm font-semibold tracking-[0.15em] text-[#FFFAF3] uppercase transition-colors hover:bg-[#7F3F22] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9C4F2C]"
        >
          Chỉ đường
        </a>
      </Arch>
    </section>
  );
}

export function DressCode() {
  return (
    <section className="flex min-h-[65svh] items-center justify-center px-5 py-16 text-center">
      <Arch className="w-[min(88vw,540px)] px-7 pt-20 pb-12">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#9C4F2C] uppercase">
          Dress code
        </p>
        <h2 className="mt-4 font-(family-name:--font-boho-display) text-4xl text-[#9C4F2C]">
          Mặc gì cũng được,
          <br />
          miễn là tông đất nhé!
        </h2>
        <div className="mt-8 grid grid-cols-5 gap-2">
          {DRESS_TONES.map(([name, color]) => (
            <div key={name}>
              <span
                className="mx-auto block size-9 rounded-full border border-[#4A3426]/15 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.25)]"
                style={{ backgroundColor: color }}
              />
              <p className="mt-2 text-[10px] leading-3 text-[#7D6553]">
                {name}
              </p>
            </div>
          ))}
        </div>
      </Arch>
    </section>
  );
}

export function Album({ images }: { readonly images: readonly string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const ordered = [
    images[0],
    images[3],
    images[4],
    images[5],
    images[1],
    images[2],
    ...images.slice(6),
  ].filter((src): src is string => Boolean(src));
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <div className="mb-9 text-center text-[#FFFAF3]">
        <p className="text-xs font-semibold tracking-[0.28em] uppercase">
          Album
        </p>
        <h2 className="mt-3 font-(family-name:--font-boho-display) text-4xl">
          Những ngày nắng đẹp
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ordered.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelected(src)}
            className={`${index % 3 === 1 ? "mt-10" : ""} overflow-hidden rounded-t-[999px] border-2 border-[#E8D8BF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFAF3]`}
          >
            <ArchImage src={src} alt={`Khoảnh khắc cưới ${index + 1}`} />
          </button>
        ))}
      </div>
      {selected && (
        <dialog
          open
          className="fixed inset-0 z-40 m-0 grid h-full max-h-none w-full max-w-none place-items-center bg-[#4A3426]/90 p-5"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 min-h-11 rounded-full bg-[#FFFAF3] px-5 text-sm font-semibold text-[#9C4F2C]"
          >
            Đóng
          </button>
          {/* biome-ignore lint/performance/noImgElement: wedding images may be blob URLs from the trial form */}
          <img
            src={selected}
            alt="Ảnh cưới phóng lớn"
            className="max-h-[82svh] max-w-full rounded-t-[180px] border-4 border-[#E8D8BF] object-contain"
          />
        </dialog>
      )}
    </section>
  );
}

export function ReplyAndThanks({ data }: { readonly data: WeddingData }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const photo = data.images.at(-1);
  return (
    <section className="px-5 pt-16 pb-28">
      <div className="mx-auto grid max-w-2xl gap-8">
        <Arch className="px-7 pt-18 pb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#9C4F2C] uppercase">
            Quà mừng cưới
          </p>
          <p className="mt-5 text-[#7D6553]">
            Sự hiện diện của bạn là món quà quý giá nhất.
          </p>
          <div className="mx-auto mt-7 grid size-28 grid-cols-5 gap-1 rounded-lg bg-[#4A3426] p-2">
            {Array.from({ length: 25 }, (_, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: danh sách trang trí tĩnh, không đổi thứ tự
                key={index}
                className={index % 3 === 0 ? "bg-[#FFFAF3]" : "bg-[#C0673E]"}
              />
            ))}
          </div>
        </Arch>
        <Arch className="px-7 pt-18 pb-10">
          <p className="text-center text-xs font-semibold tracking-[0.28em] text-[#9C4F2C] uppercase">
            Bạn sẽ đến chứ?
          </p>
          {sent ? (
            <p className="mt-7 text-center font-(family-name:--font-boho-display) text-3xl text-[#9C4F2C]">
              Cảm ơn {name || "bạn"}! Hẹn gặp dưới nắng.
            </p>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="mt-6 grid gap-4"
            >
              <label className="grid gap-2 text-sm text-[#7D6553]">
                Tên của bạn
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-11 rounded-full border border-[#E8D8BF] bg-white px-5 text-[#4A3426] outline-none focus:border-[#9C4F2C]"
                />
              </label>
              <label className="flex min-h-11 items-center gap-3 text-sm text-[#4A3426]">
                <input type="radio" name="attendance" defaultChecked /> Có, nhất
                định!
              </label>
              <label className="flex min-h-11 items-center gap-3 text-sm text-[#4A3426]">
                <input type="radio" name="attendance" /> Tiếc quá, không thể đến
              </label>
              <button
                type="submit"
                className="min-h-11 rounded-full bg-[#9C4F2C] px-6 text-sm font-semibold tracking-[0.16em] text-[#FFFAF3] uppercase"
              >
                Gửi xác nhận
              </button>
              <p className="text-center text-xs text-[#7D6553]">
                Bản xem thử, thông tin không được gửi đi.
              </p>
            </form>
          )}
        </Arch>
      </div>
      <div className="mx-auto mt-28 max-w-xl text-center text-[#FFFAF3]">
        {photo && (
          <Arch className="mx-auto w-[min(78vw,370px)]">
            <ArchImage src={photo} alt="Khoảnh khắc cuối ngày" />
          </Arch>
        )}
        <Sun className="mx-auto mt-10 size-16 text-[#E8D8BF]" />
        <h2 className="mt-6 font-(family-name:--font-boho-display) text-4xl">
          Cảm ơn bạn đã đến và làm ngày của chúng mình trọn vẹn.
        </h2>
        <p className="mt-6 text-xl">
          {data.groom.name} &amp; {data.bride.name}
        </p>
      </div>
    </section>
  );
}
