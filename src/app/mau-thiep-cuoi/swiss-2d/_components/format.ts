export const initials = (name: string) => name.trim().split(/\s+/).at(-1)?.[0]?.toUpperCase() ?? "?";

export const scheduleFrom = (date: Date) => {
  const offsets = [-60, 0, 30, 120] as const;
  const labels = ["ĐÓN KHÁCH", "LÀM LỄ", "KHAI TIỆC", "GIAO LƯU"] as const;
  return offsets.map((minutes, index) => {
    const time = new Date(date.getTime() + minutes * 60_000);
    return {
      label: labels[index],
      time: new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(time),
    };
  });
};

export const formatCoord = (lat: number, lng: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"} / ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;

export const fitNameClass = (name: string) =>
  name.length > 28 ? "text-[15vw] lg:text-[12vw]" : "text-[22vw] lg:text-[20vw]";
