import type { Keyframe } from "@/kit/3d/keyframes";

// Keyframe camera §4 của spec.
export const KEYFRAMES: Keyframe[] = [
  { at: 0, pos: [0, 0, 60], look: [0, 0, 0] },
  { at: 0.12, pos: [0, 4, 38], look: [0, 0, 0] },
  { at: 0.28, pos: [-14, 2, 22], look: [0, 0, 0] },
  { at: 0.45, pos: [10, -3, 14], look: [0, 0, -10] },
  { at: 0.62, pos: [0, 0, -30], look: [0, 0, -60] },
  { at: 0.72, pos: [0, 0, 12], look: [0, 0, 0] },
  { at: 0.84, pos: [0, 18, 40], look: [0, 0, 0] },
  { at: 1, pos: [0, 0, 26], look: [0, 0, 0] },
];

export const COLLIDE_AT = 0.72;

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

// Vị trí sao chú rể G(p); sao cô dâu B(p) = −G(p). Bán kính 18 → 0 tại p = 0.72.
export function orbit(p: number): [number, number, number] {
  const r = 18 * (1 - smooth(p / COLLIDE_AT));
  const t = p * 6 * Math.PI;
  return [r * Math.cos(t), 0, r * Math.sin(t)];
}
