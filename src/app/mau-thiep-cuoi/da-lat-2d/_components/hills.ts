/** Bộ sinh số giả ngẫu nhiên có seed (rặng thông giống nhau giữa server và client). */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Path SVG một rặng đồi thông trong khung 1440×400: sườn đồi uốn sin + các ngọn thông
 * hình tam giác nhọn (cao thấp ngẫu nhiên) dọc theo sườn.
 */
export function ridge(seed: number, base: number, amp: number, trees: number) {
  const r = rng(seed);
  const W = 1440;
  const H = 400;
  const phase = r() * Math.PI * 2;
  const hill = (x: number) =>
    base - Math.sin((x / W) * Math.PI * 1.6 + phase) * amp;
  const pts: string[] = [`M0 ${H}`, `L0 ${hill(0).toFixed(1)}`];
  const step = W / trees;
  for (let i = 0; i < trees; i++) {
    const x = i * step + r() * step * 0.4;
    const w = step * (0.45 + r() * 0.35);
    const h = 26 + r() * 46;
    const y = hill(x + w / 2);
    pts.push(
      `L${x.toFixed(1)} ${y.toFixed(1)}`,
      `L${(x + w / 2).toFixed(1)} ${(y - h).toFixed(1)}`,
      `L${(x + w).toFixed(1)} ${y.toFixed(1)}`,
    );
  }
  pts.push(`L${W} ${hill(W).toFixed(1)}`, `L${W} ${H}`, "Z");
  return pts.join(" ");
}

/** Câu thơ theo tháng cưới (1–12). */
export const MONTH_LINE = [
  "giữa mùa hoa mai anh đào",
  "khi đồi mận trắng hoa",
  "giữa mùa cà phê nở trắng",
  "khi phố núi vào xuân muộn",
  "khi những cơn mưa đầu mùa ghé",
  "giữa mùa hoa phượng tím",
  "khi đồi thông ướt mưa",
  "giữa mùa hoa lavender",
  "khi mùa thu gõ cửa",
  "giữa mùa hoa dã quỳ chớm nở",
  "giữa mùa dã quỳ",
  "khi đồi thông vào đông",
] as const;
