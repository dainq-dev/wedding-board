import type { Metadata } from "next";
import { Pacifico, Quicksand } from "next/font/google";
import { meta } from "./meta";

const script = Pacifico({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-script",
});
const body = Quicksand({
  subsets: ["vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Tropical2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/tropical-2d">) {
  return (
    <div className={`${script.variable} ${body.variable}`}>{children}</div>
  );
}
