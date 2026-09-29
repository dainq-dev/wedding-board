"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import type { WeddingData } from "@/wedding/types";
import { Sign, Sprig } from "../art";
import { monthGrid, SCHEDULE, vnParts } from "../time";
import { t } from "../tokens";

type View = (i: number) => void;

/** Ảnh polaroid giấy kraft trong bảng. */
function Photo({
  src,
  alt,
  i,
  onView,
  className = "",
}: {
  src?: string;
  alt: string;
  i: number;
  onView: View;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={() => onView(i)}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`block bg-[#FBF5EA] p-2 pb-7 shadow-[0_14px_24px_-14px_rgba(30,21,16,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-0 ${className}`}
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img src={src} alt={alt} className="aspect-[4/5] w-full object-cover" />
    </button>
  );
}

// Vị trí bảng quanh sợi dây: mobile lệch phải dây ở mép trái; desktop so le hai bên dây giữa trang.
const side = (k: number) =>
  `ml-10 w-[min(calc(100%-2.5rem),30rem)] lg:ml-0 lg:w-[30rem] ${k % 2 ? "lg:ml-[calc(50%+2rem)]" : "lg:ml-[calc(50%-32rem)]"}`;

export function Names({
  data,
  date,
  onView,
}: {
  data: WeddingData;
  date: Date;
  onView: View;
}) {
  const { groom, bride, images } = data;
  return (
    <section className="px-4 pt-6 pb-16">
      <Sign className="mx-auto ml-10 w-[min(calc(100%-2.5rem),36rem)] lg:mx-auto">
        <div className="text-center">
          <p className={`${t.label} ${t.soft}`}>Trân trọng kính mời</p>
          <h1
            className={`${t.script} mt-4 text-[56px] text-[#3B2A1E] break-words sm:text-[80px]`}
          >
            <span className="block">{groom.name}</span>
            <span className="block text-[0.6em] text-[#8A6440]">&amp;</span>
            <span className="block">{bride.name}</span>
          </h1>
          <p className={`mt-3 italic ${t.soft}`}>cùng về chung một nhà</p>
          <Sprig className="mx-auto my-5 h-8 w-32" />
          <p className="text-[19px] font-semibold capitalize">
            {formatWeekday(date)}, {formatDate(date).replaceAll("/", ".")}
          </p>
          <Photo
            src={images[0]}
            alt={`${groom.name} và ${bride.name}`}
            i={0}
            onView={onView}
            className="mx-auto mt-8 w-[78%] -rotate-2"
          />
        </div>
      </Sign>
    </section>
  );
}

export function Families({
  data,
  onView,
}: {
  data: WeddingData;
  onView: View;
}) {
  const { groom, bride, images } = data;
  return (
    <section className="flex flex-col gap-14 px-4 py-16">
      {(
        [
          ["Nhà trai", "Chú rể", groom, 1],
          ["Nhà gái", "Cô dâu", bride, 2],
        ] as const
      ).map(([house, role, p, i], k) => (
        <Sign key={house} className={side(k)}>
          <div className="grid grid-cols-[42%_1fr] items-center gap-5">
            <Photo
              src={images[i]}
              alt={`${role} ${p.name}`}
              i={i}
              onView={onView}
              className={k ? "rotate-3" : "-rotate-3"}
            />
            <div className="min-w-0">
              <p className={`${t.label} ${t.soft}`}>{house}</p>
              <p className={`${t.script} mt-2 text-[40px] break-words`}>
                {p.name}
              </p>
              <p
                className={`mt-1 text-[15px] ${t.soft} line-clamp-3 break-words`}
                title={p.address}
              >
                {p.address}
              </p>
            </div>
          </div>
        </Sign>
      ))}
    </section>
  );
}

const STORY = [
  [
    "Gặp gỡ",
    "Một chiều mưa, hai người lạ trú chung mái hiên quán cà phê nhỏ. Không ai ngờ đó là khởi đầu.",
  ],
  [
    "Thương nhau",
    "Những chuyến xe về quê, những bữa cơm nhà, và rất nhiều lần cùng nhau đi qua mùa gặt.",
  ],
  ["Cầu hôn", "Dưới một dây đèn vàng như thế này, anh hỏi, và em gật đầu."],
] as const;

