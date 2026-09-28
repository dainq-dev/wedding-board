// Góc xoay / vị trí rải randomness nhưng deterministic theo seed:
// cùng i luôn ra cùng giá trị → SSR và CSR khớp nhau, không cảnh báo hydration.

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rand = (i: number, salt: number) =>
  mulberry32(i * 997 + salt * 7919)();

// rot(i) ∈ [-8°, 8°] — spec §2 "góc xoay ngẫu nhiên nhưng cố định theo seed".
export const rot = (i: number) => -8 + rand(i, 11) * 16;

// Vị trí rải trong vùng w×h cho ảnh pw×ph (đơn vị % khi w=h=100).
export function scatter(
  i: number,
  w: number,
  h: number,
  pw: number,
  ph: number,
): { x: number; y: number } {
  const pad = Math.min(4, Math.max(0, Math.min(w, h)) * 0.04);
  const x = pad + rand(i, 21) * Math.max(0, w - pw - pad * 2);
  const y = pad + rand(i, 22) * Math.max(0, h - ph - pad * 2);
  return { x, y };
}

// Tên gọi = từ cuối của họ tên (dùng cho dấu mộc C10).
export const nickname = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.at(-1) ?? name;
};
