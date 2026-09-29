import { Color } from "three";

// Bình minh trên đầm sen (art direction v2): đào sớm → vàng nhạt → sáng trong.
export const DAWN_STOPS = [
  { at: 0, top: "#E4D3D8", horizon: "#F9D6BA", sun: "#FFD9A8" },
  { at: 0.35, top: "#D6DDE3", horizon: "#FBE5CE", sun: "#FFE8C4" },
  { at: 0.7, top: "#BCD3E0", horizon: "#F6ECDF", sun: "#FFF2DC" },
  { at: 1, top: "#A7C7DB", horizon: "#F3EDE4", sun: "#FFF6E8" },
] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

const cache = DAWN_STOPS.map((s) => ({
  at: s.at,
  top: new Color(s.top),
  horizon: new Color(s.horizon),
  sun: new Color(s.sun),
}));

export type DawnColors = { top: Color; horizon: Color; sun: Color };

export function dawnAt(
  p: number,
  out: DawnColors = {
    top: new Color(),
    horizon: new Color(),
    sun: new Color(),
  },
): DawnColors {
  const x = clamp01(p);
  let i = 0;
  while (i < cache.length - 2 && x > cache[i + 1].at) i++;
  const a = cache[i];
  const b = cache[i + 1];
  const k = smooth(clamp01((x - a.at) / (b.at - a.at)));
  out.top.copy(a.top).lerp(b.top, k);
  out.horizon.copy(a.horizon).lerp(b.horizon, k);
  out.sun.copy(a.sun).lerp(b.sun, k);
  return out;
}

/** Mặt trời lên dần từ sát hàng tre (radian). */
export const sunElevation = (p: number) => 0.03 + 0.32 * smooth(clamp01(p));

/** Camera trôi như thuyền: z tiến dần, lắc nhẹ trái phải. */
export const PATH_LENGTH = 96;
export function boatAt(p: number, t: number) {
  const x = clamp01(p);
  return {
    x: Math.sin(x * Math.PI * 2.2) * 1.6 + Math.sin(t * 0.25) * 0.15,
    y: 1.15 + Math.sin(t * 0.6) * 0.04,
    z: 8 - x * PATH_LENGTH,
  };
}

/** Bộ sinh số giả ngẫu nhiên có seed (bố cục hoa / lá cố định giữa các lần render). */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Vị trí cụm sen hai bên lối thuyền, chừa lối giữa |x| ≥ 2.2. */
export function lotusField(count: number, seed = 11) {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const z =
      6 - (i / Math.max(1, count - 1)) * (PATH_LENGTH + 12) + (r() - 0.5) * 4;
    return {
      x: side * (2.2 + r() * 7),
      z,
      scale: 0.75 + r() * 0.6,
      bloom: 0.55 + r() * 0.45,
      rot: r() * Math.PI * 2,
    };
  });
}
