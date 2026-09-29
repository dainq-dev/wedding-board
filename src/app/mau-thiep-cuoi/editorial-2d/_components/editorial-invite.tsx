"use client";

import { useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatTime, formatWeekday, weddingDate } from "@/kit/dates";
import { gsap, ScrollSmoother, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { clipReveal, marquee, splitReveal } from "@/kit/presets";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import {
  barcodeIssue,
  coverMode,
  dayMonth,
  dottedDate,
  issueLabel,
  issueNumber,
} from "./cover-fit";
import { t } from "./tokens";

const TOC = [
  ["04", "Số đặc biệt", "bai-dac-biet"],
  ["06", "“Chúng tôi đã gặp nhau như thế nào”", "bai-phong-van"],
  ["08", "Chuyện tình", "bai-chuyen-tinh"],
  ["10", "Khoảnh khắc", "bai-khoanh-khac"],
  ["14", "Lịch sự kiện", "bai-su-kien"],
  ["16", "Thư độc giả", "bai-doc-gia"],
] as const;

const QA = [
  {
    q: "Ấn tượng đầu tiên?",
    a: [
      ["Anh", "Nụ cười của em, và việc em cười trước khi anh kịp nói gì."],
      ["Em", "Anh ấy đến muộn 15 phút, nhưng mang theo hai ly cà phê."],
    ],
  },
  {
    q: "Khoảnh khắc biết đây là người ấy?",
    a: [
      ["Anh", "Khi em ngủ quên trên vai anh suốt chuyến xe."],
      ["Em", "Khi anh nhớ món em không ăn được."],
    ],
  },
  {
    q: "Lời nhắn cho khách mời?",
    a: [["Cả hai", "Hãy đến, ăn thật ngon và nhảy thật vui cùng chúng tôi."]],
  },
] as const;

const STORY = [
  ["2019", "Gặp gỡ", "Một buổi chiều, hai người lạ chung một bàn cà phê."],
  ["2022", "Yêu", "Từ đó, mọi kế hoạch đều có tên người kia."],
  ["2025", "Cầu hôn", "Một câu hỏi ngắn, một câu trả lời còn ngắn hơn."],
] as const;

function RunningHeader({ page }: { page: string }) {
  return (
    <div className={`${t.label} col-span-full flex justify-between`}>
      <span className="text-[#111111]">
        LOVE<span className={t.red}>.</span>
      </span>
      <span className={t.red}>P. {page}</span>
    </div>
  );
}

// biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...p} />;

export function EditorialInvite() {
  const { data } = useWedding();
  const { groom, bride, images, venue } = data;
  const date = weddingDate(data);
  const left = useCountdown(date);
  const music = useMusic("/templates/editorial-2d/music.wav", 0.5);
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [going, setGoing] = useState(true);
  const [guests, setGuests] = useState(1);
  const [sent, setSent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  useScrollLock(!opened || zoom !== null);

  const mode = coverMode(groom.name, bride.name);

  useGSAP(
    () => {
      if (!cover.current) return;
      const img = cover.current.querySelector(".ed-cover-img");
      if (img) clipReveal(img);
      gsap.from(".ed-logo span", {
        yPercent: 100,
        stagger: 0.05,
        delay: 0.3,
        duration: 1,
        ease: "expo.out",
      });
      splitReveal(".ed-cover-name", { by: "lines" }).delay(0.7);
    },
    { scope: cover },
  );

  useGSAP(
    () => {
      if (!opened) return;
      for (const el of gsap.utils.toArray<HTMLElement>(".ed-reveal")) {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
      if (reduced) return;
      gsap.fromTo(
        ".ed-line-1",
        { xPercent: -30 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#bai-dac-biet",
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".ed-line-2",
        { xPercent: 30 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#bai-dac-biet",
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".ed-underline",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".ed-underline",
            start: "top 85%",
            end: "top 50%",
            scrub: true,
          },
        },
      );
      marquee(".ed-marquee");
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const open = () => {
    music.play();
    setOpened(true);
    if (!reduced && cover.current)
      gsap.to(cover.current, {
        rotateY: -110,
        duration: 0.9,
        ease: "power3.inOut",
      });
  };

  const jump = (id: string) => {
    const s = ScrollSmoother.get();
    if (s) s.scrollTo(`#${id}`, true, "top top");
    else document.getElementById(id)?.scrollIntoView();
  };

  const nameSize =
    mode === "bleed"
      ? "text-[56px] leading-[0.95] lg:text-[160px] lg:whitespace-nowrap"
      : "text-[clamp(2.5rem,14vw,10rem)] leading-[0.95] break-words";

  return (
    <div ref={root} className={t.root}>
      <SmoothScroll>
        <main>
          {/* Mục lục */}
          <section className={`${t.section} ${t.grid} content-start gap-y-6`}>
            <RunningHeader page="02" />
            <h2
              className={`${t.display} ed-reveal col-span-full text-[32px] font-bold lg:text-[64px]`}
            >
              Mục lục
            </h2>
            <ol className={`col-span-full lg:col-span-7 ${t.rule}`}>
              {TOC.map(([p, title, id]) => (
                <li key={id} className={`ed-reveal border-b border-[#D6D3CE]`}>
                  <button
                    type="button"
                    onClick={() => jump(id)}
                    className={`flex min-h-11 w-full cursor-pointer items-baseline gap-4 py-3 text-left transition-colors hover:text-[#B91C1C] ${t.focus}`}
                  >
                    <span className={`${t.red} text-xs font-bold tabular-nums`}>
                      {p}
                    </span>
                    <span className={`${t.display} text-xl`}>{title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="col-span-full grid grid-cols-2 gap-3 lg:col-span-4 lg:col-start-9">
              {[images[1], images[2]].map(
                (src) =>
                  src && (
                    <Img
                      key={src}
                      src={src}
                      alt=""
                      className="aspect-3/4 w-full object-cover"
                    />
                  ),
              )}
            </div>
          </section>

          {/* C2 */}
          <section
            id="bai-dac-biet"
            className={`${t.section} justify-center gap-8`}
          >
            <div className={t.grid}>
              <RunningHeader page="04" />
              <p className={`${t.label} col-span-full mt-6`}>Số đặc biệt</p>
            </div>
            <h2
              className={`${t.display} text-[64px] font-black uppercase leading-[0.95] lg:text-[140px]`}
            >
              <span className="ed-line-1 block whitespace-nowrap pl-4 lg:pl-[6vw]">
                {groom.name}
              </span>
              <span className="ed-line-2 block whitespace-nowrap pr-4 text-right lg:pr-[6vw]">
                <span className={t.red}>&amp;</span> {bride.name}
              </span>
            </h2>
            <div className={t.grid}>
              <div className="ed-reveal col-span-2 flex flex-col items-center justify-center border-2 border-[#111111] p-3 lg:col-span-2">
                <span className={`${t.display} text-4xl font-black`}>
                  Nº {issueNumber(date)}
                </span>
                <span className={t.label}>{dottedDate(date)}</span>
              </div>
              <p className="ed-reveal col-span-4 self-center text-[15px] leading-[1.65] lg:col-span-5 lg:text-base">
                Trân trọng kính mời quý khách đến dự lễ thành hôn của chúng tôi.
              </p>
            </div>
          </section>

          {/* C3 */}
          <section
            id="bai-phong-van"
            className={`${t.section} ${t.grid} content-start gap-y-8`}
          >
            <RunningHeader page="06" />
            <h2
              className={`${t.display} ed-reveal col-span-full text-[32px] font-bold uppercase leading-[1.05] lg:text-[64px]`}
            >
              “Chúng tôi đã gặp nhau như thế nào”
            </h2>
            <div className="col-span-full grid grid-cols-2 gap-3 lg:col-span-5">
              {(
                [
                  ["Chú rể", "Nhà trai", groom, images[1]],
                  ["Cô dâu", "Nhà gái", bride, images[2]],
                ] as const
              ).map(([role, side, p, src]) => (
                <figure key={role} className="ed-reveal min-w-0">
                  {src && (
                    <Img
                      src={src}
                      alt={`${role} ${p.name}`}
                      className="aspect-3/4 w-full object-cover"
                    />
                  )}
                  <figcaption className="mt-3">
                    <p className={t.label}>{role}</p>
                    <p className={`${t.display} text-xl font-bold break-words`}>
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm text-[#5C5C5C] break-words">
                      {side}: {p.address}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="col-span-full text-[15px] leading-[1.65] lg:col-span-6 lg:col-start-7 lg:columns-2 lg:gap-10 lg:text-base">
              {QA.map((item, i) => (
                <div key={item.q} className="ed-reveal mb-6 break-inside-avoid">
                  <p className="font-bold">H: {item.q}</p>
                  {item.a.map(([who, text], j) => (
                    <p key={who} className="mt-2">
                      <span className="font-bold uppercase">{who}: </span>
                      {i === 0 && j === 0 ? (
                        <>
                          <span
                            className={`${t.display} float-left mr-2 text-[64px] leading-[0.8] font-black lg:text-[96px]`}
                          >
                            {text[0]}
                          </span>
                          {text.slice(1)}
                        </>
                      ) : (
                        `“${text}”`
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* C4 */}
          <section
            id="bai-chuyen-tinh"
            className={`${t.section} ${t.grid} content-start gap-y-10`}
          >
            <RunningHeader page="08" />
            <blockquote className="ed-reveal col-span-full lg:col-span-8">
              <p
                className={`${t.display} text-[28px] italic leading-[1.2] lg:text-[48px]`}
              >
                “Yêu là cùng nhau nhìn về một hướng.”
              </p>
              <span
                aria-hidden
                className="ed-underline mt-3 block h-1 w-2/3 origin-left bg-[#B91C1C]"
              />
            </blockquote>
            {STORY.map(([year, title, text], i) => {
              const src = images[3 + i];
              return (
                <div
                  key={year}
                  className={`ed-reveal col-span-full grid grid-cols-6 items-end gap-3 lg:col-span-8 ${i % 2 ? "lg:col-start-5" : ""}`}
                >
                  {src && (
                    <Img
                      src={src}
                      alt={`Chuyện tình ${year}: ${title}`}
                      data-speed={reduced ? undefined : i % 2 ? 1.1 : 0.9}
                      className={`col-span-4 aspect-4/3 w-full object-cover ${i % 2 ? "order-2" : ""}`}
                    />
                  )}
                  <div className="col-span-2">
                    <p className={`${t.display} text-3xl font-black ${t.red}`}>
                      {year}
                    </p>
                    <p className="font-bold">{title}</p>
                    <p className="text-sm text-[#5C5C5C]">{text}</p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* C8 */}
          <section id="bai-khoanh-khac" className={`${t.section} gap-6`}>
            <div className={t.grid}>
              <RunningHeader page="10" />
            </div>
            {images[0] && (
              <button
                type="button"
                onClick={() => setZoom(images[0])}
                className={`block cursor-zoom-in overflow-hidden ${t.focus}`}
              >
                <Img
                  src={images[0]}
                  alt="Ảnh bìa"
                  data-speed={reduced ? undefined : 0.85}
                  className="aspect-4/5 w-full object-cover lg:aspect-video"
                />
              </button>
            )}
            <div className={`${t.grid} gap-y-4`}>
              <p className={`${t.label} col-span-full`}>
                Ảnh: bìa · Trang phục cưới
              </p>
              <p
                className={`${t.display} col-span-1 text-2xl font-black uppercase [writing-mode:vertical-rl] lg:col-span-2 lg:text-5xl`}
              >
                Khoảnh khắc
              </p>
              {[images[6], images[7], images[4]].map(
                (src, i) =>
                  src && (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setZoom(src)}
                      className={`cursor-zoom-in ${t.focus} ${i === 0 ? "col-span-5 lg:col-span-10" : "col-span-3 lg:col-span-6"} ${i === 2 ? "mt-10" : ""}`}
                    >
                      <Img
                        src={src}
                        alt=""
                        className={`w-full object-cover ${i === 0 ? "aspect-4/3" : "aspect-3/4"}`}
                      />
                    </button>
                  ),
              )}
            </div>
          </section>

          {/* C5 + C6 + C7 */}
          <section
            id="bai-su-kien"
            className={`${t.section} ${t.grid} content-start gap-y-6`}
          >
            <RunningHeader page="14" />
            <h2
              className={`${t.display} ed-reveal col-span-full text-[32px] font-bold uppercase lg:text-[64px]`}
            >
              Lịch sự kiện
            </h2>
            <div
              className={`ed-reveal col-span-full lg:col-span-6 ${t.surface} p-5`}
            >
              <p className={t.label}>{formatWeekday(date)}</p>
              <p className={`${t.display} text-[72px] font-black leading-none`}>
                {dayMonth(date)}
              </p>
              <p className={`${t.label} mt-2`}>
                {date.getFullYear()} ·{" "}
                <span className={t.red}>
                  {left?.done
                    ? "Số báo đã phát hành — cảm ơn quý độc giả"
                    : left
                      ? `Còn ${left.days} ngày`
                      : ""}
                </span>
              </p>
              <dl className="mt-5 border-t border-[#D6D3CE]">
                {(
                  [
                    ["10:00", "Lễ cưới", `Tư gia nhà trai · ${groom.address}`],
                    [
                      formatTime(date),
                      "Tiệc cưới",
                      venue.name ?? "Nhà hàng tiệc cưới",
                    ],
                  ] as const
                ).map(([time, what, where]) => (
                  <div
                    key={what}
                    className="grid grid-cols-[4.5rem_1fr] border-b border-[#D6D3CE] py-3"
                  >
                    <dt className="font-bold tabular-nums">{time}</dt>
                    <dd>
                      <span className="block text-xs font-bold uppercase tracking-[0.2em]">
                        {what}
                      </span>
                      <span className="text-sm text-[#5C5C5C] break-words">
                        {where}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="ed-reveal col-span-full lg:col-span-6">
              <div className="grayscale">
                <MapEmbed venue={venue} className="aspect-16/10 w-full" />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.2em] underline underline-offset-4 ${t.red} ${t.focus}`}
              >
                Chỉ đường
              </a>
            </div>
          </section>

          {/* C15 */}
          <section
            id="bai-doc-gia"
            className={`${t.section} ${t.grid} content-start gap-y-6`}
          >
            <RunningHeader page="16" />
            <h2
              className={`${t.display} ed-reveal col-span-full text-[32px] font-bold uppercase lg:text-[64px]`}
            >
              Thư độc giả
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="ed-reveal col-span-full flex flex-col gap-5 lg:col-span-6"
            >
              <label className="flex flex-col gap-1">
                <span className={t.label}>Tên</span>
                <input
                  required
                  className={`min-h-11 border-b border-[#111111] bg-transparent outline-none ${t.focus}`}
                />
              </label>
              <div className="grid grid-cols-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={going === v}
                    onClick={() => setGoing(v)}
                    className={`min-h-11 border border-[#111111] text-xs font-bold uppercase tracking-[0.2em] ${going === v ? "bg-[#111111] text-white" : ""} ${t.focus}`}
                  >
                    {v ? "Sẽ tham dự" : "Vắng mặt"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className={t.label}>Số khách</span>
                <button
                  type="button"
                  aria-label="Bớt khách"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className={`size-11 border border-[#111111] ${t.focus}`}
                >
                  −
                </button>
                <span className="w-6 text-center tabular-nums">{guests}</span>
                <button
                  type="button"
                  aria-label="Thêm khách"
                  onClick={() => setGuests((g) => Math.min(10, g + 1))}
                  className={`size-11 border border-[#111111] ${t.focus}`}
                >
                  +
                </button>
              </div>
              <label className="flex flex-col gap-1">
                <span className={t.label}>Lời chúc</span>
                <textarea
                  rows={3}
                  className={`border-b border-[#111111] bg-transparent outline-none ${t.focus}`}
                />
              </label>
              <button
                type="submit"
                className={`${t.btn} self-start ${t.focus}`}
              >
                {sent ? "Đã gửi toà soạn ✓" : "Gửi toà soạn"}
              </button>
              <p className={t.label}>Bản xem thử — không gửi đi</p>
            </form>
          </section>

          {/* C10 */}
          <section className="flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#111111] py-14 text-white">
            <div className="ed-marquee flex w-max whitespace-nowrap">
              {[0, 1].map((k) => (
                <span
                  key={k}
                  aria-hidden={k === 1}
                  className={`${t.display} pr-10 text-[72px] font-black italic lg:text-[140px]`}
                >
                  {groom.name} &amp; {bride.name} ·{" "}
                </span>
              ))}
            </div>
            <div className="flex items-end justify-between px-4 lg:px-[6vw]">
              <p className={`${t.display} text-2xl italic lg:text-4xl`}>
                Cảm ơn vì đã đọc.
              </p>
              <div className="flex flex-col items-end gap-1" aria-hidden>
                <div className="h-10 w-28 bg-[repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_4px,#fff_4px_5px,transparent_5px_8px)]" />
                <span className="text-[10px] tracking-[0.3em]">
                  {barcodeIssue(date)}
                </span>
              </div>
            </div>
          </section>
        </main>
      </SmoothScroll>

      {zoom && (
        <button
          type="button"
          onClick={() => setZoom(null)}
          aria-label="Đóng ảnh"
          className="fixed inset-0 z-40 flex cursor-zoom-out items-center justify-center bg-white/95 p-4"
        >
          <Img
            src={zoom}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </button>
      )}
      {opened && <MusicToggle music={music} />}

      <OpenGate onOpen={open} className="!bg-[#FFFFFF] [perspective:2000px]">
        <div
          ref={cover}
          className="relative flex h-full w-full origin-left flex-col bg-[#111111] text-white"
        >
          {images[0] && (
            <Img
              src={images[0]}
              alt="Ảnh bìa"
              className="ed-cover-img absolute inset-0 size-full object-cover"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"
          />
          <div className="relative flex h-full flex-col overflow-hidden px-4 pt-16 pb-8 lg:px-[6vw]">
            <p
              className={`${t.display} ed-logo -ml-1 overflow-hidden text-[64px] font-black leading-none tracking-[-0.02em] lg:text-[180px]`}
            >
              {"LOVE".split("").map((c) => (
                <span key={c} className="inline-block">
                  {c}
                </span>
              ))}
              <span className={`inline-block ${t.red}`}>.</span>
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] lg:text-[11px]">
              Số đặc biệt · {issueLabel(date)}
            </p>
            <h1
              className={`${t.display} ed-cover-name mt-auto font-black italic ${nameSize}`}
            >
              {groom.name} &amp;
              <br />
              {bride.name}
            </h1>
            <p className="mt-4 text-sm">“Chúng tôi nói ‘Có’”</p>
            <p className="text-sm opacity-80">
              Bên trong: toàn bộ lịch trình ngày trọng đại
            </p>
            <button
              type="button"
              className="mt-6 min-h-11 self-start bg-white px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#111111]"
            >
              Mở số báo
            </button>
          </div>
        </div>
      </OpenGate>
    </div>
  );
}
