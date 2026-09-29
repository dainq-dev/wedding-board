"use client";

import { useState } from "react";
import { OpenGate } from "@/kit/open-gate";

export function StripsGate({ initials, date, onOpen }: { initials: string; date: string; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    onOpen();
    setOpening(true);
  };
  return (
    <OpenGate onOpen={open} className="bg-white text-black">
      <div className="relative h-full w-full overflow-hidden px-4 py-20 lg:px-12">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={`border-l border-[#d9d9d9] bg-white transition-transform duration-700 motion-reduce:transition-none ${opening ? "-translate-y-full" : ""}`} style={{ transitionDelay: `${index * 45}ms` }} />
          ))}
        </div>
        <div className="relative z-10 flex h-full max-w-4xl flex-col justify-between">
          <p className="font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[0.2em] uppercase">Swiss Mono / 2026</p>
          <div>
            <p className="-ml-3 font-(family-name:--font-swiss-sans) text-[42vw] leading-[.72] font-black tracking-[-.08em] lg:text-[28vw]">01</p>
            <div className="mt-8 grid grid-cols-4 gap-4 lg:grid-cols-12 lg:gap-6">
              <h2 className="col-span-3 font-(family-name:--font-swiss-sans) text-3xl leading-[.92] font-extrabold tracking-[-.06em] uppercase lg:col-span-6 lg:text-6xl">Lời mời<br />cưới</h2>
              <span className="col-span-1 mt-auto size-4 bg-[#ff3b30]" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-end gap-4 lg:grid-cols-12 lg:gap-6">
            <p className="col-span-2 font-(family-name:--font-swiss-mono) text-sm tracking-[0.2em]">{initials}</p>
            <p className="col-span-2 font-(family-name:--font-swiss-mono) text-xs leading-relaxed lg:col-span-3">{date}</p>
            <button type="button" aria-label="Mở thiệp và phát nhạc" className="col-span-3 mt-8 min-h-14 bg-black px-5 text-left font-(family-name:--font-swiss-mono) text-sm font-bold tracking-[0.12em] text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30] lg:col-span-4">MỞ →</button>
          </div>
        </div>
      </div>
    </OpenGate>
  );
}
