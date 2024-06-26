import { RatesResult } from "@/types/rates";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  lastUpdated: string | undefined;
  rates: RatesResult["conversion_rates"] | undefined;
};

type Actions = {
  setData: (data: State) => void;
};

const fetchExchangeRates = async (currency: string) => {
  const response = await fetch("/api/rates?base=" + currency, {
    method: "GET",
  });
  const res: RatesResult = await response.json();
  return res;
};

export const useDataStore = create<State & Actions>()(
  persist(
    (set) => ({
      lastUpdated: undefined,
      rates: undefined,
      setData: (data) => set(data),
    }),
    {
      name: "data",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!state || error)
            return console.error("Error rehydrating state", error);

          if (state.rates && state.lastUpdated) {
            const now = new Date();
            const lastUpdated = new Date(state.lastUpdated);
            const diff = now.getTime() - lastUpdated.getTime();
            if (diff < 60 * 60 * 24) {
              return;
            }
          }

          fetchExchangeRates("USD").then((res) => {
            state.setData({
              rates: res.conversion_rates,
              lastUpdated: res.time_last_update_utc,
            });
          });
        };
      },
    }
  )
);

export const useLastUpdated = () => useDataStore((state) => state.lastUpdated);
export const useRates = () => useDataStore((state) => state.rates);
