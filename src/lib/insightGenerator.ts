import type { ChangeEvent } from './priceDiff';
import { sampleCompetitors } from './sampleData';

export interface Insight {
  id: string;
  role: 'agent' | 'user';
  text: string;
  tag?: 'trend' | 'opportunity' | 'gap' | 'answer';
  timestamp: string;
}

let counter = 0;
const uid = () => `ins-${Date.now()}-${counter++}`;

export function generateInsights(events: ChangeEvent[]): Insight[] {
  const now = new Date().toISOString();
  const out: Insight[] = [];
  const increases = events.filter((e) => e.type === 'increase');
  const decreases = events.filter((e) => e.type === 'decrease');

  if (increases.length >= 2) {
    out.push({ id: uid(), role: 'agent', tag: 'trend', timestamp: now,
      text: `Pricing pressure is building: ${increases.length} competitors raised prices this scan, led by ${increases[0].competitorName} (${increases[0].percent}%). The market is trending upward — you have room to adjust without losing position.` });
  }
  decreases.forEach((d) => {
    out.push({ id: uid(), role: 'agent', tag: 'opportunity', timestamp: now,
      text: `${d.competitorName} just cut its ${d.planName} plan by ${Math.abs(d.percent ?? 0)}%. This is likely a defensive move — consider matching value rather than price to avoid a race to the bottom.` });
  });
  increases.forEach((inc) => {
    out.push({ id: uid(), role: 'agent', tag: 'opportunity', timestamp: now,
      text: `${inc.competitorName} increased its ${inc.planName} tier to $${inc.to}/mo. There's now a $${(inc.to ?? 0) - (inc.from ?? 0)} undercut window if you hold pricing steady.` });
  });
  return out;
}

export function answerQuestion(q: string): string {
  const lower = q.toLowerCase();
  const cheapest = [...sampleCompetitors].sort((a, b) => (a.plans.find(p=>p.id==='pro')!.priceMonthly) - (b.plans.find(p=>p.id==='pro')!.priceMonthly))[0];
  const dearest = [...sampleCompetitors].sort((a, b) => (b.plans.find(p=>p.id==='pro')!.priceMonthly) - (a.plans.find(p=>p.id==='pro')!.priceMonthly))[0];
  if (lower.includes('cheap') || lower.includes('lowest')) {
    return `${cheapest.name} has the lowest Pro tier at $${cheapest.plans.find(p=>p.id==='pro')!.priceMonthly}/mo. It's well positioned for price-sensitive segments but gates API and SSO behind higher tiers.`;
  }
  if (lower.includes('expensive') || lower.includes('highest') || lower.includes('premium')) {
    return `${dearest.name} commands the highest Pro pricing at $${dearest.plans.find(p=>p.id==='pro')!.priceMonthly}/mo, justified by deeper analytics and enterprise security baked into mid-tier.`;
  }
  if (lower.includes('sso') || lower.includes('security')) {
    return `Across your tracked set, SSO/SAML is universally gated to Business/Enterprise tiers. None offer it on Pro — that's a clear differentiation opportunity if you bundle it earlier.`;
  }
  if (lower.includes('average') || lower.includes('mean')) {
    const avg = sampleCompetitors.reduce((s, c) => s + c.plans.find(p=>p.id==='pro')!.priceMonthly, 0) / sampleCompetitors.length;
    return `The average Pro-tier price across all 10 tracked tools is $${avg.toFixed(2)}/mo. Positioning at or just below this anchors you as competitively priced.`;
  }
  if (lower.includes('annual') || lower.includes('discount')) {
    return `Most competitors offer roughly 17% off for annual billing. Slack and Figma lead with the steepest annual incentives to lock in retention.`;
  }
  return `Based on the latest scan of all 10 tools, pricing is clustered between $${cheapest.plans.find(p=>p.id==='pro')!.priceMonthly} and $${dearest.plans.find(p=>p.id==='pro')!.priceMonthly}/mo for Pro tiers. The mid-market ($10–20/mo) is the most crowded — differentiation on feature gating matters more than raw price here.`;
}