import type { ReactNode } from "react";
import { t } from "./tokens";

/** Vân đá Carrara: feTurbulence dựng một lần, phủ cố định sau nội dung. */
export function Marble() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#F7F5F2]"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full opacity-45"
        preserveAspectRatio="none"
      >
        <filter id="marble-2d-vein">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.018"
            numOctaves={3}
            seed={7}
          />
          <feColorMatrix
            values="0 0 0 0 0.62
                    0 0 0 0 0.60
                    0 0 0 0 0.57
                    0 0 0 -2.2 1.35"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#marble-2d-vein)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.8),transparent_60%)]" />
    </div>
  );
}

/** Đường kẻ vàng mảnh, hai đầu hình thoi. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <span className="size-1.5 rotate-45 bg-[#B08D57]" />
      <span className="h-px w-24 bg-[#B08D57]" />
      <span className="size-1.5 rotate-45 bg-[#B08D57]" />
    </div>
  );
}

/** Ảnh trong vòm viền kép. */
export function ArchPhoto({
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
      className={`group block w-full ${t.frame} ${className}`}
    >
      <span
        className={`block overflow-hidden ${t.arch} ring-1 ring-[#B08D57]/50`}
      >
        {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full object-cover grayscale-[15%] transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${ratio}`}
        />
      </span>
    </button>
  );
}

export function Heading({
  label,
  title,
  className = "",
}: {
  label?: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div data-rise className={`text-center ${className}`}>
      {label && <p className={t.label}>{label}</p>}
      <h2
        className={`${t.display} mt-3 text-[34px] leading-tight sm:text-[46px]`}
      >
        {title}
      </h2>
      <Rule className="mt-5" />
    </div>
  );
}

export const initial = (name: string) =>
  name.trim().split(/\s+/).at(-1)?.[0]?.toUpperCase() ?? "";
