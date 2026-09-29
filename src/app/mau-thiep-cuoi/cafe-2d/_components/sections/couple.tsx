import type { Person } from "@/wedding/types";
import { Tape } from "../art";
import { t } from "../tokens";

// C3 · "Hai ly đen đá": chân dung hai người, dưới mỗi ảnh là phiếu order viết tay.
export function Couple({
  groom,
  bride,
  groomImg,
  brideImg,
  onView,
}: {
  groom: Person;
  bride: Person;
  groomImg?: string;
  brideImg?: string;
  onView: (i: number) => void;
}) {
  const people = [
    {
      role: "Chú rể",
      side: "Nhà trai",
      p: groom,
      img: groomImg,
      i: 1,
      order: "Đen đá, ít đường",
      tilt: "-rotate-2",
      pos: "",
    },
    {
      role: "Cô dâu",
      side: "Nhà gái",
      p: bride,
      img: brideImg,
      i: 2,
      order: "Bạc xỉu, nhiều sữa",
      tilt: "rotate-2",
      pos: "sm:mt-24",
    },
  ];
  return (
    <section className="mx-auto w-[min(92vw,960px)] py-20">
      <div
        data-rise
        className="mb-12 flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EEE3]/25 pb-4"
      >
        <h2 className={`${t.chalk} text-[30px] sm:text-[40px]`}>
          Hai ly đen đá
        </h2>
        <span className={`${t.chalkY} text-[20px]`}>x2</span>
      </div>
      <div className="grid gap-16 sm:grid-cols-2 sm:gap-10">
        {people.map(({ role, side, p, img, i, order, tilt, pos }) => (
          <figure
            key={role}
            data-slide={i === 1 ? "left" : "right"}
            className={pos}
          >
            {img && (
              <button
                type="button"
                onClick={() => onView(i)}
                aria-label={`Xem lớn ảnh ${role.toLowerCase()} ${p.name}`}
                className={`relative block w-full ${tilt} bg-[#F5ECD9] p-2.5 shadow-[0_30px_50px_-24px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-0`}
              >
                <Tape />
                {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                <img
                  src={img}
                  alt={`${role} ${p.name}`}
                  className="aspect-[4/5] w-full object-cover"
                />
              </button>
            )}
            <figcaption
              className={`${t.latte} relative mx-auto -mt-6 w-[88%] px-5 py-4`}
            >
              <p className={`${t.label} ${t.soft}`}>{role}</p>
              <p className="mt-1 font-(family-name:--font-display) text-[28px] leading-tight break-words">
                {p.name}
              </p>
              <p className={`mt-1 text-[14px] ${t.soft} break-words`}>
                {side}, {p.address}
              </p>
              <p className="mt-3 border-t border-dashed border-[#2B1D14]/20 pt-3 font-(family-name:--font-display) text-[18px] text-[#6F4A2F]">
                Ghi chú: {order}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
