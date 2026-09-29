import type { ReactNode } from "react";
import { GridLines } from "./grid-lines";

type Tone = "light" | "surface" | "dark" | "red";

const tones: Record<Tone, string> = {
  light: "bg-white text-black",
  surface: "bg-[#f2f2f2] text-black",
  dark: "bg-black text-white",
  red: "bg-[#ff3b30] text-black",
};

export function Panel({ number, title, tone = "light", children, className = "" }: { number: string; title: string; tone?: Tone; children: ReactNode; className?: string }) {
  const dark = tone === "dark";
  return (
    <section data-swiss-panel={number} className={`relative isolate overflow-hidden border-b border-black ${tones[tone]} ${className}`}>
      <GridLines dark={dark} />
      <div className="relative z-10 grid min-h-[100svh] grid-cols-4 gap-x-4 px-4 py-16 lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:py-24">
        <header className="col-span-full flex items-start gap-3 font-(family-name:--font-swiss-mono) text-[11px] font-bold tracking-[0.16em] uppercase lg:text-xs">
          <span className="text-[#d70015]">{number}</span><span className="h-px flex-1 bg-current opacity-30" /><span>/ {title}</span>
        </header>
        {children}
      </div>
    </section>
  );
}
