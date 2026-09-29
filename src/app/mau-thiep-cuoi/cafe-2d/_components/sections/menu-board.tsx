import { Tape } from "../art";
import { t } from "../tokens";

// C2 · Bảng phấn "Menu hôm nay: Cưới" với tên cặp đôi (h1) và ảnh bìa dán băng keo.
export function MenuBoard({
  groom,
  bride,
  dateLine,
  cover,
  onView,
}: {
  groom: string;
  bride: string;
  dateLine: string;
  cover?: string;
  onView: () => void;
}) {
  return (
    <section className="mx-auto w-[min(94vw,1080px)] pt-24 pb-16 lg:pt-28">
      <div
        data-rise
        className={`${t.board} px-6 py-10 sm:px-10 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14`}
      >
        <div>
          <p className={`${t.chalk} text-[22px] sm:text-[26px]`}>
            Menu hôm nay:
          </p>
          <p className={`${t.chalkY} text-[64px] leading-none sm:text-[88px]`}>
            Cưới
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 300 12"
            className="my-6 h-3 w-[70%] max-w-72"
          >
            <path
              d="M2 7 C 60 3 120 10 180 5 S 270 8 298 4"
              stroke="#F2EEE3"
              strokeOpacity="0.7"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <h1
            className={`${t.chalkY} text-[42px] leading-[1.12] break-words sm:text-[60px]`}
          >
            <span className="block">{groom}</span>
            <span className={`${t.chalk} block text-[0.6em]`}>&amp;</span>
            <span className="block">{bride}</span>
          </h1>
          <p
            className={`${t.chalk} mt-6 max-w-[26ch] text-[20px] leading-snug sm:text-[22px]`}
          >
            Trân trọng mời bạn ghé quán vào {dateLine}
          </p>
        </div>
        {cover && (
          <button
            type="button"
            onClick={onView}
            aria-label="Xem lớn ảnh bìa"
            className="relative mx-auto mt-12 block w-[min(78vw,420px)] rotate-2 bg-[#F5ECD9] p-2.5 pb-10 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-0 lg:mt-0"
          >
            <Tape />
            {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
            <img
              src={cover}
              alt={`${groom} và ${bride}`}
              className="aspect-[4/5] w-full object-cover"
            />
          </button>
        )}
      </div>
    </section>
  );
}
