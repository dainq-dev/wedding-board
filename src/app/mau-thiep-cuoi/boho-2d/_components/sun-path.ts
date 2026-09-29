export type Point = { readonly x: number; readonly y: number };

export function sunPosition(progress: number): Point {
  const p = Math.max(0, Math.min(1, progress));
  return { x: 8 + p * 64, y: 70 - 224 * p * (1 - p) };
}
