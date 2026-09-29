"use client";

import { useEffect, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatTime, formatWeekday, weddingDate } from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import { gsap, useGSAP } from "@/kit/gsap";
import { type Music, MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { clipReveal, splitReveal } from "@/kit/presets";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import {
  buildMonthGrid,
  dottedDate,
  monthNameVi,
  scheduleTimes,
  weddingParts,
} from "./calendar";
import { sealMonogram } from "./initials";

// Tokens (spec §2): bg #EFE8DC · paper #FBF8F2 · olive #6B7B5A · wax #8A3B2E · ink #3B362E.
const CARD =
  "mx-auto w-[min(92vw,440px)] rounded-sm border border-[#D9CFBF] bg-[#FBF8F2] p-6 shadow-[0_10px_30px_-10px_rgba(59,54,46,0.35)]";
const H2 =
  "text-center text-[14px] font-semibold uppercase tracking-[0.2em] lg:text-[16px]";
const SCRIPT = "font-(family-name:--font-script)";
const SOFT = "text-[#7A7266]";
const NOTE = `text-[14px] italic ${SOFT}`;
const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#6B7B5A] px-6 text-white transition-colors hover:bg-[#4E5B41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B7B5A]";

const ICONS: Record<string, string> = {
  glass: "M8 3h8l-1 7a3 3 0 0 1-6 0L8 3Zm4 10v7m-3 0h6",
  rings: "M9 14a5 5 0 1 0 0 .01M15 14a5 5 0 1 0 0 .01M10 4l2 3 2-3",
  plate: "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM3 5v14M21 5v14",
  music:
    "M9 18V6l10-2v12M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
};

const Img = ({
  alt,
  ...p
}: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
  // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
  <img alt={alt} {...p} />
);

const Rule = () => (
  <div aria-hidden className="my-5 flex items-center gap-3 text-[#6B7B5A]">
    <span className="lt-rule h-px flex-1 origin-right bg-[#D9CFBF]" />
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 fill-none stroke-current stroke-[1.6]"
    >
      <path d="M12 3c2.2 3.2 5.5 3.4 5.5 6.6A5.5 5.5 0 0 1 12 15a5.5 5.5 0 0 1-5.5-5.4C6.5 6.4 9.8 6.2 12 3Z" />
      <path d="M12 15v6" />
    </svg>
    <span className="lt-rule h-px flex-1 origin-left bg-[#D9CFBF]" />
  </div>
);

function SongCard({ music }: { music: Music }) {
  const [time, setTime] = useState({ cur: 0, dur: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      const a = music.audio.current;
      if (a) setTime({ cur: a.currentTime, dur: a.duration || 0 });
    }, 1000);
    return () => clearInterval(id);
  }, [music.audio]);
  const mmss = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className={`${CARD} lt-card -rotate-2`}>
      <p className={`${SCRIPT} text-2xl`}>Bài hát của chúng tôi</p>
      <div className="mt-4 flex items-center justify-center gap-6 text-[#6B7B5A]">
        <span aria-hidden>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 fill-none stroke-current stroke-[1.8]"
          >
            <path d="m11 6-5 6 5 6M18 6l-5 6 5 6" />
          </svg>
        </span>
        <button
          type="button"
          onClick={music.toggle}
          aria-label={music.playing ? "Tạm dừng" : "Phát nhạc"}
          className={`${BTN} size-12 px-0`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-5 fill-current"
          >
            {music.playing ? (
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            ) : (
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l9.5-6.5a1 1 0 0 0 0-1.7l-9.5-6.5A1 1 0 0 0 8 5.5Z" />
            )}
          </svg>
        </button>
        <span aria-hidden>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 fill-none stroke-current stroke-[1.8]"
          >
            <path d="m13 6 5 6-5 6M6 6l5 6-5 6" />
          </svg>
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-[#D9CFBF]">
          <div
            className="h-full bg-[#6B7B5A] transition-[width] duration-1000 ease-linear"
            style={{ width: `${time.dur ? (time.cur / time.dur) * 100 : 0}%` }}
          />
        </div>
        <span className={`text-sm tabular-nums ${SOFT}`}>{mmss(time.cur)}</span>
      </div>
    </div>
  );
}

