import type { Competitor } from './sampleData';

export type ChangeType = 'increase' | 'decrease' | 'new_plan' | 'removed_feature';

export interface ChangeEvent {
  id: string;
  competitorId: string;
  competitorName: string;
  planName: string;
  type: ChangeType;
  from?: number;
  to?: number;
  percent?: number;
  summary: string;
  timestamp: string;
}

export function diffSnapshots(prev: Competitor[], next: Competitor[]): ChangeEvent[] {
  const events: ChangeEvent[] = [];
  const now = new Date().toISOString();
  next.forEach((nc) => {
    const pc = prev.find((p) => p.id === nc.id);
    if (!pc) return;
    nc.plans.forEach((np) => {
      const pp = pc.plans.find((p) => p.id === np.id);
      if (!pp) {
        events.push({
          id: `${nc.id}-${np.id}-new-${Date.now()}-${Math.random()}`,
          competitorId: nc.id, competitorName: nc.name, planName: np.name,
          type: 'new_plan', to: np.priceMonthly,
          summary: `${nc.name} launched a new "${np.name}" plan at $${np.priceMonthly}/mo.`,
          timestamp: now,
        });
        return;
      }
      if (pp.priceMonthly !== np.priceMonthly) {
        const pct = ((np.priceMonthly - pp.priceMonthly) / pp.priceMonthly) * 100;
        const type: ChangeType = np.priceMonthly > pp.priceMonthly ? 'increase' : 'decrease';
        events.push({
          id: `${nc.id}-${np.id}-${Date.now()}-${Math.random()}`,
          competitorId: nc.id, competitorName: nc.name, planName: np.name,
          type, from: pp.priceMonthly, to: np.priceMonthly, percent: Math.round(pct * 10) / 10,
          summary: `${nc.name} ${type === 'increase' ? 'raised' : 'lowered'} its ${np.name} plan from $${pp.priceMonthly} to $${np.priceMonthly}/mo (${pct > 0 ? '+' : ''}${pct.toFixed(1)}%).`,
          timestamp: now,
        });
      }
    });
  });
  return events;
}