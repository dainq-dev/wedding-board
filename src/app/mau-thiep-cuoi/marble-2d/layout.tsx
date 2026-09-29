import type { Metadata } from "next";
import { Raleway, Yeseva_One } from "next/font/google";
import { meta } from "./meta";

// Yeseva One: serif tương phản cao như chữ ép kim. Raleway: sans thanh mảnh, sang cho nội dung.
const display = Yeseva_One({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-display",
});
const body = Raleway({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Marble2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/marble-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
