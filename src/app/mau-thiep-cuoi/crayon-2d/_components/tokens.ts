// Tokens (docs/templates/crayon-2d.md §0, §2). Góc bo 24px, không border sạch: khung là nét sáp.
export const t = {
  root: "relative isolate min-h-screen overflow-x-clip bg-[#FFFDF8] font-(family-name:--font-body) text-[18px] leading-[1.5] text-[#333333] lg:text-[20px]",
  // giấy vẽ: vân giấy rất nhẹ
  paper:
    "bg-[#FFFDF8] bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:6px_6px]",
  display: "font-(family-name:--font-display) font-bold",
  pink: "text-[#C93A6B]",
  blue: "text-[#1F6FA8]",
  soft: "text-[#6B6B6B]",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C93A6B] px-6 font-(family-name:--font-display) text-[17px] font-semibold text-white shadow-[3px_4px_0_#333333] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-2 active:translate-y-[2px] active:shadow-[1px_2px_0_#333333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F6FA8] disabled:opacity-50",
} as const;
