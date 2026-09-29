"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { Couplet, Motif, Plate, Sheet } from "./print";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

// C2 · Tranh "Tin vui" (h1) với cột câu đối.
export function TinVui({
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
    <section className="mx-auto flex w-[min(94vw,640px)] flex-col items-center gap-5 pt-24 pb-20 sm:flex-row sm:items-start sm:gap-6">
      <p
        aria-hidden="true"
        className={`${t.display} text-[18px] font-bold ${t.red} sm:hidden`}
      >
        Trăm năm hạnh phúc
      </p>
      <Couplet text="Trăm năm hạnh phúc" className="mt-10 hidden sm:flex" />
      <Sheet className="w-full">
        <div className="text-center">
          <p className={t.band}>Trân trọng báo tin vui</p>
          <div className="mx-auto mt-7 w-[82%]">
            <Plate
              src={images[0]}
              alt={`${groom.name} và ${bride.name}`}
              onClick={() => onView(0)}
            />
          </div>
          <h1
            className={`${t.display} mt-8 text-[40px] leading-[1.12] font-bold break-words ${t.red} sm:text-[56px]`}
          >
            <span className="block">{groom.name}</span>
            <span className={`block text-[0.45em] font-semibold ${t.green}`}>
              sánh duyên
            </span>
            <span className="block">{bride.name}</span>
          </h1>
          <Motif className="my-7" />
          <p
            className={`${t.display} text-[20px] font-bold tracking-[0.06em] uppercase`}
          >
            {formatWeekday(date)} {formatDate(date).replaceAll("/", ".")}
          </p>
        </div>
      </Sheet>
      <Couplet text="Một nhà sum vầy" className="mt-24 hidden sm:flex" />
    </section>
  );
}

// C3 · Đôi tranh treo cạnh nhau: nhà trai, nhà gái.
export function Pair({ data, onView }: { data: WeddingData; onView: View }) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto grid w-[min(94vw,880px)] gap-10 py-20 sm:grid-cols-2 sm:gap-8">
      {(
        [
          ["Nhà trai", groom, 1, "red"],
          ["Nhà gái", bride, 2, "green"],
        ] as const
      ).map(([house, p, i, tone], k) => (
        <Sheet key={house} tone={tone} className={k ? "sm:mt-16" : ""}>
          <p className={t.band}>{house}</p>
          <Plate
            src={images[i]}
            alt={`${house} ${p.name}`}
            onClick={() => onView(i)}
            className="mt-6"
          />
          <p
            className={`${t.display} mt-6 text-[30px] leading-tight font-bold break-words ${tone === "red" ? t.red : t.green}`}
          >
            {p.name}
          </p>
          <p className={`mt-1 text-[16px] ${t.soft} break-words`}>
            {p.address}
          </p>
        </Sheet>
      ))}
    </section>
  );
}

const STORY = [
  [
    "Gặp gỡ",
    "Chào em!",
    "Hội làng năm ấy, anh đứng xem hát quan họ, còn em đứng ngay bên cạnh.",
  ],
  [
    "Thương nhau",
    "Mình đi đâu đấy?",
    "Từ đó, đi đâu cũng có nhau: chợ Tết, bến sông, những mùa lúa chín.",
  ],
  [
    "Hỏi cưới",
    "Về làm vợ anh nhé!",
    "Anh mang trầu cau sang hỏi, và em cười gật đầu.",
  ],
] as const;

