"use client";

import { useEffect, useRef, useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { useScrollProgress } from "@/kit/3d/use-scroll-progress";
import { useCountdown } from "@/kit/countdown";
import { formatDate, formatWeekday, weddingDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { ForestCanvas } from "./forest-canvas";
import { initials } from "./initials";

const t = {
  root: "bg-[#050D0A] text-[#EEF7EA] font-(family-name:--font-body) font-light",
  card: "relative mx-auto w-full max-w-[400px] rounded-2xl border border-[#1C2B22]/60 bg-[#0F1F18]/75 p-6 backdrop-blur-md",
  script:
    "font-(family-name:--font-script) leading-[1.3] pb-2 text-[#E9F59A] drop-shadow-[0_0_12px_rgba(233,245,154,0.55)]",
  heading:
    "text-[11px] tracking-[0.35em] uppercase font-medium text-[#7FD1A8] lg:text-xs",
  soft: "text-[#A8BBAE]",
  btn: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#E9F59A] px-6 font-medium text-[#050D0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9F59A]",
  dots: "border-t border-dotted border-[#7FD1A8]/40",
  big: "font-extralight text-[80px] leading-none text-[#E9F59A] drop-shadow-[0_0_12px_rgba(233,245,154,0.55)] lg:text-[120px]",
} as const;

const STORY = [
  {
    title: "Lần đầu gặp gỡ",
    text: "Đêm ấy có rất nhiều đom đóm, nhưng anh chỉ thấy một ánh mắt.",
  },
  {
    title: "Thương nhau",
    text: "Mình đi cùng nhau qua những ngày tối nhất, và luôn có một đốm sáng nhỏ dẫn đường.",
  },
  {
    title: "Lời hứa",
    text: "Dưới một tán cây, trong tiếng côn trùng rả rích, anh hỏi, và em nói: vâng.",
  },
];

// Vị trí cố định theo index (không random lúc render để khỏi lệch hydration).
const DOTS = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37.3) % 100}%`,
  top: `${(i * 61.7 + 13) % 100}%`,
  size: 3 + (i % 3),
  delay: `${(i % 7) * 0.4}s`,
}));

function Dot() {
  return (
    <span
      aria-hidden
      className="absolute top-3 left-3 size-1 animate-pulse rounded-full bg-[#E9F59A] shadow-[0_0_6px_#E9F59A]"
    />
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-glow className={`${t.card} ${className}`}>
      <Dot />
      {children}
    </div>
  );
}

function Photo({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <div className="relative mx-auto mb-4 w-3/4 pt-4">
      <svg
        role="img"
        aria-label="Dây đay và kẹp gỗ"
        viewBox="0 0 100 20"
        className="absolute inset-x-0 top-0 h-5 w-full"
      >
        <path
          d="M5 18 Q50 -6 95 18"
          stroke="#8A7350"
          strokeWidth="1.5"
          fill="none"
        />
        <rect x="46" y="4" width="8" height="12" rx="1.5" fill="#8A7350" />
      </svg>
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL */}
      <img
        src={src}
        alt={alt}
        className="aspect-3/4 w-full rounded-sm border-4 border-[#3a2a1a] object-cover"
      />
    </div>
  );
}

// Nền 2D: khi không có WebGL / reduced-motion, và trong lúc canvas chưa sẵn sàng.
function ForestFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el, i) => {
        gsap.to(el, {
          x: `random(-40, 40)`,
          y: `random(-40, 40)`,
          duration: 4 + (i % 5),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: ref, dependencies: [reduced] },
  );
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#0F2419_0%,#050D0A_70%)]"
    >
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[repeating-linear-gradient(90deg,transparent_0_9%,#020604_9%_11%,transparent_11%_23%,#030805_23%_26%)] opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#050D0A] to-transparent" />
      {DOTS.map((d) => (
        <span
          key={d.left + d.top}
          data-drift
          className={`absolute rounded-full bg-[#E9F59A] shadow-[0_0_8px_#E9F59A] ${reduced ? "opacity-60" : "animate-pulse"}`}
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

export function FireflyInvite() {
  const { data } = useWedding();
  const { groom, bride, venue, images, videos } = data;
  const music = useMusic(0.5);
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [three, setThree] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [font, setFont] = useState("");
  const [media, setMedia] = useState<{ src: string; video?: boolean } | null>(
    null,
  );
  useScrollLock(!unlocked);

  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const progress = useScrollProgress(track);

  const date = weddingDate(data);
  const left = useCountdown(date);
  const [day, month, year] = formatDate(date).split("/");
  const mono = `${initials(groom.name)} ♥ ${initials(bride.name)}`;

  // Giống điều kiện của SceneCanvas: có WebGL và không reduced-motion → ảnh ở trong 3D.
  useEffect(() => {
    let gl = false;
    try {
      gl = !!document.createElement("canvas").getContext("webgl2");
    } catch {}
    setThree(gl && !reduced);
  }, [reduced]);

  // Tên font thật cho canvas 2D (chữ viết tắt bằng đom đóm).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const family = getComputedStyle(el).getPropertyValue("--font-script");
    document.fonts.ready.then(() => setFont(family.trim() || "cursive"));
  }, []);

  useEffect(() => {
    if (media) dialog.current?.showModal();
  }, [media]);

  const open = () => {
    music.play(2500);
    setOpened(true);
    if (reduced) {
      setUnlocked(true);
      return;
    }
    gsap.to("[data-gate-fade]", {
      opacity: 0,
      duration: 0.4,
      ease: "sine.in",
    });
    setTimeout(() => setUnlocked(true), 1400);
  };

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-glow]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 12,
          duration: 0.9,
          ease: "sine.inOut",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      // C2: tên được "vẽ" bằng một đốm sáng chạy ngang.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#names", start: "top 40%" },
      });
      tl.from("[data-names-head]", { opacity: 0, y: 12, duration: 0.6 });
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((el) => {
        tl.fromTo(
          el,
          { "--p": "-8%" },
          { "--p": "108%", duration: 0.9, ease: "sine.inOut" },
        );
      });
      tl.to("[data-spark]", { opacity: 0, duration: 0.3 });
    },
    { scope: root, dependencies: [reduced] },
  );

  const nameDraw = (name: string) => (
    <span
      data-draw
      className={`relative inline-block ${reduced ? "[--p:108%]" : "[--p:-8%]"}`}
    >
      <span className="block [mask-image:linear-gradient(90deg,#000_var(--p),transparent_calc(var(--p)+8%))]">
        {name}
      </span>
      <span
        data-spark
        aria-hidden
        className={`absolute top-1/2 left-(--p) size-1.5 rounded-full bg-[#E9F59A] shadow-[0_0_12px_4px_rgba(233,245,154,0.7)] ${reduced ? "hidden" : ""}`}
      />
    </span>
  );

  return (
    // isolate: canvas `fixed -z-10` phải nằm trên nền của main, không bị che.
    <main ref={root} className={`${t.root} relative isolate min-h-screen`}>
      <ForestCanvas
        fallback={<ForestFallback />}
        progress={progress}
        opened={opened}
        images={images}
        initials={mono}
        font={font}
        onInitials={() => music.fadeTo(0.7, 2000)}
      />
      <MusicToggle music={music} className="bg-[#E9F59A]/90! text-[#050D0A]" />

      {/* C1 · Bóng tối */}
      <section
        id="gate"
        className="flex h-svh flex-col items-center justify-end px-6 pb-[18svh] text-center"
      >
        <div data-gate-fade className="flex flex-col items-center">
          <p className={t.heading}>Một lối nhỏ trong rừng</p>
          <p
            className={`${t.script} mt-3 text-balance text-[clamp(26px,9vw,36px)]`}
          >
            {groom.name} &amp; {bride.name}
          </p>
          <button
            type="button"
            onClick={open}
            disabled={opened}
            className={`${t.btn} mt-6 tracking-[0.2em] uppercase`}
          >
            Mở thiệp
          </button>
          <p className={`${t.soft} mt-4 text-xs`}>
            Bật âm thanh để nghe tiếng rừng đêm
          </p>
        </div>
        {unlocked && (
          <p className={`${t.heading} mt-6 animate-pulse`}>Theo đom đóm ↓</p>
        )}
      </section>

      <div ref={track}>
        {/* C2 · Bìa rừng */}
        <section
          id="names"
          className="flex min-h-[120svh] flex-col items-center justify-end px-6 pb-[16svh] text-center"
        >
          <p data-names-head className={t.heading}>
            Trân trọng kính mời
          </p>
          <h1
            className={`${t.script} mt-4 text-balance text-[52px] leading-[1.15] lg:text-[96px]`}
          >
            {nameDraw(groom.name)}
            <span className="block text-[0.6em]">&amp;</span>
            {nameDraw(bride.name)}
          </h1>
          <div data-glow className="w-full max-w-[400px]">
            <hr className={`${t.dots} my-6`} />
            <p className="text-base leading-[1.75] lg:text-[17px]">
              Theo ánh đom đóm, mời bạn đến chung vui cùng chúng tôi.
            </p>
          </div>
        </section>

        {/* C3 · Hai cành cây */}
        <section
          id="couple"
          className="flex min-h-[110svh] items-end px-4 pb-[12svh]"
        >
          <div className="mx-auto grid w-full max-w-[640px] grid-cols-2 gap-3 max-[359px]:grid-cols-1">
            {[
              { label: "Nhà trai", p: groom, img: images[1] },
              { label: "Nhà gái", p: bride, img: images[2] },
            ].map(({ label, p, img }) => (
              <Card key={label} className="p-4 sm:p-6">
                {!three && <Photo src={img} alt={p.name} />}
                <h2 className={t.heading}>{label}</h2>
                <p className="mt-2 text-lg font-medium break-words text-[#E9F59A]">
                  {p.name}
                </p>
                <p className={`${t.soft} mt-1 text-sm`}>{p.address}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* C4 · Ba ảnh treo */}
        <section id="story" className="min-h-[170svh] px-4">
          {STORY.map((s, i) => (
            <div
              key={s.title}
              className="flex min-h-[56svh] items-end pb-[8svh]"
            >
              <Card>
                {!three && <Photo src={images[3 + i]} alt={s.title} />}
                <h2 className={`${t.heading} pl-3`}>{s.title}</h2>
                <p className="mt-3 text-base leading-[1.75]">{s.text}</p>
              </Card>
            </div>
          ))}
        </section>

        {/* C8 · Hành lang ảnh */}
        <section
          id="album"
          className="flex min-h-[140svh] flex-col items-center justify-end px-4 pb-[12svh] text-center"
        >
          <h2 data-glow className={t.heading}>
            Kỷ niệm trên lối mòn
          </h2>
          {three && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="mt-5 min-h-11 rounded-full border border-[#7FD1A8] px-6 text-[#7FD1A8]"
            >
              {showAll ? "Thu gọn" : "Xem tất cả ảnh ⊞"}
            </button>
          )}
          {(showAll || !three) && (
            <div className="mt-6 grid w-full max-w-[640px] grid-cols-2 gap-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setMedia({ src })}
                  className="overflow-hidden rounded-lg border border-[#1C2B22]"
                >
                  {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL */}
                  <img
                    src={src}
                    alt={`Ảnh cưới ${i + 1}`}
                    loading="lazy"
                    className="aspect-3/4 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* C5 + C6 · Khoảng rừng trống */}
        <section
          id="date"
          className="flex min-h-[140svh] items-end px-4 pb-[12svh]"
        >
          <Card className="text-center">
            <h2 className={t.heading}>Chúng tôi cưới</h2>
            <p className={`${t.big} mt-3`}>{day}</p>
            <p className="mt-2 tracking-[0.2em] text-[#E9F59A]">
              THÁNG {month} · {year}
            </p>
            <p className={`${t.soft} mt-1 capitalize`}>{formatWeekday(date)}</p>
            {left?.done ? (
              <p className="mt-5 text-[#E9F59A]">
                Chúng tôi đã về chung một nhà ♥
              </p>
            ) : (
              left && (
                <dl className="mt-5 grid grid-cols-4 gap-2">
                  {(
                    [
                      [left.days, "ngày"],
                      [left.hours, "giờ"],
                      [left.minutes, "phút"],
                      [left.seconds, "giây"],
                    ] as const
                  ).map(([v, l]) => (
                    <div key={l}>
                      <dt className="sr-only">{l}</dt>
                      <dd className="text-2xl font-extralight text-[#E9F59A] tabular-nums">
                        {String(v).padStart(2, "0")}
                      </dd>
                      <dd className={`${t.soft} text-xs`} aria-hidden>
                        {l}
                      </dd>
                    </div>
                  ))}
                </dl>
              )
            )}
            <hr className={`${t.dots} my-5`} />
            <ul className="space-y-2 text-left">
              <li className="flex justify-between">
                <span>Lễ thành hôn</span>
                <span className="text-[#E9F59A]">17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Tiệc cưới</span>
                <span className="text-[#E9F59A]">18:30</span>
              </li>
            </ul>
            <p className={`${t.soft} mt-4 text-sm`}>
              Tiệc tối ngoài trời, mời bạn mang áo khoác
            </p>
          </Card>
        </section>

        {/* C7 · Mũi tên sáng */}
        <section
          id="venue"
          className="flex min-h-[100svh] items-end px-4 pb-[10svh]"
        >
          <Card>
            <h2 className={`${t.heading} pl-3`}>Đường tới tiệc</h2>
            <p className="mt-3 text-lg break-words text-[#E9F59A]">
              {venue.name || "Nhà hàng tiệc cưới"}
            </p>
            <MapEmbed
              venue={venue}
              className="mt-4 h-[200px] w-full rounded-lg"
            />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
              target="_blank"
              rel="noreferrer"
              className={`${t.btn} mt-4 w-full`}
            >
              Chỉ đường ➚
            </a>
          </Card>
        </section>

        {/* C9 + C10 · Tên viết tắt */}
        <section
          id="thanks"
          className="flex min-h-[70svh] flex-col items-center justify-end px-6 pt-[30svh] pb-24 text-center"
        >
          {!three && (
            <p aria-hidden className={`${t.script} text-5xl`}>
              {mono}
            </p>
          )}
          <p data-glow className="mt-6 max-w-[400px] text-lg leading-[1.75]">
            Cảm ơn bạn đã theo ánh đom đóm đến với chúng tôi.
          </p>
          {images[7] && (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL
            <img
              data-glow
              src={images[7]}
              alt="Ảnh cưới"
              className="mt-8 aspect-3/4 w-3/4 max-w-[320px] rounded-lg border border-[#1C2B22] object-cover"
            />
          )}
          <p
            data-glow
            className={`${t.script} mt-6 text-balance text-[32px] lg:text-[44px]`}
          >
            {groom.name} &amp; {bride.name}
          </p>
          {videos[0] && (
            <button
              type="button"
              onClick={() => setMedia({ src: videos[0], video: true })}
              className={`${t.btn} mt-6`}
            >
              ▶ Xem video của chúng tôi
            </button>
          )}
        </section>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setMedia(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={() => {}}
        className="m-auto max-h-[90svh] max-w-[92vw] bg-transparent p-0 backdrop:bg-[#050D0A]/90"
      >
        {media?.video ? (
          // biome-ignore lint/a11y/useMediaCaption: video cưới do người dùng tải lên
          <video
            src={media.src}
            controls
            playsInline
            poster={images[0]}
            onPlay={music.pause}
            className="max-h-[80svh] w-full rounded-lg"
          />
        ) : (
          media && (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL
            <img
              src={media.src}
              alt="Ảnh cưới"
              className="max-h-[80svh] rounded-lg object-contain"
            />
          )
        )}
        <form method="dialog" className="mt-3 text-center">
          <button type="submit" className={t.btn}>
            Đóng
          </button>
        </form>
      </dialog>
    </main>
  );
}
