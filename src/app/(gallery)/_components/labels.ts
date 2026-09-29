export const STYLE_LABEL: Record<string, string> = {
  minimalist: "Tối giản",
  floral: "Hoa lá",
  vintage: "Cổ điển",
  modern: "Hiện đại",
  luxury: "Sang trọng",
  traditional: "Truyền thống",
  playful: "Vui tươi",
  cinematic: "Điện ảnh",
};

export const COLOR: Record<string, { label: string; hex: string }> = {
  white: { label: "Trắng", hex: "#FFFFFF" },
  pink: { label: "Hồng", hex: "#E8A4B8" },
  red: { label: "Đỏ", hex: "#B3261E" },
  gold: { label: "Vàng kim", hex: "#C9A24A" },
  green: { label: "Xanh lá", hex: "#4F7D4A" },
  blue: { label: "Xanh dương", hex: "#3D6FA8" },
  purple: { label: "Tím", hex: "#6B4FA0" },
  black: { label: "Đen", hex: "#1C2320" },
  beige: { label: "Be", hex: "#E3D5BF" },
};

export const styleLabel = (s: string) => STYLE_LABEL[s] ?? s;
export const colorLabel = (c: string) => COLOR[c]?.label ?? c;
