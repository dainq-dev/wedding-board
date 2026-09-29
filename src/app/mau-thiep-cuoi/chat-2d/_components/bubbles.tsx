import { HeartIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { t } from "./tokens";

export function Avatar({ src, name }: { src?: string; name: string }) {
  return src ? (
    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
    <img
      src={src}
      alt=""
      className="size-7 shrink-0 rounded-full object-cover ring-2 ring-white"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D93A6A] text-[11px] font-bold text-white"
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function Typing({ side }: { side: "left" | "right" }) {
  return (
    <span
      data-typing
      aria-hidden="true"
      className={`absolute bottom-0 flex h-9 items-center gap-1 rounded-[1.25rem] bg-white px-4 opacity-0 ring-1 ring-[#DCE5F3] ${side === "left" ? "left-9" : "right-0"}`}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} data-dot className="size-1.5 rounded-full bg-[#94A3B8]" />
      ))}
    </span>
  );
}

/** Một dòng tin: bên trái có avatar cô dâu, bên phải là "mình" (chú rể). */
export function Row({
  side,
  avatar,
  typing,
  children,
}: {
  side: "left" | "right" | "center";
  avatar?: ReactNode;
  typing?: boolean;
  children: ReactNode;
}) {
  if (side === "center")
    return (
      <div data-msg className="flex justify-center px-6 py-1 text-center">
        {children}
      </div>
    );
  return (
    <div
      data-msg
      data-side={side}
      data-has-typing={typing ? "" : undefined}
      className={`relative flex items-end gap-2 ${side === "right" ? "justify-end" : ""}`}
    >
      {side === "left" && avatar}
      <div
        data-pop
        className={`flex min-w-0 flex-col ${side === "right" ? "items-end" : "items-start"} w-full`}
      >
        {children}
      </div>
      {typing && <Typing side={side} />}
    </div>
  );
}

export function Bubble({
  side,
  text,
  heart,
  big,
}: {
  side: "left" | "right";
  text: string;
  heart?: boolean;
  big?: boolean;
}) {
  return (
    <p
      className={`relative ${t.bubble} ${side === "right" ? t.me : t.her} ${big ? "px-6 py-3 text-[30px] font-extrabold" : ""}`}
    >
      {text}
      {heart && (
        <span
          data-heart
          className={`absolute -bottom-3 flex size-6 items-center justify-center rounded-full bg-white text-[#D93A6A] shadow-[0_2px_6px_rgba(15,23,42,0.18)] ${side === "right" ? "left-1" : "right-1"}`}
        >
          <HeartIcon weight="fill" className="size-3.5" />
          <span className="sr-only">được thả tim</span>
        </span>
      )}
    </p>
  );
}

export function Day({ label }: { label: string }) {
  return (
    <div data-msg className="my-4 flex items-center gap-3 px-4">
      <span className="h-px flex-1 bg-[#DCE5F3]" />
      <span className={`${t.meta} rounded-full bg-white/70 px-3 py-1`}>
        {label}
      </span>
      <span className="h-px flex-1 bg-[#DCE5F3]" />
    </div>
  );
}

const GRID: Record<number, string[]> = {
  1: ["col-span-2 aspect-[4/3]"],
  2: ["aspect-[3/4]", "aspect-[3/4]"],
  3: ["row-span-2 aspect-[3/5]", "aspect-[3/2.4]", "aspect-[3/2.4]"],
  4: ["aspect-square", "aspect-square", "aspect-square", "aspect-square"],
};

/** Tin ảnh: lưới 1–4 ảnh, chạm để xem lớn. */
export function Photos({
  images,
  start,
  count,
  side,
  onView,
}: {
  images: string[];
  start: number;
  count: number;
  side: "left" | "right";
  onView: (i: number) => void;
}) {
  const cls = GRID[count] ?? GRID[4];
  return (
    <div
      className={`grid w-[78%] grid-cols-2 gap-0.5 overflow-hidden rounded-[1.25rem] ${side === "right" ? "rounded-br-md" : "rounded-bl-md"}`}
    >
      {Array.from({ length: count }, (_, j) => start + j).map((i, j) => (
        <button
          key={images[i]}
          type="button"
          onClick={() => onView(i)}
          aria-label={`Xem lớn ảnh ${i + 1}`}
          className={`relative overflow-hidden bg-[#DCE5F3] ${cls[j]}`}
        >
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            data-photo
            src={images[i]}
            alt={`Khoảnh khắc ${i + 1}`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}
