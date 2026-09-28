// Chữ cái đầu của từ cuối: "Minh Quân" → "Q", "Trịnh Đức Hưởng" → "H".
export const initials = (name: string) =>
  (name.trim().split(/\s+/).at(-1)?.[0] ?? "").toLocaleUpperCase("vi");
