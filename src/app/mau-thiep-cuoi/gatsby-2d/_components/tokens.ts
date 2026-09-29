// Design tokens Gatsby (spec §2): đen tuyền, vàng kim, champagne.
export const t = {
  root: "min-h-dvh bg-[#0C0C0C] font-(family-name:--font-body) text-[16px] leading-[1.7] text-[#F5E6B8] lg:text-[17px]",
  frame:
    "border border-[#D4AF37]/70 outline outline-1 outline-offset-[-6px] outline-[#D4AF37]/35 bg-[#161616]",
  title:
    "font-(family-name:--font-display) text-[24px] tracking-[0.14em] text-[#D4AF37] uppercase lg:text-[32px]",
  label:
    "text-[12px] font-semibold tracking-[0.24em] text-[#F5E6B8]/70 uppercase",
  name: "font-(family-name:--font-display) text-[40px] leading-[1.12] text-[#F5E6B8] break-words lg:text-[64px]",
  big: "font-(family-name:--font-display) text-[64px] leading-none text-[#D4AF37] lg:text-[96px]",
  soft: "text-[#F5E6B8]/70",
  btn: "inline-flex min-h-11 items-center justify-center rounded-none border border-[#D4AF37] bg-transparent px-8 tracking-[0.2em] text-[#D4AF37] uppercase transition-colors hover:bg-[#D4AF37] hover:text-[#0C0C0C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]",
  col: "mx-auto w-[min(92vw,560px)]",
} as const;
