import { create } from 'zustand';
import type { Insight } from '../lib/insightGenerator';
import { answerQuestion } from '../lib/insightGenerator';

let idc = 0;
const uid = () => `chat-${Date.now()}-${idc++}`;

interface InsightState {
  insights: Insight[];
  streaming: boolean;
  streamingText: string;
  ask: (q: string) => void;
  pushInsights: (i: Insight[]) => void;
}

const seed: Insight[] = [
  { id: 'seed-1', role: 'agent', tag: 'trend', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), text: 'Across the tracked set, Pro-tier pricing has crept up ~6% over the last quarter. The market is normalizing toward higher willingness-to-pay in collaboration tools.' },
  { id: 'seed-2', role: 'agent', tag: 'gap', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), text: 'SSO and audit logs remain universally gated to Business tiers. Bundling SSO into your Pro plan would be a sharp differentiator nobody currently offers.' },
  { id: 'seed-3', role: 'agent', tag: 'opportunity', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), text: 'Linear ($8/mo) and GitHub ($4/mo) anchor the low end. The $10–20 band is crowded — competing on annual discount depth may win more than headline price.' },
];

export const useAiInsights = create<InsightState>((set, get) => ({
  insights: seed,
  streaming: false,
  streamingText: '',
  pushInsights: (i) => set((s) => ({ insights: [...i, ...s.insights] })),
  ask: (q) => {
    const userMsg: Insight = { id: uid(), role: 'user', text: q, timestamp: new Date().toISOString() };
    set((s) => ({ insights: [userMsg, ...s.insights], streaming: true, streamingText: '' }));
    const full = answerQuestion(q);
    const words = full.split(' ');
    let idx = 0;
    const tick = () => {
      if (idx >= words.length) {
        const answer: Insight = { id: uid(), role: 'agent', tag: 'answer', text: full, timestamp: new Date().toISOString() };
        set((s) => ({ insights: [answer, ...s.insights], streaming: false, streamingText: '' }));
        return;
      }
      idx++;
      set({ streamingText: words.slice(0, idx).join(' ') });
      setTimeout(tick, 45);
    };
    void get;
    setTimeout(tick, 350);
  },
}));