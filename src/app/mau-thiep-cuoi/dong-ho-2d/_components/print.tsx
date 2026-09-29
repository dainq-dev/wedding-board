import type { ReactNode } from "react";
import { t } from "./tokens";

/** Hoạ tiết hạt thóc / hoa thị in 3 màu lệch bản (hình học, không minh hoạ). */
export function Motif({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center gap-2 ${className}`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="relative size-4 rotate-45">
          <span
            data-layer="yellow"
            className="absolute inset-0 translate-x-[2px] translate-y-[2px] bg-[#D9A628]"
          />
          <span
            data-layer={i % 2 ? "green" : "red"}
            className={`absolute inset-[3px] ${i % 2 ? "bg-[#2F5D50]" : "bg-[#B5382A]"}`}
          />
          <span
            data-layer="ink"
            className="absolute inset-0 ring-2 ring-[#2B1D12]"
          />
        </span>
      ))}
    </div>
  );
}

/** Cột câu đối dọc: mỗi từ một dòng (không dùng writing-mode để dấu tiếng Việt đứng đẹp). */
export function Couplet({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      aria-hidden="true"
      className={`${t.display} flex flex-col items-center gap-1 text-[20px] leading-tight font-bold ${t.red} ${className}`}
    >
      {text.split(" ").map((w, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: câu cố định, từ có thể lặp
        <span key={i}>{w}</span>
      ))}
    </p>
  );
}

/**
 * Tờ tranh in: khung đen, viền đỏ trong, mảng vàng / xanh lệch bản.
 * `data-sheet` để GSAP chạy "ép bản khắc"; `data-block` là bản gỗ hạ xuống / nhấc lên.
 */
export function Sheet({
  children,
  className = "",
  tone = "red",
}: {
  children: ReactNode;
  className?: string;
  tone?: "red" | "green";
}) {
  return (
    <article
      data-sheet
      className={`${t.sheet} overflow-hidden p-3 ${className}`}
    >
      <span
        data-layer="yellow"
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-3 translate-x-[2px] bg-[#D9A628]"
      />
      <span
        data-layer="yellow"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3 -translate-x-[2px] bg-[#D9A628]"
      />
      <span
        data-layer={tone}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-3 ring-[6px] ${tone === "red" ? "ring-[#B5382A]" : "ring-[#2F5D50]"}`}
      />
      <div data-layer="ink" className="relative px-5 py-8 sm:px-8">
        {children}
      </div>
      <span
        data-block
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 -translate-y-full bg-[#2B1D12]"
      />
    </article>
  );
}

/** Ảnh trong khung tranh: viền đen 3px, lớp giấy multiply để ảnh hoà vào giấy dó. */
export function Plate({
  src,
  alt,
  onClick,
  ratio = "aspect-[3/4]",
  className = "",
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  ratio?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`group relative block w-full overflow-hidden ring-[3px] ring-[#2B1D12] ${className}`}
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${ratio}`}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[#F7ECD6]/25 mix-blend-multiply"
      />
    </button>
  );
}
