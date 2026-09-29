import type { Metadata } from "next";
import { Arima, Vollkorn } from "next/font/google";
import { meta } from "./meta";

// Vollkorn đậm: nét như chữ khắc gỗ. Arima: nét mềm, tròn cho nội dung dân gian.
const display = Vollkorn({
  subsets: ["vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
const body = Arima({
  subsets: ["vietnamese"],
  weight: ["400", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function DongHo2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/dong-ho-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
