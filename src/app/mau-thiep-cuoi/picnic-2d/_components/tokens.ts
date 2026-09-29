// Design tokens Picnic (spec §2): kem ngà, đỏ carrot, cam đất. Root element, không :root.
export const t = {
  root: "min-h-screen bg-[#FFFDF7] font-(family-name:--font-body) text-[16px] leading-[1.7] text-[#2B2D42] lg:text-[17px]",
  card: "rounded-2xl bg-white p-6 shadow-[0_14px_36px_-16px_rgba(43,45,66,0.35)]",
  title:
    "font-(family-name:--font-display) text-[26px] text-[#D62828] lg:text-[34px]",
  label:
    "text-[12px] font-extrabold tracking-[0.18em] text-[#B3261E] uppercase",
  name: "font-(family-name:--font-display) text-[40px] leading-[1.15] break-words lg:text-[64px]",
  big: "font-(family-name:--font-display) text-[64px] leading-none text-[#D62828] lg:text-[104px]",
  soft: "text-[#5A5C6E]",
  btn: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#D62828] px-6 font-bold text-white transition-[filter,transform] motion-safe:duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D62828]",
  col: "mx-auto w-[min(92vw,560px)]",
  // Khăn caro đỏ trắng: hai lớp sọc kẻ trực giao qua nền kem hồng nhạt.
  checker:
    "bg-[#FFF1EE] bg-[repeating-linear-gradient(0deg,rgba(214,40,40,0.75)_0_3px,transparent_3px_58px),repeating-linear-gradient(90deg,rgba(214,40,40,0.75)_0_3px,transparent_3px_58px)]",
} as const;
