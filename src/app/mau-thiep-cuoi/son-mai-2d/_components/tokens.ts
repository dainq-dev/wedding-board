// Tokens (docs/templates/son-mai-2d.md §0, §2). Radius khoá 4px (tấm tranh, nút), khung chỉ vàng hai lớp.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#120A07] font-(family-name:--font-body) text-[17px] leading-[1.75] text-[#F3E3C3] lg:text-[19px]",
  bg: "bg-[#120A07] bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,162,74,0.10),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgba(164,22,26,0.10),transparent_55%)]",
  display: "font-(family-name:--font-display)",
  gold: "bg-[linear-gradient(110deg,#8C6A24,#C9A24A_35%,#F1D48A_50%,#C9A24A_65%,#8C6A24)] bg-[length:250%_100%] bg-[position:100%_0] bg-clip-text text-transparent",
  soft: "text-[#BFA98A]",
  label:
    "font-(family-name:--font-display) text-[13px] font-medium tracking-[0.25em] uppercase text-[#C9A24A] lg:text-[14px]",
  panel:
    "relative rounded-[4px] bg-[#1F120C] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)] ring-1 ring-[#C9A24A] outline outline-1 outline-offset-4 outline-[#C9A24A]/40 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.95)]",
  // viền vỏ trứng khảm: mảnh vỡ hình học lặp
  eggshell:
    "bg-[conic-gradient(from_20deg_at_30%_40%,#E9DCC0_0_18%,transparent_18%_35%,#E9DCC0_35%_48%,transparent_48%_70%,#E9DCC0_70%_82%,transparent_82%)] bg-[length:14px_10px] opacity-60",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-[#C9A24A] px-7 font-(family-name:--font-display) text-[15px] font-medium tracking-[0.2em] text-[#120A07] uppercase shadow-[0_16px_30px_-16px_rgba(201,162,74,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F1D48A] disabled:opacity-50",
} as const;
