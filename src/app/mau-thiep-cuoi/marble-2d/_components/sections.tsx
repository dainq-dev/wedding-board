"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { ArchPhoto, Heading, initial, Rule } from "./stone";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

// C2 · Vòm ảnh bìa + tên (h1).
export function Cover({
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
    <section className="mx-auto flex w-[min(92vw,720px)] flex-col items-center pt-24 pb-20 text-center">
      <p data-rise className={t.label}>
        Chúng tôi sắp về chung một nhà
      </p>
      <div data-rise className="mt-10 w-[min(76vw,380px)]">
        <ArchPhoto
          src={images[0]}
          alt={`${groom.name} và ${bride.name}`}
          onClick={() => onView(0)}
        />
      </div>
      <h1
        data-shine
        className={`${t.display} ${t.gold} mt-12 text-[34px] leading-[1.15] tracking-[0.08em] uppercase break-words sm:text-[56px]`}
      >
        <span className="block">{groom.name}</span>
        <span className="block text-[0.55em] tracking-normal normal-case">
          và
        </span>
        <span className="block">{bride.name}</span>
      </h1>
      <Rule className="mt-8" />
      <p
        data-rise
        className="mt-6 text-[14px] font-semibold tracking-[0.3em] uppercase"
      >
        {formatWeekday(date)}
      </p>
      <p data-rise className={`${t.display} text-[26px] tabular-nums`}>
        {formatDate(date).replaceAll("/", " . ")}
      </p>
    </section>
  );
}

