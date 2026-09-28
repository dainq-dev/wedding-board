// A8 mật độ cánh hoa theo tiến độ cuộn (spec §5, bảng "Lớp toàn trang").
// 0–10%: 6 · 10–60%: 6→14 · 60–90%: 14→22 · 90–100%: 22→30, chặn trên bằng `max`.

const ANCHORS: readonly [number, number][] = [
  [0, 6],
  [0.1, 6],
  [0.6, 14],
  [0.9, 22],
  [1, 30],
];

export function densityCount(progress: number, max = 30): number {
  const p = Math.min(1, Math.max(0, progress));
  let value = ANCHORS[ANCHORS.length - 1]?.[1] ?? 30;
  for (let i = 1; i < ANCHORS.length; i++) {
    const [x0, y0] = ANCHORS[i - 1] as [number, number];
    const [x1, y1] = ANCHORS[i] as [number, number];
    if (p <= x1) {
      value = y0 + ((p - x0) / (x1 - x0)) * (y1 - y0);
      break;
    }
  }
  return Math.round(Math.min(value, max));
}
