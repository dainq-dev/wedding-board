// Tokens (docs/templates/rustic-2d.md §0, §2). Radius khoá: bảng gỗ 8px, giấy kraft 4px, nút 8px.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#3B2A1E] font-(family-name:--font-body) text-[17px] leading-[1.7] text-[#F4EAD9] lg:text-[18px]",
  // vách ván gỗ dọc + quầng đèn ấm phía trên
  wall: "bg-[#3B2A1E] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,214,138,0.16),transparent_55%),repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0_2px,transparent_2px_120px),repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_7px)]",
  sign: "relative rounded-lg bg-[#8A6440] bg-[repeating-linear-gradient(92deg,#8A6440_0_6px,#7C5937_6px_9px,#93704A_9px_15px)] p-3 shadow-[0_24px_40px_-18px_rgba(10,6,3,0.85),inset_0_1px_0_rgba(255,255,255,0.15)]",
  paper:
    "rounded-[4px] bg-[#F4EAD9] text-[#3B2A1E] shadow-[inset_0_0_30px_rgba(138,100,64,0.18)]",
  script: "font-(family-name:--font-script) font-normal leading-[1.05]",
  soft: "text-[#6E5A48]",
  label: "text-[13px] font-semibold tracking-[0.18em] uppercase lg:text-[14px]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#C89F65] px-6 font-semibold text-[#3B2A1E] shadow-[0_14px_28px_-14px_rgba(200,159,101,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD68A] disabled:opacity-50",
} as const;
