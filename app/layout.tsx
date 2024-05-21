import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "觉意阅读后台",
  description: "觉意科技有限公司",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
