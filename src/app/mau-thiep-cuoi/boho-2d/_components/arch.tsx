"use client";

import type { ReactNode } from "react";

export function Arch({
  children,
  className = "",
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      data-boho-reveal
      className={`relative overflow-hidden rounded-t-[999px] border-2 border-[#E8D8BF] bg-[#FFFAF3] shadow-[0_24px_60px_-38px_rgba(74,52,38,0.65)] ${className}`}
    >
      <span className="pointer-events-none absolute inset-2 rounded-t-[999px] border border-[#E8D8BF]/70" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function ArchImage({
  src,
  alt,
  className = "",
}: {
  readonly src?: string;
  readonly alt: string;
  readonly className?: string;
}) {
  if (!src) return null;
  return (
    // biome-ignore lint/performance/noImgElement: wedding images may be blob URLs from the trial form
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`aspect-3/4 w-full rounded-t-[999px] object-cover ${className}`}
    />
  );
}
