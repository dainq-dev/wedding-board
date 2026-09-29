import type { Metadata } from "next";
import { Hanken_Grotesk, Italianno } from "next/font/google";
import { meta } from "./meta";

// Art direction v2: tên cặp đôi Italianno (script mảnh), nội dung Hanken Grotesk.
const script = Italianno({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-script",
});
const sans = Hanken_Grotesk({
  subsets: ["vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function BalloonLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/balloon-3d">) {
  return (
    <div className={`${script.variable} ${sans.variable}`}>{children}</div>
  );
}
