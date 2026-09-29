"use client";

import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { useScrollLock } from "@/kit/use-scroll-lock";

// <dialog> native: nằm top layer (che cả nút nổi chung), Esc + focus trap có sẵn.
function useModal(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useScrollLock(open);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return ref;
}

const DIALOG =
  "m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 opacity-0 transition-[opacity,display,overlay] transition-discrete duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop:bg-[#0B0B0C]/92 backdrop:backdrop-blur-md open:opacity-100 starting:open:opacity-0";
const ICON_BTN =
  "flex size-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white";

/** Xem ảnh lớn: vuốt / phím ← → / Esc, bộ đếm. `index` null = đóng. */
export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && images.length > 0;
  const ref = useModal(open);
  const startX = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => index !== null && onIndex((index + d + n) % n);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <dialog
      ref={ref}
      aria-label="Xem ảnh cưới"
      onClose={onClose}
      className={DIALOG}
    >
      {open && (
        <div
          className="relative flex h-full w-full touch-pan-y items-center justify-center px-3 py-20 select-none"
          onPointerDown={(e) => {
            startX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            startX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            key={images[index]}
            src={images[index]}
            alt={`Ảnh cưới ${index + 1} trên ${n}`}
            draggable={false}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] starting:scale-[0.98] starting:opacity-0 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className={`${ICON_BTN} absolute top-4 right-4`}
          >
            <XIcon className="size-5" />
          </button>
          <p className="absolute top-7 left-5 text-sm text-white/70 tabular-nums">
            {index + 1} / {n}
          </p>
          {n > 1 && (
            <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Ảnh trước"
                className={ICON_BTN}
              >
                <CaretLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Ảnh sau"
                className={ICON_BTN}
              >
                <CaretRightIcon className="size-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

/** Sheet toàn màn hình: mọi ảnh xếp masonry; chạm ảnh → `onPick(i)`. */
export function AlbumSheet({
  images,
  open,
  title = "Album cưới",
  onPick,
  onClose,
}: {
  images: string[];
  open: boolean;
  title?: string;
  onPick: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useModal(open);
  return (
    <dialog ref={ref} aria-label={title} onClose={onClose} className={DIALOG}>
      {open && (
        <div className="h-full overflow-y-auto overscroll-contain px-3 pt-20 pb-10 sm:px-8">
          <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-linear-to-b from-[#0B0B0C] to-transparent px-5 py-4">
            <p className="text-white">
              {title}
              <span className="ml-2 text-white/50 tabular-nums">
                {images.length} ảnh
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng album"
              className={ICON_BTN}
            >
              <XIcon className="size-5" />
            </button>
          </div>
          <div className="mx-auto max-w-6xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onPick(i)}
                className="group mb-3 block w-full overflow-hidden rounded-xl break-inside-avoid focus-visible:outline-2 focus-visible:outline-white sm:mb-4"
              >
                {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                <img
                  src={src}
                  alt={`Ảnh cưới ${i + 1}`}
                  loading="lazy"
                  className="w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
