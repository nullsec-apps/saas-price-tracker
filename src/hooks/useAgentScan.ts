import { create } from 'zustand';
import { useCompetitors } from './useCompetitors';
import { usePriceHistory } from './usePriceHistory';
import { useAlerts } from './useAlerts';
import { useAiInsights } from './useAiInsights';
import { diffSnapshots } from '../lib/priceDiff';
import { generateInsights } from '../lib/insightGenerator';
import type { Competitor } from '../lib/sampleData';

interface ScanState {
  scanning: boolean;
  progress: number;
  currentTool: string | null;
  lastScan: string | null;
  changesDetected: number;
  startScan: () => void;
}

function mutatePrices(competitors: Competitor[]): Competitor[] {
  return competitors.map((c) => {
    if (Math.random() > 0.35) return c;
    const plans = c.plans.map((p) => {
      if (p.id === 'free') return p;
      if (Math.random() > 0.5) return p;
      const dir = Math.random() > 0.45 ? 1 : -1;
      const delta = dir * (1 + Math.round(Math.random() * 5));
      const next = Math.max(1, p.priceMonthly + delta);
      return { ...p, prevPriceMonthly: p.priceMonthly, priceMonthly: next, priceAnnual: Math.round(next * 12 * 0.83) };
    });
    return { ...c, plans, lastChange: new Date().toISOString() };
  });
}

export const useAgentScan = create<ScanState>((set) => ({
  scanning: false,
  progress: 0,
  currentTool: null,
  lastScan: null,
  changesDetected: 0,
  startScan: () => {
    const prev = useCompetitors.getState().competitors;
    if (useAgentScan.getState().scanning) return;
    set({ scanning: true, progress: 0, changesDetected: 0 });
    const total = prev.length;
    let i = 0;
    const step = () => {
      if (i >= total) {
        const next = mutatePrices(prev);
        const events = diffSnapshots(prev, next);
        useCompetitors.getState().setCompetitors(next);
        const latest: Record<string, number> = {};
        next.forEach((c) => (latest[c.id] = c.plans.find((p) => p.id === 'pro')!.priceMonthly));
        usePriceHistory.getState().addEvents(events, latest);
        useAlerts.getState().evaluate(events);
        const insights = generateInsights(events);
        useAiInsights.getState().pushInsights(insights);
        set({ scanning: false, progress: 100, currentTool: null, lastScan: new Date().toISOString(), changesDetected: events.length });
        return;
      }
      set({ currentTool: prev[i].name, progress: Math.round(((i + 1) / total) * 100) });
      i++;
      setTimeout(step, 280);
    };
    setTimeout(step, 200);
  },
}));