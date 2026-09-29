"use client";

import { useEffect, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useScrollProgress } from "@/kit/3d/use-scroll-progress";
import { useCountdown } from "@/kit/countdown";
import { formatMonth, weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { LotusCanvas, PETAL_PATH, useThreeD } from "./lotus-canvas";
import { type BloomId, cardVisible, reflectionIndex } from "./pond";

export const t = {
  root: "min-h-screen bg-[#F6EFE7] text-[#2F2A26] font-(family-name:--font-sans) font-light text-[17px] leading-[1.75]",
  name: "font-(family-name:--font-serif) italic font-light lg:text-[84px] text-[#D9577A] leading-[1.05] text-balance break-words",
  label:
    "text-[11px] lg:text-xs font-medium uppercase tracking-[0.3em] text-[#4F7D4A]",
  card: "rounded-2xl bg-white/80 backdrop-blur-md border border-[#4F7D4A]/20 p-6 max-w-[380px] w-full mx-auto pointer-events-auto",
  verse:
    "font-(family-name:--font-serif) italic text-lg lg:text-xl text-[#6B5E53]",
  btn: "min-h-11 rounded-full bg-[#A8395A] px-8 text-white tracking-[0.15em] uppercase text-sm pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8395A]",
  h2: "font-(family-name:--font-serif) font-normal text-[26px] lg:text-[34px] leading-tight",
} as const;

const TZ = "Asia/Ho_Chi_Minh";
const STORY: {
  id: BloomId;
  label: string;
  title: string;
  text: string;
  img: number;
}[] = [
  {
    id: "L1",
    label: "Trang III",
    title: "Duyên",
    text: "Gặp nhau giữa muôn người, như chuồn chuồn tình cờ đậu lại một nhành sen.",
    img: 3,
  },
  {
    id: "L2",
    label: "Trang IV",
    title: "Thương",
    text: "Thương nhau qua nắng qua mưa, qua cả những ngày bùn lầy nhất.",
    img: 4,
  },
  {
    id: "L3",
    label: "Trang V",
    title: "Nguyện",
    text: "Nguyện cùng nhau nở hoa, và cùng nhau giữ hương cho đến bạc đầu.",
    img: 5,
  },
];

function PetalMark() {
  return (
    <svg
      viewBox="0 0 24 32"
      aria-hidden="true"
      className="mx-auto mb-2 h-5 w-4 fill-[#D9577A]"
    >
      <path d={PETAL_PATH} />
    </svg>
  );
}

function Arch({ src, className = "" }: { src?: string; className?: string }) {
  if (!src) return null;
  return (
    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
    <img
      src={src}
      alt=""
      className={`aspect-3/4 rounded-t-full object-cover ${className}`}
    />
  );
}

export function LotusInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const mode = useThreeD();
  const reduced = useReducedMotion();
  const music = useMusic("/templates/lotus-3d/music.mp3", 0.5);

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
  const cd = useCountdown(date);
  const long = groom.name.length + bride.name.length > 24;

  const { contextSafe } = useGSAP(
    () => {
      // Card C2/C4: hiện theo trạng thái nở của bông sen (cardVisible), chỉ tween khi đổi.
      const shown: Partial<Record<BloomId, boolean>> = {};
      const els = bloomCards.current;
      gsap.set(Object.values(els), { autoAlpha: 0, y: 24 });
      ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          for (const id of Object.keys(els) as BloomId[]) {
            const v = cardVisible(id, s.progress);
            if (v === shown[id]) continue;
            shown[id] = v;
            gsap.to(els[id] ?? null, {
              autoAlpha: v ? 1 : 0,
              y: v ? 0 : 24,
              duration: reduced ? 0.4 : 1.1,
              ease: "sine.out",
              overwrite: "auto",
            });
          }
        },
      });
      // A1 cho các khối còn lại: hiện khi vào viewport.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-a1]")) {
        gsap.from(el, {
          autoAlpha: 0,
          y: reduced ? 0 : 24,
          duration: reduced ? 0.4 : 1.1,
          ease: "sine.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      }
    },
    { scope: track, dependencies: [reduced, mode] },
  );

  const open = contextSafe(() => {
    music.play(3000);
    introStart.current = performance.now();
    setPhase("intro");
    const q = gsap.utils.selector(gate);
    intro.current = gsap
      .timeline({ onComplete: () => setPhase("open") })
      .to(
        q("[data-gate-content]"),
        { autoAlpha: 0, duration: 0.6, ease: "sine.out" },
        0,
      )
      .fromTo(
        q("[data-skip]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 },
        0.5,
      )
      .to(
        q("[data-gate-mist]"),
        { opacity: 0, duration: 2.2, ease: "sine.out" },
        0.8,
      )
      .to({}, { duration: 0.5 }, 3);
  });
  const skip = () => {
    introStart.current = Number.NEGATIVE_INFINITY;
    intro.current?.progress(1);
  };

  // Lightbox mở → nhạc giảm về 0.25 để ngắm ảnh.
  const setLightbox = (i: number | null) => {
    if (music.playing) music.fadeTo(i === null ? 0.5 : 0.25, 600);
    setPhoto(i);
  };

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhoto(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const day = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    timeZone: TZ,
  }).format(date);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
  const gallery = reflectionIndex(images.length).filter((i) => images[i]);

  return (
    <div className={`${t.root} relative isolate overflow-x-clip`}>
      <LotusCanvas
        mode={mode}
        progress={progress}
        introStart={introStart}
        images={images}
        onPhoto={setLightbox}
      />
      <MusicToggle music={music} />

      {phase !== "open" && (
        <div
          ref={gate}
          id="dawn"
          className="fixed inset-0 z-30 flex items-end justify-center px-4 pb-24"
        >
          <div
            data-gate-mist
            className="absolute inset-0 bg-[#F6EFE7]/85 bg-[radial-gradient(ellipse_at_50%_35%,#F7C9A9_0%,transparent_55%)]"
          />
          <div data-gate-content className="relative text-center">
            <p className={t.verse}>“Trong đầm gì đẹp bằng sen…”</p>
            <p className="mt-4 text-balance break-words font-(family-name:--font-serif) text-[30px] italic text-[#D9577A]">
              {groom.name} · {bride.name}
            </p>
            <button
              type="button"
              onClick={open}
              disabled={phase !== "closed"}
              className={`${t.btn} mt-8`}
            >
              Mở thiệp
            </button>
          </div>
          {/* Luôn render (ẩn bằng `invisible`) để timeline mở thiệp tìm được target; GSAP autoAlpha hiện nó ở 0.5s. */}
          <button
            type="button"
            data-skip
            onClick={skip}
            className="invisible absolute bottom-24 left-1/2 min-h-11 -translate-x-1/2 rounded-full px-6 text-sm text-[#6B5E53] underline"
          >
            Bỏ qua
          </button>
        </div>
      )}

      <main ref={track} className="pointer-events-none px-4">
        {/* 1 · Sương tan */}
        <section
          id="mist"
          className="flex h-[75svh] items-end justify-center pb-16"
        >
          <p data-a1 className={`${t.label} text-center`}>
            Cuộn nhẹ để đi dạo đầm sen
          </p>
        </section>

        {/* 2 · Nụ sen lớn (C2) */}
        <section id="bloom" className="h-[112svh]">
          <div
            ref={(el) => {
              bloomCards.current.L0 = el;
            }}
            className="sticky top-16 text-center"
          >
            <p className={t.label}>── Trang I ──</p>
            <p className="mt-3 text-[15px] text-[#6B5E53]">
              Trân trọng báo tin lễ thành hôn của
            </p>
            <h1
              className={`${t.name} mt-3 ${long ? "text-[32px]" : "text-[44px]"}`}
            >
              <span className="block">{groom.name}</span>
              <span className="block text-[0.6em]">&amp;</span>
              <span className="block">{bride.name}</span>
            </h1>
          </div>
        </section>

        {/* 3 · Hai lá sen (C3) */}
        <section id="leaves" className="h-[112svh]">
          <div data-a1 className={`${t.card} sticky top-16`}>
            <PetalMark />
            <p className={`${t.label} text-center`}>Trang II</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              {[
                { side: "Nhà trai", p: groom, img: images[1] },
                { side: "Nhà gái", p: bride, img: images[2] },
              ].map(({ side, p, img }) => (
                <div key={side} className="min-w-0">
                  {mode === false && (
                    <Arch src={img} className="mx-auto mb-3 w-full max-w-28" />
                  )}
                  <h2 className={t.label}>{side}</h2>
                  <p className="mt-1 break-words font-(family-name:--font-serif) text-xl">
                    {p.name}
                  </p>
                  <p className="mt-1 break-words text-[#6B5E53]">{p.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · Chuyện tình (C4) */}
        <section id="story" className="h-[150svh]">
          <div className="sticky top-16 grid">
            {STORY.map((s) => (
              <article
                key={s.id}
                ref={(el) => {
                  bloomCards.current[s.id] = el;
                }}
                className={`${t.card} col-start-1 row-start-1 flex gap-4`}
              >
                <Arch
                  src={images[s.img]}
                  className="w-[88px] shrink-0 self-start"
                />
                <div className="min-w-0">
                  <p className={t.label}>{s.label}</p>
                  <h2 className={`${t.h2} mt-1`}>{s.title}</h2>
                  <p className="mt-2 text-[#6B5E53]">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5 · Soi bóng (C8) */}
        <section id="reflection" className="min-h-[112svh] pb-16">
          <div
            data-a1
            className="sticky top-16 mx-auto max-w-[380px] text-center"
          >
            <p className={t.label}>Trang VI</p>
            <h2 className={`${t.h2} mt-1`}>Soi bóng</h2>
            <p className="mt-2 text-[#6B5E53]">
              Những khoảnh khắc in bóng xuống mặt đầm.
            </p>
            {mode && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className={`${t.btn} mt-4`}
              >
                {showAll ? "Thu gọn" : "Xem tất cả ảnh"}
              </button>
            )}
          </div>
          {(showAll || mode === false) && (
            <div className="pointer-events-auto relative mx-auto mt-[30svh] grid max-w-xl grid-cols-2 gap-x-4 gap-y-8">
              {gallery.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={`Xem ảnh ${i + 1}`}
                  className="block rounded-lg focus-visible:outline-2 focus-visible:outline-[#A8395A]"
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL */}
                  <img
                    src={images[i]}
                    alt={`Ảnh cưới ${i + 1}`}
                    className="aspect-3/4 w-full rounded-lg object-cover"
                  />
                  {/* biome-ignore lint/performance/noImgElement: bóng phản chiếu giả */}
                  <img
                    src={images[i]}
                    alt=""
                    className="aspect-3/4 h-12 w-full -scale-y-100 rounded-lg object-cover object-bottom opacity-30 mask-[linear-gradient(to_bottom,black,transparent)]"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 6 · Thuỷ tạ (C5 + C6 + C7) */}
        <section id="pavilion" className="min-h-[112svh] py-16">
          <div data-a1 className={`${t.card} text-center`}>
            <p className={t.label}>Trang VII · Hẹn ngày</p>
            <p className="mt-2 font-(family-name:--font-serif) text-[88px] font-extralight leading-none lg:text-[128px]">
              {day}
            </p>
            <p className={`${t.label} mt-2 text-[#2F2A26]`}>
              {formatMonth(date)}
            </p>
            {data.date && cd && (
              <p className="mt-3 text-[#A8395A]">
                {cd.done
                  ? "Chúng tôi đã nên duyên vợ chồng ♥"
                  : `${cd.days} ngày · ${String(cd.hours).padStart(2, "0")} giờ · ${String(cd.minutes).padStart(2, "0")} phút`}
              </p>
            )}
            <div
              className="my-5 flex items-center gap-3 text-[#D9577A]"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-[#4F7D4A]/30" />❀
              <span className="h-px flex-1 bg-[#4F7D4A]/30" />
            </div>
            <ul className="space-y-3 text-left">
              {[
                {
                  name: "Lễ vu quy",
                  time: "08:00",
                  at: `Tại nhà gái · ${bride.address}`,
                },
                {
                  name: "Lễ thành hôn",
                  time: "10:00",
                  at: `Tại nhà trai · ${groom.address}`,
                },
                {
                  name: "Tiệc cưới",
                  time: "18:00",
                  at: `Tại ${venue.name ?? "nhà hàng"}`,
                },
              ].map((e) => (
                <li key={e.name}>
                  <div className="flex justify-between gap-4 font-(family-name:--font-serif) text-lg">
                    <span>{e.name}</span>
                    <span>{e.time}</span>
                  </div>
                  <p className="break-words text-[15px] text-[#6B5E53]">
                    {e.at}
                  </p>
                </li>
              ))}
            </ul>
            <MapEmbed
              venue={venue}
              className="mt-5 h-[200px] w-full rounded-xl"
            />
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className={`${t.btn} mt-4 inline-flex items-center`}
            >
              Chỉ đường
            </a>
          </div>
        </section>

        {/* 7 · Cánh sen bay (C10) */}
        <section
          id="petals"
          className="flex min-h-[175svh] items-end justify-center pb-[20svh]"
        >
          <div data-a1 className="max-w-[380px] text-center">
            <p className="font-(family-name:--font-serif) text-xl italic">
              Tấm lòng như đoá sen thơm, xin gửi đến bạn lời cảm ơn chân thành.
            </p>
            <Arch
              src={images[7] ?? images.at(-1)}
              className="mx-auto mt-6 w-40"
            />
            <p className="mt-4 break-words font-(family-name:--font-serif) text-2xl italic text-[#D9577A]">
              {groom.name} &amp; {bride.name}
            </p>
          </div>
        </section>
      </main>

      {lightbox !== null && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Esc xử lý qua listener window, có nút "Đóng"
        <div
          role="dialog"
          aria-modal
          aria-label="Xem ảnh"
          className="fixed inset-0 z-[45] flex items-center justify-center bg-[#2F2A26]/85 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL */}
          <img
            src={images[lightbox]}
            alt={`Ảnh cưới ${lightbox + 1}`}
            className="max-h-[85svh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-20 right-4 min-h-11 rounded-full bg-white/90 px-4 text-sm"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}
