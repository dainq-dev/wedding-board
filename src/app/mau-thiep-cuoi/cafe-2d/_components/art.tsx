// Đồ hoạ dựng tay bằng div + SVG hình học (không icon): băng keo, sóng, ly, phin.

/** Hai mảnh băng keo giấy ở 2 góc trên. */
export function Tape() {
  return (
    <>
      <span
        aria-hidden
        className="absolute -top-3 -left-4 z-10 h-7 w-20 -rotate-[14deg] bg-[#E9DDBF]/85 shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      />
      <span
        aria-hidden
        className="absolute -top-3 -right-4 z-10 h-7 w-20 rotate-[12deg] bg-[#E9DDBF]/85 shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      />
    </>
  );
}

/** Mép sóng; đặt trong khung rộng 200% để trượt ngang liền mạch. */
export function Wave({
  fill,
  className = "",
}: {
  fill: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`block h-full w-full ${className}`}
    >
      <path
        fill={fill}
        d="M0 30 C 100 5 200 55 300 30 S 500 5 600 30 S 800 55 900 30 S 1100 5 1200 30 V60 H0 Z"
      />
    </svg>
  );
}

/** Ly nhựa hình thang với 3 tầng (dưới → trên), đá và ống hút đỏ. */
export function Glass({
  layers,
  className = "",
  layerRef,
}: {
  layers: { color: string; h: number }[];
  className?: string;
  layerRef?: (i: number) => (el: HTMLDivElement | null) => void;
}) {
  let bottom = 0;
  return (
    <div aria-hidden className={`relative ${className}`}>
      {/* ống hút */}
      <span className="absolute -top-[14%] left-[58%] h-[70%] w-[5%] rotate-[10deg] rounded-full bg-[#D0402B]" />
      <div className="absolute inset-0 overflow-hidden bg-white/12 [clip-path:polygon(6%_0,94%_0,82%_100%,18%_100%)]">
        {layers.map((l, i) => {
          const el = (
            <div
              key={l.color}
              ref={layerRef?.(i)}
              className="absolute inset-x-0 origin-bottom"
              style={{
                bottom: `${bottom}%`,
                height: `${l.h}%`,
                backgroundColor: l.color,
              }}
            />
          );
          bottom += l.h;
          return el;
        })}
        {/* đá */}
        <span className="absolute top-[18%] left-[22%] size-[22%] rotate-12 rounded-md bg-white/25 ring-1 ring-white/30" />
        <span className="absolute top-[34%] left-[50%] size-[20%] -rotate-6 rounded-md bg-white/20 ring-1 ring-white/25" />
        {/* phản quang thành ly */}
        <span className="absolute inset-y-0 left-[14%] w-[6%] bg-white/15" />
      </div>
      <div className="absolute inset-0 [clip-path:polygon(6%_0,94%_0,82%_100%,18%_100%)] ring-2 ring-white/25 ring-inset" />
    </div>
  );
}

/** Phin nhôm + ly thuỷ tinh có giọt cà phê (màn mở). */
export function Phin() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 300"
      className="h-auto w-[min(56vw,230px)] drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
    >
      <defs>
        <linearGradient id="cafe-alu" x1="0" x2="1">
          <stop offset="0" stopColor="#8E8A84" />
          <stop offset="0.35" stopColor="#E6E2DA" />
          <stop offset="0.6" stopColor="#B8B3AA" />
          <stop offset="1" stopColor="#77736D" />
        </linearGradient>
        <linearGradient id="cafe-coffee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A3A22" />
          <stop offset="1" stopColor="#2E1B0F" />
        </linearGradient>
        <clipPath id="cafe-cup">
          <path d="M52 170 H148 L140 282 Q139 290 130 290 H70 Q61 290 60 282 Z" />
        </clipPath>
      </defs>
      {/* nắp phin */}
      <rect x="72" y="22" width="56" height="12" rx="6" fill="url(#cafe-alu)" />
      <rect x="95" y="12" width="10" height="12" rx="3" fill="url(#cafe-alu)" />
      {/* thân phin */}
      <path d="M68 36 H132 L126 104 H74 Z" fill="url(#cafe-alu)" />
      <path d="M78 44 H122" stroke="#6E6A64" strokeWidth="1.5" opacity="0.5" />
      {/* đĩa đế */}
      <ellipse cx="100" cy="108" rx="54" ry="8" fill="url(#cafe-alu)" />
      <rect x="92" y="112" width="16" height="8" rx="2" fill="#77736D" />
      {/* ly thuỷ tinh */}
      <g clipPath="url(#cafe-cup)">
        <rect
          x="40"
          y="170"
          width="120"
          height="130"
          fill="rgba(255,255,255,0.08)"
        />
        <rect
          className="cafe-level"
          x="40"
          y="236"
          width="120"
          height="70"
          fill="url(#cafe-coffee)"
        />
        <rect
          x="40"
          y="268"
          width="120"
          height="30"
          fill="#EADBC0"
          opacity="0.92"
        />
      </g>
      <path
        d="M52 170 H148 L140 282 Q139 290 130 290 H70 Q61 290 60 282 Z"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2"
      />
      <path
        d="M62 180 L70 280"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* giọt + gợn */}
      <ellipse
        className="cafe-drop"
        cx="100"
        cy="124"
        rx="3"
        ry="4.5"
        fill="#4A2E1A"
      />
      <ellipse
        className="cafe-ripple"
        cx="100"
        cy="238"
        rx="14"
        ry="3"
        fill="none"
        stroke="#C58B4E"
        strokeWidth="1.5"
        opacity="0"
      />
      {/* hơi nước */}
      <path
        className="cafe-steam"
        d="M86 160 C 80 148 92 140 86 128"
        stroke="rgba(242,238,227,0.35)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="cafe-steam"
        d="M114 160 C 120 148 108 140 114 128"
        stroke="rgba(242,238,227,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
