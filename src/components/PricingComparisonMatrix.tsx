import { motion } from 'framer-motion';
import FeatureComparisonTable from './FeatureComparisonTable';
import { useCompetitors } from '../hooks/useCompetitors';
import { useComparisonFilters } from '../hooks/useComparisonFilters';
import { formatCurrency, normalizeMonthly } from '../lib/format';
import { cn } from '../lib/utils';

const PLAN_TIERS = ['free', 'pro', 'biz'];
const TIER_NAMES: Record<string, string> = { free: 'Free', pro: 'Pro', biz: 'Business' };

export default function PricingComparisonMatrix() {
  const { competitors } = useCompetitors();
  const { cycle, setCycle, currency, setCurrency } = useComparisonFilters();

  const cheapestByTier: Record<string, number> = {};
  PLAN_TIERS.forEach((tier) => {
    const vals = competitors.map((c) => {
      const p = c.plans.find((x) => x.id === tier);
      if (!p) return Infinity;
      const raw = cycle === 'annual' ? p.priceAnnual : p.priceMonthly;
      return p.priceMonthly === 0 ? Infinity : normalizeMonthly(raw, cycle);
    });
    cheapestByTier[tier] = Math.min(...vals);
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Comparison Matrix</h1>
          <p className="text-sm text-[#8B91A3] mt-1">Plans and pricing side-by-side across competitors.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[#232838] bg-[#0E1016] p-0.5">
            {(['monthly', 'annual'] as const).map((c) => (
              <button key={c} onClick={() => setCycle(c)} className={cn('px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-200', cycle === c ? 'bg-[#6366F1] text-white' : 'text-[#8B91A3] hover:text-white')}>{c}</button>
            ))}
          </div>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200">
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="rounded-xl border border-[#232838] bg-[#12151C] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#232838]">
              <th className="text-left font-medium text-[#8B91A3] px-5 py-3 sticky left-0 bg-[#12151C] min-w-[140px]">Tool</th>
              {PLAN_TIERS.map((t) => <th key={t} className="px-5 py-3 text-center font-medium text-[#8B91A3] min-w-[120px]">{TIER_NAMES[t]}</th>)}
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={c.id} className={cn('border-b border-[#1c2030] hover:bg-[#171B24] transition-colors duration-200', i % 2 ? 'bg-[#0f1218]' : '')}>
                <td className="px-5 py-3 sticky left-0 bg-inherit">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded grid place-items-center text-white text-[11px] font-bold font-display" style={{ background: c.logoColor }}>{c.name[0]}</span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                {PLAN_TIERS.map((tier) => {
                  const p = c.plans.find((x) => x.id === tier);
                  if (!p) return <td key={tier} className="px-5 py-3 text-center text-[#5c6478]">—</td>;
                  const raw = cycle === 'annual' ? p.priceAnnual : p.priceMonthly;
                  const norm = normalizeMonthly(raw, cycle);
                  const isCheapest = p.priceMonthly !== 0 && norm === cheapestByTier[tier];
                  const changed = p.prevPriceMonthly !== undefined && p.prevPriceMonthly !== p.priceMonthly;
                  const inc = changed && p.priceMonthly > (p.prevPriceMonthly ?? 0);
                  return (
                    <td key={tier} className="px-5 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={cn('font-display font-bold', isCheapest && 'text-emerald-400')}>
                          {formatCurrency(norm, currency)}{p.priceMonthly !== 0 && <span className="text-[10px] text-[#8B91A3] font-normal">/mo</span>}
                        </span>
                        {cycle === 'annual' && p.priceMonthly !== 0 && <span className="text-[10px] text-[#5c6478]">billed annual</span>}
                        {changed && <span className={cn('text-[10px] font-semibold', inc ? 'text-rose-400' : 'text-emerald-400')}>{inc ? '↑' : '↓'} from {formatCurrency(p.prevPriceMonthly!, currency)}</span>}
                        {isCheapest && <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-1.5 rounded">Lowest</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <FeatureComparisonTable />
    </div>
  );
}