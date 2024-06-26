"use client";

import { useWidgets } from "@/state/widgets";
import {
  BaseCurrencyWidget,
  TargetCurrencyWidget,
} from "@/components/currency-widget";
import { AddWidget } from "@/components/add-widget";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  const targets = useWidgets.use.target();

  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col items-center justify-between pt-24 px-8">
      <Header />

      <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <BaseCurrencyWidget />

        {targets.map((target, index) => (
          <TargetCurrencyWidget
            key={index}
            isRemovable
            index={index}
            currency={target.currency}
            currencyName={target.currencyName}
            country={target.country}
            amount={target.amount}
          />
        ))}

        <AddWidget />
      </div>

      <Footer />
    </main>
  );
}
