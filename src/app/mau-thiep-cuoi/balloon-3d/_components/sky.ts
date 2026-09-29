import { Color } from "three";

// Bảng màu trời theo tiến độ cuộn (art direction v2): sáng → giờ vàng → chạng vạng → đêm.
export const SKY_STOPS = [
  { at: 0, top: "#7FB3E0", horizon: "#F4E7DA", sun: "#FFF4E0" },
  { at: 0.3, top: "#6EA7DB", horizon: "#FBEFE4", sun: "#FFF1D6" },
  { at: 0.55, top: "#8D9BCB", horizon: "#F7C59F", sun: "#FFB978" },
  { at: 0.78, top: "#3B3F74", horizon: "#E39585", sun: "#FF8A5B" },
  { at: 1, top: "#0E1330", horizon: "#34305C", sun: "#6D5A9C" },
] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

const cache = SKY_STOPS.map((s) => ({
  at: s.at,
  top: new Color(s.top),
  horizon: new Color(s.horizon),
  sun: new Color(s.sun),
}));

export type SkyColors = { top: Color; horizon: Color; sun: Color };

/** Màu trời tại tiến độ p (0..1), nội suy mượt giữa các mốc. Ghi vào `out` để không cấp phát mỗi frame. */
export function skyAt(
  p: number,
  out: SkyColors = { top: new Color(), horizon: new Color(), sun: new Color() },
): SkyColors {
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

/** Độ "tối" 0 (ngày) → 1 (đêm): lửa khinh khí cầu sáng dần, sao hiện ra. */
export const nightness = (p: number) => smooth(clamp01((p - 0.62) / 0.3));

/** Độ cao mặt trời (radian) — hạ dần về chân trời rồi lặn. */
export const sunElevation = (p: number) => 0.9 - 1.05 * smooth(clamp01(p));
