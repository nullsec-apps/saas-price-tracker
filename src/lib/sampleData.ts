export type BillingCycle = 'monthly' | 'annual';

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  prevPriceMonthly?: number;
  features: string[];
  highlight?: boolean;
}

export interface FeatureGate {
  feature: string;
  category: string;
  byPlan: Record<string, 'yes' | 'no' | 'limited'>;
}

export interface Competitor {
  id: string;
  name: string;
  category: string;
  logoColor: string;
  pricingUrl: string;
  lastChange: string;
  health: 'healthy' | 'stale' | 'error';
  plans: Plan[];
  features: FeatureGate[];
}

export interface PricePoint {
  month: string;
  [competitorId: string]: number | string;
}

export const FEATURE_CATEGORIES = ['Collaboration', 'Security', 'Integrations', 'Analytics', 'Support', 'Admin'];
export const COMPETITOR_CATEGORIES = ['Communication', 'Productivity', 'Design', 'CRM', 'Analytics', 'DevTools'];

function feat(category: string, feature: string, free: 'yes'|'no'|'limited', pro: 'yes'|'no'|'limited', biz: 'yes'|'no'|'limited'): FeatureGate {
  return { feature, category, byPlan: { free, pro, biz } };
}

const standardFeatures: FeatureGate[] = [
  feat('Collaboration', 'Real-time collaboration', 'limited', 'yes', 'yes'),
  feat('Collaboration', 'Unlimited guests', 'no', 'yes', 'yes'),
  feat('Collaboration', 'Shared workspaces', 'limited', 'yes', 'yes'),
  feat('Security', 'SSO / SAML', 'no', 'no', 'yes'),
  feat('Security', 'Two-factor auth', 'yes', 'yes', 'yes'),
  feat('Security', 'SCIM provisioning', 'no', 'no', 'yes'),
  feat('Integrations', 'Third-party integrations', 'limited', 'yes', 'yes'),
  feat('Integrations', 'API access', 'no', 'yes', 'yes'),
  feat('Integrations', 'Webhooks', 'no', 'limited', 'yes'),
  feat('Analytics', 'Usage analytics', 'no', 'limited', 'yes'),
  feat('Analytics', 'Custom reports', 'no', 'no', 'yes'),
  feat('Support', 'Email support', 'yes', 'yes', 'yes'),
  feat('Support', 'Priority support', 'no', 'limited', 'yes'),
  feat('Support', 'Dedicated manager', 'no', 'no', 'yes'),
  feat('Admin', 'Audit logs', 'no', 'no', 'yes'),
  feat('Admin', 'Role-based access', 'no', 'limited', 'yes'),
];

function buildPlans(free: number, pro: number, biz: number, prevPro?: number): Plan[] {
  return [
    { id: 'free', name: 'Free', priceMonthly: free, priceAnnual: free * 12, features: ['Up to 3 members', 'Basic features', 'Community support'] },
    { id: 'pro', name: 'Pro', priceMonthly: pro, priceAnnual: Math.round(pro * 12 * 0.83), prevPriceMonthly: prevPro, features: ['Unlimited members', 'Advanced features', 'API access', 'Priority support'], highlight: true },
    { id: 'biz', name: 'Business', priceMonthly: biz, priceAnnual: Math.round(biz * 12 * 0.83), features: ['Everything in Pro', 'SSO / SAML', 'Audit logs', 'Dedicated manager'] },
  ];
}

export const sampleCompetitors: Competitor[] = [
  { id: 'slack', name: 'Slack', category: 'Communication', logoColor: '#4A154B', pricingUrl: 'https://slack.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), health: 'healthy', plans: buildPlans(0, 8.75, 15, 7.25), features: standardFeatures },
  { id: 'notion', name: 'Notion', category: 'Productivity', logoColor: '#0F0F0F', pricingUrl: 'https://notion.so/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), health: 'healthy', plans: buildPlans(0, 10, 18), features: standardFeatures },
  { id: 'figma', name: 'Figma', category: 'Design', logoColor: '#F24E1E', pricingUrl: 'https://figma.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(), health: 'healthy', plans: buildPlans(0, 16, 45, 15), features: standardFeatures },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', logoColor: '#FF7A59', pricingUrl: 'https://hubspot.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), health: 'healthy', plans: buildPlans(0, 20, 90), features: standardFeatures },
  { id: 'asana', name: 'Asana', category: 'Productivity', logoColor: '#F06A6A', pricingUrl: 'https://asana.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(), health: 'stale', plans: buildPlans(0, 10.99, 24.99), features: standardFeatures },
  { id: 'linear', name: 'Linear', category: 'DevTools', logoColor: '#5E6AD2', pricingUrl: 'https://linear.app/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), health: 'healthy', plans: buildPlans(0, 8, 14), features: standardFeatures },
  { id: 'airtable', name: 'Airtable', category: 'Productivity', logoColor: '#FCB400', pricingUrl: 'https://airtable.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 300).toISOString(), health: 'stale', plans: buildPlans(0, 20, 45), features: standardFeatures },
  { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', logoColor: '#7856FF', pricingUrl: 'https://mixpanel.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(), health: 'healthy', plans: buildPlans(0, 28, 200), features: standardFeatures },
  { id: 'intercom', name: 'Intercom', category: 'Communication', logoColor: '#1F8DED', pricingUrl: 'https://intercom.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), health: 'healthy', plans: buildPlans(0, 39, 99), features: standardFeatures },
  { id: 'github', name: 'GitHub', category: 'DevTools', logoColor: '#24292E', pricingUrl: 'https://github.com/pricing', lastChange: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), health: 'healthy', plans: buildPlans(0, 4, 21), features: standardFeatures },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export const samplePriceHistory: PricePoint[] = MONTHS.map((month, i) => {
  const point: PricePoint = { month };
  sampleCompetitors.forEach((c) => {
    const cur = c.plans.find((p) => p.id === 'pro')!.priceMonthly;
    const prev = c.plans.find((p) => p.id === 'pro')!.prevPriceMonthly ?? cur;
    const t = i / (MONTHS.length - 1);
    const base = prev + (cur - prev) * t;
    const noise = Math.sin(i * 1.3 + c.id.length) * (base * 0.02);
    point[c.id] = Math.round((base + noise) * 100) / 100;
  });
  return point;
});