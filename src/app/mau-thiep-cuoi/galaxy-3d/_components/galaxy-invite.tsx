"use client";

import { useEffect, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useScrollProgress } from "@/kit/3d/use-scroll-progress";
import { useCountdown } from "@/kit/countdown";
import { formatTime, weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { GalaxyCanvas, StaticSky } from "./galaxy-canvas";

const CARD =
  "w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#14123A]/60 p-6 backdrop-blur-md";
const LABEL =
  "font-(family-name:--font-sans) text-xs tracking-[0.35em] uppercase text-[#A9A4C9] sm:text-[13px]";
const STORY = [
  [
    "Lần đầu gặp gỡ",
    "Một buổi chiều bình thường, hai quỹ đạo vô tình giao nhau.",
  ],
  ["Thương nhau", "Từ đó, mọi con đường đều dẫn về một người."],
  ["Lời hứa", "Và rồi một câu hỏi, một cái gật đầu, cả vũ trụ như lặng đi."],
] as const;

type Box =
  | { kind: "img"; i: number }
  | { kind: "grid" }
  | { kind: "video" }
  | null;

// 40 chấm sao CSS cho màn mở trước khi canvas sẵn sàng (vị trí cố định, không random để tránh lệch hydration).
const DOTS = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 61) % 100,
  size: 1 + (i % 3),
}));

// WebGL + không reduced-motion → ảnh nằm trong scene 3D; ngược lại hiện ảnh trong HTML.
function useThree() {
  const reduced = useReducedMotion();
  const [gl, setGl] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setGl(!!document.createElement("canvas").getContext("webgl2"));
    } catch {
      setGl(false);
    }
  }, []);
  return gl === null ? null : gl && !reduced;
}

type OrientationCtor = { requestPermission?: () => Promise<string> };

