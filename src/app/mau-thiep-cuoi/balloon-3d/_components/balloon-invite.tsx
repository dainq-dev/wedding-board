"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useScrollProgress } from "@/kit/3d/use-scroll-progress";
import { useCountdown } from "@/kit/countdown";
import { formatTime, weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import type { Person } from "@/wedding/types";
import { useWedding } from "@/wedding/wedding-data-provider";
import { BalloonCanvas } from "./balloon-canvas";
import { altitudeLabel, skyColors } from "./flight";
import type { Fx } from "./scene";

const ASSETS = "/templates/balloon-3d";

export const t = {
  root: "relative isolate min-h-screen text-[#23303F] font-(family-name:--font-sans) font-medium text-base leading-[1.7] lg:text-[17px] bg-[linear-gradient(#8FD0F2,#BFE3F7)]",
  name: "font-(family-name:--font-script) text-[#EF6F6C] leading-[1.2] text-balance break-words",
  title:
    "font-(family-name:--font-script) text-2xl lg:text-[30px] text-[#EF6F6C]",
  label: "text-xs font-bold uppercase tracking-[0.15em] text-[#C8433F]",
  card: "relative rounded-[1.5rem] bg-white/85 backdrop-blur-sm shadow-[0_10px_40px_rgb(35_48_63/0.12)] p-6 max-w-[380px] origin-top pointer-events-auto",
  btn: "pointer-events-auto min-h-11 rounded-full bg-[#EF6F6C] px-7 text-white font-bold",
  soft: "text-sm text-[#52606D]",
} as const;

const nameSize = (n: string) =>
  n.length > 22 ? "text-[30px] lg:text-[56px]" : "text-[40px] lg:text-[72px]";

// Card treo trên 2 dải ruy băng: thả xuống khi vào, kéo lên khi ra, đung đưa A12.
function RibbonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.from(el, {
          opacity: 0,
          duration: 0.3,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        return;
      }
      gsap.fromTo(
        el,
        { y: -120, rotation: -4, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 15%",
            // Ra phía trên = kéo về giỏ (y -80, mờ dần) — reverse gần tương đương.
            toggleActions: "play reverse play reverse",
          },
        },
      );
      gsap.to(el, {
        rotation: 2,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.9,
      });
    },
    { dependencies: [reduced] },
  );
  return (
    <div ref={ref} className={`${t.card} ${className}`}>
      {/* Ruy băng chạy từ đỉnh card lên mép trên màn hình */}
      <span
        className="absolute bottom-full left-[18%] h-[100svh] w-0.5 bg-[#3D84A8]"
        aria-hidden
      />
      <span
        className="absolute bottom-full right-[18%] h-[100svh] w-0.5 bg-[#3D84A8]"
        aria-hidden
      />
      <svg
        viewBox="0 0 40 16"
        className="absolute -top-2 left-1/2 w-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <path d="M20 8 4 1v14Zm0 0 16-7v14Z" fill="#3D84A8" />
        <circle cx="20" cy="8" r="3" fill="#2D6B8A" />
      </svg>
      {children}
    </div>
  );
}

function Address({
  label,
  person,
  img,
}: {
  label: string;
  person: Person;
  img?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <RibbonCard className="p-4 text-center">
      {img && (
        // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
        <img
          src={img}
          alt={person.name}
          className="mx-auto size-24 rounded-full object-cover"
        />
      )}
      <p className={`mt-3 ${t.label}`}>{label}</p>
      <p className="font-bold break-words">{person.name}</p>
      <p className={`${t.soft} break-words ${open ? "" : "line-clamp-3"}`}>
        {label}: {person.address}
      </p>
      {person.address.length > 60 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="min-h-11 text-sm font-bold text-[#C8433F]"
        >
          {open ? "thu gọn" : "xem thêm"}
        </button>
      )}
    </RibbonCard>
  );
}

