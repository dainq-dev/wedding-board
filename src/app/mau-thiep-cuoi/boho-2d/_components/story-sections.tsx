"use client";

import { useRef } from "react";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { WeddingData } from "@/wedding/types";
import { Arch, ArchImage } from "./arch";
import { Sun } from "./art";

const STORIES = [
  [
    "Bình minh",
    "Lần đầu gặp",
    "Như nắng sớm, anh đến rất nhẹ nhàng. Một câu chào, một nụ cười, thế là đủ.",
  ],
  [
    "Trưa nắng",
    "Thương nhau",
    "Những chuyến đi xa, những bữa cơm vội, tình yêu lớn lên từ những ngày rất thường.",
  ],
  [
    "Chiều vàng",
    "Lời hẹn ước",
    "Dưới ánh hoàng hôn, anh hỏi em có muốn đi cùng anh hết quãng đời còn lại. Em nói: có.",
  ],
] as const;

function Label({ children }: { readonly children: string }) {
  return (
    <p className="text-xs font-semibold tracking-[0.28em] text-[#9C4F2C] uppercase">
      {children}
    </p>
  );
}

export function Names({
  groom,
  bride,
  date,
}: {
  readonly groom: string;
  readonly bride: string;
  readonly date: Date;
}) {
  return (
    <section className="flex min-h-svh items-center justify-center px-5 py-24 text-center">
      <Arch className="w-[min(88vw,520px)] px-7 pt-28 pb-14 sm:px-12">
        <Label>Chúng mình cưới rồi</Label>
        <h1 className="mt-5 font-(family-name:--font-boho-display) text-balance text-[clamp(46px,10vw,84px)] leading-[1.05] break-words text-[#9C4F2C]">
          {groom}
          <span className="block text-[0.55em]">&amp;</span>
          {bride}
        </h1>
        <Sun className="mx-auto mt-6 size-11 text-[#C0673E]" />
        <p className="mt-6 text-balance text-base leading-7 text-[#7D6553] sm:text-lg">
          Trân trọng kính mời bạn đến chung vui trong ngày vui của chúng mình.
        </p>
        <p className="mt-7 font-semibold tracking-[0.12em] text-[#4A3426] capitalize">
          {formatWeekday(date)} · {formatDate(date)}
        </p>
      </Arch>
    </section>
  );
}

export function Couple({ data }: { readonly data: WeddingData }) {
  const people = [
    { label: "Nhà trai", person: data.groom, src: data.images[1] },
    { label: "Nhà gái", person: data.bride, src: data.images[2] },
  ] as const;
  return (
    <section className="flex min-h-[105svh] items-center px-4 py-20">
      <div className="mx-auto grid w-full max-w-[660px] grid-cols-2 items-end gap-3 max-[359px]:grid-cols-1">
        {people.map(({ label, person, src }, index) => (
          <Arch key={label} className={`pb-7 ${index === 1 ? "mb-8" : ""}`}>
            <ArchImage src={src} alt={`Chân dung ${person.name}`} />
            <div className="px-4 pt-5 text-center sm:px-6">
              <Label>{label}</Label>
              <h2 className="mt-3 font-(family-name:--font-boho-display) text-3xl text-[#9C4F2C] break-words">
                {person.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#7D6553]">
                {person.address}
              </p>
            </div>
          </Arch>
        ))}
      </div>
    </section>
  );
}

export function Story({ images }: { readonly images: readonly string[] }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <div className="mb-12 text-center text-[#FFFAF3]">
        <Label>Ba buổi</Label>
        <h2 className="mt-3 font-(family-name:--font-boho-display) text-4xl">
          Chuyện của chúng mình
        </h2>
      </div>
      <div className="space-y-16">
        {STORIES.map(([time, title, copy], index) => (
          <article
            key={title}
            className={`flex items-center gap-5 ${index % 2 === 1 ? "flex-row-reverse text-right" : ""}`}
          >
            <Arch className="w-[46%] shrink-0">
              <ArchImage src={images[index + 3]} alt={`${time}, ${title}`} />
            </Arch>
            <div className="min-w-0 text-[#FFFAF3]">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase">
                {time}
              </p>
              <h2 className="mt-2 font-(family-name:--font-boho-display) text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 sm:text-base">{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DateCard({ date }: { readonly date: Date }) {
  const [day, month, year] = formatDate(date).split("/");
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-5 py-24 text-center">
      <Arch className="w-[min(88vw,500px)] px-8 pt-24 pb-12">
        <Label>Ngày chúng mình về chung một nhà</Label>
        <p className="mt-7 font-(family-name:--font-boho-display) text-[clamp(100px,27vw,170px)] leading-none text-[#9C4F2C]">
          {day}
        </p>
        <p className="mt-3 font-semibold tracking-[0.2em] text-[#4A3426] uppercase">
          Tháng {month} · {year}
        </p>
        <p className="mt-2 text-[#7D6553] capitalize">{formatWeekday(date)}</p>
        <Countdown
          date={date}
          flip
          className="mt-9 justify-center text-[#9C4F2C]"
        />
      </Arch>
    </section>
  );
}

export function SongPlate({ playing }: { readonly playing: boolean }) {
  const disc = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (playing && !reduced && disc.current)
        return gsap.to(disc.current, {
          rotate: 360,
          duration: 8,
          ease: "none",
          repeat: -1,
        });
    },
    { scope: disc, dependencies: [playing, reduced] },
  );
  return (
    <section className="flex min-h-[55svh] items-center justify-center px-5 py-16">
      <div className="text-center text-[#FFFAF3]">
        <div
          ref={disc}
          className="mx-auto grid size-40 place-items-center rounded-full border-[10px] border-[#E8D8BF] bg-[repeating-radial-gradient(circle,#C0673E_0_3px,#9C4F2C_3px_6px)] shadow-[0_18px_35px_-18px_rgba(74,52,38,0.8)]"
        >
          <span className="size-8 rounded-full border-4 border-[#E8D8BF] bg-[#FFFAF3]" />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.28em] uppercase">
          Bài hát của chúng mình
        </p>
        <p className="mt-2 font-(family-name:--font-boho-display) text-3xl">
          Một chiều nắng
        </p>
      </div>
    </section>
  );
}

export function Events({
  data,
  date,
}: {
  readonly data: WeddingData;
  readonly date: Date;
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24">
      <div className="grid gap-4 sm:grid-cols-2">
        <Arch className="px-6 pt-20 pb-10 text-center">
          <Label>Lễ vu quy</Label>
          <p className="mt-4 font-(family-name:--font-boho-display) text-4xl text-[#9C4F2C]">
            08:00
          </p>
          <p className="mt-4 text-sm leading-6 text-[#7D6553]">
            Tư gia nhà gái
            <br />
            {data.bride.address}
          </p>
        </Arch>
        <Arch className="px-6 pt-20 pb-10 text-center">
          <Label>Tiệc cưới</Label>
          <p className="mt-4 font-(family-name:--font-boho-display) text-4xl text-[#9C4F2C]">
            {formatTime(date)}
          </p>
          <p className="mt-4 text-sm leading-6 text-[#7D6553]">
            {data.venue.name || "Tiệc cưới"}
            <br />
            Trân trọng kính mời
          </p>
        </Arch>
      </div>
    </section>
  );
}
