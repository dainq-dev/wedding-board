// Hoạ tiết tự vẽ bằng SVG/Tailwind shape (spec §2): washi, lò xo, ghim, sticker…

export function Washi({
  className = "",
  color = "#E07A5F",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 0 L96 0 L92 6 L96 12 L92 18 L96 24 L4 24 L8 18 L4 12 L8 6 Z"
        fill={color}
        opacity="0.72"
      />
    </svg>
  );
}

export function SpiralSpine({ className = "" }: { className?: string }) {
  let d = "";
  for (let y = 6; y <= 378; y += 20)
    d += `M1 ${y} C14 ${y + 4}, 14 ${y + 16}, 1 ${y + 20} `;
  return (
    <svg
      viewBox="0 0 16 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={d}
        fill="none"
        stroke="#3D405B"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RedPushpin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" aria-hidden="true" className={className}>
      <path d="M12 14 L12 25" stroke="#6B6E86" strokeWidth="2.5" />
      <circle cx="12" cy="9" r="6.5" fill="#E07A5F" />
      <circle cx="10" cy="7" r="1.8" fill="#F4EFE6" opacity="0.6" />
    </svg>
  );
}

export function BinderClip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden="true" className={className}>
      <path d="M4 12 L12 1 L20 12 L20 22 L4 22 Z" fill="#3D405B" />
      <path
        d="M8 22 L8 28 M16 22 L16 28"
        stroke="#3D405B"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 20.5C6.6 16.9 3 13.5 3 10.1 3 7.2 5.2 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.8 0 5 2.2 5 5.1 0 3.4-3.6 6.8-9 10.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <polygon
        points="12 2 15 9 22 9.5 16.8 14 18.6 21.5 12 17.6 5.4 21.5 7.2 14 2 9.5 9 9"
        fill="currentColor"
      />
    </svg>
  );
}

export function Smile({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8.5 10h0.01 M15.5 10h0.01"
        stroke="#F4EFE6"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M7.8 13.6c1.2 1.8 2.7 2.7 4.2 2.7s3-.9 4.2-2.7"
        stroke="#F4EFE6"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Gạch chân vẽ tay — class pathClass để DrawSVG target vào path.
export function Underline({
  className = "",
  pathClass = "",
}: {
  className?: string;
  pathClass?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        className={pathClass}
        d="M3 8C25 3 45 11 70 6 95 1 120 10 157 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PenMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 16" aria-hidden="true" className={className}>
      <rect x="0" y="4" width="12" height="8" rx="2" fill="#81B29A" />
      <rect x="12" y="4" width="86" height="8" rx="3" fill="#3D405B" />
      <path d="M98 4 L114 8 L98 12 Z" fill="#E07A5F" />
    </svg>
  );
}

export function ClipMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true" className={className}>
      <path
        d="M12 8 V46 a7 7 0 0 0 14 0 V12 a4.5 4.5 0 0 1 9 0 v36"
        fill="none"
        stroke="#3D405B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TornTop({ className = "" }: { className?: string }) {
  let d = "M0 12 L0 4";
  for (let x = 8; x <= 200; x += 8) d += ` L${x} ${x % 16 === 8 ? 10 : 3}`;
  d += " L200 12 Z";
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path d={d} fill="#FFFFFF" />
    </svg>
  );
}

// Vân sợi giấy kraft phủ toàn trang (opacity rất thấp, không chặn tương tác).
export function PaperGrain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-[0.04] mix-blend-multiply"
    >
      <filter id="polaroid-2d-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#polaroid-2d-grain)" />
    </svg>
  );
}
