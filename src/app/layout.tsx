import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import backgroundImage from "@/assets/background.jpg";

import "./globals.css";
import Image from "next/image";

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
        <div className="bg-gradient-to-b from-transparent via-green-100 to-teal-100">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-red-200 to-blue-200" />
          <div className="relative">
            <NextUIProvider>{children}</NextUIProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
