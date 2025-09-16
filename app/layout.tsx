import type { Metadata } from "next";

import "./globals.css";

import LayoutProvider from "./components/layout/LayoutProvider";

export const metadata: Metadata = {
  title: "Pick-n-get - Sustainable Recycling Made Easy",
  description: "Join the circular economy revolution with Pick-n-get.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
