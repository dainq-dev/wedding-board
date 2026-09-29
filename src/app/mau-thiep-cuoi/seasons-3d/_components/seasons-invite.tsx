"use client";

import { useEffect, useRef, useState } from "react";
import { Color } from "three";
import { MapEmbed } from "@/components/map-embed";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatTime, weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { BG, seasonAt, seasonColor } from "./season";
import { SeasonsCanvas } from "./seasons-canvas";

const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#FDEEF2] text-[#1F2937] font-(family-name:--font-sans) text-base leading-[1.7] lg:text-[17px]",
  name: "font-(family-name:--font-serif) italic font-medium text-[#C2410C] leading-[1.05] text-balance break-words",
  label:
    "text-[11px] lg:text-xs font-semibold uppercase tracking-[0.3em] text-[#4B5563]",
  title:
    "font-(family-name:--font-serif) font-medium text-[26px] lg:text-[34px] leading-tight",
  card: "w-full max-w-[400px] rounded-[1.25rem] bg-white/75 p-6 shadow-[0_8px_30px_rgb(0_0_0/0.06)] backdrop-blur-sm",
  btn: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#C2410C] px-7 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]",
} as const;

const STORY = [
  {
    title: "Nảy mầm",
    text: "Chúng tôi gặp nhau vào một ngày rất bình thường, không ai ngờ đó là hạt mầm đầu tiên.",
  },
  {
    title: "Xanh lá",
    text: "Những mùa hè rong ruổi, những buổi chiều không muốn về, tình yêu cứ thế lớn lên.",
  },
  {
    title: "Kết trái",
    text: "Rồi một ngày, anh hỏi, em gật đầu. Cây đã đủ lớn để che chở cho cả hai.",
  },
];

const CHAPTERS = ["spring", "summer", "autumn", "winter", "bloom"] as const;
const SEASON_NAMES = ["mùa xuân", "mùa hạ", "mùa thu", "mùa đông", "mùa xuân"];

