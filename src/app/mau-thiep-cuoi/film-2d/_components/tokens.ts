// Design tokens 2D-04 (spec §9.2): gán trên phần tử gốc của mẫu, radius 0, noir + gold.
export const t = {
  root: "min-h-screen bg-[#0D0D0D] text-[#E8E8E3] font-(family-name:--font-mono) text-sm leading-[1.7] lg:text-[15px]",
  display: "font-(family-name:--font-display) italic",
  displayBold:
    "font-(family-name:--font-display) font-bold uppercase tracking-[0.15em]",
  label:
    "text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#A3A39C] text-balance",
  scene:
    "text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#A3A39C] break-words",
  heading:
    "font-(family-name:--font-display) font-bold uppercase tracking-[0.15em] text-[20px] lg:text-[28px] text-[#F5F5F0]",
  btn: "min-h-11 inline-flex items-center justify-center bg-[#C9A227] px-6 uppercase tracking-[0.15em] text-[#0D0D0D] font-bold hover:bg-[#9C7C16]",
  frame: "bg-[#1A1A1A] border border-[#262626]",
  photo: "grayscale object-cover",
  gold: "text-[#C9A227]",
  soft: "text-[#A3A39C]",
} as const;
