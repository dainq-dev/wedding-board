// Design tokens Song Hỷ (spec §2): đỏ son, kem, vàng kim. Không dùng :root.
export const t = {
  root: "min-h-screen bg-[#9B1B1E] font-(family-name:--font-body) text-[16px] leading-[1.7] text-[#4A1A0C] lg:text-[18px]",
  card: "rounded-lg border-2 border-[#D4A24C] bg-[#FFF4E0] outline outline-1 outline-offset-[-8px] outline-[#D4A24C]/60",
  shade: "rounded-lg border border-[#D4A24C]/70 bg-[#F7E6C4]",
  title:
    "font-(family-name:--font-display) text-[22px] font-bold uppercase tracking-[0.12em] text-[#9B1B1E] lg:text-[30px]",
  label:
    "font-(family-name:--font-body) text-[12px] font-medium uppercase tracking-[0.2em] text-[#7A4A34] lg:text-[13px]",
  name: "font-(family-name:--font-display) text-[36px] font-semibold leading-[1.15] text-[#4A1A0C] lg:text-[60px]",
  big: "font-(family-name:--font-display) text-[72px] font-normal leading-none text-[#9B1B1E] lg:text-[112px]",
  soft: "text-[#7A4A34]",
  gold: "text-[#F1D08A]",
  btn: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#9B1B1E] px-6 text-[#FFF4E0] transition-[filter,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1D08A]",
  col: "mx-auto w-[min(90vw,560px)]",
} as const;
