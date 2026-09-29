// Tokens (docs/templates/marble-2d.md §0, §2). Vòm: rounded-t-full rounded-b-2xl; nút bo 2px.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#F7F5F2] font-(family-name:--font-body) text-[16px] leading-[1.8] tracking-[0.01em] text-[#2A2A2A] lg:text-[17px]",
  display: "font-(family-name:--font-display) font-normal",
  gold: "bg-[linear-gradient(110deg,#8A6A3B_0%,#B08D57_35%,#E4CFA0_50%,#B08D57_65%,#8A6A3B_100%)] bg-[length:250%_100%] bg-[position:100%_0] bg-clip-text text-transparent",
  deep: "text-[#8A6A3B]",
  soft: "text-[#6E6A64]",
  label:
    "text-[12px] font-semibold tracking-[0.28em] uppercase text-[#8A6A3B] lg:text-[13px]",
  arch: "rounded-t-full rounded-b-2xl",
  // viền vòm kép: ngoài 1px vàng, trong cách 6px vàng nhạt
  frame:
    "rounded-t-full rounded-b-2xl bg-white p-1.5 ring-1 ring-[#B08D57] shadow-[0_30px_60px_-30px_rgba(138,106,59,0.45)]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] bg-[#1F1F1F] px-8 text-[13px] font-semibold tracking-[0.25em] text-[#F7F5F2] uppercase transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B08D57] disabled:opacity-50",
} as const;
