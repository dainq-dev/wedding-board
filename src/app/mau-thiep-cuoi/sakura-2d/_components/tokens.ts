// Design tokens sakura-2d (spec §2) — arbitrary-value Tailwind trên phần tử gốc, không :root.
export const t = {
  root: "min-h-screen bg-[#FFF7F8] text-[#5B3A44] font-(family-name:--font-serif) text-[17px] leading-[1.7] lg:text-[19px]",
  script: "font-(family-name:--font-script)",
  heading:
    "font-(family-name:--font-serif) font-medium uppercase tracking-[0.3em] text-[13px] lg:text-sm",
  soft: "text-[#8C6B74]",
  caption: "italic text-[14px] lg:text-[15px]",
  card: "rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(91,58,68,0.25)]",
  softCard: "rounded-2xl bg-[#FBE3E8]",
  btn: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B4475F] px-6 text-white transition-[filter,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4475F]",
  arch: "rounded-t-full object-cover",
  // Cột nội dung: lệch phải trên mobile (chừa 40px cho cành trái), giữa trên desktop.
  col: "ml-10 lg:mx-auto w-[min(88vw,520px)] max-w-[calc(100vw-2.75rem)] lg:max-w-[520px]",
  big: "font-(family-name:--font-serif) italic leading-none",
} as const;
