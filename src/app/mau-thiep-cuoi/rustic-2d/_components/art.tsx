import type { ReactNode } from "react";
import { t } from "./tokens";

/** Bóng đèn sợi đốt: `data-bulb` để GSAP bật/tắt (quầng + thân). */
export function Bulb({ className = "" }: { className?: string }) {
  return (
    <span
      data-bulb
      className={`relative inline-flex flex-col items-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-1.5 rounded-t-sm bg-[#5B4632]"
      />
      <span
        aria-hidden="true"
        data-glow
        className="absolute top-2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(255,214,138,0.55),transparent_68%)]"
      />
      <span
        aria-hidden="true"
        data-glass
        className="relative h-7 w-5 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] bg-[#FFD68A] shadow-[0_0_18px_4px_rgba(255,214,138,0.55)] ring-1 ring-white/30"
      />
    </span>
  );
}

/** Dây đèn võng ngang với n bóng. */
export function BulbString({
  n = 7,
  className = "",
}: {
  n?: number;
  className?: string;
}) {
  return (
    <div className={`relative h-24 w-full ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-16 w-full"
      >
        <path
          data-wire
          d="M0 8 Q 500 90 1000 8"
          stroke="#1E1510"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <div className="absolute inset-x-[5%] top-0 flex justify-between">
        {Array.from({ length: n }, (_, i) => i).map((i) => (
          <Bulb key={i} className="origin-top" />
        ))}
      </div>
    </div>
  );
}

/** Bảng gỗ treo: dây chữ V lên sợi dây thừng, giấy kraft dán bên trong. */
export function Sign({
  children,
  className = "",
  paper = true,
}: {
  children: ReactNode;
  className?: string;
  paper?: boolean;
}) {
  return (
    <div data-hang className={`relative origin-[50%_-44px] pt-11 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        className="absolute inset-x-[18%] top-0 h-11 w-[64%]"
      >
        <path
          d="M0 44 L50 0 L100 44"
          stroke="#B89B72"
          strokeWidth="1.6"
          strokeDasharray="5 2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute top-9 left-[18%] size-2.5 -translate-x-1/2 rounded-full bg-[#5B4632] ring-2 ring-[#2A1E15]"
      />
      <span
        aria-hidden="true"
        className="absolute top-9 right-[18%] size-2.5 translate-x-1/2 rounded-full bg-[#5B4632] ring-2 ring-[#2A1E15]"
      />
      <div className={t.sign}>
        {paper ? (
          <div className={`${t.paper} px-5 py-7 sm:px-8`}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Kẹp gỗ phơi ảnh. */
export function Peg({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -top-4 left-1/2 z-10 h-8 w-3 -translate-x-1/2 rounded-sm bg-[linear-gradient(90deg,#B88B5E,#D9B283,#9C7247)] shadow-[0_2px_4px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
}

/** Cành bạch đàn nhỏ (hình học, trang trí). */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 40" className={className}>
      <path d="M4 20 H116" stroke="#8AA17C" strokeWidth="1.5" />
      {[16, 34, 52, 70, 88].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={i % 2 ? 28 : 12}
          rx="8"
          ry="5"
          fill="#8AA17C"
          opacity={0.7}
          transform={`rotate(${i % 2 ? 20 : -20} ${x} ${i % 2 ? 28 : 12})`}
        />
      ))}
    </svg>
  );
}
