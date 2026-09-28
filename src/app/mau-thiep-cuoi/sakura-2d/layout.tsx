import type { Metadata } from "next";
import { Dancing_Script, Playfair_Display } from "next/font/google";
import { meta } from "./meta";

const script = Dancing_Script({
  subsets: ["vietnamese"],
  variable: "--font-script",
});
const serif = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function SakuraLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/sakura-2d">) {
  return (
    <div className={`${script.variable} ${serif.variable}`}>{children}</div>
  );
}
