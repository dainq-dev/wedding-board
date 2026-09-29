"use client";

import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { PhotoSlot, PhotoSlotsProvider } from "@/kit/3d/photo-slots";
import { useScrollProgress } from "@/kit/3d/use-scroll-progress";
import { useCountdown } from "@/kit/countdown";
import { formatTime, formatWeekday, weddingDate } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { AlbumSheet, Lightbox } from "@/kit/lightbox";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { BalloonCanvas } from "./balloon-canvas";

// Tokens (art direction v2, docs/templates/balloon-3d.md §0)
const INK = "text-[#1F2433]";
const IVORY = "text-[#FFF8F0]";
const SCRIPT = "font-(family-name:--font-script) font-normal leading-[0.9]";
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const BTN = `inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-transform duration-500 ${EASE} active:scale-[0.98]`;

const STORY = [
  {
    year: "2019",
    title: "Ngày đầu gặp gỡ",
    text: "Một chuyến đi tình cờ, hai người lạ ngồi cạnh nhau suốt mười tiếng bay.",
  },
  {
    year: "2022",
    title: "Cùng nhau xê dịch",
    text: "Mười hai thành phố, một chiếc vali chung và vô số buổi hoàng hôn.",
  },
  {
    year: "2025",
    title: "Lời hứa trên mây",
    text: "Anh ngỏ lời khi khinh khí cầu vừa chạm đỉnh trời. Em đã nói có.",
  },
] as const;

// Nhịp album: 4 kiểu hàng lặp lại, mỗi họ bố cục khác nhau (spec §8.3).
type Row = { kind: "hero" | "pair" | "offset" | "trio"; idx: number[] };
function albumRows(from: number, to: number): Row[] {
  const kinds: Row["kind"][] = ["hero", "pair", "offset", "trio"];
  const size = { hero: 1, pair: 2, offset: 1, trio: 3 };
  const rows: Row[] = [];
  let i = from;
  let k = 0;
  while (i < to) {
    const kind = kinds[k % kinds.length];
    const n = Math.min(size[kind], to - i);
    rows.push({ kind: n === size[kind] ? kind : "pair", idx: range(i, i + n) });
    i += n;
    k++;
  }
  return rows;
}
const range = (a: number, b: number) =>
  Array.from({ length: b - a }, (_, i) => a + i);

const ROW_CLASS: Record<Row["kind"], string[]> = {
  hero: ["col-span-6 aspect-[4/5] lg:col-span-7 lg:aspect-[3/4]"],
  pair: [
    "col-span-3 aspect-[2/3] lg:col-span-4 lg:col-start-2",
    "col-span-3 mt-16 aspect-[2/3] lg:col-span-4 lg:col-start-8 lg:mt-32",
  ],
  offset: ["col-span-5 col-start-2 aspect-[3/4] lg:col-span-5 lg:col-start-7"],
  trio: [
    "col-span-2 aspect-[2/3] lg:col-span-3 lg:col-start-2",
    "col-span-2 mt-10 aspect-[2/3] lg:col-span-3 lg:mt-20",
    "col-span-2 aspect-[2/3] lg:col-span-3",
  ],
};

const pad = (n: number) => String(n).padStart(2, "0");

export function BalloonInvite() {
  return (
    <PhotoSlotsProvider>
      <Invite />
    </PhotoSlotsProvider>
  );
}

