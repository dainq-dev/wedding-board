import { t } from "./tokens";

// Khung polaroid: viền trắng + vùng caption dưới (spec §2 "photo").
export function Polaroid({
  src,
  alt,
  caption = "",
  className = "",
}: {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div className={`${t.polaroid} ${className}`}>
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="aspect-square w-full rounded-[2px] object-cover"
      />
      {caption !== "" && (
        <p
          className={`${t.hand} mt-1 text-center text-[18px] leading-tight break-words lg:text-[20px]`}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
