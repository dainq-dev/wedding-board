"use client";

export function ArchImage({
  src,
  alt,
  className = "",
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div
      className={`rounded-t-full p-2 outline outline-1 outline-offset-8 outline-[#C8D5B9] ${className}`}
    >
      {/* biome-ignore lint/performance/noImgElement: wedding media may be a blob URL from Dùng thử */}
      <img
        src={src}
        alt={alt}
        className="aspect-3/4 w-full rounded-t-full object-cover"
      />
    </div>
  );
}
