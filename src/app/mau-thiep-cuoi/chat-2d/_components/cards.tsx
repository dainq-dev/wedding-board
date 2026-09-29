"use client";

import {
  ArrowUpRightIcon,
  CalendarPlusIcon,
  ChecksIcon,
  ImagesIcon,
  MapPinIcon,
  PauseIcon,
  PlayIcon,
  PushPinIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { Music } from "@/kit/music";
import type { WeddingData } from "@/wedding/types";
import { buildIcs, weekOf } from "./ics";
import { t } from "./tokens";

const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C2 + C3 · Thẻ thiệp mời được ghim (h1 của trang).
export function InviteCard({
  data,
  date,
  onView,
}: {
  data: WeddingData;
  date: Date;
  onView: (i: number) => void;
}) {
  const { groom, bride, images } = data;
  return (
    <article id="chat-invite" className={`${t.card} mx-auto w-[92%]`}>
      {images[0] && (
        <button
          type="button"
          onClick={() => onView(0)}
          aria-label="Xem lớn ảnh bìa"
          className="block w-full"
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={images[0]}
            alt={`${groom.name} và ${bride.name}`}
            className="aspect-[4/3] w-full object-cover"
          />
        </button>
      )}
      <div className="px-5 pt-5 pb-6 text-center">
        <p className="flex items-center justify-center gap-1.5 text-[12px] font-bold tracking-[0.14em] text-[#2F6BFF] uppercase">
          <PushPinIcon weight="fill" className="size-3.5" />
          Trân trọng kính mời
        </p>
        <h1 className="mt-3 text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance break-words">
          {groom.name} <span className="text-[#D93A6A]">&amp;</span>{" "}
          {bride.name}
        </h1>
        <p className="mt-2 text-[15px] font-medium text-[#334155] capitalize">
          {formatWeekday(date)}, {formatDate(date)}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {(
            [
              ["Nhà trai", groom, images[1], 1],
              ["Nhà gái", bride, images[2], 2],
            ] as const
          ).map(([side, p, img, i]) => (
            <div key={side} className="rounded-xl bg-[#F4F8FF] p-3">
              {img && (
                <button
                  type="button"
                  onClick={() => onView(i)}
                  aria-label={`Xem lớn ảnh ${p.name}`}
                  className="block"
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                  <img
                    src={img}
                    alt={p.name}
                    className="size-14 rounded-full object-cover ring-2 ring-white"
                  />
                </button>
              )}
              <p className={`${t.meta} mt-2`}>{side}</p>
              <p className="text-[14px] font-bold break-words">{p.name}</p>
              <p className="text-[13px] text-[#475569] break-words">
                {p.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// C5 + C11 · Tin "sự kiện lịch": tuần chứa ngày cưới, đếm ngược, tải file .ics.
export function EventCard({ data, date }: { data: WeddingData; date: Date }) {
  const left = useCountdown(date);
  const week = weekOf(date);
  const title = `Đám cưới ${data.groom.name} & ${data.bride.name}`;
  const save = () => {
    const url = URL.createObjectURL(
      new Blob([buildIcs(date, title, data.venue.name ?? "")], {
        type: "text/calendar",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "dam-cuoi.ics";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={t.card}>
      <div className="px-4 pt-4">
        <p className={t.meta}>Sự kiện</p>
        <p className="mt-1 text-[16px] font-bold break-words">{title}</p>
        <p className="text-[14px] text-[#475569] capitalize">
          {formatWeekday(date)}, {formatDate(date)} · {formatTime(date)}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 px-3 text-center">
        {week.map((d, i) => (
          <div
            key={DOW[i]}
            className={`rounded-lg py-1.5 ${d.today ? "bg-[#2F6BFF] text-white" : ""}`}
          >
            <p
              className={`text-[11px] font-bold ${d.today ? "text-white/80" : "text-[#94A3B8]"}`}
            >
              {DOW[i]}
            </p>
            <p className="text-[15px] font-bold tabular-nums">{d.day}</p>
          </div>
        ))}
      </div>
      <p
        className="mt-4 px-4 text-[14px] font-medium tabular-nums text-[#334155]"
        role="timer"
        aria-label="Thời gian còn lại tới ngày cưới"
      >
        {left
          ? left.done
            ? "Hôm nay là ngày cưới"
            : `Còn ${left.days} ngày ${String(left.hours).padStart(2, "0")}:${String(left.minutes).padStart(2, "0")}:${String(left.seconds).padStart(2, "0")}`
          : " "}
      </p>
      <div className="mt-3 border-t border-[#DCE5F3] p-2">
        <button
          type="button"
          onClick={save}
          className={`${t.btn} w-full text-[#2F6BFF] hover:bg-[#F4F8FF]`}
        >
          <CalendarPlusIcon className="size-5" />
          Thêm vào lịch
        </button>
      </div>
    </div>
  );
}

export function Schedule({ date }: { date: Date }) {
  const at = (m: number) => formatTime(new Date(date.getTime() + m * 60_000));
  const rows = [
    [at(-60), "Đón khách"],
    [at(0), "Làm lễ"],
    [at(30), "Khai tiệc"],
    [at(120), "Giao lưu"],
  ];
  return (
    <div className={`${t.bubble} ${t.her}`}>
      <p>Lịch trình nè mọi người:</p>
      <ul className="mt-2 grid gap-1">
        {rows.map(([time, label]) => (
          <li key={label} className="flex gap-3">
            <span className="w-12 font-bold tabular-nums">{time}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// C6 + C7 · Chia sẻ vị trí.
export function LocationCard({
  data,
  date,
}: {
  data: WeddingData;
  date: Date;
}) {
  const { venue } = data;
  return (
    <div className={t.card}>
      <MapEmbed venue={venue} className="aspect-[4/3] w-full" />
      <div className="px-4 pt-3 pb-4">
        <p className="flex items-start gap-1.5 text-[15px] font-bold break-words">
          <MapPinIcon
            weight="fill"
            className="mt-0.5 size-4 shrink-0 text-[#D93A6A]"
          />
          {venue.name ?? "Nhà hàng tiệc cưới"}
        </p>
        <p className="mt-0.5 text-[13px] text-[#475569]">
          Tiệc cưới lúc {formatTime(date)}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${t.btn} mt-3 w-full bg-[#2F6BFF] text-white`}
        >
          Chỉ đường
          <ArrowUpRightIcon className="size-4" weight="bold" />
        </a>
      </div>
    </div>
  );
}

const POLL = [
  { label: "Xanh dương", color: "#2F6BFF", pct: 58 },
  { label: "Hồng", color: "#D93A6A", pct: 33 },
  { label: "Trắng", color: "#CBD5E1", pct: 9 },
];

// C13 · Bình chọn dress code (chỉ cộng cục bộ, không lưu).
export function Poll() {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <fieldset className={`${t.card} px-4 pt-4 pb-3`}>
      <legend className="sr-only">Bình chọn màu trang phục</legend>
      <p className={t.meta}>Bình chọn</p>
      <p className="mt-1 text-[16px] font-bold">Mặc màu gì đi đám cưới?</p>
      <div className="mt-3 grid gap-2">
        {POLL.map((o, i) => {
          const pct =
            pick === null
              ? o.pct
              : Math.round((o.pct * 50 + (pick === i ? 100 : 0)) / 51);
          return (
            <label
              key={o.label}
              className="relative flex min-h-11 cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 ring-1 ring-[#DCE5F3] has-checked:ring-2 has-checked:ring-[#2F6BFF]"
            >
              <span
                data-bar
                aria-hidden="true"
                className="absolute inset-y-0 left-0 origin-left opacity-15 transition-[width] duration-700"
                style={{ width: `${pct}%`, backgroundColor: o.color }}
              />
              <input
                type="radio"
                name="chat-poll"
                checked={pick === i}
                onChange={() => setPick(i)}
                className="relative accent-[#2F6BFF]"
              />
              <span className="relative flex-1 text-[14px] font-medium">
                {o.label}
              </span>
              <span className="relative text-[13px] font-bold tabular-nums">
                {pct}%
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] text-[#475569]">
        Chọn màu nào cũng được, miễn là bạn đến.
      </p>
    </fieldset>
  );
}

const WAVE = [
  6, 12, 18, 10, 22, 16, 8, 20, 14, 24, 10, 18, 12, 6, 16, 22, 12, 8, 18, 10,
  14, 20, 8, 12,
];

// C16 · Tin nhắn thoại: điều khiển chính bài nhạc chung.
export function Voice({ music }: { music: Music }) {
  return (
    <div className={`${t.me} flex w-[72%] items-center gap-3 py-2 pr-4 pl-2`}>
      <button
        type="button"
        onClick={music.toggle}
        aria-label={
          music.playing ? "Tạm dừng bài hát" : "Phát bài hát của chúng tôi"
        }
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2F6BFF] active:scale-95"
      >
        {music.playing ? (
          <PauseIcon weight="fill" className="size-5" />
        ) : (
          <PlayIcon weight="fill" className="size-5" />
        )}
      </button>
      <span
        aria-hidden="true"
        className="flex h-7 flex-1 items-center gap-[3px]"
      >
        {WAVE.map((h, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: dạng sóng tĩnh
            key={i}
            className={`w-[3px] rounded-full bg-white ${music.playing ? "animate-pulse" : "opacity-60"}`}
            style={{ height: h, animationDelay: `${(i % 6) * 120}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

// C14 · Mừng cưới: dùng GiftButton chung.
export function Gift() {
  return (
    <div className={`${t.card} px-4 py-4`}>
      <p className={t.meta}>Mừng cưới</p>
      <p className="mt-1 text-[15px] font-medium text-[#334155]">
        Ai muốn gửi lời chúc và quà mừng thì bấm vào đây nhé. Không có cũng
        không sao, có bạn là vui rồi.
      </p>
      <div className="mt-3">
        <GiftButton
          className={`${t.btn} w-full bg-[#D93A6A] pl-1.5 text-white [&>span]:bg-white/20`}
        />
      </div>
    </div>
  );
}

// C15 · Trả lời tham dự (không gửi dữ liệu đi đâu).
export function Rsvp() {
  const [going, setGoing] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [n, setN] = useState(1);
  const [sent, setSent] = useState<string | null>(null);
  if (sent)
    return (
      <div className="flex w-full flex-col items-end">
        <p className={`${t.bubble} ${t.guest}`}>{sent}</p>
        <p className={`${t.meta} mt-1 flex items-center gap-1`}>
          Đã gửi <ChecksIcon className="size-4 text-[#2F6BFF]" />
        </p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || going === null) return;
        setSent(
          going
            ? `${name.trim()}: Chắc chắn rồi, ${n} người nhé!`
            : `${name.trim()}: Tiếc quá, hôm đó mình bận mất rồi.`,
        );
      }}
      className={`${t.card} grid gap-3 p-4`}
    >
      <p className="text-[15px] font-bold">Bạn có đến được không?</p>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            [true, "Chắc chắn rồi"],
            [false, "Tiếc quá, bận mất"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={label}
            type="button"
            aria-pressed={going === v}
            onClick={() => setGoing(v)}
            className={`${t.btn} px-3 text-[13px] ring-1 ring-[#DCE5F3] aria-pressed:bg-[#2F6BFF] aria-pressed:text-white aria-pressed:ring-[#2F6BFF]`}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="grid gap-1">
        <span className="text-[13px] font-bold">Tên bạn</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          autoComplete="name"
          placeholder="Nguyễn Bảo Ngọc"
          className="h-11 rounded-xl bg-[#F4F8FF] px-3 text-[15px] ring-1 ring-[#DCE5F3] outline-none placeholder:text-[#64748B] focus:ring-2 focus:ring-[#2F6BFF]"
        />
      </label>
      {going && (
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold">Số người</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Bớt một người"
              onClick={() => setN((x) => Math.max(1, x - 1))}
              className={`${t.btn} size-11 px-0 ring-1 ring-[#DCE5F3]`}
            >
              −
            </button>
            <span className="w-8 text-center font-bold tabular-nums">{n}</span>
            <button
              type="button"
              aria-label="Thêm một người"
              onClick={() => setN((x) => Math.min(9, x + 1))}
              className={`${t.btn} size-11 px-0 ring-1 ring-[#DCE5F3]`}
            >
              +
            </button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={!name.trim() || going === null}
        className={`${t.btn} bg-[#2F6BFF] text-white`}
      >
        Gửi trả lời
      </button>
    </form>
  );
}

export function AlbumCard({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${t.card} flex items-center gap-3 p-3 text-left`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F4F8FF] text-[#2F6BFF]">
        <ImagesIcon className="size-6" />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-bold">Album cưới chung</span>
        <span className={t.meta}>{count} ảnh · chạm để xem tất cả</span>
      </span>
      <ArrowUpRightIcon className="size-5 text-[#94A3B8]" />
    </button>
  );
}

export function PinnedBar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-2 border-b border-[#DCE5F3] bg-white/90 px-4 text-left text-[13px] font-medium backdrop-blur"
    >
      <PushPinIcon weight="fill" className="size-4 text-[#2F6BFF]" />
      <span className="truncate">Thiệp mời đám cưới</span>
      <span className={`${t.meta} ml-auto`}>Xem</span>
    </button>
  );
}