// C3 · Hai gia đình: đối xứng qua trục vàng giữa.
export function Families({
  data,
  onView,
}: {
  data: WeddingData;
  onView: View;
}) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto w-[min(94vw,880px)] py-20">
      <Heading label="Trân trọng kính mời" title="Hai gia đình" />
      <div className="relative mt-14 grid grid-cols-2 gap-6 sm:gap-16">
        <span
          data-axis
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1/2 w-px origin-top bg-[#B08D57]/60"
        />
        {(
          [
            ["Nhà trai", "Chú rể", groom, 1],
            ["Nhà gái", "Cô dâu", bride, 2],
          ] as const
        ).map(([house, role, p, i]) => (
          <figure key={house} data-rise className="text-center">
            <ArchPhoto
              src={images[i]}
              alt={`${role} ${p.name}`}
              onClick={() => onView(i)}
            />
            <figcaption className="mt-6">
              <p className={t.label}>{house}</p>
              <p
                className={`${t.display} mt-2 text-[22px] leading-tight break-words sm:text-[30px]`}
              >
                {p.name}
              </p>
              <p
                className={`mt-2 text-[14px] ${t.soft} line-clamp-3 break-words`}
              >
                {p.address}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// Vòm mở theo cuộn: ảnh lớn lộ dần qua khung vòm (dùng cho chuyện tình).
export function ArchReveal({
  src,
  i,
  title,
  text,
  onView,
}: {
  src?: string;
  i: number;
  title: string;
  text: string;
  onView: View;
}) {
  if (!src) return null;
  return (
    <section data-reveal className="relative h-[100svh] overflow-hidden">
      <div className="relative flex h-full items-center justify-center">
        <button
          data-reveal-img
          type="button"
          onClick={() => onView(i)}
          aria-label={`Xem lớn ảnh ${title}`}
          className="absolute inset-0 [clip-path:inset(0_round_0)]"
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="size-full object-cover grayscale-[15%]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(31,31,31,0.65),transparent_55%)]"
          />
        </button>
        <div
          data-reveal-text
          className="pointer-events-none absolute inset-x-0 bottom-[10svh] px-6 text-center text-[#F7F5F2] lg:inset-x-[33%] lg:bottom-[9svh]"
        >
          <p className="text-[12px] font-semibold tracking-[0.3em] uppercase">
            {title}
          </p>
          <p
            className={`${t.display} mx-auto mt-3 max-w-[22ch] text-[26px] leading-snug sm:text-[34px]`}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C5 + C11 · Khối onyx: ngày cưới, lịch, đếm ngược.
export function Onyx({ date }: { date: Date }) {
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
    <section className="bg-[#1F1F1F] py-24 text-[#E9E4DC]">
      <div className="mx-auto w-[min(92vw,640px)] text-center">
        <p className="text-[12px] font-semibold tracking-[0.3em] text-[#E4CFA0] uppercase">
          Tháng {m + 1} năm {y}
        </p>
        <p
          data-count={day}
          className={`${t.display} ${t.gold} mt-4 text-[120px] leading-none tabular-nums sm:text-[160px]`}
        >
          {day}
        </p>
        <p className="mt-3 text-[14px] tracking-[0.3em] uppercase">
          {formatWeekday(date)}, {formatTime(date)}
        </p>
        <div className="mx-auto mt-10 grid max-w-sm grid-cols-7 gap-y-2 text-[14px]">
          {WEEK.map((w) => (
            <span key={w} className="text-[12px] text-[#E9E4DC]/60">
              {w}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
              key={i}
              className={`mx-auto flex size-9 items-center justify-center rounded-full tabular-nums ${c === day ? "text-[#E4CFA0] ring-1 ring-[#B08D57]" : ""}`}
            >
              {c ?? ""}
            </span>
          ))}
        </div>
        <div
          className="mx-auto mt-10 grid max-w-md grid-cols-4 border-t border-[#B08D57]/40 pt-8"
          role="timer"
          aria-label="Thời gian còn lại tới ngày cưới"
        >
          {left?.done ? (
            <p className="col-span-4 text-[13px] tracking-[0.25em] uppercase">
              Chúng tôi đã về chung một nhà
            </p>
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
                <p className={`${t.display} text-[32px] tabular-nums`}>
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className="text-[11px] tracking-[0.2em] text-[#E9E4DC]/70 uppercase">
                  {label}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// C12 · Lịch trình zigzag quanh trục vàng.
export function Order({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách", "Tiệc trà chào mừng tại sảnh"],
    [0, "Lễ thành hôn", "Nghi thức trao nhẫn trước hai họ"],
    [30, "Khai tiệc", "Nâng ly chúc mừng"],
    [120, "Giao lưu", "Âm nhạc và khiêu vũ"],
  ] as const;
  return (
    <section className="mx-auto w-[min(94vw,760px)] py-24">
      <Heading label="Trình tự buổi lễ" title="Một ngày trọn vẹn" />
      <ol className="relative mt-14">
        <span
          data-axis
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1/2 w-px origin-top bg-[#B08D57]"
        />
        {rows.map(([mm, title, note], k) => (
          <li
            key={title}
            data-side={k % 2 ? "r" : "l"}
            className="relative grid grid-cols-2 gap-10 py-6 sm:gap-16"
          >
            <span
              aria-hidden="true"
              className="absolute top-8 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#B08D57] ring-4 ring-[#F7F5F2]"
            />
            <div className={k % 2 ? "col-start-2" : "text-right"}>
              <p className={`${t.display} ${t.deep} text-[28px] tabular-nums`}>
                {formatTime(new Date(date.getTime() + mm * 60_000))}
              </p>
              <p className="font-semibold">{title}</p>
              <p className={`text-[14px] ${t.soft}`}>{note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// C6 + C7 · Hai lễ và bản đồ.
export function Venue({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto w-[min(94vw,880px)] py-20">
      <Heading label="Địa điểm" title="Nơi hai họ gặp gỡ" />
      <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-10">
        {(
          [
            ["Lễ vu quy", formatTime(vuQuy), "Tư gia nhà gái", bride.address],
            [
              "Tiệc cưới",
              formatTime(date),
              venue.name ?? "Trung tâm tiệc cưới",
              "Đón khách trước một giờ",
            ],
          ] as const
        ).map(([title, time, place, note]) => (
          <div
            key={title}
            data-rise
            className="rounded-t-full rounded-b-2xl bg-white/80 px-4 pt-14 pb-8 text-center ring-1 ring-[#B08D57] sm:px-8"
          >
            <p className={t.label}>{title}</p>
            <p className={`${t.display} mt-3 text-[34px] tabular-nums`}>
              {time}
            </p>
            <p className="mt-2 font-semibold break-words">{place}</p>
            <p className={`mt-1 text-[14px] ${t.soft} break-words`}>{note}</p>
          </div>
        ))}
      </div>
      <div
        data-rise
        className="mt-10 rounded-2xl bg-white p-1.5 ring-1 ring-[#B08D57]"
      >
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

const TONES = [
  ["Trắng ngà", "#F4EFE6"],
  ["Kem", "#E7DCC8"],
  ["Vàng champagne", "#D8C08F"],
  ["Đen", "#1F1F1F"],
] as const;

export function Attire() {
  return (
    <section className="mx-auto w-[min(92vw,640px)] py-16 text-center">
      <Heading label="Trang phục" title="Trang trọng, thanh lịch" />
      <ul className="mt-10 flex justify-center gap-5 sm:gap-8">
        {TONES.map(([name, c]) => (
          <li key={name} className="flex w-16 flex-col items-center gap-3">
            <span
              data-swatch
              className="size-14 rounded-full ring-1 ring-[#B08D57] ring-offset-4 ring-offset-[#F7F5F2]"
              style={{ backgroundColor: c }}
            />
            <span className="text-[13px] leading-tight">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// C8 · Hành lang vòm: toàn bộ ảnh, lưới đối xứng.
export function Gallery({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1080px)] py-24">
      <Heading label="Album cưới" title="Hành lang vòm" />
      <p className={`mt-4 text-center ${t.soft}`}>
        {images.length} khoảnh khắc được lưu giữ.
      </p>
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
        {images.map((src, i) => (
          <div
            key={src}
            data-arch-tile
            className={i % 3 === 1 ? "sm:translate-y-10" : ""}
          >
            <ArchPhoto
              src={src}
              alt={`Khoảnh khắc ${i + 1}`}
              onClick={() => onView(i)}
            />
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center">
        <button type="button" onClick={onAll} className={t.btn}>
          <ImagesIcon className="size-5" />
          Xem trọn album
        </button>
      </div>
    </section>
  );
}

export function Closing({
  data,
  img,
  onView,
}: {
  data: WeddingData;
  img?: string;
  onView: () => void;
}) {
  const { groom, bride } = data;
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  return (
    <section className="mx-auto w-[min(94vw,880px)] pt-16 pb-40">
      <div className="grid gap-8 sm:grid-cols-2">
        <div
          data-rise
          className="rounded-2xl bg-white/85 p-8 text-center ring-1 ring-[#B08D57]"
        >
          <p className={t.label}>Mừng cưới</p>
          <p className={`mt-4 ${t.soft}`}>
            Sự hiện diện của quý khách là niềm vinh hạnh của hai gia đình. Nếu
            muốn gửi lời chúc, xin mời bấm vào đây.
          </p>
          <div className="mt-6 flex justify-center">
            <GiftButton
              className={`${t.btn} pl-2 [&>span]:rounded-full [&>span]:bg-[#B08D57]`}
            />
          </div>
        </div>
        <div
          data-rise
          className="rounded-2xl bg-white/85 p-8 ring-1 ring-[#B08D57]"
        >
          <p className={`${t.label} text-center`}>Xác nhận tham dự</p>
          {done ? (
            <p
              className={`${t.display} mt-6 text-center text-[22px]`}
              aria-live="polite"
            >
              Trân trọng cảm ơn {done}.
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
                <span className="text-[14px] font-semibold">Quý danh</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Trương Gia Bảo"
                  className="h-12 border-b border-[#B08D57] bg-transparent px-1 outline-none placeholder:text-[#6E6A64]/70 focus:border-[#1F1F1F]"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    [true, "Sẽ tham dự"],
                    [false, "Xin cáo lỗi"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={going === v}
                    onClick={() => setGoing(v)}
                    className="min-h-12 rounded-[2px] text-[14px] ring-1 ring-[#B08D57] aria-pressed:bg-[#1F1F1F] aria-pressed:text-[#F7F5F2]"
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
        <div data-rise className="w-[min(70vw,320px)]">
          <ArchPhoto
            src={img}
            alt={`${groom.name} và ${bride.name}`}
            onClick={onView}
          />
        </div>
        <p
          data-shine
          className={`${t.display} ${t.gold} mt-12 text-[64px] leading-none`}
        >
          {initial(groom.name)}
          <span className="mx-3 inline-block h-[0.7em] w-px bg-[#B08D57] align-middle" />
          {initial(bride.name)}
        </p>
        <p data-rise className={`mt-6 max-w-[36ch] ${t.soft}`}>
          Trân trọng cảm ơn quý khách đã dành thời gian cho tấm thiệp này. Rất
          mong được đón tiếp quý khách trong ngày vui.
        </p>
        <p
          data-rise
          className="mt-5 text-[13px] font-semibold tracking-[0.3em] uppercase text-balance"
        >
          {groom.name} &amp; {bride.name}
        </p>
      </div>
    </section>
  );
}
