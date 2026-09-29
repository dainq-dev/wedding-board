// Letterbox ratio (spec §9.3): chiều cao mỗi dải đen theo tỉ lệ viewport
// để vùng giữa xấp xỉ tỉ lệ khung `r`. Trả về 0..0.5.
//
// Mobile dọc (vh > vw) được cap 0.12 (12svh mỗi bên): tính đúng 21:9 ở
// 360×740 cho dải ~0.39 → vùng giữa chỉ còn ~155px, quá hẹp để đọc chữ.
export const PORTRAIT_BAR_CAP = 0.12;

export const RATIOS = { "21:9": 21 / 9, "16:9": 16 / 9 } as const;

export type LetterboxRatio = keyof typeof RATIOS | "open";

export function barFraction(vw: number, vh: number, r: number): number {
  const inner = vw / r;
  const f = inner >= vh ? 0 : (vh - inner) / 2 / vh;
  return vh > vw ? Math.min(f, PORTRAIT_BAR_CAP) : f;
}

// scaleY của mỗi dải (dải cao 50svh cố định) cho tỉ lệ letterbox.
export function barScale(
  vw: number,
  vh: number,
  ratio: LetterboxRatio,
): number {
  if (ratio === "open") return 0;
  return Math.min(1, barFraction(vw, vh, RATIOS[ratio]) * 2);
}