export function Story({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="flex flex-col gap-14 px-4 py-16">
      <p
        data-rise
        className={`${t.script} ml-10 text-[46px] text-[#FFD68A] lg:ml-0 lg:text-center lg:text-[60px]`}
      >
        Chuyện của hai đứa
      </p>
      {STORY.map(([title, text], k) => (
        <Sign key={title} className={side(k)}>
          {images[k] && (
            <button
              type="button"
              onClick={() => onView(3 + k)}
              aria-label={`Xem lớn ảnh ${title}`}
              className="mb-5 block w-full overflow-hidden rounded-[3px]"
            >
              {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
              <img
                src={images[k]}
                alt={title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            </button>
          )}
          <p className={`${t.label} ${t.soft}`}>Chương {k + 1}</p>
          <h2 className={`${t.script} mt-1 text-[44px]`}>{title}</h2>
          <p className={`mt-2 ${t.soft}`}>{text}</p>
        </Sign>
      ))}
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function DateSign({ date }: { date: Date }) {
  const { day, month, year } = vnParts(date);
  const done = useCountdown(date)?.done ?? false;
  return (
    <section className="px-4 py-16">
      <Sign className={side(0)} paper={false}>
        <div className="px-4 py-6 text-center text-[#F4EAD9] [text-shadow:0_1px_0_rgba(0,0,0,0.35)]">
          <h2 className={`${t.script} text-[44px]`}>Ngày chung đôi</h2>
          <p
            data-count={day}
            className="text-[96px] leading-none font-medium tabular-nums"
          >
            {day}
          </p>
          <p className={`${t.label} mt-2`}>
            Tháng {month}, {year}
          </p>
          <div className="mx-auto mt-6 grid max-w-72 grid-cols-7 gap-y-1 text-[15px]">
            {WEEK.map((w) => (
              <span key={w} className="text-[12px] opacity-75">
                {w}
              </span>
            ))}
            {monthGrid(date).map((c, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
                key={i}
                className={`relative flex h-8 items-center justify-center tabular-nums ${c === day ? "font-semibold text-[#3B2A1E]" : ""}`}
              >
                {c === day && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0.5 rounded-full bg-[#FFD68A]"
                  />
                )}
                <span className="relative">{c ?? ""}</span>
              </span>
            ))}
          </div>
          <div className="mt-7 flex justify-center">
            {done ? (
              <p className="italic">Chúng mình đã về chung một nhà.</p>
            ) : (
              <Countdown
                date={date}
                className="[&_div.rounded-lg]:bg-[#3B2A1E]/55"
              />
            )}
          </div>
        </div>
      </Sign>
    </section>
  );
}

export function Schedule({ date }: { date: Date }) {
  return (
    <section className="px-4 py-16">
      <Sign className={side(1)}>
        <h2 className={`${t.script} text-[44px]`}>Lịch trình</h2>
        <ol className="relative mt-5 ml-3 border-l-2 border-dashed border-[#B89B72]">
          {SCHEDULE.map(([m, title, note]) => (
            <li key={title} className="relative pb-6 pl-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[7px] size-3 rounded-full bg-[#C89F65] ring-4 ring-[#F4EAD9]"
              />
              <p className="text-[20px] font-semibold tabular-nums">
                {formatTime(new Date(date.getTime() + m * 60_000))}
              </p>
              <p className="font-medium">{title}</p>
              <p className={`text-[15px] ${t.soft}`}>{note}</p>
            </li>
          ))}
        </ol>
      </Sign>
    </section>
  );
}

export function Ceremonies({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="flex flex-col gap-14 px-4 py-16">
      <Sign className={side(0)}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={`${t.label} ${t.soft}`}>Lễ vu quy</p>
            <p className="mt-1 text-[26px] font-semibold tabular-nums">
              {formatTime(vuQuy)}
            </p>
            <p className="mt-1 font-medium">Tư gia nhà gái</p>
            <p className={`text-[15px] ${t.soft} break-words`}>
              {bride.address}
            </p>
          </div>
          <div>
            <p className={`${t.label} ${t.soft}`}>Tiệc cưới</p>
            <p className="mt-1 text-[26px] font-semibold tabular-nums">
              {formatTime(date)}
            </p>
            <p className="mt-1 font-medium break-words">
              {venue.name ?? "Nhà hàng tiệc cưới"}
            </p>
            <p className={`text-[15px] ${t.soft}`}>
              Mời bạn đến sớm một chút để cùng chụp ảnh.
            </p>
          </div>
        </div>
      </Sign>
      <Sign className={side(1)}>
        <MapEmbed venue={venue} className="aspect-[4/3] w-full rounded-[3px]" />
        <div className="mt-5 flex justify-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={t.btn}
          >
            Chỉ đường
            <ArrowUpRightIcon weight="bold" className="size-4" />
          </a>
        </div>
      </Sign>
    </section>
  );
}

const JARS = [
  ["Kem", "#EFE3CC"],
  ["Nâu gỗ", "#8A6440"],
  ["Xanh lá", "#8AA17C"],
  ["Trắng", "#FBF7EF"],
] as const;

export function DressCode() {
  return (
    <section className="px-4 py-16">
      <Sign className={side(0)}>
        <h2 className={`${t.script} text-[44px]`}>Trang phục</h2>
        <p className={`mt-1 ${t.soft}`}>
          Nhẹ nhàng, thoải mái cho buổi tiệc ngoài trời. Gợi ý bảng màu:
        </p>
        <ul className="mt-6 flex justify-between gap-2">
          {JARS.map(([name, color]) => (
            <li key={name} className="flex flex-col items-center gap-2">
              <span className="relative h-20 w-14 overflow-hidden rounded-b-2xl rounded-t-md bg-white/50 ring-1 ring-[#8A6440]/40">
                <span
                  data-water
                  className="absolute inset-x-0 bottom-0 h-[70%] origin-bottom"
                  style={{ backgroundColor: color }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 top-0 h-2 rounded-b-sm bg-[#8A6440]/50"
                />
              </span>
              <span className="text-[14px]">{name}</span>
            </li>
          ))}
        </ul>
      </Sign>
    </section>
  );
}
