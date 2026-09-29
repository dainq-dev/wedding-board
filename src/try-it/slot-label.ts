// Nhãn vị trí media theo thứ tự cố định (todo-list §2.1).
export const imageSlotLabel = (i: number) =>
  ["Ảnh bìa", "Ảnh chú rể", "Ảnh cô dâu"][i] ?? `Ảnh album ${i - 2}`;

export const videoSlotLabel = (i: number) => `Video ${i + 1}`;
