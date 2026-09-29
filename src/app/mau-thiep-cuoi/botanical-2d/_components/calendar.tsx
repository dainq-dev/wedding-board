"use client";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export function WeddingCalendar({ date }: { date: Date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const weddingDay = date.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const dayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const days = Array.from({ length: dayOffset + new Date(year, month + 1, 0).getDate() }, (_, index) => index - dayOffset + 1);

  return (
    <div className="rounded-t-[3rem] bg-[#E4EBDC] p-5 text-center">
      <div className="grid grid-cols-7 gap-y-2 text-[14px]">
        {WEEKDAYS.map((weekday) => <span key={weekday} className="font-semibold text-[#5F7A5A]">{weekday}</span>)}
        {days.map((day, index) => (
          <span key={`${day}-${index}`} className={`mx-auto flex size-7 items-center justify-center ${day === weddingDay ? "rounded-full bg-[#D9A5A0] text-white" : ""}`}>
            {day > 0 ? day : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
