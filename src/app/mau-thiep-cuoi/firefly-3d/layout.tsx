import type { Metadata } from "next";
import { Be_Vietnam_Pro, Great_Vibes } from "next/font/google";
import { meta } from "./meta";

const script = Great_Vibes({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-script",
});
const body = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["200", "300", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function FireflyLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/firefly-3d">) {
  return (
    <div className={`${script.variable} ${body.variable}`}>{children}</div>
  );
}
