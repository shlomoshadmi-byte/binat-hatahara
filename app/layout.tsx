import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binat Hatahara",
  description: "Configurable veset reminders with private local entries.",
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
