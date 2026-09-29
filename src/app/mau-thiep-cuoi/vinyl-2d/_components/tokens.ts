// Design tokens Vinyl 70s (spec §2): kem cháy, cam đất, nâu.
export const t = {
  root: "min-h-dvh bg-[#F2E3C6] font-(family-name:--font-body) text-[16px] leading-[1.7] text-[#3E2723] lg:text-[17px]",
  sleeve:
    "rounded-lg border-2 border-[#3E2723] bg-[#FFF4DC] shadow-[6px_6px_0_rgba(62,39,35,0.25)]",
  title:
    "font-(family-name:--font-display) text-[26px] font-black text-[#D35400] uppercase tracking-[0.02em] lg:text-[34px]",
  label: "text-[12px] font-bold tracking-[0.22em] text-[#6D4C41] uppercase",
  name: "font-(family-name:--font-display) text-[40px] leading-[1.05] font-black break-words lg:text-[64px]",
  big: "font-(family-name:--font-display) text-[64px] leading-none font-black text-[#D35400] lg:text-[96px]",
  soft: "text-[#6D4C41]",
  btn: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#D35400] px-7 font-bold text-[#FFF4DC] transition-[filter,transform] hover:brightness-95 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D35400]",
  col: "mx-auto w-[min(92vw,560px)]",
} as const;

// Đĩa than: rãnh tròn đồng tâm bằng repeating-radial-gradient; `playing` quyết định quay.
export const DISC =
  "rounded-full bg-[repeating-radial-gradient(circle_at_center,#1D130F_0_3px,#33241D_3px_6px)]";
export const DISC_LABEL =
  "absolute inset-1/3 rounded-full bg-[#D35400] ring-2 ring-[#3E2723]";
