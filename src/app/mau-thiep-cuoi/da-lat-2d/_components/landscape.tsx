import { ridge } from "./hills";

const LAYERS = [
  { seed: 11, base: 250, amp: 26, trees: 30, fill: "#B7C4B0", h: "h-[46svh]" },
  { seed: 23, base: 285, amp: 34, trees: 26, fill: "#8FA392", h: "h-[40svh]" },
  { seed: 37, base: 320, amp: 30, trees: 22, fill: "#4E6B5A", h: "h-[34svh]" },
  { seed: 51, base: 350, amp: 22, trees: 18, fill: "#2F4F3E", h: "h-[28svh]" },
] as const;

/** Nền cố định: trời sương, quầng nắng, 4 lớp đồi thông (xa → gần) và lớp sương phủ. */
export function Landscape() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#DDE4E0_0%,#E7ECE8_45%,#EEF1EC_100%)]" />
      <div
        data-sun
        className="absolute top-[18%] left-1/2 size-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,199,154,0.55),transparent_60%)] opacity-0"
      />
      {LAYERS.map((l, i) => (
        <svg
          key={l.seed}
          aria-hidden="true"
          data-hill={i}
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className={`absolute inset-x-0 bottom-0 w-full ${l.h}`}
        >
          <path d={ridge(l.seed, l.base, l.amp, l.trees)} fill={l.fill} />
        </svg>
      ))}
      <div
        data-fog
        className="absolute inset-0 bg-[linear-gradient(to_top,#F4F6F3_0%,rgba(244,246,243,0.85)_45%,rgba(244,246,243,0.35)_100%)]"
      />
      <div
        data-cloud
        className="absolute top-[30%] -left-[10%] h-40 w-[70%] rounded-full bg-white/70 blur-3xl"
      />
      <div
        data-cloud
        className="absolute top-[55%] -right-[10%] h-48 w-[65%] rounded-full bg-white/60 blur-3xl"
      />
    </div>
  );
}
