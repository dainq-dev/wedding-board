import type { Metadata } from "next";
import { Noto_Serif_Display, Public_Sans } from "next/font/google";
import { meta } from "./meta";

// Art direction v2: tên & tiêu đề Noto Serif Display (italic light), nội dung Public Sans.
const serif = Noto_Serif_Display({
  subsets: ["vietnamese"],
  weight: ["200", "300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Public_Sans({
  subsets: ["vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function LotusLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/lotus-3d">) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