const STORY = [
  {
    alt: "1.000 M",
    title: "Cất cánh",
    text: "Lần đầu gặp nhau, tim đập như tiếng lửa phụt, chẳng biết sẽ bay tới đâu.",
  },
  {
    alt: "1.400 M",
    title: "Vượt mây",
    text: "Có những ngày mây mù, nhưng tụi mình vẫn nắm tay bay tiếp.",
  },
  {
    alt: "1.800 M",
    title: "Trời quang",
    text: "Và rồi anh ngỏ lời, em gật đầu. Phía trước là cả bầu trời.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
}));

export function BalloonInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images } = data;
  const music = useMusic(`${ASSETS}/music.mp3`);
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [intro, setIntro] = useState<gsap.core.Timeline | null>(null);
  const [skip, setSkip] = useState(false);
  const [shown, setShown] = useState<number | "all" | null>(null);
  const [fallback, setFallback] = useState(false);
  const onFallback = useCallback(() => setFallback(true), []);
  useScrollLock(!opened);

  const main = useRef<HTMLElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const altText = useRef<HTMLSpanElement>(null);
  const altDot = useRef<HTMLSpanElement>(null);
  const progress = useScrollProgress(main);
  const fx = useRef<Fx>({ burst: -1e9, intro: 0, opened: false });

  const date = weddingDate(data);
  const left = useCountdown(date);
  const d = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).formatToParts(date),
    [date],
  );
  const part = (k: string) => d.find((x) => x.type === k)?.value;

  // Đồng hồ độ cao + nền phần tử gốc theo độ cao + giảm nhạc khi vào trời sao.
  useGSAP(() => {
    const cols = skyColors(0);
    let night = false;
    ScrollTrigger.create({
      trigger: main.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        const p = s.progress;
        if (altText.current) altText.current.textContent = altitudeLabel(p);
        if (altDot.current)
          altDot.current.style.transform = `translateY(${(1 - p) * 112}px)`;
        skyColors(p, cols);
        if (main.current)
          main.current.style.background = `linear-gradient(#${cols.top.getHexString()}, #${cols.horizon.getHexString()})`;
        if (p >= 0.85 !== night) {
          night = p >= 0.85;
          if (music.audio.current && !music.audio.current.paused)
            music.fadeTo(night ? 0.35 : 0.6, 2000);
        }
      },
    });
  });

  const burner = () => {
    const a = new Audio(`${ASSETS}/burner.mp3`);
    a.volume = 0.4;
    a.play().catch(() => {});
    fx.current.burst = performance.now();
  };

  const finish = () => {
    fx.current.intro = 8;
    fx.current.opened = true;
    setOpened(true);
    setIntro(null);
  };

  const takeOff = () => {
    music.play();
    burner();
    fx.current.opened = true;
    if (reduced) return finish();
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(flash.current, { opacity: 0.6, duration: 0.15 })
      .to(flash.current, { opacity: 0, duration: 0.15 })
      .to(fx.current, { intro: 8, duration: 1.6, ease: "sine.inOut" }, 0.6)
      .to(gate.current, { y: 20, opacity: 0, duration: 0.6 }, 1.0);
    setIntro(tl);
    setTimeout(() => setSkip(true), 500);
  };

  useEffect(() => {
    if (shown === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShown(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown]);

  const couple = `${groom.name} & ${bride.name}`;
  const hasDate = !!data.date;
  const past = left?.done;

  return (
    <main ref={main} className={`${t.root} pointer-events-none`}>
      <BalloonCanvas
        progress={progress}
        fx={fx}
        images={images}
        onPick={setShown}
        onFallback={onFallback}
      />
      <MusicToggle music={music} className="pointer-events-auto" />

      {/* C1 · Sân thượng */}
      {!opened && (
        <div
          ref={gate}
          className="pointer-events-auto fixed inset-0 z-30 flex flex-col items-center justify-end px-6 pb-28 text-center"
        >
          <p className={t.soft}>Cùng chúng mình bay lên nhé!</p>
          <p className={`${t.name} mt-2 max-w-[20ch] text-[32px] lg:text-5xl`}>
            {couple}
          </p>
          <button
            type="button"
            onClick={takeOff}
            disabled={!!intro}
            className={`${t.btn} mt-6`}
          >
            🔥 Cất cánh
          </button>
          {skip && intro && (
            <button
              type="button"
              onClick={() => intro.progress(1)}
              className="mt-3 min-h-11 px-4 text-sm font-bold text-[#23303F] underline"
            >
              Bỏ qua
            </button>
          )}
        </div>
      )}
      <div
        ref={flash}
        className="fixed inset-0 z-30 bg-[#FFD9A0] opacity-0"
        aria-hidden
      />

      {/* Đồng hồ độ cao */}
      <div
        className="fixed right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-4"
        aria-hidden
      >
        <span className="relative h-[120px] w-1 rounded-full bg-[repeating-linear-gradient(#3D84A8_0_2px,transparent_2px_12px)] bg-white/60">
          <span
            ref={altDot}
            className="absolute -left-1 top-0 size-3 translate-y-[112px] rounded-full bg-[#EF6F6C] shadow"
          />
        </span>
        <span
          ref={altText}
          className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold tracking-[0.15em] text-[#23303F] lg:text-[13px]"
        >
          0 M
        </span>
      </div>

      {/* C2 + C3 · Đi lên */}
      <section
        id="rise"
        className="min-h-[255svh] pr-12 pl-4 pt-[55svh] sm:pr-16"
      >
        <RibbonCard className="mx-auto text-center">
          <p className={t.soft}>Trân trọng kính mời</p>
          <h1 className={`${t.name} ${nameSize(groom.name)} mt-2`}>
            {groom.name}
          </h1>
          <p className={`${t.name} text-3xl`}>&</p>
          <p className={`${t.name} ${nameSize(bride.name)}`}>{bride.name}</p>
          <p className={`${t.soft} mt-3`}>đến chung vui chuyến bay hạnh phúc</p>
        </RibbonCard>
        <div className="mx-auto mt-[60svh] grid max-w-[520px] grid-cols-2 items-start gap-3">
          <Address label="Nhà trai" person={groom} img={images[1]} />
          <div className="mt-10">
            <Address label="Nhà gái" person={bride} img={images[2]} />
          </div>
        </div>
      </section>

      {/* C4 · Chuyện tình, xuyên mây */}
      <section
        id="clouds"
        className="flex min-h-[170svh] flex-col gap-[45svh] pr-12 pl-4 pt-[20svh] sm:pr-16"
      >
        {STORY.map((s, i) => (
          <RibbonCard
            key={s.title}
            className="mx-auto flex w-full items-center gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className={t.label}>{s.alt}</p>
              <h2 className={t.title}>{s.title}</h2>
              <p className="mt-1">{s.text}</p>
            </div>
            {images[3 + i] && (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={images[3 + i]}
                alt=""
                className="aspect-3/4 w-[88px] shrink-0 rotate-3 rounded bg-white object-cover p-1 shadow sm:w-[120px]"
              />
            )}
          </RibbonCard>
        ))}
      </section>

      {/* C8 · Đoàn khinh khí cầu */}
      <section
        id="flotilla"
        className="min-h-[128svh] pr-12 pl-4 pt-[15svh] text-center sm:pr-16"
      >
        <h2 className="font-(family-name:--font-script) text-2xl text-[#23303F]">
          Những khoảnh khắc bay cùng tụi mình
        </h2>
        {fallback ? (
          <div className="pointer-events-auto mx-auto mt-6 grid max-w-[520px] grid-cols-2 gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShown(i)}
                className="rounded-lg bg-white p-1 shadow"
              >
                {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                <img
                  src={src}
                  alt={`Ảnh ${i + 1}`}
                  className="aspect-3/4 w-full rounded object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <>
            <p className={`${t.soft} mt-2`}>
              Chạm vào khinh khí cầu để xem ảnh
            </p>
            <RibbonCard className="mx-auto mt-[65svh] w-fit p-3">
              <button
                type="button"
                onClick={() => setShown("all")}
                className={t.btn}
              >
                Xem tất cả ảnh
              </button>
            </RibbonCard>
          </>
        )}
      </section>

      {/* C5 + C6 + C7 · Hoàng hôn */}
      <section
        id="sunset"
        className="min-h-[170svh] pr-12 pl-4 pt-[20svh] pb-[20svh] sm:pr-16"
      >
        <RibbonCard className="mx-auto text-center">
          <p className={t.label}>✈ Điểm hạ cánh</p>
          <p className="text-[72px] font-bold leading-none lg:text-[110px]">
            {part("day")}
          </p>
          <p className="font-bold tracking-[0.15em] uppercase">
            Tháng {part("month")} · {part("year")}
          </p>
          {hasDate && past && (
            <p className="mt-4">
              Tụi mình đã hạ cánh an toàn ở bến hạnh phúc ♥
            </p>
          )}
          {hasDate && left && !past && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {(
                [
                  [left.days, "ngày"],
                  [left.hours, "giờ"],
                  [left.minutes, "phút"],
                  [left.seconds, "giây"],
                ] as const
              ).map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-[#DCEFFA] py-2">
                  <p className="text-xl font-bold">{pad(v)}</p>
                  <p className={t.soft}>{l}</p>
                </div>
              ))}
            </div>
          )}
          <hr className="my-4 border-[#3D84A8]/30" />
          <p className="flex justify-between">
            <span>🎈 Lễ thành hôn</span>
            <span className="font-bold">17:00</span>
          </p>
          <p className="flex justify-between">
            <span>🥂 Tiệc cưới</span>
            <span className="font-bold">{formatTime(date)}</span>
          </p>
          <hr className="my-4 border-[#3D84A8]/30" />
          <p className="font-bold break-words">
            {venue.name ?? "Địa điểm tổ chức"}
          </p>
          <MapEmbed
            venue={venue}
            className="mt-3 h-[200px] w-full rounded-xl"
          />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noreferrer"
            className={`${t.btn} mt-4 inline-flex items-center`}
          >
            Chỉ đường
          </a>
        </RibbonCard>
      </section>

      {/* C10 · Trời sao */}
      <section
        id="stars"
        className="relative flex min-h-[127svh] flex-col items-center justify-end px-6 pb-[20svh] text-center text-white"
      >
        {fallback &&
          STARS.map((s) => (
            <span
              key={`${s.left}${s.top}`}
              className="absolute size-1 rounded-full bg-white/80"
              style={s}
              aria-hidden
            />
          ))}
        <h2 className="font-(family-name:--font-script) text-[26px] lg:text-4xl">
          Cảm ơn bạn đã bay cùng tụi mình!
        </h2>
        {images.length > 0 && (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            src={images[images.length - 1]}
            alt=""
            className="mt-6 aspect-3/4 w-44 rounded-2xl object-cover shadow-lg"
          />
        )}
        <p className="mt-6 break-words text-white/85">{couple}</p>
      </section>

      {/* Lightbox (A10) + lưới tất cả ảnh */}
      {shown !== null && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#1B1F4B]/90 p-4"
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            onClick={() => setShown(null)}
            className="fixed top-4 left-1/2 z-40 min-h-11 -translate-x-1/2 rounded-full bg-white px-5 font-bold text-[#23303F]"
          >
            Đóng
          </button>
          {shown === "all" ? (
            <div className="mt-16 grid max-h-full w-full max-w-[520px] grid-cols-2 gap-3">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setShown(i)}>
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                  <img
                    src={src}
                    alt={`Ảnh ${i + 1}`}
                    className="aspect-3/4 w-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
            <img
              src={images[shown]}
              alt={`Ảnh ${shown + 1}`}
              className="max-h-[80svh] max-w-full rounded-xl object-contain"
            />
          )}
        </div>
      )}
    </main>
  );
}