export function LetterInvite() {
  const { data } = useWedding();
  const { groom, bride, images, venue } = data;
  const date = weddingDate(data);
  const music = useMusic();
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [top, setTop] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  useScrollLock(!opened);

  const grid = buildMonthGrid(date);
  const { day } = weddingParts(date);
  const album = images;
  const longNames = groom.name.length > 20 || bride.name.length > 20;

  useGSAP(
    () => {
      gsap.from(".lt-env", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.inOut",
      });
      splitReveal(".lt-env-name", { by: "chars" }).delay(0.4);
      if (!reduced)
        gsap.to(".lt-seal", {
          scale: 1.04,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
    },
    { scope: gate },
  );

  useGSAP(
    () => {
      if (!opened) return;
      for (const el of gsap.utils.toArray<HTMLElement>(".lt-card")) {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }
      clipReveal(".lt-cover");
      splitReveal(".lt-name", { by: "chars" });
      gsap.from(".lt-rule", {
        scaleX: 0,
        duration: 1,
        delay: 0.6,
        ease: "power3.inOut",
      });
      gsap.from(".lt-dot", {
        scale: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: ".lt-dots", start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [opened] },
  );

  const open = () => {
    music.play(2000);
    setOpened(true);
  };

  return (
    <div
      ref={root}
      className="min-h-screen bg-[#EFE8DC] font-(family-name:--font-body) text-[18px] leading-[1.6] text-[#3B362E] lg:text-[20px]"
    >
      <SmoothScroll>
        <main className="flex flex-col gap-16 px-4 py-24">
          {/* C2 */}
          <section className={`${CARD} lt-card text-center`}>
            {images[0] && (
              <Img
                src={images[0]}
                alt={`Ảnh cưới của ${groom.name} và ${bride.name}`}
                className="lt-cover mx-auto aspect-3/4 w-[75%] rounded-t-full object-cover"
              />
            )}
            <p className={`${H2} mt-6`}>Trân trọng kính mời</p>
            <h1
              className={`${SCRIPT} mt-4 leading-[1.1] break-words ${longNames ? "text-[32px]" : "text-[44px] lg:text-[72px]"}`}
            >
              <span className="lt-name block">{groom.name}</span>
              <span className="block text-[0.6em] text-[#6B7B5A]">&amp;</span>
              <span className="lt-name block">{bride.name}</span>
            </h1>
            <Rule />
            <p className={H2}>
              {formatWeekday(date)} · {dottedDate(date)}
            </p>
          </section>

          {/* C16 */}
          <section aria-label="Bài hát">
            <SongCard music={music} />
          </section>

          {/* C3 */}
          <section className={`${CARD} lt-card`}>
            <h2 className={H2}>Hai gia đình</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 max-[340px]:grid-cols-1">
              {(
                [
                  ["Nhà trai", groom, images[1], "-rotate-3"],
                  ["Nhà gái", bride, images[2], "rotate-3"],
                ] as const
              ).map(([side, p, src, rot]) => (
                <div key={side} className="min-w-0 text-center">
                  {src && (
                    <div
                      className={`relative bg-white p-2 pb-6 shadow-md ${rot}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 left-1/2 h-5 w-2 -translate-x-1/2 rounded-full bg-[#A8874A]"
                      />
                      <Img
                        src={src}
                        alt={`${side}: ${p.name}`}
                        className="aspect-3/4 w-full object-cover"
                      />
                    </div>
                  )}
                  <p className={`${H2} mt-4`}>{side}</p>
                  <p
                    className={`${SCRIPT} text-[28px] leading-tight break-words`}
                  >
                    {p.name}
                  </p>
                  <p className={`line-clamp-3 text-base ${SOFT}`}>
                    {p.address}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* C5 + C11 */}
          <section className="lt-card mx-auto flex w-[min(92vw,440px)] flex-col gap-4">
            <div className="rounded-sm bg-[#6B7B5A] p-6 text-center text-[#FBF8F2]">
              <p className={H2}>{monthNameVi(grid.month)}</p>
              <div className="mt-2 grid grid-cols-3 items-center">
                <span className="text-sm uppercase tracking-[0.2em]">
                  {formatWeekday(date)}
                </span>
                <span className="text-[96px] leading-none font-light">
                  {day}
                </span>
                <span className="text-sm tracking-[0.2em]">{grid.year}</span>
              </div>
              <Countdown date={date} flip className="mt-6 justify-center" />
            </div>
            <div className={`${CARD} p-4`}>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                  <span key={d} className={`font-semibold ${SOFT}`}>
                    {d}
                  </span>
                ))}
                {grid.cells
                  .map((d, pos) => ({ d, pos }))
                  .map(({ d, pos }) =>
                    d === day ? (
                      <span
                        key={pos}
                        className="relative flex aspect-square items-center justify-center font-semibold text-white"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="absolute inset-0 size-full fill-[#8A3B2E]"
                        >
                          <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21Z" />
                        </svg>
                        <span className="relative">{d}</span>
                      </span>
                    ) : (
                      <span
                        key={pos}
                        className="flex aspect-square items-center justify-center"
                      >
                        {d ?? ""}
                      </span>
                    ),
                  )}
              </div>
            </div>
          </section>

          {/* C12 */}
          <section className={`${CARD} lt-card`}>
            <h2 className={H2}>Lịch trình</h2>
            <ol className="relative mt-6 flex flex-col gap-6 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-px before:bg-[#D9CFBF]">
              {scheduleTimes(date, formatTime).map((s) => (
                <li
                  key={s.label}
                  className="lt-step relative flex items-center gap-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#6B7B5A] bg-[#FBF8F2]">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-5 fill-none stroke-[#6B7B5A] stroke-[1.25]"
                    >
                      <path d={ICONS[s.icon]} />
                    </svg>
                  </span>
                  <span className="w-14 font-semibold tabular-nums">
                    {s.time}
                  </span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* C6 + C7 */}
          <section className="lt-card flex flex-col gap-4">
            <div className={`${CARD} text-center`}>
              <h2 className={H2}>Lễ vu quy</h2>
              <p className="mt-2">08:00 · {formatWeekday(date)}</p>
              <p className={NOTE}>Tư gia nhà gái</p>
              <p className="break-words">{bride.address}</p>
            </div>
            <div className={`${CARD} rotate-[1.5deg] text-center`}>
              <h2 className={H2}>Tiệc cưới</h2>
              <p className="mt-2">
                {formatTime(date)} · {formatWeekday(date)}
              </p>
              <p className="break-words">
                {venue.name ?? "Nhà hàng tiệc cưới"}
              </p>
              <MapEmbed
                venue={venue}
                className="mt-4 aspect-16/10 w-full rounded-[2px]"
              />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN} mt-4`}
              >
                ⌖ Chỉ đường
              </a>
            </div>
          </section>

          {/* C13 */}
          <section className={`${CARD} lt-card text-center`}>
            <h2 className={H2}>Dress code</h2>
            <p className={NOTE}>Trang nhã · tông trung tính</p>
            <div className="lt-dots mt-5 flex justify-center gap-5">
              {(
                [
                  ["#FBF8F2", "Kem"],
                  ["#D9CFBF", "Be"],
                  ["#6B7B5A", "Olive"],
                  ["#3B362E", "Nâu"],
                ] as const
              ).map(([hex, name]) => (
                <span
                  key={name}
                  className="flex flex-col items-center gap-1 text-sm"
                >
                  <span
                    className="lt-dot size-10 rounded-full border border-[#D9CFBF]"
                    style={{ background: hex }}
                  />
                  {name}
                </span>
              ))}
            </div>
          </section>

          {/* C8 */}
          {album.length > 0 && (
            <section className={`${CARD} lt-card text-center`}>
              <h2 className={H2}>Khoảnh khắc</h2>
              <div className="relative mx-auto mt-6 aspect-3/4 w-[80%]">
                {album.map((src, i) => {
                  const pos = (i - top + album.length) % album.length;
                  // Chỉ 3 tấm trên cùng lộ ra; phần còn lại nằm gọn dưới chồng.
                  const shown = pos < 3;
                  return (
                    <div
                      key={src}
                      aria-hidden={pos !== 0}
                      className={`absolute inset-0 bg-white p-2 pb-8 shadow-md transition-[transform,opacity] duration-500 ${shown ? "" : "opacity-0"}`}
                      style={{
                        zIndex: album.length - pos,
                        transform: `rotate(${[-2, 3, -4][pos] ?? 0}deg) translateY(${Math.min(pos, 2) * 6}px)`,
                      }}
                    >
                      <Img
                        src={src}
                        alt={`Ảnh cưới ${i + 1}/${album.length}`}
                        className="size-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Ảnh trước"
                  onClick={() =>
                    setTop((v) => (v - 1 + album.length) % album.length)
                  }
                  className={`${BTN} size-11 px-0`}
                >
                  ←
                </button>
                <span className={`min-w-16 text-sm tabular-nums ${SOFT}`}>
                  {top + 1} / {album.length}
                </span>
                <button
                  type="button"
                  aria-label="Ảnh sau"
                  onClick={() => setTop((v) => (v + 1) % album.length)}
                  className={`${BTN} size-11 px-0`}
                >
                  →
                </button>
              </div>
            </section>
          )}

          {/* C10 */}
          <section className={`${CARD} lt-card text-center`}>
            <p className={H2}>Lời cảm ơn</p>
            <p className="mt-4">
              Sự hiện diện của quý khách là niềm vinh hạnh của hai gia đình
              chúng tôi.
            </p>
            <p className={`${SCRIPT} mt-6 text-[32px] break-words`}>
              {groom.name} &amp; {bride.name}
            </p>
            <GiftButton className="mt-6 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#6B7B5A] py-2 pr-6 pl-2 text-white transition-colors hover:bg-[#4E5B41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B7B5A]" />
          </section>
        </main>
      </SmoothScroll>

      {opened && <MusicToggle music={music} />}

      <OpenGate onOpen={open} className="!bg-[#EFE8DC]">
        <div
          ref={gate}
          className="flex flex-col items-center gap-8 px-4 text-center text-[#3B362E]"
        >
          <p
            className={`lt-env-name ${SCRIPT} leading-[1.1] break-words ${longNames ? "text-[26px]" : "text-[32px]"}`}
          >
            {groom.name} &amp; {bride.name}
          </p>
          <div className="lt-env relative aspect-[3/2] w-[min(84vw,380px)] overflow-hidden rounded-sm bg-[#F1EADF] shadow-[0_10px_30px_-10px_rgba(59,54,46,0.35)]">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[60%] bg-[#E6DCCB] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            />
            <button
              type="button"
              aria-label="Mở thiệp mời"
              className="lt-seal absolute top-[60%] left-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#6B7B5A] text-sm font-semibold text-[#FBF8F2] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.25)]"
            >
              {sealMonogram(groom.name, bride.name)}
            </button>
          </div>
          <p className={NOTE}>Chạm vào dấu sáp để mở thiệp mời</p>
        </div>
      </OpenGate>
    </div>
  );
}
