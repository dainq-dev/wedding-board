import type { Metadata } from "next";
import { Cormorant_Infant, Quicksand } from "next/font/google";
import { meta } from "./meta";

// Cormorant Infant italic: mảnh, mơ màng như chữ viết dưới trăng. Quicksand: nét tròn mềm cho nội dung.
const display = Cormorant_Infant({
  subsets: ["vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Quicksand({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Starry2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/starry-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