export function SeasonsInvite() {
  const { data } = useWedding();
  const { groom, bride, venue } = data;
  const images = data.images.filter(Boolean);
  const date = weddingDate(data);
  const left = useCountdown(date);
  const music = useMusic();
  const reduced = useReducedMotion();

  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    try {
      setWebgl(!!document.createElement("canvas").getContext("webgl2"));
    } catch {
      setWebgl(false);
    }
  }, []);
  const threeD = webgl && !reduced;

  const [opened, setOpened] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [shown, setShown] = useState<number | null>(null);
  useScrollLock(!unlocked);

  const root = useRef<HTMLDivElement>(null);
  const chapters = useRef<HTMLDivElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const gateBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const progress = useRef(0);
  const intro = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const fx = useRef<{ ctx: AudioContext; f: BiquadFilterNode } | null>(null);
  const muffled = useRef(false);

  // Cuộn → progress (cho scene), nền HTML, kim bánh xe mùa, lowpass mùa đông.
  useGSAP(
    () => {
      const c = new Color();
      ScrollTrigger.create({
        trigger: chapters.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress: p }) => {
          progress.current = p;
          const s = seasonAt(p);
          if (root.current)
            root.current.style.backgroundColor = `#${seasonColor(BG, s, c).getHexString()}`;
          if (needle.current)
            needle.current.style.transform = `rotate(${reduced ? Math.round(s) * 90 : p * 360}deg)`;
          const winter = p >= 0.7 && p < 0.85;
          if (fx.current && winter !== muffled.current) {
            muffled.current = winter;
            const { ctx, f } = fx.current;
            f.frequency.setTargetAtTime(
              winter ? 2500 : 20000,
              ctx.currentTime,
              0.5,
            );
          }
        },
      });
      if (reduced) return;
      for (const el of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      }
      for (const el of gsap.utils.toArray<HTMLElement>("[data-chars]")) {
        const split = SplitText.create(el, { type: "chars" });
        gsap.from(split.chars, {
          opacity: 0,
          y: 12,
          stagger: 0.03,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 50%" },
        });
      }
    },
    { scope: root, dependencies: [reduced] },
  );

  const setupFilter = () => {
    try {
      const a = music.audio.current;
      if (fx.current || !a) return;
      const ctx = new AudioContext();
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 20000;
      ctx.createMediaElementSource(a).connect(f).connect(ctx.destination);
      fx.current = { ctx, f };
    } catch {
      // Web Audio lỗi → nhạc vẫn phát bình thường, không có hiệu ứng.
    }
  };

  const open = () => {
    setupFilter();
    music.play();
    setOpened(true);
    if (!threeD) {
      intro.current = 1;
      setUnlocked(true);
      return;
    }
    tl.current = gsap
      .timeline({ onComplete: () => setUnlocked(true) })
      .to(gateBtn.current, { scale: 0.95, duration: 0.1 })
      .to(gateBtn.current, { opacity: 0, duration: 0.3 })
      .to(intro, { current: 1, duration: 1.6, ease: "back.out(1.4)" }, 0.2)
      .set({}, {}, 2.4);
  };

  const zoom = (i: number) => {
    setShown(i);
    dialog.current?.showModal();
  };

  const nextChapter = () => {
    const els = CHAPTERS.map((id) => document.getElementById(id));
    const next =
      els.find((el) => el && el.getBoundingClientRect().top > 8) ?? els[0];
    next?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  const nameSize = (n: string) =>
    n.length > 24 ? "text-[34px] lg:text-[60px]" : "text-[44px] lg:text-[80px]";
  const day = formatDate(date).split("/");
  const ceremony = new Date(date.getTime() - 3600_000);

  return (
    <div ref={root} className={t.root}>
      <SeasonsCanvas
        progress={progress}
        intro={intro}
        images={images}
        onPhoto={zoom}
      />
      <MusicToggle music={music} />

      {/* C1 · Màn mở */}
      <section
        id="gate"
        className="flex h-svh flex-col items-center justify-end px-4 pb-[14svh] text-center"
      >
        <p className={t.label}>Bốn mùa yêu</p>
        <p className={`${t.name} mt-3 max-w-full text-[28px] lg:text-[40px]`}>
          {groom.name} &amp; {bride.name}
        </p>
        {!opened && (
          <button
            ref={gateBtn}
            type="button"
            onClick={open}
            className={`${t.btn} mt-8`}
          >
            ✿ Mở thiệp
          </button>
        )}
        {opened && !unlocked && (
          <button
            type="button"
            onClick={() => tl.current?.progress(1)}
            className="mt-8 min-h-11 px-4 text-sm text-[#4B5563] underline"
          >
            Bỏ qua
          </button>
        )}
        {unlocked && (
          <p className="mt-8 animate-pulse text-sm text-[#4B5563]">
            Cuộn để đi qua bốn mùa ↓
          </p>
        )}
      </section>

      {/* Tổng chiều cao 800svh; chia sao cho progress khớp ranh mùa 0.30/0.50/0.70/0.85. */}
      <div ref={chapters}>
        {/* C2 + C3 · Xuân */}
        <section id="spring" className="min-h-[210svh] px-4">
          {/* Nền kính mờ: tên nằm trước thân cây 3D nên cần lớp đệm để đọc được. */}
          <div className="mx-auto flex min-h-svh w-fit max-w-full flex-col items-center justify-end pb-[10svh] text-center">
            <div className="flex flex-col items-center rounded-[2rem] bg-white/55 px-6 py-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-10">
              <span aria-hidden className="text-2xl text-[#16A34A]">
                ❀
              </span>
              <p className={`${t.label} mt-2`}>Mùa xuân · Gặp nhau</p>
              <p className="mt-3 text-sm text-[#4B5563]">Trân trọng kính mời</p>
              <h1 data-chars className="mt-3 max-w-full">
                <span className={`${t.name} ${nameSize(groom.name)} block`}>
                  {groom.name}
                </span>
                <span className={`${t.name} block text-[32px]`}>&amp;</span>
                <span className={`${t.name} ${nameSize(bride.name)} block`}>
                  {bride.name}
                </span>
              </h1>
            </div>
          </div>
          <div className="mx-auto grid max-w-[820px] grid-cols-2 gap-3 pt-[60svh] sm:gap-6">
            {[
              { side: "Nhà trai", p: groom, img: images[1] },
              { side: "Nhà gái", p: bride, img: images[2] },
            ].map(({ side, p, img }) => (
              <div
                key={side}
                data-reveal
                className={`${t.card} justify-self-center p-4 text-center sm:p-6`}
              >
                {!threeD && img && (
                  // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                  <img
                    src={img}
                    alt={p.name}
                    className="mx-auto mb-3 aspect-square w-[120px] max-w-full rounded-t-full object-cover"
                  />
                )}
                <h2 className={t.label}>{side}</h2>
                <p className="mt-2 font-(family-name:--font-serif) text-xl break-words text-[#C2410C]">
                  {p.name}
                </p>
                <p className="mt-1 text-sm break-words text-[#4B5563]">
                  {p.address}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* C4 · Hạ */}
        <section id="summer" className="flex min-h-[140svh] flex-col px-4">
          <p className={`${t.label} pt-[20svh] text-center`}>
            Mùa hạ · Chuyện tình
          </p>
          {STORY.map((s, i) => (
            <div
              key={s.title}
              className={`flex flex-1 items-center justify-center ${i % 2 ? "lg:justify-end" : "lg:justify-start"} lg:px-[8vw]`}
            >
              <article data-reveal className={`${t.card} flex gap-4`}>
                {images[3 + i] && (
                  // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                  <img
                    src={images[3 + i]}
                    alt=""
                    className="size-[72px] shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className={t.title}>{s.title}</h2>
                  <p className="mt-2 text-[#4B5563]">{s.text}</p>
                </div>
              </article>
            </div>
          ))}
        </section>

        {/* C8 · Thu */}
        <section
          id="autumn"
          className="flex min-h-[140svh] flex-col items-center px-4 pt-[20svh] text-center"
        >
          <h2 data-chars className={t.label}>
            Mùa thu · Kỷ niệm
          </h2>
          {threeD && (
            <p className="mt-3 max-w-xs text-sm text-[#4B5563]">
              Chạm vào ảnh treo trên cây để xem lớn
            </p>
          )}
          <div className="mt-auto mb-[12svh] w-full max-w-[640px]">
            {threeD && !showGrid ? (
              <button
                type="button"
                onClick={() => setShowGrid(true)}
                className={t.btn}
              >
                Xem tất cả ảnh
              </button>
            ) : (
              <div
                className={`${t.card} grid max-w-none grid-cols-2 gap-3 p-3`}
              >
                {images.slice(3).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => zoom(3 + i)}
                    className="overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-[#C2410C]"
                  >
                    {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                    <img
                      src={src}
                      alt={`Kỷ niệm ${i + 1}`}
                      className="aspect-3/4 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* C5 + C6 + C7 · Đông */}
        <section
          id="winter"
          className="flex min-h-[105svh] justify-center px-4 py-[10svh] lg:justify-end lg:px-[8vw]"
        >
          <div data-reveal className={`${t.card} text-center`}>
            <h2 className={t.label}>Mùa đông · Về chung nhà</h2>
            <p className="mt-4 font-(family-name:--font-serif) text-[80px] leading-none text-[#C2410C] lg:text-[120px]">
              {day[0]}
            </p>
            <p className={`${t.label} mt-3`}>
              Tháng {day[1]} · {day[2]}
            </p>
            {data.date && left && (
              <p className="mt-3 text-[#4B5563]" aria-live="off">
                {left.done
                  ? "Chúng tôi đã về chung một nhà ♥"
                  : `${left.days} ngày ${String(left.hours).padStart(2, "0")} giờ ${String(left.minutes).padStart(2, "0")} phút`}
              </p>
            )}
            <hr className="my-5 border-[#1F2937]/10" />
            <ul className="space-y-2 text-left">
              <li className="flex justify-between gap-4">
                <span>❄ Lễ thành hôn</span>
                <span className="font-semibold">{formatTime(ceremony)}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>❄ Tiệc cưới</span>
                <span className="font-semibold">{formatTime(date)}</span>
              </li>
            </ul>
            <hr className="my-5 border-[#1F2937]/10" />
            <p className="break-words">{venue.name ?? "Địa điểm tổ chức"}</p>
            <MapEmbed
              venue={venue}
              className="mt-3 h-[180px] w-full rounded-xl"
            />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
              target="_blank"
              rel="noreferrer"
              className={`${t.btn} mt-4`}
            >
              Chỉ đường
            </a>
          </div>
        </section>

        {/* C10 · Kết */}
        <section
          id="bloom"
          className="flex min-h-[205svh] flex-col items-center justify-end px-4 pb-[12svh] text-center"
        >
          <p
            data-reveal
            className={`${t.title} max-w-sm font-(family-name:--font-serif)`}
          >
            Cảm ơn bạn đã đi cùng chúng tôi qua bốn mùa.
          </p>
          {images[8] && (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
            <img
              data-reveal
              src={images[8]}
              alt={`${groom.name} và ${bride.name}`}
              className="mt-6 aspect-3/4 w-[min(60vw,240px)] rounded-[1.25rem] object-cover shadow-[0_8px_30px_rgb(0_0_0/0.06)]"
            />
          )}
          <p className={`${t.name} mt-6 max-w-full text-[28px] lg:text-[40px]`}>
            {groom.name} &amp; {bride.name}
          </p>
        </section>
      </div>

      {/* Bánh xe mùa: góc dưới trái (3 góc kia là nút chung). Bấm → sang chương tiếp. */}
      {unlocked && (
        <button
          type="button"
          onClick={nextChapter}
          aria-label="Sang mùa tiếp theo"
          className="fixed bottom-4 left-4 z-40 size-11 rounded-full bg-[conic-gradient(#F9A8D4_0_25%,#4ADE80_0_50%,#F97316_0_75%,#CBD5E1_0)] shadow ring-2 ring-white focus-visible:outline-2 focus-visible:outline-[#C2410C]"
        >
          <span
            ref={needle}
            className="absolute inset-0 flex justify-center transition-transform"
          >
            <span className="mt-1 h-4 w-0.5 rounded bg-[#1F2937]" />
          </span>
          <span className="sr-only">{SEASON_NAMES.join(", ")}</span>
        </button>
      )}

      <dialog
        ref={dialog}
        onClose={() => setShown(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={() => {}}
        className="m-auto max-h-[90svh] max-w-[92vw] bg-transparent p-0 backdrop:bg-black/80"
      >
        {shown !== null && images[shown] && (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            src={images[shown]}
            alt={`Ảnh ${shown + 1}`}
            className="max-h-[80svh] w-auto rounded-xl object-contain"
          />
        )}
        <form method="dialog" className="mt-3 text-center">
          <button type="submit" className={`${t.btn} bg-white text-[#1F2937]`}>
            Đóng
          </button>
        </form>
      </dialog>
    </div>
  );
}
