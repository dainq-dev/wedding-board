// Bảng mốc §4: [progress, walk, yawDeg, pitchDeg]. Đoạn walk phẳng = đứng lại ở trạm.
export const STOPS: [number, number, number, number][] = [
  [0, 0, 0, 0],
  [0.1, 0.08, 0, 0],
  [0.15, 0.14, -20, 0],
  [0.21, 0.14, 20, 0],
  [0.26, 0.24, -30, 0],
  [0.3, 0.24, -30, 0],
  [0.32, 0.3, 30, 0],
  [0.36, 0.3, 30, 0],
  [0.38, 0.36, 0, 15],
  [0.42, 0.36, 0, 15],
  [0.46, 0.44, 0, 0],
  [0.58, 0.7, 0, 0],
  [0.62, 0.8, 0, 20],
  [0.76, 0.8, 0, 0],
  [0.82, 0.88, 10, 0],
  [0.9, 0.92, 0, 8],
  [1, 0.92, 0, 8],
];

const sineInOut = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

// Trả [walk, yawDeg, pitchDeg] tại progress p (kẹp 0..1), nội suy sine giữa hai mốc.
export function walkAt(p: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < STOPS.length - 2 && x > STOPS[i + 1][0]) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = sineInOut(Math.min(1, Math.max(0, (x - a[0]) / (b[0] - a[0]))));
  return [
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
    a[3] + (b[3] - a[3]) * k,
  ];
}

export const walk = (p: number) => walkAt(p)[0];
