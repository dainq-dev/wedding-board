"use client";

import { useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import {
  formatDate,
  formatTime,
  formatWeekday,
  weddingDate,
} from "@/kit/dates";
import { GiftButton } from "@/kit/gift";
import { Draggable, gsap, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Cover } from "./cover";
import { Polaroid } from "./polaroid";
import { nickname, rot, scatter } from "./seeded";
import {
  Heart,
  PaperGrain,
  RedPushpin,
  Star,
  TornTop,
  Underline,
  Washi,
} from "./svg/marks";
import { t } from "./tokens";

const STORY = [
  "Gặp nhau ở quán cà phê quen, cả hai cùng gọi một món.",
  "Buổi hẹn đầu tiên, mưa to, ướt hết mà vẫn cười.",
  "Và anh hỏi: “Mình về chung một nhà nhé?”",
];

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={`${t.h2} inline-block`}>
      {children}
      <Underline className="block h-3 w-full text-[#E07A5F]" />
    </h2>
  );
}

export function PolaroidInvite() {
  const { data } = useWedding();
  const { groom, bride, images, venue } = data;
  const date = weddingDate(data);
  const left = useCountdown(date);
  const music = useMusic();
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [tidy, setTidy] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [rsvp, setRsvp] = useState({ name: "", yes: true, count: 1 });
  const [sent, setSent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  useScrollLock(!opened || zoom !== null);

  const deskPhotos = images;
  const last = images.at(-1);

  useGSAP(
    () => {
      if (!opened) return;
      for (const el of gsap.utils.toArray<HTMLElement>(".pl-pop")) {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }
      gsap.from(".pl-stamp", {
        scale: 1.4,
        opacity: 0,
        duration: 0.25,
        ease: "power4.in",
        scrollTrigger: { trigger: ".pl-stamp", start: "top 85%", once: true },
      });
      if (reduced || tidy || !desk.current) return;
      Draggable.create(".pl-desk-photo", {
        bounds: desk.current,
        zIndexBoost: true,
        minimumMovement: 5,
        onClick() {
          setZoom((this.target as HTMLElement).dataset.src ?? null);
        },
      });
    },
    { scope: root, dependencies: [opened, reduced, tidy] },
  );

  const status = !left
    ? " "
    : left.done
      ? "Tụi mình cưới rồi"
      : left.days === 0
        ? "Hôm nay nè!"
        : `Còn ${left.days} ngày nữa!`;

  const grid = tidy || reduced;

  return (
    <div ref={root} className={t.root}>
      <PaperGrain />
      <SmoothScroll>
        <main className="flex flex-col gap-24 px-3 py-24">
          {/* C2 */}
          <section className={`${t.frame} relative bg-white/60 p-6 shadow-sm`}>
            <p className={`${t.hand} text-[22px]`}>
              Hôm nay tụi mình cưới nhau rồi!
            </p>
            <h1
              className={`${t.hand} mt-6 text-center text-[44px] leading-[1.1] break-words lg:text-[68px]`}
            >
              {groom.name}
              <span className="block text-[#E07A5F]">&amp;</span>
              {bride.name}
            </h1>
            <div
              aria-hidden
              className="mt-4 flex justify-center gap-6 text-[#E07A5F]"
            >
              <Heart className="size-8 rotate-[-12deg]" />
              <Star className="size-8 text-[#81B29A]" />
              <Heart className="size-6 rotate-12" />
            </div>
            <p className="mt-6">
              Trân trọng mời bạn đến chung vui cùng tụi mình.
            </p>
            <p className={`${t.hand} mt-2 text-right text-2xl`}>
              {formatDate(date).replaceAll("/", " . ")}
            </p>
          </section>

          {/* C3 */}
          <section className={`${t.frame} pl-pop`}>
            <Title>Nhà mình</Title>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {(
                [
                  ["Chú rể", groom, images[1], -6, ""],
                  ["Cô dâu", bride, images[2], 5, "mt-12"],
                ] as const
              ).map(([role, p, src, deg, cls]) => (
                <div key={role} className={`relative min-w-0 ${cls}`}>
                  <Washi className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-[-10deg]" />
                  <div style={{ rotate: `${deg}deg` }}>
                    <Polaroid
                      src={src}
                      alt={`${role} ${p.name}`}
                      caption={`${role}, ${p.name}`}
                    />
                  </div>
                  <p className={`mt-3 line-clamp-3 text-sm ${t.soft}`}>
                    {p.address}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* C4 */}
          <section className={t.frame}>
            <Title>Chuyện tụi mình</Title>
            <div className="mt-8 flex flex-col gap-10 border-l-2 border-dashed border-[#E07A5F] pl-5">
              {STORY.map((text, i) => (
                <div
                  key={text}
                  className={`pl-pop flex items-center gap-4 ${i % 2 ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-[55%] shrink-0"
                    style={{ rotate: `${rot(i + 3)}deg` }}
                  >
                    <Polaroid src={images[3 + i]} alt={`Kỷ niệm ${i + 1}`} />
                  </div>
                  <p className={`${t.hand} text-[20px] leading-snug`}>
                    “{text}”
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* C5 + C6 */}
          <section className="pl-pop mx-auto w-[min(86vw,360px)]">
            <div className={`relative rotate-2 p-6 ${t.note}`}>
              <RedPushpin className="absolute -top-4 left-1/2 size-8 -translate-x-1/2" />
              <p className={`${t.hand} text-[26px]`}>Hẹn nhau nhé!</p>
              <p className="mt-2 font-bold capitalize">{formatWeekday(date)}</p>
              <p className={`${t.hand} text-[34px] leading-tight`}>
                {formatDate(date).replaceAll("/", " . ")}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <b>10:00</b> Lễ cưới tại nhà trai
                </li>
                <li>
                  {" "}
                  <b>{formatTime(date)}</b> Tiệc,{" "}
                  <span className="break-words">
                    {venue.name ?? "Nhà hàng tiệc cưới"}
                  </span>
                </li>
              </ul>
              <p
                className={`${t.hand} mt-4 text-[22px] text-[#B85A42]`}
                role="timer"
              >
                {status}
              </p>
            </div>
          </section>

          {/* C7 */}
          <section className={`${t.frame} pl-pop`}>
            <Title>Đường đến tiệc</Title>
            <div className="relative mt-6 -rotate-1 bg-white p-2 shadow-md">
              <Washi className="absolute -top-3 -left-4 z-10 h-6 w-20 -rotate-[20deg]" />
              <Washi
                color="#81B29A"
                className="absolute -top-3 -right-4 z-10 h-6 w-20 rotate-[20deg]"
              />
              <MapEmbed venue={venue} className="aspect-square w-full" />
            </div>
            <p className={`${t.hand} mt-4 text-[22px] break-words`}>
              {venue.name ?? "Nhà hàng tiệc cưới"}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${t.btn} mt-3`}
            >
              Mở Google Maps
            </a>
          </section>

          {/* C8 */}
          {deskPhotos.length > 0 && (
            <section className="mx-auto w-[min(96vw,720px)]">
              <Title>Lục lọi album nè</Title>
              <p className={`text-sm ${t.soft}`}>
                (kéo ảnh ra để xem, chạm để phóng to)
              </p>
              <div
                ref={desk}
                className={`relative mt-4 rounded-md ${t.desk} ${grid ? "grid grid-cols-2 gap-4 p-4 sm:grid-cols-3" : "h-[170svh] touch-pan-y overflow-hidden"}`}
              >
                {deskPhotos.map((src, i) => {
                  const pos = scatter(i, 100, 100, 36, 18);
                  return (
                    <button
                      key={src}
                      type="button"
                      data-src={src}
                      onClick={grid ? () => setZoom(src) : undefined}
                      aria-label={`Ảnh ${i + 1}`}
                      className={`pl-desk-photo cursor-grab ${grid ? "" : "absolute w-[36%]"}`}
                      style={
                        grid
                          ? undefined
                          : {
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                              rotate: `${rot(i)}deg`,
                            }
                      }
                    >
                      <Polaroid src={src} alt="" />
                    </button>
                  );
                })}
              </div>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setTidy((v) => !v)}
                  className={`${t.btn} mt-4`}
                >
                  {tidy ? "Rải ra bàn" : "Xếp lại gọn"}
                </button>
              )}
            </section>
          )}

          {/* C15 */}
          <section className={`${t.frame} pl-pop`}>
            <TornTop className="block h-3 w-full" />
            <div className="bg-white p-6">
              {sent ? (
                <p
                  className={`${t.hand} py-10 text-center text-[28px] text-[#B85A42] break-words`}
                >
                  Cảm ơn {rsvp.name}! Hẹn gặp nhé
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <p className={`${t.hand} text-[26px]`}>Bạn có đến không?</p>
                  <label className="flex items-center gap-2">
                    Tên:
                    <input
                      value={rsvp.name}
                      onChange={(e) =>
                        setRsvp({ ...rsvp, name: e.target.value })
                      }
                      className={`${t.hand} min-h-11 flex-1 border-b border-[#3D405B] bg-transparent text-xl outline-none`}
                    />
                  </label>
                  <div className="flex gap-4">
                    {[true, false].map((v) => (
                      <label
                        key={String(v)}
                        className="flex min-h-11 items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="yes"
                          checked={rsvp.yes === v}
                          onChange={() => setRsvp({ ...rsvp, yes: v })}
                          className="size-5 accent-[#B85A42]"
                        />
                        {v ? "Có chứ!" : "Tiếc quá"}
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    Đi mấy người:
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={rsvp.count === n}
                        onClick={() => setRsvp({ ...rsvp, count: n })}
                        className={`size-11 rounded-full border border-[#3D405B] ${rsvp.count === n ? "bg-[#3D405B] text-white" : ""}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!rsvp.name.trim()}
                    className={`${t.btn} disabled:opacity-50`}
                  >
                    Gửi tụi mình
                  </button>
                  <p className={`text-xs ${t.soft}`}>
                    Bản xem thử, không gửi đi đâu cả.
                  </p>
                </form>
              )}
            </div>
          </section>

          {/* C10 */}
          <section
            className={`${t.frame} flex flex-col items-center gap-6 pb-16 text-center`}
          >
            <div className="w-[70%] rotate-3">
              <Polaroid src={last} alt="Ảnh cuối sổ" caption="Hết sổ rồi!" />
            </div>
            <p>Cảm ơn bạn đã cùng lật những trang này với tụi mình.</p>
            <div className="pl-stamp -rotate-12 border-4 border-double border-[#E07A5F] px-6 py-3 font-extrabold text-[#E07A5F] uppercase">
              <p className="tracking-[0.2em]">Just married</p>
              <p className="normal-case">
                {nickname(groom.name)} &amp; {nickname(bride.name)}
              </p>
            </div>
            <GiftButton className={`${t.btn} mt-4 gap-2.5 pl-2`} />
          </section>
        </main>
      </SmoothScroll>

      {zoom && (
        <button
          type="button"
          onClick={() => setZoom(null)}
          aria-label="Đóng ảnh"
          className="fixed inset-0 z-40 flex cursor-zoom-out items-center justify-center bg-[#3D405B]/85 p-6"
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={zoom}
            alt=""
            className="max-h-full max-w-full bg-white object-contain p-3 pb-10"
          />
        </button>
      )}
      {opened && <MusicToggle music={music} />}
      <Cover
        onOpened={() => {
          music.play();
          setOpened(true);
        }}
      />
    </div>
  );
}
