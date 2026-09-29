import { Vector3 } from "three";

export type Vec3 = [number, number, number];
export type Keyframe = { at: number; pos: Vec3; look: Vec3 };

const sineInOut = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

// Nội suy camera theo progress 0..1 giữa các keyframe (sắp theo `at` tăng dần).
export function sampleKeyframes(
  kfs: Keyframe[],
  p: number,
  out = { pos: new Vector3(), look: new Vector3() },
) {
  const x = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < kfs.length - 2 && x > kfs[i + 1].at) i++;
  const a = kfs[i];
  const b = kfs[Math.min(i + 1, kfs.length - 1)];
  const span = b.at - a.at;
  const k =
    span <= 0 ? 0 : sineInOut(Math.min(1, Math.max(0, (x - a.at) / span)));
  out.pos.set(...a.pos).lerp(new Vector3(...b.pos), k);
  out.look.set(...a.look).lerp(new Vector3(...b.look), k);
  return out;
}

// Hệ số làm mượt độc lập với framerate: camera.position.lerp(target, damp(4, delta)).
export const damp = (lambda: number, delta: number) =>
  1 - Math.exp(-lambda * delta);

// Tiến độ cục bộ của một khoảng [a, b] trong progress toàn trang, kẹp 0..1.
export const range = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));
