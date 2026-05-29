import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, ArrowDownRight, Circle } from 'lucide-react';
import CompetitorDetailDrawer from './CompetitorDetailDrawer';
import AddCompetitorDialog from './AddCompetitorDialog';
import { useCompetitors } from '../hooks/useCompetitors';
import { formatCurrency, relativeDate } from '../lib/format';
import { cn } from '../lib/utils';

const healthMap = { healthy: 'text-emerald-400', stale: 'text-amber-400', error: 'text-rose-400' };
const healthLabel = { healthy: 'Healthy', stale: 'Stale', error: 'Error' };

export default function CompetitorGrid() {
  const { competitors, setSelected } = useCompetitors();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Competitors</h1>
          <p className="text-sm text-[#8B91A3] mt-1">{competitors.length} SaaS tools under active monitoring.</p>
        </div>
        <AddCompetitorDialog />
      </motion.div>
      {competitors.length === 0 ? (
        <div className="rounded-xl border border-[#232838] bg-[#12151C] p-12 text-center text-sm text-[#8B91A3]">No competitors yet. Add your first tool to begin monitoring.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((c, i) => {
            const prices = c.plans.filter((p) => p.priceMonthly > 0).map((p) => p.priceMonthly);
            const low = prices.length ? Math.min(...prices) : 0;
            const high = prices.length ? Math.max(...prices) : 0;
            const pro = c.plans.find((p) => p.id === 'pro');
            const changed = pro?.prevPriceMonthly !== undefined && pro.prevPriceMonthly !== pro.priceMonthly;
            const inc = changed && (pro!.priceMonthly > (pro!.prevPriceMonthly ?? 0));
            return (
              <motion.button key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.4 }}
                onClick={() => setSelected(c.id)}
                className="text-left rounded-xl border border-[#232838] bg-[#12151C] p-5 hover:border-[#6366F1]/40 hover:bg-[#171B24] hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center w-10 h-10 rounded-lg font-display font-bold text-white" style={{ background: c.logoColor }}>{c.name[0]}</div>
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-[#8B91A3]">{c.category}</div>
                    </div>
                  </div>
                  <span className={cn('flex items-center gap-1 text-[10px] font-medium', healthMap[c.health])}>
                    <Circle size={7} fill="currentColor" /> {healthLabel[c.health]}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-[#8B91A3] uppercase tracking-wide">Plan range</div>
                    <div className="font-display font-bold mt-0.5">{formatCurrency(low)} – {formatCurrency(high)}<span className="text-xs text-[#8B91A3] font-normal">/mo</span></div>
                  </div>
                  {changed && (
                    <span className={cn('flex items-center gap-0.5 text-[11px] font-semibold', inc ? 'text-rose-400' : 'text-emerald-400')}>
                      {inc ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} Pro changed
                    </span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-[#232838] flex items-center justify-between text-xs text-[#8B91A3]">
                  <span>Changed {relativeDate(c.lastChange)}</span>
                  <span className="flex items-center gap-1 text-[#A5A8FF]"><ExternalLink size={12} /> Source</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
      <CompetitorDetailDrawer />
    </div>
  );
}