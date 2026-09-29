"use client";

import {
  ArrowUpRightIcon,
  ImagesIcon,
  StarFourIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

/** Sao-ảnh: ảnh tròn viền trăng, có quầng. */
function StarPhoto({
  src,
  alt,
  onClick,
  className = "",
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`group relative block aspect-square rounded-full ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(255,229,154,0.28),transparent_68%)]"
      />
      <span className="relative block size-full overflow-hidden rounded-full ring-2 ring-[#F6C945] shadow-[0_0_24px_rgba(246,201,69,0.35)]">
        {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </span>
    </button>
  );
}

// C2 · Tên dưới trăng (h1).
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
    <section className="mx-auto flex min-h-[100svh] w-[min(92vw,720px)] flex-col items-center justify-center pt-24 pb-[20svh] text-center">
      <p data-rise className={t.label}>
        Trân trọng kính mời
      </p>
      <h1
        data-rise
        className={`${t.display} ${t.moon} mt-6 text-[52px] leading-[1.05] break-words sm:text-[88px]`}
      >
        <span className="block">{groom.name}</span>
        <span className="block text-[0.45em] text-[#F1F4FF]">cùng</span>
        <span className="block">{bride.name}</span>
      </h1>
      <p data-rise className="mt-6 text-[18px] capitalize">
        {formatWeekday(date)}, {formatDate(date)}
      </p>
      <div data-rise className="mt-12 w-[min(62vw,280px)]">
        <StarPhoto
          src={images[0]}
          alt={`${groom.name} và ${bride.name}`}
          onClick={() => onView(0)}
        />
      </div>
    </section>
  );
}

// C3 · Hai vì sao.
export function TwoStars({
  data,
  onView,
}: {
  data: WeddingData;
  onView: View;
}) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto w-[min(92vw,820px)] py-20 text-center">
      <h2 data-rise className={`${t.display} text-[32px] sm:text-[42px]`}>
        Hai vì sao
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-16">
        {(
          [
            ["Nhà trai", groom, 1],
            ["Nhà gái", bride, 2],
          ] as const
        ).map(([house, p, i], k) => (
          <figure key={house} data-rise className={k ? "mt-16" : ""}>
            <StarPhoto
              src={images[i]}
              alt={`${house} ${p.name}`}
              onClick={() => onView(i)}
            />
            <figcaption className="mt-6">
              <p className={t.label}>{house}</p>
              <p
                className={`${t.display} ${t.moon} mt-1 text-[28px] leading-tight break-words sm:text-[34px]`}
              >
                {p.name}
              </p>
              <p className={`text-[15px] ${t.soft} break-words`}>{p.address}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const POINTS = [
  {
    x: 26,
    y: 14,
    title: "Đêm gặp gỡ",
    text: "Một buổi xem mưa sao băng, hai người cùng ước một điều.",
  },
  {
    x: 72,
    y: 48,
    title: "Đêm thương",
    text: "Những tối ngồi trên mái nhà, đếm sao tới khi ngủ quên.",
  },
  {
    x: 30,
    y: 84,
    title: "Đêm hẹn ước",
    text: "Dưới trăng lưỡi liềm, anh hỏi, và em gật đầu.",
  },
];

// C4 · Chòm sao của chúng tôi: ba sao-ảnh nối nét.
export function Constellation({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="mx-auto w-[min(94vw,900px)] py-20">
      <h2
        data-rise
        className={`${t.display} text-center text-[32px] sm:text-[42px]`}
      >
        Chòm sao của chúng tôi
      </h2>
      <div className="relative mt-10 aspect-[3/5] sm:aspect-[16/12]">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <polyline
            data-link
            points={POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#FFE59A"
            strokeWidth="1.5"
            strokeDasharray="1 3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.8"
          />
        </svg>
        {POINTS.map((p, k) => (
          <figure
            key={p.title}
            data-rise
            className="absolute w-[46%] -translate-x-1/2 -translate-y-[35%] sm:w-[30%]"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="mx-auto w-[70%]">
              <StarPhoto
                src={images[k]}
                alt={p.title}
                onClick={() => onView(3 + k)}
              />
            </div>
            <figcaption className={`${t.glass} mt-4 px-4 py-3 text-center`}>
              <p className={`${t.display} ${t.moon} text-[22px]`}>{p.title}</p>
              <p className={`text-[14px] leading-snug ${t.soft}`}>{p.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C5 + C11 · Đêm ấy: ngày, lịch, đếm ngược.
export function ThatNight({ date }: { date: Date }) {
  const vn = new Date(date.getTime() + 7 * 3_600_000);
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth();
  const day = vn.getUTCDate();
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, k) => k + 1),
  ];
  const left = useCountdown(date);
  return (
    <section className="mx-auto w-[min(92vw,560px)] py-20">
      <div data-rise className={`${t.glass} p-6 text-center sm:p-8`}>
        <span
          aria-hidden="true"
          className="mx-auto -mt-2 mb-4 block h-1 w-16 rounded-full bg-[#F6C945]"
        />
        <p className={t.label}>Đêm ấy</p>
        <p
          className={`${t.display} ${t.moon} mt-2 text-[104px] leading-none tabular-nums sm:text-[128px]`}
        >
          {day}
        </p>
        <p className="text-[18px] capitalize">
          {formatWeekday(date)}, tháng {m + 1} năm {y}
        </p>
        <div className="mt-6 grid grid-cols-7 gap-y-1 text-[14px]">
          {WEEK.map((w) => (
            <span key={w} className={`text-[12px] ${t.soft}`}>
              {w}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
              key={i}
              className={`mx-auto flex size-9 items-center justify-center rounded-full tabular-nums ${c === day ? "bg-[#F6C945] font-semibold text-[#0E1A3A] shadow-[0_0_16px_rgba(246,201,69,0.6)]" : ""}`}
            >
              {c ?? ""}
            </span>
          ))}
        </div>
        <div
          className="mt-6 grid grid-cols-4 border-t border-[#6FA3D9]/25 pt-5"
          role="timer"
          aria-label="Thời gian còn lại tới ngày cưới"
        >
          {left?.done ? (
            <p className={`${t.display} col-span-4 text-[20px]`}>
              Chúng tôi đã về chung một nhà.
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
                <p className={`${t.display} text-[32px] tabular-nums`}>
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className={`text-[13px] ${t.soft}`}>{label}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// C12 · Lịch trình buổi tối.
export function Evening({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách", "Khi những ngôi sao đầu tiên xuất hiện"],
    [0, "Làm lễ", "Trao nhẫn dưới dây đèn"],
    [30, "Khai tiệc", "Bữa tối ngoài trời"],
    [120, "Khiêu vũ", "Nhảy dưới trăng tới khuya"],
  ] as const;
  return (
    <section className="mx-auto w-[min(92vw,560px)] py-16">
      <h2
        data-rise
        className={`${t.display} text-center text-[32px] sm:text-[40px]`}
      >
        Một buổi tối
      </h2>
      <ol className="mt-10 grid gap-6 rounded-3xl bg-[#0E1A3A]/75 p-6 ring-1 ring-[#6FA3D9]/25 backdrop-blur-sm sm:p-8">
        {rows.map(([mm, title, note]) => (
          <li key={title} data-rise className="flex items-start gap-4">
            <StarFourIcon
              weight="fill"
              className="mt-1.5 size-5 shrink-0 text-[#F6C945]"
            />
            <span className="w-16 shrink-0 text-[18px] font-semibold tabular-nums">
              {formatTime(new Date(date.getTime() + mm * 60_000))}
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className={`block text-[15px] ${t.soft}`}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// C6 + C7 · Nơi hẹn.
export function Place({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto w-[min(92vw,880px)] py-20">
      <h2
        data-rise
        className={`${t.display} text-center text-[32px] sm:text-[40px]`}
      >
        Nơi hẹn
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {(
          [
            ["Lễ vu quy", formatTime(vuQuy), "Tư gia nhà gái", bride.address],
            [
              "Tiệc cưới",
              formatTime(date),
              venue.name ?? "Nhà hàng tiệc cưới",
              "Tiệc ngoài trời, nhớ mang áo khoác mỏng",
            ],
          ] as const
        ).map(([title, time, place, note]) => (
          <div key={title} data-rise className={`${t.glass} p-6`}>
            <p className={t.label}>{title}</p>
            <p
              className={`${t.display} ${t.moon} mt-1 text-[36px] tabular-nums`}
            >
              {time}
            </p>
            <p className="font-semibold break-words">{place}</p>
            <p className={`text-[15px] ${t.soft} break-words`}>{note}</p>
          </div>
        ))}
      </div>
      <div data-rise className={`${t.glass} mt-8 p-1.5`}>
        <MapEmbed
          venue={venue}
          className="aspect-[4/3] w-full rounded-[calc(1rem-0.375rem)] sm:aspect-[16/8]"
        />
      </div>
      <div className="mt-8 flex justify-center">
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
    </section>
  );
}

const SIZES = ["w-full", "w-[82%]", "w-[92%]"];

// C8 · Bầu trời kỷ niệm: toàn bộ ảnh dạng sao-ảnh.
export function MemorySky({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1000px)] py-20 text-center">
      <h2 data-rise className={`${t.display} text-[32px] sm:text-[42px]`}>
        Bầu trời kỷ niệm
      </h2>
      <p data-rise className={`mt-2 ${t.soft}`}>
        {images.length} ngôi sao, mỗi ngôi sao là một khoảnh khắc.
      </p>
      <div className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-5">
        {images.map((src, i) => (
          <div
            key={src}
            data-star
            className={`flex justify-center ${i % 2 ? "translate-y-6" : ""}`}
          >
            <div className={SIZES[i % SIZES.length]}>
              <StarPhoto
                src={src}
                alt={`Khoảnh khắc ${i + 1}`}
                onClick={() => onView(i)}
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAll} className={`${t.btn} mt-16`}>
        <ImagesIcon className="size-5" />
        Xem trọn album
      </button>
    </section>
  );
}

export function Wishes({
  couple,
  img,
  onView,
}: {
  couple: string;
  img?: string;
  onView: () => void;
}) {
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  return (
    <section className="mx-auto w-[min(92vw,880px)] pt-16 pb-[34svh]">
      <div className="grid gap-6 sm:grid-cols-2">
        <div data-rise className={`${t.glass} p-6 text-center sm:p-8`}>
          <p className={t.label}>Mừng cưới</p>
          <p className={`mt-3 ${t.soft}`}>
            Có bạn cùng ngắm sao đêm ấy đã là món quà rồi. Nếu muốn gửi thêm lời
            chúc, bấm vào đây nhé.
          </p>
          <div className="mt-6 flex justify-center">
            <GiftButton className={`${t.btn} pl-2 [&>span]:bg-[#0E1A3A]/15`} />
          </div>
        </div>
        <div data-rise className={`${t.glass} p-6 sm:p-8`}>
          <p className={t.label}>Xác nhận tham dự</p>
          {done ? (
            <p
              className={`${t.display} ${t.moon} mt-4 text-[26px]`}
              aria-live="polite"
            >
              Cảm ơn {done}, hẹn gặp dưới trăng.
            </p>
          ) : (
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setDone(name.trim());
              }}
            >
              <label className="grid gap-1">
                <span className="text-[15px] font-semibold">Tên của bạn</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Hoàng Thảo Vy"
                  className="h-12 rounded-full bg-[#0E1A3A]/70 px-5 ring-1 ring-[#6FA3D9]/40 outline-none placeholder:text-[#AEB8D6]/60 focus:ring-2 focus:ring-[#F6C945]"
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
                    className="min-h-12 rounded-full text-[15px] ring-1 ring-[#6FA3D9]/40 aria-pressed:bg-[#6FA3D9]/25 aria-pressed:ring-[#F6C945]"
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
      </div>
      <div className="relative mt-28 flex flex-col items-center text-center">
        <span
          data-shoot
          aria-hidden="true"
          className="absolute -top-10 left-0 h-0.5 w-40 rotate-[-18deg] bg-[linear-gradient(90deg,transparent,#FFE59A)] opacity-0"
        />
        <div data-rise className="w-[min(60vw,260px)]">
          <StarPhoto src={img} alt={couple} onClick={onView} />
        </div>
        <p
          data-rise
          className={`${t.display} ${t.moon} mt-10 text-[44px] sm:text-[56px]`}
        >
          Cảm ơn bạn
        </p>
        <p data-rise className={`mt-3 max-w-[34ch] ${t.soft}`}>
          Mong bạn sẽ đến, để đêm ấy có thêm một ngôi sao sáng giữa những người
          thương.
        </p>
        <p
          data-rise
          className={`${t.display} mt-6 text-[26px] text-balance break-words`}
        >
          {couple}
        </p>
      </div>
    </section>
  );
}
