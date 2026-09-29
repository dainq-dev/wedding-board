import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { MapEmbed } from "@/components/map-embed";
import { formatTime } from "@/kit/dates";
import type { WeddingData } from "@/wedding/types";
import { t } from "../tokens";

const SUGAR = [
  { name: "Kem", color: "#F5ECD9", ink: "#2B1D14" },
  { name: "Caramel", color: "#C58B4E", ink: "#2B1D14" },
  { name: "Nâu", color: "#6F4A2F", ink: "#F2EEE3" },
  { name: "Đen", color: "#1B120C", ink: "#F2EEE3" },
];

// C6 + C7 · Hai biển hiệu treo (lễ vu quy, tiệc cưới) + bản đồ quán. C13 · dress code gói đường.
export function Address({ data, date }: { data: WeddingData; date: Date }) {
  const { venue, bride } = data;
  const vuQuy = new Date(date.getTime() - 10 * 3_600_000);
  const signs = [
    {
      title: "Lễ vu quy",
      time: formatTime(vuQuy),
      place: "Tư gia nhà gái",
      detail: bride.address,
    },
    {
      title: "Tiệc cưới",
      time: formatTime(date),
      place: venue.name ?? "Nhà hàng tiệc cưới",
      detail: "Đón khách trước một giờ",
    },
  ];
  return (
    <section className="mx-auto w-[min(92vw,960px)] py-20">
      <h2 data-rise className={`${t.chalk} text-[30px] sm:text-[40px]`}>
        Địa chỉ quán
      </h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {signs.map((s, i) => (
          <div key={s.title} data-swing className="relative origin-top pt-10">
            {/* dây treo */}
            <span
              aria-hidden
              className="absolute top-0 left-[22%] h-10 w-px bg-[#F2EEE3]/40"
            />
            <span
              aria-hidden
              className="absolute top-0 right-[22%] h-10 w-px bg-[#F2EEE3]/40"
            />
            <div
              className={`${t.latte} border-2 border-[#C58B4E] px-6 py-6 ${i ? "sm:mt-8" : ""}`}
            >
              <p className="font-(family-name:--font-display) text-[28px] text-[#6F4A2F]">
                {s.title}
              </p>
              <p className="mt-1 text-[22px] font-medium tabular-nums">
                {s.time}
              </p>
              <p className="mt-3 font-medium break-words">{s.place}</p>
              <p className={`text-[14px] ${t.soft} break-words`}>{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        data-rise
        className="mt-12 rounded-xl bg-[#C58B4E]/25 p-1.5 ring-1 ring-[#C58B4E]/50"
      >
        <MapEmbed
          venue={venue}
          className="aspect-[4/3] w-full rounded-[calc(0.75rem-0.375rem)] sm:aspect-[16/9]"
        />
      </div>
      <div data-rise className="mt-8 flex justify-center">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={t.btn}
        >
          Chỉ đường tới quán
          <ArrowUpRightIcon className="size-4" weight="bold" />
        </a>
      </div>

      <div
        data-rise
        className="mt-24 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <div>
          <h2 className={`${t.chalk} text-[30px] sm:text-[36px]`}>
            Dress code
          </h2>
          <p className={`mt-2 max-w-[34ch] ${t.muted}`}>
            Thoải mái, lịch sự, theo tông cà phê sữa. Không cần cầu kỳ, chỉ cần
            bạn tới.
          </p>
        </div>
        <ul className="flex gap-3">
          {SUGAR.map((s, i) => (
            <li
              key={s.name}
              data-sugar
              className={`flex h-24 w-16 flex-col items-center justify-end rounded-md pb-2 text-[12px] font-medium shadow-[0_12px_20px_-12px_rgba(0,0,0,0.8)] ${i % 2 ? "rotate-6" : "-rotate-6"}`}
              style={{ backgroundColor: s.color, color: s.ink }}
            >
              <span
                aria-hidden
                className="mb-auto h-2 w-full rounded-t-md bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0_2px,transparent_2px_5px)]"
              />
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
