// Design tokens Comic (spec §2): giấy ngà, mực đen, đỏ pop-art, xanh comic.
export const t = {
  root: "min-h-dvh bg-[#FFF9E6] font-(family-name:--font-comic-body) text-[16px] leading-[1.6] text-[#111] lg:text-[17px]",
  panel:
    "rounded-md border-[3px] border-[#111] bg-white shadow-[8px_8px_0_#111]",
  title:
    "font-(family-name:--font-comic-display) text-[30px] tracking-[0.02em] text-[#E63946] uppercase lg:text-[40px]",
  label:
    "text-[12px] font-extrabold tracking-[0.18em] text-[#1D3557] uppercase",
  name: "font-(family-name:--font-comic-display) text-[46px] leading-[1.05] break-words uppercase lg:text-[76px]",
  big: "font-(family-name:--font-comic-display) text-[56px] leading-none text-[#E63946] lg:text-[88px]",
  soft: "text-[#41505F]",
  btn: "inline-flex min-h-11 items-center justify-center border-[3px] border-[#111] bg-[#E63946] px-7 font-extrabold tracking-[0.06em] text-white uppercase shadow-[4px_4px_0_#111] transition-[transform,box-shadow] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3557]",
  col: "mx-auto w-[min(92vw,560px)]",
  halftone:
    "bg-[radial-gradient(circle,rgba(17,17,17,0.16)_1.6px,transparent_1.7px)] [background-size:11px_11px]",
  bubble:
    "relative rounded-2xl border-[3px] border-[#111] bg-white px-5 py-4 shadow-[6px_6px_0_rgba(17,17,17,0.22)] after:absolute after:-bottom-[13px] after:left-10 after:size-5 after:rotate-45 after:border-r-[3px] after:border-b-[3px] after:border-[#111] after:bg-white",
} as const;