function Invite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const music = useMusic();
  const reduced = useReducedMotion();
  const date = weddingDate(data);
  const left = useCountdown(date);

  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(!opened);

  const root = useRef<HTMLDivElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(root);
  const intro = useRef(0);

  useGSAP(
    () => {
      // Màn mở: chữ hiện dần từng lớp.
      gsap.from("[data-gate] > *", {
        y: 24,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.out",
        delay: 0.3,
      });
    },
    { scope: gate },
  );

  useGSAP(
    () => {
      if (!opened) return;
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]")) {
        gsap.from(el, {
          y: reduced ? 0 : 48,
          opacity: 0,
          filter: reduced ? "none" : "blur(6px)",
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const open = () => {
    music.play(2000);
    setOpened(true);
    if (reduced) {
      intro.current = 1;
      return;
    }
    gsap.to(intro, { current: 1, duration: 2.6, ease: "power2.inOut" });
    if (gate.current)
      gsap.to(gate.current, {
        opacity: 0,
        y: -20,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.in",
      });
  };

  const day = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .split("/");
  const couple = `${groom.name} & ${bride.name}`;
  const gallery = albumRows(6, images.length);
  const view = (i: number) => () => setPhoto(i);

  return (
    <div
      ref={root}
      className={`relative isolate min-h-screen font-(family-name:--font-sans) text-[16px] leading-[1.7] ${INK} lg:text-[17px]`}
    >
      <BalloonCanvas progress={progress} intro={intro} cover={images[0]} />
      <MusicToggle music={music} />

      {/* ---------- Màn mở ---------- */}
      {!opened || !reduced ? (
        <div
          ref={gate}
          className={`fixed inset-0 z-30 flex items-end justify-center px-6 pb-[12svh] text-center transition-[visibility] ${opened ? "pointer-events-none invisible delay-1000" : ""}`}
        >
          <div data-gate className="flex max-w-xl flex-col items-center">
            <p className="text-[15px] tracking-[0.04em] text-[#1F2433]/75">
              Trân trọng kính mời
            </p>
            <h1
              className={`${SCRIPT} mt-3 text-[clamp(4rem,19vw,8.5rem)] break-words`}
            >
              <span className="block">{groom.name}</span>
              <span className="block text-[0.55em] text-[#E8735A]">&amp;</span>
              <span className="block">{bride.name}</span>
            </h1>
            <p className="mt-4 text-[15px] tabular-nums text-[#1F2433]/75">
              {formatWeekday(date)}, {day.join(" . ")}
            </p>
            <button
              type="button"
              onClick={open}
              disabled={opened}
              className={`${BTN} mt-8 bg-[#1F2433] px-8 text-[#FFF8F0] shadow-[0_18px_40px_-18px_rgba(31,36,51,0.7)] hover:-translate-y-0.5`}
            >
              Mở thiệp
            </button>
          </div>
        </div>
      ) : null}

      <main
        className={`transition-opacity duration-1000 ${opened ? "" : "opacity-0"}`}
      >
        {/* ---------- Tên (buổi sáng) ---------- */}
        <section className="flex min-h-[100svh] flex-col items-center justify-end px-6 pb-[14svh] text-center">
          <p data-rise className="text-[15px] text-[#1F2433]/70">
            Cùng chúng mình bay lên trong ngày vui
          </p>
          <h2
            data-rise
            className={`${SCRIPT} mt-2 text-[clamp(4.5rem,21vw,10rem)] break-words`}
          >
            <span className="block">{groom.name}</span>
            <span className="block text-[0.5em] text-[#E8735A]">&amp;</span>
            <span className="block">{bride.name}</span>
          </h2>
        </section>

        {/* ---------- Cặp đôi ---------- */}
        <section className="mx-auto grid w-full max-w-5xl grid-cols-6 gap-x-4 px-5 py-[16svh] lg:grid-cols-12 lg:gap-x-8">
          {(
            [
              ["Chú rể", "Nhà trai", groom, 1, "col-span-4 lg:col-span-5"],
              [
                "Cô dâu",
                "Nhà gái",
                bride,
                2,
                "col-span-4 col-start-3 mt-[18svh] lg:col-span-5 lg:col-start-8 lg:mt-[26svh]",
              ],
            ] as const
          ).map(([role, side, p, i, cls]) =>
            images[i] ? (
              <figure key={role} data-rise className={cls}>
                <PhotoSlot
                  url={images[i]}
                  alt={`${role} ${p.name}`}
                  radius={28}
                  className="aspect-[3/4] w-full"
                  onClick={view(i)}
                />
                <figcaption className="mt-5">
                  <p className="text-sm text-[#1F2433]/60">{role}</p>
                  <p
                    className={`${SCRIPT} text-[3.6rem] break-words lg:text-[4.6rem]`}
                  >
                    {p.name}
                  </p>
                  <p className="text-[15px] text-[#1F2433]/75 break-words">
                    {side} · {p.address}
                  </p>
                </figcaption>
              </figure>
            ) : null,
          )}
        </section>

        {/* ---------- Chuyện tình ---------- */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-[18svh] px-5 py-[12svh]">
          {STORY.map((s, k) => {
            const i = 3 + k;
            const flip = k % 2 === 1;
            return (
              <article
                key={s.year}
                className={`grid grid-cols-6 items-end gap-x-4 gap-y-6 lg:grid-cols-12 lg:gap-x-8 ${k === 2 ? "lg:items-center" : ""}`}
              >
                {images[i] && (
                  <div
                    data-rise
                    className={
                      k === 2
                        ? "col-span-6 lg:col-span-8 lg:col-start-3"
                        : flip
                          ? "col-span-5 col-start-2 lg:col-span-6 lg:col-start-7 lg:row-start-1"
                          : "col-span-5 lg:col-span-6"
                    }
                  >
                    <PhotoSlot
                      url={images[i]}
                      alt={s.title}
                      radius={28}
                      className={`w-full ${k === 2 ? "aspect-[4/5] lg:aspect-[16/10]" : "aspect-[4/5]"}`}
                      onClick={view(i)}
                    />
                  </div>
                )}
                <div
                  data-rise
                  className={
                    k === 2
                      ? "col-span-6 text-center lg:col-span-8 lg:col-start-3"
                      : flip
                        ? "col-span-6 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center"
                        : "col-span-6 lg:col-span-5 lg:col-start-8 lg:self-center"
                  }
                >
                  <p className="text-sm tabular-nums text-[#1F2433]/55">
                    {s.year}
                  </p>
                  <h3 className={`${SCRIPT} text-[3.4rem] lg:text-[4.4rem]`}>
                    {s.title}
                  </h3>
                  <p className="max-w-[40ch] text-[#1F2433]/80 lg:text-lg">
                    {s.text}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        {/* ---------- Album (giờ vàng) ---------- */}
        <section className="mx-auto w-full max-w-6xl px-5 py-[14svh]">
          <header
            data-rise
            className="mb-16 flex flex-col items-center text-center lg:mb-24"
          >
            <h2 className={`${SCRIPT} text-[clamp(4rem,16vw,8rem)]`}>
              Những khoảnh khắc
            </h2>
            <p className="max-w-[36ch] text-[#1F2433]/75">
              {images.length} tấm ảnh, mỗi tấm là một lần chúng mình cùng bay.
            </p>
          </header>
          <div className="grid grid-cols-6 gap-x-4 gap-y-[10svh] lg:grid-cols-12 lg:gap-x-8 lg:gap-y-[16svh]">
            {gallery.flatMap((row) =>
              row.idx.map((i, j) => (
                <div
                  key={images[i]}
                  data-rise
                  className={ROW_CLASS[row.kind][j] ?? "col-span-3"}
                >
                  <PhotoSlot
                    url={images[i]}
                    alt={`Khoảnh khắc ${i + 1}`}
                    radius={24}
                    className="size-full"
                    onClick={view(i)}
                  />
                </div>
              )),
            )}
          </div>
          <div className="mt-[12svh] flex justify-center">
            <button
              type="button"
              onClick={() => setAlbum(true)}
              className={`${BTN} bg-white/70 text-[#1F2433] ring-1 ring-[#1F2433]/10 hover:bg-white`}
            >
              <ImagesIcon className="size-5" />
              Xem trọn album
            </button>
          </div>
        </section>

        {/* ---------- Ngày cưới (chạng vạng) ---------- */}
        <section
          className={`flex min-h-[110svh] flex-col items-center justify-center px-5 text-center ${IVORY}`}
        >
          <p data-rise className="text-[15px] text-[#FFF8F0]/80">
            Hẹn gặp bạn vào {formatWeekday(date)}
          </p>
          <p
            data-rise
            className="mt-2 text-[clamp(5rem,26vw,13rem)] leading-none font-extralight tracking-[-0.04em] tabular-nums"
          >
            {day[0]}.{day[1]}
          </p>
          <p data-rise className="text-lg tabular-nums text-[#FFF8F0]/80">
            {day[2]}
          </p>
          <div
            data-rise
            className="mt-10 grid grid-cols-4 gap-2 sm:gap-4"
            role="timer"
            aria-label="Thời gian còn lại tới ngày cưới"
          >
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
                className="min-w-[4.5rem] rounded-3xl bg-white/10 px-3 py-4 ring-1 ring-white/20"
              >
                <p className="text-3xl font-light tabular-nums">
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className="mt-1 text-xs text-[#FFF8F0]/70">{label}</p>
              </div>
            ))}
          </div>
          <dl
            data-rise
            className="mt-12 w-full max-w-sm divide-y divide-white/15 text-left"
          >
            {(
              [
                ["Lễ thành hôn", new Date(date.getTime() - 3_600_000)],
                ["Tiệc cưới", date],
              ] as const
            ).map(([label, d]) => (
              <div
                key={label}
                className="flex items-baseline justify-between py-4"
              >
                <dt>{label}</dt>
                <dd className="text-2xl font-light tabular-nums">
                  {formatTime(d)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Địa điểm ---------- */}
        <section
          className={`mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col justify-center px-5 ${IVORY}`}
        >
          <h2
            data-rise
            className={`${SCRIPT} text-center text-[clamp(3.6rem,14vw,7rem)]`}
          >
            Nơi hạ cánh
          </h2>
          <p data-rise className="text-center text-lg break-words">
            {venue.name ?? "Nhà hàng tiệc cưới"}
          </p>
          <div
            data-rise
            className="mt-8 rounded-[2rem] bg-white/10 p-1.5 ring-1 ring-white/20"
          >
            <MapEmbed
              venue={venue}
              className="aspect-[4/3] w-full rounded-[calc(2rem-0.375rem)] lg:aspect-[16/9]"
            />
          </div>
          <a
            data-rise
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN} mt-8 self-center bg-[#E8735A] text-white hover:-translate-y-0.5`}
          >
            Chỉ đường
            <ArrowUpRightIcon className="size-4" />
          </a>
        </section>

        {/* ---------- Lời cảm ơn (đêm sao) ---------- */}
        <section
          className={`mx-auto flex min-h-[120svh] w-full max-w-3xl flex-col items-center justify-center gap-10 px-5 pb-32 text-center ${IVORY}`}
        >
          {images[0] && (
            <div data-rise className="w-[min(72vw,340px)]">
              <PhotoSlot
                url={images[0]}
                alt={couple}
                radius={28}
                className="aspect-[3/4] w-full"
                onClick={view(0)}
              />
            </div>
          )}
          <p
            data-rise
            className="max-w-[30ch] text-xl leading-relaxed text-[#FFF8F0]/90 lg:text-2xl"
          >
            Cảm ơn bạn đã cùng chúng mình đi hết hành trình này. Sự hiện diện
            của bạn là món quà quý nhất.
          </p>
          <p
            data-rise
            className={`${SCRIPT} text-[clamp(3.6rem,15vw,7rem)] text-balance break-words`}
          >
            {couple}
          </p>
          <div data-rise>
            <GiftButton
              className={`${BTN} bg-[#FFF8F0] pl-2 text-[#1F2433] hover:-translate-y-0.5 [&>span]:bg-[#E8735A] [&>span]:text-white`}
            />
          </div>
        </section>
      </main>

      <Lightbox
        images={images}
        index={photo}
        onIndex={setPhoto}
        onClose={() => setPhoto(null)}
      />
      <AlbumSheet
        images={images}
        open={album}
        onPick={(i) => {
          setAlbum(false);
          setPhoto(i);
        }}
        onClose={() => setAlbum(false)}
      />
    </div>
  );
}
