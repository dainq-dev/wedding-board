"use client";

import { useEffect } from "react";

export function PhotoLightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: readonly string[];
  index: number | null;
  onClose: () => void;
  onStep: (direction: -1 | 1) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onStep(-1);
      if (event.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onStep]);

  if (index === null || !images[index]) return null;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc đã xử lý qua keydown; click chỉ cho vùng nền
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh cưới"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#F7F6F1]/95 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onStep(-1);
        }}
        aria-label="Ảnh trước"
        className="absolute left-3 min-h-11 rounded-full bg-[#5F7A5A] px-4 text-white"
      >
        ←
      </button>
      {/* biome-ignore lint/performance/noImgElement: wedding media may be a blob URL from Dùng thử */}
      <img
        src={images[index]}
        alt={`Ảnh cưới ${index + 1}`}
        className="max-h-[82svh] max-w-[78vw] rounded-t-full object-contain shadow-[0_24px_60px_-30px_rgba(74,97,70,0.55)]"
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onStep(1);
        }}
        aria-label="Ảnh sau"
        className="absolute right-3 min-h-11 rounded-full bg-[#5F7A5A] px-4 text-white"
      >
        →
      </button>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-20 right-4 min-h-11 rounded-full border border-[#5F7A5A] bg-white px-4 text-sm text-[#34402F]"
      >
        Đóng
      </button>
    </div>
  );
}
