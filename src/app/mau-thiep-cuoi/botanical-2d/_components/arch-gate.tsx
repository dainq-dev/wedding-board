"use client";

import { OpenGate } from "@/kit/open-gate";

export function ArchGate({
  names,
  cover,
  onOpen,
}: {
  names: readonly [string, string];
  cover: string | undefined;
  onOpen: () => void;
}) {
  return (
    <OpenGate onOpen={onOpen} className="bg-[#E4EBDC]/95 px-5 text-[#34402F]">
      <div className="relative w-[min(84vw,430px)] text-center">
        <span className="absolute -top-12 -left-5 h-18 w-12 rotate-[-35deg] rounded-[100%_0_100%_0] bg-[#5F7A5A]/60" />
        <span className="absolute -right-3 -bottom-10 h-22 w-14 rotate-[35deg] rounded-[100%_0_100%_0] bg-[#5F7A5A]/60" />
        <div className="relative overflow-hidden rounded-sm border border-[#C8D5B9] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(74,97,70,0.55)]">
          <div className="mx-auto w-[52%] overflow-hidden rounded-t-full border-[7px] border-white bg-[#C8D5B9]">
            {cover && <img src={cover} alt="" className="aspect-3/4 w-full object-cover opacity-85" />}
          </div>
          <p className="mt-5 font-(family-name:--font-script) text-[38px] leading-[0.92] break-words">{names[0]}</p>
          <p className="my-1 text-sm italic">và</p>
          <p className="font-(family-name:--font-script) text-[38px] leading-[0.92] break-words">{names[1]}</p>
          <p className="mt-7 text-[16px] italic text-[#6B7565]">Chạm để mở thiệp</p>
        </div>
      </div>
    </OpenGate>
  );
}
