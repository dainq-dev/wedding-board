import { Color, Vector3 } from "three";

type V3 = [number, number, number];
export type FlightKf = { at: number; alt: number; offset: V3; look: V3 };

// §4 spec: độ cao khinh khí cầu + camera offset/lookAt tương đối.
export const FLIGHT_KFS: FlightKf[] = [
  { at: 0, alt: 0, offset: [0, 2, 10], look: [0, 3, 0] },
  { at: 0.1, alt: 20, offset: [4, -2, 12], look: [0, 3, 0] },
  { at: 0.3, alt: 110, offset: [-6, 6, 14], look: [0, -10, 0] },
  { at: 0.4, alt: 160, offset: [0, 1, 9], look: [0, 3, 0] },
  { at: 0.5, alt: 220, offset: [0, 8, 26], look: [0, 0, -20] },
  { at: 0.65, alt: 300, offset: [10, 2, 16], look: [-30, 0, -60] },
  { at: 0.85, alt: 360, offset: [0, -4, 14], look: [0, 20, 0] },
  { at: 1, alt: 400, offset: [0, -2, 18], look: [0, 12, 0] },
];

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const sineInOut = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

// Tìm đoạn [a, b] chứa p và hệ số k (đã ease) giữa chúng.
function segment<T extends { at: number }>(stops: T[], p: number, ease = true) {
  const x = clamp01(p);
  let i = 0;
  while (i < stops.length - 2 && x > stops[i + 1].at) i++;
  const a = stops[i];
  const b = stops[i + 1];
  const k = clamp01((x - a.at) / (b.at - a.at));
  return { a, b, k: ease ? sineInOut(k) : k };
}

export function sampleFlight(
  kfs: FlightKf[],
  p: number,
  out = { alt: 0, offset: new Vector3(), look: new Vector3() },
) {
  const { a, b, k } = segment(kfs, p);
  out.alt = a.alt + (b.alt - a.alt) * k;
  out.offset.set(...a.offset).lerp(new Vector3(...b.offset), k);
  out.look.set(...a.look).lerp(new Vector3(...b.look), k);
  return out;
}

// Bảng màu trời §2 (đỉnh / chân trời), giữ nguyên trong mỗi mốc, chuyển giữa các mốc.
const SKY = [
  { at: 0, top: "#8FD0F2", hor: "#BFE3F7" },
  { at: 0.24, top: "#8FD0F2", hor: "#BFE3F7" },
  { at: 0.32, top: "#DCEFFA", hor: "#FFFFFF" },
  { at: 0.5, top: "#DCEFFA", hor: "#FFFFFF" },
  { at: 0.65, top: "#F59E8B", hor: "#F9C6C9" },
  { at: 0.8, top: "#F59E8B", hor: "#F9C6C9" },
  { at: 0.9, top: "#1B1F4B", hor: "#3A3470" },
  { at: 1, top: "#1B1F4B", hor: "#3A3470" },
];

export function skyColors(
  p: number,
  out = { top: new Color(), horizon: new Color() },
) {
  const { a, b, k } = segment(SKY, p, false);
  out.top.set(a.top).lerp(new Color(b.top), k);
  out.horizon.set(a.hor).lerp(new Color(b.hor), k);
  return out;
}

// Độ cao "vui" hiển thị ở đồng hồ (§4 bảng chương).
const METERS = [
  { at: 0, m: 0 },
  { at: 0.3, m: 900 },
  { at: 0.5, m: 2000 },
  { at: 0.65, m: 2600 },
  { at: 0.85, m: 3500 },
  { at: 1, m: 3500 },
];
const nf = new Intl.NumberFormat("vi-VN");

export function altitudeLabel(p: number) {
  if (clamp01(p) >= 0.85) return "∞";
  const { a, b, k } = segment(METERS, p, false);
  return `${nf.format(Math.round((a.m + (b.m - a.m) * k) / 50) * 50)} M`;
}
