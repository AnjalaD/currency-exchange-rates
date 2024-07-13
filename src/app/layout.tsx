import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X-Rates",
  description: "View and compare exchange rates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="overflow-hidden bg-gradient-to-b from-transparent via-green-100 to-teal-100">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-red-200 to-blue-200" />
          <div className="relative">
            <NextUIProvider>{children}</NextUIProvider>
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
