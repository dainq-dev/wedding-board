import { Color, Vector3 } from "three";

// Ranh giới mùa theo progress: xuân, hạ, thu, đông, xuân lại.
export const SEASON_STOPS = [0, 0.3, 0.5, 0.7, 0.85] as const;
const BLEND = 0.02;

const smooth = (k: number) => k * k * (3 - 2 * k);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// 0..4 thực: đứng yên giữa các ranh, smoothstep trong ±BLEND quanh mỗi ranh.
export function seasonAt(p: number): number {
  let s = 0;
  for (let i = 1; i < SEASON_STOPS.length; i++) {
    const c = SEASON_STOPS[i];
    s += smooth(clamp01((p - (c - BLEND)) / (2 * BLEND)));
  }
  return s;
}

// Nội suy một mảng 5 giá trị (index = mùa) theo s thực.
export function lerpStops(vals: readonly number[], s: number) {
  const i = Math.min(vals.length - 2, Math.floor(s));
  const k = clamp01(s - i);
  return vals[i] + (vals[i + 1] - vals[i]) * k;
}

const _a = new Color();
export function seasonColor(hexes: readonly string[], s: number, out: Color) {
  const i = Math.min(hexes.length - 2, Math.floor(s));
  return out.set(hexes[i]).lerp(_a.set(hexes[i + 1]), clamp01(s - i));
}

// Index 4 = xuân quay lại.
export const BG = ["#FDEEF2", "#E8F6E9", "#FBE8D3", "#EEF3F8", "#FDEEF2"];
export const GRASS = ["#A7D7A0", "#6CBF6A", "#C9A45C", "#F1F5F9", "#A7D7A0"];
export const FOLIAGE = ["#F9A8D4", "#4ADE80", "#F97316", "#FFFFFF", "#F9A8D4"];
export const LEAF_SCALE = [0.6, 1, 0.8, 0.3, 0.6];

export type OrbitKf = {
  at: number;
  theta: number; // độ
  r: number;
  y: number;
  look: [number, number, number];
};

export const ORBIT_KFS: OrbitKf[] = [
  { at: 0, theta: 0, r: 16, y: 3, look: [0, 3, 0] },
  { at: 0.15, theta: 30, r: 11, y: 4, look: [0, 4, 0] },
  { at: 0.3, theta: 90, r: 12, y: 2.5, look: [0, 3, 0] },
  { at: 0.4, theta: 120, r: 9, y: 5, look: [0, 5, 0] },
  { at: 0.5, theta: 180, r: 10, y: 3.5, look: [0, 3.5, 0] },
  { at: 0.62, theta: 220, r: 7, y: 3, look: [1, 3, 0] },
  { at: 0.7, theta: 270, r: 14, y: 4, look: [0, 2, 0] },
  { at: 0.85, theta: 330, r: 12, y: 1.5, look: [0, 3, 0] },
  { at: 1, theta: 360, r: 18, y: 6, look: [0, 3, 0] },
];

const sineInOut = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

// Như sampleKeyframes của kit nhưng nội suy trên (θ, r, y) → camera đi theo cung tròn.
export function sampleOrbit(
  kfs: OrbitKf[],
  p: number,
  out = { pos: new Vector3(), look: new Vector3() },
) {
  const x = clamp01(p);
  let i = 0;
  while (i < kfs.length - 2 && x > kfs[i + 1].at) i++;
  const a = kfs[i];
  const b = kfs[i + 1];
  const k = sineInOut(clamp01((x - a.at) / (b.at - a.at)));
  const th = ((a.theta + (b.theta - a.theta) * k) * Math.PI) / 180;
  const r = a.r + (b.r - a.r) * k;
  out.pos.set(r * Math.sin(th), a.y + (b.y - a.y) * k, r * Math.cos(th));
  out.look.set(
    a.look[0] + (b.look[0] - a.look[0]) * k,
    a.look[1] + (b.look[1] - a.look[1]) * k,
    a.look[2] + (b.look[2] - a.look[2]) * k,
  );
  return out;
}

export type Branch = {
  start: Vector3;
  end: Vector3;
  radius: number;
  depth: number;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cây đệ quy seed cố định: maxDepth 5 → 63 cành, 4 → 31 cành.
export function buildTree(seed: number, maxDepth = 5): Branch[] {
  const rand = rng(seed);
  const out: Branch[] = [];
  const up = new Vector3(0, 1, 0);
  const grow = (
    start: Vector3,
    dir: Vector3,
    len: number,
    radius: number,
    depth: number,
  ) => {
    const end = start.clone().addScaledVector(dir, len);
    out.push({ start, end, radius, depth });
    if (depth >= maxDepth) return;
    for (let j = 0; j < 2; j++) {
      const axis = new Vector3(rand() - 0.5, 0, rand() - 0.5).normalize();
      const d = dir
        .clone()
        .applyAxisAngle(axis, 0.35 + rand() * 0.45)
        .lerp(up, 0.15)
        .normalize();
      grow(end, d, len * (0.68 + rand() * 0.12), radius * 0.62, depth + 1);
    }
  };
  grow(new Vector3(0, 0.5, 0), up.clone(), 2.6, 0.32, 0);
  return out;
}
