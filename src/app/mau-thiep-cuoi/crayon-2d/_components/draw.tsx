import type { ReactNode } from "react";

/** Filter vân sáp dùng chung (đặt một lần trong trang). */
export function CrayonFilter() {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id="crayon-2d-wax">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={3}
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" />
      </filter>
    </svg>
  );
}

const WAX = { filter: "url(#crayon-2d-wax)" } as const;

/** Khung nguệch ngoạc: hình chữ nhật méo vẽ hai lần lệch nhau, bọc quanh nội dung. */
export function Scribble({
  children,
  color = "#FF6B9A",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-2 z-10 size-[calc(100%+1rem)] overflow-visible"
        style={WAX}
      >
        <path
          data-draw
          d="M6 3 C 35 1, 70 4, 95 2 C 98 30, 96 70, 98 97 C 65 99, 30 96, 3 98 C 1 70, 4 35, 2 5"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-draw
          d="M4 5 C 40 3, 66 6, 97 4 C 96 36, 99 66, 96 95 C 60 97, 34 99, 5 96 C 3 64, 1 38, 4 7"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </div>
  );
}

/** Gạch chân nguệch ngoạc dưới tiêu đề. */
export function Underline({
  color = "#4EA8DE",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={`h-4 w-44 ${className}`}
      style={WAX}
    >
      <path
        data-draw
        d="M3 10 C 40 4, 80 14, 120 8 S 180 6, 197 9"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Vòng tròn khoanh bằng sáp (không khép kín, như tay trẻ con). */
export function Circle({
  color = "#FF6B9A",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute ${className}`}
      style={WAX}
    >
      <path
        data-draw
        d="M52 6 C 82 6, 96 30, 94 52 C 92 80, 68 96, 46 94 C 20 92, 4 72, 6 48 C 8 24, 28 8, 58 10"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mặt trời có tia. */
export function Sun({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
      style={WAX}
    >
      {Array.from({ length: 10 }, (_, i) => i * 36).map((deg) => (
        <path
          data-draw
          key={deg}
          d="M60 10 L60 24"
          stroke="#FFB21A"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="26" fill="#FFD23F" />
      <path
        data-draw
        d="M60 34 C 76 34, 86 46, 86 60 C 86 76, 74 86, 60 86 C 44 86, 34 74, 34 60 C 34 46, 44 34, 62 35"
        fill="none"
        stroke="#FFB21A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M50 56 L50 58 M70 56 L70 58 M50 68 C 56 74, 64 74, 70 68"
        stroke="#333"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Ngôi nhà mái tam giác, cửa sổ, cửa ra vào. */
export function House({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 180"
      className={className}
      style={WAX}
    >
      <path d="M30 90 L100 30 L170 90 Z" fill="#FF6B9A" opacity="0.35" />
      <path
        data-draw
        d="M24 92 L100 26 L176 92"
        fill="none"
        stroke="#C93A6B"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="44"
        y="90"
        width="112"
        height="80"
        fill="#4EA8DE"
        opacity="0.25"
      />
      <path
        data-draw
        d="M44 92 L44 170 L156 170 L156 92"
        fill="none"
        stroke="#1F6FA8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-draw
        d="M88 170 L88 128 L112 128 L112 170"
        fill="none"
        stroke="#333"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        data-draw
        d="M60 108 L78 108 L78 124 L60 124 Z M122 108 L140 108 L140 124 L122 124 Z"
        fill="#FFD23F"
        stroke="#333"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        data-draw
        d="M100 58 C 94 50, 84 56, 92 64 L100 72 L108 64 C 116 56, 106 50, 100 58"
        fill="#FF6B9A"
        stroke="#C93A6B"
        strokeWidth="3"
      />
    </svg>
  );
}

/** Hai người que nắm tay (chú rể xanh, cô dâu hồng váy tam giác). */
export function StickCouple({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 180"
      className={className}
      style={WAX}
    >
      <circle
        data-draw
        cx="70"
        cy="40"
        r="18"
        fill="none"
        stroke="#333"
        strokeWidth="5"
      />
      <path
        data-draw
        d="M70 58 L70 112 M70 112 L54 160 M70 112 L86 160 M70 74 L44 96 M70 74 L110 92"
        fill="none"
        stroke="#1F6FA8"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle
        data-draw
        cx="150"
        cy="40"
        r="18"
        fill="none"
        stroke="#333"
        strokeWidth="5"
      />
      <path d="M150 64 L124 132 L176 132 Z" fill="#FF6B9A" opacity="0.4" />
      <path
        data-draw
        d="M150 58 L150 70 M150 64 L124 132 L176 132 L150 64 M140 132 L136 162 M160 132 L164 162 M150 76 L110 92 M150 76 L178 98"
        fill="none"
        stroke="#C93A6B"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-draw
        d="M110 70 C 106 62, 98 66, 104 72 L110 78 L116 72 C 122 66, 114 62, 110 70"
        fill="#FF6B9A"
        stroke="#C93A6B"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Băng keo vàng. */
export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 h-6 w-16 bg-[#FFD23F]/65 ${className}`}
    />
  );
}
