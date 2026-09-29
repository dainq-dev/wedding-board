"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");
const initial = (name: string) => name.trim().split(/\s+/).at(-1)?.[0] ?? "";

/** Ảnh trong khung chỉ vàng hai lớp. */
function Framed({
  src,
  alt,
  i,
  onView,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  src?: string;
  alt: string;
  i: number;
  onView: View;
  ratio?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={() => onView(i)}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`group block bg-[#1F120C] p-2 ring-1 ring-[#C9A24A] outline outline-1 outline-offset-4 outline-[#C9A24A]/40 shadow-[0_30px_50px_-30px_rgba(0,0,0,0.95)] ${className}`}
    >
      <span className="block overflow-hidden">
        {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${ratio}`}
        />
      </span>
    </button>
  );
}

// C2 · Tranh chính: tên cặp đôi vàng lá, dấu triện son đỏ, ảnh bìa.
export function Main({
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
    <section className="mx-auto grid w-[min(92vw,1100px)] items-center gap-14 pt-28 pb-24 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
      <div className="text-center lg:text-left">
        <p data-grind className={t.label}>
          Trân trọng kính mời
        </p>
        <h1
          data-shine
          className={`${t.display} ${t.gold} mt-6 text-[44px] leading-[1.12] font-normal break-words sm:text-[64px] lg:text-[76px]`}
        >
          <span className="block">{groom.name}</span>
          <span className="block text-[0.5em] italic">và</span>
          <span className="block">{bride.name}</span>
        </h1>
        <div
          data-grind
          className="mt-8 flex items-center justify-center gap-4 lg:justify-start"
        >
          <span
            className={`${t.display} flex size-12 items-center justify-center rounded-[3px] bg-[#A4161A] text-[18px] font-medium text-[#F3E3C3] shadow-[0_6px_14px_-6px_rgba(164,22,26,0.8)]`}
          >
            {initial(groom.name)}
            {initial(bride.name)}
          </span>
          <span className="text-left">
            <span className="block text-[15px] capitalize">
              {formatWeekday(date)}
            </span>
            <span className={`${t.display} block text-[22px] tabular-nums`}>
              {formatDate(date).replaceAll("/", " . ")}
            </span>
          </span>
        </div>
      </div>
      <div data-grind className="mx-auto w-[min(80vw,440px)]">
        <Framed
          src={images[0]}
          alt={`${groom.name} và ${bride.name}`}
          i={0}
          onView={onView}
        />
      </div>
    </section>
  );
}

// C3 · Hai tấm tranh dọc: nhà trai, nhà gái.
export function Families({
  data,
  onView,
}: {
  data: WeddingData;
  onView: View;
}) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto grid w-[min(92vw,900px)] gap-16 py-24 sm:grid-cols-2 sm:gap-10">
      {(
        [
          ["Nhà trai", groom, 1],
          ["Nhà gái", bride, 2],
        ] as const
      ).map(([house, p, i], k) => (
        <figure key={house} data-grind className={k ? "sm:mt-24" : ""}>
          <Framed
            src={images[i]}
            alt={`${house} ${p.name}`}
            i={i}
            onView={onView}
            ratio="aspect-[3/4]"
          />
          <figcaption className="mt-8 text-center">
            <p className={t.label}>{house}</p>
            <p
              className={`${t.display} mt-2 text-[34px] leading-tight break-words`}
            >
              {p.name}
            </p>
            <p className={`mt-1 text-[16px] ${t.soft} break-words`}>
              {p.address}
            </p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

const STORY = [
  [
    "Gặp gỡ",
    "Một buổi chiều ở phố cổ, hai người cùng dừng chân trước một bức tranh sơn mài. Câu chuyện bắt đầu từ đó.",
  ],
  [
    "Thương nhau",
    "Như lớp sơn được phủ rồi mài qua nhiều lượt, tình cảm lớn dần qua từng mùa, càng ngày càng sáng.",
  ],
  [
    "Nên duyên",
    "Hai gia đình ngồi lại bên nhau, định ngày lành để hai đứa về chung một nhà.",
  ],
] as const;

// C4 · Bộ ba tấm tranh chuyện tình.
export function Triptych({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="mx-auto w-[min(92vw,1100px)] py-24">
      <h2
        data-grind
        className={`${t.display} text-center text-[36px] sm:text-[48px]`}
      >
        Chuyện tình
      </h2>
      <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
        {STORY.map(([title, text], k) => (
          <article
            key={title}
            data-grind
            className={`${t.panel} p-5 ${k === 1 ? "lg:mt-16" : ""}`}
          >
            {images[k] && (
              <button
                type="button"
                onClick={() => onView(3 + k)}
                aria-label={`Xem lớn ảnh ${title}`}
                className="block w-full overflow-hidden"
              >
                {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                <img
                  src={images[k]}
                  alt={title}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-1000 hover:scale-[1.04]"
                />
              </button>
            )}
            <p className={`${t.label} mt-6`}>Tấm {["một", "hai", "ba"][k]}</p>
            <h3 className={`${t.display} mt-2 text-[30px] ${t.gold}`}>
              {title}
            </h3>
            <p className={`mt-2 ${t.soft}`}>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Bình phong bốn tấm gấp mở theo cuộn, lộ tên chương. */
export function Screen({ title, sub }: { title: string; sub: string }) {
  return (
    <section
      data-screen
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden [perspective:1400px]"
    >
      <div className="relative z-0 px-6 text-center">
        <p className={t.label}>{sub}</p>
        <h2
          className={`${t.display} ${t.gold} mt-4 text-[48px] leading-tight sm:text-[72px]`}
        >
          {title}
        </h2>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 grid grid-cols-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            data-leaf={i}
            className={`relative h-full bg-[#0D0705] bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%)] ring-1 ring-[#C9A24A]/40 ${i % 2 ? "origin-right" : "origin-left"}`}
          >
            <span className="absolute inset-3 ring-1 ring-[#C9A24A]/20" />
          </span>
        ))}
      </div>
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function month(date: Date) {
  const vn = new Date(date.getTime() + 7 * 3_600_000);
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth();
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return { cells, day: vn.getUTCDate(), m: m + 1, y };
}

// C5 + C11 · Ngày lành: số lớn vàng, lịch tháng khoanh son đỏ, đếm ngược.
export function DateBlock({ date }: { date: Date }) {
  const { cells, day, m, y } = month(date);
  const left = useCountdown(date);
  return (
    <section className="mx-auto grid w-[min(92vw,1000px)] items-center gap-14 py-24 lg:grid-cols-2">
      <div data-grind className="text-center">
        <p className={t.label}>{formatWeekday(date)}</p>
        <p
          className={`${t.display} ${t.gold} mt-2 text-[120px] leading-none font-light tabular-nums sm:text-[160px]`}
        >
          {pad(day)}
        </p>
        <p className={`${t.display} text-[22px]`}>
          Tháng {m} năm {y}
        </p>
        <p className={`mt-2 ${t.soft}`}>Tiệc cưới lúc {formatTime(date)}</p>
      </div>
      <div data-grind className={`${t.panel} p-6 sm:p-8`}>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {WEEK.map((w) => (
            <span key={w} className={`text-[13px] ${t.soft}`}>
              {w}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
              key={i}
              className={`mx-auto flex size-9 items-center justify-center rounded-full tabular-nums ${c === day ? "bg-[#A4161A] font-medium text-[#F3E3C3] shadow-[0_0_0_3px_rgba(201,162,74,0.5)]" : ""}`}
            >
              {c ?? ""}
            </span>
          ))}
        </div>
        <div
          className="mt-8 grid grid-cols-4 border-t border-[#C9A24A]/30 pt-6 text-center"
          role="timer"
          aria-label="Thời gian còn lại tới ngày cưới"
        >
          {left?.done ? (
            <p className="col-span-4 italic">Đôi ta đã về chung một nhà.</p>
          ) : (
            (
              [
                ["Ngày", left?.days],
                ["Giờ", left?.hours],
                ["Phút", left?.minutes],
                ["Giây", left?.seconds],
              ] as const
            ).map(([label, v]) => (
              <div key={label}>
                <p
                  className={`${t.display} text-[30px] font-light tabular-nums`}
                >
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

// C12 · Trình tự buổi lễ.
export function Order({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách", "Trà bánh, chụp ảnh lưu niệm"],
    [0, "Lễ thành hôn", "Hai gia đình ra mắt, trao nhẫn cưới"],
    [30, "Khai tiệc", "Nâng ly chúc mừng đôi uyên ương"],
    [120, "Tri ân", "Cô dâu chú rể cảm tạ quan khách"],
  ] as const;
  return (
    <section className="mx-auto w-[min(92vw,720px)] py-24">
      <h2
        data-grind
        className={`${t.display} text-center text-[36px] sm:text-[44px]`}
      >
        Trình tự
      </h2>
      <ol className="mt-12 divide-y divide-[#C9A24A]/25 border-y border-[#C9A24A]/25">
        {rows.map(([mm, title, note]) => (
          <li
            key={title}
            data-grind
            className="grid grid-cols-[5.5rem_1fr] gap-5 py-6 sm:grid-cols-[7rem_1fr]"
          >
            <span
              className={`${t.display} ${t.gold} text-[28px] font-light tabular-nums`}
            >
              {formatTime(new Date(date.getTime() + mm * 60_000))}
            </span>
            <span>
              <span className={`${t.display} block text-[22px]`}>{title}</span>
              <span className={`block text-[16px] ${t.soft}`}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// C6 + C7 · Hai lễ và bản đồ.
export function Places({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride, groom } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto w-[min(92vw,1000px)] py-24">
      <div className="grid gap-8 sm:grid-cols-2">
        {(
          [
            ["Lễ vu quy", formatTime(vuQuy), "Tư gia nhà gái", bride.address],
            [
              "Lễ thành hôn và tiệc cưới",
              formatTime(date),
              venue.name ?? "Nhà hàng tiệc cưới",
              `Nhà trai: ${groom.address}`,
            ],
          ] as const
        ).map(([title, time, place, note]) => (
          <div key={title} data-grind className={`${t.panel} p-6 sm:p-8`}>
            <p className={t.label}>{title}</p>
            <p
              className={`${t.display} mt-3 text-[40px] font-light tabular-nums`}
            >
              {time}
            </p>
            <p className="mt-2 text-[19px] break-words">{place}</p>
            <p className={`mt-1 text-[15px] ${t.soft} break-words`}>{note}</p>
          </div>
        ))}
      </div>
      <div data-grind className={`${t.panel} mt-10 p-2`}>
        <MapEmbed
          venue={venue}
          className="aspect-[4/3] w-full sm:aspect-[16/8]"
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

const SWATCH = [
  ["Sơn then", "#1A0F0A"],
  ["Son đỏ", "#A4161A"],
  ["Vàng lá", "#C9A24A"],
  ["Vỏ trứng", "#E9DCC0"],
] as const;

export function Attire() {
  return (
    <section
      data-grind
      className="mx-auto w-[min(92vw,720px)] py-20 text-center"
    >
      <h2 className={`${t.display} text-[32px]`}>Trang phục</h2>
      <p className={`mx-auto mt-2 max-w-[36ch] ${t.soft}`}>
        Áo dài hoặc trang phục lịch sự, gợi ý theo bảng màu sơn mài.
      </p>
      <ul className="mt-10 grid grid-cols-4 gap-3">
        {SWATCH.map(([name, c]) => (
          <li key={name} className="flex flex-col items-center gap-3">
            <span
              className="aspect-[3/4] w-full rounded-[3px] ring-1 ring-[#C9A24A]/60"
              style={{ backgroundColor: c }}
            />
            <span className="text-[14px]">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Nhịp lưới album: ô lớn 2×2 xen các ô nhỏ, lặp theo số ảnh (không cắt ảnh nào).
const SPAN = [
  "col-span-2 row-span-2",
  "",
  "",
  "row-span-2",
  "",
  "col-span-2",
  "",
  "",
];

// C8 · Album khung khảm: toàn bộ ảnh.
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
    <section className="mx-auto w-[min(94vw,1100px)] py-24">
      <h2
        data-grind
        className={`${t.display} text-center text-[36px] sm:text-[48px]`}
      >
        Album cưới
      </h2>
      <p className={`mt-2 text-center ${t.soft}`}>
        {images.length} khoảnh khắc được lưu lại như những tấm tranh.
      </p>
      <div className="mt-12 grid auto-rows-[38vw] grid-cols-2 gap-3 sm:auto-rows-[22vw] sm:grid-cols-4 lg:auto-rows-[15rem] lg:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            data-tile
            type="button"
            onClick={() => onView(i)}
            aria-label={`Xem lớn ảnh ${i + 1}`}
            className={`group relative overflow-hidden bg-[#1F120C] p-1.5 ring-1 ring-[#C9A24A]/70 ${SPAN[i % SPAN.length]}`}
          >
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={src}
              alt={`Khoảnh khắc ${i + 1}`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
            />
          </button>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <button type="button" onClick={onAll} className={t.btn}>
          <ImagesIcon className="size-5" />
          Xem trọn album
        </button>
      </div>
    </section>
  );
}

export function Gratitude({
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
    <section className="mx-auto w-[min(92vw,1000px)] pt-24 pb-40">
      <div className="grid gap-10 lg:grid-cols-2">
        <div data-grind className={`${t.panel} p-6 text-center sm:p-10`}>
          <h2 className={`${t.display} text-[32px]`}>Mừng cưới</h2>
          <p className={`mt-3 ${t.soft}`}>
            Sự hiện diện của quý khách là niềm vinh hạnh của hai gia đình. Nếu
            muốn gửi lời chúc và quà mừng, xin mời bấm vào đây.
          </p>
          <div className="mt-7 flex justify-center">
            <GiftButton
              className={`${t.btn} pl-2 [&>span]:rounded-[3px] [&>span]:bg-[#A4161A] [&>span]:text-[#F3E3C3]`}
            />
          </div>
        </div>
        <div data-grind className={`${t.panel} p-6 sm:p-10`}>
          <h2 className={`${t.display} text-[32px]`}>Xác nhận tham dự</h2>
          {done ? (
            <p className="mt-5 text-[19px]" aria-live="polite">
              Trân trọng cảm ơn {done}. Hẹn gặp quý khách trong ngày vui.
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
                <span className="text-[15px]">Quý danh</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Nguyễn Văn Thành"
                  className="h-12 rounded-[4px] bg-[#2A1810] px-4 ring-1 ring-[#C9A24A]/50 outline-none placeholder:text-[#BFA98A]/60 focus:ring-2 focus:ring-[#C9A24A]"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    [true, "Sẽ đến dự"],
                    [false, "Xin cáo lỗi"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={going === v}
                    onClick={() => setGoing(v)}
                    className="min-h-12 rounded-[4px] px-3 text-[15px] ring-1 ring-[#C9A24A]/40 aria-pressed:bg-[#A4161A] aria-pressed:ring-[#A4161A]"
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
      <div className="mt-28 flex flex-col items-center text-center">
        <div data-grind className="w-[min(78vw,400px)]">
          <Framed
            src={img}
            alt={couple}
            i={-1}
            onView={onView}
            ratio="aspect-[4/5]"
          />
        </div>
        <p
          data-grind
          className={`${t.display} ${t.gold} mt-12 text-[40px] leading-tight sm:text-[56px]`}
        >
          Đa tạ
        </p>
        <p data-grind className={`mt-4 max-w-[36ch] ${t.soft}`}>
          Cảm ơn quý khách đã dành thời gian cho tấm thiệp này. Sự hiện diện của
          quý khách là món quà quý nhất với hai gia đình.
        </p>
        <p
          data-grind
          className={`${t.display} mt-8 text-[26px] text-balance break-words`}
        >
          {couple}
        </p>
      </div>
    </section>
  );
}
