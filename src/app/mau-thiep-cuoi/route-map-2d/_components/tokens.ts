// Tokens (docs/templates/route-map-2d.md §0, §2). Radius khoá 8px, bóng cứng lệch như nhãn dán.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#F3EAD7] font-(family-name:--font-body) text-[16px] leading-[1.65] text-[#2C2416] lg:text-[17px]",
  map: "bg-[#F3EAD7] bg-[radial-gradient(ellipse_at_15%_20%,rgba(139,94,40,0.10),transparent_35%),radial-gradient(ellipse_at_85%_70%,rgba(139,94,40,0.08),transparent_30%),linear-gradient(#E6D8BA_1px,transparent_1px),linear-gradient(90deg,#E6D8BA_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px]",
  display: "font-(family-name:--font-display)",
  navy: "text-[#1F4E79]",
  red: "text-[#C0392B]",
  soft: "text-[#6B5E48]",
  label:
    "text-[12px] font-semibold tracking-[0.2em] uppercase text-[#6B5E48] lg:text-[13px]",
  card: "rounded-lg border-2 border-[#1F4E79] bg-[#FBF6EA] shadow-[4px_4px_0_#1F4E79]",
  coord:
    "text-[12px] font-medium italic text-[#6B5E48] tabular-nums lg:text-[13px]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1F4E79] px-6 font-semibold text-white shadow-[3px_3px_0_#163A5A] transition-transform duration-200 hover:bg-[#163A5A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0392B] disabled:opacity-50",
} as const;
