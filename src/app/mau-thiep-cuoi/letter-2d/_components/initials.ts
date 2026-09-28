// Chữ viết tắt trên dấu sáp: chữ cái đầu của tên gọi (từ cuối cùng trong họ tên).
// "Minh Quân" → "Q", "Thu Hà" → "H".
export const initials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const given = words.at(-1) ?? "";
  return given.charAt(0).toUpperCase();
};

// "Minh Quân" & "Thu Hà" → "Q & H"
export const sealMonogram = (groomName: string, brideName: string) =>
  `${initials(groomName)} & ${initials(brideName)}`;
