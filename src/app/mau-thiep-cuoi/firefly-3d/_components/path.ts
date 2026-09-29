import { CatmullRomCurve3, Vector3 } from "three";

// Lối mòn đi theo −z, uốn trái phải.
export const PATH = new CatmullRomCurve3(
  [
    [0, 0, 0],
    [1.5, 0, -10],
    [-1.5, 0, -20],
    [1, 0, -30],
    [-1, 0, -40],
    [1.5, 0, -50],
    [0, 0, -60],
    [-1, 0, -70],
    [0, 0, -80],
    [0, 0, -92],
  ].map(([x, y, z]) => new Vector3(x, y, z)),
);
export const PATH_LEN = PATH.getLength();
export const EYE = 1.6;

// Điểm cách vị trí walk=w một đoạn `ahead` dọc lối, lệch ngang `side` (+ = phải), cao `up`.
export function along(w: number, ahead = 0, side = 0, up = 0) {
  const u = Math.min(1, Math.max(0, w + ahead / PATH_LEN));
  const p = PATH.getPointAt(u);
  const t = PATH.getTangentAt(u);
  return p.set(p.x - t.z * side, up, p.z + t.x * side);
}

// Tâm khoảng rừng trống (đứng ở walk 0.80, nhìn lên vòm).
export const CLEARING = along(0.8, 5, 0, 0);
