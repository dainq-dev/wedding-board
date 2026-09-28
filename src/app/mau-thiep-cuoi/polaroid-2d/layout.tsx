import type { Metadata } from "next";
import { Nunito, Patrick_Hand } from "next/font/google";
import { meta } from "./meta";

const hand = Patrick_Hand({
  subsets: ["vietnamese"],
  variable: "--font-hand",
});
const body = Nunito({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function PolaroidLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/polaroid-2d">) {
  return <div className={`${hand.variable} ${body.variable}`}>{children}</div>;
}
