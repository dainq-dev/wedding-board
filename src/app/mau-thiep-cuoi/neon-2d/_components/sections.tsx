"use client";

import { ArrowRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

/** Bản sao soi xuống mặt đường ướt (trang trí, ẩn với trình đọc màn hình). */
function Reflection({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mt-1 h-24 overflow-hidden opacity-35 blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        src={src}
        alt=""
        className="w-full -scale-y-100 object-cover object-bottom"
      />
    </div>
  );
}

// C2 · Biển tên (h1).
export function NameSign({
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
    <section className="mx-auto grid w-[min(92vw,1080px)] items-center gap-12 pt-28 pb-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div data-neon className="text-center lg:text-left">
        <p className={`${t.label} ${t.soft}`}>Trân trọng kính mời</p>
        <h1
          className={`${t.display} mt-5 text-[34px] leading-[1.18] font-semibold uppercase break-words sm:text-[52px] lg:text-[60px]`}
        >
          <span className={`block ${t.pink}`}>{groom.name}</span>
          <span className={`block text-[0.6em] ${t.amber}`}>&amp;</span>
          <span className={`block ${t.pink}`}>{bride.name}</span>
        </h1>
        <span
          aria-hidden="true"
          className="mx-auto mt-7 block h-0.5 w-40 bg-[#2BD2FF] shadow-[0_0_10px_#2BD2FF] lg:mx-0"
        />
        <p
          className={`${t.display} mt-6 text-[15px] tracking-[0.1em] uppercase ${t.cyan} sm:text-[18px]`}
        >
          {formatWeekday(date)} · {formatDate(date).replaceAll("/", ".")}
        </p>
      </div>
      {images[0] && (
        <div data-neon className="mx-auto w-[min(80vw,420px)]">
          <button
            type="button"
            onClick={() => onView(0)}
            aria-label="Xem lớn ảnh bìa"
            className={`block overflow-hidden rounded-2xl ${t.tubeCyan}`}
          >
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={images[0]}
              alt={`${groom.name} và ${bride.name}`}
              className="aspect-[4/5] w-full object-cover"
            />
          </button>
          <Reflection src={images[0]} />
        </div>
      )}
    </section>
  );
}

// C3 · Hai ô cửa sổ sáng đèn.
export function Windows({ data, onView }: { data: WeddingData; onView: View }) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto grid w-[min(92vw,860px)] gap-10 py-24 sm:grid-cols-2 sm:gap-8">
      {(
        [
          ["Nhà trai", "Chú rể", groom, 1, t.tubePink, t.pink],
          ["Nhà gái", "Cô dâu", bride, 2, t.tubeCyan, t.cyan],
        ] as const
      ).map(([house, role, p, i, tube, tone], k) => (
        <figure key={house} data-neon className={k ? "sm:mt-20" : ""}>
          {images[i] && (
            <button
              type="button"
              onClick={() => onView(i)}
              aria-label={`Xem lớn ảnh ${role.toLowerCase()} ${p.name}`}
              className={`relative block overflow-hidden rounded-2xl ${tube}`}
            >
              {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
              <img
                src={images[i]}
                alt={`${role} ${p.name}`}
                className="aspect-[4/5] w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,181,71,0.18),transparent_70%)]"
              />
            </button>
          )}
          <figcaption className="mt-6 text-center">
            <p className={`${t.display} ${t.label} ${tone}`}>{house}</p>
            <p
              className={`${t.display} mt-2 text-[22px] leading-[1.25] font-medium break-words`}
            >
              {p.name}
            </p>
            <p className={`mt-1 text-[15px] ${t.soft} break-words`}>
              {p.address}
            </p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function weekAround(date: Date) {
  const vn = new Date(date.getTime() + 7 * 3_600_000);
  const dow = (vn.getUTCDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => ({
    d: new Date(vn.getTime() + (i - dow) * 86_400_000).getUTCDate(),
    on: i === dow,
  }));
}

// C5 + C11 · Biển ngày, đồng hồ LED và tuần có ngày cưới.
export function DateSign({ date }: { date: Date }) {
  const left = useCountdown(date);
  const day = formatDate(date).slice(0, 2);
  const month = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    month: "long",
  }).format(date);
  return (
    <section className="mx-auto w-[min(92vw,560px)] py-24 text-center">
      <div data-neon className={`${t.sign} ${t.tubeCyan}`}>
        <p className={`${t.display} ${t.label} ${t.soft}`}>{month}</p>
        <p
          className={`${t.display} mt-2 text-[96px] leading-none font-light tabular-nums sm:text-[136px] ${t.cyan}`}
        >
          {day}
        </p>
        <p
          className={`${t.display} mt-3 text-[14px] tracking-[0.12em] uppercase`}
        >
          {formatWeekday(date)} · {formatTime(date)}
        </p>
        <div className="mt-8 grid grid-cols-7 gap-1">
          {weekAround(date).map((w, i) => (
            <div
              key={DOW[i]}
              className={`rounded-xl py-2 ${w.on ? "ring-2 ring-[#FFB547] shadow-[0_0_14px_rgba(255,181,71,0.6)]" : ""}`}
            >
              <p className={`text-[11px] ${t.soft}`}>{DOW[i]}</p>
              <p
                className={`${t.display} text-[16px] tabular-nums ${w.on ? t.amber : ""}`}
              >
                {w.d}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        data-neon
        className="mt-10"
        role="timer"
        aria-label="Thời gian còn lại tới ngày cưới"
      >
        {left?.done ? (
          <p className={`${t.display} text-[18px] ${t.pink}`}>
            Hai đứa mình đã về chung một nhà.
          </p>
        ) : (
          <div className="flex justify-center gap-3 sm:gap-5">
            {(
              [
                ["Ngày", left?.days],
                ["Giờ", left?.hours],
                ["Phút", left?.minutes],
                ["Giây", left?.seconds],
              ] as const
            ).map(([label, v]) => (
              <div
                key={label}
                className="min-w-[4.2rem] rounded-xl bg-[#07040D] px-2 py-3 ring-1 ring-[#2BD2FF]/40"
              >
                <p
                  className={`${t.display} text-[30px] font-light tabular-nums ${t.cyan}`}
                >
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className={`text-[12px] ${t.soft}`}>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// C6 + C7 · Biển lễ vu quy (nhỏ) + biển tiệc cưới có bản đồ.
export function Venue({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto grid w-[min(92vw,1000px)] gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div data-neon className={`${t.sign} ${t.tubeCyan}`}>
        <p
          className={`${t.display} text-[15px] tracking-[0.1em] uppercase ${t.cyan}`}
        >
          Lễ vu quy · {formatTime(vuQuy)}
        </p>
        <p className="mt-3 font-medium">Tư gia nhà gái</p>
        <p className={`text-[15px] ${t.soft} break-words`}>{bride.address}</p>
      </div>
      <div data-neon className={`${t.sign} ${t.tubePink}`}>
        <p
          className={`${t.display} text-[17px] tracking-[0.1em] uppercase ${t.pink}`}
        >
          Tiệc cưới · {formatTime(date)}
        </p>
        <p className="mt-3 text-[18px] font-medium break-words">
          {venue.name ?? "Nhà hàng tiệc cưới"}
        </p>
        <div className="relative mt-5 overflow-hidden rounded-xl">
          <MapEmbed venue={venue} className="aspect-[16/10] w-full" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl ring-4 ring-[#FF3CAC]/25 ring-inset"
          />
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${t.btn} group mt-6`}
        >
          Chỉ đường
          <ArrowRightIcon
            weight="bold"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
}

// C12 · Bảng giờ kiểu bến xe (chữ lật khi bảng bật sáng).
export function Board({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách"],
    [0, "Làm lễ"],
    [30, "Khai tiệc"],
    [120, "Quẩy hết mình"],
  ] as const;
  return (
    <section className="mx-auto w-[min(92vw,560px)] py-24">
      <div
        data-neon
        className="overflow-hidden rounded-2xl bg-[#07040D] ring-1 ring-[#2BD2FF]/40"
      >
        <div
          className={`grid grid-cols-[5.5rem_1fr] gap-4 border-b border-[#2BD2FF]/25 px-5 py-3 ${t.label} ${t.soft}`}
        >
          <span>Giờ</span>
          <span>Sự kiện</span>
        </div>
        {rows.map(([m, label]) => (
          <div
            key={label}
            className={`grid grid-cols-[5.5rem_1fr] gap-4 px-5 py-4 ${t.display} text-[16px] tracking-[0.06em] uppercase sm:text-[18px]`}
          >
            <span data-flip className={`tabular-nums ${t.cyan}`}>
              {formatTime(new Date(date.getTime() + m * 60_000))}
            </span>
            <span data-flip className="text-[#F5F3FF]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// C8 · Ảnh sau cửa kính đọng hơi nước: toàn bộ ảnh, hơi nước được "lau" khi cuộn tới.
export function Steam({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1120px)] py-24">
      <h2
        data-neon
        className={`${t.display} text-center text-[26px] tracking-[0.1em] uppercase sm:text-[36px] ${t.pink}`}
      >
        Khoảnh khắc
      </h2>
      <p className={`mt-3 text-center ${t.soft}`}>
        {images.length} tấm ảnh sau ô kính đọng hơi mưa.
      </p>
      <div className="mt-12 columns-2 gap-3 sm:gap-5 lg:columns-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onView(i)}
            aria-label={`Xem lớn khoảnh khắc ${i + 1}`}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-[#B8B0D6]/15 sm:mb-5"
          >
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={src}
              alt={`Khoảnh khắc ${i + 1}`}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${["aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[2/3]"][i % 4]}`}
            />
            <span
              data-steam
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(160deg,rgba(245,243,255,0.35),rgba(184,176,214,0.25))] backdrop-blur-md"
            />
          </button>
        ))}
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

const TUBES = [
  ["Đen", "#0A0612", "#6B5B8A"],
  ["Tím", "#6B4FA0", "#6B4FA0"],
  ["Hồng", "#FF3CAC", "#FF3CAC"],
  ["Xanh", "#2BD2FF", "#2BD2FF"],
] as const;

export function DressCode() {
  return (
    <section className="mx-auto w-[min(92vw,560px)] py-20 text-center">
      <h2
        className={`${t.display} text-[20px] tracking-[0.12em] uppercase ${t.cyan}`}
      >
        Dress code
      </h2>
      <p className={`mt-2 ${t.soft}`}>
        Tối màu, thêm một điểm sáng neon là vừa đẹp.
      </p>
      <ul className="mt-10 flex justify-center gap-8">
        {TUBES.map(([name, fill, glowC]) => (
          <li key={name} className="flex flex-col items-center gap-3">
            <span
              data-tube
              className="h-28 w-3 rounded-full ring-1 ring-white/20"
              style={{ backgroundColor: fill, boxShadow: `0 0 16px ${glowC}` }}
            />
            <span className="text-[14px]">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GiftAndRsvp() {
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  return (
    <section className="mx-auto grid w-[min(92vw,1000px)] gap-10 py-24 lg:grid-cols-2">
      <div data-neon className={`${t.sign} ${t.tubePink} text-center`}>
        <h2
          className={`${t.display} text-[20px] tracking-[0.1em] uppercase ${t.pink}`}
        >
          Mừng cưới
        </h2>
        <p className={`mt-3 ${t.soft}`}>
          Sự hiện diện của bạn đã là món quà rồi. Nếu muốn gửi thêm lời chúc,
          bấm vào đây nhé.
        </p>
        <div className="mt-6 flex justify-center">
          <GiftButton className={`${t.btn} pl-2 [&>span]:bg-[#0A0612]/15`} />
        </div>
      </div>
      <div data-neon className={`${t.sign} ${t.tubeCyan}`}>
        <h2
          className={`${t.display} text-[20px] tracking-[0.1em] uppercase ${t.cyan}`}
        >
          Xác nhận tham dự
        </h2>
        {done ? (
          <p
            className={`${t.display} mt-6 text-[20px] uppercase ${t.pink}`}
            aria-live="polite"
          >
            Cảm ơn {done}!
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
              <span className="text-[14px] font-medium">Tên của bạn</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoComplete="name"
                placeholder="Lê Hoàng Yến"
                className="h-12 rounded-xl bg-[#07040D] px-4 ring-1 ring-[#2BD2FF]/60 outline-none placeholder:text-[#B8B0D6]/60 focus:ring-2 focus:ring-[#FF3CAC] focus:shadow-[0_0_14px_rgba(255,60,172,0.45)]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  [true, "Mình sẽ đến"],
                  [false, "Tiếc quá, không đến được"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={going === v}
                  onClick={() => setGoing(v)}
                  className="min-h-12 rounded-xl px-3 text-[14px] ring-1 ring-[#B8B0D6]/30 aria-pressed:bg-[#2BD2FF]/15 aria-pressed:ring-[#2BD2FF]"
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="submit" disabled={!name.trim()} className={t.btn}>
              Gửi
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// C10 · Hẹn gặp lại: cửa cuốn kéo xuống theo cuộn, biển vẫn sáng.
export function Closing({
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
      data-closing
      className="relative mx-auto min-h-[120svh] w-[min(92vw,560px)] overflow-hidden pt-20 pb-40 text-center"
    >
      {img && (
        <button
          type="button"
          onClick={onView}
          aria-label="Xem lớn ảnh cuối"
          className={`mx-auto block w-[min(80vw,380px)] overflow-hidden rounded-2xl ${t.tubePink}`}
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={img}
            alt={couple}
            className="aspect-[3/4] w-full object-cover"
          />
        </button>
      )}
      <p className="mt-10">Cảm ơn bạn đã ghé qua con hẻm của chúng mình.</p>
      <p
        className={`${t.display} relative z-10 mt-5 text-[34px] font-semibold tracking-[0.06em] uppercase sm:text-[48px] ${t.pink}`}
      >
        Hẹn gặp lại
      </p>
      <p
        className={`${t.display} relative z-10 mt-3 text-[17px] text-balance break-words ${t.cyan}`}
      >
        {couple}
      </p>
      <div
        data-shutter
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[62%] -translate-y-full rounded-b-lg bg-[repeating-linear-gradient(180deg,#2A2238_0_14px,#1C1628_14px_16px)] shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
      />
    </section>
  );
}
