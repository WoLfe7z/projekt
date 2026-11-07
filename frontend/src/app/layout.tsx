import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrvihXI",
  description: "Fantasy nogomet za slovensko Prvo ligo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sl">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
