import { stars, village } from "./sky";

const STARS = stars(64);
const VILLAGE = village();

// Các nét xoáy: đường xoắn và sóng dày, nét đứt như vệt cọ (chảy chậm bằng strokeDashoffset).
const SWIRLS = [
  {
    d: "M-20 180 C 60 120, 140 240, 220 170 S 380 110, 460 190",
    c: "#2B4C8C",
    w: 16,
    o: 0.7,
  },
  {
    d: "M-20 240 C 80 200, 150 300, 250 240 S 390 200, 460 260",
    c: "#6FA3D9",
    w: 8,
    o: 0.45,
  },
  {
    d: "M150 330 C 120 290, 170 250, 210 270 C 250 290, 240 340, 200 350 C 170 358, 150 335, 168 318",
    c: "#6FA3D9",
    w: 10,
    o: 0.55,
  },
  {
    d: "M-20 400 C 90 360, 180 440, 290 390 S 420 360, 460 410",
    c: "#2B4C8C",
    w: 14,
    o: 0.6,
  },
  {
    d: "M300 120 C 280 90, 320 70, 345 88 C 368 105, 355 138, 330 140",
    c: "#6FA3D9",
    w: 8,
    o: 0.5,
  },
];

/** Bầu trời cố định phía sau nội dung: nét xoáy, sao nhấp nháy, trăng tiến độ, chân trời. */
export function Night() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_120%,#1B2F63_0%,#0E1A3A_55%,#081028_100%)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 440 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        {SWIRLS.map((s) => (
          <path
            key={s.d}
            data-swirl
            d={s.d}
            fill="none"
            stroke={s.c}
            strokeWidth={s.w}
            strokeLinecap="round"
            strokeDasharray="40 18"
            opacity={s.o * 0.75}
          />
        ))}
      </svg>
      {STARS.map((s) => (
        <span
          key={`${s.x}-${s.y}`}
          className={`absolute rounded-full ${s.big ? "bg-[radial-gradient(circle,#FFE59A_0%,rgba(255,229,154,0.35)_35%,transparent_70%)]" : "bg-[#F1F4FF] motion-safe:animate-pulse"}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.big ? 28 + s.r * 6 : s.r * 2,
            height: s.big ? 28 + s.r * 6 : s.r * 2,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
      {/* trăng lưỡi liềm: vị trí cập nhật theo tiến độ cuộn */}
      <div
        data-moon
        className="absolute size-20 -translate-1/2 sm:size-24"
        style={{ left: "12%", top: "16%" }}
      >
        <span className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,229,154,0.35),transparent_65%)]" />
        <Crescent id="moon-sky" />
      </div>
      {/* chân trời: làng + cây bách */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[16svh] w-full lg:h-[20svh]"
      >
        <path d={VILLAGE} fill="#081028" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 60 300"
        className="absolute bottom-0 left-[4%] h-[42svh] w-auto"
      >
        <path
          d="M30 0 C 36 40, 50 80, 46 130 C 58 170, 56 230, 50 300 L10 300 C 4 230, 2 170, 14 130 C 10 80, 24 40, 30 0 Z"
          fill="#050B1D"
        />
      </svg>
    </div>
  );
}

/** Trăng lưỡi liềm thật (khoét bằng mask) để nét xoáy phía sau vẫn lộ qua phần khuyết. */
export function Crescent({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className="absolute inset-0 size-full overflow-visible drop-shadow-[0_0_18px_rgba(246,201,69,0.65)]"
    >
      <mask id={id}>
        <rect width="100" height="100" fill="#fff" />
        <circle cx="78" cy="38" r="46" fill="#000" />
      </mask>
      <circle cx="50" cy="50" r="50" fill="#F6C945" mask={`url(#${id})`} />
    </svg>
  );
}
