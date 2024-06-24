import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDataStore } from "./data";
import { createSelectors } from "@/utils/state-utils";

type State = {
  base: {
    currency: string;
    amount: number | undefined;
  };
  target: {
    currency: string;
    amount: number | undefined;
  }[];
};

type Actions = {
  setBaseCurrency: (currency: string) => void;
  setBaseAmount: (amount: number) => void;
  addTargetCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string, index: number) => void;
  setTargetAmount: (amount: number, index: number) => void;
};

export const useWidgetStore = create<State & Actions>()(
  persist(
    (set) => ({
      base: { currency: "USD", amount: 1 },
      target: [{ currency: "LKR", amount: undefined }],

      setBaseCurrency: (currency) =>
        set((state) => ({
          base: { currency, amount: 1 },
          target: state.target.map((t) => ({ ...t, amount: undefined })),
        })),
      setBaseAmount: (amount) =>
        set((state) => ({
          base: { ...state.base, amount },
          target: state.target.map((t) => {
            const rate = getRate(t.currency);
            return { ...t, amount: rate ? rate * amount : undefined };
          }),
        })),
      addTargetCurrency: (currency) =>
        set((state) => ({
          ...state,
          target: [...state.target, { currency, amount: undefined }],
        })),
      setTargetCurrency: (currency, index) =>
        set((state) => ({
          target: state.target.map((t, i) => {
            if (i === index) {
              return { currency, amount: undefined };
            }
            return t;
          }),
        })),
      setTargetAmount: (amount, index) =>
        set((state) => {
          const targetRate = getRate(state.target[index].currency);
          if (!targetRate) return state;

          const baseAmount = amount / targetRate;
          return {
            base: { currency: state.base.currency, amount: baseAmount },
            target: state.target.map((t, i) => {
              if (i === index) {
                return { currency: t.currency, amount };
              }
              const rate = getRate(t.currency);
              return {
                currency: t.currency,
                amount: rate ? rate * baseAmount : undefined,
              };
            }),
          };
        }),
    }),
    { name: "widgets" }
  )
);

const getRate = (currency: string) => {
  const rate = useDataStore.getState().rates?.[currency];
  return rate;
};

export const useWidgets = createSelectors(useWidgetStore);
