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
import { LotusCanvas } from "./lotus-canvas";

// Tokens (art direction v2, docs/templates/lotus-3d.md §0)
const INK = "text-[#2F2A26]";
const BARK = "text-[#6B5E53]";
const SERIF = "font-(family-name:--font-serif)";
const DISPLAY = `${SERIF} font-light italic leading-[0.95] tracking-[-0.02em]`;
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const BTN = `inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[16px] font-medium transition-transform duration-500 ${EASE} active:scale-[0.98]`;
const ALBUM_FROM = 6;

const pad = (n: number) => String(n).padStart(2, "0");

export function LotusInvite() {
  return (
    <PhotoSlotsProvider>
      <Invite />
    </PhotoSlotsProvider>
  );
}

function Invite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const music = useMusic(0.5);
  const reduced = useReducedMotion();
  const music = useMusic();

  const [phase, setPhase] = useState<"closed" | "intro" | "open">("closed");
  const [lightbox, setPhoto] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  useScrollLock(phase !== "open");

  const track = useRef<HTMLElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(track);
  const introStart = useRef<number | null>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const bloomCards = useRef<Partial<Record<BloomId, HTMLElement | null>>>({});

  const date = weddingDate(data);
  const left = useCountdown(date);

  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(!opened);

  const root = useRef<HTMLDivElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(root);
  const intro = useRef(0);

  useGSAP(
    () => {
      gsap.from("[data-gate] > *", {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.6,
        stagger: 0.14,
        ease: "sine.out",
        delay: 0.4,
      });
    },
    { scope: gate },
  );

  useGSAP(
    () => {
      if (!opened) return;
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]")) {
        gsap.from(el, {
          y: reduced ? 0 : 32,
          opacity: 0,
          filter: reduced ? "none" : "blur(6px)",
          duration: 1.4,
          ease: "sine.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }
      // Album: dải vòm ảnh trôi ngang như thuyền đi qua đầm (ghim section).
      const t = track.current;
      if (reduced || !t) return;
      gsap.to(t, {
        x: () => -(t.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: t.parentElement,
          start: "top top",
          end: () => `+=${t.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const open = () => {
    music.play(3000);
    setOpened(true);
    if (reduced) {
      intro.current = 1;
      return;
    }
    gsap.to(intro, { current: 1, duration: 3.2, ease: "sine.inOut" });
    if (gate.current)
      gsap.to(gate.current, {
        opacity: 0,
        y: -16,
        filter: "blur(10px)",
        duration: 1.1,
        ease: "sine.in",
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
  const view = (i: number) => () => setPhoto(i);
  const gallery = images.slice(ALBUM_FROM);

  return (
    <div
      ref={root}
      className={`relative isolate min-h-screen font-(family-name:--font-sans) text-[17px] leading-[1.75] ${INK}`}
    >
      <LotusCanvas progress={progress} intro={intro} />
      <MusicToggle music={music} />

      {/* ---------- Màn mở: bông sen cận cảnh, mặt trời vừa lên ---------- */}
      {!opened || !reduced ? (
        <div
          ref={gate}
          className={`fixed inset-0 z-30 flex items-start justify-center px-6 pt-[12svh] text-center transition-[visibility] ${opened ? "pointer-events-none invisible delay-1000" : ""}`}
        >
          <div data-gate className="flex max-w-xl flex-col items-center">
            <p className={`${SERIF} text-lg italic ${BARK}`}>
              Trong đầm gì đẹp bằng sen
            </p>
            <h1
              className={`${DISPLAY} mt-5 text-[clamp(3.4rem,15vw,6.5rem)] break-words`}
            >
              <span className="block">{groom.name}</span>
              <span className="block text-[0.5em] text-[#A8395A]">và</span>
              <span className="block">{bride.name}</span>
            </h1>
            <p className={`mt-5 text-[16px] tabular-nums ${BARK}`}>
              {formatWeekday(date)}, {day.join(" . ")}
            </p>
            <button
              type="button"
              onClick={open}
              disabled={opened}
              className={`${BTN} mt-8 bg-[#A8395A] px-8 text-white shadow-[0_18px_40px_-18px_rgba(168,57,90,0.8)] hover:-translate-y-0.5`}
            >
              Mở thiệp
            </button>
          </div>
        </div>
      ) : null}

      <main
        className={`transition-opacity duration-1000 ${opened ? "" : "opacity-0"}`}
      >
        {/* ---------- Tên ---------- */}
        <section className="flex min-h-[100svh] flex-col items-center justify-start px-6 pt-[16svh] text-center">
          <p data-rise className={`text-[16px] ${BARK}`}>
            Trân trọng kính mời bạn đến dự lễ thành hôn của
          </p>
          <h2
            data-rise
            className={`${DISPLAY} mt-4 text-[clamp(3.8rem,17vw,8rem)] break-words`}
          >
            <span className="block">{groom.name}</span>
            <span className="block text-[0.45em] text-[#A8395A]">và</span>
            <span className="block">{bride.name}</span>
          </h2>
        </section>

        {/* ---------- Cặp đôi: hai vòm cửa ---------- */}
        <section className="mx-auto grid w-full max-w-5xl grid-cols-6 gap-x-4 px-5 py-[16svh] lg:grid-cols-12 lg:gap-x-10">
          {(
            [
              [
                "Chú rể",
                "Nhà trai",
                groom,
                1,
                "col-span-4 lg:col-span-5 lg:col-start-1",
              ],
              [
                "Cô dâu",
                "Nhà gái",
                bride,
                2,
                "col-span-4 col-start-3 mt-[16svh] lg:col-span-5 lg:col-start-8 lg:mt-[24svh]",
              ],
            ] as const
          ).map(([role, side, p, i, cls]) =>
            images[i] ? (
              <figure key={role} data-rise className={cls}>
                <div className="rounded-t-full rounded-b-[26px] bg-[#FBF7F2]/80 p-2 ring-1 ring-[#2F2A26]/10">
                  <PhotoSlot
                    url={images[i]}
                    alt={`${role} ${p.name}`}
                    radius={20}
                    arch
                    className="aspect-[3/4] w-full"
                    onClick={view(i)}
                  />
                </div>
                <figcaption className="mt-6">
                  <p className={`text-[15px] ${BARK}`}>{role}</p>
                  <p
                    className={`${DISPLAY} mt-1 text-[2.8rem] break-words lg:text-[3.6rem]`}
                  >
                    {p.name}
                  </p>
                  <p className={`mt-2 text-[16px] break-words ${BARK}`}>
                    {side} · {p.address}
                  </p>
                </figcaption>
              </figure>
            ) : null,
          )}
        </section>

        {/* ---------- Chuyện tình: 3 trang đổi nhịp ---------- */}
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-[20svh] px-5 py-[12svh]">
          {images[3] && (
            <article className="grid grid-cols-6 items-end gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
              <div
                data-rise
                className="col-span-5 lg:col-span-5 lg:col-start-2"
              >
                <PhotoSlot
                  url={images[3]}
                  alt="Ngày đầu gặp gỡ"
                  radius={20}
                  arch
                  className="aspect-[3/4] w-full"
                  onClick={view(3)}
                />
              </div>
              <div
                data-rise
                className="col-span-6 lg:col-span-5 lg:col-start-8 lg:pb-[8svh]"
              >
                <p className={`${SERIF} text-[15px] tabular-nums ${BARK}`}>
                  Mùa hạ 2019
                </p>
                <h3
                  className={`${DISPLAY} mt-2 text-[2.6rem] lg:text-[3.4rem]`}
                >
                  Ngày đầu gặp gỡ
                </h3>
                <p className={`mt-4 max-w-[38ch] ${BARK}`}>
                  Một buổi sớm ở hồ Tịnh Tâm, anh xin mượn chiếc ô. Cơn mưa tạnh
                  rồi mà hai người vẫn đứng lại.
                </p>
              </div>
            </article>
          )}

          {images[4] && (
            <article data-rise className="relative">
              <PhotoSlot
                url={images[4]}
                alt="Những mùa sen"
                radius={24}
                className="aspect-[4/5] w-full sm:aspect-[16/9]"
                onClick={view(4)}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[24px] bg-[linear-gradient(to_top,rgba(30,24,20,0.72),transparent)] px-6 pt-32 pb-8 text-[#FBF7F2] lg:px-12 lg:pb-12">
                <p
                  className={`${SERIF} text-[15px] tabular-nums text-[#FBF7F2]/80`}
                >
                  2019 đến 2024
                </p>
                <h3 className={`${DISPLAY} mt-2 text-[2.6rem] lg:text-[4rem]`}>
                  Năm mùa sen nở
                </h3>
                <p className="mt-3 max-w-[40ch] text-[#FBF7F2]/85">
                  Mỗi tháng sáu cùng nhau về Tháp Mười, ngồi thuyền trước khi
                  mặt trời lên.
                </p>
              </div>
            </article>
          )}

          {images[5] && (
            <article className="grid grid-cols-6 items-center gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
              <div
                data-rise
                className="order-2 col-span-6 lg:order-1 lg:col-span-4 lg:col-start-2"
              >
                <p className={`${SERIF} text-[15px] tabular-nums ${BARK}`}>
                  Xuân 2025
                </p>
                <h3
                  className={`${DISPLAY} mt-2 text-[2.6rem] lg:text-[3.4rem]`}
                >
                  Lời hứa bên đầm
                </h3>
                <p className={`mt-4 max-w-[38ch] ${BARK}`}>
                  Anh ngỏ lời khi bông sen đầu mùa vừa hé. Em gật đầu, và cả đầm
                  sen như cũng nở theo.
                </p>
              </div>
              <div
                data-rise
                className="order-1 col-span-4 col-start-2 lg:order-2 lg:col-span-5 lg:col-start-7"
              >
                <PhotoSlot
                  url={images[5]}
                  alt="Lời hứa bên đầm"
                  radius={20}
                  arch
                  className="aspect-[2/3] w-full"
                  onClick={view(5)}
                />
              </div>
            </article>
          )}
        </section>

        {/* ---------- Album: dải vòm ảnh trôi ngang ---------- */}
        {gallery.length > 0 && (
          <section className="relative overflow-hidden">
            <div className="flex h-[100svh] flex-col justify-center gap-10">
              <header className="px-5 lg:px-16">
                <h2 className={`${DISPLAY} text-[clamp(3rem,11vw,6rem)]`}>
                  Những mùa sen
                </h2>
                <p className={`mt-2 ${BARK}`}>
                  {images.length} khoảnh khắc chúng mình muốn kể bạn nghe.
                </p>
              </header>
              <div
                ref={track}
                className={`flex w-max items-end gap-5 px-5 lg:gap-10 lg:px-16 ${reduced ? "max-w-full snap-x snap-mandatory overflow-x-auto pb-4" : ""}`}
              >
                {gallery.map((url, k) => {
                  const i = ALBUM_FROM + k;
                  const tall = k % 3 !== 1;
                  return (
                    <figure key={url} className="shrink-0 snap-center">
                      <PhotoSlot
                        url={url}
                        alt={`Khoảnh khắc ${i + 1}`}
                        radius={18}
                        arch={tall}
                        className={
                          tall
                            ? "aspect-[3/4] h-[46svh] lg:h-[56svh]"
                            : "aspect-[4/5] h-[36svh] lg:h-[44svh]"
                        }
                        onClick={view(i)}
                      />
                      <figcaption
                        className={`${SERIF} mt-3 text-[15px] italic tabular-nums ${BARK}`}
                      >
                        {pad(i + 1)}
                      </figcaption>
                    </figure>
                  );
                })}
                <div className="flex h-[46svh] shrink-0 items-center pr-5 lg:h-[56svh]">
                  <button
                    type="button"
                    onClick={() => setAlbum(true)}
                    className={`${BTN} bg-[#FBF7F2] ring-1 ring-[#2F2A26]/12 hover:bg-white`}
                  >
                    <ImagesIcon className="size-5" />
                    Xem trọn album
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Ngày cưới ---------- */}
        <section className="mx-auto flex min-h-[110svh] w-full max-w-3xl flex-col items-center justify-center px-5 text-center">
          <p data-rise className={`${SERIF} text-xl italic ${BARK}`}>
            {formatWeekday(date)}
          </p>
          <p
            data-rise
            className={`${SERIF} text-[clamp(7rem,34vw,13rem)] leading-none font-extralight tabular-nums`}
          >
            {day[0]}
          </p>
          <p data-rise className={`text-lg tabular-nums ${BARK}`}>
            Tháng {Number(day[1])} năm {day[2]}
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
                className="min-w-[4.5rem] rounded-t-full rounded-b-3xl bg-[#FBF7F2]/75 px-3 pt-6 pb-4 ring-1 ring-[#2F2A26]/10 backdrop-blur-sm"
              >
                <p className={`${SERIF} text-3xl font-light tabular-nums`}>
                  {v === undefined ? "--" : pad(v)}
                </p>
                <p className={`mt-1 text-[13px] ${BARK}`}>{label}</p>
              </div>
            ))}
          </div>
          <dl
            data-rise
            className="mt-12 w-full max-w-sm divide-y divide-[#2F2A26]/12 rounded-3xl bg-[#FBF7F2]/75 px-6 text-left ring-1 ring-[#2F2A26]/10 backdrop-blur-sm"
          >
            {(
              [
                ["Lễ vu quy", new Date(date.getTime() - 4 * 3_600_000)],
                ["Lễ thành hôn", new Date(date.getTime() - 3_600_000)],
                ["Tiệc cưới", date],
              ] as const
            ).map(([label, d]) => (
              <div
                key={label}
                className="flex items-baseline justify-between py-4"
              >
                <dt>{label}</dt>
                <dd className={`${SERIF} text-2xl font-light tabular-nums`}>
                  {formatTime(d)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Địa điểm ---------- */}
        <section className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col justify-center px-5">
          <h2
            data-rise
            className={`${DISPLAY} text-center text-[clamp(3rem,12vw,6rem)]`}
          >
            Nơi đón bạn
          </h2>
          <p
            data-rise
            className={`mt-2 text-center text-lg break-words ${BARK}`}
          >
            {venue.name ?? "Nhà hàng tiệc cưới"}
          </p>
          <div
            data-rise
            className="mt-8 rounded-[2rem] bg-[#FBF7F2]/80 p-1.5 ring-1 ring-[#2F2A26]/10"
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
            className={`${BTN} mt-8 self-center bg-[#A8395A] text-white hover:-translate-y-0.5`}
          >
            Chỉ đường
            <ArrowUpRightIcon className="size-4" />
          </a>
        </section>

        {/* ---------- Lời cảm ơn ---------- */}
        <section className="mx-auto flex min-h-[120svh] w-full max-w-3xl flex-col items-center justify-center gap-10 px-5 pb-32 text-center">
          {images[0] && (
            <div
              data-rise
              className="w-[min(70vw,340px)] rounded-t-full rounded-b-[26px] bg-[#FBF7F2]/80 p-2 ring-1 ring-[#2F2A26]/10"
            >
              <PhotoSlot
                url={images[0]}
                alt={couple}
                radius={20}
                arch
                className="aspect-[3/4] w-full"
                onClick={view(0)}
              />
            </div>
          )}
          <p
            data-rise
            className={`${SERIF} text-xl leading-relaxed italic ${BARK} lg:text-2xl`}
          >
            Gần bùn mà chẳng hôi tanh mùi bùn
          </p>
          <p data-rise className="max-w-[34ch] text-lg">
            Cảm ơn bạn đã đọc đến trang cuối. Sự hiện diện của bạn là niềm vui
            trọn vẹn nhất của hai gia đình.
          </p>
          <p
            data-rise
            className={`${DISPLAY} text-[clamp(3rem,13vw,6rem)] text-balance break-words`}
          >
            {couple}
          </p>
          <div data-rise>
            <GiftButton
              className={`${BTN} bg-[#A8395A] pl-2 text-white hover:-translate-y-0.5 [&>span]:bg-white [&>span]:text-[#A8395A]`}
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
