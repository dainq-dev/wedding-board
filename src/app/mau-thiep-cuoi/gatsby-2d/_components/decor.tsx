// Hoa văn Art Deco tự vẽ: quạt đối xứng, gờ góc, mặt trời nan quạt.

export function Fan({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 7 }, (_, i) => -75 + i * 25);
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true" className={className}>
      {rays.map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="66"
          x2="60"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          transform={`rotate(${deg} 60 66)`}
        />
      ))}
      <path
        d="M8 66a52 52 0 0 1 104 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

export function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path d="M4 36V4h32" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 30V10h20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}
