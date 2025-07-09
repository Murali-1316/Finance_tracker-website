import { create } from 'zustand';

interface SettingsState {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (currency: string) => void;
  fetchRates: (base: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currency: 'USD',
  rates: { USD: 1 },
  setCurrency: (currency) => {
    set({ currency });
  },
  fetchRates: async (base) => {
    try {
      const res = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
      const data = await res.json();
      if (data && data.rates) {
        set({ rates: data.rates });
      }
    } catch (e) {
      // fallback: do nothing
    }
  },
})); 