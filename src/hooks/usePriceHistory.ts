import { create } from 'zustand';
import type { PricePoint } from '../lib/sampleData';
import { samplePriceHistory } from '../lib/sampleData';
import type { ChangeEvent } from '../lib/priceDiff';

interface HistoryState {
  history: PricePoint[];
  events: ChangeEvent[];
  addEvents: (e: ChangeEvent[], latest: Record<string, number>) => void;
}

export const usePriceHistory = create<HistoryState>((set) => ({
  history: samplePriceHistory,
  events: [],
  addEvents: (e, latest) =>
    set((s) => {
      const newPoint: PricePoint = { month: 'Now' };
      Object.entries(latest).forEach(([k, v]) => (newPoint[k] = v));
      const trimmed = s.history.filter((h) => h.month !== 'Now');
      return { events: [...e, ...s.events].slice(0, 50), history: [...trimmed, newPoint] };
    }),
}));