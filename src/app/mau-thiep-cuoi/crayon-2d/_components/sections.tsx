"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import type { WeddingData } from "@/wedding/types";
import { Circle, Scribble, StickCouple, Tape, Underline } from "./draw";
import { t } from "./tokens";

type View = (i: number) => void;
const pad = (n: number) => String(n).padStart(2, "0");

function Title({ children, color }: { children: string; color?: string }) {
  return (
    <div data-pop className="flex flex-col items-center">
      <h2 className={`${t.display} text-[30px] sm:text-[38px]`}>{children}</h2>
      <Underline color={color} className="-mt-1" />
    </div>
  );
}

/** Ảnh dán băng keo trong khung sáp. */
function Taped({
  src,
  alt,
  onClick,
  tilt = "-rotate-2",
  color,
  ratio = "aspect-[4/5]",
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  tilt?: string;
  color?: string;
  ratio?: string;
}) {
  if (!src) return null;
  return (
    <Scribble color={color} className={tilt}>
      <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-6" />
      <button
        type="button"
        onClick={onClick}
        aria-label={`Xem lớn ảnh ${alt}`}
        className="block w-full overflow-hidden rounded-3xl"
      >
        {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full object-cover ${ratio}`}
        />
      </button>
    </Scribble>
  );
}

// C2 · "Tụi mình cưới nè!" (h1).
export function Hello({
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
    <section className="mx-auto grid w-[min(92vw,1000px)] items-center gap-12 pt-24 pb-16 lg:grid-cols-2">
      <div className="text-center lg:text-left">
        <p data-pop className={`text-[22px] ${t.blue}`}>
          Tụi mình cưới nè!
        </p>
        <h1
          data-pop
          className={`${t.display} mt-3 -rotate-2 text-[44px] leading-[1.1] break-words sm:text-[68px]`}
        >
          <span className={`block ${t.pink}`}>{groom.name}</span>
          <span className="block text-[0.5em]">và</span>
          <span className={`block ${t.blue}`}>{bride.name}</span>
        </h1>
        <p
          data-pop
          className="relative mt-8 inline-block px-6 py-3 text-[22px] capitalize"
        >
          <Circle className="-inset-2 size-[calc(100%+1rem)]" color="#FFD23F" />
          {formatWeekday(date)}, {formatDate(date)}
        </p>
      </div>
      <div data-pop className="mx-auto w-[min(78vw,400px)]">
        <Taped
          src={images[0]}
          alt={`${groom.name} và ${bride.name}`}
          onClick={() => onView(0)}
          tilt="rotate-2"
        />
      </div>
    </section>
  );
}

// C3 · Hai người que + ảnh thật.
export function Two({ data, onView }: { data: WeddingData; onView: View }) {
  const { groom, bride, images } = data;
  return (
    <section className="mx-auto w-[min(92vw,900px)] py-20 text-center">
      <Title>Hai đứa tụi mình</Title>
      <StickCouple className="mx-auto mt-6 w-[min(64vw,300px)]" />
      <div className="mt-8 grid grid-cols-2 gap-6 sm:gap-12">
        {(
          [
            ["Chú rể", groom, 1, "#4EA8DE", "-rotate-3"],
            ["Cô dâu", bride, 2, "#FF6B9A", "rotate-3"],
          ] as const
        ).map(([role, p, i, color, tilt]) => (
          <figure key={role} data-pop>
            <Taped
              src={images[i]}
              alt={`${role} ${p.name}`}
              onClick={() => onView(i)}
              color={color}
              tilt={tilt}
            />
            <figcaption className="mt-6">
              <p className={`text-[16px] ${t.soft}`}>{role}</p>
              <p
                className={`${t.display} text-[26px] leading-tight break-words ${i === 1 ? t.blue : t.pink}`}
              >
                {p.name}
              </p>
              <p className={`mt-1 text-[16px] ${t.soft} break-words`}>
                {p.address}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const COMIC = [
  [
    "Gặp nhau",
    "Hai đứa cùng xếp hàng mua kem, còn đúng một que vị dâu.",
    "#FF6B9A",
  ],
  [
    "Thích nhau",
    "Từ đó chia nhau mọi thứ: kem, ô, tai nghe, và cả tim.",
    "#4EA8DE",
  ],
  ["Cưới nhau", "Anh vẽ chiếc nhẫn lên tay em, rồi mua chiếc thật.", "#6CC56B"],
] as const;

// C4 · Truyện ba khung.
export function Comic({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: View;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1080px)] py-20 text-center">
      <Title color="#FF6B9A">Chuyện tụi mình</Title>
      <ol className="mt-12 grid gap-12 sm:grid-cols-3 sm:gap-8">
        {COMIC.map(([title, text, color], k) => (
          <li
            key={title}
            data-pop
            className={["-rotate-1", "rotate-1 sm:mt-10", "-rotate-2"][k]}
          >
            <Scribble color={color} className="bg-white/70 p-4">
              {images[k] && (
                <button
                  type="button"
                  onClick={() => onView(3 + k)}
                  aria-label={`Xem lớn ảnh ${title}`}
                  className="block w-full overflow-hidden rounded-2xl"
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                  <img
                    src={images[k]}
                    alt={title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              )}
              <p className={`${t.display} mt-4 text-[24px]`}>
                {k + 1}. {title}
              </p>
              <p className={`mt-1 ${t.soft}`}>{text}</p>
            </Scribble>
          </li>
        ))}
      </ol>
    </section>
  );
}

const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// C5 + C11 · Ngày cưới trong vòng tô tròn, lịch tháng, đếm ngược.
export function Day({ date }: { date: Date }) {
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
    <section className="mx-auto grid w-[min(92vw,960px)] items-center gap-12 py-20 lg:grid-cols-2">
      <div data-pop className="text-center">
        <p className={`text-[22px] ${t.blue}`}>Ngày vui của tụi mình</p>
        <p
          className={`${t.display} relative mx-auto mt-2 w-fit px-10 py-6 text-[104px] leading-none tabular-nums ${t.pink} sm:text-[140px]`}
        >
          <Circle className="inset-0 size-full" />
          {day}
        </p>
        <p className="text-[22px] capitalize">
          {formatWeekday(date)}, tháng {m + 1} năm {y}
        </p>
        <p className={t.soft}>Tiệc lúc {formatTime(date)}</p>
      </div>
      <div data-pop>
        <Scribble color="#4EA8DE" className="bg-white/70 p-5">
          <div className="grid grid-cols-7 gap-y-1 text-center text-[17px]">
            {WEEK.map((w) => (
              <span key={w} className={`text-[15px] ${t.soft}`}>
                {w}
              </span>
            ))}
            {cells.map((c, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: ô trống lặp giá trị, vị trí cố định theo tháng
                key={i}
                className={`relative mx-auto flex size-9 items-center justify-center tabular-nums ${c === day ? `${t.display} ${t.pink}` : ""}`}
              >
                {c === day && (
                  <Circle className="-inset-1 size-[calc(100%+0.5rem)]" />
                )}
                {c ?? ""}
              </span>
            ))}
          </div>
          <div
            className="mt-5 grid grid-cols-4 border-t-2 border-dashed border-[#4EA8DE]/50 pt-4 text-center"
            role="timer"
            aria-label="Thời gian còn lại tới ngày cưới"
          >
            {left?.done ? (
              <p className="col-span-4">Tụi mình cưới rồi nè!</p>
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
                  <p className={`${t.display} text-[30px] tabular-nums`}>
                    {v === undefined ? "--" : pad(v)}
                  </p>
                  <p className={`text-[15px] ${t.soft}`}>{label}</p>
                </div>
              ))
            )}
          </div>
        </Scribble>
      </div>
    </section>
  );
}

const BANDS = ["#FF6B9A", "#FFB21A", "#6CC56B", "#4EA8DE"];

// C12 · Lịch trình cầu vồng.
export function Rainbow({ date }: { date: Date }) {
  const rows = [
    [-60, "Đón khách", "Chụp ảnh cùng cô dâu chú rể"],
    [0, "Làm lễ", "Trao nhẫn, thơm má"],
    [30, "Ăn tiệc", "Ăn no, cười nhiều"],
    [120, "Quẩy", "Hát, nhảy, chơi trò chơi"],
  ] as const;
  return (
    <section className="mx-auto w-[min(92vw,640px)] py-20 text-center">
      <Title color="#6CC56B">Lịch trình trong ngày</Title>
      <ol className="mt-10 grid gap-4 text-left">
        {rows.map(([mm, title, note], k) => (
          <li key={title} data-pop className="flex items-center gap-4">
            <span
              className={`${t.display} flex h-14 w-24 shrink-0 items-center justify-center rounded-full text-[20px] tabular-nums text-[#333]`}
              style={{ backgroundColor: `${BANDS[k]}66` }}
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

// C6 + C7 · Đường tới tiệc.
export function Road({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  return (
    <section className="mx-auto w-[min(92vw,900px)] py-20 text-center">
      <Title color="#FFB21A">Đường tới tiệc</Title>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {(
          [
            [
              "Lễ vu quy",
              formatTime(vuQuy),
              "Nhà cô dâu",
              bride.address,
              "#FF6B9A",
            ],
            [
              "Tiệc cưới",
              formatTime(date),
              venue.name ?? "Nhà hàng tiệc cưới",
              "Đến sớm chút để chụp hình nha",
              "#4EA8DE",
            ],
          ] as const
        ).map(([title, time, place, note, color]) => (
          <div key={title} data-pop>
            <Scribble color={color} className="bg-white/70 p-5 text-left">
              <p className={t.soft}>{title}</p>
              <p className={`${t.display} text-[34px] tabular-nums`}>{time}</p>
              <p className="text-[19px] break-words">{place}</p>
              <p className={`text-[16px] ${t.soft} break-words`}>{note}</p>
            </Scribble>
          </div>
        ))}
      </div>
      <div data-pop className="mt-10">
        <Scribble color="#6CC56B">
          <MapEmbed
            venue={venue}
            className="aspect-[4/3] w-full rounded-3xl sm:aspect-[16/8]"
          />
        </Scribble>
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${t.btn} mt-8`}
      >
        Chỉ đường
        <ArrowUpRightIcon weight="bold" className="size-4" />
      </a>
    </section>
  );
}

const CRAYONS = [
  ["Hồng", "#FF6B9A"],
  ["Xanh", "#4EA8DE"],
  ["Vàng", "#FFD23F"],
  ["Lá", "#6CC56B"],
  ["Trắng", "#FFFFFF"],
] as const;

// C13 · Hộp sáp dress code.
export function Crayons() {
  return (
    <section className="mx-auto w-[min(92vw,640px)] py-16 text-center">
      <Title color="#FF6B9A">Mặc gì đây?</Title>
      <p className={`mt-4 ${t.soft}`}>
        Màu tươi tươi như hộp sáp này là đẹp nhất. Thoải mái là được!
      </p>
      <ul className="mt-8 flex items-end justify-center gap-3">
        {CRAYONS.map(([name, c], k) => (
          <li
            key={name}
            data-crayon
            className="flex flex-col items-center gap-2"
          >
            <span
              className="relative block w-9 rounded-t-[40%] ring-2 ring-[#333]"
              style={{ backgroundColor: c, height: `${96 + (k % 2) * 16}px` }}
            >
              <span className="absolute inset-x-0 top-1/3 h-6 bg-white/40" />
            </span>
            <span className="text-[15px]">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TILTS = [
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "rotate-1",
  "-rotate-2",
];
const COLORS = ["#FF6B9A", "#4EA8DE", "#6CC56B", "#FFB21A"];

// C8 · Bảng dán ảnh: toàn bộ ảnh.
export function Board({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: View;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1100px)] py-20 text-center">
      <Title color="#4EA8DE">Bảng dán ảnh</Title>
      <p className={`mt-4 ${t.soft}`}>
        {images.length} tấm ảnh tụi mình dán lên tường.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <div key={src} data-pop className={i % 2 ? "translate-y-6" : ""}>
            <Taped
              src={src}
              alt={`Khoảnh khắc ${i + 1}`}
              onClick={() => onView(i)}
              tilt={TILTS[i % TILTS.length]}
              color={COLORS[i % COLORS.length]}
              ratio="aspect-[4/5]"
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={onAll} className={`${t.btn} mt-8`}>
        <ImagesIcon className="size-5" />
        Xem trọn album
      </button>
    </section>
  );
}

// C14 + C15 · Phiếu bé ngoan: xác nhận tham dự + gửi lời chúc.
export function GoodKid({
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
    <section className="mx-auto w-[min(92vw,720px)] pt-16 pb-40 text-center">
      <div data-pop>
        <Scribble color="#FF6B9A" className="bg-white/80 p-6 text-left sm:p-8">
          <p className={`${t.display} text-center text-[28px] ${t.pink}`}>
            Phiếu bé ngoan
          </p>
          <p className={`mt-1 text-center ${t.soft}`}>
            Điền vào để tụi mình biết mà chuẩn bị chỗ ngồi nha.
          </p>
          {done ? (
            <p
              className={`${t.display} mt-6 text-center text-[24px]`}
              aria-live="polite"
            >
              Cảm ơn {done}! Một bông hoa điểm tốt cho bạn.
            </p>
          ) : (
            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setDone(name.trim());
              }}
            >
              <label className="grid gap-1">
                <span>Tên của bạn</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  autoComplete="name"
                  placeholder="Lý Minh Châu"
                  className="h-12 rounded-2xl border-2 border-dashed border-[#4EA8DE] bg-white px-4 outline-none placeholder:text-[#6B6B6B]/70 focus:border-solid"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    [true, "Có mặt!"],
                    [false, "Tiếc quá, vắng"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={going === v}
                    onClick={() => setGoing(v)}
                    className="min-h-12 rounded-2xl border-2 border-[#333] aria-pressed:bg-[#FFD23F]"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={!name.trim()} className={t.btn}>
                Nộp phiếu
              </button>
            </form>
          )}
          <div className="mt-8 border-t-2 border-dashed border-[#FF6B9A]/50 pt-6 text-center">
            <p className={t.soft}>
              Muốn gửi lời chúc và quà mừng thì bấm đây nè:
            </p>
            <div className="mt-4 flex justify-center">
              <GiftButton className={`${t.btn} pl-2 [&>span]:bg-white/25`} />
            </div>
          </div>
        </Scribble>
      </div>
      <div data-pop className="mx-auto mt-24 w-[min(70vw,320px)]">
        <Taped src={img} alt={couple} onClick={onView} tilt="-rotate-2" />
      </div>
      <p
        data-pop
        className={`${t.display} mt-12 -rotate-2 text-[40px] ${t.pink}`}
      >
        Cảm ơn bạn nhiều nha!
      </p>
      <p data-pop className={`mt-3 ${t.soft}`}>
        Ký tên,
      </p>
      <p
        data-pop
        className={`${t.display} mt-1 text-[26px] text-balance break-words ${t.blue}`}
      >
        {couple}
      </p>
    </section>
  );
}
