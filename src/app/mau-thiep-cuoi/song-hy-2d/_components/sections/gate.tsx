"use client";

import { OpenGate } from "@/kit/open-gate";
import { Cloud, DoorPanel, Medallion } from "../decor";

// C1 · Hai cánh cửa son đóng, bấm để mở thiệp và phát nhạc (spec §4 C1).
export function Gate({ onOpen }: { onOpen: () => void }) {
  return (
    <OpenGate onOpen={onOpen} className="bg-[#6B0F12] text-[#D4A24C]">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <DoorPanel className="absolute inset-y-0 left-0 w-1/2 border-r border-[#D4A24C]/40" />
        <DoorPanel className="absolute inset-y-0 right-0 w-1/2 border-l border-[#D4A24C]/40" />
        <Cloud className="absolute top-14 left-4 w-24 opacity-35" />
        <Cloud className="absolute right-4 bottom-20 w-28 opacity-35" />

        <div className="relative flex flex-col items-center px-6 text-center">
          <Medallion className="size-24 max-w-[40vw] text-[#D4A24C]" />
          <button
            type="button"
            className="mt-8 min-h-11 rounded-full border border-[#D4A24C] px-10 py-4 text-[15px] tracking-[0.25em] text-[#F1D08A] uppercase transition-colors hover:bg-[#D4A24C]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F1D08A]"
          >
            Mở thiệp
          </button>
          <p className="mt-4 text-[13px] text-[#F1D08A]/80">
            Chạm để mở thiệp và nghe nhạc
          </p>
        </div>
      </div>
    </OpenGate>
  );
}
