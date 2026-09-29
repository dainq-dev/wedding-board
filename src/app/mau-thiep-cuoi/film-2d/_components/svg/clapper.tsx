// Clapperboard nhỏ đầu nhãn "CẢNH …" — hình học đơn giản, stroke theo currentColor.
export function Clapper({ className = "size-4 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="9" width="20" height="13" />
      <path d="M2 9 4 4l17 1.6L22 9Z" />
      <path d="M7.5 4.4 8.6 9M12.4 4.9 13.5 9M17.3 5.3 18.4 9" />
    </svg>
  );
}
