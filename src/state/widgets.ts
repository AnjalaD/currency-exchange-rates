import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { useDataStore } from "./data";
import { createSelectors } from "@/utils/state-utils";

type Widget = {
  currency: string;
  currencyName: string;
  country: string;
  amount: number | undefined;
};

type State = {
  base: Widget;
  target: Widget[];
};

type Actions = {
  setBaseAmount: (amount: number) => void;
  addTargetCurrency: (widget: Omit<Widget, "amount">) => void;
  setTargetAmount: (amount: number, index: number) => void;
  removeTargetCurrency: (index: number) => void;
};

export const useWidgetStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      base: {
        currency: "USD",
        currencyName: "United States Dollar",
        country: "United States",
        amount: 1,
      },
      target: [
        {
          currency: "LKR",
          currencyName: "Sri Lankan Rupee",
          country: "Sri Lanka",
          amount: undefined,
        },
      ],

      setBaseAmount: (amount) =>
        set((state) => {
          state.base.amount = amount;
          state.target = state.target.map((t) => {
            const rate = getRate(t.currency);
            return { ...t, amount: rate ? rate * amount : undefined };
          });
        }),

      addTargetCurrency: (widget) =>
        set((state) => {
          const rate = getRate(widget.currency);
          const baseAmount = state.base.amount;
          const amount = rate && baseAmount ? rate * baseAmount : undefined;

          state.target.push({ ...widget, amount });
        }),

      setTargetAmount: (amount, index) =>
        set((state) => {
          const targetRate = getRate(state.target[index].currency);
          if (!targetRate) return state;

          const baseAmount = amount / targetRate;

          state.base.amount = baseAmount;
          state.target = state.target.map((t, i) => {
            if (i === index) {
              return { ...t, amount };
            }
            const rate = getRate(t.currency);
            return {
              ...t,
              amount: rate ? rate * baseAmount : undefined,
            };
          });
        }),

      removeTargetCurrency: (index) =>
        set((state) => ({
          target: state.target.filter((_, i) => i !== index),
        })),
    })),
    { name: "widgets", version: 2 }
  )
);

const getRate = (currency: string) => {
  const rate = useDataStore.getState().rates?.[currency];
  return rate;
};

export const useWidgets = createSelectors(useWidgetStore);
