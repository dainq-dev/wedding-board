// Hoa, nụ, cánh, trái tim, cành góc — SVG tự vẽ theo spec §7 (asset mẫu).
// Tất cả là trang trí: aria-hidden, màu lấy từ tokens blossom/primary/branch.

export const BRANCH_COLOR = "#6E4B4F";

export function Flower({
  size = 26,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
    >
      <g fill="#F4B6C2">
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            d="M20 20 C13 12 15 3 20 1 C25 3 27 12 20 20Z"
            transform={`rotate(${a} 20 20)`}
          />
        ))}
      </g>
      <circle cx="20" cy="20" r="3.2" fill="#D9667F" />
    </svg>
  );
}

export function Bud({
  size = 14,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2 C17 6 18 14 12 20 C6 14 7 6 12 2Z" fill="#FBE3E8" />
      <path
        d="M12 20 C8 18 6 14 7 9 M12 20 C16 18 18 14 17 9"
        stroke="#D9667F"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

const PETAL_D = [
  "M10 1 C14 5 15 12 12 17 C11.2 15.5 8.8 15.5 8 17 C5 12 6 5 10 1Z",
  "M10 0 C16 4 16 13 10 19 C4 13 4 4 10 0Z",
  "M9 0 C13 6 12 14 9 19 C6 14 5 6 9 0Z",
] as const;

const PETAL_FILL = ["#F4B6C2", "#FBE3E8", "#D9667F"] as const;

export function PetalShape({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const i = variant % PETAL_D.length;
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill={PETAL_FILL[i]}
    >
      <path d={PETAL_D[i]} />
    </svg>
  );
}

// Trái tim khoanh ngày cưới (vẽ bằng DrawSVG).
export function HeartRing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        className="heart-path"
        d="M60 108 C18 82 6 58 13 36 C20 15 46 12 60 32 C74 12 100 15 107 36 C114 58 102 82 60 108Z"
        fill="none"
        stroke="#B4475F"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Bông hoa vẽ trong cùng hệ toạ độ SVG (đặt bằng translate/scale để GSAP scale-in từng bông).
function BlossomGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="gate-blossom" transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill="#F4B6C2">
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            d="M0 0 C-6 -7 -5 -15 0 -17 C5 -15 6 -7 0 0Z"
            transform={`rotate(${a})`}
          />
        ))}
      </g>
      <circle r="2.6" fill="#D9667F" />
    </g>
  );
}

// Cành anh đào góc trên phải C1 — path chính vẽ theo A6, bông nở scale-in.
// Bắt đầu từ y=84 (viewBox 300 cao ~2/3 màn) để tránh nút nhạc góc trên phải.
export function CornerBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 300"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        className="gate-branch-path"
        d="M216 84 C188 96 162 118 140 150 C124 174 108 198 88 218 M140 150 C126 148 112 154 102 166 M108 198 C96 202 86 210 78 222"
        stroke={BRANCH_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <BlossomGlyph x={88} y={218} />
      <BlossomGlyph x={102} y={166} s={0.8} />
      <BlossomGlyph x={78} y={222} s={0.65} />
      <BlossomGlyph x={140} y={150} s={0.7} />
      <BlossomGlyph x={182} y={100} s={0.55} />
    </svg>
  );
}
