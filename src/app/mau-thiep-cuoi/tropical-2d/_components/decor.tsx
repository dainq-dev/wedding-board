// Bộ hình nhiệt đới tự vẽ: palm, sóng biển 2 nhịp, mặt trời hoàng hôn.

export function Palm({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M32 60c-1-10 0-20 0-30"
        fill="none"
        stroke="#1F7F74"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g fill="#1F7F74">
        <path d="M32 30C22 18 8 18 2 26c12-2 22 2 30 10z" opacity="0.95" />
        <path d="M32 30c10-12 24-12 30-4-12-2-22 2-30 10z" opacity="0.95" />
        <path d="M32 30C26 14 14 8 4 10c10 6 16 12 24 24z" opacity="0.8" />
        <path d="M32 30c6-16 18-22 28-20-10 6-16 12-24 24z" opacity="0.8" />
      </g>
    </svg>
  );
}

// Dải sóng dài gấp đôi khung nhìn để ghép `xPercent -50` chạy vô hạn liền mạch.
export function WaveBand({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2400 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 60c150-40 300-40 450 0s300 40 450 0 300-40 450 0 300 40 450 0 300-40 450 0 150 40 150 40v20H0z"
        fill="#2BB3A3"
        opacity="0.8"
      />
      <path
        d="M0 85c150-32 300-32 450 0s300 32 450 0 300-32 450 0 300 32 450 0 300-32 450 0 150 32 150 32v35H0z"
        fill="#1F7F74"
      />
    </svg>
  );
}

export function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle cx="60" cy="60" r="34" fill="#FFB45E" />
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke="#FFB45E"
        strokeOpacity="0.4"
        strokeWidth="3"
      />
    </svg>
  );
}
