// Tokens (docs/templates/neon-2d.md §0, §2). Radius khoá 16px cho biển, nút pill.
// Chuỗi class viết tường minh để Tailwind quét được (không ghép động).
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#0A0612] font-(family-name:--font-body) text-[16px] leading-[1.65] text-[#F5F3FF] lg:text-[18px]",
  display: "font-(family-name:--font-display)",
  pink: "text-[#FFE3F3] [filter:drop-shadow(0_0_2px_#FF3CAC)_drop-shadow(0_0_8px_#FF3CAC)_drop-shadow(0_0_22px_#FF3CAC)]",
  cyan: "text-[#E2FAFF] [filter:drop-shadow(0_0_2px_#2BD2FF)_drop-shadow(0_0_8px_#2BD2FF)_drop-shadow(0_0_22px_#2BD2FF)]",
  amber:
    "text-[#FFF1D6] [filter:drop-shadow(0_0_2px_#FFB547)_drop-shadow(0_0_8px_#FFB547)_drop-shadow(0_0_22px_#FFB547)]",
  soft: "text-[#B8B0D6]",
  label: "text-[12px] font-medium tracking-[0.14em] uppercase lg:text-[13px]",
  sign: "relative rounded-2xl bg-[#140D24]/80 p-6 backdrop-blur-md sm:p-8",
  tubeCyan:
    "ring-2 ring-[#2BD2FF] shadow-[0_0_14px_#2BD2FF,inset_0_0_14px_rgba(43,210,255,0.55)]",
  tubePink:
    "ring-2 ring-[#FF3CAC] shadow-[0_0_14px_#FF3CAC,inset_0_0_14px_rgba(255,60,172,0.55)]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FF3CAC] px-6 font-(family-name:--font-display) text-[14px] font-medium tracking-[0.08em] text-[#0A0612] uppercase shadow-[0_0_24px_rgba(255,60,172,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2BD2FF] disabled:opacity-40",
} as const;
