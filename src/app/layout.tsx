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
        <Image
          src={backgroundImage}
          alt="background"
          className="absolute top-0 left-0 w-full h-full opacity-[5%]"
        />
        <div className="relative bg-green-800 bg-opacity-10">
          <NextUIProvider>{children}</NextUIProvider>
        </div>
      </body>
    </html>
  );
}
