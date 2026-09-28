// Tokens của mẫu editorial-2d (spec §2, §9.2).
// paper #FFFFFF · surface #F3F1EE · ink #111111 · ink-soft #5C5C5C · red #B91C1C · line #D6D3CE
// radius 0 · ease expo.out. Mọi giá trị là arbitrary Tailwind, không CSS thuần.
export const t = {
  root: "min-h-screen bg-[#FFFFFF] text-[#111111] font-(family-name:--font-body)",
  display: "font-(family-name:--font-display)",
  grid: "grid grid-cols-6 gap-x-3 px-4 lg:grid-cols-12 lg:gap-x-6 lg:px-[6vw]",
  label:
    "text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.25em] text-[#5C5C5C]",
  red: "text-[#B91C1C]",
  btn: "min-h-11 bg-[#111111] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white",
  rule: "border-t border-[#D6D3CE]",
  // Mọi section là 1 "trang in": tràn mép đứng, cắt ngang (không cuộn ngang).
  section:
    "relative flex min-h-[100svh] flex-col overflow-x-clip py-14 lg:py-20",
  surface: "bg-[#F3F1EE]",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C1C]",
} as const;
