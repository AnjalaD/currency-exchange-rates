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
  setTargetAmount: (index: number, amount: number) => void;
  removeTargetCurrency: (index: number) => void;
  swapTargetCurrencies: (index1: number, index2: number) => void;
  refresh: () => void;
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

      setTargetAmount: (index, amount) =>
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

      swapTargetCurrencies: (index1, index2) =>
        set((state) => {
          const target1 = state.target[index1];
          const target2 = state.target[index2];

          state.target[index1] = target2;
          state.target[index2] = target1;
        }),

      refresh: () => {
        set((state) => {
          if (!state.base.amount) {
            state.base.amount = 1;
          }

          state.target = state.target.map((t) => {
            const rate = getRate(t.currency);
            return {
              ...t,
              amount: rate ? rate * state.base.amount! : undefined,
            };
          });
        });
      },
    })),
    { name: "widgets", version: 2 }
  )
);

const getRate = (currency: string) => {
  const rate = useDataStore.getState().rates?.[currency];
  return rate;
};

useDataStore.subscribe(() => {
  useWidgetStore.getState().refresh();
});

export const useWidgets = createSelectors(useWidgetStore);
