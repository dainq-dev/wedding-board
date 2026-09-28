// Đội hình đom đóm. Phần thuần (pickEvenly, arrowPoints, wanderOffset) có test.
type V3 = [number, number, number];

// Chọn đều n điểm từ mảng phẳng [x0,y0,x1,y1,…]; thiếu thì lặp lại; rỗng → n điểm gốc.
export function pickEvenly(
  hits: number[],
  n: number,
  map: (x: number, y: number) => V3,
): Float32Array {
  const out = new Float32Array(n * 3);
  const m = hits.length / 2;
  if (m === 0) return out;
  for (let i = 0; i < n; i++) {
    const j = Math.floor((i * m) / n) % m;
    out.set(map(hits[j * 2], hits[j * 2 + 1]), i * 3);
  }
  return out;
}

// Mũi tên chỉ xuống, nằm trong hộp x ∈ [-1,1], y ∈ [-1,2], z = 0 (toạ độ cục bộ).
export function arrowPoints(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const shaft = Math.round(n * 0.4);
  for (let i = 0; i < n; i++) {
    if (i < shaft) {
      out.set([0, 2 - (i / Math.max(1, shaft - 1)) * 2, 0], i * 3);
    } else {
      // hai cạnh chữ V: từ (±1, 0) về đỉnh (0, -1)
      const k = i - shaft;
      const t = (k >> 1) / Math.max(1, (n - shaft) / 2 - 1);
      const s = k % 2 ? 1 : -1;
      out.set([s * (1 - Math.min(1, t)), -Math.min(1, t), 0], i * 3);
    }
  }
  return out;
}

// Độ lệch "lang thang" — PHẢI khớp vertex shader trong fireflies.tsx.
export function wanderOffset(phase: number, freq: number, t: number): V3 {
  return [
    Math.sin(t * 0.7 * freq + phase) * 0.8,
    Math.sin(t * 0.9 * freq + phase * 1.7) * 0.48,
    Math.cos(t * 0.5 * freq + phase) * 0.8,
  ];
}

// Lấy mẫu chữ vẽ trên canvas 2D thành n điểm, rộng `width` đơn vị.
export function textPoints(
  text: string,
  font: string,
  n: number,
  width = 8,
  step = 3,
): Float32Array {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d");
  if (!g) return new Float32Array(n * 3);
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 80);
  const { data } = g.getImageData(0, 0, 512, 160);
  const hits: number[] = [];
  for (let y = 0; y < 160; y += step)
    for (let x = 0; x < 512; x += step)
      if (data[(y * 512 + x) * 4 + 3] > 128) hits.push(x, y);
  return pickEvenly(hits, n, (x, y) => [
    (x / 512 - 0.5) * width,
    (0.5 - y / 160) * width * 0.3125,
    0,
  ]);
}
