"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { MONTH_LINE } from "./hills";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

function vn(date: Date) {
  const d = new Date(date.getTime() + 7 * 3_600_000);
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
  };
}

/** Ảnh ăn tông sương: hơi giảm bão hoà, hiện từ mờ sang rõ khi vào khung (data-mist). */
function Photo({
  src,
  alt,
  onClick,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  ratio?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`group block overflow-hidden rounded-2xl saturate-[.85] ${className}`}
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        data-mist
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] ${ratio}`}
      />
    </button>
  );
}

// Card so le trên desktop để lộ đồi thông giữa các card.
const side = (k: number) =>
  `mx-auto w-[min(90vw,480px)] ${k % 2 ? "lg:mr-[12vw]" : "lg:ml-[12vw]"}`;

// C2 · Tên trên đồi (h1), chữ đặt thẳng trên nền sương.
export function Names({ data, date }: { data: WeddingData; date: Date }) {
  const { groom, bride } = data;
  const { day, month, year } = vn(date);
  return (
    <section className="mx-auto flex min-h-[100svh] w-[min(90vw,720px)] flex-col justify-center py-24">
      <p data-fade className={t.label}>
        Trân trọng kính mời
      </p>
      <h1
        data-fade
        className={`${t.display} mt-8 text-[52px] leading-[1.02] italic break-words sm:text-[88px]`}
      >
        <span className="block">{groom.name}</span>
        <span className="block pl-[18%] text-[0.5em] not-italic">&amp;</span>
        <span className="block text-right">{bride.name}</span>
      </h1>
      <span data-fade className="mt-10 block h-px w-32 bg-[#2F4F3E]/50" />
      <p
        data-fade
        className="mt-6 text-[15px] font-semibold tracking-[0.2em] tabular-nums"
      >
        {pad(day)} · {pad(month)} · {year}
      </p>
      <p data-fade className={`${t.display} mt-1 text-[22px] italic ${t.soft}`}>
        <span className="capitalize">{formatWeekday(date)}</span>,{" "}
        {MONTH_LINE[month - 1]}
      </p>
    </section>
  );
}

/** Dải sương: khoảng thở giữa các chương. */
export function FogBand() {
  return <div aria-hidden="true" className="h-[36svh]" />;
}

// C3 · Hai người.
export function Couple({ data, onView }: { data: WeddingData; onView: View }) {
  const { groom, bride, images } = data;
  return (
    <section className="py-16">
      <div data-card className={`${side(0)} ${t.glass} grid gap-8 p-6 sm:p-8`}>
        {(
          [
            ["Chú rể", groom, 1],
            ["Cô dâu", bride, 2],
          ] as const
        ).map(([role, p, i], k) => (
          <div
            key={role}
            className={`grid grid-cols-[55%_1fr] items-end gap-5 ${k ? "border-t border-[#B7C4B0] pt-8" : ""}`}
          >
            <Photo
              src={images[i]}
              alt={`${role} ${p.name}`}
              onClick={() => onView(i)}
              className={k ? "order-2" : ""}
            />
            <div className={k ? "order-1 text-left" : ""}>
              <p className={t.label}>{role}</p>
              <p
                className={`${t.display} mt-2 text-[32px] leading-[1.1] italic break-words`}
              >
                {p.name}
              </p>
              <p
                className={`mt-2 text-[14px] ${t.soft} line-clamp-3 break-words`}
              >
                {p.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const MORNINGS = [
  [
    "06:10",
    "Lần đầu gặp",
    "Một buổi sáng sương dày, hai người lạ cùng đứng chờ một ly cà phê nóng.",
  ],
  [
    "05:45",
    "Thương",
    "Có những con dốc chỉ muốn đi cùng một người, dù trời còn chưa sáng.",
  ],
  ["06:30", "Lời hứa", "Giữa đồi thông, một câu hỏi, một cái gật đầu."],
] as const;

// C4 · Ba buổi sáng.
export function Mornings({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="flex flex-col gap-20 py-16">
      <p
        data-fade
        className={`${t.display} mx-auto w-[min(90vw,720px)] text-[40px] italic sm:text-[56px]`}
      >
        Ba buổi sáng
      </p>
      {MORNINGS.map(([time, title, text], k) => (
        <article
          key={title}
          data-card
          className={`${side(k)} ${t.glass} p-5 sm:p-6`}
        >
          <Photo
            src={images[k]}
            alt={title}
            onClick={() => onView(3 + k)}
            ratio="aspect-[4/3]"
          />
          <p className="mt-5 text-[13px] font-semibold tracking-[0.15em] tabular-nums">
            {time}
          </p>
          <h2 className={`${t.display} text-[30px] italic`}>{title}</h2>
          <p
            className={`${t.display} mt-2 text-[21px] leading-snug italic ${t.soft}`}
          >
            {text}
          </p>
        </article>
      ))}
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C5 + C11 · Ngày cưới và lịch.
export function DateCard({ date }: { date: Date }) {
  const { day, month, year } = vn(date);
  const left = useCountdown(date);
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  return (
    <section className="py-16">
      <div data-card className={`${side(1)} ${t.glass} p-6 text-center sm:p-8`}>
        <p className={t.label}>Ngày chúng tôi về chung nhà</p>
        <p
          className={`${t.display} mt-4 text-[104px] leading-none text-[#2F4F3E] tabular-nums sm:text-[128px]`}
        >
          {day}
        </p>
        <p className="text-[13px] font-semibold tracking-[0.25em] uppercase">
          Tháng {month}, {year}
        </p>
        <div className="mt-6 grid grid-cols-7 gap-y-1 border-t border-[#B7C4B0] pt-5 text-[14px]">
          {WEEK.map((w) => (
            <span key={w} className={`text-[12px] ${t.soft}`}>
              {w}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
              key={i}
              className={`mx-auto flex size-9 items-center justify-center rounded-full tabular-nums ${c === day ? "font-semibold ring-1 ring-[#2F4F3E]" : ""}`}
            >
              {c ?? ""}
            </span>
          ))}
        </div>
        <div
          className="mt-6 grid grid-cols-4 border-t border-[#B7C4B0] pt-5"
          role="timer"
          aria-label="Thời gian còn lại tới ngày cưới"
        >
          {left?.done ? (
            <p className={`${t.display} col-span-4 text-[20px] italic`}>
              Chúng tôi đã về chung một nhà, cảm ơn vì đã ghé thăm.
            </p>
          ) : (
            (
              [
                ["ngày", left?.days],
                ["giờ", left?.hours],
                ["phút", left?.minutes],
                ["giây", left?.seconds],
              ] as const
            ).map(([label, v]) => (
              <div key={label}>
                <p className={`${t.display} text-[34px] tabular-nums`}>
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className={`text-[12px] ${t.soft}`}>{label}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// C12 · Một ngày trên đồi: không card, chữ đặt trên nền đồi, mỗi mốc là một ngọn thông nhỏ.
export function Day({ date }: { date: Date }) {
  const rows = [
    [-90, "Đón khách", "Trà nóng và bánh ngọt"],
    [-60, "Làm lễ", "Trao nhẫn giữa đồi thông"],
    [0, "Khai tiệc", "Bữa tối ấm cúng"],
    [150, "Lửa trại", "Hát cùng nhau bên bếp lửa"],
  ] as const;
  return (
    <section className="mx-auto w-[min(90vw,560px)] py-20">
      <p data-fade className={`${t.display} text-[40px] italic sm:text-[52px]`}>
        Một ngày trên đồi
      </p>
      <ol className="mt-10 grid gap-7 rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
        {rows.map(([m, title, note]) => (
          <li
            key={title}
            data-fade
            className="grid grid-cols-[4.5rem_1.5rem_1fr] items-center gap-4"
          >
            <span className="text-[17px] font-semibold tabular-nums">
              {formatTime(new Date(date.getTime() + m * 60_000))}
            </span>
            <span
              data-pine
              aria-hidden="true"
              className="h-7 w-5 origin-bottom bg-[#2F4F3E] [clip-path:polygon(50%_0,100%_100%,0_100%)]"
            />
            <span>
              <span className="block font-semibold">{title}</span>
              <span className={`block text-[14px] ${t.soft}`}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// C6 + C7 · Lễ gia tiên, tiệc cưới và bản đồ.
export function Places({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const giaTien = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="flex flex-col gap-10 py-16">
      <div data-card className={`${side(0)} ${t.glass} p-6 sm:p-8`}>
        <p className={t.label}>Lễ gia tiên</p>
        <p className={`${t.display} mt-2 text-[34px] tabular-nums`}>
          {formatTime(giaTien)}
        </p>
        <p className="font-semibold">Tư gia nhà gái</p>
        <p className={`text-[14px] ${t.soft} break-words`}>{bride.address}</p>
      </div>
      <div data-card className={`${side(1)} ${t.glass} p-6 sm:p-8`}>
        <p className={t.label}>Tiệc cưới</p>
        <p className={`${t.display} mt-2 text-[34px] tabular-nums`}>
          {formatTime(date)}
        </p>
        <p className="font-semibold break-words">
          {venue.name ?? "Nhà hàng tiệc cưới"}
        </p>
        <MapEmbed
          venue={venue}
          className="mt-5 aspect-[4/3] w-full rounded-2xl"
        />
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${t.btn} mt-6 w-full`}
        >
          Đường lên đồi
          <ArrowUpRightIcon weight="bold" className="size-4" />
        </a>
      </div>
    </section>
  );
}

// C8 · Album cửa sổ kính: toàn bộ ảnh, lưới hai / ba cột so le.
export function Album({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1080px)] py-20">
      <p
        data-fade
        className={`${t.display} text-center text-[40px] italic sm:text-[56px]`}
      >
        Khung cửa sổ
      </p>
      <p data-fade className={`mt-2 text-center ${t.soft}`}>
        {images.length} khoảnh khắc sau lớp kính mờ sương.
      </p>
      <div className={`${t.glass} mt-12 p-3 sm:p-5`}>
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
          {images.map((src, i) => (
            <div key={src} className="mb-3 break-inside-avoid sm:mb-4">
              <Photo
                src={src}
                alt={`Khoảnh khắc ${i + 1}`}
                onClick={() => onView(i)}
                ratio={
                  [
                    "aspect-[4/5]",
                    "aspect-[3/4]",
                    "aspect-square",
                    "aspect-[4/5]",
                    "aspect-[2/3]",
                  ][i % 5]
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <button type="button" onClick={onAll} className={t.btn}>
          <ImagesIcon className="size-5" />
          Xem trọn album
        </button>
      </div>
    </section>
  );
}

export function Reply() {
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  return (
    <section className="flex flex-col gap-10 py-16">
      <div data-card className={`${side(0)} ${t.glass} p-6 text-center sm:p-8`}>
        <p className={t.label}>Mừng cưới</p>
        <p className={`${t.display} mt-3 text-[22px] italic`}>
          Sự có mặt của bạn giữa buổi sớm ấy là món quà ấm nhất.
        </p>
        <p className={`mt-2 text-[15px] ${t.soft}`}>
          Nếu muốn gửi thêm lời chúc, bạn có thể bấm vào đây.
        </p>
        <div className="mt-6 flex justify-center">
          <GiftButton className={`${t.btn} pl-2 [&>span]:bg-white/20`} />
        </div>
      </div>
      <div data-card className={`${side(1)} ${t.glass} p-6 sm:p-8`}>
        <p className={t.label}>Xác nhận tham dự</p>
        {done ? (
          <p
            className={`${t.display} mt-4 text-[24px] italic`}
            aria-live="polite"
          >
            Cảm ơn {done}. Hẹn gặp bạn trên đồi.
          </p>
        ) : (
          <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) setDone(name.trim());
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-[14px] font-semibold">Tên của bạn</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoComplete="name"
                placeholder="Võ Thanh Tâm"
                className="h-12 rounded-full bg-white/80 px-5 ring-1 ring-[#B7C4B0] outline-none placeholder:text-[#55665B]/70 focus:ring-2 focus:ring-[#2F4F3E]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  [true, "Sẽ đến"],
                  [false, "Không đến được"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={going === v}
                  onClick={() => setGoing(v)}
                  className="min-h-12 rounded-full text-[15px] ring-1 ring-[#B7C4B0] aria-pressed:bg-[#2F4F3E] aria-pressed:text-white aria-pressed:ring-[#2F4F3E]"
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="submit" disabled={!name.trim()} className={t.btn}>
              Gửi xác nhận
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// C10 · Nắng lên: sương tan hẳn, lời cảm ơn.
export function Sunrise({
  couple,
  img,
  onView,
}: {
  couple: string;
  img?: string;
  onView: () => void;
}) {
  return (
    <section
      data-sunrise
      className="mx-auto flex min-h-[110svh] w-[min(90vw,560px)] flex-col items-center justify-center pt-16 pb-40 text-center"
    >
      <div data-card className="w-[min(78vw,380px)]">
        <Photo
          src={img}
          alt={couple}
          onClick={onView}
          ratio="aspect-[4/5]"
          className="shadow-[0_30px_60px_-24px_rgba(31,45,37,0.5)]"
        />
      </div>
      <p
        data-fade
        className={`${t.display} mt-12 text-[46px] italic sm:text-[60px]`}
      >
        Cảm ơn bạn
      </p>
      <p data-fade className={`mt-3 max-w-[34ch] ${t.soft}`}>
        Nắng đã lên trên đồi. Cảm ơn bạn đã cùng đi hết buổi sớm này với chúng
        tôi.
      </p>
      <p
        data-fade
        className={`${t.display} mt-6 text-[26px] italic text-balance break-words`}
      >
        {couple}
      </p>
    </section>
  );
}
