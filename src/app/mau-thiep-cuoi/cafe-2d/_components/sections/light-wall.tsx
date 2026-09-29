import { ImagesIcon } from "@phosphor-icons/react";
import { t } from "../tokens";

// Chia ảnh thành các dây đèn 2 / 3 ảnh xen kẽ (không cắt bớt ảnh nào).
export function rows(n: number) {
  const out: number[][] = [];
  let i = 0;
  let k = 0;
  while (i < n) {
    const size = Math.min(k % 2 ? 3 : 2, n - i);
    out.push(Array.from({ length: size }, (_, j) => i + j));
    i += size;
    k++;
  }
  return out;
}

const TILT = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2"];

// C8 · Tường ảnh đèn dây: mọi ảnh trong data.images treo bằng kẹp gỗ.
export function LightWall({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: (i: number) => void;
  onAll: () => void;
}) {
  return (
    <section className="mx-auto w-[min(96vw,920px)] py-20">
      <div data-rise className="mx-auto mb-6 w-[min(92vw,960px)]">
        <h2 className={`${t.chalk} text-[30px] sm:text-[40px]`}>
          Tường ảnh của quán
        </h2>
        <p className={`mt-2 max-w-[40ch] ${t.muted}`}>
          {images.length} khoảnh khắc treo trên dây đèn. Chạm vào ảnh để xem
          lớn.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {rows(images.length).map((row, r) => (
          <div key={row[0]} data-row className="relative pt-10">
            {/* dây đèn võng + bóng đèn */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              className="absolute inset-x-0 top-0 h-14 w-full"
            >
              <path
                data-draw
                d={r % 2 ? "M0 10 Q 500 58 1000 14" : "M0 16 Q 500 52 1000 8"}
                stroke="#3B2A1D"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <div
              aria-hidden
              className="absolute inset-x-[4%] top-3 flex justify-between"
            >
              {Array.from({ length: 9 }, (_, b) => b).map((b) => (
                <span
                  key={b}
                  data-bulb
                  className="size-2.5 rounded-full bg-[#E9C46A] shadow-[0_0_14px_4px_rgba(233,196,106,0.45)]"
                  style={{
                    marginTop: `${Math.sin(((b + 0.5) / 9) * Math.PI) * 26}px`,
                  }}
                />
              ))}
            </div>
            <div
              className={`relative grid items-start gap-4 px-3 sm:gap-8 sm:px-10 ${row.length === 3 ? "grid-cols-3" : "grid-cols-2 px-8 sm:px-24"}`}
            >
              {row.map((i) => (
                <figure
                  key={images[i]}
                  data-sway
                  className={`relative mt-4 origin-top ${TILT[i % TILT.length]}`}
                >
                  <span
                    aria-hidden
                    className="absolute -top-4 left-1/2 z-10 h-7 w-3 -translate-x-1/2 rounded-sm bg-[linear-gradient(180deg,#B88B5E,#7C5634)] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  />
                  <button
                    type="button"
                    onClick={() => onView(i)}
                    aria-label={`Xem lớn khoảnh khắc ${i + 1}`}
                    className="block w-full bg-[#F5ECD9] p-1.5 pb-5 shadow-[0_24px_36px_-20px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9C46A] sm:p-2.5 sm:pb-8"
                  >
                    {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                    <img
                      src={images[i]}
                      alt={`Khoảnh khắc ${i + 1}`}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </button>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div data-rise className="mt-14 flex justify-center">
        <button type="button" onClick={onAll} className={t.btn}>
          <ImagesIcon className="size-5" />
          Xem trọn album
        </button>
      </div>
    </section>
  );
}
