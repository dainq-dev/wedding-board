import type { ReactNode } from "react";

export function CloudFlourish({ className = "" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 180 58" aria-hidden="true" className={className} fill="none">
      <path d="M7 42c14 0 13-19 28-19 12 0 10 12 23 12 15 0 10-20 26-20 12 0 10 14 23 14 14 0 12-18 28-18 16 0 10 25 30 25 9 0 12-5 18-10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M23 47c12-7 19-7 32 0m37 1c12-7 20-7 32 0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function AoDaiMark() {
  return (
    <svg viewBox="0 0 160 210" aria-hidden="true" className="h-48 w-auto text-[#5B2A86] sm:h-56" fill="none">
      <path d="M62 28c6 15 3 28-7 41l-15 23 16 21-3 71c9 10 33 10 46 0l-3-71 16-21-15-23c-10-13-13-26-7-41-9 5-20 5-28 0Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="2" />
      <path d="M55 69c6 10 15 15 25 15s19-5 25-15M80 84v100M53 184c10 9 43 9 47 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M99 113c25 3 39 17 53 32-25-7-40-4-56 6" fill="currentColor" fillOpacity=".38" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function NonLaFrame({
  src,
  alt,
  children,
}: {
  readonly src?: string;
  readonly alt: string;
  readonly children?: ReactNode;
}) {
  return (
    <div className="relative mx-auto aspect-square w-36 shrink-0 overflow-hidden rounded-full border-[3px] border-[#B8925A] bg-[#EDE3F2] p-1 shadow-[0_18px_36px_-25px_rgba(67,32,106,.65)] sm:w-44">
      {src ? <img src={src} alt={alt} className="size-full rounded-full object-cover" /> : children}
      <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute inset-1 size-[calc(100%-0.5rem)] text-[#B8925A] opacity-40">
        {Array.from({ length: 12 }, (_, index) => (
          <line key={index} x1="50" y1="50" x2="50" y2="2" stroke="currentColor" strokeWidth=".65" transform={`rotate(${index * 30} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth=".6" />
      </svg>
    </div>
  );
}

export function Lotus({ className = "" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 48" aria-hidden="true" className={className}>
      <path d="M32 42C8 38 5 22 17 13c4 7 9 11 15 14-6-11-3-20 0-25 4 6 7 14 0 25 7-3 12-7 15-14 12 9 9 25-15 29Z" fill="currentColor" />
      <path d="M11 40c10 5 32 7 42 0" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
