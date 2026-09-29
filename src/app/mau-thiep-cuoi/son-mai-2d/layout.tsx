import type { Metadata } from "next";
import { Petrona, Spectral } from "next/font/google";
import { meta } from "./meta";

// Petrona: serif tiêu đề có độ tương phản nét, hợp chữ vàng lá. Spectral: serif nội dung dễ đọc cho người lớn tuổi.
const display = Petrona({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Spectral({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function SonMai2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/son-mai-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
