// Hoa văn Song Hỷ tự vẽ (spec §2 "Hình khối và chất liệu"): ấn tròn kim,
// mây lành, triện góc, cánh cửa. Chữ Hỷ không dùng font nên cách điệu bằng SVG.

export function Medallion({ className = "" }: { className?: string }) {
  const barsY = [12, 22, 32];
  const barsX = [16, 24, 32];
  const boxes = [
    [18, 14],
    [26, 14],
    [18, 30],
    [26, 30],
  ] as const;

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />
      {barsY.map((y) => (
        <rect
          key={`y${y}`}
          x="11"
          y={y}
          width="26"
          height="1.6"
          fill="currentColor"
          opacity="0.9"
        />
      ))}
      {barsX.map((x) => (
        <rect
          key={`x${x}`}
          x={x - 0.8}
          y="9"
          width="1.6"
          height="30"
          fill="currentColor"
          opacity="0.9"
        />
      ))}
      {boxes.map(([x, y]) => (
        <rect
          key={`b${x}-${y}`}
          x={x}
          y={y}
          width="4"
          height="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" aria-hidden="true" className={className}>
      <path
        d="M9 25c-4 0-7-3-7-7s4-7 7-6c1-5 6-8 11-7 3-5 10-6 14-2 4-3 11-1 12 4 5-1 9 4 9 8 0 6-4 10-10 10H9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M20 25c0-4 3-8 8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
      />
    </svg>
  );
}

export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path
        d="M2 14V2h12M6 18V6h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10 10c4 0 7 3 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}

export function DoorPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`relative bg-[#9B1B1E] ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-3 border border-[#D4A24C]/45"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#D4A24C]/45"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A24C]"
      />
    </div>
  );
}
