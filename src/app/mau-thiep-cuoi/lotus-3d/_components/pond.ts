// Logic thuần của đầm sen: lộ trình camera, nở hoa, hiện card. Có test ở pond.test.ts.

export type Vec3 = [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const sineOut = (k: number) => Math.sin((k * Math.PI) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Mốc progress ↔ điểm điều khiển CatmullRom (điểm i nằm ở u = i/(n-1)) ↔ hướng nhìn.
export const PATH: { at: number; pos: Vec3; look: Vec3 }[] = [
  { at: 0, pos: [0, 0.6, 20], look: [0, 0.8, 6] },
  { at: 0.18, pos: [0, 0.9, 6], look: [0, 1.4, 0] },
  { at: 0.32, pos: [0, 1.2, -6], look: [0, 0.3, -9] },
  { at: 0.45, pos: [-4, 0.8, -16], look: [-6, 1.2, -18] },
  { at: 0.5, pos: [0, 0.9, -20], look: [0, 1.3, -23] },
  { at: 0.56, pos: [4, 0.8, -24], look: [6, 1.2, -26] },
  { at: 0.68, pos: [0, 0.4, -34], look: [0, -0.6, -40] },
  { at: 0.84, pos: [0, 1.5, -46], look: [0, 2, -56] },
  { at: 1, pos: [0, 3, -44], look: [0, 6, -56] },
];

function segment(p: number) {
  const x = clamp01(p);
  let i = 0;
  while (i < PATH.length - 2 && x > PATH[i + 1].at) i++;
  return { i, k: sineOut(range(x, PATH[i].at, PATH[i + 1].at)) };
}

// p → u trên đường cong: chậm lại quanh mỗi mốc (sine.out trong từng đoạn), đơn điệu.
export function easeRemap(p: number): number {
  const { i, k } = segment(p);
  return (i + k) / (PATH.length - 1);
}

export function lookAt(p: number): Vec3 {
  const { i, k } = segment(p);
  const a = PATH[i].look;
  const b = PATH[i + 1].look;
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
}

export const BLOOMS = {
  L0: { open: [0.1, 0.2], close: [0.22, 0.26], rest: 0.7, card: [0.1, 0.25] },
  L1: { open: [0.4, 0.46], close: [0.47, 0.5], rest: 0.5, card: [0.4, 0.47] },
  L2: {
    open: [0.47, 0.52],
    close: [0.53, 0.56],
    rest: 0.5,
    card: [0.47, 0.53],
  },
  L3: { open: [0.53, 0.58], close: [0.6, 0.64], rest: 0.5, card: [0.53, 0.6] },
} as const;
export type BloomId = keyof typeof BLOOMS;

export const LOTUS_POS: Record<BloomId, Vec3> = {
  L0: [0, 0.2, 0],
  L1: [-6, 0.2, -18],
  L2: [0, 0.2, -23],
  L3: [6, 0.2, -26],
};

export function bloomAt(id: BloomId, p: number): number {
  const b = BLOOMS[id];
  if (p < b.close[0]) return sineOut(range(p, b.open[0], b.open[1]));
  return lerp(1, b.rest, sineOut(range(p, b.close[0], b.close[1])));
}

// Nở > 0.6 VÀ progress trong chương [a, b) → cuộn nhanh không để card kẹt / chồng nhau.
export function cardVisible(id: BloomId, p: number): boolean {
  const [a, b] = BLOOMS[id].card;
  return bloomAt(id, p) > 0.6 && p >= a && p < b;
}

// images[3..7] + images[0]: 6 ảnh cắm đứng trên mặt nước (C8).
export const REFLECTION_INDEX = [3, 4, 5, 6, 7, 0];
