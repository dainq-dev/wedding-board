// Khung điện thoại dùng cho card, hero và "Xem nhanh".
export function PhoneFrame({
  children,
  size = "sm",
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "lg";
  className?: string;
}) {
  const frame =
    size === "lg"
      ? "rounded-[2.25rem] border-[10px] w-[min(78vw,300px)]"
      : "rounded-[1.5rem] border-[6px] w-full";
  return (
    <div
      className={`relative aspect-9/19 overflow-hidden border-[#1C2320] bg-[#1C2320] ${frame} ${className}`}
    >
      <div
        aria-hidden
        className="absolute top-1.5 left-1/2 z-10 h-[5%] w-1/3 max-h-5 -translate-x-1/2 rounded-full bg-[#1C2320]"
      />
      <div className="h-full w-full overflow-hidden rounded-[inherit] bg-white">
        {children}
      </div>
    </div>
  );
}
