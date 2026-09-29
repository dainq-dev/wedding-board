import type { Metadata } from "next";
import { Alegreya, Work_Sans } from "next/font/google";
import { meta } from "./meta";

// Alegreya: nét thư pháp nhẹ như chữ trên bản đồ cổ. Work Sans: nội dung gọn, rõ.
const display = Alegreya({
  subsets: ["vietnamese"],
  weight: ["500", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Work_Sans({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function RouteMap2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/route-map-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
