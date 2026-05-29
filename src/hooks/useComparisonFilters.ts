import { create } from 'zustand';
import type { BillingCycle } from '../lib/sampleData';

interface FilterState {
  cycle: BillingCycle;
  currency: string;
  category: string | null;
  featureCategory: string | null;
  setCycle: (c: BillingCycle) => void;
  setCurrency: (c: string) => void;
  setCategory: (c: string | null) => void;
  setFeatureCategory: (c: string | null) => void;
}

export const useComparisonFilters = create<FilterState>((set) => ({
  cycle: 'monthly',
  currency: 'USD',
  category: null,
  featureCategory: null,
  setCycle: (cycle) => set({ cycle }),
  setCurrency: (currency) => set({ currency }),
  setCategory: (category) => set({ category }),
  setFeatureCategory: (featureCategory) => set({ featureCategory }),
}));