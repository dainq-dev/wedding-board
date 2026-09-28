"use client";

import { Flip, gsap, SplitText } from "@/kit/gsap";

// Presets là hàm thường (không phải hook) nên không dùng được useReducedMotion
// — query media trực tiếp trong từng lệnh.
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// fadeUp/splitReveal/clipReveal: rút về 0.3s khi reduced-motion (spec §7).
const dur = (d: number) => (reduced() ? 0.3 : d);

export const EASE = {
  soft: "power3.out",
  expo: "expo.out",
  spring: "back.out(1.7)",
} as const;

// A1
export function fadeUp(
  targets: gsap.DOMTarget,
  {
    delay = 0,
    stagger = 0.1,
    y = 40,
    duration = 0.8,
  }: { delay?: number; stagger?: number; y?: number; duration?: number } = {},
) {
  return gsap.from(targets, {
    opacity: 0,
    y,
    duration: dur(duration),
    delay,
    stagger,
    ease: EASE.soft,
  });
}

// A2 — SplitText đã miễn phí từ GSAP 3.13.
export type SplitBy = "chars" | "words" | "lines";

export function splitReveal(
  targets: gsap.DOMTarget,
  {
    by = "chars",
    stagger = 0.03,
    yPercent = 100,
    mask = true,
  }: {
    by?: SplitBy;
    stagger?: number;
    yPercent?: number;
    mask?: boolean;
  } = {},
) {
  // mask tạo lớp overflow:hidden quanh từng đơn vị → chữ "trượt từ trong ra".
  const split = new SplitText(targets, {
    type: by,
    mask: mask ? by : undefined,
  });
  return gsap.from(split[by], {
    yPercent: mask ? yPercent : 0,
    opacity: mask ? 1 : 0,
    duration: dur(0.8),
    stagger,
    ease: EASE.soft,
  });
}

// A3
export function clipReveal(
  targets: gsap.DOMTarget,
  { duration = 1.1 }: { duration?: number } = {},
) {
  return gsap.fromTo(
    targets,
    { clipPath: "inset(100% 0 0 0)" },
    {
      clipPath: "inset(0% 0 0 0)",
      duration: dur(duration),
      ease: EASE.expo,
    },
  );
}

// A5 — section được pin, dải con lăn ngang theo cuộn.
// Con lăn = scrollWidth -.innerWidth nên dải phải rộng hơn màn hình.
export function horizontalTrack(
  track: gsap.DOMTarget,
  { trigger }: { trigger?: gsap.DOMTarget } = {},
) {
  const el = gsap.utils.toArray<HTMLElement>(track)[0];
  const dist = () => el.scrollWidth - window.innerWidth;
  return gsap.to(el, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      trigger: trigger ?? el,
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      end: () => `+=${dist()}`,
    },
  });
}

// A6 — đường SVG được vẽ dần.
export function drawLine(
  targets: gsap.DOMTarget,
  { duration = 1, scrub = true }: { duration?: number; scrub?: boolean } = {},
) {
  return gsap.fromTo(
    targets,
    { drawSVG: "0%" },
    {
      drawSVG: "100%",
      duration,
      ease: "none",
      // scrub: tiến độ gắn với cuộn nên duration chỉ còn ý nghĩa khi tắt scrub.
      scrollTrigger: scrub ? { trigger: targets, start: "top 85%" } : undefined,
    },
  );
}

// A8 — hạt rơi (fall=true) hoặc hạt bay lên (fall=false), lặp vô hạn.
// Cha phải có position:relative/absolute để hạt nằm trong vùng.
export function particles({
  parent,
  count = 30,
  colors = ["#ffffff"],
  size = [4, 10],
  fall = true,
}: {
  parent: gsap.DOMTarget;
  count?: number;
  colors?: string[];
  size?: [number, number];
  fall?: boolean;
}) {
  // reduced-motion: không thêm gì, kill rỗng.
  if (reduced()) return { kill() {} };
  const host = gsap.utils.toArray<HTMLElement>(parent)[0];
  const n = Math.min(count, 40); // trên 40 hạt là nặng trên mobile, vô ích về thị giác.
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const els: HTMLDivElement[] = [];
  const tweens: gsap.core.Tween[] = [];
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div");
    d.className =
      "pointer-events-none absolute rounded-full will-change-transform";
    host.append(d);
    els.push(d);
    const w = rnd(size[0], size[1]);
    gsap.set(d, {
      width: w,
      height: w,
      left: `${rnd(0, 100)}%`,
      backgroundColor: colors[i % colors.length],
      opacity: rnd(0.4, 0.9),
    });
    const span = rnd(6, 14);
    const h = host.clientHeight;
    // delay âm: mỗi hạt bắt đầu giữa chu kỳ → không rơi đồng loạt lúc mở trang.
    tweens.push(
      gsap.fromTo(
        d,
        { y: fall ? -w : h + w },
        {
          y: fall ? h + w : -w,
          x: `+=${rnd(-60, 60)}`,
          rotation: rnd(0, 360),
          duration: span,
          ease: "none",
          repeat: -1,
          delay: -rnd(0, span),
        },
      ),
    );
  }
  return {
    kill() {
      for (const t of tweens) t.kill();
      for (const d of els) d.remove();
    },
  };
}

// A9 — nội dung phải được nhân đôi (2 bản) để lặp liền mạch.
export function marquee(
  targets: gsap.DOMTarget,
  { speed = 60 }: { speed?: number } = {},
) {
  if (reduced()) return gsap.timeline();
  const el = gsap.utils.toArray<HTMLElement>(targets)[0];
  const half = el.scrollWidth / 2;
  return gsap.to(el, {
    x: -half,
    duration: half / speed,
    ease: "none",
    repeat: -1,
  });
}

// A10 — apply() đổi layout (vd thêm class fullscreen cho ảnh), Flip Tween về vị trí mới.
export function flipZoom(targets: gsap.DOMTarget, apply: () => void) {
  const state = Flip.getState(targets);
  apply();
  return Flip.from(state, { duration: 0.6, ease: EASE.soft, absolute: true });
}

// A11 — TextPlugin: speed = ký tự / giây.
export function typewriter(
  targets: gsap.DOMTarget,
  { text, speed = 40 }: { text: string; speed?: number },
) {
  if (reduced()) return gsap.set(targets, { text });
  return gsap.to(targets, { text: { value: text, speed } });
}

// A12 — từ vị trí hiện tại dao động ±y/±rotation (không nhân đôi biên độ).
export function float(
  targets: gsap.DOMTarget,
  {
    y = 8,
    rotation = 2,
    duration = 3,
  }: { y?: number; rotation?: number; duration?: number } = {},
) {
  if (reduced()) return gsap.timeline();
  return gsap.fromTo(
    targets,
    { y: -y / 2, rotation: -rotation / 2 },
    {
      y: y / 2,
      rotation: rotation / 2,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    },
  );
}
