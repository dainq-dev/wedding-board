// Tokens (docs/templates/da-lat-2d.md §0, §2). Radius khoá 16px (card kính, ảnh), nút pill.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#E7ECE8] font-(family-name:--font-body) text-[16px] leading-[1.75] text-[#1F2D25] lg:text-[17px]",
  display: "font-(family-name:--font-display) font-light",
  soft: "text-[#55665B]",
  label:
    "text-[12px] font-semibold tracking-[0.3em] uppercase text-[#55665B] lg:text-[13px]",
  glass:
    "rounded-2xl border border-white/60 bg-white/90 shadow-[0_20px_60px_-20px_rgba(31,45,37,0.35)] supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur-md",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2F4F3E] px-7 text-[15px] font-semibold text-white shadow-[0_16px_30px_-16px_rgba(47,79,62,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F4F3E] disabled:opacity-50",
} as const;