// C4 · Ba tờ tranh chuyện tình xếp so le, có bong bóng thoại cuộn giấy.
export function Story({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="mx-auto flex w-[min(94vw,720px)] flex-col gap-14 py-20">
      {STORY.map(([title, say, text], k) => (
        <Sheet
          key={title}
          tone={k % 2 ? "green" : "red"}
          className={["-rotate-[1.5deg]", "rotate-1 sm:ml-16", "-rotate-1"][k]}
        >
          <p
            className={`${t.display} text-[15px] font-bold tracking-[0.12em] uppercase ${t.soft}`}
          >
            Tranh số {k + 1}
          </p>
          <h2
            className={`${t.display} mt-1 text-[34px] leading-tight font-bold ${k % 2 ? t.green : t.red}`}
          >
            {title}
          </h2>
          <div className="relative mt-5">
            <Plate
              src={images[k]}
              alt={title}
              onClick={() => onView(3 + k)}
              ratio="aspect-[4/3]"
            />
            <p
              data-bubble
              className="absolute -right-2 -bottom-4 max-w-[60%] bg-[#F7ECD6] px-4 py-2 text-[16px] font-semibold ring-[3px] ring-[#2B1D12] shadow-[3px_3px_0_#D9A628]"
            >
              {say}
            </p>
          </div>
          <p className={`mt-8 ${t.soft}`}>{text}</p>
        </Sheet>
      ))}
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function monthOf(date: Date) {
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

// C5 + C11 · Tranh lịch: ngày lành tháng tốt.
export function Calendar({ date }: { date: Date }) {
  const { cells, day, m, y } = monthOf(date);
  const left = useCountdown(date);
  return (
    <section className="mx-auto w-[min(94vw,560px)] py-20">
      <Sheet tone="green">
        <p className={t.band}>Ngày lành tháng tốt</p>
        <div className="mt-6 text-center">
          <p className={`${t.display} text-[18px] font-bold`}>
            Tháng {m} năm {y}
          </p>
          <p
            className={`${t.display} text-[112px] leading-none font-extrabold tabular-nums sm:text-[140px]`}
          >
            {pad(day)}
          </p>
          <p
            className={`${t.display} text-[18px] font-bold tracking-[0.1em] uppercase ${t.red}`}
          >
            {formatWeekday(date)}, {formatTime(date)}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-y-1 border-t-[3px] border-[#2B1D12] pt-4 text-center">
          {WEEK.map((w) => (
            <span key={w} className={`text-[13px] font-semibold ${t.soft}`}>
              {w}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
              key={i}
              className={`relative mx-auto flex size-9 items-center justify-center tabular-nums ${c === day ? "font-bold text-[#F7ECD6]" : ""}`}
            >
              {c === day && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-x-[2px] translate-y-[2px] rotate-45 bg-[#D9A628]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-1 rotate-45 bg-[#B5382A] ring-2 ring-[#2B1D12]"
                  />
                </>
              )}
              <span className="relative">{c ?? ""}</span>
            </span>
          ))}
        </div>
        <div
          className="mt-6 grid grid-cols-4 border-t-[3px] border-[#2B1D12] pt-5 text-center"
          role="timer"
          aria-label="Thời gian còn lại tới ngày cưới"
        >
          {left?.done ? (
            <p className="col-span-4 font-semibold">
              Đôi ta đã thành đôi, thành lứa.
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
                <p
                  className={`${t.display} text-[30px] font-extrabold tabular-nums`}
                >
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className={`text-[13px] font-semibold ${t.soft}`}>{label}</p>
              </div>
            ))
          )}
        </div>
      </Sheet>
    </section>
  );
}

// C12 · Lịch trình dạng đoàn rước: bốn "trạm" nối bằng dải băng đỏ.
export function Procession({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách"],
    [0, "Làm lễ"],
    [30, "Khai tiệc"],
    [120, "Giao lưu"],
  ] as const;
  return (
    <section className="mx-auto w-[min(94vw,960px)] py-20">
      <h2 className={`${t.display} text-center text-[32px] font-bold ${t.red}`}>
        Đoàn rước
      </h2>
      <ol className="relative mt-12 grid gap-8 sm:grid-cols-4 sm:gap-4">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-7 w-1.5 bg-[#B5382A] sm:top-7 sm:right-0 sm:bottom-auto sm:left-0 sm:h-1.5 sm:w-auto"
        />
        {rows.map(([mm, label], k) => (
          <li
            key={label}
            data-station
            className="relative flex items-center gap-5 sm:flex-col sm:text-center"
          >
            <span
              className={`relative flex size-14 shrink-0 items-center justify-center ${k % 2 ? "bg-[#2F5D50]" : "bg-[#D9A628]"} ring-[3px] ring-[#2B1D12] shadow-[3px_3px_0_#2B1D12]`}
            >
              <span
                className={`${t.display} text-[20px] font-extrabold ${k % 2 ? "text-[#F7ECD6]" : "text-[#2B1D12]"}`}
              >
                {k + 1}
              </span>
            </span>
            <span>
              <span
                className={`${t.display} block text-[26px] font-extrabold tabular-nums`}
              >
                {formatTime(new Date(date.getTime() + mm * 60_000))}
              </span>
              <span className="block font-semibold">{label}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// C6 + C7 · Hai lễ và bản đồ.
export function Places({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto w-[min(94vw,880px)] py-20">
      <div className="grid gap-8 sm:grid-cols-2">
        <Sheet>
          <p className={t.band}>Lễ vu quy</p>
          <p
            className={`${t.display} mt-5 text-[36px] font-extrabold tabular-nums`}
          >
            {formatTime(vuQuy)}
          </p>
          <p className="font-semibold">Tư gia nhà gái</p>
          <p className={`text-[16px] ${t.soft} break-words`}>{bride.address}</p>
        </Sheet>
        <Sheet tone="green">
          <p className={t.band}>Tiệc cưới</p>
          <p
            className={`${t.display} mt-5 text-[36px] font-extrabold tabular-nums`}
          >
            {formatTime(date)}
          </p>
          <p className="font-semibold break-words">
            {venue.name ?? "Nhà hàng tiệc cưới"}
          </p>
          <p className={`text-[16px] ${t.soft}`}>
            Mời bà con cô bác đến sớm cho vui.
          </p>
        </Sheet>
      </div>
      <div className="mt-8 ring-[3px] ring-[#2B1D12] shadow-[8px_10px_0_rgba(43,29,18,0.12)]">
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

const BANDS = ["bg-[#B5382A]", "bg-[#2F5D50]", "bg-[#D9A628]"];

// C8 · Xấp tranh tờ rời: toàn bộ ảnh.
export function Stack({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1100px)] py-20">
      <h2
        className={`${t.display} text-center text-[34px] font-bold ${t.red} sm:text-[44px]`}
      >
        Xấp tranh kỷ niệm
      </h2>
      <p className={`mt-2 text-center ${t.soft}`}>
        {images.length} tờ tranh, mỗi tờ một khoảnh khắc.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {images.map((src, i) => (
          <figure
            key={src}
            data-leafprint
            className={`${t.sheet} p-2 ${i % 3 === 1 ? "sm:translate-y-6" : ""} ${i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.8deg]"}`}
          >
            <span aria-hidden="true" className={`block h-2 ${BANDS[i % 3]}`} />
            <Plate
              src={src}
              alt={`Khoảnh khắc ${i + 1}`}
              onClick={() => onView(i)}
              className="mt-2"
            />
          </figure>
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <button type="button" onClick={onAll} className={t.btn}>
          <ImagesIcon className="size-5" />
          Xem trọn album
        </button>
      </div>
    </section>
  );
}

const TRAYS = [
  ["Đỏ son", "#B5382A"],
  ["Xanh chàm", "#2F5D50"],
  ["Vàng hoè", "#D9A628"],
  ["Trắng điệp", "#F7ECD6"],
] as const;

export function Colors() {
  return (
    <section className="mx-auto w-[min(94vw,640px)] py-16 text-center">
      <h2 className={`${t.display} text-[30px] font-bold`}>Trang phục</h2>
      <p className={`mt-2 ${t.soft}`}>
        Áo dài, áo bà ba hay trang phục lịch sự đều đẹp. Gợi ý theo màu tranh:
      </p>
      <ul className="mt-8 grid grid-cols-4 gap-3">
        {TRAYS.map(([name, c]) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <span
              className="aspect-square w-full ring-[3px] ring-[#2B1D12] shadow-[3px_3px_0_#2B1D12]"
              style={{ backgroundColor: c }}
            />
            <span className="text-[14px] font-semibold">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Finale({
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
    <section className="mx-auto w-[min(94vw,880px)] pt-20 pb-40">
      <div className="grid gap-8 sm:grid-cols-2">
        <Sheet>
          <p className={t.band}>Mừng cưới</p>
          <p className={`mt-5 ${t.soft}`}>
            Có bà con cô bác đến chung vui là quý nhất rồi. Ai muốn gửi lời chúc
            và quà mừng thì bấm vào đây.
          </p>
          <div className="mt-6">
            <GiftButton
              className={`${t.btn} pl-2 [&>span]:rounded-none [&>span]:bg-[#D9A628] [&>span]:text-[#2B1D12]`}
            />
          </div>
        </Sheet>
        <Sheet tone="green">
          <p className={t.band}>Báo tin đến dự</p>
          {done ? (
            <p className="mt-5 text-[19px] font-semibold" aria-live="polite">
              Cảm ơn {done}! Hẹn gặp ở đám cưới nhé.
            </p>
          ) : (
            <form
              className="mt-5 grid gap-3"
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
                  placeholder="Phạm Thị Hồng"
                  className="h-12 bg-[#F7ECD6] px-3 ring-[3px] ring-[#2B1D12] outline-none placeholder:text-[#6B5540]/70 focus:ring-[#B5382A]"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    [true, "Sẽ đến"],
                    [false, "Bận mất rồi"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={going === v}
                    onClick={() => setGoing(v)}
                    className="min-h-12 px-2 font-semibold ring-[3px] ring-[#2B1D12] aria-pressed:bg-[#2F5D50] aria-pressed:text-[#F7ECD6]"
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
        </Sheet>
      </div>
      <div className="mt-24 flex flex-col items-center text-center">
        <div className="w-[min(76vw,360px)]">
          <Sheet>
            <Plate src={img} alt={couple} onClick={onView} />
          </Sheet>
        </div>
        <p
          className={`${t.display} mt-12 text-[40px] leading-tight font-extrabold ${t.red} sm:text-[52px]`}
        >
          Đa tạ bà con
        </p>
        <p className={`mt-3 max-w-[34ch] ${t.soft}`}>
          Cảm ơn bạn đã xem hết xấp tranh. Hẹn gặp ở đám cưới, có trầu cau, có
          tiếng trống, có cả hai đứa.
        </p>
        <p
          className={`${t.display} mt-6 text-[26px] font-bold text-balance break-words`}
        >
          {couple}
        </p>
      </div>
    </section>
  );
}
