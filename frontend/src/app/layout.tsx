import type { Metadata } from "next";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrvihXI",
  description: "Fantasy nogomet za slovensko Prvo ligo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sl">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
