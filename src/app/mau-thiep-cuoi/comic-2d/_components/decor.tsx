// Ngôi sao pop-art: 12 cánh nhọn, dùng cho "POW!" và các điểm nhấn.
const STAR =
  "195,100 160,84 182,53 144,56 148,18 116,40 100,5 84,40 53,18 56,56 18,53 40,84 5,100 40,116 18,147 56,144 53,182 84,160 100,195 116,160 148,182 144,144 182,147 160,116";

export function Burst({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid place-items-center ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <polygon points={STAR} fill="#FFD60A" stroke="#111" strokeWidth="6" />
      </svg>
      <span className="relative font-(family-name:--font-comic-display) text-[22px] text-[#E63946] lg:text-[26px]">
        {children}
      </span>
    </span>
  );
}
