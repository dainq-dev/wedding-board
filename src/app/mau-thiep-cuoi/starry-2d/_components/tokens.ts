// Tokens (docs/templates/starry-2d.md §0, §2). Radius khoá 16px, ảnh tròn cho "sao-ảnh", nút pill.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#0E1A3A] font-(family-name:--font-body) text-[17px] leading-[1.7] text-[#F1F4FF] lg:text-[18px]",
  display: "font-(family-name:--font-display) font-medium italic",
  moon: "text-[#F6C945] [text-shadow:0_0_18px_rgba(246,201,69,0.35)]",
  soft: "text-[#AEB8D6]",
  label:
    "text-[12px] font-semibold tracking-[0.25em] uppercase text-[#6FA3D9] lg:text-[13px]",
  glass:
    "rounded-2xl border border-[#6FA3D9]/25 bg-[#15254F]/80 backdrop-blur-sm",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F6C945] px-6 font-semibold text-[#0E1A3A] shadow-[0_0_30px_rgba(246,201,69,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE59A] disabled:opacity-50",
} as const;
