"use client";

import { useState } from "react";
import { Lotus, NonLaFrame } from "./art";

const panel =
  "rounded-2xl border border-[#C9A0DC]/45 bg-white/80 p-6 shadow-[0_20px_42px_-36px_rgba(67,32,106,.75)] backdrop-blur-sm sm:p-8";

export function DressCode() {
  const shades = [
    ["Tím Huế", "#5B2A86"],
    ["Tím phớt", "#C9A0DC"],
    ["Trắng ngà", "#F8F4ED"],
    ["Hồng sen", "#E9B8C8"],
  ] as const;
  return (
    <section className="relative z-10 px-[6vw] py-20 text-center">
      <div className={`${panel} mx-auto max-w-xl`}>
        <p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">
          Sắc áo ngày vui
        </p>
        <h2 className="mt-4 text-2xl italic text-[#43206A]">
          Mời quý khách diện tông tím pastel và trắng ngà
        </h2>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {shades.map(([name, color]) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <span
                role="img"
                aria-label={name}
                className="h-16 w-10 rounded-t-[2rem] rounded-b-lg border border-[#B8925A]/35 shadow-inner"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-[#6E5A80]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SilkAlbum({ images }: { readonly images: readonly string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const ordered = [
    images[0],
    images[3],
    images[4],
    images[5],
    images[1],
    images[2],
  ].filter((image): image is string => Boolean(image));
  return (
    <section className="relative z-10 overflow-hidden bg-[#EDE3F2] py-18">
      <div className="mx-[6vw] h-2 rounded-full bg-[#B8925A] shadow-[0_3px_6px_rgba(67,32,106,.25)]" />
      <div className="mx-[6vw] mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none]">
        {ordered.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelected(image)}
            aria-label={`Xem ảnh cưới ${index + 1} trên ${ordered.length}`}
            className="group relative h-[58svh] min-w-[72vw] snap-center overflow-hidden rounded-[2rem] border-4 border-white/70 bg-[#F5F0F7] shadow-[0_20px_32px_-24px_rgba(67,32,106,.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B2A86] sm:min-w-[34vw] lg:min-w-[24vw]"
          >
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={image}
              alt={`Khoảnh khắc cưới ${index + 1}`}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {index === 3 && (
              <span className="absolute inset-x-5 bottom-5 rounded-full bg-white/80 px-4 py-3 font-(family-name:--font-script) text-3xl text-[#5B2A86] backdrop-blur">
                Trăm năm tình viên mãn
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mx-[6vw] h-2 rounded-full bg-[#B8925A] shadow-[0_3px_6px_rgba(67,32,106,.25)]" />
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh cưới phóng to"
          className="fixed inset-0 z-40 grid place-items-center bg-[#2E1A40]/80 p-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelected(null);
          }}
        >
          <button
            type="button"
            aria-label="Đóng ảnh"
            className="absolute top-5 right-5 size-12 rounded-full bg-white text-2xl text-[#5B2A86]"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={selected}
            alt="Ảnh cưới phóng to"
            className="max-h-[84svh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}

export function GiftAndRsvp({
  groom,
  bride,
}: {
  readonly groom: string;
  readonly bride: string;
}) {
  const [sent, setSent] = useState(false);
  const [guest, setGuest] = useState("");
  return (
    <section className="relative z-10 space-y-12 px-[6vw] py-24">
      <article className={`${panel} mx-auto max-w-xl text-center`}>
        <p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">
          Mừng cưới
        </p>
        <h2 className="mt-4 text-3xl italic text-[#43206A]">
          Sự hiện diện của quý khách là niềm vui lớn nhất
        </h2>
        <p className="mt-4 leading-7 text-[#6E5A80]">
          Gia đình xin trân trọng cảm ơn tình cảm quý báu của quý khách.
        </p>
      </article>
      <article className={`${panel} mx-auto max-w-xl`}>
        <p className="text-center text-xs tracking-[.25em] text-[#5B2A86] uppercase">
          Xác nhận tham dự
        </p>
        {sent ? (
          <p className="py-10 text-center text-lg italic text-[#43206A]">
            Cảm ơn {guest || "quý khách"}. Hẹn gặp ở ngày vui của {groom} và{" "}
            {bride}.
          </p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <label className="block text-sm text-[#6E5A80]">
              Tên của bạn
              <input
                value={guest}
                required
                onChange={(event) => setGuest(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#C9A0DC]/60 bg-white px-4 text-[#2E1A40] outline-none focus-visible:ring-2 focus-visible:ring-[#5B2A86]/30"
              />
            </label>
            <fieldset className="space-y-2 text-sm text-[#6E5A80]">
              <legend className="mb-2">Bạn có thể tham dự?</legend>
              <label className="flex gap-2">
                <input required type="radio" name="attendance" /> Tôi sẽ đến
              </label>
              <label className="flex gap-2">
                <input required type="radio" name="attendance" /> Rất tiếc,
                không đến
              </label>
            </fieldset>
            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#5B2A86] px-6 text-sm text-white transition-colors hover:bg-[#43206A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B2A86]"
            >
              Gửi xác nhận
            </button>
            <p className="text-xs text-[#6E5A80]">
              Bản xem thử, không gửi dữ liệu đi đâu.
            </p>
          </form>
        )}
      </article>
    </section>
  );
}

export function Thanks({
  image,
  names,
}: {
  readonly image?: string;
  readonly names: string;
}) {
  return (
    <section className="relative z-10 overflow-hidden px-[6vw] pt-20 pb-28 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-5 flex justify-around text-[#E9B8C8] opacity-75"
      >
        <Lotus className="w-10 -rotate-12" />
        <Lotus className="mt-12 w-7 rotate-12" />
        <Lotus className="w-12 rotate-6" />
      </div>
      <NonLaFrame src={image} alt="Khoảnh khắc cuối của cô dâu chú rể" />
      <h2 className="mx-auto mt-8 max-w-md text-3xl italic text-[#43206A]">
        Cảm ơn quý khách đã dành thời gian chung vui cùng gia đình chúng tôi.
      </h2>
      <p className="mt-7 font-(family-name:--font-script) text-4xl text-[#5B2A86]">
        {names}
      </p>
      <div
        aria-hidden
        className="mx-auto mt-12 h-8 max-w-xl rounded-[100%] border-t-2 border-[#5B2A86] opacity-80"
      />
    </section>
  );
}
