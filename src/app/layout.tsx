import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Mẫu thiệp cưới online", template: "%s | Mẫu thiệp cưới" },
  description:
    "Bộ sưu tập mẫu thiệp cưới online — xem và dùng thử ngay trên trình duyệt.",
};

// Tối giản: font/theme do từng layout con quyết định.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
