import { AoDaiMark, CloudFlourish } from "./art";

export function SilkGate({ names }: { readonly names: string }) {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#F5F0F7] px-8 text-center text-[#2E1A40]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#ffffff_0%,transparent_55%),repeating-linear-gradient(0deg,transparent_0_7px,rgba(91,42,134,.025)_8px_9px)]" />
      <CloudFlourish className="absolute top-20 left-1/2 w-48 -translate-x-1/2 text-[#C9A0DC]" />
      <div className="relative -mb-3 animate-[pulse_4s_ease-in-out_infinite] motion-reduce:animate-none"><AoDaiMark /></div>
      <p className="relative mt-7 max-w-md text-balance font-(family-name:--font-script) text-5xl leading-[1.1] text-[#5B2A86] sm:text-6xl">{names}</p>
      <p className="relative mt-5 text-sm italic text-[#6E5A80]">Thiệp báo hỷ</p>
      <span aria-hidden className="relative mt-4 h-px w-24 bg-[#B8925A]" />
      <button type="button" aria-label="Mở thiệp mời và phát nhạc" className="relative mt-12 min-h-13 rounded-full bg-[#5B2A86] px-9 py-4 text-sm tracking-[.18em] text-white shadow-[0_16px_32px_-16px_rgba(67,32,106,.75)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B2A86]">
        Mở thiệp
      </button>
      <p className="relative mt-5 text-xs tracking-[.16em] text-[#6E5A80] uppercase">Hương giang dẫn lối</p>
    </div>
  );
}
