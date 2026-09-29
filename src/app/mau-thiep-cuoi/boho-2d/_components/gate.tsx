"use client";

import { OpenGate } from "@/kit/open-gate";
import { Pampas, Sun } from "./art";

export function Gate({
  groom,
  bride,
  onOpen,
}: {
  readonly groom: string;
  readonly bride: string;
  readonly onOpen: () => void;
}) {
  return (
    <OpenGate onOpen={onOpen} className="bg-[#F3E9DC] px-5 text-center">
      <div className="relative flex min-h-[74svh] w-[min(88vw,480px)] flex-col items-center justify-end overflow-hidden rounded-t-[999px] border-2 border-[#E8D8BF] bg-[#9C4F2C] px-7 pb-12 text-[#FFFAF3] shadow-[0_30px_80px_-35px_rgba(74,52,38,0.7)]">
        <span className="absolute inset-3 rounded-t-[999px] border border-[#E8D8BF]/65" />
        <Sun className="absolute top-[12%] size-28 text-[#C0673E] sm:size-40" />
        <Pampas className="absolute bottom-0 left-0 h-44 w-28 text-[#E8D8BF] opacity-90" />
        <Pampas className="absolute right-0 bottom-0 h-40 w-24 -scale-x-100 text-[#E8D8BF] opacity-80" />
        <div className="relative">
          <p className="font-(family-name:--font-boho-body) text-xs font-semibold tracking-[0.3em] uppercase">
            Thiệp thành hôn
          </p>
          <p className="mt-4 font-(family-name:--font-boho-display) text-balance text-[clamp(36px,10vw,58px)] leading-[1.1] break-words">
            {groom}
            <span className="block text-[0.62em]">&amp;</span>
            {bride}
          </p>
          <button
            type="button"
            aria-label="Mở thiệp mời và phát nhạc"
            className="mt-8 min-h-13 rounded-full bg-[#FFFAF3] px-8 font-(family-name:--font-boho-body) text-sm font-semibold tracking-[0.22em] text-[#9C4F2C] uppercase transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFAF3]"
          >
            Bước vào
          </button>
        </div>
      </div>
    </OpenGate>
  );
}
