"use client";

import {
  ArrowUpRightIcon,
  CompassIcon,
  ImagesIcon,
} from "@phosphor-icons/react";
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
import { gsap, useGSAP } from "@/kit/gsap";
import { AlbumSheet, Lightbox } from "@/kit/lightbox";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Gate } from "./gate";
import { CompassRose, Leg, Stamp, Stop } from "./route";
import { t } from "./tokens";

const pad = (n: number) => String(n).padStart(2, "0");
/** Toạ độ dạng 10°46′B · 106°42′Đ. */
const dms = (v: number, pos: string, neg: string) => {
  const a = Math.abs(v);
  return `${Math.floor(a)}°${pad(Math.round((a % 1) * 60))}′${v >= 0 ? pos : neg}`;
};

// Bản Đồ Hành Trình (docs/templates/route-map-2d.md): cuộn bản đồ → đường nét đứt nối các điểm dừng → dấu ✕ tiệc cưới.
export function RouteInvite() {
  const { data } = useWedding();
  const { groom, bride, images, venue } = data;
  const date = weddingDate(data);
  const left = useCountdown(date);
  const music = useMusic();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [done, setDone] = useState<string | null>(null);
  useScrollLock(!opened);

  useGSAP(
    () => {
      if (!opened || reduced) return;
      for (const p of gsap.utils.toArray<SVGPathElement>("[data-leg]"))
        gsap.fromTo(
          p,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: p.closest("svg"),
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      for (const el of gsap.utils.toArray<HTMLElement>("[data-stop]")) {
        const s = el.dataset.stop;
        gsap.from(el, {
          autoAlpha: 0,
          x: s === "left" ? 30 : s === "right" ? -30 : 0,
          y: s === "center" ? 30 : 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      }
      gsap.from("[data-dot]", {
        scale: 0,
        duration: 0.4,
        ease: "back.out(3)",
        stagger: 0.05,
        scrollTrigger: { trigger: "[data-dot]", start: "top 85%", once: true },
      });
      gsap.to("[data-needle]", {
        rotation: 540,
        ease: "none",
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      gsap.from("[data-x]", {
        scale: 3,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power4.in",
        scrollTrigger: { trigger: "[data-x]", start: "top 80%", once: true },
      });
      gsap.from("[data-card]", {
        autoAlpha: 0,
        y: 24,
        rotate: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-card]", start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);
  const coord = `${dms(venue.lat, "B", "N")} · ${dms(venue.lng, "Đ", "T")}`;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  const at = (m: number) => formatTime(new Date(date.getTime() + m * 60_000));

  return (
    <div ref={root} className={t.root}>
      <MusicToggle music={music} className="bg-[#FBF6EA]/90 text-[#1F4E79]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />
      {/* La bàn quay theo tiến độ hành trình (trang trí, không đè 3 góc chung). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-24 left-4 z-30 hidden size-12 sm:flex items-center justify-center rounded-full bg-[#FBF6EA] shadow-[3px_3px_0_#1F4E79] ring-2 ring-[#1F4E79]"
      >
        <span data-needle className="flex">
          <CompassIcon weight="duotone" className="size-7 text-[#1F4E79]" />
        </span>
      </div>

      <SmoothScroll>
        <main className={t.map}>
          {/* C2 · Tiêu đề bản đồ */}
          <header className="relative mx-auto flex min-h-[92svh] w-[min(92vw,1100px)] flex-col items-center justify-center pt-20 text-center">
            <CompassRose className="size-24 sm:size-28" />
            <p className={`${t.label} mt-10`}>
              Trân trọng kính mời bạn cùng lên đường
            </p>
            <h1
              className={`${t.display} ${t.navy} mt-4 text-[44px] leading-[1.05] font-bold italic break-words sm:text-[76px]`}
            >
              <span className="block">{groom.name}</span>
              <span className={`block text-[0.5em] not-italic ${t.red}`}>
                &amp;
              </span>
              <span className="block">{bride.name}</span>
            </h1>
            <p className="mt-6 text-[17px] font-medium capitalize">
              {formatWeekday(date)}, {formatDate(date)}
            </p>
            <dl
              className={`${t.card} mt-10 grid grid-cols-3 gap-4 px-5 py-4 text-left text-[13px]`}
            >
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#1F4E79]" />
                <dt className="sr-only">Chấm tròn</dt>
                <dd>Điểm dừng</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 border-t-2 border-dashed border-[#1F4E79]" />
                <dt className="sr-only">Nét đứt</dt>
                <dd>Hành trình</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${t.display} text-[18px] font-bold ${t.red}`}>
                  ✕
                </span>
                <dt className="sr-only">Dấu X</dt>
                <dd>Tiệc cưới</dd>
              </div>
            </dl>
            <div className="mt-10 w-full">
              <Leg from="center" to="left" />
            </div>
          </header>

          <ol className="mx-auto w-[min(100vw,1100px)]">
            <Stop
              n={1}
              side="left"
              next="right"
              title="Nhà chú rể"
              coord="Nơi xuất phát"
            >
              <div className="grid grid-cols-[42%_1fr] items-end gap-4">
                <Stamp
                  src={images[1]}
                  alt={`Chú rể ${groom.name}`}
                  onClick={() => view(1)}
                  className="-rotate-2"
                />
                <div>
                  <p
                    className={`${t.display} text-[24px] leading-tight font-bold break-words`}
                  >
                    {groom.name}
                  </p>
                  <p className={`text-[14px] ${t.soft} break-words`}>
                    {groom.address}
                  </p>
                </div>
              </div>
            </Stop>
            <Stop
              n={2}
              side="right"
              next="left"
              title="Nơi gặp nhau"
              coord="Một quán nhỏ đầu dốc"
            >
              <Stamp
                src={images[3]}
                alt="Nơi gặp nhau"
                onClick={() => view(3)}
                ratio="aspect-[4/3]"
                className="rotate-1"
              />
              <p className={`mt-3 ${t.soft}`}>
                Một chuyến đi lạc đường, hai người hỏi đường cùng một bác xe ôm.
                Bác chỉ sai, nhưng tụi mình gặp đúng người.
              </p>
            </Stop>
            <Stop
              n={3}
              side="left"
              next="right"
              title="Lần hẹn đầu"
              coord="Bờ biển lúc hoàng hôn"
            >
              <Stamp
                src={images[4]}
                alt="Lần hẹn đầu"
                onClick={() => view(4)}
                ratio="aspect-[4/3]"
                className="-rotate-1"
              />
              <p className={`mt-3 ${t.soft}`}>
                Hẹn nhau xem mặt trời lặn, cuối cùng ngồi tới lúc trăng lên lúc
                nào không hay.
              </p>
            </Stop>
            <Stop
              n={4}
              side="right"
              next="left"
              title="Lời cầu hôn"
              coord="Đỉnh đèo mùa mây"
            >
              <Stamp
                src={images[5]}
                alt="Lời cầu hôn"
                onClick={() => view(5)}
                ratio="aspect-[4/3]"
                className="rotate-2"
              />
              <p className={`mt-3 ${t.soft}`}>
                Trên con đèo quen, anh mở hộp nhẫn. Em nói "có" trước khi anh
                kịp hỏi hết câu.
              </p>
            </Stop>
            <Stop
              n={5}
              side="left"
              next="center"
              title="Nhà cô dâu"
              coord="Chặng rước dâu"
            >
              <div className="grid grid-cols-[42%_1fr] items-end gap-4">
                <Stamp
                  src={images[2]}
                  alt={`Cô dâu ${bride.name}`}
                  onClick={() => view(2)}
                  className="rotate-2"
                />
                <div>
                  <p
                    className={`${t.display} text-[24px] leading-tight font-bold break-words`}
                  >
                    {bride.name}
                  </p>
                  <p className={`text-[14px] ${t.soft} break-words`}>
                    {bride.address}
                  </p>
                  <p className="mt-2 text-[14px]">
                    Lễ vu quy lúc {formatTime(vuQuy)}
                  </p>
                </div>
              </div>
            </Stop>
            <Stop
              n={6}
              side="center"
              next="right"
              title="Ngày khởi hành"
              coord={formatDate(date)}
            >
              {/* vé tàu */}
              <div className="grid grid-cols-[1fr_auto] overflow-hidden rounded-md border-2 border-dashed border-[#1F4E79]/50">
                <div className="p-4">
                  <p className={t.label}>Vé một chiều, hai hành khách</p>
                  <p
                    className={`${t.display} ${t.red} text-[72px] leading-none font-extrabold tabular-nums sm:text-[96px]`}
                  >
                    {formatDate(date).slice(0, 2)}
                  </p>
                  <p className="font-semibold capitalize">
                    {formatWeekday(date)}, tháng {formatDate(date).slice(3, 5)}{" "}
                    năm {formatDate(date).slice(6)}
                  </p>
                  <p className={`mt-1 text-[14px] ${t.soft}`}>
                    Khởi hành {formatTime(date)}
                  </p>
                </div>
                <div
                  className="flex w-24 flex-col justify-center border-l-2 border-dashed border-[#1F4E79]/50 p-3 text-center"
                  role="timer"
                  aria-label="Thời gian còn lại tới ngày cưới"
                >
                  {left?.done ? (
                    <p className="text-[13px] font-semibold">Đã tới nơi</p>
                  ) : (
                    (
                      [
                        ["ngày", left?.days],
                        ["giờ", left?.hours],
                        ["phút", left?.minutes],
                      ] as const
                    ).map(([l, v]) => (
                      <p key={l} className="leading-tight">
                        <span
                          className={`${t.display} block text-[22px] font-bold tabular-nums`}
                        >
                          {v === undefined ? "--" : pad(v)}
                        </span>
                        <span className={`text-[11px] ${t.soft}`}>{l}</span>
                      </p>
                    ))
                  )}
                </div>
              </div>
            </Stop>
            <Stop
              n={7}
              side="right"
              next="center"
              title="Lịch trình"
              coord="Chú giải trong ngày"
            >
              <ul className="grid gap-2">
                {(
                  [
                    [at(-60), "Đón khách"],
                    [at(0), "Làm lễ"],
                    [at(30), "Khai tiệc"],
                    [at(120), "Giao lưu"],
                  ] as const
                ).map(([time, label]) => (
                  <li
                    key={label}
                    className="flex items-baseline gap-3 border-b border-dashed border-[#E6D8BA] pb-2 last:border-0"
                  >
                    <span className="w-14 font-semibold tabular-nums">
                      {time}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </Stop>
            <li className="relative pb-10">
              <div className="mx-auto flex w-[min(92%,40rem)] flex-col items-center text-center">
                <span
                  data-x
                  aria-hidden="true"
                  className={`${t.display} ${t.red} text-[64px] leading-none font-extrabold`}
                >
                  ✕
                </span>
                <p className={t.label}>Điểm 08 · Kho báu</p>
                <h2
                  className={`${t.display} ${t.navy} mt-1 text-[32px] font-bold sm:text-[40px]`}
                >
                  {venue.name ?? "Nhà hàng tiệc cưới"}
                </h2>
                <p className={t.coord}>{coord}</p>
                <div className={`${t.card} mt-6 w-full overflow-hidden p-1.5`}>
                  <MapEmbed
                    venue={venue}
                    className="aspect-[4/3] w-full rounded-md sm:aspect-[16/9]"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${t.btn} mt-6`}
                >
                  Chỉ đường tới kho báu
                  <ArrowUpRightIcon weight="bold" className="size-4" />
                </a>
              </div>
            </li>
          </ol>

          {/* C8 · Bưu thiếp: toàn bộ ảnh */}
          <section className="mx-auto w-[min(94vw,1100px)] py-24">
            <h2
              className={`${t.display} ${t.navy} text-center text-[36px] font-bold italic sm:text-[48px]`}
            >
              Bưu thiếp dọc đường
            </h2>
            <p className={`mt-2 text-center ${t.soft}`}>
              {images.length} tấm gửi về từ những nơi hai đứa đã đi qua.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {images.map((src, i) => (
                <div
                  key={src}
                  data-card
                  className={
                    ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"][i % 4]
                  }
                >
                  <Stamp
                    src={src}
                    alt={`Khoảnh khắc ${i + 1}`}
                    onClick={() => view(i)}
                    ratio={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}
                  />
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setAlbum(true)}
                className={t.btn}
              >
                <ImagesIcon className="size-5" />
                Xem trọn album
              </button>
            </div>
          </section>

          {/* C14 + C15 · Hộp thư */}
          <section className="mx-auto grid w-[min(92vw,960px)] gap-8 py-16 sm:grid-cols-2">
            <div className={`${t.card} p-6`}>
              <h2 className={`${t.display} ${t.navy} text-[28px] font-bold`}>
                Mừng cưới
              </h2>
              <p className={`mt-2 ${t.soft}`}>
                Có bạn đi cùng đoạn đường này đã là món quà rồi. Nếu muốn gửi
                thêm lời chúc, bấm vào đây nhé.
              </p>
              <div className="mt-5">
                <GiftButton
                  className={`${t.btn} pl-2 [&>span]:rounded-md [&>span]:bg-[#C0392B]`}
                />
              </div>
            </div>
            <div className={`${t.card} p-6`}>
              <h2 className={`${t.display} ${t.navy} text-[28px] font-bold`}>
                Xác nhận tham dự
              </h2>
              {done ? (
                <p className="mt-4 text-[18px]" aria-live="polite">
                  Cảm ơn {done}! Hẹn gặp bạn ở điểm ✕.
                </p>
              ) : (
                <form
                  className="mt-4 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (name.trim()) setDone(name.trim());
                  }}
                >
                  <label className="grid gap-1">
                    <span className="text-[14px] font-semibold">
                      Tên của bạn
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      autoComplete="name"
                      placeholder="Đỗ Quang Huy"
                      className="h-12 rounded-lg bg-white px-4 ring-2 ring-[#1F4E79]/30 outline-none placeholder:text-[#6B5E48]/70 focus:ring-[#1F4E79]"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        [true, "Sẽ đến"],
                        [false, "Không đến được"],
                      ] as const
                    ).map(([v, label]) => (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={going === v}
                        onClick={() => setGoing(v)}
                        className="min-h-12 rounded-lg px-2 text-[15px] font-medium ring-2 ring-[#1F4E79]/30 aria-pressed:bg-[#1F4E79] aria-pressed:text-white"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={t.btn}
                  >
                    Gửi thư
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* C10 · Cuộn bản đồ lại */}
          <section className="mx-auto flex w-[min(92vw,560px)] flex-col items-center pt-16 pb-40 text-center">
            <div className="w-[min(76vw,360px)]">
              <Stamp
                src={images.at(-1)}
                alt={couple}
                onClick={() => view(images.length - 1)}
                className="-rotate-1"
              />
            </div>
            <p
              className={`${t.display} ${t.navy} mt-12 text-[40px] font-bold italic sm:text-[52px]`}
            >
              Hẹn gặp ở điểm cuối
            </p>
            <p className={`mt-3 max-w-[34ch] ${t.soft}`}>
              Cảm ơn bạn đã đi cùng tấm bản đồ này. Chặng đường mới của tụi mình
              bắt đầu từ ngày bạn tới chung vui.
            </p>
            <p
              className={`${t.display} mt-6 text-[24px] font-bold text-balance break-words`}
            >
              {couple}
            </p>
          </section>
        </main>
      </SmoothScroll>

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
