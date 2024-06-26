"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Widgets } from "@/components/widgets";

export default function Home() {
  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col items-center justify-between pt-8 sm:pt-24 px-8">
      <Header />

      <Widgets />

      <Footer />
    </main>
  );
}
