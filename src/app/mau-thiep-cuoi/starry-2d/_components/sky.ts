/** Bộ sinh số giả ngẫu nhiên có seed (sao và làng giống nhau giữa server và client). */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type Star = {
  x: number;
  y: number;
  r: number;
  big: boolean;
  delay: number;
  dur: number;
};

/** n ngôi sao trong nửa trên bầu trời (% toạ độ), 8 sao lớn có quầng. */
export function stars(n: number, seed = 21): Star[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => ({
    x: r() * 100,
    y: r() * 72,
    r: 1 + r() * 2,
    big: i < 8,
    delay: r() * 4,
    dur: 2.5 + r() * 3,
  }));
}

/** Path SVG dãy nhà mái nhọn + tháp chuông trong khung 1000×200. */
export function village(seed = 5) {
  const r = rng(seed);
  const parts: string[] = ["M0 200 L0 150"];
  let x = 0;
  while (x < 1000) {
    const w = 40 + r() * 50;
    const h = 30 + r() * 40;
    const base = 150 - r() * 12;
    const tower = r() > 0.9;
    parts.push(
      `L${x.toFixed(0)} ${base.toFixed(0)}`,
      `L${x.toFixed(0)} ${(base - h).toFixed(0)}`,
    );
    if (tower)
      parts.push(`L${(x + w / 2).toFixed(0)} ${(base - h - 70).toFixed(0)}`);
    else parts.push(`L${(x + w / 2).toFixed(0)} ${(base - h - 22).toFixed(0)}`);
    parts.push(
      `L${(x + w).toFixed(0)} ${(base - h).toFixed(0)}`,
      `L${(x + w).toFixed(0)} ${base.toFixed(0)}`,
    );
    x += w + r() * 14;
  }
  parts.push("L1000 150 L1000 200 Z");
  return parts.join(" ");
}

/** Vị trí trăng trên vòng cung theo tiến độ p ∈ [0,1] (% viewport). */
export function moonAt(p: number) {
  const q = Math.min(1, Math.max(0, p));
  return { x: 12 + q * 76, y: 16 - Math.sin(q * Math.PI) * 7 };
}
