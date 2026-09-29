// Tokens (docs/templates/dong-ho-2d.md §0, §2). Góc vuông ở mọi nơi.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#EFE1C6] font-(family-name:--font-body) text-[17px] leading-[1.65] text-[#2B1D12] lg:text-[19px]",
  // giấy dó: sợi giấy + lớp điệp óng
  paper:
    "bg-[#EFE1C6] bg-[repeating-linear-gradient(33deg,rgba(107,85,64,0.05)_0_1px,transparent_1px_7px),repeating-linear-gradient(-58deg,rgba(107,85,64,0.04)_0_1px,transparent_1px_11px)]",
  sheet:
    "relative bg-[#F7ECD6] bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%),repeating-linear-gradient(33deg,rgba(107,85,64,0.05)_0_1px,transparent_1px_7px)] ring-[3px] ring-[#2B1D12] shadow-[8px_10px_0_rgba(43,29,18,0.12)]",
  display: "font-(family-name:--font-display)",
  red: "text-[#B5382A]",
  green: "text-[#2F5D50]",
  soft: "text-[#6B5540]",
  band: "font-(family-name:--font-display) bg-[#B5382A] px-4 py-2 text-center text-[15px] font-bold tracking-[0.12em] text-[#F7ECD6] uppercase lg:text-[17px]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 bg-[#B5382A] px-6 font-(family-name:--font-display) text-[16px] font-bold tracking-[0.06em] text-[#F7ECD6] shadow-[4px_4px_0_#2B1D12] transition-transform duration-150 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F5D50] disabled:opacity-50",
} as const;
