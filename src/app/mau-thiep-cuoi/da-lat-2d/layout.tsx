import type { Metadata } from "next";
import { Crimson_Pro, Mulish } from "next/font/google";
import { meta } from "./meta";

// Crimson Pro italic light: mảnh như chữ viết trên kính mờ. Mulish: sans mềm, sáng cho nội dung.
const display = Crimson_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Mulish({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function DaLat2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/da-lat-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
