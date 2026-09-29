import type { Metadata } from "next";
import { Lobster, Nunito } from "next/font/google";
import { meta } from "./meta";

const display = Lobster({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-display",
});
const body = Nunito({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function PicnicLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/picnic-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
