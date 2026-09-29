import { type ReactNode, useId } from "react";
import { t } from "./tokens";

export type Side = "left" | "right" | "center";
const X: Record<Side, number> = { left: 22, right: 78, center: 50 };

/** Chặng đường nét đứt từ điểm dừng này tới điểm dừng sau; được "vẽ" qua mask (DrawSVG trên path liền). */
export function Leg({ from, to }: { from: Side; to: Side }) {
  const id = useId();
  const a = X[from];
  const b = X[to];
  const d = `M${a} 0 C ${a} 70, ${b} 50, ${b} 120`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 120"
      preserveAspectRatio="none"
      className="block h-40 w-full sm:h-48"
    >
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="100"
        height="120"
      >
        <path
          data-leg
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth="8"
          vectorEffect="non-scaling-stroke"
        />
      </mask>
      <path
        d={d}
        mask={`url(#${id})`}
        fill="none"
        stroke="#1F4E79"
        strokeWidth="3"
        strokeDasharray="10 8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Điểm dừng: chấm navy trên đường, card đặt phía đối diện khúc cua. */
export function Stop({
  n,
  side,
  next,
  title,
  coord,
  children,
}: {
  n: number;
  side: Side;
  next?: Side;
  title: string;
  coord: string;
  children: ReactNode;
}) {
  const place =
    side === "left"
      ? "mx-4 mt-8 sm:mt-0 sm:ml-[34%] sm:mr-[8%]"
      : side === "right"
        ? "mx-4 mt-8 sm:mt-0 sm:mr-[34%] sm:ml-[8%]"
        : "mx-auto mt-8 w-[min(92%,34rem)]";
  return (
    <li className="relative">
      <span
        data-dot
        aria-hidden="true"
        className="absolute top-0 z-10 size-4 -translate-x-1/2 rounded-full bg-[#1F4E79] ring-4 ring-[#F3EAD7]"
        style={{ left: `${X[side]}%` }}
      />
      <div
        data-stop={side}
        className={`${t.card} relative p-5 sm:p-6 ${place}`}
      >
        <p className={t.label}>Điểm {String(n).padStart(2, "0")}</p>
        <h2
          className={`${t.display} ${t.navy} mt-1 text-[24px] leading-tight font-bold sm:text-[30px]`}
        >
          {title}
        </h2>
        <p className={`${t.coord} mt-1`}>{coord}</p>
        <div className="mt-4">{children}</div>
      </div>
      {next && <Leg from={side} to={next} />}
    </li>
  );
}

/** Khung tem thư cho ảnh: viền giấy + đường răng cưa nét đứt. */
export function Stamp({
  src,
  alt,
  onClick,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  ratio?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Xem lớn ảnh ${alt}`}
      className={`group block bg-[#FBF6EA] p-2 shadow-[0_10px_18px_-10px_rgba(44,36,22,0.5)] outline-2 outline-offset-[-6px] outline-dashed outline-[#E6D8BA] ${className}`}
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${ratio}`}
      />
    </button>
  );
}

/** Hoa gió: hình học bằng gradient, không vẽ tay. */
export function CompassRose({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <span className="absolute inset-0 rounded-full ring-2 ring-[#1F4E79]/70" />
      <span className="absolute inset-[12%] rounded-full ring-1 ring-[#1F4E79]/40" />
      <span className="absolute inset-[6%] [clip-path:polygon(50%_0,56%_44%,100%_50%,56%_56%,50%_100%,44%_56%,0_50%,44%_44%)] bg-[#1F4E79]" />
      <span className="absolute inset-[22%] rotate-45 [clip-path:polygon(50%_0,56%_44%,100%_50%,56%_56%,50%_100%,44%_56%,0_50%,44%_44%)] bg-[#9CB8C9]" />
      <span className="absolute inset-[44%] rounded-full bg-[#C0392B]" />
      <span
        className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[13px] font-bold ${t.red}`}
      >
        B
      </span>
    </div>
  );
}