export function GalaxyInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images, videos } = data;
  const date = weddingDate(data);
  const left = useCountdown(date);
  const music = useMusic("/templates/galaxy-3d/music.mp3", 0.5);
  const three = useThree();

  const [opened, setOpened] = useState(false);
  const [locked, setLocked] = useState(true);
  const [box, setBox] = useState<Box>(null);
  useScrollLock(locked);

  const root = useRef<HTMLElement>(null);
  const progress = useScrollProgress(root);
  const openedAt = useRef<number | null>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const gyro = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (gyro.current) return;
      tilt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const open = async () => {
    music.play(3000);
    openedAt.current = performance.now();
    setOpened(true);
    setTimeout(() => setLocked(false), 2000);
    // iOS cần xin quyền trong chính handler click.
    const DOE = globalThis.DeviceOrientationEvent as unknown as
      | OrientationCtor
      | undefined;
    try {
      if (
        DOE?.requestPermission &&
        (await DOE.requestPermission()) !== "granted"
      )
        return;
      if (!DOE) return;
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma === null || e.beta === null) return;
        gyro.current = true;
        tilt.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
        tilt.current.y = Math.max(-1, Math.min(1, (45 - e.beta) / 30));
      });
    } catch {}
  };

  useGSAP(
    () => {
      if (!opened) return;
      const split = SplitText.create(".gx-names", { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
        stagger: 0.04,
        delay: 1,
      });
      for (const el of gsap.utils.toArray<HTMLElement>(".gx-reveal"))
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 60%" },
        });
      // Va chạm: loé trắng 0 → 0.9 → 0 + nhạc "nín thở".
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#collision",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(".gx-flash", { opacity: 0.9, ease: "none" })
        .to(".gx-flash", { opacity: 0, ease: "none" });
      ScrollTrigger.create({
        trigger: "#collision",
        start: "center center",
        onEnter: () => {
          music.fadeTo(0.2, 500);
          setTimeout(() => music.fadeTo(0.5, 1500), 700);
        },
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [opened, three] },
  );

  const video = videos[0];
  const fallback = three === false;

  return (
    <main
      ref={root}
      // isolate: tạo stacking context để canvas `fixed -z-10` nằm TRÊN nền của main
      // (thiếu nó, nền đặc che mất toàn bộ cảnh 3D).
      className="relative isolate bg-[#07061A] font-(family-name:--font-sans) font-light text-[#EEEAFF]"
    >
      {three ? (
        <GalaxyCanvas
          progress={progress}
          openedAt={openedAt}
          tilt={tilt}
          images={images}
          // Chưa mở thiệp: click "Mở thiệp" không được xuyên xuống raycast ảnh.
          onPick={(i) => opened && setBox({ kind: "img", i })}
          opened={opened}
        />
      ) : (
        <StaticSky />
      )}
      <div className="gx-flash pointer-events-none fixed inset-0 z-30 bg-white opacity-0" />
      <MusicToggle music={music} className="bg-[#14123A]/80 text-[#F4D58D]" />

      {/* C1 · Màn mở */}
      <section
        id="gate"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center px-4 text-center transition-opacity duration-1000 ${opened ? "pointer-events-none opacity-0" : ""} ${three ? "" : "bg-[#07061A]"}`}
      >
        {!three &&
          DOTS.map((d) => (
            <span
              key={`${d.left}-${d.top}`}
              className="absolute animate-pulse rounded-full bg-white"
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
              }}
            />
          ))}
        <p className={LABEL}>Hai vì sao</p>
        <h1 className="mt-4 max-w-full break-words font-(family-name:--font-serif) text-[28px] italic">
          <span className="text-[#F4D58D]">{groom.name}</span>
          <span className="mx-3 text-[#A9A4C9]">·</span>
          <span className="text-[#9B8CFF]">{bride.name}</span>
        </h1>
        <button
          type="button"
          onClick={open}
          className="mt-10 min-h-11 rounded-full border border-[#F4D58D] bg-[#14123A]/60 px-8 py-3 text-sm tracking-[0.35em] text-[#F4D58D] uppercase backdrop-blur-md transition hover:bg-[#F4D58D]/10"
        >
          Mở thiệp ✦
        </button>
        <p className="mt-4 text-xs text-[#A9A4C9]">🎧 Nên dùng tai nghe</p>
      </section>

      {/* C2 · Tên */}
      <section id="names" className="h-[108svh]">
        <div
          className={`sticky top-0 flex h-svh flex-col items-center justify-center px-4 text-center transition-opacity duration-700 ${opened ? "" : "opacity-0"}`}
        >
          <p className="text-sm text-[#A9A4C9]">Hai tâm hồn, một định mệnh</p>
          <h2 className="gx-names mt-4 max-w-full break-words font-(family-name:--font-serif) text-5xl leading-tight italic sm:text-[88px]">
            <span className="block text-[#F4D58D]">{groom.name}</span>
            <span className="block text-3xl text-[#A9A4C9] sm:text-5xl">&</span>
            <span className="block text-[#9B8CFF]">{bride.name}</span>
          </h2>
        </div>
      </section>

      {/* C3 · Cặp đôi */}
      <section
        id="couple"
        className="flex h-[144svh] flex-col justify-around gap-8 px-4 py-24"
      >
        {[
          {
            role: "Chú rể",
            p: groom,
            img: images[1],
            color: "text-[#F4D58D]",
            side: "self-start",
          },
          {
            role: "Cô dâu",
            p: bride,
            img: images[2],
            color: "text-[#9B8CFF]",
            side: "self-end",
          },
        ].map(({ role, p, img, color, side }) => (
          <div key={role} className={`gx-reveal ${CARD} ${side} sm:mx-[8%]`}>
            {fallback && img && (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={img}
                alt={p.name}
                className="mb-4 aspect-3/4 w-full rounded-2xl object-cover"
              />
            )}
            <p className={LABEL}>{role}</p>
            <h3
              className={`mt-2 break-words font-(family-name:--font-serif) text-4xl italic ${color}`}
            >
              {p.name}
            </h3>
            <p className="mt-2 leading-[1.7] text-[#A9A4C9]">{p.address}</p>
          </div>
        ))}
      </section>

      {/* C4 · Chuyện tình */}
      <section
        id="story"
        className="flex h-[153svh] flex-col justify-around gap-8 px-4 py-24"
      >
        {STORY.map(([title, body], i) => (
          <div
            key={title}
            className={`gx-reveal ${CARD} max-w-[340px] ${i % 2 ? "self-start sm:ml-[10%]" : "self-end sm:mr-[10%]"}`}
          >
            {fallback && images[3 + i] && (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={images[3 + i]}
                alt=""
                className="mb-4 aspect-3/4 w-full rounded-2xl object-cover"
              />
            )}
            <p className={LABEL}>0{i + 1}</p>
            <h3 className="mt-2 font-(family-name:--font-serif) text-3xl text-[#F4D58D] italic">
              {title}
            </h3>
            <p className="mt-2 leading-[1.7]">{body}</p>
          </div>
        ))}
      </section>

      {/* C8 · Album */}
      <section id="album" className="h-[153svh] px-4">
        <div className="sticky top-0 flex min-h-svh flex-col items-center justify-start pt-24 text-center">
          <h2 className="gx-reveal font-(family-name:--font-serif) text-4xl text-[#F4D58D] tracking-[0.2em] sm:text-5xl">
            KHOẢNH KHẮC
          </h2>
          {fallback ? (
            <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3">
              {images.slice(3).map((src, j) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setBox({ kind: "img", i: 3 + j })}
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                  <img
                    src={src}
                    alt=""
                    className="aspect-3/4 w-full rounded-2xl object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#A9A4C9]">
              {Math.max(0, images.length - 3)} khoảnh khắc giữa các vì sao ·
              chạm để xem
            </p>
          )}
          <button
            type="button"
            onClick={() => setBox({ kind: "grid" })}
            className="mt-6 min-h-11 rounded-full border border-white/20 bg-[#14123A]/60 px-6 text-sm backdrop-blur-md"
          >
            Xem tất cả ảnh
          </button>
        </div>
      </section>

      {/* Va chạm: không có chữ */}
      <section id="collision" aria-hidden className="h-[90svh]" />

      {/* C5 + C6 · Ngày */}
      <section
        id="date"
        className="flex h-[108svh] items-center justify-center px-4"
      >
        <div className={`gx-reveal ${CARD} text-center`}>
          <p className={LABEL}>Ngày chúng ta về chung một nhà</p>
          <p className="mt-4 font-(family-name:--font-serif) text-[88px] leading-none text-[#F4D58D] sm:text-[128px]">
            {new Intl.DateTimeFormat("vi-VN", {
              day: "numeric",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(date)}
          </p>
          <p className={`${LABEL} mt-2`}>
            {new Intl.DateTimeFormat("vi-VN", {
              month: "long",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(date)}{" "}
            · {date.getFullYear()}
          </p>
          <p
            className="mt-6 font-(family-name:--font-serif) text-3xl tabular-nums text-[#EEEAFF]"
            aria-live="off"
          >
            {left
              ? [left.days, left.hours, left.minutes, left.seconds]
                  .map((n) => String(n).padStart(2, "0"))
                  .join(" : ")
              : "-- : -- : -- : --"}
          </p>
          <p className="text-xs text-[#A9A4C9]">ngày · giờ · phút · giây</p>
          <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-left">
            <p className="flex justify-between">
              <span>Lễ thành hôn</span>
              <span className="text-[#F4D58D]">
                {formatTime(new Date(date.getTime() - 3600_000))}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Tiệc cưới</span>
              <span className="text-[#F4D58D]">{formatTime(date)}</span>
            </p>
          </div>
        </div>
      </section>

      {/* C7 · Địa điểm (nửa dưới, hành tinh ở nửa trên) */}
      <section
        id="venue"
        className="flex h-[81svh] items-end justify-center px-4 pb-24"
      >
        <div className={`gx-reveal ${CARD}`}>
          <p className={LABEL}>Địa điểm</p>
          <h3 className="mt-2 break-words font-(family-name:--font-serif) text-3xl text-[#F4D58D] italic">
            {venue.name ?? "Địa điểm tổ chức"}
          </h3>
          <MapEmbed
            venue={venue}
            className="mt-4 h-[200px] w-full rounded-2xl"
          />
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex min-h-11 items-center justify-center rounded-full border border-[#F4D58D] text-sm text-[#F4D58D]"
          >
            Chỉ đường
          </a>
        </div>
      </section>

      {/* C9 + C10 · Kết */}
      <section
        id="thanks"
        className="flex min-h-[63svh] flex-col items-center justify-center gap-6 px-4 pt-12 pb-28 text-center"
      >
        {images[7] && (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            src={images[7]}
            alt=""
            className="gx-reveal aspect-3/4 w-40 rounded-3xl border border-white/10 object-cover"
          />
        )}
        <p className="gx-reveal max-w-sm font-(family-name:--font-serif) text-2xl leading-snug italic">
          Cảm ơn bạn đã là một vì sao trong bầu trời của chúng tôi.
        </p>
        <p className="break-words font-(family-name:--font-serif) text-xl">
          <span className="text-[#F4D58D]">{groom.name}</span> &{" "}
          <span className="text-[#9B8CFF]">{bride.name}</span>
        </p>
        {video && (
          <button
            type="button"
            onClick={() => setBox({ kind: "video" })}
            className="min-h-11 rounded-full border border-white/20 bg-[#14123A]/60 px-6 text-sm backdrop-blur-md"
          >
            ▶ Xem video của chúng tôi
          </button>
        )}
      </section>

      {box && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#07061A]/95 p-4 pt-20"
        >
          <button
            type="button"
            onClick={() => setBox(null)}
            className="absolute top-4 left-1/2 min-h-11 -translate-x-1/2 rounded-full border border-white/20 px-6 text-sm"
          >
            Đóng ✕
          </button>
          {box.kind === "img" && (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
            <img
              src={images[box.i]}
              alt=""
              className="max-h-[80svh] max-w-full rounded-2xl object-contain"
            />
          )}
          {box.kind === "grid" && (
            <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setBox({ kind: "img", i })}
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                  <img
                    src={src}
                    alt=""
                    className="aspect-3/4 w-full rounded-2xl object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          {box.kind === "video" && video && (
            // biome-ignore lint/a11y/useMediaCaption: video cá nhân của cặp đôi, không có phụ đề
            <video
              src={video}
              controls
              autoPlay
              playsInline
              onPlay={music.pause}
              className="max-h-[80svh] max-w-full rounded-2xl"
            />
          )}
        </div>
      )}
    </main>
  );
}
