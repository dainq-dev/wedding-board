"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

// Card C1 dùng chung: màn che phủ toàn màn hình + nút "Mở thiệp".
// onOpen được gọi ĐỒNG BỘ trong click handler — đó là gesture mở khoá audio
// (autoplay policy chỉ cho play() ngay trong lúc người dùng bấm).
export function OpenGate({
  onOpen,
  className = "",
  children,
}: {
  onOpen: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const gate = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [closed, setClosed] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !btn.current) return;
      // A12: nút lơ lửng nhẹ mời bấm.
      return gsap.to(btn.current, {
        y: -8,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: gate },
  );

  if (closed) return null;

  // Mẫu truyền bg- riêng thì bỏ nền đen mặc định (bg-black đứng sau trong CSS nên luôn thắng).
  const bg = /(^|\s)bg-/.test(className) ? "" : "bg-black";

  // z-40: nút "Quay lại"/"Dùng thử" của layout chung ở z-50 (spec §4.2).
  const open = () => {
    onOpen();
    if (reduced || !gate.current) {
      setClosed(true);
      return;
    }
    gsap.to(gate.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => setClosed(true),
    });
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: overlay full-screen nhận click ở mọi điểm; children có thể chứa element tương tác nên không bọc nổi bằng <button>
    <div
      ref={gate}
      onClick={open}
      role="button"
      tabIndex={-1}
      // Guard e.target: Enter trên nút con đã tự bubble thành click → khỏi mở 2 lần.
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === gate.current)
          open();
      }}
      className={`fixed inset-0 z-40 flex items-center justify-center ${bg} ${className}`}
    >
      {children ?? (
        <button
          ref={btn}
          type="button"
          // click nổi bọt lên gate → gọi open(), không gắn handler riêng kẻo chạy 2 lần.
          className="cursor-pointer rounded-full border border-[#d4af37]/70 bg-[#d4af37]/10 px-12 py-5 font-[inherit] text-[1.15rem] tracking-[0.25em] text-[#f5e6b8] uppercase"
        >
          Mở thiệp
        </button>
      )}
    </div>
  );
}
