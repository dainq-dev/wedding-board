// Tokens (docs/templates/chat-2d.md §0, §2). Bong bóng bo 20px, thẻ 16px, nút pill.
export const t = {
  me: "bg-[#2F6BFF] text-white rounded-[1.25rem] rounded-br-md",
  her: "bg-[#D93A6A] text-white rounded-[1.25rem] rounded-bl-md",
  guest:
    "bg-white text-[#0F172A] ring-1 ring-[#DCE5F3] rounded-[1.25rem] rounded-br-md",
  bubble:
    "max-w-[78%] px-4 py-2.5 text-[15.5px] font-medium leading-[1.45] break-words",
  card: "w-[86%] overflow-hidden rounded-2xl bg-white ring-1 ring-[#DCE5F3] shadow-[0_10px_30px_-18px_rgba(47,107,255,0.35)]",
  meta: "text-[12px] font-medium text-[#556277]",
  btn: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-bold transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6BFF] disabled:opacity-40",
} as const;
