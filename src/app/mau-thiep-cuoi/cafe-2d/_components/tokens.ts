// Tokens (docs/templates/cafe-2d.md §0, §2). Radius khoá 12px cho khối và nút.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#2B1D14] font-(family-name:--font-body) text-[16px] leading-[1.65] font-light text-[#F2EEE3] lg:text-[17px]",
  wood: "bg-[radial-gradient(ellipse_at_50%_0%,rgba(233,196,106,0.10),transparent_60%),repeating-linear-gradient(92deg,rgba(0,0,0,0.10)_0_2px,transparent_2px_9px)]",
  board:
    "relative rounded-xl border-[10px] border-[#5A3E2B] bg-[#1F2A24] shadow-[0_30px_60px_-30px_rgba(10,6,3,0.9),inset_0_0_60px_rgba(0,0,0,0.35)] bg-[radial-gradient(ellipse_at_25%_20%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(255,255,255,0.04),transparent_50%)]",
  chalk:
    "font-(family-name:--font-display) font-normal text-[#F2EEE3] [text-shadow:0_0_1px_rgba(242,238,227,0.55),0_0_8px_rgba(242,238,227,0.08)]",
  chalkY:
    "font-(family-name:--font-display) font-normal text-[#E9C46A] [text-shadow:0_0_1px_rgba(233,196,106,0.6),0_0_10px_rgba(233,196,106,0.12)]",
  latte:
    "rounded-xl bg-[#F5ECD9] text-[#2B1D14] shadow-[0_24px_40px_-24px_rgba(10,6,3,0.85)]",
  soft: "text-[#6A5646]",
  muted: "text-[#F2EEE3]/75",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C58B4E] px-6 font-medium text-[#2B1D14] shadow-[0_14px_30px_-14px_rgba(197,139,78,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9C46A] disabled:opacity-50 disabled:hover:translate-y-0",
  label: "text-[12px] font-medium tracking-[0.12em] uppercase lg:text-[13px]",
} as const;
