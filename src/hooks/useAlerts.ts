import { create } from 'zustand';
import type { ChangeEvent } from '../lib/priceDiff';

export interface AlertRule {
  id: string;
  name: string;
  competitorIds: string[];
  condition: 'price_change' | 'new_plan' | 'feature_change';
  threshold: number;
  channel: 'email' | 'slack' | 'inapp';
  enabled: boolean;
}

export interface ActiveAlert {
  id: string;
  ruleId: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  snoozed: boolean;
}

interface AlertState {
  rules: AlertRule[];
  alerts: ActiveAlert[];
  addRule: (r: AlertRule) => void;
  toggleRule: (id: string) => void;
  removeRule: (id: string) => void;
  dismissAlert: (id: string) => void;
  snoozeAlert: (id: string) => void;
  evaluate: (events: ChangeEvent[]) => void;
}

export const useAlerts = create<AlertState>((set) => ({
  rules: [
    { id: 'r1', name: 'Major price hikes', competitorIds: [], condition: 'price_change', threshold: 5, channel: 'inapp', enabled: true },
    { id: 'r2', name: 'New plan launches', competitorIds: [], condition: 'new_plan', threshold: 0, channel: 'slack', enabled: true },
  ],
  alerts: [
    { id: 'a-seed1', ruleId: 'r1', severity: 'high', title: 'Slack raised Pro pricing', message: 'Slack increased its Pro plan from $7.25 to $8.75/mo (+20.7%).', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), snoozed: false },
    { id: 'a-seed2', ruleId: 'r2', severity: 'medium', title: 'Mixpanel restructured tiers', message: 'Mixpanel adjusted its Growth plan structure with new usage limits.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(), snoozed: false },
  ],
  addRule: (r) => set((s) => ({ rules: [...s.rules, r] })),
  toggleRule: (id) => set((s) => ({ rules: s.rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r) })),
  removeRule: (id) => set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  snoozeAlert: (id) => set((s) => ({ alerts: s.alerts.map((a) => a.id === id ? { ...a, snoozed: !a.snoozed } : a) })),
  evaluate: (events) =>
    set((s) => {
      const enabled = s.rules.filter((r) => r.enabled);
      const newAlerts: ActiveAlert[] = [];
      events.forEach((e) => {
        enabled.forEach((rule) => {
          const scoped = rule.competitorIds.length === 0 || rule.competitorIds.includes(e.competitorId);
          if (!scoped) return;
          if (rule.condition === 'price_change' && (e.type === 'increase' || e.type === 'decrease')) {
            if (Math.abs(e.percent ?? 0) >= rule.threshold) {
              newAlerts.push({
                id: `al-${e.id}`, ruleId: rule.id,
                severity: Math.abs(e.percent ?? 0) >= 15 ? 'high' : Math.abs(e.percent ?? 0) >= 8 ? 'medium' : 'low',
                title: `${e.competitorName} ${e.type === 'increase' ? 'raised' : 'lowered'} ${e.planName}`,
                message: e.summary, timestamp: e.timestamp, snoozed: false,
              });
            }
          }
          if (rule.condition === 'new_plan' && e.type === 'new_plan') {
            newAlerts.push({ id: `al-${e.id}`, ruleId: rule.id, severity: 'medium', title: `${e.competitorName} new plan`, message: e.summary, timestamp: e.timestamp, snoozed: false });
          }
        });
      });
      return { alerts: [...newAlerts, ...s.alerts].slice(0, 40) };
    }),
}));